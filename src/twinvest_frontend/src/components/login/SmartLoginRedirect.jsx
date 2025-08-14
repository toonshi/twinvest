import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';

/**
 * Smart redirect component for login flows
 * Redirects to appropriate login page based on stored user role preference
 */
export default function SmartLoginRedirect() {
  const navigate = useNavigate();
  const { userRole, hasStoredRole } = useUserRole();

  useEffect(() => {
    if (hasStoredRole && userRole) {
      // Redirect to their preferred role login page
      navigate(`/login/${userRole}`, { replace: true });
    } else {
      // No stored preference, show role selector
      navigate('/', { replace: true });
    }
  }, [navigate, userRole, hasStoredRole]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-muted-foreground">Redirecting to login...</p>
      </div>
    </div>
  );
}
