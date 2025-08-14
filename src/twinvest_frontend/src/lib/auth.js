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
    login: '/signin?role=sme',
    title: 'SME / Freelancer'
  },
  investor: {
    dashboard: '/dashboard/investor', 
    login: '/signin?role=investor',
    title: 'Investor'
  },
  client: {
    dashboard: '/dashboard/client',
    login: '/signin?role=client', 
    title: 'Client / Payer'
  },
  admin: {
    dashboard: '/dashboard/admin',
    login: '/signin?role=admin',
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
 * Mock authentication functions (replace with actual API calls)
 */
export const authenticateTraditional = async ({ email, password, role }) => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email && password) {
        const userData = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          role: role || 'sme',
          name: email.split('@')[0]
        };
        
        saveUserSession(userData, role);
        resolve(userData);
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 1000);
  });
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
          lastName: formData.lastName
        };
        
        saveUserSession(userData, formData.role);
        resolve(userData);
      } else {
        reject(new Error('Missing required fields'));
      }
    }, 1000);
  });
};