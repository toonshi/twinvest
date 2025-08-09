// ==================== Index.jsx ====================
import React, { useState } from "react";

// Landing page sections
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import StatsSection from "@/components/StatsSection";
import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";

// Dashboard components
import { Button } from "@/components/ui/button";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardOverview } from "@/components/DashboardOverview";
import { InvoiceManagement } from "@/components/InvoiceManagement";
import { InvestorOffers } from "@/components/InvestorOffers";
import { TransactionHistory } from "@/components/TransactionHistory";
import { WalletDashboard } from "@/components/WalletDashboard";
import { ProfileKYC } from "@/components/ProfileKYC";
import { InvestorDashboard } from "@/components/InvestorDashboard";
import { ClientDashboard } from "@/components/ClientDashboard";
import { AdminDashboard } from "@/components/AdminDashboard";
import { RoleSelector } from "@/components/RoleSelector";

const Index = () => {
  const [userRole, setUserRole] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  console.log("Render -> isLoggedIn:", isLoggedIn, "userRole:", userRole);

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

  const renderRoleBasedDashboard = () => {
    switch (userRole) {
      case "sme": return renderSMEContent();
      case "investor": return <InvestorDashboard />;
      case "client": return <ClientDashboard />;
      case "admin": return <AdminDashboard />;
      default: return <DashboardOverview />;
    }
  };

  const handleRoleSelect = (role) => {
    console.log("Role selected:", role);
    setUserRole(role);
  };

  const handleRoleChange = () => {
    setUserRole(null);
    setActiveSection("overview"); // Reset to overview when switching roles
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setActiveSection("overview");
  };

  // Landing page
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen space-y-10">
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <PricingSection />
        <TestimonialsSection />
        <CTASection />
        <div className="flex justify-center mt-8">
          <Button onClick={() => setIsLoggedIn(true)}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  // Role selection screen
  if (isLoggedIn && !userRole) {
    return (
      <div>
        <RoleSelector onRoleSelect={handleRoleSelect} />
        <div className="fixed top-4 right-4">
          <Button variant="outline" onClick={handleLogout}>
            Back to Landing
          </Button>
        </div>
      </div>
    );
  }

  // SME Dashboard with sidebar
  if (userRole === "sme") {
    return (
      <div className="min-h-screen bg-background flex">
        <DashboardSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          userRole={userRole}
          onRoleChange={handleRoleChange}
        />
        <main className="flex-1 p-6 overflow-auto">
          {renderSMEContent()}
        </main>
      </div>
    );
  }

  // Other role dashboards
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Twinvest
          </h1>
          <span className="text-sm text-muted-foreground">
            {userRole === "investor"
              ? "Investor Portal"
              : userRole === "client"
              ? "Client Portal"
              : userRole === "admin"
              ? "Admin Portal"
              : ""}
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRoleChange}>
            Switch Role
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
      {renderRoleBasedDashboard()}
    </div>
  );
};

export default Index;