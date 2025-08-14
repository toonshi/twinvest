import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
  const [isICPLoading, setIsICPLoading] = useState(false);
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
      description: 'Upload invoices and get funded', 
      icon: Users, 
      color: 'from-primary/20 to-accent/20 border-primary/30' 
    },
    { 
      id: 'investor', 
      title: 'Investor', 
      description: 'Browse and invest in invoice NFTs', 
      icon: TrendingUp, 
      color: 'from-success/20 to-primary/20 border-success/30' 
    },
    { 
      id: 'client', 
      title: 'Client / Payer', 
      description: 'Manage and pay invoices', 
      icon: DollarSign, 
      color: 'from-accent/20 to-secondary/20 border-accent/30' 
    },
    { 
      id: 'admin', 
      title: 'Platform Admin', 
      description: 'Platform operations management', 
      icon: Shield, 
      color: 'from-warning/20 to-destructive/20 border-warning/30' 
    }
  ];

  const handleICPLogin = async () => {
    setIsICPLoading(true);
    
    try {
      // Simulate ICP login - replace with actual ICP integration
      const mockUser = {
        id: 'icp_' + Math.random().toString(36).substr(2, 9),
        name: 'ICP User',
        authType: 'icp'
      };

      // If no role is selected, save session but redirect to role selector
      if (!selectedRole) {
        saveUserSession(mockUser);
        navigate('/role-selector');
        toast({
          title: "Welcome",
          description: "Please select your role to continue.",
        });
      } else {
        // Save session with role and redirect to dashboard
        saveUserSession({ ...mockUser, role: selectedRole }, selectedRole);
        navigate(`/dashboard/${selectedRole}`);
        toast({
          title: "Success",
          description: "Signed in with ICP Identity successfully!",
        });
      }
    } catch (error) {
      console.error('ICP login failed:', error);
      toast({
        title: "ICP Unavailable",
        description: "Please try traditional sign-in or contact support.",
        variant: "default",
      });
    } finally {
      setIsICPLoading(false);
    }
  };

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

  // Role selection interface
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute w-96 h-96 rounded-full opacity-20 -top-48 -left-48" 
          style={{ background: 'var(--gradient-primary)' }} 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }} 
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} 
        />
        <motion.div 
          className="absolute w-64 h-64 rounded-full opacity-30 -bottom-32 -right-32" 
          style={{ background: 'var(--gradient-secondary)' }} 
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }} 
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }} 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        transition={{ duration: 0.5 }} 
        className="relative z-10 w-full max-w-5xl"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6 hover-ball p-2 rounded-lg">
            <Coins className="h-8 w-8 text-primary glow-effect" />
            <span className="text-2xl font-bold gradient-text">Twinvest</span>
          </Link>
          <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
          <p className="text-muted-foreground text-lg">Select your role to access your dashboard</p>
        </div>

        <div className="feature-card p-8 backdrop-blur-xl bg-card/80 mb-6">
          {/* ICP Quick Login */}
          <div className="text-center mb-8">
            <Button 
              onClick={handleICPLogin}
              className="w-full max-w-md mx-auto h-12 bg-gradient-brand hover:opacity-90 text-primary-foreground font-medium"
              disabled={isICPLoading}
            >
              {isICPLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting with ICP...
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5 mr-2" />
                  Continue with ICP Identity
                </>
              )}
            </Button>
          </div>

          <div className="relative mb-8">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-card px-4 text-sm text-muted-foreground">
                Or sign in with your role
              </span>
            </div>
          </div>

          {/* Role Selection Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {roles.map((role) => {
              const Icon = role.icon;
              
              return (
                <Card
                  key={role.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 bg-gradient-to-br ${role.color}`}
                  onClick={() => handleRoleSelect(role.id)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-background/80 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">{role.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{role.description}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Sign In
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Sign up here
            </Link>
          </div>
          
          <Link to="/">
            <Button variant="ghost" className="hover-ball">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;