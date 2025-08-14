// src/components/NavBar.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Coins, Menu, X, LogIn, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userRole, hasStoredRole, getUserRoleConfig } = useUserRole();
  const navigate = useNavigate();

  // Role-aware navigation handlers
  const handleSignIn = () => {
    if (hasStoredRole && userRole) {
      const config = getUserRoleConfig(userRole);
      navigate(config.loginPath);
    } else {
      navigate('/signin');
    }
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleGetStarted = () => {
    if (hasStoredRole && userRole) {
      const config = getUserRoleConfig(userRole);
      navigate(config.dashboardPath);
    } else {
      navigate('/role-selector');
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/features', label: 'Features' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/about', label: 'About' },
    { href: '/dashboard', label: 'Dashboard' },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="mx-auto max-w-7xl">
        <div className="feature-card backdrop-blur-xl bg-card/80">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 hover-ball p-2 rounded-lg">
              <div className="relative">
                <Coins className="h-8 w-8 text-primary glow-effect" />
                <div className="pulse-ring w-8 h-8 top-0 left-0"></div>
              </div>
              <span className="text-xl font-bold gradient-text">Twinvest</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" className="hover-ball" onClick={handleSignIn}>
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
              <Button className="hero-button" onClick={handleSignUp}>
                <UserPlus className="h-4 w-4 mr-2" />
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover-ball"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pt-4 border-t border-border"
            >
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex flex-col space-y-2 pt-4">
                  <Button
                    variant="ghost"
                    className="w-full hover-ball"
                    onClick={() => {
                      handleSignIn();
                      setIsOpen(false);
                    }}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                  <Button
                    className="w-full hero-button"
                    onClick={() => {
                      handleSignUp();
                      setIsOpen(false);
                    }}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Get Started
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default NavBar;
