import { useParams, Link, Navigate } from "react-router-dom";
import { Phone, Clock, Shield, ChevronRight, CheckCircle2, HelpCircle, Banknote } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SEOHead } from "@/components/shared/SEOHead";
import { CTABlock } from "@/components/shared/CTABlock";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getMatrixEntry, generateComboUrl, MatrixEntry } from "@/data/programmaticMatrix";
import { getServiceBySlug } from "@/data/services";
import { getPestBySlug } from "@/data/pests";
import { getObjectBySlug } from "@/data/objects";
import { getDistrictBySlug } from "@/data/districts";
import { SITE_CONFIG } from "@/data/siteConfig";
import {
  generateH1,
  generateIntro,
  generateSituation,
  generateTreatmentSteps,
  generatePricing,
  generateGuarantee,
  generateFAQ,
} from "@/lib/programmaticContent";

export default function ComboPage() {
  const { serviceSlug, comboSlug } = useParams<{ serviceSlug: string; comboSlug: string }>();

  if (!serviceSlug || !comboSlug) {
    return <Navigate to="/uslugi" replace />;
  }

  const entry = getMatrixEntry(serviceSlug, comboSlug);

  if (!entry) {
    return <Navigate to={`/usluga/${serviceSlug}`} replace />;
  }

  // Получаем связанные сущности
  const service = getServiceBySlug(entry.serviceSlug);
  const pest = entry.pestSlug ? getPestBySlug(entry.pestSlug) : undefined;
  const object = getObjectBySlug(entry.objectSlug);
  const district = entry.districtSlug ? getDistrictBySlug(entry.districtSlug) : undefined;

  // Генерируем контент
  const h1 = generateH1(entry);
  const intro = generateIntro(entry);
  const situation = generateSituation(entry);
  const treatmentSteps = generateTreatmentSteps(entry);
  const pricing = generatePricing(entry);
  const guarantee = generateGuarantee(entry);
  const faq = generateFAQ(entry);

  // Хлебные крошки
  const lastLabel = entry.pestSlug && pest 
    ? pest.name 
    : entry.districtSlug && district 
      ? district.name 
      : entry.objectName;
  
  const breadcrumbs: { label: string; href?: string }[] = [
    { label: "Услуги", href: "/uslugi" },
    { label: entry.serviceName, href: `/usluga/${entry.serviceSlug}` },
    { label: lastLabel },
  ];

  // Meta
  const metaTitle = `${entry.mainKeyword} — СЭС ${SITE_CONFIG.companyName}`;
  const metaDescription = `${entry.serviceName} ${entry.objectName}ы${entry.pestSlug ? ` от ${entry.pestName?.toLowerCase()}` : ""}${entry.districtSlug ? ` в ${entry.districtName}е` : ` в ${SITE_CONFIG.region}е`}. Цена от ${entry.priceFrom || 2500}₽. Гарантия ${entry.guaranteeDays ? Math.round(entry.guaranteeDays / 30) : 3} мес. Выезд за 30 мин.`;

  return (
    <MainLayout>
      <SEOHead
        title={metaTitle}
        description={metaDescription}
        canonical={`https://promo-san-nso.lovable.app${generateComboUrl(entry)}`}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 via-primary/10 to-background py-10 md:py-16">
        <div className="container px-4">
          <Breadcrumbs items={breadcrumbs} />

          <div className="mt-6 max-w-4xl">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              {h1}
            </h1>
            
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" />
                <span>Выезд от 30 минут</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Shield className="h-4 w-4 text-primary" />
                <span>Гарантия {entry.guaranteeDays ? Math.round(entry.guaranteeDays / 30) : 3} мес.</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Banknote className="h-4 w-4 text-primary" />
                <span>От {entry.priceFrom || 2500}₽</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="gap-2" asChild>
                <a href={`tel:${SITE_CONFIG.phone.replace(/[^\d+]/g, "")}`}>
                  <Phone className="h-5 w-5" />
                  {SITE_CONFIG.phone}
                </a>
              </Button>
              <Button size="lg" variant="outline">
                Рассчитать стоимость
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Вступление */}
      <section className="py-10 md:py-14">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl">
            <div className="prose prose-lg max-w-none text-muted-foreground">
              {intro.split("\n\n").map((p, i) => (
                <p key={i} className="mb-4 last:mb-0">{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ситуация */}
      {entry.pestSlug && (
        <section className="bg-destructive/5 py-10 md:py-14">
          <div className="container px-4">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold md:text-3xl mb-6">
                Чем опасны {entry.pestName?.toLowerCase()} {entry.districtSlug ? `в ${entry.districtName}е` : `в ${SITE_CONFIG.region}е`}
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                {situation.split("\n\n").map((p, i) => (
                  <p key={i} className="mb-4 last:mb-0">{p}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Как проходит обработка */}
      <section className="py-12 md:py-16">
        <div className="container px-4">
          <h2 className="text-2xl font-bold md:text-3xl mb-8 text-center">
            Как проходит {entry.serviceName.toLowerCase()} {entry.objectName}ы
          </h2>
          <div className="grid gap-6 md:grid-cols-5 max-w-5xl mx-auto">
            {treatmentSteps.map((step) => (
              <Card key={step.step} className="relative">
                <CardContent className="p-5 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold mx-auto mb-3">
                    {step.step}
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Цены */}
      <section className="bg-muted/30 py-12 md:py-16">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold md:text-3xl mb-6 text-center">
              Цены и сроки
            </h2>
            <div className="prose prose-lg max-w-none text-center mb-8">
              <p dangerouslySetInnerHTML={{ __html: pricing.text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
            </div>
            <div className="bg-card rounded-lg border p-6">
              <h3 className="font-semibold mb-4">От чего зависит стоимость:</h3>
              <ul className="space-y-2">
                {pricing.factors.map((factor, i) => (
                  <li key={i} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Гарантия */}
      <section className="py-12 md:py-16">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Shield className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-bold md:text-3xl">Гарантия</h2>
            </div>
            <div className="prose prose-lg max-w-none text-center text-muted-foreground">
              {guarantee.split("\n\n").map((p, i) => (
                <p key={i} className="mb-4 last:mb-0" dangerouslySetInnerHTML={{ __html: p.replace(/\*\*(.*?)\*\*/g, "<strong class='text-foreground'>$1</strong>") }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Перелинковка */}
      <section className="bg-primary/5 py-10 md:py-14">
        <div className="container px-4">
          <h2 className="text-xl font-bold mb-6 text-center">Полезные ссылки</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
            {service && (
              <Link
                to={`/usluga/${service.slug}`}
                className="flex items-center justify-between rounded-lg border bg-background p-4 hover:bg-accent transition-colors group"
              >
                <span className="group-hover:text-primary transition-colors">
                  {service.name} — общая информация
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
              </Link>
            )}
            {pest && (
              <Link
                to={`/vreditel/${pest.slug}`}
                className="flex items-center justify-between rounded-lg border bg-background p-4 hover:bg-accent transition-colors group"
              >
                <span className="group-hover:text-primary transition-colors">
                  {pest.name} — как распознать
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
              </Link>
            )}
            {object && (
              <Link
                to={`/obekt/${object.slug}`}
                className="flex items-center justify-between rounded-lg border bg-background p-4 hover:bg-accent transition-colors group"
              >
                <span className="group-hover:text-primary transition-colors">
                  Обработка {entry.objectName}ы
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
              </Link>
            )}
            {district && (
              <Link
                to={`/rayon/${district.slug}`}
                className="flex items-center justify-between rounded-lg border bg-background p-4 hover:bg-accent transition-colors group"
              >
                <span className="group-hover:text-primary transition-colors">
                  СЭС в {district.name}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-16">
        <div className="container px-4">
          <div className="flex items-center justify-center gap-3 mb-8">
            <HelpCircle className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold md:text-3xl">Частые вопросы</h2>
          </div>
          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              {faq.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTABlock
        title={`Заказать ${entry.serviceName.toLowerCase()}у ${entry.objectName}ы`}
        subtitle={`${entry.districtSlug ? `Выезд в ${entry.districtName} от 30 минут` : "Выезд по Новосибирску от 30 минут"}. Звоните!`}
      />
    </MainLayout>
  );
}
