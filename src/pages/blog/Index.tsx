import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FileText, Calendar, Clock, Search, ArrowRight, Phone, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MainLayout } from "@/components/layout/MainLayout";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SEOHead } from "@/components/shared/SEOHead";
import { RelatedLinks } from "@/components/shared/RelatedLinks";
import { SITE_CONFIG } from "@/data/siteConfig";
import { BLOG_TOPICS, BLOG_CATEGORIES, getArticlesByCategory, BlogTopic } from "@/data/blogTopics";
import { cn } from "@/lib/utils";

const CATEGORY_ACCENT: Record<string, { bar: string; chip: string; glow: string }> = {
  pests: {
    bar: "bg-gradient-to-b from-orange-400 to-rose-500",
    chip: "bg-orange-500/15 text-orange-300 border-orange-500/30",
    glow: "group-hover:shadow-orange-500/20",
  },
  disinfection: {
    bar: "bg-gradient-to-b from-primary to-cyan-400",
    chip: "bg-primary/15 text-primary border-primary/30",
    glow: "group-hover:shadow-primary/25",
  },
  regulations: {
    bar: "bg-gradient-to-b from-violet-400 to-indigo-500",
    chip: "bg-violet-500/15 text-violet-300 border-violet-500/30",
    glow: "group-hover:shadow-violet-500/20",
  },
  faq: {
    bar: "bg-gradient-to-b from-secondary to-emerald-400",
    chip: "bg-secondary/15 text-secondary border-secondary/30",
    glow: "group-hover:shadow-secondary/20",
  },
};

const getAccent = (cat: string) => CATEGORY_ACCENT[cat] ?? CATEGORY_ACCENT.faq;

