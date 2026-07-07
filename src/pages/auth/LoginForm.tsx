import { useState } from "react"; // 1. Import useState
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

// 2. Remove the password-toggle state from the props interface
interface LoginFormProps {
  role: string;
  isLoading: boolean;
  handleLogin: (e: React.FormEvent<HTMLFormElement>) => void;
  handleGoogleLogin: () => void;
  onForgotPasswordClick: () => void;
}

export function LoginForm({
  role,
  isLoading,
  handleLogin,
}: LoginFormProps) {
  // 3. Declare the visual state locally inside the component
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {/* ... Email field ... */}

      <div className="space-y-2">
        <Label htmlFor="login-password">Password</Label>
        <div className="relative">
          <Input
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"} // Use local state here
            placeholder="••••••••"
            required
            minLength={6}
            maxLength={100}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)} // Toggle local state here
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* ... Buttons & Forgot Password link ... */}
    </form>
  );
}