import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SEOHead } from "@/components/shared/SEOHead";
import { RelatedLinks } from "@/components/shared/RelatedLinks";
import { 
  getResidentialObjects, 
  getCommercialObjects, 
  getIndustrialObjects,
  getPublicObjects 
} from "@/data/objects";
import { SITE_CONFIG } from "@/data/siteConfig";

export default function ObektyIndex() {
  const residential = getResidentialObjects();
  const commercial = getCommercialObjects();
  const industrial = getIndustrialObjects();
  const publicObjects = getPublicObjects();

  const ObjectSection = ({ title, objects }: { title: string; objects: typeof residential }) => (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {objects.map((obj) => (
          <Link
            key={obj.slug}
            to={`/obekt/${obj.slug}`}
            className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent transition-colors"
          >
            <div>
              <h3 className="font-medium">{obj.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {obj.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <MainLayout>
      <SEOHead
        title={`Обработка объектов от вредителей в Новосибирске — ${SITE_CONFIG.companyName}`}
        description="Профессиональная обработка квартир, домов, офисов, ресторанов, складов от вредителей в Новосибирске. Работаем 24/7."
        canonical="https://promo-san-nso.lovable.app/obekty"
      />

      <section className="bg-gradient-to-b from-primary/5 to-background py-8 md:py-12">
        <div className="container px-4">
          <Breadcrumbs items={[{ label: "Объекты" }]} />

          <h1 className="mt-6 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Обработка объектов от вредителей
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Работаем с любыми типами объектов: от квартир до промышленных предприятий.
            Индивидуальный подход и соблюдение всех санитарных норм.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container px-4">
          <ObjectSection title="Жилые объекты" objects={residential} />
          <ObjectSection title="Коммерческие объекты" objects={commercial} />
          <ObjectSection title="Промышленные объекты" objects={industrial} />
          <ObjectSection title="Общественные объекты" objects={publicObjects} />
        </div>
      </section>

      <section className="border-t py-8">
        <RelatedLinks type="services" title="Услуги" />
        <RelatedLinks type="pests" title="Вредители" />
      </section>
    </MainLayout>
  );
}
