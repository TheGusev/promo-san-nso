import { useState } from "react";
import { Shield, Award, FileCheck, Percent, Zap, EyeOff } from "lucide-react";
import WarrantyModal from "./WarrantyModal";
import { AnimatedSection } from "@/components/ui/animated-section";

export default function WhyChooseUs() {
  const [warrantyModalOpen, setWarrantyModalOpen] = useState(false);

  const benefits = [
    {
      icon: Zap,
      title: "Профессиональная диагностика",
      description: "Точная оценка масштаба проблемы и подбор оптимального решения",
    },
    {
      icon: Award,
      title: "Сертифицированные препараты",
      description: "Используем только проверенные средства с подтверждённой эффективностью",
    },
    {
      icon: FileCheck,
      title: "Официальное оформление",
      description: "Договор, акты выполненных работ и гарантийное обслуживание",
    },
    {
      icon: Percent,
      title: "Гибкая система скидок",
      description: "До 30% на первый заказ, акции для постоянных клиентов",
    },
    {
      icon: Shield,
      title: "Экстренный выезд",
      description: "Готовы выехать в течение 30-60 минут в пределах города",
    },
    {
      icon: EyeOff,
      title: "Конфиденциальность",
      description: "Работаем дискретно — без логотипов на машинах и форме. Ваши соседи ничего не узнают",
    },
  ];

  return (
    <>
      <section className="py-10 md:py-16 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <AnimatedSection animation="fade-up">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Почему <span className="text-primary">выбирают нас</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Надёжность, качество и профессионализм в каждой детали
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="scale-up" delay={200}>
            <div className="bg-accent text-accent-foreground rounded-lg p-6 mb-8 text-center">
              <p className="text-2xl font-bold mb-2">До 30 дней гарантийного сопровождения</p>
              <button
                onClick={() => setWarrantyModalOpen(true)}
                className="text-sm underline hover:no-underline transition-all"
              >
                Условия гарантии →
              </button>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <AnimatedSection key={index} animation="fade-up" delay={index * 100}>
                  <div className="bg-card border border-border rounded-lg p-6 hover:shadow-elevated transition-all">
                    <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm">{benefit.description}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      <WarrantyModal open={warrantyModalOpen} onOpenChange={setWarrantyModalOpen} />
    </>
  );
}
