import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Array "mo:base/Array";

// Import shared types from the main backend canister
import Types "../twinvest_backend/types";

actor RoleRegistry {

    // === STATE ===

    // Non-stable storage for user roles, keyed by Principal.
    private var user_roles = HashMap.HashMap<Principal, Types.Role>(0, Principal.equal, Principal.hash);
    // Stable storage for persisting roles across upgrades.
    private stable var roles_entries : [(Principal, Types.Role)] = [];

    // === PUBLIC API - ROLE MANAGEMENT ===

    /**
    * Registers a role for a given user principal.
    * In a production environment, you might want to restrict the caller of this function.
    */
    public func register_user(user: Principal, role: Types.Role) : async () {
        user_roles.put(user, role);
    };

    /**
    * Retrieves the role for a given user principal.
    */
    public query func get_user_role(user: Principal) : async ?Types.Role {
        return user_roles.get(user);
    };

    /**
    * Retrieves all user principals that have a specific role.
    */
    public query func get_all_users_by_role(role: Types.Role) : async [Principal] {
        var users_with_role : [Principal] = [];
        for ((p, r) in user_roles.entries()) {
            if (r == role) {
                users_with_role := Array.append(users_with_role, [p]);
            };
        };
        return users_with_role;
    };

    // === CANISTER UPGRADES ===

    system func preupgrade() {
        // Serialize the HashMap into the stable array before the upgrade.
        roles_entries := Iter.toArray(user_roles.entries());
    };

    system func postupgrade() {
        // Deserialize from the stable array back into the HashMap after the upgrade.
        user_roles := HashMap.fromIter(Iter.fromArray(roles_entries), 0, Principal.equal, Principal.hash);
    };
}