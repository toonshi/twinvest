import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Coins, Eye, EyeOff, ArrowLeft, User, Mail, Lock, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { loginWithII, routeByRole, registerTraditional } from '../lib/icp';
import { toast } from '@/components/ui/use-toast';

const SignUp = () => {
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
  const [isICPLoading, setIsICPLoading] = useState(false);
  const navigate = useNavigate();

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

      await registerTraditional(formData);

      toast({
        title: "Success",
        description: "Account created successfully!",
      });

      navigate('/role-selector');

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

  const handleICPLogin = async () => {
    setIsICPLoading(true);
    
    try {
      const { actor } = await loginWithII();
      const roleOpt = await actor.get_my_role();
      
      if (roleOpt.length) {
        // User has a role, route to their dashboard
        routeByRole(roleOpt[0], navigate);
        toast({
          title: "Success",
          description: "Signed in with ICP Identity successfully!",
        });
      } else {
        // User doesn't have a role yet, go to role selector
        navigate('/role-selector');
        toast({
          title: "Welcome",
          description: "Please select your role to continue.",
        });
      }
    } catch (error) {
      console.error('ICP login failed:', error);
      toast({
        title: "Error",
        description: "Failed to sign in with ICP Identity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsICPLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute w-96 h-96 rounded-full opacity-20 -top-48 -right-48" 
          style={{ background: 'var(--gradient-primary)' }} 
          animate={{ scale: [1, 1.1, 1], rotate: [0, -180, -360] }} 
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} 
        />
        <motion.div 
          className="absolute w-64 h-64 rounded-full opacity-30 -bottom-32 -left-32" 
          style={{ background: 'var(--gradient-secondary)' }} 
          animate={{ scale: [1.1, 1, 1.1], rotate: [-360, -180, 0] }} 
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        transition={{ duration: 0.5 }} 
        className="relative z-10 w-full max-w-md"
      >
        <div className="feature-card p-8 backdrop-blur-xl bg-card/80">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6 hover-ball p-2 rounded-lg">
              <Coins className="h-8 w-8 text-primary glow-effect" />
              <span className="text-2xl font-bold gradient-text">Twinvest</span>
            </Link>
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-muted-foreground">Join thousands revolutionizing cash flow</p>
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
                'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-6">
            <Separator className="my-6" />
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full hover-ball border-border/50 backdrop-blur-sm" 
                onClick={handleICPLogin}
                disabled={isICPLoading || isLoading}
              >
                {isICPLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Continue with ICP Identity'
                )}
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/signin" className="text-primary hover:underline font-medium">Sign in</Link>
          </div>
        </div>

        <Link to="/">
          <Button variant="ghost" className="mt-4 hover-ball">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default SignUp;