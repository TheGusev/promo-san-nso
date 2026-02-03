import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ABTestProvider } from "@/contexts/ABTestContext";

// Страницы
import Index from "./pages/Index";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

// Новые страницы
import UslugiIndex from "./pages/uslugi/Index";
import ServicePage from "./pages/usluga/ServicePage";
import VreditediIndex from "./pages/vrediteli/Index";
import PestPage from "./pages/vreditel/PestPage";
import ObektyIndex from "./pages/obekty/Index";
import ObjectPage from "./pages/obekt/ObjectPage";
import RayonyIndex from "./pages/rayony/Index";
import BlogIndex from "./pages/blog/Index";

// Админка
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminLeads from "./pages/admin/Leads";
import AdminReviews from "./pages/admin/Reviews";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminMVT from "./pages/admin/MVT";
import AdminSettings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <ABTestProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Главная */}
              <Route path="/" element={<Index />} />
              
              {/* Услуги */}
              <Route path="/uslugi" element={<UslugiIndex />} />
              <Route path="/usluga/:serviceSlug" element={<ServicePage />} />
              
              {/* Вредители */}
              <Route path="/vrediteli" element={<VreditediIndex />} />
              <Route path="/vreditel/:pestSlug" element={<PestPage />} />
              
              {/* Объекты */}
              <Route path="/obekty" element={<ObektyIndex />} />
              <Route path="/obekt/:objectSlug" element={<ObjectPage />} />
              
              {/* Районы */}
              <Route path="/rayony" element={<RayonyIndex />} />
              {/* TODO: <Route path="/rayon/:districtSlug" element={<DistrictPage />} /> */}
              
              {/* Блог */}
              <Route path="/blog" element={<BlogIndex />} />
              {/* TODO: <Route path="/blog/:articleSlug" element={<ArticlePage />} /> */}
              
              {/* Редиректы со старых URL */}
              <Route path="/dezinfeksiya" element={<Navigate to="/usluga/dezinfeksiya" replace />} />
              <Route path="/dezinseksiya" element={<Navigate to="/usluga/dezinseksiya" replace />} />
              <Route path="/deratizatsiya" element={<Navigate to="/usluga/deratizatsiya" replace />} />
              <Route path="/ozonirovanie" element={<Navigate to="/usluga/ozonirovanie" replace />} />
              <Route path="/dezodoratsiya" element={<Navigate to="/usluga/dezodoratsiya" replace />} />
              <Route path="/sertifikatsiya" element={<Navigate to="/usluga/sertifikatsiya" replace />} />
              
              {/* Политика конфиденциальности */}
              <Route path="/privacy" element={<Privacy />} />
              
              {/* Админка */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />}>
                <Route index element={<AdminLeads />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="mvt" element={<AdminMVT />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ABTestProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
