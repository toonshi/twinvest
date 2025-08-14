// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../lib/auth';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const location = useLocation();
  const authenticated = isAuthenticated();
  const userRole = getUserRole();

  // If not authenticated, redirect to signin with the current path
  if (!authenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If a specific role is required and user doesn't have it
  if (requiredRole && userRole !== requiredRole) {
    // If user has a different role, redirect to their dashboard
    if (userRole) {
      return <Navigate to={`/dashboard/${userRole}`} replace />;
    }
    // If no role, redirect to role selector
    return <Navigate to="/role-selector" replace />;
  }

  // If no specific role required but user has no role, redirect to selector
  if (!requiredRole && !userRole) {
    return <Navigate to="/role-selector" replace />;
  }

  return children;
};

export default ProtectedRoute;