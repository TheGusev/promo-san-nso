import { useEffect, useState } from "react";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, FileText, MessageSquare, Home, BarChart3, FlaskConical, Settings, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/admin/login");
        return;
      }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleData) {
        await supabase.auth.signOut();
        navigate("/admin/login");
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      navigate("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const navItems = [
    { path: "/admin", label: "Заявки", icon: FileText, exact: true },
    { path: "/admin/reviews", label: "Отзывы", icon: MessageSquare },
    { path: "/admin/analytics", label: "Аналитика", icon: BarChart3 },
    { path: "/admin/mvt", label: "A/B-тесты", icon: FlaskConical },
    { path: "/admin/settings", label: "Настройки", icon: Settings },
  ];

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      {navItems.map((item) => {
        const isActive = item.exact 
          ? location.pathname === item.path
          : location.pathname.startsWith(item.path);
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              isActive 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <SheetHeader>
                  <SheetTitle>Меню</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 mt-4">
                  <NavLinks onNavigate={() => setMobileOpen(false)} />
                </nav>
                <div className="absolute bottom-4 left-4 right-4 space-y-2">
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to="/" onClick={() => setMobileOpen(false)}>
                      <Home className="h-4 w-4 mr-2" />
                      На сайт
                    </Link>
                  </Button>
                  <Button variant="destructive" size="sm" className="w-full" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Выйти
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <h1 className="text-lg font-bold">Админ</h1>
            
            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              <NavLinks />
            </nav>
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                На сайт
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <Outlet />
      </main>
    </div>
  );
}
