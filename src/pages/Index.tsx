import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StatsCounter from "@/components/StatsCounter";
import WhyChooseUs from "@/components/WhyChooseUs";
import HowWeWork from "@/components/HowWeWork";
import Services from "@/components/Services";
import Calculator from "@/components/Calculator";
import Reviews from "@/components/Reviews";
import Articles from "@/components/Articles";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import PopupForm from "@/components/PopupForm";
import { useScrollTracking } from "@/hooks/useScrollTracking";
import { useTrafficLogging } from "@/hooks/useTrafficLogging";
import { userParams } from "@/lib/yandexMetrika";
import { getTrackingContext } from "@/lib/tracking";

const Index = () => {
  // Track scroll milestones
  useScrollTracking();
  
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
        <StatsCounter />
        <WhyChooseUs />
        <HowWeWork />
        <section id="services">
          <Services />
        </section>
        <Calculator />
        <section id="reviews">
          <Reviews />
        </section>
        <section id="articles">
          <Articles />
        </section>
        <FAQ />
      </main>
      <section id="footer">
        <Footer />
      </section>
      <FloatingButtons />
      <PopupForm />
    </div>
  );
};

export default Index;
