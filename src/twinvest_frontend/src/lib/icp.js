import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as twinvest_backend_idl, canisterId as twinvest_backend_id } from "declarations/twinvest_backend";

const agent = new HttpAgent({ host: "http://127.0.0.1:4943" });

// Only fetch the root key when running locally. Production environments will not need this.
if (process.env.DFX_NETWORK === "local") {
  agent.fetchRootKey();
}

export const twinvest_backend = Actor.createActor(twinvest_backend_idl, {
  agent,
  canisterId: twinvest_backend_id,
});

// Existing mock functions (keep them for now if they are used elsewhere)
export const loginWithII = async () => ({ actor: { get_my_role: async () => [], set_my_role: async () => true } });
export const loginWithPlug = async () => ({ actor: { get_my_role: async () => [], set_my_role: async () => true } });
export const checkAuthentication = async () => true;
export const roleVariant = (role) => role.toUpperCase();
export const routeByRole = (role) => navigate(`/dashboard/${role.toLowerCase()}`);
export const getRoleKey = (role) => {
  if (typeof role === 'object' && role !== null) {
    const key = Object.keys(role)[0];
    return key.toLowerCase();
  }
  return String(role).toLowerCase();
};
