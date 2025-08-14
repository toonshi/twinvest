import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Building2, Mail, Lock, Key, Shield, CreditCard, FileText, Users } from "lucide-react";
import LoginLayout from "../LoginLayout";

export default function ClientLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleEnterpriseSSO = () => {
    console.log("Opening Enterprise SSO...");
  };

  const handleEmailLogin = () => {
    console.log("Company email login:", { email, password, companyId, accessCode });
  };

  return (
    <LoginLayout
      title="Client Portal"
      subtitle="Access and pay invoices through your enterprise account"
    >
      <Card className="bg-gradient-card border-border shadow-glow-card">
        <CardContent className="p-6 space-y-6">
          {/* Enterprise Features */}
          <div className="bg-gradient-accent rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-2 text-primary">
              <Building2 className="h-4 w-4" />
              <span className="text-sm font-medium">Enterprise Features</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="text-center">
                <CreditCard className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                <div>Payment processing</div>
              </div>
              <div className="text-center">
                <FileText className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                <div>Invoice management</div>
              </div>
              <div className="text-center">
                <Users className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                <div>Team collaboration</div>
              </div>
            </div>
          </div>

          {/* Primary: Enterprise SSO */}
          <div className="space-y-4">
            <Button
              onClick={handleEnterpriseSSO}
              className="w-full h-12 bg-gradient-brand hover:opacity-90 text-primary-foreground font-medium"
            >
              <Shield className="h-5 w-5 mr-2" />
              Enterprise SSO Login
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-11 border-primary/20 hover:border-primary hover:bg-primary/5"
              >
                <Building2 className="h-4 w-4 mr-2" />
                Okta
              </Button>
              <Button
                variant="outline"
                className="h-11 border-accent/20 hover:border-accent hover:bg-accent/5"
              >
                <Building2 className="h-4 w-4 mr-2" />
                Azure AD
              </Button>
            </div>
          </div>

          <div className="relative">
            <Separator className="my-6" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-card px-3 text-xs text-muted-foreground uppercase tracking-wider">
                Or sign in with company email
              </span>
            </div>
          </div>

          {/* Secondary: Company Email + Password */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Company Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="employee@company.com"
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

            {/* Company ID or Access Code */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="companyId" className="text-sm font-medium">
                  Company ID
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="companyId"
                    type="text"
                    placeholder="COMP123"
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    className="pl-10 h-11 bg-input border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accessCode" className="text-sm font-medium">
                  Access Code
                </Label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="accessCode"
                    type="text"
                    placeholder="Optional"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className="pl-10 h-11 bg-input border-border"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked)}
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
              disabled={!email || !password || !companyId}
              className="w-full h-11"
            >
              Access Company Portal
            </Button>
          </div>

          {/* Security Notice */}
          <div className="bg-secondary/50 border border-border rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-foreground">Enterprise Security</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your session is protected by enterprise-grade security.
                  All activities are monitored and logged for compliance.
                </p>
              </div>
            </div>
          </div>

          {/* Sign up link */}
          <div className="text-center pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Need enterprise access?{" "}
              <Button variant="link" className="text-primary p-0 h-auto font-medium">
                Contact your administrator
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </LoginLayout>
  );
}
