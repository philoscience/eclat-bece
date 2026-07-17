import { ReactNode, useEffect, useState } from "react";
import { Flame, Settings, User as UserIcon, KeyRound, Link2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationBell } from "@/components/NotificationBell";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/StudentSidebar";
import { StudentProfileSettings } from "@/components/StudentProfileSettings";
import { PasswordChangeDialog } from "@/components/PasswordChangeDialog";
import { AccountSettingsDialog } from "@/components/AccountSettingsDialog";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "next-themes";
import { getBadgeLevel, BadgeLevel } from "@/components/WinnerBadge";
import logoDark from "@/assets/logo-dark.png";
import logoLight from "@/assets/logo-light.png";

interface StudentLayoutProps {
  children: ReactNode;
}

export function StudentLayout({ children }: StudentLayoutProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [totalWins, setTotalWins] = useState(0);
  const [badgeLevel, setBadgeLevel] = useState<BadgeLevel>('bronze');
  
  const logo = theme === "dark" ? logoLight : logoDark;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      // Fetch profile data
      const { data: profileData } = await supabase
        .from("profiles")
        .select("avatar_url, display_name, email")
        .eq("id", user.id)
        .maybeSingle();

      if (profileData) {
        setAvatarUrl(profileData.avatar_url || "");
        setDisplayName(profileData.display_name || profileData.email || "");
      }

      // Fetch student data for badge stats
      const { data: studentData } = await supabase
        .from("students")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!studentData?.id) return;

      // Fetch quiz results to calculate wins
      const { data: quizResults } = await supabase
        .from("quiz_results")
        .select("score")
        .eq("student_id", studentData.id);

      if (quizResults) {
        const wins = quizResults.filter(result => result.score >= 80).length;
        setTotalWins(wins);
        setBadgeLevel(getBadgeLevel(wins));
      }
    };

    fetchUserData();
  }, [user]);

  const getInitials = () => {
    if (displayName) {
      return displayName.substring(0, 2).toUpperCase();
    }
    return "ST";
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-primary-light/20 via-background to-accent-light/20 dashboard-theme">
        <StudentSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b border-border/30 bg-gradient-to-r from-background via-background/98 to-background backdrop-blur-xl sticky top-0 z-50 shadow-[0_4px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
            <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-6 overflow-x-auto no-scrollbar">
                <SidebarTrigger className="md:hidden hover:scale-110 transition-transform duration-200 flex-shrink-0" />
                <img 
                  src={logo} 
                  alt="Éclat Logo" 
                  className="h-10 sm:h-12 md:h-16 w-auto cursor-pointer filter drop-shadow-lg flex-shrink-0" 
                  onClick={() => navigate("/")} 
                />
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                <NotificationBell />
                <ThemeToggle />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="hover:scale-110 transition-all duration-300 h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 rounded-full flex-shrink-0 p-0 relative"
                    >
                      <Avatar className="h-full w-full">
                        <AvatarImage src={avatarUrl} alt={displayName} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          <UserIcon className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      {totalWins > 0 && (
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs border-2 ${
                          badgeLevel === 'platinum' ? 'bg-cyan-100 dark:bg-cyan-900/30 border-cyan-300 dark:border-cyan-600' :
                          badgeLevel === 'gold' ? 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-600' :
                          badgeLevel === 'silver' ? 'bg-slate-100 dark:bg-slate-800/30 border-slate-300 dark:border-slate-600' :
                          'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700'
                        }`}>
                          <span>{badgeLevel === 'platinum' ? '💎' : badgeLevel === 'gold' ? '🥇' : badgeLevel === 'silver' ? '🥈' : '🥉'}</span>
                        </div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Profile Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPasswordDialogOpen(true)}>
                      <KeyRound className="mr-2 h-4 w-4" />
                      <span>Change Password</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setAccountSettingsOpen(true)}>
                      <Link2 className="mr-2 h-4 w-4" />
                      <span>Account Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
      
      <StudentProfileSettings open={settingsOpen} onOpenChange={setSettingsOpen} />
      <PasswordChangeDialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen} />
      <AccountSettingsDialog open={accountSettingsOpen} onOpenChange={setAccountSettingsOpen} />
    </SidebarProvider>
  );
}
