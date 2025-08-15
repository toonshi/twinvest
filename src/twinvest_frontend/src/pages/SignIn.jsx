import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Coins, ArrowLeft, Users, TrendingUp, DollarSign, Shield, Loader2 } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { saveUserSession } from '../lib/auth';

// Import your role-based login components
import FreelancerLogin from '@/components/login/FreelancerLogin';
import InvestorLogin from '@/components/login/InvestorLogin';
import ClientLogin from '@/components/login/ClientLogin';
import AdminLogin from '@/components/login/AdminLogin';

const SignIn = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check if role is specified in URL
  React.useEffect(() => {
    const roleFromUrl = searchParams.get('role');
    if (roleFromUrl && ['sme', 'investor', 'client', 'admin'].includes(roleFromUrl)) {
      setSelectedRole(roleFromUrl);
    }
  }, [searchParams]);

  const roles = [
    { 
      id: 'sme', 
      title: 'SME / Freelancer', 
      description: 'Upload invoices and get funded instantly',
      subtext: 'Upload invoices\nGet instant funding\nTokenize receivables',
      icon: Users, 
      color: 'from-primary/20 to-accent/20 border-primary/30' 
    },
    { 
      id: 'investor', 
      title: 'Investor', 
      description: 'Invest in tokenized invoice NFTs',
      subtext: 'Browse investments\nDiversified returns\nTransparent yields',
      icon: TrendingUp, 
      color: 'from-success/20 to-primary/20 border-success/30' 
    },
    { 
      id: 'client', 
      title: 'Client / Payer', 
      description: 'Manage and pay invoices efficiently',
      subtext: 'Pay invoices\nTrack payments\nEnterprise features',
      icon: DollarSign, 
      color: 'from-accent/20 to-secondary/20 border-accent/30' 
    },
    { 
      id: 'admin', 
      title: 'Platform Admin', 
      description: 'Manage platform operations',
      subtext: 'User management\nAnalytics dashboard\nSystem controls',
      icon: Shield, 
      color: 'from-warning/20 to-destructive/20 border-warning/30' 
    }
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    // Redirect to specific login page
    navigate(`/login/${roleId}`);
  };

  const handleBackToRoles = () => {
    setSelectedRole(null);
    navigate('/signin', { replace: true });
  };

  const renderRoleLogin = () => {
    switch (selectedRole) {
      case 'sme':
        return <FreelancerLogin />;
      case 'investor':
        return <InvestorLogin />;
      case 'client':
        return <ClientLogin />;
      case 'admin':
        return <AdminLogin />;
      default:
        return null;
    }
  };

  // If a role is selected, show the specific login component
  if (selectedRole) {
    return (
      <div className="min-h-screen">
        {renderRoleLogin()}
        <div className="fixed top-4 left-4">
          <Button variant="ghost" onClick={handleBackToRoles} className="hover-ball">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Role Selection
          </Button>
        </div>
      </div>
    );
  }

  // Role selection interface matching the design from your second image
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-7xl space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Coins className="h-8 w-8 text-primary glow-effect" />
            <span className="text-2xl font-bold gradient-text">Twinvest</span>
          </div>
          <h1 className="text-4xl font-bold">Join Twinvest</h1>
          <p className="text-muted-foreground text-lg">Choose your role and start revolutionizing cash flow</p>
        </div>

        {/* "Or choose your role to sign up" */}
        <div className="text-center">
          <p className="text-muted-foreground">Or choose your role to sign up</p>
        </div>

        {/* Role Cards - Matching your second image design */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card 
                key={role.id} 
                className="cursor-pointer transition-all duration-300 hover:shadow-elegant hover:scale-105 bg-card border border-border"
                onClick={() => handleRoleSelect(role.id)}
              >
                <CardContent className="p-6 text-center">
                  {/* Icon */}
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-semibold mb-2">{role.title}</h3>
                  
                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4">{role.description}</p>
                  
                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {role.subtext.split('\n').map((feature, idx) => (
                      <div key={idx} className="flex items-center text-xs text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  {/* Get Started Button */}
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom Navigation */}
        <div className="text-center space-y-4 pt-8">
          <div className="text-sm text-muted-foreground">
            Already have an account? 
            <Link to="/signin" className="text-primary hover:underline ml-1">Sign in here</Link>
          </div>
          
          {/* Back to Home */}
          <div>
            <Link to="/">
              <Button variant="ghost" className="hover-ball">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignIn;