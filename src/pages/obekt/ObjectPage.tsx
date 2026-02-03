import { useParams, Link, Navigate } from "react-router-dom";
import { Building, Bug, Shield, Phone, ChevronRight, FileText, MapPin, ClipboardCheck, Calendar, Wrench, AlertTriangle } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SEOHead } from "@/components/shared/SEOHead";
import { CTABlock } from "@/components/shared/CTABlock";
import { RelatedLinks } from "@/components/shared/RelatedLinks";
import { FAQTeaser, FAQ_PRESETS } from "@/components/shared/FAQTeaser";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getObjectBySlug } from "@/data/objects";
import { getObjectContent, ObjectContent } from "@/data/objectContent";
import { getServiceBySlug } from "@/data/services";
import { getPestBySlug } from "@/data/pests";
import { SITE_CONFIG } from "@/data/siteConfig";

export default function ObjectPage() {
  const { objectSlug } = useParams<{ objectSlug: string }>();
  
  const objectType = objectSlug ? getObjectBySlug(objectSlug) : undefined;
  const content = objectSlug ? getObjectContent(objectSlug) : undefined;
  
  if (!objectType) {
    return <Navigate to="/obekty" replace />;
  }

  const hasDetailedContent = !!content;

  return (
    <MainLayout>
      <SEOHead
        title={content?.metaTitle || objectType.metaTitle}
        description={content?.metaDescription || objectType.metaDescription}
        canonical={`${SITE_CONFIG.siteUrl}/obekt/${objectType.slug}`}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 via-primary/10 to-background py-10 md:py-16">
        <div className="container px-4">
          <Breadcrumbs
            items={[
              { label: "Объекты", href: "/obekty" },
              { label: objectType.name },
            ]}
          />

          <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                Обработка {objectType.nameGenitive} в {SITE_CONFIG.regionPrepositional}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground md:text-xl">
                {content?.heroSubtitle || objectType.description}
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="gap-2" asChild>
                  <a href={`tel:${SITE_CONFIG.phone.replace(/[^+\d]/g, "")}`}>
                    <Phone className="h-5 w-5" />
                    {SITE_CONFIG.phone}
                  </a>
                </Button>
                <Button size="lg" variant="outline">
                  Рассчитать стоимость
                </Button>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-primary" />
                <span>Гарантия результата • Документы для проверок • Работаем 24/7</span>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-primary/10 blur-2xl" />
                <div className="relative flex h-48 w-48 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 md:h-64 md:w-64">
                  <Building className="h-24 w-24 text-primary/60 md:h-32 md:w-32" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {hasDetailedContent && content ? (
        <>
          {/* Вводный текст */}
          <section className="py-12 md:py-16">
            <div className="container px-4">
              <div className="mx-auto max-w-3xl">
                <div className="prose prose-lg max-w-none text-muted-foreground">
                  {content.intro.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="mb-4 last:mb-0">{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Типичные вредители */}
          <section className="bg-destructive/5 py-12 md:py-16">
            <div className="container px-4">
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                  <Bug className="h-6 w-6 text-destructive" />
                </div>
                <h2 className="text-2xl font-bold md:text-3xl">
                  Типичные вредители для {objectType.nameGenitive}
                </h2>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
                {content.typicalPests.map((pest) => {
                  const pestData = getPestBySlug(pest.slug);
                  return (
                    <Link
                      key={pest.slug}
                      to={`/vreditel/${pest.slug}`}
                      className="group block"
                    >
                      <Card className="h-full transition-all hover:shadow-md hover:border-destructive/50">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
                            <div>
                              <h3 className="font-semibold group-hover:text-destructive transition-colors">
                                {pest.name}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {pest.reason}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Какие услуги применяются */}
          <section className="py-12 md:py-16">
            <div className="container px-4">
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Wrench className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold md:text-3xl">
                  Услуги СЭС для {objectType.nameGenitive}
                </h2>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 max-w-4xl mx-auto">
                {content.applicableServices.map((service) => {
                  const serviceData = getServiceBySlug(service.slug);
                  if (!serviceData) return null;
                  const Icon = serviceData.icon;
                  return (
                    <Link
                      key={service.slug}
                      to={`/usluga/${service.slug}`}
                      className="group block"
                    >
                      <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                              <Icon className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold group-hover:text-primary transition-colors">
                                  {serviceData.name}
                                </h3>
                                <span className="text-sm text-muted-foreground">
                                  от {serviceData.priceFrom.toLocaleString()}₽
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-2">
                                {service.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Подготовка к обработке */}
          <section className="bg-muted/50 py-12 md:py-16">
            <div className="container px-4">
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <ClipboardCheck className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold md:text-3xl">
                  Как подготовить {objectType.name.toLowerCase()} к обработке
                </h2>
              </div>
              
              <div className="mx-auto max-w-3xl">
                <div className="grid gap-3">
                  {content.preparationSteps.map((step, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 rounded-lg border bg-background p-4"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {index + 1}
                      </div>
                      <p className="text-muted-foreground pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Профилактика */}
          <section className="py-12 md:py-16">
            <div className="container px-4">
              <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
                {/* Частота профилактики */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-xl font-semibold">Частота профилактики</h2>
                    </div>
                    <p className="text-muted-foreground">
                      {content.preventionFrequency}
                    </p>
                  </CardContent>
                </Card>

                {/* Советы по профилактике */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-xl font-semibold">Советы по профилактике</h2>
                    </div>
                    <ul className="space-y-2">
                      {content.preventionTips.slice(0, 5).map((tip, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-primary mt-1">✓</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Особенности работы */}
          {content.features.length > 0 && (
            <section className="bg-primary/5 py-12 md:py-16">
              <div className="container px-4">
                <h2 className="text-2xl font-bold md:text-3xl mb-8 text-center">
                  Почему выбирают нас для обработки {objectType.namePlural}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
                  {content.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-lg border bg-background p-4"
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                        ✓
                      </div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Статьи по теме */}
          {content.relatedArticles.length > 0 && (
            <section className="py-12 md:py-16">
              <div className="container px-4">
                <h2 className="text-2xl font-bold md:text-3xl mb-8 text-center">
                  Полезные статьи
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
                  {content.relatedArticles.map((article) => (
                    <Link
                      key={article.slug}
                      to={`/blog/${article.slug}`}
                      className="flex items-start gap-3 rounded-lg border bg-card p-4 hover:bg-accent transition-colors group"
                    >
                      <FileText className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                      <span className="group-hover:text-primary transition-colors">
                        {article.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* FAQ */}
          <section className="bg-muted/30 py-12 md:py-16">
            <div className="container px-4">
              <h2 className="text-2xl font-bold md:text-3xl mb-8 text-center">
                Частые вопросы об обработке {objectType.namePlural}
              </h2>
              <div className="mx-auto max-w-3xl">
                <Accordion type="single" collapsible className="w-full">
                  {content.faq.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>

          {/* Ссылка на районы */}
          <section className="py-12 md:py-16">
            <div className="container px-4 text-center">
              <p className="text-muted-foreground mb-4">
                Обрабатываем {objectType.namePlural.toLowerCase()} по всем районам Новосибирска и области
              </p>
              <Button variant="outline" asChild>
                <Link to="/rayony" className="gap-2">
                  <MapPin className="h-4 w-4" />
                  Смотреть все районы
                </Link>
              </Button>
            </div>
          </section>
        </>
      ) : (
        /* Базовая версия без детального контента */
        <section className="py-12 md:py-16">
          <div className="container px-4">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-lg text-muted-foreground mb-8">
                {objectType.description}
              </p>
              <p className="text-muted-foreground mb-8">
                Профессиональная обработка {objectType.nameGenitive} в Новосибирске и области.
                Используем современные методы и сертифицированные препараты.
                Гарантия результата, полный пакет документов.
              </p>
              
              {/* Услуги */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-8">
                {objectType.relatedServices.map((serviceSlug) => {
                  const service = getServiceBySlug(serviceSlug);
                  if (!service) return null;
                  const Icon = service.icon;
                  return (
                    <Link
                      key={serviceSlug}
                      to={`/usluga/${serviceSlug}`}
                      className="flex items-center gap-3 rounded-lg border p-4 hover:bg-accent transition-colors"
                    >
                      <Icon className="h-5 w-5 text-primary" />
                      <span>{service.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Блок СанПиН для B2B объектов */}
      {(objectType.category === "commercial" || objectType.category === "industrial") && (
        <section className="py-8">
          <div className="container px-4">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">Требования СанПиН для бизнеса</h3>
                    <p className="text-muted-foreground mb-4">
                      Узнайте, какие документы нужны для проверки Роспотребнадзора. Мы предоставляем полный пакет: договор, акты, сертификаты.
                    </p>
                    <Link 
                      to="/sanpin" 
                      className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
                    >
                      Нормативные требования
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* FAQ Teaser */}
      <section className="py-8 bg-muted/30">
        <div className="container px-4">
          <FAQTeaser 
            objectSlug={objectType.slug}
            questionIds={FAQ_PRESETS[objectType.slug as keyof typeof FAQ_PRESETS] || FAQ_PRESETS.default}
            limit={3}
            title={`Вопросы об обработке ${objectType.nameGenitive}`}
          />
        </div>
      </section>

      {/* CTA с калькулятором */}
      <CTABlock
        title={`Закажите обработку ${objectType.nameGenitive}`}
        subtitle="Рассчитайте стоимость онлайн или получите консультацию по телефону"
      />

      {/* Перелинковка */}
      <section className="border-t py-8">
        <RelatedLinks type="objects" currentSlug={objectType.slug} title="Другие типы объектов" />
        <RelatedLinks type="services" title="Наши услуги" />
        <RelatedLinks type="pests" title="Вредители" />
      </section>
    </MainLayout>
  );
}
