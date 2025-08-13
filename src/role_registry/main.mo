import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";

shared ({ caller }) actor class RoleRegistry(initOwner : ?Principal) = this {
  public type Role = { #SME; #Investor; #Client; #Admin };

  stable var owner : Principal = switch (initOwner) { case (?p) p; case (null) caller };

  // Not stable by itself; persisted via preupgrade/postupgrade
  var roles = HashMap.HashMap<Principal, Role>(16, Principal.equal, Principal.hash);
  stable var rolesEntries : [(Principal, Role)] = [];

  public shared ({ caller }) func whoami() : async Principal { caller };

  public shared ({ caller }) func get_my_role() : async ?Role {
    roles.get(caller)
  };

  // Users can set their role once. Returns true if set, false if already set.
  public shared ({ caller }) func set_my_role(role : Role) : async Bool {
    switch (roles.get(caller)) {
      case (null) { roles.put(caller, role); true };
      case (?_) { false };
    }
  };

  // Admin-only: set/override any user's role
  public shared ({ caller }) func set_role_for(user : Principal, role : Role) : async Bool {
    if (caller != owner) return false;
    roles.put(user, role);
    true
  };

  // Read a user's role (query)
  public query func get_role_of(user : Principal) : async ?Role {
    roles.get(user)
  };

  // Transfer ownership (admin-only)
  public shared ({ caller }) func change_owner(newOwner : Principal) : async Bool {
    if (caller != owner) return false;
    owner := newOwner;
    true
  };

  // Persist HashMap across upgrades
  system func preupgrade() {
    rolesEntries := Iter.toArray(roles.entries());
  };

  system func postupgrade() {
    roles := HashMap.fromIter<Principal, Role>(
      rolesEntries.vals(),
      16,
      Principal.equal,
      Principal.hash
    );
  };
}