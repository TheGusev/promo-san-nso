import { Link } from "react-router-dom";
import { Building, Home, Briefcase, Factory, Users, Phone, Shield, ChevronRight, Star } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SEOHead } from "@/components/shared/SEOHead";
import { CTABlock } from "@/components/shared/CTABlock";
import { RelatedLinks } from "@/components/shared/RelatedLinks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  getResidentialObjects, 
  getCommercialObjects, 
  getIndustrialObjects,
  getPublicObjects,
  getPopularObjects,
  ObjectType
} from "@/data/objects";
import { getServiceBySlug } from "@/data/services";
import { SITE_CONFIG } from "@/data/siteConfig";

// Иконки для категорий
const categoryIcons = {
  residential: Home,
  commercial: Briefcase,
  industrial: Factory,
  public: Users,
};

// Компонент карточки объекта
function ObjectCard({ obj }: { obj: ObjectType }) {
  const relatedService = obj.relatedServices[0] 
    ? getServiceBySlug(obj.relatedServices[0]) 
    : null;

  return (
    <Link
      to={`/obekt/${obj.slug}`}
      className="group block"
    >
      <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {obj.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {obj.description}
              </p>
              
              {obj.relatedServices.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {obj.relatedServices.slice(0, 2).map((serviceSlug) => {
                    const service = getServiceBySlug(serviceSlug);
                    return service ? (
                      <span 
                        key={serviceSlug}
                        className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                      >
                        {service.shortName}
                      </span>
                    ) : null;
                  })}
                </div>
              )}
              
              {obj.isPopular && (
                <div className="mt-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning-foreground">
                    <Star className="h-3 w-3" />
                    Популярный
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

// Секция с категорией объектов
function ObjectSection({ 
  title, 
  objects,
  icon: Icon,
  description 
}: { 
  title: string; 
  objects: ObjectType[];
  icon: React.ElementType;
  description: string;
}) {
  if (objects.length === 0) return null;
  
  return (
    <section className="py-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <p className="text-muted-foreground mb-6 ml-13">{description}</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {objects.map((obj) => (
          <ObjectCard key={obj.slug} obj={obj} />
        ))}
      </div>
    </section>
  );
}

export default function ObektyIndex() {
  const residential = getResidentialObjects();
  const commercial = getCommercialObjects();
  const industrial = getIndustrialObjects();
  const publicObjects = getPublicObjects();
  const popularObjects = getPopularObjects();

  return (
    <MainLayout>
      <SEOHead
        title={`Обработка объектов от вредителей в Новосибирске — квартиры, дома, офисы | ${SITE_CONFIG.companyName}`}
        description="Профессиональная обработка квартир, частных домов, офисов, ресторанов, складов от насекомых и грызунов в Новосибирске. Гарантия результата. Документы для проверок."
        canonical={`${SITE_CONFIG.siteUrl}/obekty`}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 via-primary/10 to-background py-10 md:py-16">
        <div className="container px-4">
          <Breadcrumbs items={[{ label: "Объекты" }]} />

          <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                Обработка объектов от вредителей в {SITE_CONFIG.regionPrepositional}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground md:text-xl">
                Работаем с любыми типами объектов: от студий до промышленных предприятий. 
                Индивидуальный подход и соблюдение всех санитарных норм.
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

            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-md overflow-hidden rounded-2xl shadow-lg">
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
                <img
                  src="/images/objects/_index.jpg"
                  alt="Обработка различных типов объектов в Новосибирске"
                  loading="eager"
                  className="h-64 w-full object-cover md:h-80"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Популярные объекты */}
      {popularObjects.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container px-4">
            <div className="flex items-center gap-3 mb-8">
              <Star className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold md:text-3xl">Популярные типы объектов</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {popularObjects.map((obj) => (
                <ObjectCard key={obj.slug} obj={obj} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Категории объектов */}
      <section className="bg-muted/30 py-8 md:py-12">
        <div className="container px-4">
          <ObjectSection 
            title="Жилые объекты" 
            objects={residential}
            icon={Home}
            description="Квартиры, дома, общежития — безопасная обработка для семей с детьми и домашними животными."
          />
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container px-4">
          <ObjectSection 
            title="Коммерческие объекты" 
            objects={commercial}
            icon={Briefcase}
            description="Рестораны, кафе, магазины, офисы — соответствие СанПиН, документы для проверок."
          />
        </div>
      </section>

      <section className="bg-muted/30 py-8 md:py-12">
        <div className="container px-4">
          <ObjectSection 
            title="Промышленные объекты" 
            objects={industrial}
            icon={Factory}
            description="Склады, производства — защита продукции, соответствие ХАССП."
          />
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container px-4">
          <ObjectSection 
            title="Общественные объекты" 
            objects={publicObjects}
            icon={Users}
            description="Школы, детские сады, больницы — работа в нерабочее время, безопасные препараты."
          />
        </div>
      </section>

      {/* CTA */}
      <CTABlock
        title="Не нашли свой тип объекта?"
        subtitle="Позвоните нам — обработаем любой объект в Новосибирске и области"
      />

      {/* Перелинковка */}
      <section className="border-t py-8">
        <RelatedLinks type="services" title="Наши услуги" />
        <RelatedLinks type="pests" title="Вредители" />
        <RelatedLinks type="districts" title="Районы обслуживания" />
      </section>
    </MainLayout>
  );
}

