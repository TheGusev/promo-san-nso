import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StatsCounter from "@/components/StatsCounter";
import Services from "@/components/Services";
import Calculator from "@/components/Calculator";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";

const Index = () => {
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
