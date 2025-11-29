import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Shield, Bug, Rat, Wind, Droplets, FileCheck } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { logTrafficEvent } from "@/hooks/useTrafficLogging";

const services = [
  {
    icon: Shield,
    title: "Дезинфекция",
    description: "Уничтожение вирусов, бактерий и грибков. Обработка помещений профессиональными препаратами.",
    price: "от 2500₽",
    features: ["Холодный/горячий туман", "Безопасные препараты", "Гарантия результата"]
  },
  {
    icon: Bug,
    title: "Дезинсекция",
    description: "Уничтожение клопов, тараканов, муравьёв и других насекомых. Современные методы обработки.",
    price: "от 2500₽",
    features: ["Эффект до 6 месяцев", "Без запаха", "Безопасно для людей"]
  },
  {
    icon: Rat,
    title: "Дератизация",
    description: "Профессиональное уничтожение грызунов. Барьерная защита и регулярное обслуживание.",
    price: "от 3000₽",
    features: ["Комплексная защита", "Барьерная обработка", "Долгосрочный эффект"]
  },
  {
    icon: Wind,
    title: "Озонирование",
    description: "Глубокая очистка воздуха и поверхностей. Устранение неприятных запахов и аллергенов.",
    price: "от 2000₽",
    features: ["Экологично", "Без химии", "Удаление запахов"]
  },
  {
    icon: Droplets,
    title: "Дезодорация",
    description: "Устранение сложных запахов: дым, гарь, плесень, животные. Профессиональное оборудование.",
    price: "от 2500₽",
    features: ["Устойчивый результат", "Любые запахи", "Быстрый эффект"]
  },
  {
    icon: FileCheck,
    title: "Сертификация",
    description: "Подготовка к проверкам СЭС. Полный пакет документов для Роспотребнадзора.",
    price: "от 5000₽",
    features: ["Все документы", "Акты и протоколы", "Консультации"]
  }
];

export default function Services() {
  return (
    <section id="services" className="py-12 md:py-20 bg-background">
      <div className="container px-4">
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Наши услуги</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Комплексные санитарные решения для дома и бизнеса в Новосибирске
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <AnimatedSection key={index} animation="scale-up" delay={index * 100}>
              <Card className="p-6 hover:shadow-elevated transition-all duration-300 h-full">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                
                <div className="flex items-center justify-between mb-4 pb-4 border-b">
                  <span className="text-2xl font-bold text-primary">{service.price}</span>
                </div>
                
                <ul className="space-y-2 mb-4">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => {
                    logTrafficEvent('service_click', { service: service.title });
                    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Рассчитать стоимость
                </Button>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
