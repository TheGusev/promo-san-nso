import { useParams, Link, Navigate } from "react-router-dom";
import { Bug, AlertTriangle, Search, ClipboardCheck, Shield, Phone, ChevronRight, FileText, MapPin, Building, ArrowRight } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SEOHead } from "@/components/shared/SEOHead";
import { CTABlock } from "@/components/shared/CTABlock";
import { RelatedLinks } from "@/components/shared/RelatedLinks";
import { FAQTeaser, FAQ_PRESETS } from "@/components/shared/FAQTeaser";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getPestBySlug } from "@/data/pests";
import { getPestContent, PestContent } from "@/data/pestContent";
import { services, getServiceBySlug } from "@/data/services";
import { objects, getObjectBySlug } from "@/data/objects";
import { SITE_CONFIG } from "@/data/siteConfig";

export default function PestPage() {
  const { pestSlug } = useParams<{ pestSlug: string }>();
  
  // Получаем базовые данные и детальный контент
  const pest = pestSlug ? getPestBySlug(pestSlug) : undefined;
  const content = pestSlug ? getPestContent(pestSlug) : undefined;
  
  if (!pest) {
    return <Navigate to="/vrediteli" replace />;
  }

  // Если нет детального контента, показываем базовую версию
  const hasDetailedContent = !!content;

  return (
    <MainLayout>
      <SEOHead
        title={content?.metaTitle || `${pest.name} в Новосибирске — уничтожение ${pest.nameGenitive} | ${SITE_CONFIG.companyName}`}
        description={content?.metaDescription || pest.metaDescription}
        canonical={`https://promo-san-nso.lovable.app/vreditel/${pest.slug}`}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-destructive/5 via-destructive/10 to-background py-10 md:py-16">
        <div className="container px-4">
          <Breadcrumbs
            items={[
              { label: "Вредители", href: "/vrediteli" },
              { label: pest.name },
            ]}
          />

          <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              {/* LSI: место для ключей в H1 и подзаголовке */}
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                {pest.name} в {SITE_CONFIG.regionPrepositional}: как распознать и вывести
              </h1>
              <p className="mt-4 text-lg text-muted-foreground md:text-xl">
                {content?.heroSubtitle || `Профессиональное уничтожение ${pest.nameGenitive} с гарантией результата. Работаем по всей Новосибирской области.`}
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="gap-2" asChild>
                  <a href={`tel:${SITE_CONFIG.phone.replace(/[^+\d]/g, "")}`}>
                    <Phone className="h-5 w-5" />
                    {SITE_CONFIG.phone}
                  </a>
                </Button>
                <Button size="lg" variant="outline">
                  Заказать обработку
                </Button>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-primary" />
                <span>Гарантия до 1 года • Работаем 24/7 • Безопасные препараты</span>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-destructive/10 blur-2xl" />
                <div className="relative flex h-48 w-48 items-center justify-center rounded-full bg-gradient-to-br from-destructive/20 to-destructive/5 md:h-64 md:w-64">
                  <Bug className="h-24 w-24 text-destructive/60 md:h-32 md:w-32" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {hasDetailedContent && content ? (
        <>
          {/* Как выглядит и где обитает */}
          <section className="py-12 md:py-16">
            <div className="container px-4">
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Внешний вид */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Search className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-xl font-semibold">Как выглядит</h2>
                    </div>
                    <div className="prose prose-sm max-w-none text-muted-foreground">
                      {content.appearance.split('\n\n').map((paragraph, i) => (
                        <p key={i} className="mb-3 last:mb-0">{paragraph}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Где обитает */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-xl font-semibold">Где обитает</h2>
                    </div>
                    <div className="prose prose-sm max-w-none text-muted-foreground">
                      {content.habitat.split('\n\n').map((paragraph, i) => (
                        <p key={i} className="mb-3 last:mb-0 whitespace-pre-line">{paragraph}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Чем опасен */}
          <section className="bg-destructive/5 py-12 md:py-16">
            <div className="container px-4">
              <div className="mx-auto max-w-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                  </div>
                  <h2 className="text-2xl font-bold md:text-3xl">
                    Чем опасен{pest.category === "rodents" ? "ы" : ""} {pest.namePlural}
                  </h2>
                </div>
                <div className="prose max-w-none text-muted-foreground">
                  {content.danger.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="mb-4 last:mb-0">{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Признаки заражения */}
          <section className="py-12 md:py-16">
            <div className="container px-4">
              <h2 className="text-2xl font-bold md:text-3xl mb-8 text-center">
                Признаки появления {pest.nameGenitive} в помещении
              </h2>
              <div className="mx-auto max-w-3xl">
                <div className="grid gap-3">
                  {content.signs.map((sign, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 rounded-lg border bg-card p-4"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-sm font-semibold text-destructive">
                        {index + 1}
                      </div>
                      <p className="text-muted-foreground">{sign}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Как проходит обработка */}
          <section className="bg-muted/50 py-12 md:py-16">
            <div className="container px-4">
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <ClipboardCheck className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold md:text-3xl">
                  Как проходит обработка от {pest.nameGenitive}
                </h2>
              </div>
              <div className="mx-auto max-w-3xl">
                <div className="prose prose-lg max-w-none">
                  {content.treatmentProcess.split('\n\n').map((paragraph, i) => {
                    // Обработка заголовков **text**
                    const parts = paragraph.split(/\*\*(.*?)\*\*/);
                    return (
                      <p key={i} className="mb-4 last:mb-0 text-muted-foreground whitespace-pre-line">
                        {parts.map((part, j) => 
                          j % 2 === 1 ? <strong key={j} className="text-foreground">{part}</strong> : part
                        )}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Какие услуги нужны */}
          <section className="py-12 md:py-16">
            <div className="container px-4">
              <h2 className="text-2xl font-bold md:text-3xl mb-8 text-center">
                Услуги для борьбы с {pest.nameGenitive}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
                {content.relatedServices.map((serviceSlug) => {
                  const service = getServiceBySlug(serviceSlug);
                  if (!service) return null;
                  const Icon = service.icon;
                  return (
                    <Link
                      key={serviceSlug}
                      to={`/usluga/${serviceSlug}`}
                      className="flex items-center gap-4 rounded-lg border bg-card p-4 hover:bg-accent transition-colors group"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium group-hover:text-primary transition-colors">
                          {service.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          от {service.priceFrom.toLocaleString()}₽
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Где встречается чаще всего */}
          <section className="bg-muted/30 py-12 md:py-16">
            <div className="container px-4">
              <h2 className="text-2xl font-bold md:text-3xl mb-8 text-center">
                Где {pest.namePlural} встречаются чаще всего
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
                {content.commonObjects.map((objectSlug) => {
                  const obj = getObjectBySlug(objectSlug);
                  if (!obj) return null;
                  return (
                    <Link
                      key={objectSlug}
                      to={`/obekt/${objectSlug}`}
                      className="flex items-center gap-3 rounded-lg border bg-background p-4 hover:bg-accent transition-colors"
                    >
                      <Building className="h-5 w-5 text-primary" />
                      <span>{obj.name}</span>
                    </Link>
                  );
                })}
              </div>
              
              {/* Ссылка на районы */}
              <div className="mt-8 text-center">
                <p className="text-muted-foreground mb-4">
                  Уничтожаем {pest.nameGenitive} по всем районам Новосибирска и области
                </p>
                <Button variant="outline" asChild>
                  <Link to="/rayony" className="gap-2">
                    <MapPin className="h-4 w-4" />
                    Смотреть все районы
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Статьи по теме */}
          {content.relatedArticles.length > 0 && (
            <section className="py-12 md:py-16">
              <div className="container px-4">
                <h2 className="text-2xl font-bold md:text-3xl mb-8 text-center">
                  Полезные статьи о {pest.namePlural}
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

          {/* Советы по профилактике */}
          {content.preventionTips.length > 0 && (
            <section className="bg-primary/5 py-12 md:py-16">
              <div className="container px-4">
                <h2 className="text-2xl font-bold md:text-3xl mb-8 text-center">
                  Профилактика появления {pest.nameGenitive}
                </h2>
                <div className="mx-auto max-w-2xl">
                  <ul className="space-y-3">
                    {content.preventionTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                          ✓
                        </div>
                        <span className="text-muted-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}

          {/* FAQ */}
          <section className="py-12 md:py-16">
            <div className="container px-4">
              <h2 className="text-2xl font-bold md:text-3xl mb-8 text-center">
                Частые вопросы об уничтожении {pest.nameGenitive}
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
        </>
      ) : (
        /* Базовая версия без детального контента */
        <section className="py-12 md:py-16">
          <div className="container px-4">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-lg text-muted-foreground mb-8">
                {pest.description}
              </p>
              <p className="text-muted-foreground mb-8">
                Профессиональное уничтожение {pest.nameGenitive} в Новосибирске и области.
                Используем современные методы обработки и сертифицированные препараты.
                Гарантия результата до 12 месяцев.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Teaser */}
      <section className="py-8 bg-muted/30">
        <div className="container px-4">
          <FAQTeaser 
            pestSlug={pest.slug}
            questionIds={FAQ_PRESETS[pest.slug as keyof typeof FAQ_PRESETS] || FAQ_PRESETS.default}
            limit={3}
            title={`Вопросы про ${pest.nameGenitive}`}
          />
        </div>
      </section>

      {/* CTA */}
      <CTABlock
        title={`Избавьтесь от ${pest.nameGenitive} раз и навсегда`}
        subtitle="Бесплатный выезд специалиста для оценки ситуации"
      />

      {/* Перелинковка */}
      <section className="border-t py-8">
        <RelatedLinks type="pests" currentSlug={pest.slug} title="Другие вредители" />
        <RelatedLinks type="services" title="Наши услуги" />
        <RelatedLinks type="districts" title="Работаем в районах" />
      </section>
    </MainLayout>
  );
}
