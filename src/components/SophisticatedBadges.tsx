import { Trophy, Award, Star, Zap, Crown, Target, Flame, Medal, Gem, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earned: boolean;
  progress?: number;
  maxProgress?: number;
}

interface SophisticatedBadgesProps {
  badges: Badge[];
}

const rarityConfig = {
  common: {
    bgColor: 'from-gray-500/20 to-gray-600/10',
    borderColor: 'border-gray-400/30',
    glowColor: 'shadow-gray-400/20',
    textColor: 'text-gray-400'
  },
  rare: {
    bgColor: 'from-blue-500/20 to-cyan-500/10',
    borderColor: 'border-blue-400/50',
    glowColor: 'shadow-blue-400/30',
    textColor: 'text-blue-400'
  },
  epic: {
    bgColor: 'from-purple-500/20 to-pink-500/10',
    borderColor: 'border-purple-400/50',
    glowColor: 'shadow-purple-400/30',
    textColor: 'text-purple-400'
  },
  legendary: {
    bgColor: 'from-yellow-500/30 to-orange-500/20',
    borderColor: 'border-yellow-400/60',
    glowColor: 'shadow-yellow-400/40',
    textColor: 'text-yellow-400'
  }
};

export const SophisticatedBadges = ({ badges }: SophisticatedBadgesProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="text-accent" size={24} />
          <h3 className="text-2xl font-bold text-foreground">Achievement Badges</h3>
        </div>
        <div className="text-sm text-muted-foreground">
          {badges.filter(b => b.earned).length} / {badges.length} Earned
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((badge) => {
          const config = rarityConfig[badge.rarity];
          
          return (
            <Card
              key={badge.id}
              className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                badge.earned 
                  ? `${config.bgColor} ${config.borderColor} border-2 ${config.glowColor} shadow-lg` 
                  : 'bg-muted/30 border-border/30 opacity-50'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`relative p-3 rounded-xl ${
                    badge.earned 
                      ? `bg-gradient-to-br ${config.bgColor}` 
                      : 'bg-muted'
                  }`}>
                    <div className={`relative ${badge.earned ? 'animate-pulse' : ''}`}>
                      {badge.earned && (
                        <div className={`absolute inset-0 blur-xl ${config.glowColor}`} />
                      )}
                      <div className="relative">
                        {badge.icon}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-bold text-sm ${badge.earned ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {badge.name}
                      </h4>
                      {badge.earned && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${config.textColor} ${config.bgColor}`}>
                          {badge.rarity}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {badge.description}
                    </p>
                    
                    {badge.progress !== undefined && badge.maxProgress !== undefined && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                          <span>Progress</span>
                          <span>{badge.progress} / {badge.maxProgress}</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${config.bgColor}`}
                            style={{ width: `${Math.min((badge.progress / badge.maxProgress) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {badge.earned && (
                  <div className="absolute top-2 right-2">
                    <Sparkles className={`w-4 h-4 ${config.textColor}`} />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
