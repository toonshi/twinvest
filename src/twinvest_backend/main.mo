import Principal "mo:base/Principal";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Debug "mo:base/Debug";
import Error "mo:base/Error";

// Import shared types
import Types "./types";

actor TwinvestBackend {

  // === STATE ===

  // Remote role registry canister alias — let dfx replace this at deploy time.
  private let role_registry : actor {
    get_user_role : (Principal) -> async ?Types.Role;
    register_user : (Principal, Types.Role) -> async ();
  } = actor "role_registry";

  // Local storage for user profiles, keyed by Principal.
  private var user_profiles =
    HashMap.HashMap<Principal, Types.UserProfile>(0, Principal.equal, Principal.hash);

  // === HELPER (synchronous, safe for queries) ===

  // Return a plain ApiResult (no async/await here). Query bodies must return plain T.
  private func get_user_profile(p: Principal) : Types.ApiResult<Types.UserProfile> {
    switch (user_profiles.get(p)) {
      case (null) { #err(#not_found("User profile not found.")) };
      case (?profile) { #ok(profile) };
    }
  };

  // === PUBLIC API - UPDATES (may await) ===

  // Register a new user with a specific role. Update function may await.
  public shared ({ caller }) func register(role: Types.Role) : async Types.ApiResult<()> {
    switch (user_profiles.get(caller)) {
      case (?_) { return #err(#invalid_input("User already registered.")) };
      case (null) {
        // Inter-canister call must be in an update function
        try {
          await role_registry.register_user(caller, role);
        } catch (err) {
          Debug.print("⚠️ register: role_registry RPC failed: " # Error.message(err));
          // Decide: fail registration if registry unavailable, or continue.
          // Here we fail safely so caller knows registration didn't finish.
          return #err(#invalid_input("Failed to register role; try again later."));
        };

        let new_profile : Types.UserProfile = {
          principal = caller;
          role = role;
          email = null;
          created_at = Time.now();
          kyc_status = #pending;
          profile_data = null;
        };

        user_profiles.put(caller, new_profile);
        return #ok(());
      }
    }
  };

  // Update the current user's profile data.
  public shared ({ caller }) func updateMyProfile(data: Types.ProfileData) : async Types.ApiResult<()> {
    switch (user_profiles.get(caller)) {
      case (null) { return #err(#not_found("User profile not found.")) };
      case (?profile) {
        let updated_profile : Types.UserProfile = {
          principal = profile.principal;
          role = profile.role;
          email = profile.email;
          created_at = profile.created_at;
          kyc_status = profile.kyc_status;
          profile_data = ?data;
        };
        user_profiles.put(caller, updated_profile);
        return #ok(());
      }
    }
  };

  // Allow a user to submit their KYC for review.
  public shared ({ caller }) func submitKycApplication() : async Types.ApiResult<()> {
    switch (user_profiles.get(caller)) {
      case (null) { return #err(#not_found("User profile not found.")) };
      case (?profile) {
        let updated_profile : Types.UserProfile = {
          principal = profile.principal;
          role = profile.role;
          email = profile.email;
          created_at = profile.created_at;
          kyc_status = #in_review;
          profile_data = profile.profile_data;
        };
        user_profiles.put(caller, updated_profile);
        return #ok(());
      }
    }
  };

  // Allow an admin to update a user's KYC status.
  // This must be an update function because we need to await the remote role_registry.
  public shared ({ caller }) func updateKycStatus(user: Principal, status: Types.KYCStatus) : async Types.ApiResult<()> {
    // Check admin role via role_registry (inter-canister call).
    // Wrap in try/catch so we don't trap when role_registry is unavailable.
    var is_caller_admin : Bool = false;
    try {
      let role_opt = await role_registry.get_user_role(caller);
      is_caller_admin := (role_opt == ?#admin);
    } catch (err) {
      Debug.print("⚠️ updateKycStatus: role_registry unreachable: " # Error.message(err));
      // If registry is down, treat caller as non-admin (fail safe)
      is_caller_admin := false;
    };

    if (not is_caller_admin) {
      return #err(#unauthorized);
    };

    switch (user_profiles.get(user)) {
      case (null) { return #err(#not_found("User to update not found.")) };
      case (?profile) {
        let updated_profile : Types.UserProfile = {
          principal = profile.principal;
          role = profile.role;
          email = profile.email;
          created_at = profile.created_at;
          kyc_status = status;
          profile_data = profile.profile_data;
        };
        user_profiles.put(user, updated_profile);
        return #ok(());
      }
    }
  };

  // === PUBLIC API - QUERIES (no await inside bodies) ===

  // Get the profile of the caller.
  // Note: this is a query; signature is `: async T` but body must be plain T.
  public query ({ caller }) func getMyProfile() : async Types.ApiResult<Types.UserProfile> {
    get_user_profile(caller) // plain return value; compiler lifts to async
  };

  // Get the profile of any user.
  public query func getProfile(id: Principal) : async Types.ApiResult<Types.UserProfile> {
    get_user_profile(id)
  };

}