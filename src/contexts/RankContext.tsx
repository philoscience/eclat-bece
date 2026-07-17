import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { fetchLeaderboardData } from "@/utils/leaderboard";

interface RankContextType {
  monthlyRank: number;
  monthlyPoints: number;
  isLoadingRank: boolean;
  error: string | null;
  refreshRank: () => Promise<void>;
  refreshPoints: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

const RankContext = createContext<RankContextType | undefined>(undefined);

export const RankProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [monthlyRank, setMonthlyRank] = useState(0);
  const [monthlyPoints, setMonthlyPoints] = useState(0);
  const [isLoadingRank, setIsLoadingRank] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshRank = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    setIsLoadingRank(true);
    setError(null);

    try {
      const data = await fetchLeaderboardData(user.id);
      setMonthlyRank(data.currentUserRanks?.monthly || 0);
    } catch (err) {
      console.error("Error fetching rank data:", err);
      setError("Failed to load rank data");
      setMonthlyRank(0);
    } finally {
      setIsLoadingRank(false);
    }
  }, [user?.id]);

  const refreshPoints = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    setIsLoadingRank(true);
    setError(null);

    try {
      const data = await fetchLeaderboardData(user.id);
      setMonthlyPoints(data.currentUserPoints?.monthly || 0);
    } catch (err) {
      console.error("Error fetching points data:", err);
      setError("Failed to load points data");
      setMonthlyPoints(0);
    } finally {
      setIsLoadingRank(false);
    }
  }, [user?.id]);

  const refreshAll = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    setIsLoadingRank(true);
    setError(null);

    try {
      const data = await fetchLeaderboardData(user.id);
      setMonthlyRank(data.currentUserRanks?.monthly || 0);
      setMonthlyPoints(data.currentUserPoints?.monthly || 0);
    } catch (err) {
      console.error("Error fetching rank and points data:", err);
      setError("Failed to load rank and points data");
      setMonthlyRank(0);
      setMonthlyPoints(0);
    } finally {
      setIsLoadingRank(false);
    }
  }, [user?.id]);

  // Auto-refresh rank when user logs in
  useEffect(() => {
    if (user?.id) {
      refreshAll();
    } else {
      // Reset when user logs out
      setMonthlyRank(0);
      setMonthlyPoints(0);
      setError(null);
    }
  }, [user?.id, refreshAll]);

  return (
    <RankContext.Provider value={{ monthlyRank, monthlyPoints, isLoadingRank, error, refreshRank, refreshPoints, refreshAll }}>
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
