import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StatsCounter from "@/components/StatsCounter";
import Services from "@/components/Services";
import Calculator from "@/components/Calculator";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { useScrollTracking } from "@/hooks/useScrollTracking";
import { userParams } from "@/lib/yandexMetrika";
import { getTrackingContext } from "@/lib/tracking";

const Index = () => {
  // Track scroll milestones
  useScrollTracking();

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
        <StatsCounter />
        <Services />
        <Calculator />
        <FAQ />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Index;
