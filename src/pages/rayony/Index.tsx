import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SEOHead } from "@/components/shared/SEOHead";
import { RelatedLinks } from "@/components/shared/RelatedLinks";
import { CTABlock } from "@/components/shared/CTABlock";
import { getCityDistricts, getSuburbDistricts, getRegionDistricts } from "@/data/districts";
import { SITE_CONFIG } from "@/data/siteConfig";

export default function RayonyIndex() {
  const cityDistricts = getCityDistricts();
  const suburbDistricts = getSuburbDistricts();
  const regionDistricts = getRegionDistricts();

  const DistrictCard = ({ district }: { district: typeof cityDistricts[0] }) => (
    <Link
      to={`/rayon/${district.slug}`}
      className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent transition-colors"
    >
      <div>
        <h3 className="font-medium">{district.name}</h3>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Выезд: {district.responseTime}</span>
        </div>
      </div>
    </Link>
  );

  return (
    <MainLayout>
      <SEOHead
        title={`СЭС по районам Новосибирска — ${SITE_CONFIG.companyName}`}
        description="Вызов СЭС в любой район Новосибирска и области. Выезд от 30 минут. Уничтожение вредителей с гарантией. Работаем 24/7."
        canonical="https://promo-san-nso.lovable.app/rayony"
      />

      <section className="bg-gradient-to-b from-primary/5 to-background py-8 md:py-12">
        <div className="container px-4">
          <Breadcrumbs items={[{ label: "Районы" }]} />

          <h1 className="mt-6 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            СЭС по районам {SITE_CONFIG.regionGenitive}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Работаем во всех районах Новосибирска и области. Быстрый выезд, 
            профессиональная обработка, гарантия результата.
          </p>
        </div>
      </section>

      {/* Районы города */}
      <section className="py-12 md:py-16">
        <div className="container px-4">
          <h2 className="text-2xl font-bold md:text-3xl mb-6">Районы Новосибирска</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cityDistricts.map((district) => (
              <DistrictCard key={district.slug} district={district} />
            ))}
          </div>
        </div>
      </section>

      {/* Пригороды */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container px-4">
          <h2 className="text-2xl font-bold md:text-3xl mb-6">Пригороды</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {suburbDistricts.map((district) => (
              <DistrictCard key={district.slug} district={district} />
            ))}
          </div>
        </div>
      </section>

      {/* Область */}
      <section className="py-12 md:py-16">
        <div className="container px-4">
          <h2 className="text-2xl font-bold md:text-3xl mb-6">Новосибирская область</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {regionDistricts.map((district) => (
              <DistrictCard key={district.slug} district={district} />
            ))}
          </div>
          <p className="mt-4 text-muted-foreground">
            Выезжаем в любой населённый пункт Новосибирской области. 
            Стоимость и время выезда уточняйте по телефону.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container px-4">
          <CTABlock
            title="Вызвать СЭС в ваш район"
            subtitle="Позвоните — и мы приедем в удобное для вас время"
            variant="hero"
          />
        </div>
      </section>

      <section className="border-t py-8">
        <RelatedLinks type="services" title="Услуги" />
        <RelatedLinks type="pests" title="Вредители" />
      </section>
    </MainLayout>
  );
}
