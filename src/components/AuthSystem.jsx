import React, { useState } from 'react';

const AuthSystem = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    company: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.firstName) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName) {
        newErrors.lastName = 'Last name is required';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      if (isLogin) {
        // Check if user exists in registered users
        let user = registeredUsers.find(u => u.email === formData.email && u.password === formData.password);
        
        if (user) {
          setCurrentUser(user);
          setIsAuthenticated(true);
          console.log('Login successful:', user);
        } else {
          setErrors({ email: 'Invalid credentials. Please check your email and password.' });
        }
      } else {
        // Check if email already exists
        const existingUser = registeredUsers.find(u => u.email === formData.email);
        
        if (existingUser) {
          setErrors({ email: 'An account with this email already exists. Please login instead.' });
          setIsSubmitting(false);
          return;
        }

        // Register new user
        const newUser = {
          ...formData,
          id: Date.now(),
          registeredAt: new Date().toISOString(),
          provider: 'email'
        };
        setRegisteredUsers([...registeredUsers, newUser]);
        
        // Automatically log in the user after successful signup
        setCurrentUser(newUser);
        setIsAuthenticated(true);
        console.log('Signup successful and auto-login:', newUser);
      }
      
      setIsSubmitting(false);
      // Reset form
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        company: ''
      });
      setErrors({});
    }, 2000);
  };

  const handleGoogleLogin = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      // Simulate Google OAuth flow
      const mockGoogleUser = {
        email: 'user@gmail.com',
        firstName: 'Google',
        lastName: 'User',
        company: '',
        provider: 'google',
        avatar: '👤',
        id: Date.now(),
        registeredAt: new Date().toISOString()
      };
      
      // Check if user already exists
      let existingUser = registeredUsers.find(u => u.email === mockGoogleUser.email);
      
      if (existingUser) {
        // Update existing user to include Google provider
        existingUser.provider = 'google';
        existingUser.avatar = mockGoogleUser.avatar;
        setCurrentUser(existingUser);
      } else {
        // Add to registered users for future reference
        setRegisteredUsers(prev => [...prev, mockGoogleUser]);
        setCurrentUser(mockGoogleUser);
      }
      
      setIsAuthenticated(true);
      setIsSubmitting(false);
      console.log('Google login successful');
    }, 1500);
  };

  const handleGithubLogin = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      // Simulate GitHub OAuth flow
      const mockGithubUser = {
        email: 'user@github.com',
        firstName: 'GitHub',
        lastName: 'User',
        company: '',
        provider: 'github',
        username: 'githubuser',
        avatar: '👨‍💻',
        id: Date.now(),
        registeredAt: new Date().toISOString()
      };
      
      // Check if user already exists
      let existingUser = registeredUsers.find(u => u.email === mockGithubUser.email);
      
      if (existingUser) {
        // Update existing user to include GitHub provider
        existingUser.provider = 'github';
        existingUser.username = mockGithubUser.username;
        existingUser.avatar = mockGithubUser.avatar;
        setCurrentUser(existingUser);
      } else {
        // Add to registered users for future reference
        setRegisteredUsers(prev => [...prev, mockGithubUser]);
        setCurrentUser(mockGithubUser);
      }
      
      setIsAuthenticated(true);
      setIsSubmitting(false);
      console.log('GitHub login successful');
    }, 1500);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setIsLogin(true);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      company: ''
    });
    setErrors({});
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      company: ''
    });
    setErrors({});
  };

  // Success/Dashboard view
  if (isAuthenticated && currentUser) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center" style={{background: '#00040f'}}>
        <div className="w-full max-w-2xl relative z-10 text-center">
          <div className="rounded-3xl p-8 shadow-2xl border backdrop-blur-sm" style={{
            background: 'linear-gradient(-168.39deg, #ffffff -278.56%, #6d6d6d -78.47%, #11101d 91.61%)',
            borderColor: '#374151'
          }}>
            <div className="text-6xl mb-4">{currentUser.avatar || '🎉'}</div>
            <h1 className="font-bold text-3xl text-white mb-4">Welcome, {currentUser.firstName}!</h1>
            <p className="text-lg text-gray-300 mb-6">
              You have successfully {currentUser.provider === 'email' ? 'logged in' : `signed in with ${currentUser.provider}`}
            </p>
            
            <div className="bg-gray-800 rounded-lg p-4 mb-6 text-left">
              <h3 className="text-white font-semibold mb-2">Account Details:</h3>
              <p className="text-gray-300"><strong>Email:</strong> {currentUser.email}</p>
              <p className="text-gray-300"><strong>Name:</strong> {currentUser.firstName} {currentUser.lastName}</p>
              {currentUser.company && (
                <p className="text-gray-300"><strong>Company:</strong> {currentUser.company}</p>
              )}
              {currentUser.username && (
                <p className="text-gray-300"><strong>Username:</strong> {currentUser.username}</p>
              )}
              <p className="text-gray-300"><strong>Login Method:</strong> {currentUser.provider === 'email' ? 'Email/Password' : currentUser.provider}</p>
              <p className="text-gray-300"><strong>Account Created:</strong> {new Date(currentUser.registeredAt).toLocaleDateString()}</p>
            </div>

            <button
              onClick={handleLogout}
              className="px-6 py-3 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(157.81deg, #def9fa -43.27%, #bef3f5 -21.24%, #9dedf0 12.19%, #7de7eb 29.82%, #5ce1e6 51.94%, #33bbcf 90.29%)'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center relative overflow-hidden" style={{background: '#00040f'}}>
      {/* Background Gradient Effects */}
      <div className="absolute z-0 w-2/5 h-1/3 top-0 right-0 rounded-full opacity-30" style={{
        background: 'linear-gradient(90deg, #f4c4f3 0%, #fc67fa 100%)',
        filter: 'blur(900px)'
      }} />
      <div className="absolute z-0 w-4/5 h-4/5 rounded-full bottom-0 left-0 opacity-20" style={{
        background: 'rgba(255, 255, 255, 0.6)',
        filter: 'blur(750px)'
      }} />
      <div className="absolute z-0 w-1/2 h-1/2 right-20 bottom-20 opacity-25" style={{
        background: 'linear-gradient(180deg, rgba(188, 165, 255, 0) 0%, #214d76 100%)',
        filter: 'blur(123px)'
      }} />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-bold text-4xl text-white mb-2" style={{fontFamily: 'Poppins, sans-serif'}}>
            {isLogin ? 'Welcome Back!' : 'Join Us Today!'}
          </h1>
          <p className="text-lg" style={{color: 'rgba(255, 255, 255, 0.7)'}}>
            {isLogin 
              ? 'Sign in to access your SME financing platform' 
              : 'Create your account and start tokenizing invoices'
            }
          </p>
        </div>

        {/* Auth Card */}
        <div className="rounded-3xl p-8 shadow-2xl border backdrop-blur-sm" style={{
          background: 'linear-gradient(-168.39deg, #ffffff -278.56%, #6d6d6d -78.47%, #11101d 91.61%)',
          borderColor: '#374151'
        }}>
          <div className="space-y-6">
            {/* Signup specific fields */}
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 hover:border-cyan-500 ${
                        errors.firstName ? 'border-red-500' : 'border-gray-700'
                      }`}
                      placeholder="John"
                    />
                    {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 hover:border-cyan-500 ${
                        errors.lastName ? 'border-red-500' : 'border-gray-700'
                      }`}
                      placeholder="Doe"
                    />
                    {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 hover:border-cyan-500"
                    placeholder="Your Company Ltd."
                  />
                </div>
              </>
            )}

            {/* Email field */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 hover:border-cyan-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-700'
                }`}
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password field */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 hover:border-cyan-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-700'
                }`}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password for signup */}
            {!isLogin && (
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 hover:border-cyan-500 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-700'
                  }`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(157.81deg, #def9fa -43.27%, #bef3f5 -21.24%, #9dedf0 12.19%, #7de7eb 29.82%, #5ce1e6 51.94%, #33bbcf 90.29%)'
              }}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>

            {/* Forgot Password for login */}
            {isLogin && (
              <div className="text-center">
                <button
                  type="button"
                  className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors duration-300"
                >
                  Forgot your password?
                </button>
              </div>
            )}
          </div>

          {/* Social Login Options */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {/* Google Login */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
                className="w-full inline-flex justify-center py-3 px-4 border border-gray-700 rounded-lg bg-gray-900 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-300 hover:scale-105 disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="ml-2">Google</span>
              </button>

              {/* GitHub Login */}
              <button
                type="button"
                onClick={handleGithubLogin}
                disabled={isSubmitting}
                className="w-full inline-flex justify-center py-3 px-4 border border-gray-700 rounded-lg bg-gray-900 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-300 hover:scale-105 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="ml-2">GitHub</span>
              </button>
            </div>
          </div>

          {/* Toggle Auth Mode */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={toggleAuthMode}
                className="ml-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-300 hover:underline"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSystem;