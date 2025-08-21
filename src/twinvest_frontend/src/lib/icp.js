// src/lib/icp.js
import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory, canisterId as roleRegistryCanisterId } from '../../../declarations/role_registry';

const isDev = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
const IC_HOST = isDev ? 'http://127.0.0.1:4943' : 'https://icp0.io';

async function createAgentAndActor(identity) {
  const agent = new HttpAgent({ identity, host: IC_HOST });
  if (isDev) { try { await agent.fetchRootKey(); } catch {} }
  const actor = Actor.createActor(idlFactory, { agent, canisterId: roleRegistryCanisterId });
  return { agent, actor };
}

export async function loginWithII() {
  const authClient = await AuthClient.create({
    idleOptions: { disableIdle: true, disableDefaultIdleCallback: true },
  });

  await new Promise((resolve, reject) => {
    authClient.login({
      // Updated to use Internet Identity 2.0 URL as per documentation
      identityProvider: isDev
        ? `http://127.0.0.1:4943/?canisterId=${import.meta.env.VITE_II_CANISTER_ID || 'rdmx6-jaaaa-aaaah-qdrva-cai'}`
        : 'https://id.ai/',
      maxTimeToLive: 7n * 24n * 60n * 60n * 1_000_000_000n,
      onSuccess: resolve,
      onError: reject,
    });
  });

  const identity = authClient.getIdentity();
  const { agent, actor } = await createAgentAndActor(identity);
  return { authClient, identity, agent, actor };
}

export async function loginWithNFID() {
  const authClient = await AuthClient.create({
    idleOptions: { disableIdle: true, disableDefaultIdleCallback: true },
  });

  await new Promise((resolve, reject) => {
    authClient.login({
      identityProvider: 'https://nfid.one/authenticate?applicationName=Twinvest',
      maxTimeToLive: 7n * 24n * 60n * 60n * 1_000_000_000n,
      onSuccess: resolve,
      onError: reject,
    });
  });

  const identity = authClient.getIdentity();
  const { agent, actor } = await createAgentAndActor(identity);
  return { authClient, identity, agent, actor };
}

export async function loginWithPlug() {
  if (!window.ic?.plug) throw new Error('Plug wallet not detected');
  await window.ic.plug.requestConnect({ whitelist: [roleRegistryCanisterId], host: IC_HOST });
  await window.ic.plug.createAgent({ whitelist: [roleRegistryCanisterId], host: IC_HOST });
  const actor = await window.ic.plug.createActor({ canisterId: roleRegistryCanisterId, interfaceFactory: idlFactory });
  return { actor };
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