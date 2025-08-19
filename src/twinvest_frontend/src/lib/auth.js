// src/lib/auth.js
export const AUTH_STORAGE_KEYS = {
  SELECTED_ROLE: 'selectedRole',
  USER_SESSION: 'userSession',
  AUTH_TOKEN: 'authToken'
};

export const saveUserSession = (userData, role = null) => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEYS.USER_SESSION, JSON.stringify({
      ...userData,
      timestamp: new Date().toISOString()
    }));
    if (role) localStorage.setItem(AUTH_STORAGE_KEYS.SELECTED_ROLE, role);
    return true;
  } catch {
    return false;
  }
};

export const getUserSession = () => {
  try {
    const sessionData = localStorage.getItem(AUTH_STORAGE_KEYS.USER_SESSION);
    return sessionData ? JSON.parse(sessionData) : null;
  } catch {
    return null;
  }
};

export const clearUserSession = () => {
  try {
    Object.values(AUTH_STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    return true;
  } catch {
    return false;
  }
};

export const isAuthenticated = () => {
  const session = getUserSession();
  const role = localStorage.getItem(AUTH_STORAGE_KEYS.SELECTED_ROLE);
  return !!(session && role);
};

export const getUserRole = () => localStorage.getItem(AUTH_STORAGE_KEYS.SELECTED_ROLE);

export const ROLE_ROUTES = {
  sme: { dashboard: '/dashboard/sme', login: '/login/sme', title: 'SME / Freelancer' },
  investor: { dashboard: '/dashboard/investor', login: '/login/investor', title: 'Investor' },
  client: { dashboard: '/dashboard/client', login: '/login/client', title: 'Client / Payer' },
  admin: { dashboard: '/dashboard/admin', login: '/login/admin', title: 'Platform Admin' }
};

export const getRoleConfig = (role) => ROLE_ROUTES[role] || null;

export const authenticateEmail = async ({ email, password, role }) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email && password) {
        const userData = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          role: role || 'sme',
          name: email.split('@')[0],
          authType: 'email'
        };
        saveUserSession(userData, role);
        resolve(userData);
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 1000);
  });

export const authenticatePhone = async ({ phone, otp, role }) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (phone && otp && otp.length === 6) {
        const userData = {
          id: Math.random().toString(36).substr(2, 9),
          phone,
          role: role || 'sme',
          name: `User ${phone.slice(-4)}`,
          authType: 'phone'
        };
        saveUserSession(userData, role);
        resolve(userData);
      } else {
        reject(new Error('Invalid OTP'));
      }
    }, 1000);
  });

export const authenticateWallet = async ({ walletAddress, signature, role }) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (walletAddress) {
        const userData = {
          id: Math.random().toString(36).substr(2, 9),
          walletAddress,
          role: role || 'investor',
          name: `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
          authType: 'wallet'
        };
        saveUserSession(userData, role);
        resolve(userData);
      } else {
        reject(new Error('Wallet connection failed'));
      }
    }, 1500);
  });

export const authenticateSSO = async ({ provider, token, role }) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (provider && token) {
        const userData = {
          id: Math.random().toString(36).substr(2, 9),
          provider,
          role: role || 'client',
          name: `${provider} User`,
          authType: 'sso'
        };
        saveUserSession(userData, role);
        resolve(userData);
      } else {
        reject(new Error('SSO authentication failed'));
      }
    }, 1200);
  });

export const authenticate2FA = async ({ userId, code }) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (code && code.length === 6) resolve({ verified: true });
      else reject(new Error('Invalid 2FA code'));
    }, 800);
  });

export const sendOTP = async (phone) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (phone) resolve({ sent: true, message: `OTP sent to ${phone}` });
      else reject(new Error('Invalid phone number'));
    }, 1000);
  });

export const authenticateTraditional = async ({ email, password, role }) =>
  authenticateEmail({ email, password, role });

export const registerTraditional = async (formData) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (formData.email && formData.password && formData.firstName) {
        const userData = {
          id: Math.random().toString(36).substr(2, 9),
          email: formData.email,
          role: formData.role || 'sme',
          name: `${formData.firstName} ${formData.lastName}`,
          firstName: formData.firstName,
          lastName: formData.lastName,
          authType: 'email'
        };
        saveUserSession(userData, formData.role);
        resolve(userData);
      } else {
        reject(new Error('Missing required fields'));
      }
    }, 1000);
  });