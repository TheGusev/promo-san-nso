// Централизованный модуль Schema.org для SEO
// Все JSON-LD схемы генерируются здесь

import { SITE_CONFIG } from "@/data/siteConfig";
import { districts, type District } from "@/data/districts";
import type { Service } from "@/data/services";
import type { Pest } from "@/data/pests";
import type { ObjectType } from "@/data/objects";

// ============================================
// LocalBusiness Schema (для layout или главной)
// ============================================
export const getLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
  "@id": `${SITE_CONFIG.siteUrl}/#business`,
  name: SITE_CONFIG.companyName,
  legalName: SITE_CONFIG.legalName,
  description: SITE_CONFIG.description,
  telephone: SITE_CONFIG.phoneTel,
  email: SITE_CONFIG.email,
  url: SITE_CONFIG.siteUrl,
  priceRange: "₽₽",
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE_CONFIG.address.streetAddress,
    addressLocality: SITE_CONFIG.address.city,
    addressRegion: SITE_CONFIG.address.region,
    postalCode: SITE_CONFIG.address.postalCode,
    addressCountry: SITE_CONFIG.address.country,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: SITE_CONFIG.coordinates.latitude,
    longitude: SITE_CONFIG.coordinates.longitude,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "00:00",
    closes: "23:59",
  },
  areaServed: [
    { "@type": "City", name: "Новосибирск" },
    ...districts
      .filter(d => d.type === "city" || d.type === "suburb")
      .map(d => ({ "@type": "City", name: d.name })),
  ],
  sameAs: [
    SITE_CONFIG.links.twoGis,
    SITE_CONFIG.links.telegram,
  ],
});

// ============================================
// Service Schema (для страниц услуг и programmatic)
// ============================================
export interface ServiceSchemaParams {
  service: Service;
  pest?: Pest;
  object?: ObjectType;
  district?: District;
  url: string;
  priceFrom?: number;
}

export const getServiceSchema = (params: ServiceSchemaParams) => {
  const { service, pest, object, district, url, priceFrom } = params;
  
  // Формируем название услуги с контекстом
  const nameParts = [service.shortName];
  if (pest) nameParts.push(`от ${pest.nameGenitive}`);
  if (object) nameParts.push(object.nameGenitive);
  if (district) nameParts.push(`в ${district.name}`);

  const price = priceFrom || service.priceFrom;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: nameParts.join(" "),
    description: service.description,
    provider: {
      "@type": "LocalBusiness",
      "@id": `${SITE_CONFIG.siteUrl}/#business`,
      name: SITE_CONFIG.companyName,
    },
    areaServed: district
      ? { "@type": "AdministrativeArea", name: district.name }
      : { "@type": "City", name: "Новосибирск" },
    serviceType: service.name,
    url: `${SITE_CONFIG.siteUrl}${url}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "RUB",
      price: price,
      priceSpecification: {
        "@type": "PriceSpecification",
        price: price,
        priceCurrency: "RUB",
        minPrice: price,
      },
      availability: "https://schema.org/InStock",
    },
  };
};

// ============================================
// Article Schema (для блога)
// ============================================
export interface ArticleSchemaParams {
  title: string;
  description: string;
  slug: string;
  publishDate: string;
  modifiedDate?: string;
  authorName?: string;
}

export const getArticleSchema = (article: ArticleSchemaParams) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: article.title,
  description: article.description,
  datePublished: article.publishDate,
  dateModified: article.modifiedDate || article.publishDate,
  author: {
    "@type": "Organization",
    name: article.authorName || SITE_CONFIG.companyName,
    url: SITE_CONFIG.siteUrl,
  },
  publisher: {
    "@type": "Organization",
    name: SITE_CONFIG.companyName,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_CONFIG.siteUrl}/og-image.jpg`,
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${SITE_CONFIG.siteUrl}/blog/${article.slug}`,
  },
});

// ============================================
// FAQ Schema
// ============================================
export interface FaqItem {
  question: string;
  answer: string;
}

export const getFaqSchema = (items: FaqItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map(item => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
});

// ============================================
// Breadcrumb Schema
// ============================================
export interface BreadcrumbItem {
  name: string;
  href: string;
}

export const getBreadcrumbSchema = (items: BreadcrumbItem[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Главная",
      item: SITE_CONFIG.siteUrl,
    },
    ...items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 2,
      name: item.name,
      item: `${SITE_CONFIG.siteUrl}${item.href}`,
    })),
  ],
});

// ============================================
// WebSite Schema (для главной страницы)
// ============================================
export const getWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_CONFIG.siteUrl}/#website`,
  name: `СЭС ${SITE_CONFIG.companyName}`,
  url: SITE_CONFIG.siteUrl,
  publisher: {
    "@type": "Organization",
    "@id": `${SITE_CONFIG.siteUrl}/#business`,
    name: SITE_CONFIG.companyName,
  },
});

// ============================================
// Organization Schema
// ============================================
export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_CONFIG.siteUrl}/#organization`,
  name: SITE_CONFIG.companyName,
  legalName: SITE_CONFIG.legalName,
  url: SITE_CONFIG.siteUrl,
  logo: `${SITE_CONFIG.siteUrl}/og-image.jpg`,
  telephone: SITE_CONFIG.phoneTel,
  email: SITE_CONFIG.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE_CONFIG.address.streetAddress,
    addressLocality: SITE_CONFIG.address.city,
    addressRegion: SITE_CONFIG.address.region,
    postalCode: SITE_CONFIG.address.postalCode,
    addressCountry: SITE_CONFIG.address.country,
  },
  sameAs: [
    SITE_CONFIG.links.twoGis,
    SITE_CONFIG.links.telegram,
  ],
});

// ============================================
// ItemList Schema (для списков услуг, вредителей и т.д.)
// ============================================
export interface ListItem {
  name: string;
  url: string;
  description?: string;
}

export const getItemListSchema = (items: ListItem[], listName: string) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: listName,
  numberOfItems: items.length,
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Service",
      name: item.name,
      url: `${SITE_CONFIG.siteUrl}${item.url}`,
      ...(item.description && { description: item.description }),
    },
  })),
});
