import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function LoginLayout({ children, title, subtitle }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-brand opacity-10" />
        <div className="flex flex-col justify-center items-center p-12 relative z-10">
          <h1 className="text-6xl font-bold bg-gradient-brand bg-clip-text text-transparent mb-6">
            Twinvest
          </h1>
          <p className="text-xl text-center text-muted-foreground max-w-md leading-relaxed">
            Revolutionizing invoice financing through blockchain technology
          </p>
          <div className="mt-12 grid grid-cols-2 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">$2.4B+</div>
              <div className="text-sm text-muted-foreground">Processed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent">50K+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            className="mb-8 text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to role selection
          </Button>

          {/* Mobile Brand Header */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-brand bg-clip-text text-transparent mb-2">
              Twinvest
            </h1>
          </div>

          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">{title}</h2>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>

          {/* Form Content */}
          {children}

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-4">
            <div className="flex justify-center space-x-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Help</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
