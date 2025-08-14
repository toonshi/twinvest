// src/hooks/useUserRole.js
import { useState, useEffect } from 'react';

/**
 * Custom hook to manage user role state and persistence
 */
export const useUserRole = () => {
  const [userRole, setUserRole] = useState(null);
  const [hasStoredRole, setHasStoredRole] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored role preference
    const storedRole = localStorage.getItem('selectedRole');
    const storedUser = localStorage.getItem('userSession');
    
    if (storedRole && storedUser) {
      setUserRole(storedRole);
      setHasStoredRole(true);
    }
    
    setIsLoading(false);
  }, []);

  const saveUserRole = (role) => {
    setUserRole(role);
    setHasStoredRole(true);
    localStorage.setItem('selectedRole', role);
  };

  const clearUserRole = () => {
    setUserRole(null);
    setHasStoredRole(false);
    localStorage.removeItem('selectedRole');
    localStorage.removeItem('userSession');
  };

  const getUserRoleConfig = (role) => {
    const roles = {
      sme: {
        title: 'SME / Freelancer',
        dashboardPath: '/dashboard/sme',
        loginPath: '/signin?role=sme'
      },
      investor: {
        title: 'Investor',
        dashboardPath: '/dashboard/investor',
        loginPath: '/signin?role=investor'
      },
      client: {
        title: 'Client / Payer',
        dashboardPath: '/dashboard/client',
        loginPath: '/signin?role=client'
      },
      admin: {
        title: 'Platform Admin',
        dashboardPath: '/dashboard/admin',
        loginPath: '/signin?role=admin'
      }
    };
    
    return roles[role] || null;
  };

  return {
    userRole,
    hasStoredRole,
    isLoading,
    saveUserRole,
    clearUserRole,
    getUserRoleConfig
  };
};