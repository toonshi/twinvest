// src/lib/icp.js
import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent } from '@dfinity/agent';

// Adjust path to match: twinvest/src/declarations/role_registry
import { idlFactory, canisterId as roleRegistryCanisterId } from '../../../declarations/role_registry';

const isDev = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
const IC_HOST = isDev ? 'http://127.0.0.1:4943' : 'https://icp0.io';

export async function loginWithII() {
  const authClient = await AuthClient.create({
    idleOptions: { disableIdle: true, disableDefaultIdleCallback: true },
  });

  await new Promise((resolve, reject) => {
    authClient.login({
      identityProvider: isDev
        ? `http://127.0.0.1:4943/?canisterId=${import.meta.env.VITE_II_CANISTER_ID || 'rdmx6-jaaaa-aaaah-qdrva-cai'}`
        : 'https://identity.ic0.app',
      // 7 days
      maxTimeToLive: 7n * 24n * 60n * 60n * 1_000_000_000n,
      onSuccess: resolve,
      onError: reject,
    });
  });

  const identity = authClient.getIdentity();
  const agent = new HttpAgent({ identity, host: IC_HOST });
  if (isDev) {
    try { await agent.fetchRootKey(); } catch {}
  }

  const actor = Actor.createActor(idlFactory, { agent, canisterId: roleRegistryCanisterId });
  return { authClient, identity, agent, actor };
}

export async function checkAuthentication() {
  const client = await AuthClient.create();
  return client.isAuthenticated();
}

export const roleVariant = (key) => {
  switch (key) {
    case 'sme': return { SME: null };
    case 'investor': return { Investor: null };
    case 'client': return { Client: null };
    case 'admin': return { Admin: null };
    default: return { Investor: null };
  }
};

export const getRoleKey = (v) => {
  if (!v || typeof v === 'string') return v || null;
  if ('SME' in v) return 'sme';
  if ('Investor' in v) return 'investor';
  if ('Client' in v) return 'client';
  if ('Admin' in v) return 'admin';
  return null;
};

export const routeByRole = (role, navigate) => {
  const key = getRoleKey(role);
  if (key) navigate(`/dashboard/${key}`);
};

export async function logoutII() {
  const client = await AuthClient.create();
  await client.logout();
}