import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, Eye, EyeOff, ArrowLeft, User, Mail, Lock, Loader2, Users, TrendingUp, DollarSign, Shield } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const SignUp = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    password: '', 
    confirmPassword: '', 
    agreeToTerms: false 
  });
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validation
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (formData.password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      if (!formData.agreeToTerms) {
        throw new Error('Please accept the terms and conditions');
      }

      if (!selectedRole) {
        throw new Error('Please select a role');
      }

      // Simulate successful registration
      toast({
        title: "Success",
        description: `${roles.find(r => r.id === selectedRole)?.title} account created successfully!`,
      });

      // Navigate to appropriate dashboard
      navigate(`/dashboard/${selectedRole}`);

    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    navigate(`/signup?role=${roleId}`, { replace: true });
  };

  const handleBackToRoles = () => {
    setSelectedRole(null);
    navigate('/signup', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        transition={{ duration: 0.5 }} 
        className="relative z-10 w-full max-w-6xl"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Coins className="h-8 w-8 text-primary glow-effect" />
            <span className="text-2xl font-bold gradient-text">Twinvest</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">
            {selectedRole ? `Create ${roles.find(r => r.id === selectedRole)?.title} Account` : 'Join Twinvest'}
          </h1>
          <p className="text-muted-foreground text-lg">
            {selectedRole ? 'Fill out the form below to get started' : 'Choose your role and start revolutionizing cash flow'}
          </p>
        </div>

        {!selectedRole ? (
          /* Role Selection View - Matching the design from your second image */
          <div className="space-y-8">
            {/* "Or choose your role to sign up" */}
            <div className="text-center">
              <p className="text-muted-foreground">Or choose your role to sign up</p>
            </div>

            {/* Role Selection Grid */}
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

            <div className="text-center space-y-4 pt-8">
              <div className="text-muted-foreground">
                Already have an account?{' '}
                <Link to="/signin" className="text-primary hover:underline font-medium">
                  Sign in here
                </Link>
              </div>
              
              <Link to="/">
                <Button variant="ghost" className="hover-ball">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Registration Form View */
          <div className="max-w-md mx-auto">
            <div className="feature-card p-8 backdrop-blur-xl bg-card/80">
              {/* Selected Role Badge */}
              <div className="flex items-center justify-center mb-6">
                <Badge variant="outline" className="text-sm px-4 py-2">
                  {roles.find(r => r.id === selectedRole)?.icon && 
                    React.createElement(roles.find(r => r.id === selectedRole).icon, { className: "h-4 w-4 mr-2" })
                  }
                  {roles.find(r => r.id === selectedRole)?.title}
                </Badge>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="firstName" 
                        placeholder="John" 
                        value={formData.firstName} 
                        onChange={(e) => handleInputChange('firstName', e.target.value)} 
                        className="hover-ball pl-10" 
                        required 
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="lastName" 
                        placeholder="Doe" 
                        value={formData.lastName} 
                        onChange={(e) => handleInputChange('lastName', e.target.value)} 
                        className="hover-ball pl-10" 
                        required 
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="john@example.com" 
                      value={formData.email} 
                      onChange={(e) => handleInputChange('email', e.target.value)} 
                      className="hover-ball pl-10" 
                      required 
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="password" 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="Create a strong password" 
                      value={formData.password} 
                      onChange={(e) => handleInputChange('password', e.target.value)} 
                      className="hover-ball pl-10 pr-10" 
                      required 
                      disabled={isLoading}
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" 
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="confirmPassword" 
                      type={showConfirmPassword ? 'text' : 'password'} 
                      placeholder="Confirm your password" 
                      value={formData.confirmPassword} 
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)} 
                      className="hover-ball pl-10 pr-10" 
                      required 
                      disabled={isLoading}
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={formData.agreeToTerms} 
                    onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked)} 
                    required 
                    disabled={isLoading}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                  </Label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full hero-button" 
                  disabled={!formData.agreeToTerms || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    `Create ${roles.find(r => r.id === selectedRole)?.title} Account`
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Button variant="link" onClick={handleBackToRoles} className="text-muted-foreground">
                  Change Role Selection
                </Button>
              </div>

              <div className="mt-4 text-center">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link to="/signin" className="text-primary hover:underline font-medium">Sign in</Link>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Button variant="ghost" onClick={handleBackToRoles} className="hover-ball">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Role Selection
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SignUp;