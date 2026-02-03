import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star, ExternalLink, PenLine } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { supabase } from "@/integrations/supabase/client";
import ReviewFormModal from "./ReviewFormModal";

type Review = {
  id: string;
  display_name: string;
  rating: number;
  text: string;
  object_type: string | null;
  created_at: string;
};

const staticReviews = [
  { id: "s1", display_name: "Анна Михайловна", rating: 5, text: "Обратились с проблемой клопов в квартире. Специалисты приехали быстро, работали аккуратно. Результат отличный – вредители исчезли полностью. Спасибо за профессионализм!", object_type: "Квартира, 2 комнаты", created_at: "27 ноября 2025" },
  { id: "s2", display_name: "Дмитрий К.", rating: 5, text: "Заказывали дезинсекцию офиса от тараканов. Приятно удивила оперативность и качество работы. Сотрудники вежливые, всё объяснили. Гарантию дали на месяц. Рекомендую!", object_type: "Офис, 120 м²", created_at: "18 ноября 2025" },
  { id: "s3", display_name: "Елена Сергеевна", rating: 5, text: "Профессиональный подход к делу. Провели дератизацию на складе, результат превзошёл ожидания. Цена адекватная, работа выполнена качественно. Будем обращаться ещё.", object_type: "Склад, 300 м²", created_at: "5 ноября 2025" },
  { id: "s4", display_name: "Сергей Александрович", rating: 5, text: "Заказал обработку дачи от клещей перед сезоном. Приехали точно в назначенное время, обработали участок быстро и качественно. Весь сезон никаких проблем не было!", object_type: "Дачный участок, 15 соток", created_at: "22 октября 2025" },
  { id: "s5", display_name: "Мария В.", rating: 5, text: "Огромное спасибо за помощь! Долго мучились с тараканами, пока не обратились к вам. Холодный туман справился на ура. Прошло уже 2 месяца – чисто. Очень довольны!", object_type: "Квартира, 3 комнаты", created_at: "8 октября 2025" },
  { id: "s6", display_name: "Александр П.", rating: 5, text: "Заказывали комплексную обработку ресторана перед открытием. Работа выполнена на высшем уровне, все документы оформлены правильно. СЭС приняла без замечаний. Спасибо!", object_type: "Ресторан, 200 м²", created_at: "15 сентября 2025" },
];

export default function Reviews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviews, setReviews] = useState<Review[]>(staticReviews);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data } = await supabase
        .from("reviews")
        .select("id, display_name, rating, text, object_type, created_at")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        const dbReviews = data.map(r => ({
          ...r,
          created_at: new Date(r.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })
        }));
        setReviews([...dbReviews, ...staticReviews]);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const nextReview = () => setCurrentIndex((prev) => (prev + 1) % reviews.length);
  const prevReview = () => setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

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
            <p className="text-muted-foreground text-lg mb-6">
              Более 150 довольных клиентов
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="outline" className="gap-2" onClick={() => setShowForm(true)}>
                <PenLine className="h-4 w-4" />
                Оставить отзыв
              </Button>
              <Button asChild variant="ghost" className="gap-2">
                <a href="https://go.2gis.com/oSzHM" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Все отзывы на 2GIS
                </a>
              </Button>
            </div>
          </div>
        </AnimatedSection>

        <div className="relative">
          <div className="grid md:grid-cols-3 gap-6">
            {visibleReviews.map((review, idx) => (
              <AnimatedSection key={`${currentIndex}-${idx}`} animation={['fade-left', 'fade-up', 'fade-right'][idx] as 'fade-left' | 'fade-up' | 'fade-right'} delay={[0, 150, 300][idx]}>
                <Card className="p-6 hover:shadow-elevated transition-all h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">{review.display_name}</h3>
                    <div className="flex gap-0.5">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-4">{review.text}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{review.created_at}</span>
                    <span className="bg-muted px-2 py-1 rounded">{review.object_type}</span>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <Button onClick={prevReview} variant="outline" size="icon" className="rounded-full">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button onClick={nextReview} variant="outline" size="icon" className="rounded-full">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <ReviewFormModal open={showForm} onOpenChange={setShowForm} />
    </section>
  );
}