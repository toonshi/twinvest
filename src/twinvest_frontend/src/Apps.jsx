import React from "react";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useLocation } from "react-router-dom";

import NavBar from "./components/NavBar";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import FeaturesSection from "./components/FeaturesSection";
import PricingSection from "./components/PricingSection";
import TestimonialsSection from "./components/TestimonialsSection";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  
  // Hide navbar on sign-in, sign-up, and dashboard pages
  const hideNavbar = ['/signin', '/signup', '/dashboard'].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <NavBar />}
      <div className={hideNavbar ? '' : 'pt-20'}> {/* Add padding-top when navbar is visible */}
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/features" element={<FeaturesSection />} />
          <Route path="/marketplace" element={<PricingSection />} />
          <Route path="/about" element={<TestimonialsSection />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;