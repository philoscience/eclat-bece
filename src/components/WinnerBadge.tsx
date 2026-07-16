import { Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export type BadgeLevel = 'bronze' | 'silver' | 'gold' | 'platinum';

interface WinnerBadgeProps {
  level: BadgeLevel;
  wins: number;
  isFirstWin?: boolean;
}

const badgeConfig = {
  bronze: {
    color: 'text-amber-600',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    borderColor: 'border-amber-300 dark:border-amber-700',
    glow: 'shadow-amber-500/20',
    icon: '🥉',
    label: 'Bronze Winner',
    description: '1-5 wins'
  },
  silver: {
    color: 'text-slate-400',
    bgColor: 'bg-slate-100 dark:bg-slate-800/30',
    borderColor: 'border-slate-300 dark:border-slate-600',
    glow: 'shadow-slate-400/20',
    icon: '🥈',
    label: 'Silver Winner',
    description: '6-15 wins'
  },
  gold: {
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    borderColor: 'border-yellow-300 dark:border-yellow-600',
    glow: 'shadow-yellow-500/30',
    icon: '🥇',
    label: 'Gold Winner',
    description: '16-30 wins'
  },
  platinum: {
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
    borderColor: 'border-cyan-300 dark:border-cyan-600',
    glow: 'shadow-cyan-400/30',
    icon: '💎',
    label: 'Platinum Champion',
    description: '30+ wins'
  }
};

export const getBadgeLevel = (wins: number): BadgeLevel => {
  if (wins >= 30) return 'platinum';
  if (wins >= 16) return 'gold';
  if (wins >= 6) return 'silver';
  return 'bronze';
};

export const WinnerBadge = ({ level, wins, isFirstWin = false }: WinnerBadgeProps) => {
  const config = badgeConfig[level];

  return (
    <Card className={`border-2 ${config.borderColor} ${config.bgColor} ${config.glow} shadow-lg hover:scale-105 transition-all duration-300`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-12 h-12 rounded-full ${config.bgColor} ${config.borderColor} border-2 flex items-center justify-center`}>
              <span className="text-2xl">{config.icon}</span>
            </div>
            {isFirstWin && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-background" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Award className={`w-4 h-4 ${config.color}`} />
              <span className={`font-bold text-sm ${config.color}`}>{config.label}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{config.description}</p>
            <p className="text-xs font-semibold text-foreground mt-1">{wins} {wins === 1 ? 'Win' : 'Wins'}</p>
          </div>
        </div>
        
        {isFirstWin && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full animate-pulse">
                🎉 First Win!
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
