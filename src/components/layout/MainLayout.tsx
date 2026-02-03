import { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import FloatingButtons from "@/components/FloatingButtons";
import PopupForm from "@/components/PopupForm";

// сюда вставим код Яндекс.Метрики

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <FloatingButtons />
      <PopupForm />
      {/* CookieConsent будет добавлен позже */}
    </div>
  );
}
