// src/hooks/useUserRole.js
import { useState, useEffect } from 'react';
import { getUserRole, getUserSession, getRoleConfig, isAuthenticated } from '../lib/auth';

export const useUserRole = () => {
  const [userRole, setUserRole] = useState(null);
  const [userSession, setUserSession] = useState(null);
  const [hasStoredRole, setHasStoredRole] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Get initial values
    const role = getUserRole();
    const session = getUserSession();
    const authenticated = isAuthenticated();

    setUserRole(role);
    setUserSession(session);
    setHasStoredRole(!!role);
    setIsLoggedIn(authenticated);

    // Listen for storage changes (if user logs in/out in another tab)
    const handleStorageChange = (event) => {
      if (event.key === 'selectedRole' || event.key === 'userSession') {
        const newRole = getUserRole();
        const newSession = getUserSession();
        const newAuth = isAuthenticated();

        setUserRole(newRole);
        setUserSession(newSession);
        setHasStoredRole(!!newRole);
        setIsLoggedIn(newAuth);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const getUserRoleConfig = (role) => {
    return getRoleConfig(role);
  };

  const updateUserRole = (newRole) => {
    setUserRole(newRole);
    setHasStoredRole(!!newRole);
  };

  const updateUserSession = (newSession) => {
    setUserSession(newSession);
    setIsLoggedIn(!!newSession);
  };

  return {
    userRole,
    userSession,
    hasStoredRole,
    isLoggedIn,
    getUserRoleConfig,
    updateUserRole,
    updateUserSession
  };
};