// src/components/login/InvestorLogin.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  Shield,
  Mail,
  Lock,
  AlertCircle,
  Building2,
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { loginWithII, loginWithPlug, roleVariant, getRoleKey } from "@/lib/icp";

export default function InvestorLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("example@gmail.com");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connectionType, setConnectionType] = useState(null);

  const handleWalletConnect = async () => {
    setIsLoading(true);
    setConnectionType("wallet");
    try {
      const { actor } = await loginWithPlug();
      const roleOpt = await actor.get_my_role();
      let roleKey = roleOpt && roleOpt.length ? getRoleKey(roleOpt[0]) : null;
      if (!roleKey) { await actor.set_my_role(roleVariant('investor')); roleKey = 'investor'; }
      navigate(`/dashboard/${roleKey}`);
    } catch (error) {
      alert("Connection Failed: Unable to connect wallet. Please try again.");
    } finally {
      setIsLoading(false);
      setConnectionType(null);
    }
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
      if (email && password) {
        setShow2FA(true);
        alert("Credentials Verified: Please complete two-factor authentication.");
      }
    } catch {
      alert("Login Failed: Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
      setConnectionType(null);
    }
  };

  const handleICPLogin = async () => {
    setIsLoading(true);
    setConnectionType("icp");
    try {
      const { actor } = await loginWithII();
      const roleOpt = await actor.get_my_role();
      let roleKey = roleOpt && roleOpt.length ? getRoleKey(roleOpt[0]) : null;
      if (!roleKey) {
        await actor.set_my_role(roleVariant("investor"));
        roleKey = "investor";
      }
      navigate(`/dashboard/${roleKey}`);
    } catch {
      alert("ICP Connection Failed: Unable to connect with Internet Identity.");
    } finally {
      setIsLoading(false);
      setConnectionType(null);
    }
  };

  const handleInstitutionalSSO = async () => {
    setIsLoading(true);
    setConnectionType("sso");
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert("SSO Authentication: Redirecting to institutional login portal...");
    } catch {
      alert("SSO Failed: Unable to connect to institutional SSO.");
    } finally {
      setIsLoading(false);
      setConnectionType(null);
    }
  };

  const handle2FASubmit = async () => {
    if (!twoFactorCode || twoFactorCode.length !== 6) {
      alert("Invalid Code: Please enter a valid 6-digit authentication code.");
      return;
    }
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate('/dashboard/investor');
    } catch {
      alert("Authentication Failed: Invalid authentication code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToRoles = () => {
    window.history.back();
    alert("Going back to role selection...");
  };

  const handleCreateAccount = () => {
    alert("Navigating to investor sign up...");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
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
              <h2 className="text-2xl font-semibold text-white mb-2">Investor Portal</h2>
              <p className="text-sm text-gray-400">Access your investment dashboard and portfolio</p>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-lg p-6 space-y-6">
              <div className="flex items-center justify-between p-3 rounded-md bg-slate-800/50">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-white">KYC Status</span>
                </div>
                <Badge className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
                  Verification Required
                </Badge>
              </div>

              {!show2FA ? (
                <>
                  <Button
                    onClick={handleWalletConnect}
                    disabled={isLoading}
                    className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-all duration-200"
                  >
                    {isLoading && connectionType === "wallet" ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Connecting Wallet...
                      </>
                    ) : (
                      <>
                        <Wallet className="h-4 w-4 mr-2" />
                        Connect Wallet
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleICPLogin}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full h-11 border-slate-700 bg-slate-800/30 hover:bg-slate-700/50 text-white hover:border-slate-600 rounded-md"
                  >
                    {isLoading && connectionType === "icp" ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Connecting with ICP...
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4 mr-2" />
                        Continue with ICP Identity
                      </>
                    )}
                  </Button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-slate-900 px-4 text-gray-500 tracking-wider font-medium">OR SIGN IN WITH EMAIL</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm text-gray-300 font-medium">
                        Email address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="email"
                          type="email"
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

                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={rememberMe}
                          onCheckedChange={(checked) => setRememberMe(!!checked)}
                          className="border-slate-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 h-4 w-4"
                        />
                        <Label htmlFor="remember" className="text-sm text-gray-400">
                          Remember me
                        </Label>
                      </div>
                      <Button variant="link" className="text-sm text-purple-400 p-0 h-auto hover:text-purple-300 font-medium">
                        Forgot password?
                      </Button>
                    </div>

                    <Button
                      onClick={handleEmailLogin}
                      disabled={!email || !password || isLoading}
                      className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium"
                    >
                      {isLoading && connectionType === "email" ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                    <Button
                      onClick={handleInstitutionalSSO}
                      disabled={isLoading}
                      variant="outline"
                      className="w-full h-11 border-slate-700 bg-slate-800/30 hover:bg-slate-700/30 text-gray-300 hover:text-white hover:border-slate-600 rounded-md"
                    >
                      <Building2 className="h-4 w-4 mr-2" />
                      Institutional SSO
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="text-center space-y-3">
                    <AlertCircle className="h-10 w-10 text-purple-400 mx-auto" />
                    <h3 className="text-lg font-medium text-white">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-400">
                      Enter the 6-digit code from your authenticator app
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="2fa" className="text-sm text-gray-300 font-medium">
                      Authentication Code
                    </Label>
                    <Input
                      id="2fa"
                      type="text"
                      placeholder="000000"
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value)}
                      className="text-center text-xl tracking-widest h-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-md"
                      maxLength={6}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={handle2FASubmit}
                      disabled={twoFactorCode.length !== 6 || isLoading}
                      className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Verify & Sign In
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setShow2FA(false)}
                      className="w-full h-11 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-white hover:border-slate-600 rounded-md"
                      disabled={isLoading}
                    >
                      Back to login
                    </Button>
                  </div>
                </div>
              )}

              <div className="text-center pt-4 border-t border-slate-800">
                <p className="text-sm text-gray-400">
                  New to Twinvest?{" "}
                  <Button
                    variant="link"
                    className="text-purple-400 p-0 h-auto text-sm font-medium hover:text-purple-300"
                    onClick={handleCreateAccount}
                  >
                    Create investor account
                  </Button>
                </p>
              </div>
            </div>

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