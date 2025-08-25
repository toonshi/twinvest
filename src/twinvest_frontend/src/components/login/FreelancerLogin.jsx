import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Wallet,
  Shield,
  Mail,
  Lock,
  AlertCircle,
  Building2,
  ArrowLeft,
  TrendingUp,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle,
  BarChart3,
  FileText,
  Zap,
  DollarSign,
  Smartphone,
  Users,
  Fingerprint,
  Globe
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
    setPrincipal("rdmx6-jaaaa-aaaaa-aaadq-cai-example-principal-id");
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
    return { SME: null }; // Mock SME role
  },
  setMyRole: async (role) => {
    // Simulate setting role
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  }
};

export default function SMEPortalWithII() {
  const [activeTab, setActiveTab] = useState("ii");
  const [email, setEmail] = useState("fabbydebby@gmail.com");
  const [password, setPassword] = useState("••••••••");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
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
        // Auto-set role as SME for new users
        const success = await roleService.setMyRole({ SME: null });
        if (success) {
          setUserRole({ SME: null });
          alert("Welcome! Your account has been set up as an SME.");
        }
      } else if (role.SME) {
        alert("Internet Identity Login Successful: Welcome to your SME dashboard!");
      } else {
        alert("Access Denied: This portal is for SME users only.");
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

  const handleEmailLogin = async () => {
    if (!email || !password) {
      alert("Missing Information: Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    setConnectionType("email");
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert("Login Successful: Welcome to your SME dashboard!");
    } catch (error) {
      alert("Login Failed: Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
      setConnectionType(null);
    }
  };

  const handleSendOTP = async () => {
    if (!phone) {
      alert("Missing Information: Please enter your phone number.");
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowOTP(true);
      alert(`OTP Sent: Verification code sent to ${phone}`);
    } catch (error) {
      alert("OTP Failed: Unable to send verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      alert("Invalid Code: Please enter a valid 6-digit OTP code.");
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert("Phone Verified: Welcome to your SME dashboard!");
    } catch (error) {
      alert("Verification Failed: Invalid OTP code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletConnect = async () => {
    setIsLoading(true);
    setConnectionType("wallet");
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert("Wallet Connected: Successfully connected to your SME dashboard!");
    } catch (error) {
      alert("Connection Failed: Unable to connect wallet. Please try again.");
    } finally {
      setIsLoading(false);
      setConnectionType(null);
    }
  };

  const handleBackToRoles = () => {
    window.history.back();
    alert("Going back to role selection...");
  };

  const handleCreateAccount = () => {
    alert("Navigating to SME account creation...");
  };

  // If already authenticated with II, show dashboard access
  if (isAuthenticated && userRole?.SME) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <Card className="w-full max-w-md bg-slate-900/60 backdrop-blur-sm border border-slate-800">
          <CardContent className="p-6 space-y-6 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Successfully Authenticated</h2>
                <p className="text-sm text-gray-400">Internet Identity Principal:</p>
                <div className="bg-slate-800 rounded-lg p-3 mt-2">
                  <code className="text-xs text-green-400 break-all">{principal}</code>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white">
                Access SME Dashboard
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
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-950">
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-700 to-transparent"></div>
        
        <div className="flex flex-col justify-center items-center p-8 relative z-10 w-full">
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Twinvest
            </h1>
            <p className="text-sm text-center text-gray-400 leading-relaxed mb-12">
              Revolutionizing invoice financing through blockchain technology
            </p>
            
            <div className="grid grid-cols-2 gap-12">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-blue-400">$2.4B+</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Processed</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-purple-400">50K+</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Active Users</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-slate-950">
        <div className="p-6 flex justify-between items-center">
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

        <div className="flex-1 flex items-center justify-center px-6 pb-6">
          <div className="w-full max-w-md">
            <div className="text-right mb-8">
              <h2 className="text-2xl font-semibold text-white mb-2">SME Portal</h2>
              <p className="text-sm text-gray-400">Upload invoices, tokenize, and get funded instantly</p>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-lg p-6 space-y-6">
              {/* Quick Start Benefits */}
              <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-2 text-purple-400">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm font-medium">Quick Start Benefits</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="text-center">
                    <FileText className="h-4 w-4 mx-auto mb-1 text-gray-400" />
                    <div className="text-gray-300">Upload invoices</div>
                  </div>
                  <div className="text-center">
                    <Zap className="h-4 w-4 mx-auto mb-1 text-gray-400" />
                    <div className="text-gray-300">Instant tokenize</div>
                  </div>
                  <div className="text-center">
                    <DollarSign className="h-4 w-4 mx-auto mb-1 text-gray-400" />
                    <div className="text-gray-300">Get funded</div>
                  </div>
                </div>
              </div>

              {/* Internet Identity - Primary Option */}
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Globe className="h-5 w-5 text-blue-400" />
                    <div>
                      <h3 className="text-sm font-semibold text-white">Internet Identity</h3>
                      <p className="text-xs text-gray-400">Secure, decentralized authentication</p>
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
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Fingerprint className="h-4 w-4 mr-2" />
                        Sign in with Internet Identity
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-900 px-4 text-gray-500 tracking-wider font-medium">OTHER OPTIONS</span>
                </div>
              </div>

              <div className="grid grid-cols-3 bg-slate-800/50 p-1 rounded-lg text-xs">
                <button
                  onClick={() => setActiveTab("email")}
                  className={`flex items-center justify-center space-x-1 py-2 px-2 rounded-md font-medium transition-all ${
                    activeTab === "email"
                      ? "bg-slate-700 text-white"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  <Mail className="h-3 w-3" />
                  <span>Email</span>
                </button>
                <button
                  onClick={() => setActiveTab("phone")}
                  className={`flex items-center justify-center space-x-1 py-2 px-2 rounded-md font-medium transition-all ${
                    activeTab === "phone"
                      ? "bg-slate-700 text-white"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  <Smartphone className="h-3 w-3" />
                  <span>Phone</span>
                </button>
                <button
                  onClick={() => setActiveTab("wallet")}
                  className={`flex items-center justify-center space-x-1 py-2 px-2 rounded-md font-medium transition-all ${
                    activeTab === "wallet"
                      ? "bg-slate-700 text-white"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  <Wallet className="h-3 w-3" />
                  <span>Wallet</span>
                </button>
              </div>

              {/* Email Tab */}
              {activeTab === "email" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="business-email" className="text-sm text-gray-300 font-medium">
                      Business Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="business-email"
                        type="email"
                        placeholder="business@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-md"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm text-gray-300 font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-md"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 hover:bg-slate-700 text-gray-500 hover:text-white rounded"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={handleEmailLogin}
                    disabled={!email || !password || isLoading}
                    className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium"
                  >
                    {isLoading && connectionType === "email" ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In to SME Account"
                    )}
                  </Button>
                </div>
              )}

              {/* Phone Tab */}
              {activeTab === "phone" && (
                <div className="space-y-4">
                  {!showOTP ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm text-gray-300 font-medium">
                          Phone Number
                        </Label>
                        <div className="relative">
                          <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="pl-10 h-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-md"
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      <Button
                        onClick={handleSendOTP}
                        disabled={!phone || isLoading}
                        className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Sending OTP...
                          </>
                        ) : (
                          "Send OTP Code"
                        )}
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="text-center space-y-3">
                        <Smartphone className="h-8 w-8 text-purple-400 mx-auto" />
                        <h3 className="text-lg font-medium text-white">Verify Phone Number</h3>
                        <p className="text-sm text-gray-400">
                          Enter the 6-digit code sent to {phone}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Input
                          id="otp"
                          type="text"
                          placeholder="000000"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="text-center text-xl tracking-widest h-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-md"
                          maxLength={6}
                          disabled={isLoading}
                        />
                      </div>

                      <Button
                        onClick={handleVerifyOTP}
                        disabled={otp.length !== 6 || isLoading}
                        className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          "Verify & Sign In"
                        )}
                      </Button>
                    </>
                  )}
                </div>
              )}

              {/* Wallet Tab */}
              {activeTab === "wallet" && (
                <div className="space-y-4">
                  <Button
                    onClick={handleWalletConnect}
                    className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium"
                    disabled={isLoading}
                  >
                    {isLoading && connectionType === "wallet" ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Wallet className="h-4 w-4 mr-2" />
                        Connect Crypto Wallet
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Sign Up CTA */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-lg text-center space-y-3">
                <h3 className="text-sm font-semibold text-white">
                  New to invoice financing?
                </h3>
                <p className="text-xs text-white/80">
                  Create your SME account and start getting funded within minutes
                </p>
                <Button
                  variant="secondary"
                  className="w-full h-9 bg-white text-purple-600 hover:bg-white/90 text-sm font-medium"
                  onClick={handleCreateAccount}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Create SME Account
                </Button>
              </div>
            </div>

            {/* Footer Links */}
            <div className="mt-6 text-center">
              <div className="flex justify-center space-x-6 text-sm text-gray-500">
                <a href="#" className="hover:text-purple-400 transition-colors">Privacy</a>
                <a href="#" className="hover:text-purple-400 transition-colors">Terms</a>
                <a href="#" className="hover:text-purple-400 transition-colors">Help</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}