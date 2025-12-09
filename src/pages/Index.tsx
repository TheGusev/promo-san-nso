import { useEffect, lazy, Suspense } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StatsCounter from "@/components/StatsCounter";
import WhyChooseUs from "@/components/WhyChooseUs";
import HowWeWork from "@/components/HowWeWork";
import Services from "@/components/Services";
import Calculator from "@/components/Calculator";
import FloatingButtons from "@/components/FloatingButtons";
import PopupForm from "@/components/PopupForm";
import { useEngagementTracking } from "@/hooks/useEngagementTracking";
import { useTrafficLogging } from "@/hooks/useTrafficLogging";
import { userParams } from "@/lib/yandexMetrika";
import { getTrackingContext } from "@/lib/tracking";

// Lazy load below-the-fold components to reduce initial bundle size
const Reviews = lazy(() => import("@/components/Reviews"));
const Articles = lazy(() => import("@/components/Articles"));
const FAQ = lazy(() => import("@/components/FAQ"));
const Footer = lazy(() => import("@/components/Footer"));

const Index = () => {
  // Track engagement metrics (time on page, scroll depth, scroll milestones)
  useEngagementTracking();
  
  // Log page view and traffic events
  useTrafficLogging();

  // Send user parameters on page load
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
      <Header />
      <main>
        <Hero />
        <Calculator />
        <StatsCounter />
        <WhyChooseUs />
        <HowWeWork />
        <div className="below-fold">
          <Suspense fallback={<div className="h-96" />}>
            <section id="reviews">
              <Reviews />
            </section>
          </Suspense>
        </div>
        <section id="services">
          <Services />
        </section>
        <div className="below-fold">
          <Suspense fallback={<div className="h-96" />}>
            <section id="articles">
              <Articles />
            </section>
          </Suspense>
        </div>
        <div className="below-fold">
          <Suspense fallback={<div className="h-64" />}>
            <FAQ />
          </Suspense>
        </div>
      </main>
      <div className="below-fold">
        <Suspense fallback={<div className="h-32" />}>
          <section id="footer">
            <Footer />
          </section>
        </Suspense>
      </div>
      <FloatingButtons />
      <PopupForm />
    </div>
  );
};

export default Index;
