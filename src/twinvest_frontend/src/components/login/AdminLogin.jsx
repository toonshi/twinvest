import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Key,
  Fingerprint,
  Smartphone,
  AlertTriangle,
  Lock,
  Eye,
  Server,
  Globe,
  CheckCircle,
  Loader2,
  Settings,
  Database,
  Users,
  Activity,
  ArrowLeft
} from "lucide-react";

// Mock Internet Identity hook and service for demonstration
const useInternetIdentity = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [principal, setPrincipal] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const login = async () => {
    setIsLoading(true);
    // Simulate Internet Identity login
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsAuthenticated(true);
    setPrincipal("admin-rdmx6-jaaaa-aaaaa-aaadq-cai-super-admin-principal");
    setIsLoading(false);
    return true;
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setPrincipal(null);
  };

  return { isAuthenticated, principal, isLoading, login, logout };
};

const roleService = {
  getMyRole: async () => {
    // Simulate role check
    await new Promise(resolve => setTimeout(resolve, 500));
    return { Admin: null }; // Mock Admin role
  },
  setMyRole: async (role) => {
    // Simulate setting role
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  }
};

export default function AdminLoginWithII() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [authStep, setAuthStep] = useState("credentials");
  const [useWebAuthn, setUseWebAuthn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionType, setConnectionType] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const { 
    isAuthenticated, 
    principal, 
    isLoading: iiLoading, 
    login: iiLogin, 
    logout: iiLogout 
  } = useInternetIdentity();

  useEffect(() => {
    if (isAuthenticated && principal) {
      checkUserRole();
    }
  }, [isAuthenticated, principal]);

  const checkUserRole = async () => {
    try {
      const role = await roleService.getMyRole();
      setUserRole(role);
      
      if (!role) {
        alert("Access Denied: No administrative role found for this identity.");
      } else if (role.Admin) {
        alert("Internet Identity Admin Login Successful: Welcome to the admin dashboard!");
      } else {
        alert("Access Denied: This portal is for Administrators only.");
      }
    } catch (error) {
      console.error("Role check error:", error);
      alert("Error checking user role. Please try again.");
    }
  };

  const handleInternetIdentityLogin = async () => {
    setIsLoading(true);
    setConnectionType("ii");
    
    try {
      const success = await iiLogin();
      if (success) {
        // Role check will happen in useEffect
      } else {
        alert("Internet Identity Login Failed: Please try again.");
      }
    } catch (error) {
      console.error("II Login error:", error);
      alert("Internet Identity Login Failed: " + error.message);
    } finally {
      setIsLoading(false);
      setConnectionType(null);
    }
  };

  const handleLogout = async () => {
    await iiLogout();
    setUserRole(null);
    alert("Logged out successfully!");
  };

  const handleCredentialsSubmit = () => {
    if (username && password) {
      setAuthStep("2fa");
    }
  };

  const handleWebAuthn = () => {
    console.log("Initiating WebAuthn authentication...");
    setUseWebAuthn(true);
  };

  const handle2FASubmit = () => {
    console.log("Verifying 2FA:", twoFactorCode);
  };

  const handleRecoverySubmit = () => {
    console.log("Using recovery code:", recoveryCode);
  };

  const handleSSO = () => {
    console.log("Opening admin SSO...");
  };

  const handleBackToRoles = () => {
    window.history.back();
    alert("Going back to role selection...");
  };

  // If already authenticated with II, show dashboard access
  if (isAuthenticated && userRole?.Admin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <Card className="w-full max-w-md bg-slate-900/60 backdrop-blur-sm border border-slate-800">
          <CardContent className="p-6 space-y-6 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Administrator Access Granted</h2>
                <p className="text-sm text-gray-400">Internet Identity Principal:</p>
                <div className="bg-slate-800 rounded-lg p-3 mt-2">
                  <code className="text-xs text-purple-400 break-all">{principal}</code>
                </div>
              </div>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-purple-400 mb-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Maximum Security Active</span>
              </div>
              <p className="text-xs text-gray-400">
                All administrative activities are logged and monitored.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="text-center p-3 bg-slate-800/30 rounded-lg">
                <Database className="h-4 w-4 mx-auto mb-1 text-gray-400" />
                <div className="text-gray-300">System Management</div>
              </div>
              <div className="text-center p-3 bg-slate-800/30 rounded-lg">
                <Users className="h-4 w-4 mx-auto mb-1 text-gray-400" />
                <div className="text-gray-300">User Administration</div>
              </div>
            </div>

            <div className="space-y-3">
              <Button className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white">
                <Settings className="h-4 w-4 mr-2" />
                Access Admin Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="w-full h-11 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-white"
              >
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-slate-800 text-sm"
            onClick={handleBackToRoles}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to role selection
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Administrator Access
          </h1>
          <p className="text-sm text-gray-400">Secure access to platform administration</p>
        </div>

        <Card className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 shadow-2xl">
          <CardContent className="p-6 space-y-6">
            {/* Security Level Indicator */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive font-medium">
                  Maximum Security Required
                </span>
              </div>
              <Badge className="bg-destructive/20 text-destructive border-destructive/30">Critical Access</Badge>
            </div>

            {/* Internet Identity - Primary Option */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Globe className="h-5 w-5 text-blue-400" />
                  <div>
                    <h3 className="text-sm font-semibold text-white">Internet Identity</h3>
                    <p className="text-xs text-gray-400">Secure, decentralized admin access</p>
                  </div>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 text-xs">
                    Recommended
                  </Badge>
                </div>
                <Button
                  onClick={handleInternetIdentityLogin}
                  disabled={isLoading || iiLoading}
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
                >
                  {(isLoading && connectionType === "ii") || iiLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <Fingerprint className="h-4 w-4 mr-2" />
                      Admin Login with Internet Identity
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* IP Allowlist Notice */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Server className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-white">
                    Network Security
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Access restricted to authorized IP addresses. Your connection
                    is being validated.
                  </p>
                </div>
              </div>
            </div>

            {authStep === "credentials" && (
              <>
                {/* Primary: SSO or WebAuthn */}
                <div className="space-y-4">
                  <Button
                    onClick={handleSSO}
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white font-medium"
                  >
                    <Shield className="h-5 w-5 mr-2" />
                    Administrator SSO
                  </Button>

                  <Button
                    onClick={handleWebAuthn}
                    variant="outline"
                    className="w-full h-12 border-purple-500/20 hover:border-purple-500 hover:bg-purple-500/5 text-white"
                  >
                    <Fingerprint className="h-5 w-5 mr-2" />
                    WebAuthn (Security Key / Biometrics)
                  </Button>
                </div>

                <div className="relative">
                  <Separator className="my-6" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-slate-900 px-3 text-xs text-gray-400 uppercase tracking-wider">
                      Emergency access only
                    </span>
                  </div>
                </div>

                {/* Emergency Credentials */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium text-gray-300">
                      Administrator Username
                    </Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="admin.username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-10 h-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                      Secure Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="High-entropy password required"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 h-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleCredentialsSubmit}
                    disabled={!username || !password}
                    className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Continue to 2FA
                  </Button>
                </div>
              </>
            )}

            {authStep === "2fa" && (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <Smartphone className="h-8 w-8 text-purple-400 mx-auto" />
                  <h3 className="font-medium text-white">
                    Two-Factor Authentication Required
                  </h3>
                  <p className="text-sm text-gray-400">
                    Enter the code from your authenticator app or hardware token
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="2fa" className="text-sm font-medium text-gray-300">
                    Authentication Code
                  </Label>
                  <Input
                    id="2fa"
                    type="text"
                    placeholder="000000"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    className="text-center text-lg tracking-widest h-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    maxLength={6}
                  />
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handle2FASubmit}
                    disabled={twoFactorCode.length !== 6}
                    className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Authenticate & Access
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setAuthStep("recovery")}
                    className="w-full h-11 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-white"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Use Recovery Code
                  </Button>
                </div>
              </div>
            )}

            {authStep === "recovery" && (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <Key className="h-8 w-8 text-purple-400 mx-auto" />
                  <h3 className="font-medium text-white">Recovery Code Access</h3>
                  <p className="text-sm text-gray-400">
                    Enter one of your backup recovery codes
                  </p>
                </div>

                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-destructive">
                      Recovery codes can only be used once. Contact system
                      administrator if you've used all codes.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recovery" className="text-sm font-medium text-gray-300">
                    Recovery Code
                  </Label>
                  <Input
                    id="recovery"
                    type="text"
                    placeholder="XXXXX-XXXXX-XXXXX"
                    value={recoveryCode}
                    onChange={(e) => setRecoveryCode(e.target.value)}
                    className="text-center text-lg tracking-widest h-12 font-mono bg-slate-800/50 border-slate-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleRecoverySubmit}
                    disabled={!recoveryCode}
                    className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Use Recovery Code
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setAuthStep("2fa")}
                    className="w-full h-11 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-white"
                  >
                    Back to 2FA
                  </Button>
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Eye className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-destructive">
                    Security Notice
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    All administrator activities are logged and monitored.
                    Unauthorized access attempts will be reported to security
                    teams.
                  </p>
                </div>
              </div>
            </div>

            {/* Support Contact */}
            <div className="text-center pt-4 border-t border-slate-700">
              <p className="text-sm text-gray-400">
                Access issues?{" "}
                <Button
                  variant="link"
                  className="text-purple-400 p-0 h-auto font-medium hover:text-purple-300"
                >
                  Contact security team
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}