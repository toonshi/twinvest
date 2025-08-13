import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, DollarSign, Shield, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { loginWithII, roleVariant, routeByRole, checkAuthentication } from '../lib/icp';
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
      color: 'from-primary/20 to-accent/20 border-primary/30' 
    },
    { 
      id: 'investor', 
      title: 'Investor', 
      description: 'Browse and invest in tokenized invoice NFTs for returns', 
      icon: TrendingUp, 
      color: 'from-success/20 to-primary/20 border-success/30' 
    },
    { 
      id: 'client', 
      title: 'Client / Payer', 
      description: 'Manage and pay outstanding invoices efficiently', 
      icon: DollarSign, 
      color: 'from-accent/20 to-secondary/20 border-accent/30' 
    },
    { 
      id: 'admin', 
      title: 'Platform Admin', 
      description: 'Oversee platform operations and user management', 
      icon: Shield, 
      color: 'from-warning/20 to-destructive/20 border-warning/30' 
    }
  ];

  const onSelectRole = async (roleKey) => {
    setSelectedRole(roleKey);
    setIsLoading(true);

    try {
      // Store role selection locally first
      localStorage.setItem('selectedRole', roleKey);
      
      // Try to authenticate with ICP and set role
      try {
        const isAuthenticated = await checkAuthentication();
        
        if (isAuthenticated) {
          const { actor } = await loginWithII();
          const existingRole = await actor.get_my_role();
          
          if (!existingRole.length) {
            await actor.set_my_role(roleVariant(roleKey));
          }
        }
      } catch (icpError) {
        console.warn('ICP role setting failed, continuing with local storage:', icpError);
        // Continue anyway - user can still use the app with local storage
      }
      
      // Always route to dashboard regardless of ICP success/failure
      navigate(`/dashboard/${roleKey}`);
      
      toast({
        title: "Success",
        description: `Welcome to your ${roles.find(r => r.id === roleKey)?.title} dashboard!`,
      });
      
    } catch (error) {
      console.error('Role selection failed:', error);
      toast({
        title: "Error",
        description: "Failed to set role. Please try again.",
        variant: "destructive",
      });
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
        routeByRole(roleOpt[0], navigate);
        toast({
          title: "Success",
          description: "Signed in with ICP Identity successfully!",
        });
      } else {
        toast({
          title: "Welcome",
          description: "Please select your role below to continue.",
        });
      }
    } catch (error) {
      console.error('ICP authentication failed:', error);
      toast({
        title: "Note",
        description: "ICP authentication unavailable. You can still proceed by selecting a role below.",
        variant: "default",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-6xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Welcome to Twinvest
          </h1>
          <p className="text-muted-foreground">Select your role to access the appropriate dashboard</p>
          
          {/* ICP Authentication Option */}
          <div className="flex justify-center mt-6">
            <Button 
              variant="outline" 
              onClick={handleICPAuth}
              className="hover-ball border-primary/30"
            >
              Continue with ICP Identity
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
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-background/80 flex items-center justify-center mb-4">
                    {isCurrentlyLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                  </div>
                  <CardTitle className="text-lg">{role.title}</CardTitle>
                  <CardDescription className="text-sm">{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="gradient"
                    className="w-full"
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      if (!isLoading) onSelectRole(role.id);
                    }}
                    disabled={isLoading}
                  >
                    {isCurrentlyLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Setting up...
                      </>
                    ) : (
                      'Enter Dashboard'
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Back to home option */}
        <div className="text-center">
          <Link to="/">
            <Button variant="ghost" className="hover-ball">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;