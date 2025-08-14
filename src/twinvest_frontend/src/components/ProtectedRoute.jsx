import React from "react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "../hooks/useUserRole";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { userRole, isLoading } = useUserRole();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoading && (!userRole || (requiredRole && userRole !== requiredRole))) {
      const redirectPath = requiredRole ? `/signin?role=${requiredRole}` : "/signin";
      navigate(redirectPath);
    }
  }, [userRole, isLoading, requiredRole, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return userRole ? children : null;
};

export default ProtectedRoute;
