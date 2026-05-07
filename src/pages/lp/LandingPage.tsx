import { useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import {
  Phone, Shield, Clock, CheckCircle2, AlertTriangle, Sparkles,
  FileText, ArrowRight, MessageCircle, ChevronRight,
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/shared/SEOHead";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { LandingLeadForm } from "@/components/lp/LandingLeadForm";
import { getLanding, type LandingSlug } from "@/data/landingContent";
import { SITE_CONFIG } from "@/data/siteConfig";
import { trackGoal } from "@/lib/analytics";
import { reachGoal } from "@/lib/yandexMetrika";
import { logTrafficEvent } from "@/hooks/useTrafficLogging";
import {
  getServiceSchema, getFaqSchema, getBreadcrumbSchema, getLocalBusinessSchema,
} from "@/lib/schema";
import { getServiceBySlug } from "@/data/services";
import heroKlopy from "@/assets/lp/hero-klopy.jpg";
import heroTarakany from "@/assets/lp/hero-tarakany.jpg";
import heroUchastok from "@/assets/lp/hero-uchastok.jpg";

const HERO_BG: Record<LandingSlug, string> = {
  klopy: heroKlopy,
  tarakany: heroTarakany,
  uchastok: heroUchastok,
};

export default function LandingPage() {
  const { lpSlug } = useParams<{ lpSlug: string }>();
  const landing = lpSlug ? getLanding(lpSlug) : undefined;

  useEffect(() => {
    if (!landing) return;
    reachGoal("landing_view", { lp: landing.slug, page: location.pathname });
    logTrafficEvent("landing_view", { lp: landing.slug });
  }, [landing]);

  if (!landing) return <Navigate to="/" replace />;

  const url = `/lp/${landing.slug}`;
  const canonical = `${SITE_CONFIG.siteUrl}${url}`;
  const source = `lp_${landing.slug}`;

  // JSON-LD
  const baseService =
    landing.slug === "uchastok"
      ? getServiceBySlug("dezinseksiya")
      : getServiceBySlug("dezinseksiya");
  const schemas = [
    getLocalBusinessSchema(),
    baseService
      ? getServiceSchema({
          service: baseService,
          url,
          priceFrom: landing.priceFrom,
        })
      : null,
    getFaqSchema(landing.faq),
    getBreadcrumbSchema([
      { name: "Услуги", href: "/uslugi" },
      { name: landing.h1, href: url },
    ]),
  ].filter(Boolean);

  const handlePhone = () => {
    trackGoal("phone_click");
    logTrafficEvent("phone_click", { source });
  };

  return (
    <MainLayout>
      <SEOHead
        title={landing.metaTitle}
        description={landing.metaDescription}
        canonical={canonical}
        image={landing.heroImage}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      {/* HERO + форма */}
      <section className="relative overflow-hidden py-8 md:py-14">
        <img
          src={HERO_BG[landing.slug]}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Mobile: ровный затемняющий слой; Desktop: градиент слева, чтобы фото просвечивало справа */}
        <div className="absolute inset-0 bg-background/85 backdrop-blur-[2px] lg:hidden" aria-hidden />
        <div className="absolute inset-0 hidden lg:block bg-gradient-to-r from-background/95 via-background/80 to-background/30" aria-hidden />
        <div className="container relative px-4">
          <Breadcrumbs items={[{ label: "Услуги", href: "/uslugi" }, { label: landing.h1 }]} />

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Shield className="h-3.5 w-3.5" />
                Гарантия до {landing.guaranteeMonths} мес.
              </div>
              <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">
                {landing.h1}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                {landing.heroSubtitle}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button size="lg" asChild onClick={handlePhone}>
                  <a href={`tel:${SITE_CONFIG.phoneClean}`} className="gap-2">
                    <Phone className="h-5 w-5" />
                    {SITE_CONFIG.phoneDisplay}
                  </a>
                </Button>
              </div>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Выезд за 1–2 ч</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Договор и чек</div>
                <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Без запаха</div>
              </div>
            </div>

            <div>
              <div className="rounded-xl bg-card border shadow-elevated p-5">
                <div className="text-center mb-4">
                  <div className="text-sm text-muted-foreground">Цена</div>
                  <div className="text-3xl font-bold text-primary">от {landing.priceFrom.toLocaleString("ru-RU")} ₽</div>
                  <div className="text-xs text-muted-foreground">{landing.priceLabel}</div>
                </div>
                <LandingLeadForm source={source} compact />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Боль и срочность */}
      <section className="py-12 md:py-16 bg-destructive/5">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">Почему нельзя откладывать</h2>
            </div>
            <ul className="space-y-3">
              {landing.painPoints.map((p, i) => (
                <li key={i} className="flex items-start gap-3 rounded-lg bg-card p-4 border">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-sm font-semibold text-destructive">
                    {i + 1}
                  </div>
                  <p className="text-muted-foreground">{p}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Что входит */}
      <section className="py-12 md:py-16">
        <div className="container px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Что входит в обработку</h2>
          <div className="mx-auto grid gap-3 max-w-3xl sm:grid-cols-2">
            {landing.included.map((item, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border bg-card p-4">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>

          <div className="mx-auto max-w-3xl mt-8">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-5 flex items-start gap-3">
                <Shield className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                <p className="text-sm text-muted-foreground">{landing.safetyNote}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Как работаем */}
      <section className="bg-muted/40 py-12 md:py-16">
        <div className="container px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Как мы работаем</h2>
          <div className="mx-auto grid gap-4 max-w-4xl sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: 1, t: "Заявка", d: "Звонок или форма за 30 секунд" },
              { n: 2, t: "Выезд", d: "В день обращения, 1–2 часа" },
              { n: 3, t: "Обработка", d: "30–90 минут профессиональным оборудованием" },
              { n: 4, t: "Гарантия", d: `До ${landing.guaranteeMonths} мес. с бесплатным повтором` },
            ].map((s) => (
              <div key={s.n} className="rounded-xl bg-card border p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  {s.n}
                </div>
                <h3 className="mt-3 font-semibold">{s.t}</h3>
                <p className="text-sm text-muted-foreground mt-1">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Кейсы */}
      <section className="py-12 md:py-16">
        <div className="container px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Реальные кейсы</h2>
          <div className="mx-auto grid gap-4 max-w-4xl md:grid-cols-3">
            {landing.cases.map((c, i) => (
              <Card key={i}>
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-2">{c.title}</h3>
                  <p className="text-sm text-muted-foreground">{c.result}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/30 py-12 md:py-16">
        <div className="container px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Частые вопросы</h2>
          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible>
              {landing.faq.map((item, i) => (
                <AccordionItem key={i} value={`q-${i}`}>
                  <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Финальный CTA */}
      <section className="py-12 md:py-16 bg-gradient-hero text-primary-foreground">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">Оставьте заявку — перезвоним за 5 минут</h2>
            <p className="text-primary-foreground/90 mb-6">
              Бесплатная консультация и точный расчёт стоимости по телефону.
            </p>
            <div className="grid gap-4 md:grid-cols-2 max-w-xl mx-auto">
              <div className="md:col-span-2">
                <LandingLeadForm source={`${source}_bottom`} ctaLabel="Перезвоните мне" />
              </div>
              <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20" asChild onClick={handlePhone}>
                <a href={`tel:${SITE_CONFIG.phoneClean}`} className="gap-2">
                  <Phone className="h-5 w-5" /> {SITE_CONFIG.phoneDisplay}
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20" asChild>
                <a href={SITE_CONFIG.links.telegram} target="_blank" rel="noopener noreferrer" className="gap-2">
                  <MessageCircle className="h-5 w-5" /> Telegram
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Перелинковка */}
      <section className="py-10 border-t">
        <div className="container px-4">
          <div className="mx-auto max-w-4xl grid gap-3 md:grid-cols-2">
            {landing.relatedPestSlug && (
              <Link
                to={`/vreditel/${landing.relatedPestSlug}`}
                className="flex items-center justify-between rounded-lg border bg-card p-4 hover:bg-accent transition-colors"
              >
                <span className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">{landing.relatedPestLabel}</span>
                </span>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            )}
            <Link
              to="/uslugi"
              className="flex items-center justify-between rounded-lg border bg-card p-4 hover:bg-accent transition-colors"
            >
              <span className="flex items-center gap-3">
                <ArrowRight className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Все услуги СанРешения</span>
              </span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
