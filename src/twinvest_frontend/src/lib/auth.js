// src/lib/auth.js
/**
 * Authentication utilities for handling user sessions and role management
 */

export const AUTH_STORAGE_KEYS = {
  SELECTED_ROLE: 'selectedRole',
  USER_SESSION: 'userSession',
  AUTH_TOKEN: 'authToken'
};

/**
 * Save user session data
 */
export const saveUserSession = (userData, role = null) => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEYS.USER_SESSION, JSON.stringify({
      ...userData,
      timestamp: new Date().toISOString()
    }));
    
    if (role) {
      localStorage.setItem(AUTH_STORAGE_KEYS.SELECTED_ROLE, role);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to save user session:', error);
    return false;
  }
};

/**
 * Get user session data
 */
export const getUserSession = () => {
  try {
    const sessionData = localStorage.getItem(AUTH_STORAGE_KEYS.USER_SESSION);
    return sessionData ? JSON.parse(sessionData) : null;
  } catch (error) {
    console.error('Failed to get user session:', error);
    return null;
  }
};

/**
 * Clear user session
 */
export const clearUserSession = () => {
  try {
    Object.values(AUTH_STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Failed to clear user session:', error);
    return false;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const session = getUserSession();
  const role = localStorage.getItem(AUTH_STORAGE_KEYS.SELECTED_ROLE);
  return !!(session && role);
};

/**
 * Get user role
 */
export const getUserRole = () => {
  return localStorage.getItem(AUTH_STORAGE_KEYS.SELECTED_ROLE);
};

/**
 * Role-based route mapping
 */
export const ROLE_ROUTES = {
  sme: {
    dashboard: '/dashboard/sme',
    login: '/login/sme',
    title: 'SME / Freelancer'
  },
  investor: {
    dashboard: '/dashboard/investor', 
    login: '/login/investor',
    title: 'Investor'
  },
  client: {
    dashboard: '/dashboard/client',
    login: '/login/client', 
    title: 'Client / Payer'
  },
  admin: {
    dashboard: '/dashboard/admin',
    login: '/login/admin',
    title: 'Platform Admin'
  }
};

/**
 * Get route configuration for a role
 */
export const getRoleConfig = (role) => {
  return ROLE_ROUTES[role] || null;
};

/**
 * Authentication methods for different login types
 */
export const authenticateEmail = async ({ email, password, role }) => {
  // Simulate API call for email/password authentication
  return new Promise((resolve, reject) => {
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
};

export const authenticatePhone = async ({ phone, otp, role }) => {
  // Simulate API call for phone/OTP authentication
  return new Promise((resolve, reject) => {
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
};

export const authenticateWallet = async ({ walletAddress, signature, role }) => {
  // Simulate API call for wallet authentication
  return new Promise((resolve, reject) => {
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
};

export const authenticateSSO = async ({ provider, token, role }) => {
  // Simulate API call for SSO authentication
  return new Promise((resolve, reject) => {
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
};

export const authenticate2FA = async ({ userId, code }) => {
  // Simulate API call for 2FA verification
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (code && code.length === 6) {
        resolve({ verified: true });
      } else {
        reject(new Error('Invalid 2FA code'));
      }
    }, 800);
  });
};

export const sendOTP = async (phone) => {
  // Simulate API call to send OTP
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (phone) {
        resolve({ sent: true, message: `OTP sent to ${phone}` });
      } else {
        reject(new Error('Invalid phone number'));
      }
    }, 1000);
  });
};

/**
 * Traditional registration (kept for backward compatibility)
 */
export const authenticateTraditional = async ({ email, password, role }) => {
  return authenticateEmail({ email, password, role });
};

export const registerTraditional = async (formData) => {
  // Simulate API call
  return new Promise((resolve, reject) => {
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
};