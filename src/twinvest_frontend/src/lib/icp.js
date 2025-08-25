// src/lib/icp.js
import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory, canisterId as roleRegistryCanisterId } from '../../../declarations/role_registry';

const isDev = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
const IC_HOST = isDev ? 'http://127.0.0.1:4943' : 'https://icp0.io';

// Cache for auth client to avoid recreating
let authClientInstance = null;

async function createAgentAndActor(identity) {
  const agent = new HttpAgent({ identity, host: IC_HOST });
  if (isDev) { 
    try { 
      await agent.fetchRootKey(); 
    } catch (error) {
      console.warn('Failed to fetch root key:', error);
    }
  }
  const actor = Actor.createActor(idlFactory, { agent, canisterId: roleRegistryCanisterId });
  return { agent, actor };
}

export async function getAuthClient() {
  if (!authClientInstance) {
    authClientInstance = await AuthClient.create({
      idleOptions: { 
        disableIdle: true, 
        disableDefaultIdleCallback: true 
      },
    });
  }
  return authClientInstance;
}

export async function loginWithII() {
  const authClient = await getAuthClient();

  return new Promise((resolve, reject) => {
    const loginOptions = {
      // Use appropriate Identity Provider based on environment
      identityProvider: isDev
        ? `http://127.0.0.1:4943/?canisterId=${import.meta.env.VITE_II_CANISTER_ID || 'rdmx6-jaaaa-aaaah-qdrva-cai'}`
        : 'https://identity.ic0.app',
      maxTimeToLive: 7n * 24n * 60n * 60n * 1_000_000_000n, // 7 days
      onSuccess: async () => {
        try {
          const identity = authClient.getIdentity();
          const { agent, actor } = await createAgentAndActor(identity);
          resolve({ authClient, identity, agent, actor });
        } catch (error) {
          reject(error);
        }
      },
      onError: (error) => {
        console.error('Internet Identity login error:', error);
        reject(new Error('Internet Identity authentication failed'));
      },
    };

    authClient.login(loginOptions);
  });
}

export async function loginWithNFID() {
  const authClient = await getAuthClient();

  return new Promise((resolve, reject) => {
    authClient.login({
      identityProvider: 'https://nfid.one/authenticate?applicationName=Twinvest',
      maxTimeToLive: 7n * 24n * 60n * 60n * 1_000_000_000n,
      onSuccess: async () => {
        try {
          const identity = authClient.getIdentity();
          const { agent, actor } = await createAgentAndActor(identity);
          resolve({ authClient, identity, agent, actor });
        } catch (error) {
          reject(error);
        }
      },
      onError: (error) => {
        console.error('NFID login error:', error);
        reject(new Error('NFID authentication failed'));
      },
    });
  });
}

export async function loginWithPlug() {
  if (!window.ic?.plug) {
    throw new Error('Plug wallet not detected. Please install Plug wallet extension.');
  }

  try {
    const isConnected = await window.ic.plug.isConnected();
    
    if (!isConnected) {
      const whitelist = [roleRegistryCanisterId];
      const connected = await window.ic.plug.requestConnect({ 
        whitelist, 
        host: IC_HOST 
      });
      
      if (!connected) {
        throw new Error('User rejected connection');
      }
    }

    await window.ic.plug.createAgent({ 
      whitelist: [roleRegistryCanisterId], 
      host: IC_HOST 
    });

    const actor = await window.ic.plug.createActor({ 
      canisterId: roleRegistryCanisterId, 
      interfaceFactory: idlFactory 
    });

    return { actor };
  } catch (error) {
    console.error('Plug wallet connection error:', error);
    throw new Error(`Plug wallet connection failed: ${error.message}`);
  }
}

export async function checkAuthentication() {
  try {
    const client = await getAuthClient();
    return client.isAuthenticated();
  } catch (error) {
    console.error('Authentication check failed:', error);
    return false;
  }
}

export async function getCurrentActor() {
  try {
    const client = await getAuthClient();
    const isAuthenticated = client.isAuthenticated();
    
    if (!isAuthenticated) {
      return null;
    }

    const identity = client.getIdentity();
    const { actor } = await createAgentAndActor(identity);
    return actor;
  } catch (error) {
    console.error('Failed to get current actor:', error);
    return null;
  }
}

export const roleVariant = (key) => {
  const roleMap = {
    'sme': { SME: null },
    'investor': { Investor: null },
    'client': { Client: null },
    'admin': { Admin: null }
  };
  
  return roleMap[key] || { Investor: null };
};

export const getRoleKey = (variant) => {
  if (!variant || typeof variant === 'string') {
    return variant || null;
  }
  
  const roleKeyMap = {
    'SME': 'sme',
    'Investor': 'investor',
    'Client': 'client',
    'Admin': 'admin'
  };
  
  for (const [key, value] of Object.entries(roleKeyMap)) {
    if (key in variant) {
      return value;
    }
  }
  
  return null;
};

export const routeByRole = (role, navigate) => {
  const key = typeof role === 'string' ? role : getRoleKey(role);
  
  if (key && ['sme', 'investor', 'client', 'admin'].includes(key)) {
    navigate(`/dashboard/${key}`);
    return true;
  }
  
  console.warn('Invalid role for routing:', role);
  return false;
};

export async function logoutII() {
  try {
    const client = await getAuthClient();
    await client.logout();
    authClientInstance = null; // Clear cached instance
    
    // Clear local storage
    localStorage.removeItem('selectedRole');
    localStorage.removeItem('userSession');
    localStorage.removeItem('authToken');
    
    return true;
  } catch (error) {
    console.error('Logout failed:', error);
    return false;
  }
}

export async function getUserPrincipal() {
  try {
    const client = await getAuthClient();
    const identity = client.getIdentity();
    return identity.getPrincipal().toString();
  } catch (error) {
    console.error('Failed to get user principal:', error);
    return null;
  }
}

// Helper function to handle role-based redirects after authentication
export async function handlePostAuthRedirect(actor, navigate, preferredRole = null) {
  try {
    const roleOpt = await actor.get_my_role();
    
    if (roleOpt && roleOpt.length > 0) {
      // User has an existing role
      const existingRoleKey = getRoleKey(roleOpt[0]);
      
      if (preferredRole && preferredRole !== existingRoleKey) {
        // User wants a different role than what they have
        console.log(`User has role ${existingRoleKey} but prefers ${preferredRole}`);
        // For investor login specifically, always go to investor dashboard
        if (preferredRole === 'investor') {
          routeByRole('investor', navigate);
          return 'investor';
        }
      }
      
      routeByRole(existingRoleKey, navigate);
      return existingRoleKey;
    } else {
      // New user - set preferred role or default to investor
      const newRole = preferredRole || 'investor';
      await actor.set_my_role(roleVariant(newRole));
      routeByRole(newRole, navigate);
      return newRole;
    }
  } catch (error) {
    console.error('Post-auth redirect failed:', error);
    // Fallback to preferred role or investor
    const fallbackRole = preferredRole || 'investor';
    routeByRole(fallbackRole, navigate);
    return fallbackRole;
  }
}