import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Coins, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { loginWithII, routeByRole, authenticateTraditional } from '../lib/icp';
import { toast } from '@/components/ui/use-toast';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isICPLoading, setIsICPLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authenticateTraditional({ email, password });
      
      toast({
        title: "Success",
        description: "Signed in successfully!",
      });
      
      // For traditional auth, redirect to role selector
      navigate('/role-selector');
      
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in. Please try again.",
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
        routeByRole(roleOpt[0], navigate);
        toast({
          title: "Success",
          description: "Signed in with ICP Identity successfully!",
        });
      } else {
        navigate('/role-selector');
        toast({
          title: "Welcome",
          description: "Please select your role to continue.",
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
        className="relative z-10 w-full max-w-md"
      >
        <div className="feature-card p-8 backdrop-blur-xl bg-card/80">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6 hover-ball p-2 rounded-lg">
              <Coins className="h-8 w-8 text-primary glow-effect" />
              <span className="text-2xl font-bold gradient-text">Twinvest</span>
            </Link>
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="hover-ball" 
                required 
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Enter your password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="hover-ball pr-10" 
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

            <div className="flex items-center justify-between">
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full hero-button" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
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
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
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

export default SignIn;