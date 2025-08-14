import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Wallet, Shield, Mail, Lock, AlertCircle, Building2 } from "lucide-react";
import LoginLayout from "./LoginLayout";

export default function InvestorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");

  const handleWalletConnect = () => {
    console.log("Connecting wallet...");
  };

  const handleEmailLogin = () => {
    if (email && password) {
      setShow2FA(true);
    }
  };

  const handleICPLogin = () => {
    console.log("Connecting with ICP Identity...");
  };

  const handleInstitutionalSSO = () => {
    console.log("Opening institutional SSO...");
  };

  return (
    <LoginLayout
      title="Investor Portal"
      subtitle="Access your investment dashboard and portfolio"
    >
      <Card className="bg-gradient-card border-border shadow-glow-card">
        <CardContent className="p-6 space-y-6">
          {/* KYC Status */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-accent border border-border">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground">KYC Status</span>
            </div>
            <Badge variant="secondary">Verification Required</Badge>
          </div>

          {!show2FA ? (
            <>
              {/* Primary: Connect Wallet */}
              <div className="space-y-4">
                <Button
                  onClick={handleWalletConnect}
                  className="w-full h-12 bg-gradient-brand hover:opacity-90 text-primary-foreground font-medium"
                >
                  <Wallet className="h-5 w-5 mr-2" />
                  Connect Wallet
                </Button>
                
                <Button
                  onClick={handleICPLogin}
                  variant="outline"
                  className="w-full h-12 border-primary/20 hover:border-primary hover:bg-primary/5"
                >
                  <Shield className="h-5 w-5 mr-2" />
                  Continue with ICP Identity
                </Button>
              </div>

              <div className="relative">
                <Separator className="my-6" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-card px-3 text-xs text-muted-foreground uppercase tracking-wider">
                    Or sign in with email
                  </span>
                </div>
              </div>

              {/* Secondary: Email + Password */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="investor@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 bg-input border-border"
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
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(!!checked)}
                    />
                    <Label htmlFor="remember" className="text-sm text-muted-foreground">
                      Remember me
                    </Label>
                  </div>
                  <Button variant="link" className="text-sm text-primary p-0 h-auto">
                    Forgot password?
                  </Button>
                </div>

                <Button
                  onClick={handleEmailLogin}
                  disabled={!email || !password}
                  className="w-full h-11"
                >
                  Sign In
                </Button>
              </div>

              <Separator />

              {/* Institutional SSO */}
              <Button
                onClick={handleInstitutionalSSO}
                variant="outline"
                className="w-full h-11 border-accent/20 hover:border-accent hover:bg-accent/5"
              >
                <Building2 className="h-5 w-5 mr-2" />
                Institutional SSO
              </Button>
            </>
          ) : (
            /* 2FA Prompt */
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <AlertCircle className="h-8 w-8 text-primary mx-auto" />
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="2fa" className="text-sm font-medium">
                  Authentication Code
                </Label>
                <Input
                  id="2fa"
                  type="text"
                  placeholder="000000"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  className="text-center text-lg tracking-widest h-12"
                  maxLength={6}
                />
              </div>

              <div className="space-y-3">
                <Button
                  disabled={twoFactorCode.length !== 6}
                  className="w-full h-11"
                >
                  Verify & Sign In
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setShow2FA(false)}
                  className="w-full h-11"
                >
                  Back to login
                </Button>
              </div>
            </div>
          )}

          {/* Sign up link */}
          <div className="text-center pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              New to Twinvest?{" "}
              <Button variant="link" className="text-primary p-0 h-auto font-medium">
                Create investor account
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </LoginLayout>
  );
}
