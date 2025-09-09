import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import HashMap "mo:base/HashMap";
import Debug "mo:base/Debug";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import _Error "mo:base/Error";

import Types "./types";
import InvestmentLogic "./investment_logic"; // New import

actor twinvest_backend {

  //
  // Stable layout (must be simple/serializable on moc 0.28.0)
  // Keep fields immutable; overwrite entire `state` when changing.
  //
  public type StableState = {
    investments : [Types.Investment];                                // immutable array stored in stable memory
    user_profiles_entries : [(Principal, Types.UserProfile)];        // entries we persist and use to rebuild HashMap
    invoices_entries : [(Text, Types.Invoice)];                      // entries to rebuild HashMap for invoices
  };

  stable var state : StableState = {
    investments = [];
    user_profiles_entries = [];
    invoices_entries = [];
  };

  //
  // Runtime-only mutable structures (initialized at declaration)
  //
  var user_profiles_map : HashMap.HashMap<Principal, Types.UserProfile> = 
    HashMap.HashMap(0, Principal.equal, Principal.hash);
  var invoices_map : HashMap.HashMap<Text, Types.Invoice> = 
    HashMap.HashMap(0, Text.equal, Text.hash);

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
    invoices_map := HashMap.fromIter(
      Iter.fromArray(state.invoices_entries),
      0,
      Text.equal,
      Text.hash
    );
    // Debug.print("postupgrade: rebuilt user_profiles_map size=" # Nat.toText(user_profiles_map.size()));
    // Debug.print("postupgrade: rebuilt invoices_map size=" # Nat.toText(invoices_map.size()));
  };

  system func preupgrade() {
    // persist runtime map into stable entries (overwrite entire state)
    let user_entries = Iter.toArray(user_profiles_map.entries());
    let invoice_entries = Iter.toArray(invoices_map.entries());
    state := {
      investments = state.investments;
      user_profiles_entries = user_entries;
      invoices_entries = invoice_entries;
    };
    // Debug.print("preupgrade: saved user_profiles_entries count=" # Nat.toText(state.user_profiles_entries.size()));
    // Debug.print("preupgrade: saved invoices_entries count=" # Nat.toText(state.invoices_entries.size()));
  };

  //
  // INVESTMENTS API — when changing investments, overwrite the whole stable `state`
  //
  public shared ({ caller }) func addInvestment(projectId : Nat, amount : Nat) : async Types.ApiResult<Types.Investment> {
    let result = await InvestmentLogic.addInvestmentLogic(caller, projectId, amount, state.investments);
    switch (result) {
      case (#ok(inv)) {
        // Update the state with the new investments array returned from the logic function
        let newInvs = Array.append(state.investments, [inv]);
        state := {
          investments = newInvs;
          user_profiles_entries = state.user_profiles_entries;
          invoices_entries = state.invoices_entries;
        };
        return #ok(inv);
      };
      case (#err(e)) { return #err(e) };
    };
  };

  public query func getInvestments() : async [Types.Investment] {
    state.investments
  };

  //
  // USER / PROFILE API — use runtime HashMap for lookups/puts
  //
  public shared ({ caller }) func registerUser(email: ?Text) : async Types.ApiResult<Types.UserProfile> {
    if (user_profiles_map.get(caller) != null) {
      return #err(#invalid_input("User already registered."));
    };
    let profile : Types.UserProfile = {
      principal = caller;
      role = #client; // Default role upon registration
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
    // Simple RBAC using runtime map
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

  public shared ({ caller = _ }) func set_user_role_by_admin(user_principal: Principal, new_role: Types.Role) : async Types.ApiResult<()> {
    // Only admin can set user roles
    let caller_profile = user_profiles_map.get(caller);
    let is_admin = switch (caller_profile) {
      case (?p) { p.role == #admin };
      case null { false };
    };

    if (not is_admin) {
      return #err(#unauthorized);
    };

    switch (user_profiles_map.get(user_principal)) {
      case (null) { return #err(#not_found("User profile not found.")) };
      case (?profile) {
        let updated_profile : Types.UserProfile = {
          principal = profile.principal;
          role = new_role;
          email = profile.email;
          created_at = profile.created_at;
          kyc_status = profile.kyc_status;
          profile_data = profile.profile_data;
        };
        user_profiles_map.put(user_principal, updated_profile);

        // Update stable state with new user profiles
        state := {
          investments = state.investments;
          user_profiles_entries = Iter.toArray(user_profiles_map.entries());
          invoices_entries = state.invoices_entries;
        };
        return #ok(());
      }
    }
  };

  //
  // INVOICE NFT API
  //

  // Create and mint a new invoice NFT
  public shared ({ caller }) func createInvoice(
    invoice_number: Text,
    amount: Nat,
    due_date: Time.Time,
    description: Text,
    client_info: Types.ClientInfo,
    financing_request: Types.FinancingRequest,
    risk_assessment: ?Types.RiskAssessment,
    metadata_uri: ?Text
  ) : async Types.ApiResult<Types.Invoice> {
    // Generate a unique ID for the invoice
    let invoice_id = Types.generateId("inv", Time.now());

    let new_invoice : Types.Invoice = {
      id = invoice_id;
      owner = caller; // Initial owner is the creator (freelancer)
      freelancer = caller;
      invoice_number = invoice_number;
      amount = amount;
      due_date = due_date;
      created_at = Time.now();
      description = description;
      client_info = client_info;
      financing_request = financing_request;
      status = #draft; // Initial status
      risk_assessment = risk_assessment;
      metadata_uri = metadata_uri;
    };

    invoices_map.put(invoice_id, new_invoice);

    // Update stable state with new invoice
    state := {
      investments = state.investments;
      user_profiles_entries = state.user_profiles_entries;
      invoices_entries = Iter.toArray(invoices_map.entries());
    };

    return #ok(new_invoice);
  };

  // Get invoice details by ID
  public query func getInvoice(invoice_id: Text) : async Types.ApiResult<Types.Invoice> {
    switch (invoices_map.get(invoice_id)) {
      case (null) { return #err(#not_found("Invoice not found.")) };
      case (?invoice) { return #ok(invoice) };
    }
  };

  // Update invoice status
  public shared ({ caller }) func updateInvoiceStatus(invoice_id: Text, new_status: Types.InvoiceStatus) : async Types.ApiResult<Types.Invoice> {
    switch (invoices_map.get(invoice_id)) {
      case (null) { return #err(#not_found("Invoice not found.")) };
      case (?invoice) {
        // Basic authorization: only freelancer or admin can update status
        let caller_profile = user_profiles_map.get(caller);
        let is_authorized = switch (caller_profile) {
          case (?p) { p.principal == invoice.freelancer or p.role == #admin };
          case null { false };
        };

        if (not is_authorized) {
          return #err(#unauthorized);
        };

        let updated_invoice : Types.Invoice = {
          id = invoice.id;
          owner = invoice.owner;
          freelancer = invoice.freelancer;
          invoice_number = invoice.invoice_number;
          amount = invoice.amount;
          due_date = invoice.due_date;
          created_at = invoice.created_at;
          description = invoice.description;
          client_info = invoice.client_info;
          financing_request = invoice.financing_request;
          status = new_status;
          risk_assessment = invoice.risk_assessment;
          metadata_uri = invoice.metadata_uri;
        };
        invoices_map.put(invoice_id, updated_invoice);

        // Update stable state with new invoice status
        state := {
          investments = state.investments;
          user_profiles_entries = state.user_profiles_entries;
          invoices_entries = Iter.toArray(invoices_map.entries());
        };

        return #ok(updated_invoice);
      }
    }
  };

  // Transfer invoice NFT ownership
  public shared ({ caller }) func transferInvoiceOwnership(invoice_id: Text, new_owner: Principal) : async Types.ApiResult<Types.Invoice> {
    switch (invoices_map.get(invoice_id)) {
      case (null) { return #err(#not_found("Invoice not found.")) };
      case (?invoice) {
        // Authorization: Only current owner or admin can transfer
        let caller_profile = user_profiles_map.get(caller);
        let is_authorized = switch (caller_profile) {
          case (?p) { p.principal == invoice.owner or p.role == #admin };
          case null { false };
        };

        if (not is_authorized) {
          return #err(#unauthorized);
        };

        let updated_invoice : Types.Invoice = {
          id = invoice.id;
          owner = new_owner; // Update owner
          freelancer = invoice.freelancer;
          invoice_number = invoice.invoice_number;
          amount = invoice.amount;
          due_date = invoice.due_date;
          created_at = invoice.created_at;
          description = invoice.description;
          client_info = invoice.client_info;
          financing_request = invoice.financing_request;
          status = invoice.status;
          risk_assessment = invoice.risk_assessment;
          metadata_uri = invoice.metadata_uri;
        };
        invoices_map.put(invoice_id, updated_invoice);

        // Update stable state with new invoice owner
        state := {
          investments = state.investments;
          user_profiles_entries = state.user_profiles_entries;
          invoices_entries = Iter.toArray(invoices_map.entries());
        };

        return #ok(updated_invoice);
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
      invoices_entries = Iter.toArray(invoices_map.entries());
    };
    return #ok(());
  };

  //
  // Sanity check
  //
  public query func sanityCheck() : async Text {
    let users = user_profiles_map.size();
    let invs = state.investments.size();
    let num_invoices = invoices_map.size();
    "sanity: users=" # Nat.toText(users) # " investments=" # Nat.toText(invs) # " invoices=" # Nat.toText(num_invoices)
  };
}