export default function BlogIndex() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  const activeCategory = searchParams.get("category") as keyof typeof BLOG_CATEGORIES | null;

  const filteredArticles = BLOG_TOPICS.filter((article) => {
    const matchesCategory = !activeCategory || article.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  }).sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  const featured = filteredArticles[0];
  const rest = filteredArticles.slice(1);

  const categoryCounts = Object.keys(BLOG_CATEGORIES).map((key) => ({
    key: key as keyof typeof BLOG_CATEGORIES,
    ...BLOG_CATEGORIES[key as keyof typeof BLOG_CATEGORIES],
    count: getArticlesByCategory(key as keyof typeof BLOG_CATEGORIES).length,
  }));

  const handleCategoryClick = (category: string | null) => {
    if (category) setSearchParams({ category });
    else setSearchParams({});
  };

  return (
    <MainLayout>
      <SEOHead
        title={`Блог СЭС — статьи о дезинсекции и дератизации | ${SITE_CONFIG.companyName}`}
        description="Полезные статьи о борьбе с вредителями, дезинфекции, санитарных нормах. Советы экспертов СЭС Новосибирска."
        canonical={`${SITE_CONFIG.siteUrl}/blog`}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-background py-10 md:py-16">
        <div className="absolute -top-32 -left-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" aria-hidden />
        <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-secondary/15 blur-3xl" aria-hidden />

        <div className="container relative px-4">
          <div className="[&_*]:!text-white/80">
            <Breadcrumbs items={[{ label: "Блог" }]} />
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Экспертный блог
          </div>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Блог{" "}
            <span className="bg-gradient-to-r from-primary via-cyan-300 to-secondary bg-clip-text text-transparent">
              СанРешения
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-base text-white/70 md:text-lg">
            Практические гайды по борьбе с вредителями, дезинфекции и санитарным нормам.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-30 border-b border-border/50 bg-background/85 backdrop-blur-xl">
        <div className="container px-4 py-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none snap-x md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0">
              <CategoryChip
                active={!activeCategory}
                onClick={() => handleCategoryClick(null)}
                label="Все"
                count={BLOG_TOPICS.length}
              />
              {categoryCounts.map((cat) => (
                <CategoryChip
                  key={cat.key}
                  active={activeCategory === cat.key}
                  onClick={() => handleCategoryClick(cat.key)}
                  label={cat.name}
                  count={cat.count}
                />
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск статей…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 rounded-full border-border/60 bg-muted/40 pl-10 focus-visible:ring-primary/40"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 md:py-12">
        <div className="container px-4">
          {filteredArticles.length === 0 ? (
            <EmptyState
              onReset={() => {
                setSearchQuery("");
                setSearchParams({});
              }}
            />
          ) : (
            <>
              {featured && (
                <FeaturedCard article={featured} />
              )}

              {rest.length > 0 && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((article) => (
                    <ArticleCard key={article.slug} article={article} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA strip */}
      <section className="border-y border-border/50 bg-gradient-to-r from-primary/10 via-background to-secondary/10 py-6">
        <div className="container flex flex-col items-center justify-between gap-3 px-4 text-center md:flex-row md:text-left">
          <div>
            <p className="font-semibold">Не нашли ответ в статьях?</p>
            <p className="text-sm text-muted-foreground">Консультация специалиста — бесплатно.</p>
          </div>
          <Button asChild size="lg" className="rounded-full shadow-lg shadow-primary/30">
            <a href={`tel:${SITE_CONFIG.phone.replace(/\D/g, "")}`}>
              <Phone className="mr-2 h-4 w-4" />
              {SITE_CONFIG.phone}
            </a>
          </Button>
        </div>
      </section>

      <section className="border-t py-8">
        <RelatedLinks type="services" title="Услуги" />
        <RelatedLinks type="pests" title="Вредители" />
      </section>
    </MainLayout>
  );
}

function CategoryChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "snap-start shrink-0 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
        active
          ? "border-primary/50 bg-primary/15 text-primary shadow-sm shadow-primary/20"
          : "border-border/60 bg-muted/30 text-muted-foreground hover:border-border hover:text-foreground"
      )}
    >
      {label}
      <span
        className={cn(
          "rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none",
          active ? "bg-primary/25 text-primary" : "bg-foreground/10 text-muted-foreground"
        )}
      >
        {count}
      </span>
    </button>
  );
}

function FeaturedCard({ article }: { article: BlogTopic }) {
  const categoryInfo = BLOG_CATEGORIES[article.category];
  const accent = getAccent(article.category);

  return (
    <Link
      to={`/blog/${article.slug}`}
      className={cn(
        "group relative block overflow-hidden rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-2xl",
        accent.glow
      )}
    >
      <div className={cn("absolute left-0 top-0 h-full w-1.5", accent.bar)} />
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl opacity-60 transition-opacity group-hover:opacity-100" aria-hidden />

      <div className="relative grid gap-5 p-5 md:grid-cols-[1fr_auto] md:items-center md:gap-8 md:p-8">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide", accent.chip)}>
              <Sparkles className="h-3 w-3" />
              {categoryInfo.name}
            </span>
            <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Свежее</span>
          </div>

          <h2 className="mt-3 text-xl font-bold leading-tight tracking-tight md:text-3xl">
            {article.title}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground md:text-base">
            {article.description}
          </p>

          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(article.publishDate).toLocaleDateString("ru-RU")}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {article.readTime} мин
            </span>
          </div>
        </div>

        <div className="hidden md:flex">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/40 transition-transform group-hover:translate-x-1">
            <ArrowRight className="h-5 w-5" />
          </span>
        </div>

        <div className="md:hidden flex items-center gap-1.5 text-sm font-medium text-primary">
          Читать
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}

function ArticleCard({ article }: { article: BlogTopic }) {
  const categoryInfo = BLOG_CATEGORIES[article.category];
  const accent = getAccent(article.category);

  return (
    <Link
      to={`/blog/${article.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card/60 p-5 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-xl",
        accent.glow
      )}
    >
      <div className={cn("absolute left-0 top-0 h-full w-1", accent.bar)} />

      <span className={cn("inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", accent.chip)}>
        {categoryInfo.name}
      </span>

      <h3 className="mt-3 line-clamp-2 text-base font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary md:text-lg">
        {article.title}
      </h3>

      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
        {article.description}
      </p>

      <div className="mt-auto flex items-center justify-between pt-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(article.publishDate).toLocaleDateString("ru-RU")}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {article.readTime} мин
          </span>
        </span>
        <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <FileText className="h-7 w-7 text-primary" />
      </div>
      <h2 className="text-xl font-semibold">Статьи не найдены</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Попробуйте изменить запрос или сбросить фильтры.
      </p>
      <Button variant="outline" className="mt-5 rounded-full" onClick={onReset}>
        Сбросить фильтры
      </Button>
    </div>
  );
}
