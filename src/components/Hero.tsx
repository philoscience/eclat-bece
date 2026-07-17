import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroStudy from "@/assets/Hero.jpg";

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
        {/* background gradient overlay remains */}
      </div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-light rounded-full text-accent font-semibold animate-scale-in">
            <Sparkles size={16} />
            <span>Nigeria's Premier Exam Prep Platform</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-bold leading-tight animate-slide-up" style={{ fontSize: '48px' }}>
             <span style={{ color: '#FFFFFF' }}>Ace BECE & Common Entrance.</span>
             <span style={{ color: '#40D3F2' }}> Compete Nationwide.</span>
             <span style={{ color: '#FF9E1B' }}> Win Big.</span>
          </h1>

          {/* Subheading */}
          <p className="mt-2 text-xl sm:text-2xl w-full max-w-4xl mx-auto leading-relaxed animate-slide-up" style={{ color: '#F3FEFF', textShadow: '0 2px 12px rgba(0, 0, 0, 0.58)', animationDelay: "0.1s" }}>
            Eclat: The only exam prep that feels like a tournament. Unlimited practice. Live national rankings. Real prizes for top performers.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Button variant="hero" size="lg" onClick={onGetStartedClick} className="w-full sm:w-auto">
              Get Started Free
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
};
