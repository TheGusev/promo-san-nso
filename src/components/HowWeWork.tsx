import { Phone, Search, Sparkles, CheckCircle } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";

export default function HowWeWork() {
  const steps = [
    {
      number: 1,
      icon: Phone,
      title: "Звонок и консультация",
      description: "Бесплатная консультация, расчёт стоимости и согласование удобного времени",
    },
    {
      number: 2,
      icon: Search,
      title: "Диагностика помещения",
      description: "Специалист оценит масштаб проблемы и подберёт оптимальный метод обработки",
    },
    {
      number: 3,
      icon: Sparkles,
      title: "Профессиональная обработка",
      description: "Применение сертифицированных препаратов с соблюдением всех норм безопасности",
    },
    {
      number: 4,
      icon: CheckCircle,
      title: "Проверка и сертификат",
      description: "Контроль результата, оформление документов и гарантийное обслуживание",
    },
  ];

  return (
    <section className="py-16 px-2 sm:px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <AnimatedSection animation="fade-down">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Как мы <span className="text-primary">работаем</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Простой и понятный процесс от заявки до результата
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connection line - hidden on mobile */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-border -z-10" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <AnimatedSection key={step.number} animation="fade-up" delay={index * 150}>
                <div className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center shadow-elevated">
                        <Icon className="h-8 w-8" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-4 border-background">
                        {step.number}
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
