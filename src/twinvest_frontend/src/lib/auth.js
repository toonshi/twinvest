// src/lib/auth.js
export const AUTH_STORAGE_KEYS = {
  SELECTED_ROLE: 'selectedRole',
  USER_SESSION: 'userSession',
  AUTH_TOKEN: 'authToken'
};

export const saveUserSession = (userData, role = null) => {
  try {
    const sessionData = {
      ...userData,
      timestamp: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };
    
    localStorage.setItem(AUTH_STORAGE_KEYS.USER_SESSION, JSON.stringify(sessionData));
    
    if (role) {
      localStorage.setItem(AUTH_STORAGE_KEYS.SELECTED_ROLE, role);
    }
    
    console.log('User session saved:', { role, authType: userData.authType });
    return true;
  } catch (error) {
    console.error('Failed to save user session:', error);
    return false;
  }
};

export const getUserSession = () => {
  try {
    const sessionData = localStorage.getItem(AUTH_STORAGE_KEYS.USER_SESSION);
    if (!sessionData) return null;
    
    const parsed = JSON.parse(sessionData);
    
    // Check if session is still valid (optional: add expiration logic)
    const sessionAge = new Date() - new Date(parsed.timestamp);
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    
    if (sessionAge > maxAge) {
      clearUserSession();
      return null;
    }
    
    return parsed;
  } catch (error) {
    console.error('Failed to get user session:', error);
    return null;
  }
};

export const clearUserSession = () => {
  try {
    Object.values(AUTH_STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    console.log('User session cleared');
    return true;
  } catch (error) {
    console.error('Failed to clear user session:', error);
    return false;
  }
};

export const updateLastActivity = () => {
  try {
    const session = getUserSession();
    if (session) {
      session.lastActivity = new Date().toISOString();
      localStorage.setItem(AUTH_STORAGE_KEYS.USER_SESSION, JSON.stringify(session));
    }
  } catch (error) {
    console.error('Failed to update last activity:', error);
  }
};

export const isAuthenticated = () => {
  const session = getUserSession();
  const role = localStorage.getItem(AUTH_STORAGE_KEYS.SELECTED_ROLE);
  return !!(session && role);
};

export const getUserRole = () => {
  return localStorage.getItem(AUTH_STORAGE_KEYS.SELECTED_ROLE);
};

export const ROLE_ROUTES = {
  sme: { 
    dashboard: '/dashboard/sme', 
    login: '/login/sme', 
    title: 'SME / Freelancer',
    description: 'Upload invoices, tokenize as NFTs, and access immediate funding'
  },
  investor: { 
    dashboard: '/dashboard/investor', 
    login: '/login/investor', 
    title: 'Investor',
    description: 'Browse and invest in tokenized invoice NFTs for returns'
  },
  client: { 
    dashboard: '/dashboard/client', 
    login: '/login/client', 
    title: 'Client / Payer',
    description: 'Manage and pay outstanding invoices efficiently'
  },
  admin: { 
    dashboard: '/dashboard/admin', 
    login: '/login/admin', 
    title: 'Platform Admin',
    description: 'Oversee platform operations and user management'
  }
};

export const getRoleConfig = (role) => {
  return ROLE_ROUTES[role] || null;
};

// Enhanced authentication functions with better error handling
export const authenticateEmail = async ({ email, password, role }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!email || !password) {
        reject(new Error('Email and password are required'));
        return;
      }
      
      if (email && password.length >= 6) {
        const userData = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          role: role || 'sme',
          name: email.split('@')[0],
          authType: 'email',
          verified: true
        };
        saveUserSession(userData, role);
        resolve(userData);
      } else {
        reject(new Error('Invalid credentials or password too short'));
      }
    }, 1000);
  });
};

export const authenticatePhone = async ({ phone, otp, role }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!phone || !otp) {
        reject(new Error('Phone number and OTP are required'));
        return;
      }
      
      if (phone && otp && otp.length === 6) {
        const userData = {
          id: Math.random().toString(36).substr(2, 9),
          phone,
          role: role || 'sme',
          name: `User ${phone.slice(-4)}`,
          authType: 'phone',
          verified: true
        };
        saveUserSession(userData, role);
        resolve(userData);
      } else {
        reject(new Error('Invalid OTP format'));
      }
    }, 1000);
  });
};

export const authenticateWallet = async ({ walletAddress, signature, role }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!walletAddress) {
        reject(new Error('Wallet address is required'));
        return;
      }
      
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        walletAddress,
        role: role || 'investor',
        name: `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
        authType: 'wallet',
        verified: true
      };
      saveUserSession(userData, role);
      resolve(userData);
    }, 1500);
  });
};

export const authenticateSSO = async ({ provider, token, role }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!provider || !token) {
        reject(new Error('Provider and token are required'));
        return;
      }
      
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        provider,
        role: role || 'client',
        name: `${provider} User`,
        authType: 'sso',
        verified: true
      };
      saveUserSession(userData, role);
      resolve(userData);
    }, 1200);
  });
};

export const authenticate2FA = async ({ userId, code }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!code || code.length !== 6) {
        reject(new Error('Invalid 2FA code format'));
        return;
      }
      
      // Simulate 2FA validation
      if (code === '123456' || /^\d{6}$/.test(code)) {
        resolve({ verified: true });
      } else {
        reject(new Error('Invalid 2FA code'));
      }
    }, 800);
  });
};

export const sendOTP = async (phone) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!phone || phone.length < 10) {
        reject(new Error('Invalid phone number'));
        return;
      }
      
      resolve({ 
        sent: true, 
        message: `OTP sent to ${phone}`,
        expires: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
      });
    }, 1000);
  });
};

// Convenience functions
export const authenticateTraditional = async ({ email, password, role }) => {
  return authenticateEmail({ email, password, role });
};

export const registerTraditional = async (formData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const { email, password, firstName, lastName, role } = formData;
      
      if (!email || !password || !firstName) {
        reject(new Error('Missing required fields: email, password, and firstName are required'));
        return;
      }
      
      if (password.length < 6) {
        reject(new Error('Password must be at least 6 characters long'));
        return;
      }
      
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        role: role || 'sme',
        name: `${firstName} ${lastName || ''}`.trim(),
        firstName,
        lastName: lastName || '',
        authType: 'email',
        verified: false,
        created: new Date().toISOString()
      };
      
      saveUserSession(userData, role);
      resolve(userData);
    }, 1000);
  });
};

// Session management helpers
export const refreshSession = async () => {
  const session = getUserSession();
  if (session) {
    updateLastActivity();
    return session;
  }
  return null;
};

export const switchRole = (newRole) => {
  if (!ROLE_ROUTES[newRole]) {
    throw new Error(`Invalid role: ${newRole}`);
  }
  
  const session = getUserSession();
  if (session) {
    session.role = newRole;
    saveUserSession(session, newRole);
    return true;
  }
  
  return false;
};

// Auth state helpers for React components
export const useAuthState = () => {
  const session = getUserSession();
  const role = getUserRole();
  
  return {
    isAuthenticated: isAuthenticated(),
    user: session,
    role,
    roleConfig: role ? getRoleConfig(role) : null
  };
};