import { useEffect } from "react";
import { SITE_CONFIG } from "@/data/siteConfig";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  type?: "website" | "article";
  image?: string;
  noindex?: boolean;
}

export function SEOHead({
  title,
  description,
  canonical,
  type = "website",
  image = "/og-image.jpg",
  noindex = false,
}: SEOHeadProps) {
  useEffect(() => {
    // Обновляем title
    document.title = title;

    // Обновляем или создаём мета-теги
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const selector = isProperty
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement("meta");
        if (isProperty) {
          meta.setAttribute("property", name);
        } else {
          meta.setAttribute("name", name);
        }
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Базовые мета-теги
    updateMeta("description", description);
    
    // Robots
    if (noindex) {
      updateMeta("robots", "noindex, nofollow");
    } else {
      updateMeta("robots", "index, follow");
    }

    // Open Graph
    updateMeta("og:title", title, true);
    updateMeta("og:description", description, true);
    updateMeta("og:type", type, true);
    updateMeta("og:image", image, true);
    updateMeta("og:site_name", SITE_CONFIG.companyName, true);
    updateMeta("og:locale", "ru_RU", true);

    // Twitter Card
    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:title", title);
    updateMeta("twitter:description", description);
    updateMeta("twitter:image", image);

    // Canonical
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = canonical;
    }

    // Hreflang для русскоязычной версии
    const hreflangRu = document.querySelector('link[rel="alternate"][hreflang="ru"]') as HTMLLinkElement;
    if (!hreflangRu) {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = "ru";
      link.href = canonical || SITE_CONFIG.siteUrl;
      document.head.appendChild(link);
    } else {
      hreflangRu.href = canonical || SITE_CONFIG.siteUrl;
    }

    // Cleanup: возвращаем старый title при размонтировании
    return () => {
      // Опционально: можно вернуть дефолтный title
    };
  }, [title, description, canonical, type, image, noindex]);

  return null;
}
