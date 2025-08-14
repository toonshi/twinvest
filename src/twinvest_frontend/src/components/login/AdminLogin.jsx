import React, { useState } from "react";
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
} from "lucide-react";
import LoginLayout from "../LoginLayout";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [authStep, setAuthStep] = useState("credentials");
  const [useWebAuthn, setUseWebAuthn] = useState(false);

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

  return (
    <LoginLayout
      title="Administrator Access"
      subtitle="Secure access to platform administration"
    >
      <Card className="bg-gradient-card border-border shadow-glow-card">
        <CardContent className="p-6 space-y-6">
          {/* Security Level Indicator */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-destructive" />
              <span className="text-sm text-destructive font-medium">
                Maximum Security Required
              </span>
            </div>
            <Badge variant="destructive">Critical Access</Badge>
          </div>

          {/* IP Allowlist Notice */}
          <div className="bg-secondary/50 border border-border rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Server className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-foreground">
                  Network Security
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
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
                  className="w-full h-12 bg-gradient-brand hover:opacity-90 text-primary-foreground font-medium"
                >
                  <Shield className="h-5 w-5 mr-2" />
                  Administrator SSO
                </Button>

                <Button
                  onClick={handleWebAuthn}
                  variant="outline"
                  className="w-full h-12 border-primary/20 hover:border-primary hover:bg-primary/5"
                >
                  <Fingerprint className="h-5 w-5 mr-2" />
                  WebAuthn (Security Key / Biometrics)
                </Button>
              </div>

              <div className="relative">
                <Separator className="my-6" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-card px-3 text-xs text-muted-foreground uppercase tracking-wider">
                    Emergency access only
                  </span>
                </div>
              </div>

              {/* Emergency Credentials */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    Administrator Username
                  </Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="admin.username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 h-11 bg-input border-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Secure Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="High-entropy password required"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-11 bg-input border-border"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleCredentialsSubmit}
                  disabled={!username || !password}
                  className="w-full h-11"
                >
                  Continue to 2FA
                </Button>
              </div>
            </>
          )}

          {authStep === "2fa" && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <Smartphone className="h-8 w-8 text-primary mx-auto" />
                <h3 className="font-medium">
                  Two-Factor Authentication Required
                </h3>
                <p className="text-sm text-muted-foreground">
                  Enter the code from your authenticator app or hardware token
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
                  onClick={handle2FASubmit}
                  disabled={twoFactorCode.length !== 6}
                  className="w-full h-11"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Authenticate & Access
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setAuthStep("recovery")}
                  className="w-full h-11"
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
                <Key className="h-8 w-8 text-destructive mx-auto" />
                <h3 className="font-medium">Recovery Code Access</h3>
                <p className="text-sm text-muted-foreground">
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
                <Label htmlFor="recovery" className="text-sm font-medium">
                  Recovery Code
                </Label>
                <Input
                  id="recovery"
                  type="text"
                  placeholder="XXXXX-XXXXX-XXXXX"
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value)}
                  className="text-center text-lg tracking-widest h-12 font-mono"
                />
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleRecoverySubmit}
                  disabled={!recoveryCode}
                  className="w-full h-11"
                >
                  Use Recovery Code
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setAuthStep("2fa")}
                  className="w-full h-11"
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
                <p className="text-xs text-muted-foreground leading-relaxed">
                  All administrator activities are logged and monitored.
                  Unauthorized access attempts will be reported to security
                  teams.
                </p>
              </div>
            </div>
          </div>

          {/* Support Contact */}
          <div className="text-center pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Access issues?{" "}
              <Button
                variant="link"
                className="text-primary p-0 h-auto font-medium"
              >
                Contact security team
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </LoginLayout>
  );
}
