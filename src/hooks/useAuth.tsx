import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  const { user, session, loading, signOut } = useAuthContext();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      navigate("/", { replace: true });
      window.location.reload();
    }
  };

  return { user, session, loading, signOut: handleSignOut };
};
