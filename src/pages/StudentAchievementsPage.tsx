import { useState, useEffect } from "react";
import { Trophy, Loader2, BookOpen, Award, Star, Zap, Crown, Flame, Medal, Gem } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SophisticatedBadges } from "@/components/SophisticatedBadges";

export default function StudentAchievementsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sophisticatedBadges, setSophisticatedBadges] = useState<any[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  useEffect(() => {
    const fetchAchievementsData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch student data
        const { data: studentData, error: studentError } = await supabase
          .from("students")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (studentError || !studentData) {
          throw new Error("Student profile not found.");
        }

        const studentId = studentData.id;

        // Fetch quiz results
        const { data: quizResults, error: quizError } = await supabase
          .from("quiz_results")
          .select("*")
          .eq("student_id", studentId)
          .order("completed_at", { ascending: false });

        if (quizError) throw quizError;

        // Fetch streak data
        const { data: streakData } = await supabase
          .from("student_streaks")
          .select("*")
          .eq("student_id", studentId)
          .maybeSingle();

        setCurrentStreak(streakData?.current_streak || 0);
        setLongestStreak(streakData?.longest_streak || 0);

        if (!quizResults || quizResults.length === 0) {
          setSophisticatedBadges([
            {
              id: 'first-quiz',
              name: "First Steps",
              description: "Complete your first practice quiz",
              icon: <BookOpen size={24} className="text-blue-400" />,
              rarity: 'common',
              earned: false,
              progress: 0,
              maxProgress: 1
            },
            {
              id: 'quiz-master',
              name: "Quiz Master",
              description: "Complete 10 practice quizzes",
              icon: <Award size={24} className="text-purple-400" />,
              rarity: 'rare',
              earned: false,
              progress: 0,
              maxProgress: 10
            },
            {
              id: 'streak-warrior',
              name: "Streak Warrior",
              description: "Maintain a 5-day practice streak",
              icon: <Flame size={24} className="text-red-400" />,
              rarity: 'rare',
              earned: currentStreak >= 5,
              progress: Math.min(currentStreak, 5),
              maxProgress: 5
            },
            {
              id: 'top-10',
              name: "Top 10%",
              description: "Rank in the top 10% nationally",
              icon: <Trophy size={24} className="text-yellow-400" />,
              rarity: 'epic',
              earned: false
            },
            {
              id: 'perfectionist',
              name: "Perfectionist",
              description: "Achieve a perfect score (100%)",
              icon: <Medal size={24} className="text-green-400" />,
              rarity: 'epic',
              earned: false,
              progress: 0,
              maxProgress: 1
            },
            {
              id: 'week-warrior',
              name: "Week Warrior",
              description: "Complete a quiz this week",
              icon: <Zap size={24} className="text-yellow-400" />,
              rarity: 'common',
              earned: false,
              progress: 0,
              maxProgress: 1
            }
          ]);
          setLoading(false);
          return;
        }

        // Calculate achievements
        const firstQuiz = quizResults.length >= 1;
        const tenQuiz = quizResults.length >= 10;
        const fiftyQuiz = quizResults.length >= 50;
        const hundredQuiz = quizResults.length >= 100;
        const streakBadge = longestStreak >= 5;
        const streakMaster = longestStreak >= 10;
        const perfectScore = quizResults.some(q => q.score === 100);
        const perfectScores = quizResults.filter(q => q.score === 100).length;
        const highScorer = quizResults.filter(q => q.score >= 90).length >= 5;
        
        // Questions this week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const hasRecentQuiz = quizResults.some(q => new Date(q.completed_at) >= oneWeekAgo);

        // To determine Top 10%
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const { data: monthlyResults } = await supabase
          .from("quiz_results")
          .select("student_id, score")
          .gte("completed_at", firstDayOfMonth);

        let top10Badge = false;
        let top5Badge = false;
        if (monthlyResults && monthlyResults.length > 0) {
          const studentScores = new Map<string, number[]>();
          monthlyResults.forEach(r => {
            if (!studentScores.has(r.student_id)) {
              studentScores.set(r.student_id, []);
            }
            studentScores.get(r.student_id)!.push(r.score);
          });
          const studentAverages = Array.from(studentScores.entries()).map(([id, scores]) => ({
            id,
            avg: scores.reduce((sum, score) => sum + score, 0) / scores.length
          }));
          studentAverages.sort((a, b) => b.avg - a.avg);
          const rank = studentAverages.findIndex(s => s.id === studentId) + 1;
          const totalStudents = studentAverages.length;
          top10Badge = rank > 0 && (rank / totalStudents <= 0.1 || rank <= 3);
          top5Badge = rank > 0 && (rank / totalStudents <= 0.05 || rank <= 2);
        } else {
          const avgScore = quizResults.reduce((sum, q) => sum + q.score, 0) / quizResults.length;
          top10Badge = avgScore >= 85;
          top5Badge = avgScore >= 90;
        }

        setSophisticatedBadges([
          {
            id: 'first-quiz',
            name: "First Steps",
            description: "Complete your first practice quiz",
            icon: <BookOpen size={24} className="text-blue-400" />,
            rarity: 'common',
            earned: firstQuiz,
            progress: Math.min(quizResults.length, 1),
            maxProgress: 1
          },
          {
            id: 'quiz-master',
            name: "Quiz Master",
            description: "Complete 10 practice quizzes",
            icon: <Award size={24} className="text-purple-400" />,
            rarity: 'rare',
            earned: tenQuiz,
            progress: Math.min(quizResults.length, 10),
            maxProgress: 10
          },
          {
            id: 'quiz-legend',
            name: "Quiz Legend",
            description: "Complete 50 practice quizzes",
            icon: <Star size={24} className="text-yellow-400" />,
            rarity: 'epic',
            earned: fiftyQuiz,
            progress: Math.min(quizResults.length, 50),
            maxProgress: 50
          },
          {
            id: 'quiz-champion',
            name: "Quiz Champion",
            description: "Complete 100 practice quizzes",
            icon: <Crown size={24} className="text-orange-400" />,
            rarity: 'legendary',
            earned: hundredQuiz,
            progress: Math.min(quizResults.length, 100),
            maxProgress: 100
          },
          {
            id: 'streak-warrior',
            name: "Streak Warrior",
            description: "Maintain a 5-day practice streak",
            icon: <Flame size={24} className="text-red-400" />,
            rarity: 'rare',
            earned: streakBadge || currentStreak >= 5,
            progress: Math.min(currentStreak, 5),
            maxProgress: 5
          },
          {
            id: 'streak-master',
            name: "Streak Master",
            description: "Maintain a 10-day practice streak",
            icon: <Zap size={24} className="text-yellow-400" />,
            rarity: 'epic',
            earned: streakMaster || currentStreak >= 10,
            progress: Math.min(currentStreak, 10),
            maxProgress: 10
          },
          {
            id: 'perfectionist',
            name: "Perfectionist",
            description: "Achieve a perfect score (100%)",
            icon: <Medal size={24} className="text-green-400" />,
            rarity: 'epic',
            earned: perfectScore,
            progress: perfectScores,
            maxProgress: 1
          },
          {
            id: 'high-scorer',
            name: "High Scorer",
            description: "Score 90% or higher in 5 quizzes",
            icon: <Gem size={24} className="text-cyan-400" />,
            rarity: 'rare',
            earned: highScorer,
            progress: Math.min(quizResults.filter(q => q.score >= 90).length, 5),
            maxProgress: 5
          },
          {
            id: 'top-10',
            name: "Top 10%",
            description: "Rank in the top 10% nationally",
            icon: <Trophy size={24} className="text-yellow-400" />,
            rarity: 'epic',
            earned: top10Badge
          },
          {
            id: 'top-5',
            name: "Elite 5%",
            description: "Rank in the top 5% nationally",
            icon: <Crown size={24} className="text-orange-400" />,
            rarity: 'legendary',
            earned: top5Badge
          },
          {
            id: 'week-warrior',
            name: "Week Warrior",
            description: "Complete a quiz this week",
            icon: <Zap size={24} className="text-yellow-400" />,
            rarity: 'common',
            earned: hasRecentQuiz,
            progress: hasRecentQuiz ? 1 : 0,
            maxProgress: 1
          }
        ]);

      } catch (err) {
        console.error("Error loading achievements data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievementsData();
  }, [user]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground font-medium animate-pulse">Loading achievements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 animate-fade-in">
        <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight flex items-center gap-2">
          <Trophy className="text-accent" size={32} />
          Your Achievements <span className="text-primary">.</span>
        </h2>
        <p className="text-muted-foreground font-medium text-sm sm:text-base mt-1">Track your badges and accomplishments</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-slide-up">
        <Card className="bg-gradient-to-br from-primary-light/30 to-primary-light/10 border-primary-light/40 shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-3xl font-bold text-primary">{currentStreak} days</p>
              </div>
              <Flame className="text-primary" size={32} />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 border-purple-500/30 shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Longest Streak</p>
                <p className="text-3xl font-bold text-purple-600">{longestStreak} days</p>
              </div>
              <Award className="text-purple-600" size={32} />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/10 border-yellow-500/30 shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Badges Earned</p>
                <p className="text-3xl font-bold text-yellow-600">{sophisticatedBadges.filter(b => b.earned).length}</p>
              </div>
              <Trophy className="text-yellow-600" size={32} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <div className="animate-scale-in">
        <SophisticatedBadges badges={sophisticatedBadges} />
      </div>
    </div>
  );
}
