import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";

export default function Reviews() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const reviews = [
    {
      name: "Анна Михайловна",
      rating: 5,
      text: "Обратились с проблемой клопов в квартире. Специалисты приехали быстро, работали аккуратно. Результат отличный – вредители исчезли полностью. Спасибо за профессионализм!",
      date: "15 ноября 2024",
      objectType: "Квартира, 2 комнаты",
    },
    {
      name: "Дмитрий К.",
      rating: 5,
      text: "Заказывали дезинсекцию офиса от тараканов. Приятно удивила оперативность и качество работы. Сотрудники вежливые, всё объяснили. Гарантию дали на месяц. Рекомендую!",
      date: "8 ноября 2024",
      objectType: "Офис, 120 м²",
    },
    {
      name: "Елена Сергеевна",
      rating: 5,
      text: "Профессиональный подход к делу. Провели дератизацию на складе, результат превзошёл ожидания. Цена адекватная, работа выполнена качественно. Будем обращаться ещё.",
      date: "3 ноября 2024",
      objectType: "Склад, 300 м²",
    },
    {
      name: "Сергей Александрович",
      rating: 5,
      text: "Заказал обработку дачи от клещей перед сезоном. Приехали точно в назначенное время, обработали участок быстро и качественно. Весь сезон никаких проблем не было!",
      date: "28 октября 2024",
      objectType: "Дачный участок, 15 соток",
    },
    {
      name: "Мария В.",
      rating: 5,
      text: "Огромное спасибо за помощь! Долго мучились с тараканами, пока не обратились к вам. Холодный туман справился на ура. Прошло уже 2 месяца – чисто. Очень довольны!",
      date: "20 октября 2024",
      objectType: "Квартира, 3 комнаты",
    },
    {
      name: "Александр П.",
      rating: 5,
      text: "Заказывали комплексную обработку ресторана перед открытием. Работа выполнена на высшем уровне, все документы оформлены правильно. СЭС приняла без замечаний. Спасибо!",
      date: "12 октября 2024",
      objectType: "Ресторан, 200 м²",
    },
  ];

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const visibleReviews = [
    reviews[currentIndex],
    reviews[(currentIndex + 1) % reviews.length],
    reviews[(currentIndex + 2) % reviews.length],
  ];

  return (
    <section className="py-16 px-2 sm:px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Отзывы <span className="text-primary">наших клиентов</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Более 500 довольных клиентов за последний год
            </p>
          </div>
        </AnimatedSection>

        <div className="relative">
          <div className="grid md:grid-cols-3 gap-6">
            {visibleReviews.map((review, idx) => {
              const delays = [0, 150, 300];
              const animations: Array<'fade-left' | 'fade-up' | 'fade-right'> = ['fade-left', 'fade-up', 'fade-right'];
              return (
                <AnimatedSection
                  key={`${currentIndex}-${idx}`}
                  animation={animations[idx]}
                  delay={delays[idx]}
                >
                  <Card className="p-6 hover:shadow-elevated transition-all h-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">{review.name}</h3>
                      <div className="flex gap-0.5">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                        ))}
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm mb-4 line-clamp-4">{review.text}</p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{review.date}</span>
                      <span className="bg-muted px-2 py-1 rounded">{review.objectType}</span>
                    </div>
                  </Card>
                </AnimatedSection>
              );
            })}
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <Button
              onClick={prevReview}
              variant="outline"
              size="icon"
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              onClick={nextReview}
              variant="outline"
              size="icon"
              className="rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
