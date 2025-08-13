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
import RoleSelector from "./components/RoleSelector";

// Role-based dashboard components
import { DashboardOverview } from "./components/DashboardOverview";
import { InvoiceManagement } from "./components/InvoiceManagement";
import { InvestorOffers } from "./components/InvestorOffers";
import { TransactionHistory } from "./components/TransactionHistory";
import { WalletDashboard } from "./components/WalletDashboard";
import { ProfileKYC } from "./components/ProfileKYC";
import { InvestorDashboard } from "./components/InvestorDashboard";
import { ClientDashboard } from "./components/ClientDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { DashboardSidebar } from "./components/DashboardSidebar";

const queryClient = new QueryClient();

// SME Dashboard Layout
const SMEDashboard = () => {
  const [activeSection, setActiveSection] = React.useState("overview");

  const renderSMEContent = () => {
    switch (activeSection) {
      case "overview": return <DashboardOverview />;
      case "invoices": return <InvoiceManagement />;
      case "offers": return <InvestorOffers />;
      case "transactions": return <TransactionHistory />;
      case "wallet": return <WalletDashboard />;
      case "profile": return <ProfileKYC />;
      default: return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        userRole="sme"
      />
      <main className="flex-1 p-6 overflow-auto">
        {renderSMEContent()}
      </main>
    </div>
  );
};

const AppContent = () => {
  const location = useLocation();
  
  // Hide navbar on sign-in, sign-up, dashboard, and role selector pages
  const hideNavbar = ['/signin', '/signup', '/dashboard', '/role-selector'].includes(location.pathname) || 
                     location.pathname.startsWith('/dashboard/');

  return (
    <>
      {!hideNavbar && <NavBar />}
      <div className={hideNavbar ? '' : 'pt-20'}>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/features" element={<FeaturesSection />} />
          <Route path="/marketplace" element={<PricingSection />} />
          <Route path="/about" element={<TestimonialsSection />} />
          
          {/* Role selector route */}
          <Route path="/role-selector" element={<RoleSelector />} />
          
          {/* Dashboard routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/sme" element={<SMEDashboard />} />
          <Route path="/dashboard/investor" element={<InvestorDashboard />} />
          <Route path="/dashboard/client" element={<ClientDashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          
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