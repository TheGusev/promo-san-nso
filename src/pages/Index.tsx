import { useEffect, lazy, Suspense } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Calculator from "@/components/Calculator";
import AboutSection from "@/components/AboutSection";
import FloatingContact from "@/components/FloatingContact";
import PopupForm from "@/components/PopupForm";
import { useEngagementTracking } from "@/hooks/useEngagementTracking";
import { useTrafficLogging } from "@/hooks/useTrafficLogging";
import { userParams } from "@/lib/yandexMetrika";
import { getTrackingContext } from "@/lib/tracking";

const Reviews = lazy(() => import("@/components/Reviews"));

const FAQ = lazy(() => import("@/components/FAQ"));
const Footer = lazy(() => import("@/components/Footer"));

const Index = () => {
  useEngagementTracking();
  useTrafficLogging();

  useEffect(() => {
    const tracking = getTrackingContext();
    userParams({
      intent: tracking.intent,
      device_type: tracking.device_type,
      utm_source: tracking.utm_source,
      utm_medium: tracking.utm_medium,
      utm_campaign: tracking.utm_campaign,
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <Services />
        <Calculator />
        <AboutSection />
        <Suspense fallback={<div className="h-96" />}>
          <section id="reviews">
            <Reviews />
          </section>
        </Suspense>
        <Suspense fallback={<div className="h-64" />}>
          <FAQ />
        </Suspense>
      </main>
      <Suspense fallback={<div className="h-32" />}>
        <section id="footer">
          <Footer />
        </section>
      </Suspense>
      <FloatingContact />
      <PopupForm />
    </div>
  );
};

export default Index;
