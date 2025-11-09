import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { useNavigate } from "react-router-dom";

interface NavigationProps {
  onLoginClick: () => void;
  onGetStartedClick: () => void;
}

export const Navigation = ({ onLoginClick, onGetStartedClick }: NavigationProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/98 backdrop-blur-md border-b border-border/50 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-200" 
            onClick={() => {
              navigate("/");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <img src={logo} alt="Éclat Logo" className="h-14 w-auto" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <button
              onClick={() => scrollToSection("about")}
              className="text-foreground/90 hover:text-primary transition-all duration-200 font-semibold text-[15px] tracking-tight hover:scale-105"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="text-foreground/90 hover:text-primary transition-all duration-200 font-semibold text-[15px] tracking-tight hover:scale-105"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("leaderboard")}
              className="text-foreground/90 hover:text-primary transition-all duration-200 font-semibold text-[15px] tracking-tight hover:scale-105"
            >
              Leaderboard
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-foreground/90 hover:text-primary transition-all duration-200 font-semibold text-[15px] tracking-tight hover:scale-105"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-foreground/90 hover:text-primary transition-all duration-200 font-semibold text-[15px] tracking-tight hover:scale-105"
            >
              Contact
            </button>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline" onClick={onLoginClick} className="font-semibold text-[15px] px-6 h-11">
              Login
            </Button>
            <Button variant="hero" onClick={onGetStartedClick} className="font-semibold text-[15px] px-6 h-11 shadow-lg">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2.5 text-foreground hover:text-primary transition-colors rounded-lg hover:bg-accent/50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 space-y-2 border-t border-border/50 animate-fade-in bg-background">
            <button
              onClick={() => scrollToSection("about")}
              className="block w-full text-left px-5 py-3.5 text-foreground/90 hover:text-primary hover:bg-accent/50 rounded-lg transition-all duration-200 font-semibold text-[15px]"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="block w-full text-left px-5 py-3.5 text-foreground/90 hover:text-primary hover:bg-accent/50 rounded-lg transition-all duration-200 font-semibold text-[15px]"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("leaderboard")}
              className="block w-full text-left px-5 py-3.5 text-foreground/90 hover:text-primary hover:bg-accent/50 rounded-lg transition-all duration-200 font-semibold text-[15px]"
            >
              Leaderboard
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="block w-full text-left px-5 py-3.5 text-foreground/90 hover:text-primary hover:bg-accent/50 rounded-lg transition-all duration-200 font-semibold text-[15px]"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="block w-full text-left px-5 py-3.5 text-foreground/90 hover:text-primary hover:bg-accent/50 rounded-lg transition-all duration-200 font-semibold text-[15px]"
            >
              Contact
            </button>
            <div className="px-4 pt-6 space-y-3 border-t border-border/50 mt-4">
              <Button variant="outline" className="w-full font-semibold text-[15px] h-11" onClick={onLoginClick}>
                Login
              </Button>
              <Button variant="hero" className="w-full font-semibold text-[15px] h-11 shadow-lg" onClick={onGetStartedClick}>
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
