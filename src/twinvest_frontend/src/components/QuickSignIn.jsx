import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";

/**
 * Quick sign in component for dashboards/landing pages
 * Can be embedded anywhere to provide instant access
 */
export default function QuickSignIn() {
  const navigate = useNavigate();

  const handleSignIn = (): void => {
    // Smart redirect - will use stored role or show selector
    navigate("/login");
  };

  const handleSignUp = (): void => {
    // For sign up, always show role selector to let user choose
    navigate("/");
  };

  return (
    <div className="flex items-center space-x-3">
      <Button variant="outline" onClick={handleSignIn}>
        <LogIn className="h-4 w-4 mr-2" />
        Sign In
      </Button>
      <Button onClick={handleSignUp}>
        <UserPlus className="h-4 w-4 mr-2" />
        Sign Up
      </Button>
    </div>
  );
}
