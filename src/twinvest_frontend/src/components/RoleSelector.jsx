// src/components/RoleSelector.jsx
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, DollarSign, Shield, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { loginWithII, roleVariant, routeByRole, checkAuthentication, getRoleKey } from '../lib/icp';
import { saveUserSession, getUserSession } from '../lib/auth';
import { toast } from '@/components/ui/use-toast';

export const RoleSelector = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    { 
      id: 'sme', 
      title: 'SME / Freelancer', 
      description: 'Upload invoices, tokenize as NFTs, and access immediate funding', 
      icon: Users, 
      color: 'from-primary/20 to-accent/20 border-primary/30',
      features: ['Upload & tokenize invoices', 'Instant funding access', 'NFT marketplace']
    },
    { 
      id: 'investor', 
      title: 'Investor', 
      description: 'Browse and invest in tokenized invoice NFTs for returns', 
      icon: TrendingUp, 
      color: 'from-success/20 to-primary/20 border-success/30',
      features: ['Diversified portfolio', 'Transparent yields', 'Risk assessment']
    },
    { 
      id: 'client', 
      title: 'Client / Payer', 
      description: 'Manage and pay outstanding invoices efficiently', 
      icon: DollarSign, 
      color: 'from-accent/20 to-secondary/20 border-accent/30',
      features: ['Invoice management', 'Payment processing', 'Vendor relations']
    },
    { 
      id: 'admin', 
      title: 'Platform Admin', 
      description: 'Oversee platform operations and user management', 
      icon: Shield, 
      color: 'from-warning/20 to-destructive/20 border-warning/30',
      features: ['User management', 'System monitoring', 'Analytics dashboard']
    }
  ];

  const onSelectRole = async (roleKey) => {
    setSelectedRole(roleKey);
    setIsLoading(true);

    try {
      const existingSession = getUserSession();
      
      if (existingSession) {
        const updatedSession = { ...existingSession, role: roleKey };
        saveUserSession(updatedSession, roleKey);
        navigate(`/dashboard/${roleKey}`);
        toast({ title: "Success", description: `Welcome to your ${roles.find(r => r.id === roleKey)?.title} dashboard!` });
        return;
      }

      localStorage.setItem('selectedRole', roleKey);

      try {
        const isAuthed = await checkAuthentication();
        if (isAuthed) {
          const { actor } = await loginWithII();
          const existingRole = await actor.get_my_role();
          if (!existingRole.length) {
            await actor.set_my_role(roleVariant(roleKey));
          }
          saveUserSession({ id: 'icp_user', authType: 'icp', role: roleKey }, roleKey);
          navigate(`/dashboard/${roleKey}`);
          toast({ title: "Success", description: `Welcome to your ${roles.find(r => r.id === roleKey)?.title} dashboard!` });
          return;
        }
      } catch (icpError) {
        console.warn('ICP role setting failed, continuing with local storage:', icpError);
        navigate(`/dashboard/${roleKey}`);
        toast({ title: "Success", description: `Welcome to your ${roles.find(r => r.id === roleKey)?.title} dashboard!` });
        return;
      }

      navigate(`/signin?role=${roleKey}`);
      toast({ title: "Sign In Required", description: `Please sign in to access your ${roles.find(r => r.id === roleKey)?.title} account.` });

    } catch (error) {
      console.error('Role selection failed:', error);
      toast({ title: "Error", description: "Failed to set role. Please try again.", variant: "destructive" });
    } finally {
      setSelectedRole(null);
      setIsLoading(false);
    }
  };

  const handleICPAuth = async () => {
    setIsLoading(true);
    try {
      const { actor } = await loginWithII();
      const roleOpt = await actor.get_my_role();
      if (roleOpt.length) {
        const roleKey = getRoleKey(roleOpt[0]);
        saveUserSession({ id: 'icp_user', authType: 'icp', role: roleKey }, roleKey);
        routeByRole(roleKey, navigate);
        toast({ title: "Success", description: "Signed in with ICP Identity successfully!" });
      } else {
        toast({ title: "Welcome", description: "Please select your role below to continue." });
      }
    } catch (error) {
      console.error('ICP authentication failed:', error);
      toast({ title: "Note", description: "ICP authentication unavailable. You can still proceed by selecting a role below." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-7xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">Welcome to Twinvest</h1>
          <p className="text-muted-foreground text-lg">Select your role to access the appropriate dashboard</p>
          <div className="flex justify-center mt-6">
            <Button variant="outline" onClick={handleICPAuth} disabled={isLoading} className="hover-ball border-primary/30">
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Connecting...</> : 'Continue with ICP Identity'}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {roles.map((role) => {
            const Icon = role.icon;
            const isCurrentlyLoading = selectedRole === role.id && isLoading;
            return (
              <Card
                key={role.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-elegant hover:scale-105 bg-gradient-to-br ${role.color} ${isCurrentlyLoading ? 'opacity-50' : ''}`}
                onClick={() => !isLoading && onSelectRole(role.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-background/80 flex items-center justify-center mb-4">
                    {isCurrentlyLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : <Icon className="h-8 w-8" />}
                  </div>
                  <CardTitle className="text-xl mb-2">{role.title}</CardTitle>
                  <CardDescription className="text-sm">{role.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 mb-4">
                    {role.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-xs text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" />{feature}
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="gradient"
                    className="w-full"
                    onClick={(e) => { e.stopPropagation(); if (!isLoading) onSelectRole(role.id); }}
                    disabled={isLoading}
                  >
                    {isCurrentlyLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Setting up...</> : 'Enter Dashboard'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center space-y-4 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">Already have an account?</p>
          <div className="flex justify-center gap-4">
            <Link to="/signin"><Button variant="outline" className="hover-ball">Sign In</Button></Link>
            <Link to="/signup"><Button className="hero-button">Create Account</Button></Link>
          </div>
        </div>

        <div className="text-center">
          <Link to="/"><Button variant="ghost" className="hover-ball"><ArrowLeft className="mr-2 h-4 w-4" />Back to Home</Button></Link>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;