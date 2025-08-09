import React from 'react';

import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import FeaturesSection from "./components/FeaturesSection";
import PricingSection from "./components/PricingSection";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/features" element={<FeaturesSection />} />
          <Route path="/marketplace" element={<PricingSection />} />
          {/* Catch-all route for unmatched paths */}
          <Route path="*" element={<NotFound />} />
        </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;