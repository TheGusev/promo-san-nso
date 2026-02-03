import { Link } from "react-router-dom";
import { Clock, MapPin, Phone, Shield, Building, Star, ChevronRight } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SEOHead } from "@/components/shared/SEOHead";
import { RelatedLinks } from "@/components/shared/RelatedLinks";
import { CTABlock } from "@/components/shared/CTABlock";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCityDistricts, getSuburbDistricts, getRegionDistricts, getPopularDistricts, District } from "@/data/districts";
import { getDistrictContent } from "@/data/districtContent";
import { SITE_CONFIG } from "@/data/siteConfig";

// Карточка района
function DistrictCard({ district }: { district: District }) {
  const content = getDistrictContent(district.slug);
  const hasDetailedContent = !!content;
  
  return (
    <Link
      to={`/rayon/${district.slug}`}
      className="group block"
    >
      <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {district.name}
                </h3>
                {district.isPopular && (
                  <Star className="h-4 w-4 text-primary fill-primary" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {district.description}
              </p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span>Выезд: {district.responseTime}</span>
              </div>
              {hasDetailedContent && (
                <div className="mt-2">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                    Подробная информация
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

// Секция районов
function DistrictSection({ 
  title, 
  description,
  districts 
}: { 
  title: string; 
  description?: string;
  districts: District[];
}) {
  if (districts.length === 0) return null;
  
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold md:text-3xl mb-2">{title}</h2>
      {description && (
        <p className="text-muted-foreground mb-6">{description}</p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {districts.map((district) => (
          <DistrictCard key={district.slug} district={district} />
        ))}
      </div>
    </section>
  );
}

export default function RayonyIndex() {
  const cityDistricts = getCityDistricts();
  const suburbDistricts = getSuburbDistricts();
  const regionDistricts = getRegionDistricts();
  const popularDistricts = getPopularDistricts();

  return (
    <MainLayout>
      <SEOHead
        title={`СЭС по районам Новосибирска и области — ${SITE_CONFIG.companyName}`}
        description="Вызов СЭС в любой район Новосибирска и области. Дезинсекция, дератизация, дезинфекция. Выезд от 30 минут. Уничтожение вредителей с гарантией. Работаем 24/7."
        canonical="https://promo-san-nso.lovable.app/rayony"
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 via-primary/10 to-background py-10 md:py-16">
        <div className="container px-4">
          <Breadcrumbs items={[{ label: "Районы" }]} />

          <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                СЭС по районам {SITE_CONFIG.regionGenitive} и области
              </h1>
              <p className="mt-4 text-lg text-muted-foreground md:text-xl">
                Работаем во всех районах города и области. Быстрый выезд, 
                профессиональная обработка, гарантия результата.
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
                <span>Выезд от 30 минут • Гарантия результата • Работаем 24/7</span>
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center">
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

      {/* Популярные районы */}
      {popularDistricts.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container px-4">
            <div className="flex items-center gap-3 mb-8">
              <Star className="h-6 w-6 text-primary fill-primary" />
              <h2 className="text-2xl font-bold md:text-3xl">Популярные районы</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {popularDistricts.slice(0, 6).map((district) => (
                <DistrictCard key={district.slug} district={district} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Районы города */}
      <section className="bg-muted/30 py-12 md:py-16">
        <div className="container px-4">
          <DistrictSection 
            title="Районы Новосибирска" 
            description="Административные районы города — выезд от 30 минут"
            districts={cityDistricts} 
          />
        </div>
      </section>

      {/* Пригороды */}
      <section className="py-12 md:py-16">
        <div className="container px-4">
          <DistrictSection 
            title="Пригороды и города-спутники" 
            description="Бердск, Искитим, Обь и другие — выезд от 60 минут"
            districts={suburbDistricts} 
          />
        </div>
      </section>

      {/* Область */}
      {regionDistricts.length > 0 && (
        <section className="bg-muted/30 py-12 md:py-16">
          <div className="container px-4">
            <DistrictSection 
              title="Новосибирская область" 
              description="Выезжаем в любой населённый пункт области"
              districts={regionDistricts} 
            />
            <p className="mt-4 text-muted-foreground text-sm">
              Стоимость и время выезда в удалённые населённые пункты уточняйте по телефону.
            </p>
          </div>
        </section>
      )}

      {/* CTA */}
      <CTABlock
        title="Вызвать СЭС в ваш район"
        subtitle="Позвоните — и мы приедем в удобное для вас время"
        variant="hero"
      />

      {/* Перелинковка */}
      <section className="border-t py-8">
        <RelatedLinks type="services" title="Услуги" />
        <RelatedLinks type="pests" title="Вредители" />
        <RelatedLinks type="objects" title="Типы объектов" />
      </section>
    </MainLayout>
  );
}
