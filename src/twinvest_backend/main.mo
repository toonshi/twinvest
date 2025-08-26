import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import HashMap "mo:base/HashMap";
import Debug "mo:base/Debug";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Error "mo:base/Error";

import Types "./types";

actor twinvest_backend {

  //
  // Stable layout (must be simple/serializable on moc 0.28.0)
  // Keep fields immutable; overwrite entire `state` when changing.
  //
  public type StableState = {
    investments : [Types.Investment];                                // immutable array stored in stable memory
    user_profiles_entries : [(Principal, Types.UserProfile)];        // entries we persist and use to rebuild HashMap
  };

  stable var state : StableState = {
    investments = [];
    user_profiles_entries = [];
  };

  //
  // Runtime-only mutable structures (initialized at declaration)
  //
  var user_profiles_map : HashMap.HashMap<Principal, Types.UserProfile> = 
    HashMap.HashMap(0, Principal.equal, Principal.hash);

  //
  // LIFECYCLE: rebuild runtime structures after upgrade, and persist them before upgrade
  //
  system func postupgrade() {
    // rebuild runtime HashMap from the persisted entries
    user_profiles_map := HashMap.fromIter(
      Iter.fromArray(state.user_profiles_entries),
      0,
      Principal.equal,
      Principal.hash
    );
    Debug.print("postupgrade: rebuilt user_profiles_map size=" # Nat.toText(user_profiles_map.size()));
  };

  system func preupgrade() {
    // persist runtime map into stable entries (overwrite entire state)
    let entries = Iter.toArray(user_profiles_map.entries());
    state := {
      investments = state.investments;
      user_profiles_entries = entries;
    };
    Debug.print("preupgrade: saved user_profiles_entries count=" # Nat.toText(state.user_profiles_entries.size()));
  };

  //
  // INVESTMENTS API — when changing investments, overwrite the whole stable `state`
  //
  public shared ({ caller }) func addInvestment(projectId : Nat, amount : Nat) : async Types.ApiResult<Types.Investment> {
    // id is just the current length (simple)
    let id : Nat = state.investments.size();
    // build the investment record (assumes Types.Investment shape matches)
    let inv : Types.Investment = {
      id = Nat.toText(id);
      projectId = projectId;
      investor = caller;
      amount_invested = amount;
      investment_date = Time.now();
      expected_return = 0; // Placeholder
      maturity_date = Time.now(); // Placeholder
      status = #active; // Placeholder
      risk_rating = #low; // Placeholder
      invoice_id = ""; // Placeholder
    };

    // create a new investments array and overwrite state (moc 0.28.0 friendly)
    let newInvs = Array.append(state.investments, [inv]);
    state := {
      investments = newInvs;
      user_profiles_entries = state.user_profiles_entries;
    };

    return #ok(inv);
  };

  public query func getInvestments() : async [Types.Investment] {
    state.investments
  };

  //
  // USER / PROFILE API — use runtime HashMap for lookups/puts
  //
  public shared ({ caller }) func registerUser(role: Types.Role, email: ?Text) : async Types.ApiResult<Types.UserProfile> {
    if (user_profiles_map.get(caller) != null) {
      return #err(#invalid_input("User already registered."));
    };
    let profile : Types.UserProfile = {
      principal = caller;
      role = role;
      email = email;
      created_at = Time.now();
      kyc_status = #pending;
      profile_data = null;
    };
    user_profiles_map.put(caller, profile);
    return #ok(profile);
  };

  public query func getUserProfile(user_principal: Principal) : async Types.ApiResult<Types.UserProfile> {
    switch (user_profiles_map.get(user_principal)) {
      case (null) { return #err(#not_found("User profile not found.")) };
      case (?p) { return #ok(p) };
    }
  };

  public shared ({ caller }) func updateUserProfile(updated_profile_data: Types.ProfileData) : async Types.ApiResult<Types.UserProfile> {
    switch (user_profiles_map.get(caller)) {
      case (null) { return #err(#not_found("User profile not found.")) };
      case (?profile) {
        let updated_profile : Types.UserProfile = {
          principal = profile.principal;
          role = profile.role;
          email = profile.email;
          created_at = profile.created_at;
          kyc_status = profile.kyc_status;
          profile_data = ?updated_profile_data;
        };
        user_profiles_map.put(caller, updated_profile);
        return #ok(updated_profile);
      }
    }
  };

  public shared ({ caller }) func submitKycApplication() : async Types.ApiResult<()> {
    switch (user_profiles_map.get(caller)) {
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
        user_profiles_map.put(caller, updated_profile);
        return #ok(());
      }
    }
  };

  public shared ({ caller }) func updateKycStatus(user: Principal, status: Types.KYCStatus) : async Types.ApiResult<()> {
    // Simple RBAC using runtime map (change to inter-canister check if you prefer)
    let callerRole : ?Types.Role = switch (user_profiles_map.get(caller)) {
      case (?p) { ?p.role };
      case null { null };
    };
    if (callerRole != ?#admin) {
      return #err(#unauthorized);
    };
    switch (user_profiles_map.get(user)) {
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
        user_profiles_map.put(user, updated_profile);
        return #ok(());
      }
    }
  };

  //
  // Helper to flush runtime HashMap into stable state on demand (also done in preupgrade)
  //
  public shared ({ caller }) func flushRuntimeToStable() : async Types.ApiResult<()> {
    // Overwrite entire state (moc 0.28.0 requirement)
    state := {
      investments = state.investments;
      user_profiles_entries = Iter.toArray(user_profiles_map.entries());
    };
    return #ok(());
  };

  //
  // Sanity check
  //
  public query func sanityCheck() : async Text {
    let users = user_profiles_map.size();
    let invs = state.investments.size();
    "sanity: users=" # Nat.toText(users) # " investments=" # Nat.toText(invs)
  };
}