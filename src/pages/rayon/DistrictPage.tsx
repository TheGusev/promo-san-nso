import { useParams, Link, Navigate } from "react-router-dom";
import { MapPin, Clock, Phone, Shield, ChevronRight, Building, Bug, Wrench, Star, FileText, AlertTriangle } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SEOHead } from "@/components/shared/SEOHead";
import { CTABlock } from "@/components/shared/CTABlock";
import { RelatedLinks } from "@/components/shared/RelatedLinks";
import { FAQTeaser, FAQ_PRESETS } from "@/components/shared/FAQTeaser";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getDistrictBySlug, District } from "@/data/districts";
import { getDistrictContent, DistrictContent } from "@/data/districtContent";
import { getServiceBySlug } from "@/data/services";
import { getPestBySlug } from "@/data/pests";
import { getObjectBySlug } from "@/data/objects";
import { SITE_CONFIG } from "@/data/siteConfig";

export default function DistrictPage() {
  const { districtSlug } = useParams<{ districtSlug: string }>();
  
  const district = districtSlug ? getDistrictBySlug(districtSlug) : undefined;
  const content = districtSlug ? getDistrictContent(districtSlug) : undefined;
  
  if (!district) {
    return <Navigate to="/rayony" replace />;
  }

  const hasDetailedContent = !!content;

  return (
    <MainLayout>
      <SEOHead
        title={content?.metaTitle || district.metaTitle}
        description={content?.metaDescription || district.metaDescription}
        canonical={`${SITE_CONFIG.siteUrl}/rayon/${district.slug}`}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 via-primary/10 to-background py-10 md:py-16">
        <div className="container px-4">
          <Breadcrumbs
            items={[
              { label: "Районы", href: "/rayony" },
              { label: district.name },
            ]}
          />

          <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                СЭС в {district.nameLocative}: дезинсекция, дератизация, дезинфекция
              </h1>
              <p className="mt-4 text-lg text-muted-foreground md:text-xl">
                {content?.heroSubtitle || district.description}
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

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Выезд: {district.responseTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Гарантия результата</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-primary/10 blur-2xl" />
                <div className="relative flex h-48 w-48 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 md:h-64 md:w-64">
                  <MapPin className="h-24 w-24 text-primary/60 md:h-32 md:w-32" />
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

          {/* Где работаем в районе */}
          <section className="bg-muted/30 py-12 md:py-16">
            <div className="container px-4">
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold md:text-3xl">
                  Где работаем в {district.nameLocative}
                </h2>
              </div>
              
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
                {content.workAreas.map((area, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-lg border bg-background p-4"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      ✓
                    </div>
                    <span>{area}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Типичные объекты и вредители */}
          <section className="py-12 md:py-16">
            <div className="container px-4">
              <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
                {/* Объекты */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Building className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold">Типичные объекты</h2>
                  </div>
                  <div className="space-y-3">
                    {content.typicalObjects.map((obj) => {
                      const objectData = getObjectBySlug(obj.slug);
                      return (
                        <Link
                          key={obj.slug}
                          to={`/obekt/${obj.slug}`}
                          className="flex items-start gap-3 rounded-lg border p-4 hover:bg-accent transition-colors group"
                        >
                          <Building className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                          <div>
                            <div className="font-medium group-hover:text-primary transition-colors">
                              {obj.name}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {obj.reason}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Вредители */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                      <Bug className="h-5 w-5 text-destructive" />
                    </div>
                    <h2 className="text-xl font-semibold">Частые вредители</h2>
                  </div>
                  <div className="space-y-3">
                    {content.typicalPests.map((pest) => (
                      <Link
                        key={pest.slug}
                        to={`/vreditel/${pest.slug}`}
                        className="flex items-start gap-3 rounded-lg border p-4 hover:bg-accent transition-colors group"
                      >
                        <AlertTriangle className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
                        <div>
                          <div className="font-medium group-hover:text-destructive transition-colors">
                            {pest.name}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {pest.reason}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Популярные услуги */}
          <section className="bg-primary/5 py-12 md:py-16">
            <div className="container px-4">
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Wrench className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold md:text-3xl">
                  Популярные услуги в {district.nameLocative}
                </h2>
              </div>
              
              <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
                {content.popularServices.map((service, index) => {
                  const serviceData = getServiceBySlug(service.slug);
                  if (!serviceData) return null;
                  const Icon = serviceData.icon;
                  return (
                    <Link
                      key={index}
                      to={`/usluga/${service.slug}`}
                      className="group block"
                    >
                      <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
                        <CardContent className="p-6">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <h3 className="font-semibold group-hover:text-primary transition-colors mb-2">
                            {serviceData.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {service.description}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Преимущества для района */}
          <section className="py-12 md:py-16">
            <div className="container px-4">
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold md:text-3xl">
                  Почему мы для {district.nameGenitive}
                </h2>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
                {content.advantages.map((advantage, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-lg border bg-card p-4"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                      ✓
                    </div>
                    <span>{advantage}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Комбинации услуг */}
          {content.combinations.length > 0 && (
            <section className="bg-muted/30 py-12 md:py-16">
              <div className="container px-4">
                <h2 className="text-2xl font-bold md:text-3xl mb-8 text-center">
                  Частые запросы в {district.nameLocative}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
                  {content.combinations.map((combo, index) => {
                    // Формируем ссылку (пока на основную услугу, в будущем — на комбо-страницу)
                    const href = `/usluga/${combo.serviceSlug}`;
                    return (
                      <Link
                        key={index}
                        to={href}
                        className="flex items-center justify-between rounded-lg border bg-background p-4 hover:bg-accent transition-colors group"
                      >
                        <span className="group-hover:text-primary transition-colors">
                          {combo.title} в {district.nameLocative}
                        </span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* Статьи */}
          {content.relatedArticles.length > 0 && (
            <section className="py-12 md:py-16">
              <div className="container px-4">
                <h2 className="text-2xl font-bold md:text-3xl mb-8 text-center">
                  Полезные статьи
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 max-w-3xl mx-auto">
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
                Частые вопросы о СЭС в {district.nameLocative}
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
                {district.description}
              </p>
              <p className="text-muted-foreground mb-8">
                Выезжаем в {district.name} для проведения дезинсекции, дератизации и дезинфекции.
                Время выезда: {district.responseTime}. Работаем с квартирами, частными домами,
                офисами и коммерческими объектами.
              </p>
              
              <div className="grid gap-4 sm:grid-cols-3 mt-8">
                <Link
                  to="/usluga/dezinseksiya"
                  className="flex items-center justify-center gap-2 rounded-lg border p-4 hover:bg-accent transition-colors"
                >
                  <span>Дезинсекция</span>
                </Link>
                <Link
                  to="/usluga/deratizatsiya"
                  className="flex items-center justify-center gap-2 rounded-lg border p-4 hover:bg-accent transition-colors"
                >
                  <span>Дератизация</span>
                </Link>
                <Link
                  to="/usluga/dezinfeksiya"
                  className="flex items-center justify-center gap-2 rounded-lg border p-4 hover:bg-accent transition-colors"
                >
                  <span>Дезинфекция</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Teaser */}
      <section className="py-8 bg-muted/30">
        <div className="container px-4">
          <FAQTeaser 
            limit={3}
            variant="compact"
            title="Ответы на частые вопросы"
          />
        </div>
      </section>

      {/* CTA */}
      <CTABlock
        title={`Вызвать СЭС в ${district.name}`}
        subtitle={`Выезд ${district.responseTime}. Звоните — и мы приедем!`}
      />

      {/* Перелинковка */}
      <section className="border-t py-8">
        <RelatedLinks type="districts" currentSlug={district.slug} title="Другие районы" />
        <RelatedLinks type="services" title="Наши услуги" />
        <RelatedLinks type="pests" title="Вредители" />
      </section>
    </MainLayout>
  );
}
