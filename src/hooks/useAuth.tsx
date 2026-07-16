import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  const { user, session, loading, signOut } = useAuthContext();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // Clear all local storage to ensure session is completely removed
    localStorage.clear();
    sessionStorage.clear();
    // Use window.location.href to force a full page reload and clear any cached state
    window.location.href = "/auth?role=student";
  };

  return { user, session, loading, signOut: handleSignOut };
};
