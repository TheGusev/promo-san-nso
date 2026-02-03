import { Link } from "react-router-dom";
import { Bug, Rat, ChevronRight, Phone, Shield, AlertTriangle } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SEOHead } from "@/components/shared/SEOHead";
import { CTABlock } from "@/components/shared/CTABlock";
import { RelatedLinks } from "@/components/shared/RelatedLinks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getInsects, getRodents, getPopularPests, Pest } from "@/data/pests";
import { getServiceBySlug } from "@/data/services";
import { SITE_CONFIG } from "@/data/siteConfig";

// Компонент карточки вредителя
function PestCard({ pest }: { pest: Pest }) {
  const relatedService = pest.relatedServices[0] 
    ? getServiceBySlug(pest.relatedServices[0]) 
    : null;

  return (
    <Link
      to={`/vreditel/${pest.slug}`}
      className="group block"
    >
      <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {pest.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {pest.description}
              </p>
              
              {relatedService && (
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Услуга:</span>
                  <span className="text-primary font-medium">{relatedService.shortName}</span>
                </div>
              )}
              
              {pest.isPopular && (
                <div className="mt-2">
                  <span className="inline-flex items-center rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                    Частый запрос
                  </span>
                </div>
              )}
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function VreditediIndex() {
  const insects = getInsects();
  const rodents = getRodents();
  const popularPests = getPopularPests();

  return (
    <MainLayout>
      <SEOHead
        title={`Уничтожение вредителей в Новосибирске — борьба с насекомыми и грызунами | ${SITE_CONFIG.companyName}`}
        description="Профессиональное уничтожение насекомых и грызунов в Новосибирске и области: клопы, тараканы, блохи, крысы, мыши, муравьи. Гарантия результата до 1 года. Работаем 24/7."
        canonical={`${SITE_CONFIG.siteUrl}/vrediteli`}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-destructive/5 via-destructive/10 to-background py-10 md:py-16">
        <div className="container px-4">
          <Breadcrumbs items={[{ label: "Вредители" }]} />

          <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                Уничтожение вредителей в {SITE_CONFIG.regionPrepositional}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground md:text-xl">
                Профессиональная борьба с насекомыми и грызунами. Современные методы, 
                безопасные препараты, гарантия результата до 12 месяцев.
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
                <span>Работаем по всей Новосибирской области 24/7</span>
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center gap-8">
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-destructive/20 to-destructive/5">
                <Bug className="h-16 w-16 text-destructive/60" />
              </div>
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-destructive/20 to-destructive/5">
                <Rat className="h-16 w-16 text-destructive/60" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Популярные вредители */}
      {popularPests.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container px-4">
            <div className="flex items-center gap-3 mb-8">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              <h2 className="text-2xl font-bold md:text-3xl">Частые запросы</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {popularPests.map((pest) => (
                <PestCard key={pest.slug} pest={pest} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Насекомые */}
      <section className="bg-muted/30 py-12 md:py-16">
        <div className="container px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Bug className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold md:text-3xl">Насекомые</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {insects.map((pest) => (
              <PestCard key={pest.slug} pest={pest} />
            ))}
          </div>
          
          <div className="mt-8 p-6 rounded-lg bg-background border">
            <p className="text-muted-foreground">
              <strong className="text-foreground">Дезинсекция</strong> — комплекс мер по уничтожению насекомых-вредителей. 
              Применяем холодный и горячий туман, гелевую обработку, барьерную защиту. 
              Все препараты сертифицированы и безопасны для людей и домашних животных после проветривания.
            </p>
            <Button variant="link" className="px-0 mt-2" asChild>
              <Link to="/usluga/dezinseksiya">Подробнее о дезинсекции →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Грызуны */}
      <section className="py-12 md:py-16">
        <div className="container px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Rat className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold md:text-3xl">Грызуны</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rodents.map((pest) => (
              <PestCard key={pest.slug} pest={pest} />
            ))}
          </div>
          
          <div className="mt-8 p-6 rounded-lg bg-muted/50 border">
            <p className="text-muted-foreground">
              <strong className="text-foreground">Дератизация</strong> — профессиональное уничтожение крыс, мышей и других грызунов. 
              Используем родентицидные приманки в защитных станциях, механические ловушки, 
              герметизацию путей проникновения. Регулярное обслуживание для предприятий по договору.
            </p>
            <Button variant="link" className="px-0 mt-2" asChild>
              <Link to="/usluga/deratizatsiya">Подробнее о дератизации →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTABlock
        title="Обнаружили вредителей?"
        subtitle="Позвоните нам — бесплатная консультация и выезд специалиста"
      />

      {/* Перелинковка */}
      <section className="border-t py-8">
        <RelatedLinks type="services" title="Наши услуги" />
        <RelatedLinks type="objects" title="Типы объектов" />
        <RelatedLinks type="districts" title="Районы обслуживания" />
      </section>
    </MainLayout>
  );
}
