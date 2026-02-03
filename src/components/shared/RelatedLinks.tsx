import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getAllServices, type Service } from "@/data/services";
import { getPopularPests, type Pest } from "@/data/pests";
import { getPopularObjects, type ObjectType } from "@/data/objects";
import { getPopularDistricts, type District } from "@/data/districts";
import { cn } from "@/lib/utils";

type RelatedType = "services" | "pests" | "objects" | "districts";

interface RelatedLinksProps {
  type: RelatedType;
  currentSlug?: string;
  title?: string;
  maxItems?: number;
  className?: string;
}

const CONFIG: Record<RelatedType, {
  defaultTitle: string;
  getItems: () => { slug: string; name: string }[];
  getLink: (slug: string) => string;
  allLink: string;
  allLabel: string;
}> = {
  services: {
    defaultTitle: "Другие услуги",
    getItems: () => getAllServices().map(s => ({ slug: s.slug, name: s.name })),
    getLink: (slug) => `/usluga/${slug}`,
    allLink: "/uslugi",
    allLabel: "Все услуги",
  },
  pests: {
    defaultTitle: "Популярные вредители",
    getItems: () => getPopularPests().map(p => ({ slug: p.slug, name: p.name })),
    getLink: (slug) => `/vreditel/${slug}`,
    allLink: "/vrediteli",
    allLabel: "Все вредители",
  },
  objects: {
    defaultTitle: "Типы объектов",
    getItems: () => getPopularObjects().map(o => ({ slug: o.slug, name: o.name })),
    getLink: (slug) => `/obekt/${slug}`,
    allLink: "/obekty",
    allLabel: "Все объекты",
  },
  districts: {
    defaultTitle: "Районы обслуживания",
    getItems: () => getPopularDistricts().map(d => ({ slug: d.slug, name: d.name })),
    getLink: (slug) => `/rayon/${slug}`,
    allLink: "/rayony",
    allLabel: "Все районы",
  },
};

export function RelatedLinks({
  type,
  currentSlug,
  title,
  maxItems = 6,
  className,
}: RelatedLinksProps) {
  const config = CONFIG[type];
  const items = config.getItems()
    .filter(item => item.slug !== currentSlug)
    .slice(0, maxItems);

  if (items.length === 0) return null;

  return (
    <section className={cn("py-8", className)}>
      <div className="container px-4">
        <h3 className="mb-4 text-lg font-semibold">
          {title || config.defaultTitle}
        </h3>
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <Link
              key={item.slug}
              to={config.getLink(item.slug)}
              className="inline-flex items-center rounded-full bg-muted px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {item.name}
            </Link>
          ))}
          <Link
            to={config.allLink}
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-4 py-2 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {config.allLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// Комбинированный блок с несколькими типами ссылок
interface CombinedRelatedLinksProps {
  excludeSlug?: string;
  className?: string;
}

export function CombinedRelatedLinks({ excludeSlug, className }: CombinedRelatedLinksProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <RelatedLinks type="services" currentSlug={excludeSlug} maxItems={5} />
      <RelatedLinks type="pests" currentSlug={excludeSlug} maxItems={5} />
      <RelatedLinks type="districts" currentSlug={excludeSlug} maxItems={6} />
    </div>
  );
}
