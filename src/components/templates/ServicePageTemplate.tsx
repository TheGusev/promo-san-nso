import { Link } from "react-router-dom";
import { Phone, Clock, Shield, CheckCircle, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MainLayout } from "@/components/layout/MainLayout";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { CTABlock } from "@/components/shared/CTABlock";
import { RelatedLinks } from "@/components/shared/RelatedLinks";
import { SEOHead } from "@/components/shared/SEOHead";
import { CostCalculatorPlaceholder } from "@/components/shared/CostCalculatorPlaceholder";
import { SITE_CONFIG } from "@/data/siteConfig";
import { type Service } from "@/data/services";
import { cn } from "@/lib/utils";

interface ServicePageTemplateProps {
  service: Service;
}

// Заглушки для контента — будут заменены реальными данными
const DEFAULT_PROBLEMS = [
  "Вредители портят имущество и продукты",
  "Риск распространения инфекций и болезней",
  "Дискомфорт и стресс для жильцов",
  "Порча репутации для бизнеса",
];

const DEFAULT_SOLUTIONS = [
  "Профессиональная диагностика очага заражения",
  "Подбор оптимального метода обработки",
  "Применение сертифицированных препаратов",
  "Гарантия результата и повторная обработка при необходимости",
];

const DEFAULT_STEPS = [
  { title: "Заявка", description: "Оставьте заявку по телефону или на сайте" },
  { title: "Диагностика", description: "Специалист осмотрит объект и определит масштаб проблемы" },
  { title: "Обработка", description: "Проведём обработку современными препаратами" },
  { title: "Контроль", description: "Проверим результат и дадим рекомендации" },
];

const DEFAULT_ADVANTAGES = [
  { icon: Clock, title: "Выезд 24/7", description: "Работаем круглосуточно без выходных" },
  { icon: Shield, title: "Гарантия", description: "Даём гарантию на все виды работ" },
  { icon: CheckCircle, title: "Безопасность", description: "Используем безопасные для людей и животных препараты" },
  { icon: Star, title: "Опыт", description: "Более 10 лет успешной работы" },
];

const DEFAULT_FAQ = [
  { question: "Сколько времени занимает обработка?", answer: "В среднем обработка занимает от 30 минут до 2 часов в зависимости от площади и сложности объекта." },
  { question: "Безопасно ли это для детей и животных?", answer: "Мы используем сертифицированные препараты 4 класса опасности. После обработки и проветривания помещение полностью безопасно." },
  { question: "Есть ли гарантия?", answer: "Да, мы предоставляем гарантию на все виды работ. Срок гарантии зависит от вида услуги." },
  { question: "Как подготовиться к обработке?", answer: "Убрать продукты питания, личные вещи, обеспечить доступ к местам обитания вредителей. Подробные инструкции даст специалист." },
];

export function ServicePageTemplate({ service }: ServicePageTemplateProps) {
  const Icon = service.icon;

  return (
    <MainLayout>
      <SEOHead
        title={service.metaTitle}
        description={service.metaDescription}
        canonical={`https://promo-san-nso.lovable.app/usluga/${service.slug}`}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-8 md:py-12">
        <div className="container px-4">
          <Breadcrumbs
            items={[
              { label: "Услуги", href: "/uslugi" },
              { label: service.name },
            ]}
          />

          <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary mb-4">
                <Icon className="h-4 w-4" />
                {service.shortName}
              </div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                {service.name} в {SITE_CONFIG.regionGenitive}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                {service.description}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="gap-2" asChild>
                  <a href={`tel:${SITE_CONFIG.phoneClean}`}>
                    <Phone className="h-5 w-5" />
                    Вызвать специалиста
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="gap-2" asChild>
                  <a href={`tel:${SITE_CONFIG.phoneClean}`}>
                    {SITE_CONFIG.phoneDisplay}
                  </a>
                </Button>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Работаем по {SITE_CONFIG.regionFull} {SITE_CONFIG.workingHours}</span>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl" />
                <div className="relative bg-background rounded-2xl border p-8 shadow-lg">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-2">Цена</div>
                    <div className="text-4xl font-bold text-primary">
                      {service.priceUnit} {service.priceFrom.toLocaleString("ru-RU")} ₽
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Точная цена после диагностики
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Проблема */}
      <section className="py-12 md:py-16">
        <div className="container px-4">
          <h2 className="text-2xl font-bold md:text-3xl mb-6">
            Какие проблемы решает {service.shortName.toLowerCase()}?
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {DEFAULT_PROBLEMS.map((problem, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg border p-4"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <span className="text-sm font-medium">{index + 1}</span>
                </div>
                <p>{problem}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Как мы решаем */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container px-4">
          <h2 className="text-2xl font-bold md:text-3xl mb-6">
            Как мы решаем эти проблемы
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {DEFAULT_SOLUTIONS.map((solution, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg bg-background border p-4"
              >
                <CheckCircle className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                <p>{solution}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Калькулятор */}
      <section className="py-12 md:py-16">
        <div className="container px-4">
          <h2 className="text-2xl font-bold md:text-3xl mb-6 text-center">
            Рассчитайте стоимость
          </h2>
          <CostCalculatorPlaceholder />
        </div>
      </section>

      {/* Как проходит обработка */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container px-4">
          <h2 className="text-2xl font-bold md:text-3xl mb-8 text-center">
            Как проходит обработка
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {DEFAULT_STEPS.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold mb-4">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                {index < DEFAULT_STEPS.length - 1 && (
                  <ChevronRight className="hidden lg:block absolute top-6 -right-3 h-6 w-6 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Почему выбирают нас */}
      <section className="py-12 md:py-16">
        <div className="container px-4">
          <h2 className="text-2xl font-bold md:text-3xl mb-8 text-center">
            Почему выбирают нас
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {DEFAULT_ADVANTAGES.map((advantage, index) => {
              const AdvIcon = advantage.icon;
              return (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <AdvIcon className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-lg">{advantage.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {advantage.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container px-4">
          <h2 className="text-2xl font-bold md:text-3xl mb-8 text-center">
            Частые вопросы
          </h2>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {DEFAULT_FAQ.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16">
        <div className="container px-4">
          <CTABlock
            title={`Заказать ${service.shortName.toLowerCase()} в ${SITE_CONFIG.regionGenitive}`}
            subtitle="Позвоните нам или оставьте заявку — мы перезвоним в течение 5 минут"
            variant="hero"
          />
        </div>
      </section>

      {/* Перелинковка */}
      <section className="border-t py-8">
        <RelatedLinks type="services" currentSlug={service.slug} title="Другие услуги" />
        <RelatedLinks type="pests" title="Популярные вредители" />
        <RelatedLinks type="districts" title="Работаем в районах" />
      </section>
    </MainLayout>
  );
}
