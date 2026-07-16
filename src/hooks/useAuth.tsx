import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/components/AuthProvider";

export const useAuth = () => {
  const { user, session, loading, signOut } = useAuthContext();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    // Use window.location.href to force a full page reload and clear any cached state
    window.location.href = "/auth?role=student";
  };

  return { user, session, loading, signOut: handleSignOut };
};
