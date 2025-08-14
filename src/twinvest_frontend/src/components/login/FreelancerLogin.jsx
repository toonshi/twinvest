import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Wallet,
  Mail,
  Lock,
  Smartphone,
  FileText,
  DollarSign,
  Zap,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import LoginLayout from "../LoginLayout";
import {
  authenticateEmail,
  authenticatePhone,
  authenticateWallet,
  sendOTP,
} from "../../lib/auth";

export default function FreelancerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async () => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await authenticateEmail({ email, password, role: "sme" });
      toast({
        title: "Success",
        description: "Signed in successfully!",
      });
      navigate("/dashboard/sme");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!phone) {
      toast({
        title: "Error",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return;
    }

    setOtpLoading(true);
    try {
      await sendOTP(phone);
      setShowOTP(true);
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${phone}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP",
        variant: "destructive",
      });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await authenticatePhone({ phone, otp, role: "sme" });
      toast({
        title: "Success",
        description: "Phone verified successfully!",
      });
      navigate("/dashboard/sme");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Invalid OTP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletConnect = async () => {
    setIsLoading(true);
    try {
      // Simulate wallet connection
      const walletAddress = "0x" + Math.random().toString(16).substr(2, 40);
      await authenticateWallet({
        walletAddress,
        signature: "mock_signature",
        role: "sme",
      });
      toast({
        title: "Success",
        description: "Wallet connected successfully!",
      });
      navigate("/dashboard/sme");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginLayout
      title="SME Portal"
      subtitle="Upload invoices, tokenize, and get funded instantly"
    >
      <Card className="bg-gradient-card border-border shadow-glow-card">
        <CardContent className="p-6 space-y-6">
          {/* Value Proposition */}
          <div className="bg-gradient-accent rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-2 text-primary">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium">Quick Start Benefits</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="text-center">
                <FileText className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                <div>Upload invoices</div>
              </div>
              <div className="text-center">
                <Zap className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                <div>Instant tokenize</div>
              </div>
              <div className="text-center">
                <DollarSign className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                <div>Get funded</div>
              </div>
            </div>
          </div>

          {/* Primary: Email/OTP Authentication */}
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted">
              <TabsTrigger
                value="email"
                className="data-[state=active]:bg-card"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </TabsTrigger>
              <TabsTrigger
                value="phone"
                className="data-[state=active]:bg-card"
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Phone OTP
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Business Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="business@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 bg-input border-border"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 bg-input border-border"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(Boolean(checked))
                    }
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm text-muted-foreground"
                  >
                    Remember me
                  </Label>
                </div>
                <Button
                  variant="link"
                  className="text-sm text-primary p-0 h-auto"
                >
                  Forgot password?
                </Button>
              </div>

              <Button
                onClick={handleEmailLogin}
                disabled={!email || !password || isLoading}
                className="w-full h-11"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In to SME Account"
                )}
              </Button>
            </TabsContent>

            <TabsContent value="phone" className="space-y-4 mt-6">
              {!showOTP ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10 h-11 bg-input border-border"
                        disabled={otpLoading}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleSendOTP}
                    disabled={!phone || otpLoading}
                    className="w-full h-11"
                  >
                    {otpLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      "Send OTP Code"
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-center space-y-2">
                    <Smartphone className="h-8 w-8 text-primary mx-auto" />
                    <h3 className="font-medium">Verify Phone Number</h3>
                    <p className="text-sm text-muted-foreground">
                      Enter the 6-digit code sent to {phone}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="otp" className="text-sm font-medium">
                      Verification Code
                    </Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="text-center text-lg tracking-widest h-12"
                      maxLength={6}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={handleVerifyOTP}
                      disabled={otp.length !== 6 || isLoading}
                      className="w-full h-11"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Verify & Sign In"
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setShowOTP(false)}
                      className="w-full h-11"
                      disabled={isLoading}
                    >
                      Change phone number
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>

          <div className="relative">
            <Separator className="my-6" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-card px-3 text-xs text-muted-foreground uppercase tracking-wider">
                Or connect wallet
              </span>
            </div>
          </div>

          {/* Secondary: Connect Wallet */}
          <Button
            onClick={handleWalletConnect}
            variant="outline"
            className="w-full h-12 border-primary/20 hover:border-primary hover:bg-primary/5"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="h-5 w-5 mr-2" />
                Connect Crypto Wallet
              </>
            )}
          </Button>

          {/* Prominent Sign up CTA */}
          <div className="bg-gradient-brand p-4 rounded-lg text-center space-y-3">
            <h3 className="font-semibold text-primary-foreground">
              New to invoice financing?
            </h3>
            <p className="text-sm text-primary-foreground/80">
              Create your SME account and start getting funded within minutes
            </p>
            <Button
              variant="secondary"
              className="w-full bg-white text-primary hover:bg-white/90"
              onClick={() => navigate("/signup?role=sme")}
            >
              <Users className="h-4 w-4 mr-2" />
              Create SME Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </LoginLayout>
  );
}
