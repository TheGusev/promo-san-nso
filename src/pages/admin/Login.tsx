import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Shield } from "lucide-react";
import { z } from "zod";

// Zod validation schema
const loginSchema = z.object({
  email: z.string().email("Некорректный формат email"),
  password: z.string().min(8, "Пароль должен быть не менее 8 символов"),
});

// Rate limiting constants
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes
const STORAGE_KEY = "admin_login_attempts";

interface LoginAttempts {
  count: number;
  lockedUntil: number | null;
}

function getLoginAttempts(): LoginAttempts {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore parse errors
  }
  return { count: 0, lockedUntil: null };
}

function setLoginAttempts(attempts: LoginAttempts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));
}

function clearLoginAttempts() {
  localStorage.removeItem(STORAGE_KEY);
}

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Add noindex meta tag for admin login page
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  const checkLockout = (): boolean => {
    const attempts = getLoginAttempts();
    if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
      const remainingMinutes = Math.ceil((attempts.lockedUntil - Date.now()) / 60000);
      toast({
        title: "Временная блокировка",
        description: `Слишком много неудачных попыток. Попробуйте через ${remainingMinutes} мин.`,
        variant: "destructive",
      });
      return true;
    }
    // Clear lockout if expired
    if (attempts.lockedUntil && Date.now() >= attempts.lockedUntil) {
      clearLoginAttempts();
    }
    return false;
  };

  const recordFailedAttempt = () => {
    const attempts = getLoginAttempts();
    const newCount = attempts.count + 1;
    
    if (newCount >= MAX_ATTEMPTS) {
      setLoginAttempts({
        count: newCount,
        lockedUntil: Date.now() + LOCKOUT_DURATION_MS,
      });
    } else {
      setLoginAttempts({
        count: newCount,
        lockedUntil: null,
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]);

    // Check rate limiting
    if (checkLockout()) {
      return;
    }

    // Validate input with Zod
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      const errors = validation.error.issues.map(issue => issue.message);
      setValidationErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: validation.data.email,
        password: validation.data.password,
      });

      if (error) {
        recordFailedAttempt();
        // Generic error message to prevent enumeration
        throw new Error("Неверный email или пароль");
      }

      // Check admin role
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (roleError) {
        recordFailedAttempt();
        throw new Error("Неверный email или пароль");
      }

      if (!roleData) {
        await supabase.auth.signOut();
        recordFailedAttempt();
        throw new Error("Неверный email или пароль");
      }

      // Clear attempts on successful login
      clearLoginAttempts();

      toast({
        title: "Успешный вход",
        description: "Добро пожаловать в админ-панель",
      });

      navigate("/admin");
    } catch (error: any) {
      toast({
        title: "Ошибка входа",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Админ-панель</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
            {validationErrors.length > 0 && (
              <div className="text-sm text-destructive space-y-1">
                {validationErrors.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Вход...
                </>
              ) : (
                "Войти"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
