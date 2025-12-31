import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { AnimatedSection } from "@/components/ui/animated-section";
import { ServiceData } from "@/data/servicesData";
import { reachGoal } from "@/lib/yandexMetrika";
import { logTrafficEvent } from "@/hooks/useTrafficLogging";

interface ServicePageLayoutProps {
  service: ServiceData;
}

export default function ServicePageLayout({ service }: ServicePageLayoutProps) {
  useEffect(() => {
    // Update document title and meta tags
    document.title = service.metaTitle;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", service.metaDescription);
    }

    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', `https://xn--d1aey.xn--p1ai/${service.slug}`);

    // Log page view
    logTrafficEvent("page_view", { service: service.id });
    
    // Scroll to top
    window.scrollTo(0, 0);
  }, [service]);

  const handleCTAClick = () => {
    reachGoal("service_cta_click");
    logTrafficEvent("service_cta_click", { service: service.id });
  };

  const Icon = service.icon;

  // Schema.org structured data
  const schemaService = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.heroDescription,
    "provider": {
      "@type": "LocalBusiness",
      "name": "ООО Санитарные Решения",
      "telephone": "+7 (383) 312-16-60",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Новосибирск",
        "addressRegion": "Новосибирская область",
        "addressCountry": "RU"
      }
    },
    "areaServed": {
      "@type": "City",
      "name": "Новосибирск"
    },
    "offers": {
      "@type": "Offer",
      "priceSpecification": {
        "@type": "PriceSpecification",
        "price": service.priceFrom.replace(/[^\d]/g, ""),
        "priceCurrency": "RUB",
        "minPrice": service.priceFrom.replace(/[^\d]/g, "")
      }
    }
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Главная",
        "item": "https://xn--d1aey.xn--p1ai/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": service.title,
        "item": `https://xn--d1aey.xn--p1ai/${service.slug}`
      }
    ]
  };

  const schemaFAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": service.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaService) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFAQ) }}
      />

      <Header />

      {/* Breadcrumb */}
      <nav className="container px-4 py-4" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li>
            <Link to="/" className="hover:text-primary transition-colors">
              Главная
            </Link>
          </li>
          <li>/</li>
          <li className="text-foreground font-medium">{service.title}</li>
        </ol>
      </nav>

      {/* Hero Section */}
      <section className="container px-4 py-8 md:py-16">
        <AnimatedSection animation="fade-up">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <span className="text-sm font-medium text-primary">{service.priceFrom}</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {service.heroTitle}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {service.heroDescription}
              </p>
              <ul className="space-y-2 mb-8">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-hero hover:opacity-90"
                  onClick={() => {
                    handleCTAClick();
                    window.location.href = "/#calculator";
                  }}
                >
                  Рассчитать стоимость
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="tel:+73833121660" onClick={handleCTAClick}>
                    <Phone className="mr-2 h-5 w-5" />
                    Позвонить
                  </a>
                </Button>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 bg-gradient-hero rounded-full opacity-20 blur-3xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                <div className="relative bg-card border rounded-2xl p-8 shadow-lg">
                  <Icon className="h-32 w-32 text-primary mx-auto" />
                  <p className="text-center mt-4 font-semibold text-lg">{service.shortTitle}</p>
                  <p className="text-center text-primary text-2xl font-bold mt-2">{service.priceFrom}</p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/30 py-12 md:py-16">
        <div className="container px-4">
          <AnimatedSection animation="fade-up">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Почему выбирают нас
            </h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.benefits.map((benefit, index) => (
              <AnimatedSection key={index} animation="scale-up" delay={index * 100}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">{benefit.description}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="container px-4 py-12 md:py-16">
        <AnimatedSection animation="fade-up">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Как мы работаем
          </h2>
        </AnimatedSection>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {service.process.map((step, index) => (
            <AnimatedSection key={index} animation="fade-up" delay={index * 100}>
              <div className="relative">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    {step.step}
                  </div>
                  <h3 className="font-semibold">{step.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm pl-14">{step.description}</p>
                {index < service.process.length - 1 && (
                  <div className="hidden lg:block absolute top-5 left-[calc(100%+0.5rem)] w-[calc(100%-3rem)] h-0.5 bg-border" />
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Targets Section */}
      <section className="bg-muted/30 py-12 md:py-16">
        <div className="container px-4">
          <AnimatedSection animation="fade-up">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Что мы уничтожаем / устраняем
            </h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {service.targets.map((target, index) => (
              <AnimatedSection key={index} animation="scale-up" delay={index * 50}>
                <div className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold mb-1">{target.name}</h3>
                  <p className="text-sm text-muted-foreground">{target.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Prices Section */}
      <section className="container px-4 py-12 md:py-16">
        <AnimatedSection animation="fade-up">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Цены на {service.title.toLowerCase()}
          </h2>
        </AnimatedSection>
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {service.prices.map((price, index) => (
                  <AnimatedSection key={index} animation="fade-up" delay={index * 50}>
                    <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                      <div>
                        <span className="font-medium">{price.objectType}</span>
                        {price.note && (
                          <span className="text-sm text-muted-foreground ml-2">({price.note})</span>
                        )}
                      </div>
                      <span className="font-bold text-primary">{price.price}</span>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </CardContent>
          </Card>
          <AnimatedSection animation="fade-up" delay={300}>
            <p className="text-center text-muted-foreground mt-4 text-sm">
              * Точная стоимость зависит от площади, степени заражения и выбранного метода обработки
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-muted/30 py-12 md:py-16">
        <div className="container px-4">
          <AnimatedSection animation="fade-up">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Вопросы и ответы
            </h2>
          </AnimatedSection>
          <div className="max-w-3xl mx-auto space-y-4">
            {service.faqs.map((faq, index) => (
              <AnimatedSection key={index} animation="fade-up" delay={index * 100}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-12 md:py-16">
        <AnimatedSection animation="scale-up">
          <Card className="bg-gradient-hero text-primary-foreground">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Нужна {service.title.toLowerCase()}?
              </h2>
              <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
                Оставьте заявку, и мы перезвоним в течение 15 минут. Бесплатная консультация и расчёт стоимости.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => {
                    handleCTAClick();
                    window.location.href = "/#calculator";
                  }}
                >
                  Рассчитать стоимость
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <a href="tel:+73833121660" onClick={handleCTAClick}>
                    <Phone className="mr-2 h-5 w-5" />
                    +7 (383) 312-16-60
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      </section>

      <Footer />
      <FloatingButtons />
    </div>
  );
}
