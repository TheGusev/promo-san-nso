import { useEffect, useState } from "react";
import { Zap, Shield, Award, Users, Home, CheckCircle } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";

export default function StatsCounter() {
  const [counts, setCounts] = useState({
    clients: 0,
    area: 0,
    guarantee: 0,
  });

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const targets = {
      clients: 500,
      area: 5000,
      guarantee: 99.9,
    };

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;

      setCounts({
        clients: Math.floor(targets.clients * progress),
        area: Math.floor(targets.area * progress),
        guarantee: Math.min(targets.guarantee, parseFloat((targets.guarantee * progress).toFixed(1))),
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounts(targets);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const benefits = [
    {
      icon: Zap,
      title: "Быстрый выезд",
      description: "30-60 минут в пределах города",
    },
    {
      icon: Award,
      title: "Сертификаты",
      description: "Официальные документы СЭС",
    },
    {
      icon: Shield,
      title: "Гарантия",
      description: "До 30 дней сопровождения",
    },
  ];

  const certifications = [
    {
      title: "Роспотребнадзор",
      description: "Лицензия на услуги",
    },
    {
      title: "СЭС",
      description: "Санитарный допуск",
    },
    {
      title: "Экологичность",
      description: "Безопасные препараты",
    },
    {
      title: "Гарантия 30 дней",
      description: "Бесплатное повторение",
    },
  ];

  return (
    <>
      {/* Benefits Section */}
      <section className="py-8 md:py-12 px-2 sm:px-4 bg-background border-b border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <AnimatedSection key={index} animation="fade-up" delay={index * 100}>
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border hover:shadow-card transition-all">
                    <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 md:py-16 px-2 sm:px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { Icon: Users, value: `${counts.clients}+`, label: "довольных клиентов", delay: 0 },
              { Icon: Home, value: `${counts.area}+ м²`, label: "обработано", delay: 150 },
              { Icon: CheckCircle, value: `${counts.guarantee}%`, label: "гарантия результата", delay: 300 },
            ].map((stat) => (
              <AnimatedSection key={stat.label} animation="scale-up" delay={stat.delay}>
                <div className="space-y-2">
                  <stat.Icon className="h-12 w-12 mx-auto mb-4 opacity-90" />
                  <div className="text-5xl font-bold min-h-[3.5rem] flex items-center justify-center" style={{ fontVariantNumeric: 'tabular-nums', contain: 'layout' }}>{stat.value}</div>
                  <div className="text-lg opacity-90">{stat.label}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-8 md:py-12 px-2 sm:px-4 bg-muted/30 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {certifications.map((cert, index) => (
              <AnimatedSection key={index} animation="fade-up" delay={index * 100}>
                <div className="bg-card border border-border rounded-lg p-4 text-center hover:shadow-card transition-all">
                  <div className="bg-secondary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-secondary" />
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{cert.title}</h4>
                  <p className="text-xs text-muted-foreground">{cert.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
