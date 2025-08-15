// canisters/role_registry/main.mo
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";

shared ({ caller }) actor class RoleRegistry(initOwner : ?Principal) = this {
  public type Role = { #SME; #Investor; #Client; #Admin };

  stable var owner : Principal = switch (initOwner) { case (?p) p; case (null) caller };

  var roles = HashMap.HashMap<Principal, Role>(16, Principal.equal, Principal.hash);
  stable var rolesEntries : [(Principal, Role)] = [];

  public shared ({ caller }) func whoami() : async Principal { caller };

  public shared ({ caller }) func get_my_role() : async ?Role {
    roles.get(caller)
  };

  public shared ({ caller }) func set_my_role(role : Role) : async Bool {
    switch (roles.get(caller)) {
      case (null) { roles.put(caller, role); true };
      case (?_) { false };
    }
  };

  public shared ({ caller }) func set_role_for(user : Principal, role : Role) : async Bool {
    if (caller != owner) return false;
    roles.put(user, role);
    true
  };

  public query func get_role_of(user : Principal) : async ?Role {
    roles.get(user)
  };

  public shared ({ caller }) func change_owner(newOwner : Principal) : async Bool {
    if (caller != owner) return false;
    owner := newOwner;
    true
  };

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