import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroStudy from "@/assets/Hero.jpg";

interface HeroProps {
  onGetStartedClick: () => void;
}

export const Hero = ({ onGetStartedClick }: HeroProps) => {
  return (
    <section id="hero" className="relative flex min-h-[95vh] sm:min-h-[100vh] lg:min-h-[105vh] pt-10 sm:pt-12 lg:pt-14 pb-[10px] px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 bg-[rgb(1,28,58)]">
        <img 
          src={heroStudy} 
          alt="Students studying" 
          className="w-full h-full object-cover object-center scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/10 via-primary-light/5 to-background/10"></div>
        {/* background gradient overlay remains */}
      </div>

      <div className="container mx-auto relative z-10 flex flex-1">
        <div className="max-w-5xl mx-auto flex flex-1 flex-col text-center animate-fade-in">
          {/* Main Heading */}
          <h1 className="font-bold leading-tight animate-slide-up" style={{ fontSize: '48px' }}>
             <span style={{ color: '#FFFFFF' }}>Ace BECE & Common Entrance. Dominate</span>
             <span style={{ color: '#40D3F2' }}> National Leaderboards.</span>
             <span style={{ color: '#FF9E1B' }}> Win Real Prizes.</span>
          </h1>

          <div className="flex-[0.6]" />

          {/* Subheading */}
          <p className="mb-[30px] text-xl sm:text-2xl w-full max-w-4xl mx-auto leading-relaxed animate-slide-up" style={{ color: '#F3FEFF', textShadow: '0 2px 12px rgba(0, 0, 0, 0.58)', animationDelay: "0.1s" }}>
            Eclat: The only exam prep that feels like a tournament. Unlimited practice. Live national rankings. Real prizes for top performers.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Button variant="hero" size="lg" onClick={onGetStartedClick} className="w-full sm:w-auto">
              Get Started Free
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
};
