// src/components/RoleSelector.jsx
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, DollarSign, Shield, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
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
      features: ['Upload & tokenize invoices', 'Instant funding access', 'NFT marketplace'],
      disabled: false // Enable all roles since dashboards exist
    },
    { 
      id: 'investor', 
      title: 'Investor', 
      description: 'Browse and invest in tokenized invoice NFTs for returns', 
      icon: TrendingUp, 
      color: 'from-success/20 to-primary/20 border-success/30',
      features: ['Diversified portfolio', 'Transparent yields', 'Risk assessment'],
      disabled: false // Only investor is enabled
    },
    { 
      id: 'client', 
      title: 'Client / Payer', 
      description: 'Manage and pay outstanding invoices efficiently', 
      icon: DollarSign, 
      color: 'from-accent/20 to-secondary/20 border-accent/30',
      features: ['Invoice management', 'Payment processing', 'Vendor relations'],
      disabled: false // Enable all roles since dashboards exist
    },
    { 
      id: 'admin', 
      title: 'Platform Admin', 
      description: 'Oversee platform operations and user management', 
      icon: Shield, 
      color: 'from-warning/20 to-destructive/20 border-warning/30',
      features: ['User management', 'System monitoring', 'Analytics dashboard'],
      disabled: false // Enable all roles since dashboards exist
    }
  ];

  const onSelectRole = (roleKey) => {
    setSelectedRole(roleKey);
    setIsLoading(true);

    // Store selected role for later use
    localStorage.setItem('selectedRole', roleKey);

    // Navigate directly to the appropriate login page
    navigate(`/login/${roleKey}`);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-7xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Welcome to Twinvest
          </h1>
          <p className="text-muted-foreground text-lg">
            Choose your role to access the appropriate dashboard
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {roles.map((role) => {
            const Icon = role.icon;
            const isCurrentlyLoading = selectedRole === role.id && isLoading;
            const isDisabled = role.disabled;
            
            return (
              <Card
                key={role.id}
                className={`cursor-pointer transition-all duration-300 bg-gradient-to-br ${role.color} ${
                  isCurrentlyLoading ? 'opacity-50' : ''
                } ${
                  isDisabled ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-elegant hover:scale-105'
                }`}
                onClick={() => !isLoading && !isDisabled && onSelectRole(role.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-background/80 flex items-center justify-center mb-4">
                    {isCurrentlyLoading ? (
                      <Loader2 className="h-8 w-8 animate-spin" />
                    ) : (
                      <Icon className={`h-8 w-8 ${isDisabled ? 'text-muted-foreground' : ''}`} />
                    )}
                  </div>
                  <CardTitle className={`text-xl mb-2 ${isDisabled ? 'text-muted-foreground' : ''}`}>
                    {role.title}
                  </CardTitle>
                  <CardDescription className={`text-sm ${isDisabled ? 'text-muted-foreground/60' : ''}`}>
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 mb-4">
                    {role.features.map((feature, idx) => (
                      <div key={idx} className={`flex items-center text-xs ${isDisabled ? 'text-muted-foreground/60' : 'text-muted-foreground'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full mr-2 flex-shrink-0 ${isDisabled ? 'bg-muted-foreground/60' : 'bg-primary'}`} />
                        {feature}
                      </div>
                    ))}
                  </div>
                  <Button
                    variant={isDisabled ? "outline" : "gradient"}
                    className="w-full"
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      if (!isLoading && !isDisabled) onSelectRole(role.id); 
                    }}
                    disabled={isLoading || isDisabled}
                  >
                    {isCurrentlyLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Redirecting...
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

        {/* Authentication Options */}
        <div className="text-center space-y-4 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">Already have an account?</p>
          <div className="flex justify-center gap-4">
            <Button 
              onClick={() => navigate('/signin')}
              variant="outline" 
              className="hover-ball"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => navigate('/signup')}
              className="hero-button"
            >
              Create Account
            </Button>
          </div>
        </div>

        {/* Back to Home */}
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