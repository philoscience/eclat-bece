import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { fetchLeaderboardData } from "@/utils/leaderboard";

interface RankContextType {
  monthlyRank: number;
  monthlyPoints: number;
  isLoadingRank: boolean;
  error: string | null;
}

const RankContext = createContext<RankContextType | undefined>(undefined);

export const RankProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [monthlyRank, setMonthlyRank] = useState(0);
  const [monthlyPoints, setMonthlyPoints] = useState(0);
  const [isLoadingRank, setIsLoadingRank] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRankData = useCallback(async () => {
    if (!user?.id) {
      setMonthlyRank(0);
      setMonthlyPoints(0);
      setError(null);
      return;
    }

    setIsLoadingRank(true);
    setError(null);

    try {
      const data = await fetchLeaderboardData(user.id);
      setMonthlyRank(data.currentUserRanks?.monthly || 0);
      setMonthlyPoints(data.currentUserPoints?.monthly || 0);
    } catch (err) {
      console.error("Error fetching rank data:", err);
      setError("Failed to load rank data");
      setMonthlyRank(0);
      setMonthlyPoints(0);
    } finally {
      setIsLoadingRank(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadRankData();
    const interval = setInterval(() => {
      loadRankData();
    }, 30000);
    return () => clearInterval(interval);
  }, [loadRankData]);

  return (
    <RankContext.Provider value={{ monthlyRank, monthlyPoints, isLoadingRank, error }}>
      {children}
    </RankContext.Provider>
  );
};

export const useRank = () => {
  const context = useContext(RankContext);
  if (context === undefined) {
    throw new Error("useRank must be used within a RankProvider");
  }
  return context;
};
