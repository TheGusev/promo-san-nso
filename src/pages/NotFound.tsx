import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    document.title = "404 — Страница не найдена | СанРешения";

    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "robots";
      document.head.appendChild(meta);
    }
    meta.content = "noindex, nofollow";

    return () => {
      meta.content = "index, follow";
    };
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="text-center max-w-md">
        <AlertTriangle className="mx-auto mb-4 h-16 w-16 text-primary" />
        <h1 className="mb-2 text-7xl font-extrabold text-primary">404</h1>
        <p className="mb-2 text-xl font-semibold text-foreground">Страница не найдена</p>
        <p className="mb-6 text-muted-foreground">
          Запрашиваемая страница не существует или была перемещена. Вернитесь на главную страницу сайта.
        </p>
        <Button asChild size="lg">
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            На главную
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
