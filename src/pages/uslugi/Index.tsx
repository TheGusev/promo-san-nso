import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/MainLayout";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { CTABlock } from "@/components/shared/CTABlock";
import { RelatedLinks } from "@/components/shared/RelatedLinks";
import { SEOHead } from "@/components/shared/SEOHead";
import { getAllServices, getMainServices, getAdditionalServices } from "@/data/services";
import { SITE_CONFIG } from "@/data/siteConfig";

export default function UslugiIndex() {
  const mainServices = getMainServices();
  const additionalServices = getAdditionalServices();

  return (
    <MainLayout>
      <SEOHead
        title={`Услуги СЭС в Новосибирске — ${SITE_CONFIG.companyName}`}
        description="Профессиональные услуги санитарно-эпидемиологической службы в Новосибирске: дезинфекция, дезинсекция, дератизация, озонирование. Работаем 24/7."
        canonical="https://promo-san-nso.lovable.app/uslugi"
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-8 md:py-12">
        <div className="container px-4">
          <Breadcrumbs items={[{ label: "Услуги" }]} />
          
          <h1 className="mt-6 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Услуги СЭС в {SITE_CONFIG.regionGenitive}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Профессиональная санитарно-эпидемиологическая служба. Уничтожение вредителей,
            дезинфекция, дератизация. Работаем с частными лицами и организациями {SITE_CONFIG.workingHours}.
          </p>
        </div>
      </section>

      {/* Основные услуги */}
      <section className="py-12 md:py-16">
        <div className="container px-4">
          <h2 className="text-2xl font-bold md:text-3xl mb-8">Основные услуги</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mainServices.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.slug} className="group hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{service.name}</CardTitle>
                        <p className="text-sm text-primary font-medium">
                          {service.priceUnit} {service.priceFrom.toLocaleString("ru-RU")} ₽
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      {service.description}
                    </CardDescription>
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
                      <Link to={`/usluga/${service.slug}`}>
                        Подробнее
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Дополнительные услуги */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container px-4">
          <h2 className="text-2xl font-bold md:text-3xl mb-8">Дополнительные услуги</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {additionalServices.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.slug} className="group hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        <p className="text-sm text-primary font-medium">
                          {service.priceUnit} {service.priceFrom.toLocaleString("ru-RU")} ₽
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      {service.description}
                    </CardDescription>
                    <Button variant="ghost" className="w-full" asChild>
                      <Link to={`/usluga/${service.slug}`}>
                        Подробнее
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16">
        <div className="container px-4">
          <CTABlock
            title="Не знаете, какая услуга нужна?"
            subtitle="Позвоните нам — поможем определить проблему и подобрать решение"
            variant="hero"
          />
        </div>
      </section>

      {/* Перелинковка */}
      <section className="border-t py-8">
        <RelatedLinks type="pests" title="Популярные вредители" maxItems={8} />
        <RelatedLinks type="objects" title="Типы объектов" maxItems={8} />
        <RelatedLinks type="districts" title="Районы обслуживания" maxItems={10} />
      </section>
    </MainLayout>
  );
}
