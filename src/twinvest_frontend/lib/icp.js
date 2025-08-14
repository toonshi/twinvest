export const loginWithII = async () => ({ actor: { get_my_role: async () => [], set_my_role: async () => true } });
export const checkAuthentication = async () => true;
export const roleVariant = (role) => role.toUpperCase();
export const routeByRole = (role, navigate) => navigate(`/dashboard/${role.toLowerCase()}`);
