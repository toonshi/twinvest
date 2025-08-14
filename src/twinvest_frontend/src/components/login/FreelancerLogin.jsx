import React, { useState } from "react";
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
  Users
} from "lucide-react";

export default function SMEPortal() {
  const [activeTab, setActiveTab] = useState("email");
  const [email, setEmail] = useState("fabbydebby@gmail.com");
  const [password, setPassword] = useState("••••••••");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionType, setConnectionType] = useState(null);

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

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-950">
        {/* Subtle vertical separator line */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-700 to-transparent"></div>
        
        <div className="flex flex-col justify-center items-center p-8 relative z-10 w-full">
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Twinvest
            </h1>
            <p className="text-sm text-center text-gray-400 leading-relaxed mb-12">
              Revolutionizing invoice financing through blockchain technology
            </p>
            
            {/* Investment Statistics */}
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
        {/* Top Navigation */}
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

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-6 pb-6">
          <div className="w-full max-w-md">
            {/* Form Header */}
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

              {/* Tab Navigation */}
              <div className="grid grid-cols-2 bg-slate-800/50 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab("email")}
                  className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                    activeTab === "email"
                      ? "bg-slate-700 text-white"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </button>
                <button
                  onClick={() => setActiveTab("phone")}
                  className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                    activeTab === "phone"
                      ? "bg-slate-700 text-white"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  <Smartphone className="h-4 w-4" />
                  <span>Phone OTP</span>
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
                        <Label htmlFor="otp" className="text-sm text-gray-300 font-medium">
                          Verification Code
                        </Label>
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

                      <div className="space-y-3">
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

                        <Button
                          variant="outline"
                          onClick={() => setShowOTP(false)}
                          className="w-full h-11 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-white hover:border-slate-600 rounded-md"
                          disabled={isLoading}
                        >
                          Change phone number
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Separator */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-900 px-4 text-gray-500 tracking-wider font-medium">OR CONNECT WALLET</span>
                </div>
              </div>

              {/* Connect Wallet */}
              <Button
                onClick={handleWalletConnect}
                variant="outline"
                className="w-full h-11 border-slate-700 bg-slate-800/30 hover:bg-slate-700/30 text-white hover:border-slate-600 rounded-md"
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