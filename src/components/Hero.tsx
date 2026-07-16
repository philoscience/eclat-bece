import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroStudy from "@/assets/logo-child1.jpeg";

interface HeroProps {
  onGetStartedClick: () => void;
}

export const Hero = ({ onGetStartedClick }: HeroProps) => {
  return (
    <section id="hero" className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroStudy} 
          alt="Students studying" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/10 via-primary-light/5 to-background/10"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-light rounded-full text-accent font-semibold animate-scale-in">
            <Sparkles size={16} />
            <span>Nigeria's Premier Exam Prep Platform</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-bold leading-tight animate-slide-up" style={{ color: 'rgb(158, 137, 15)', fontSize: '48px' }}>
             Ace BECE & Common Entrance. Compete Nationwide. Win Big.
          </h1>

          {/* Subheading */}
          <p className="text-xl sm:text-2xl max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ color: 'white', animationDelay: "0.1s" }}>
            Eclat: The only exam prep that feels like a tournament. Unlimited practice. Live national rankings. Real prizes for top performers
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Button variant="hero" size="lg" onClick={onGetStartedClick} className="w-full sm:w-auto">
              Get Started Free
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto animate-scale-in" style={{ animationDelay: "0.3s" }}>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary">5K+</div>
              <div className="text-sm text-white mt-1">Nigerian Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary">50K+</div>
              <div className="text-sm text-white mt-1">Practice Questions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-accent">₦1.5M+</div>
              <div className="text-sm text-white mt-1">Prizes Awarded</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
