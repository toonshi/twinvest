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
  Users,
  CreditCard,
  Key
} from "lucide-react";

export default function ClientPortal() {
  const [email, setEmail] = useState("fabbydebby@gmail.com");
  const [password, setPassword] = useState("••••••••");
  const [companyId, setCompanyId] = useState("COMP123");
  const [accessCode, setAccessCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionType, setConnectionType] = useState(null);

  const handleEnterpriseSSO = async () => {
    setIsLoading(true);
    setConnectionType("sso");
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert("Enterprise SSO: Successfully authenticated via SSO portal!");
    } catch (error) {
      alert("SSO Failed: Unable to connect to enterprise SSO.");
    } finally {
      setIsLoading(false);
      setConnectionType(null);
    }
  };

  const handleOkta = async () => {
    setIsLoading(true);
    setConnectionType("okta");
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1800));
      alert("Okta Authentication: Successfully signed in via Okta!");
    } catch (error) {
      alert("Okta Failed: Unable to connect to Okta.");
    } finally {
      setIsLoading(false);
      setConnectionType(null);
    }
  };

  const handleAzureAD = async () => {
    setIsLoading(true);
    setConnectionType("azure");
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1800));
      alert("Azure AD Authentication: Successfully signed in via Azure AD!");
    } catch (error) {
      alert("Azure AD Failed: Unable to connect to Azure AD.");
    } finally {
      setIsLoading(false);
      setConnectionType(null);
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !password || !companyId) {
      alert("Missing Information: Please enter email, password, and company ID.");
      return;
    }

    setIsLoading(true);
    setConnectionType("email");
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert("Company Portal Access: Successfully logged into client portal!");
    } catch (error) {
      alert("Login Failed: Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
      setConnectionType(null);
    }
  };

  const handleBackToRoles = () => {
    window.history.back();
    alert("Going back to role selection...");
  };

  const handleContactAdmin = () => {
    alert("Contacting administrator for enterprise access...");
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
              <h2 className="text-2xl font-semibold text-white mb-2">Client Portal</h2>
              <p className="text-sm text-gray-400">Access and pay invoices through your enterprise account</p>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-lg p-6 space-y-6">
              {/* Enterprise Features */}
              <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-2 text-purple-400">
                  <Building2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Enterprise Features</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="text-center">
                    <CreditCard className="h-4 w-4 mx-auto mb-1 text-gray-400" />
                    <div className="text-gray-300">Payment processing</div>
                  </div>
                  <div className="text-center">
                    <FileText className="h-4 w-4 mx-auto mb-1 text-gray-400" />
                    <div className="text-gray-300">Invoice management</div>
                  </div>
                  <div className="text-center">
                    <Users className="h-4 w-4 mx-auto mb-1 text-gray-400" />
                    <div className="text-gray-300">Team collaboration</div>
                  </div>
                </div>
              </div>

              {/* Enterprise SSO Login */}
              <Button
                onClick={handleEnterpriseSSO}
                disabled={isLoading}
                className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md"
              >
                {isLoading && connectionType === "sso" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Enterprise SSO Login
                  </>
                )}
              </Button>

              {/* SSO Provider Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleOkta}
                  disabled={isLoading}
                  variant="outline"
                  className="h-11 border-slate-700 bg-slate-800/30 hover:bg-slate-700/50 text-white hover:border-slate-600 rounded-md text-sm"
                >
                  {isLoading && connectionType === "okta" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Building2 className="h-4 w-4 mr-2" />
                      Okta
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleAzureAD}
                  disabled={isLoading}
                  variant="outline"
                  className="h-11 border-slate-700 bg-slate-800/30 hover:bg-slate-700/50 text-white hover:border-slate-600 rounded-md text-sm"
                >
                  {isLoading && connectionType === "azure" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Building2 className="h-4 w-4 mr-2" />
                      Azure AD
                    </>
                  )}
                </Button>
              </div>

              {/* Separator */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-900 px-4 text-gray-500 tracking-wider font-medium">OR SIGN IN WITH COMPANY EMAIL</span>
                </div>
              </div>

              {/* Company Email Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-email" className="text-sm text-gray-300 font-medium">
                    Company Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="company-email"
                      type="email"
                      placeholder="employee@company.com"
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

                {/* Company ID and Access Code */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="company-id" className="text-sm text-gray-300 font-medium">
                      Company ID
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="company-id"
                        type="text"
                        placeholder="COMP123"
                        value={companyId}
                        onChange={(e) => setCompanyId(e.target.value)}
                        className="pl-10 h-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-md text-sm"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="access-code" className="text-sm text-gray-300 font-medium">
                      Access Code
                    </Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="access-code"
                        type="text"
                        placeholder="Optional"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                        className="pl-10 h-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-md text-sm"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
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

                {/* Login Button */}
                <Button
                  onClick={handleEmailLogin}
                  disabled={!email || !password || !companyId || isLoading}
                  className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium"
                >
                  {isLoading && connectionType === "email" ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Access Company Portal"
                  )}
                </Button>
              </div>

              {/* Enterprise Security Notice */}
              <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-white">
                      Enterprise Security
                    </h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Your session is protected by enterprise-grade security. All activities are monitored and logged for compliance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Administrator */}
              <div className="text-center pt-4 border-t border-slate-800">
                <p className="text-sm text-gray-400">
                  Need enterprise access?{" "}
                  <Button
                    variant="link"
                    className="text-purple-400 p-0 h-auto text-sm font-medium hover:text-purple-300"
                    onClick={handleContactAdmin}
                  >
                    Contact your administrator
                  </Button>
                </p>
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