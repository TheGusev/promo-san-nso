import { Check, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnimatedSection } from "@/components/ui/animated-section";
import { trackGoal } from "@/lib/analytics";
import { scrollToAnchor } from "@/lib/scrollToAnchor";

const priceData = [
  {
    service: "Дезинфекция",
    description: "Уничтожение вирусов, бактерий, плесени",
    apartment: "1 200 ₽",
    house: "1 600 ₽",
    commercial: "от 20 ₽/м²",
    features: ["Холодный/горячий туман", "Сертификаты Роспотребнадзора", "Безопасные препараты"],
  },
  {
    service: "Дезинсекция",
    description: "Тараканы, клопы, муравьи, блохи",
    apartment: "1 200 ₽",
    house: "1 600 ₽",
    commercial: "от 16 ₽/м²",
    features: ["Гарантия до 1 года", "Барьерная защита", "Повторная обработка бесплатно"],
  },
  {
    service: "Дератизация",
    description: "Крысы, мыши, грызуны",
    apartment: "1 450 ₽",
    house: "2 000 ₽",
    commercial: "от 20 ₽/м²",
    features: ["Гарантия до 2 лет", "Безопасные приманки", "Заделка ходов"],
  },
  {
    service: "Озонирование",
    description: "Очистка воздуха, устранение запахов",
    apartment: "1 200 ₽",
    house: "1 600 ₽",
    commercial: "от 28 ₽/м²",
    features: ["Уничтожение 99.9% бактерий", "Без химии", "Эффект за 1 час"],
  },
  {
    service: "Дезодорация",
    description: "Удаление неприятных запахов",
    apartment: "1 450 ₽",
    house: "1 600 ₽",
    commercial: "от 24 ₽/м²",
    features: ["После пожара/затопления", "Запах животных", "Табачный дым"],
  },
  {
    service: "Подготовка к СЭС",
    description: "Документы для Роспотребнадзора",
    apartment: "—",
    house: "—",
    commercial: "от 2 400 ₽",
    features: ["Полный пакет документов", "Акты выполненных работ", "Сертификаты"],
  },
];

export default function PriceTable() {
  const handleCallClick = () => {
    trackGoal('phone_click');
  };

  const scrollToCalculator = () => {
    scrollToAnchor('calculator');
  };

  return (
    <section className="py-12 sm:py-16 bg-muted/30" id="prices" aria-label="Цены на услуги дезинфекции в Новосибирске">
      <div className="container px-4">
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
              Цены на услуги <span className="text-primary">в Новосибирске</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Фиксированные цены без скрытых доплат. Выезд специалиста и консультация — бесплатно.
            </p>
          </div>
        </AnimatedSection>

        {/* Desktop Table */}
        <AnimatedSection animation="fade-up" delay={100}>
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full border-collapse bg-background rounded-xl shadow-card overflow-hidden">
              <thead>
                <tr className="bg-primary/10">
                  <th className="text-left p-4 font-semibold">Услуга</th>
                  <th className="text-center p-4 font-semibold">Квартира</th>
                  <th className="text-center p-4 font-semibold">Частный дом</th>
                  <th className="text-center p-4 font-semibold">Коммерческое</th>
                  <th className="text-left p-4 font-semibold">Что входит</th>
                </tr>
              </thead>
              <tbody>
                {priceData.map((item, index) => (
                  <tr key={index} className="border-t border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold">{item.service}</div>
                      <div className="text-sm text-muted-foreground">{item.description}</div>
                    </td>
                    <td className="text-center p-4 font-semibold text-primary">{item.apartment}</td>
                    <td className="text-center p-4 font-semibold text-primary">{item.house}</td>
                    <td className="text-center p-4 font-semibold text-primary">{item.commercial}</td>
                    <td className="p-4">
                      <ul className="space-y-1">
                        {item.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-primary flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimatedSection>

        {/* Mobile Cards */}
        <div className="lg:hidden grid gap-4">
          {priceData.map((item, index) => (
            <AnimatedSection key={index} animation="fade-up" delay={index * 50}>
              <Card className="p-4 sm:p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg">{item.service}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div className="bg-muted/50 rounded-lg p-2">
                    <div className="text-xs text-muted-foreground">Квартира</div>
                    <div className="font-semibold text-primary text-sm">{item.apartment}</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2">
                    <div className="text-xs text-muted-foreground">Дом</div>
                    <div className="font-semibold text-primary text-sm">{item.house}</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2">
                    <div className="text-xs text-muted-foreground">Офис</div>
                    <div className="font-semibold text-primary text-sm">{item.commercial}</div>
                  </div>
                </div>
                <ul className="space-y-1">
                  {item.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </AnimatedSection>
          ))}
        </div>

        {/* CTA */}
        <AnimatedSection animation="fade-up" delay={200}>
          <div className="mt-8 sm:mt-10 text-center">
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              Точную стоимость рассчитает менеджер или используйте калькулятор
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                size="lg" 
                onClick={scrollToCalculator}
                className="bg-gradient-hero hover:opacity-90"
              >
                Рассчитать стоимость
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                asChild
                onClick={handleCallClick}
              >
                <a href="tel:+73833122330" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  +7 (383) 312-23-30
                </a>
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
