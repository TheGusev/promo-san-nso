import { Link } from "react-router-dom";
import { Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/MainLayout";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SEOHead } from "@/components/shared/SEOHead";
import { RelatedLinks } from "@/components/shared/RelatedLinks";
import { getAllPests, getInsects, getRodents } from "@/data/pests";
import { SITE_CONFIG } from "@/data/siteConfig";

export default function VreditediIndex() {
  const insects = getInsects();
  const rodents = getRodents();

  return (
    <MainLayout>
      <SEOHead
        title={`Уничтожение вредителей в Новосибирске — ${SITE_CONFIG.companyName}`}
        description="Профессиональное уничтожение насекомых и грызунов в Новосибирске: клопы, тараканы, крысы, мыши. Гарантия результата. Работаем 24/7."
        canonical="https://promo-san-nso.lovable.app/vrediteli"
      />

      <section className="bg-gradient-to-b from-primary/5 to-background py-8 md:py-12">
        <div className="container px-4">
          <Breadcrumbs items={[{ label: "Вредители" }]} />

          <h1 className="mt-6 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Уничтожение вредителей в {SITE_CONFIG.regionGenitive}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Профессиональная борьба с насекомыми и грызунами. Современные методы, 
            безопасные препараты, гарантия результата.
          </p>
        </div>
      </section>

      {/* Насекомые */}
      <section className="py-12 md:py-16">
        <div className="container px-4">
          <h2 className="text-2xl font-bold md:text-3xl mb-6">Насекомые</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {insects.map((pest) => (
              <Link
                key={pest.slug}
                to={`/vreditel/${pest.slug}`}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent transition-colors"
              >
                <div>
                  <h3 className="font-medium">{pest.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {pest.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Грызуны */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container px-4">
          <h2 className="text-2xl font-bold md:text-3xl mb-6">Грызуны</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rodents.map((pest) => (
              <Link
                key={pest.slug}
                to={`/vreditel/${pest.slug}`}
                className="flex items-center justify-between rounded-lg border bg-background p-4 hover:bg-accent transition-colors"
              >
                <div>
                  <h3 className="font-medium">{pest.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {pest.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Перелинковка */}
      <section className="border-t py-8">
        <RelatedLinks type="services" title="Услуги" />
        <RelatedLinks type="objects" title="Типы объектов" />
      </section>
    </MainLayout>
  );
}
