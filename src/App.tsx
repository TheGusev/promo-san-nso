import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ABTestProvider } from "@/contexts/ABTestContext";
import Index from "./pages/Index";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminLeads from "./pages/admin/Leads";
import AdminReviews from "./pages/admin/Reviews";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminMVT from "./pages/admin/MVT";
import AdminSettings from "./pages/admin/Settings";
import Dezinfeksiya from "./pages/services/Dezinfeksiya";
import Dezinseksiya from "./pages/services/Dezinseksiya";
import Deratizatsiya from "./pages/services/Deratizatsiya";
import Ozonirovanie from "./pages/services/Ozonirovanie";
import Dezodoratsiya from "./pages/services/Dezodoratsiya";
import Sertifikatsiya from "./pages/services/Sertifikatsiya";

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
              <Route path="/" element={<Index />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/dezinfeksiya" element={<Dezinfeksiya />} />
              <Route path="/dezinseksiya" element={<Dezinseksiya />} />
              <Route path="/deratizatsiya" element={<Deratizatsiya />} />
              <Route path="/ozonirovanie" element={<Ozonirovanie />} />
              <Route path="/dezodoratsiya" element={<Dezodoratsiya />} />
              <Route path="/sertifikatsiya" element={<Sertifikatsiya />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />}>
                <Route index element={<AdminLeads />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="mvt" element={<AdminMVT />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ABTestProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
