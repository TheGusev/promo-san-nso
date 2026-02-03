import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  HelpCircle, 
  ClipboardList, 
  Shield, 
  Wallet, 
  Award, 
  FileText, 
  Bug,
  ChevronRight,
  Phone,
  ExternalLink
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SEOHead } from "@/components/shared/SEOHead";
import { CTABlock } from "@/components/shared/CTABlock";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SITE_CONFIG } from "@/data/siteConfig";
import { 
  FAQ_ITEMS, 
  FAQ_CATEGORIES, 
  FAQCategory, 
  FAQItem,
  getFAQByCategory, 
  getPopularFAQ, 
  searchFAQ 
} from "@/data/faqData";
import { services } from "@/data/services";
import { pests } from "@/data/pests";
import { getArticleBySlug } from "@/data/blogTopics";

// Иконки для категорий
const categoryIcons: Record<FAQCategory, React.ReactNode> = {
  preparation: <ClipboardList className="h-5 w-5" />,
  safety: <Shield className="h-5 w-5" />,
  pricing: <Wallet className="h-5 w-5" />,
  guarantee: <Award className="h-5 w-5" />,
  regulations: <FileText className="h-5 w-5" />,
  pests: <Bug className="h-5 w-5" />,
  general: <HelpCircle className="h-5 w-5" />,
};

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<FAQCategory | null>(null);

  // Фильтрация вопросов
  const filteredItems = useMemo(() => {
    let items = FAQ_ITEMS;
    
    if (searchQuery.trim()) {
      items = searchFAQ(searchQuery);
    } else if (activeCategory) {
      items = getFAQByCategory(activeCategory);
    }
    
    return items;
  }, [searchQuery, activeCategory]);

  // Группировка по категориям для отображения
  const groupedItems = useMemo(() => {
    if (searchQuery.trim() || activeCategory) {
      return { [activeCategory || "search"]: filteredItems };
    }
    
    const grouped: Record<string, FAQItem[]> = {};
    Object.keys(FAQ_CATEGORIES).forEach((cat) => {
      grouped[cat] = getFAQByCategory(cat as FAQCategory);
    });
    return grouped;
  }, [filteredItems, searchQuery, activeCategory]);

  const popularFAQ = getPopularFAQ(6);

  // Schema.org FAQPage
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer.replace(/<[^>]*>/g, "").replace(/\*\*/g, ""),
      },
    })),
  };

  return (
    <MainLayout>
      <SEOHead
        title={`Частые вопросы о дезинсекции и дератизации | СЭС ${SITE_CONFIG.companyName}`}
        description="Ответы на частые вопросы о дезинсекции, дератизации, дезинфекции. Как подготовить квартиру, безопасность для детей, цены, гарантии. FAQ от СЭС Новосибирска."
        canonical={`${SITE_CONFIG.siteUrl}/faq`}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-8 md:py-12">
        <div className="container px-4">
          <Breadcrumbs items={[{ label: "Частые вопросы" }]} />

          <h1 className="mt-6 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Частые вопросы о дезинсекции
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Ответы на популярные вопросы о борьбе с вредителями, подготовке к обработке, 
            безопасности препаратов и санитарных нормах.
          </p>

          {/* Поиск */}
          <div className="mt-8 max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Найти ответ на вопрос..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActiveCategory(null);
                }}
                className="pl-12 h-12 text-base"
              />
            </div>
            {searchQuery && (
              <p className="mt-2 text-sm text-muted-foreground">
                Найдено {filteredItems.length} {filteredItems.length === 1 ? "вопрос" : "вопросов"}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Категории */}
      <section className="py-6 border-b">
        <div className="container px-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={!activeCategory && !searchQuery ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setActiveCategory(null);
                setSearchQuery("");
              }}
            >
              Все вопросы
            </Button>
            {(Object.keys(FAQ_CATEGORIES) as FAQCategory[]).map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setActiveCategory(cat);
                  setSearchQuery("");
                }}
                className="gap-2"
              >
                {categoryIcons[cat]}
                {FAQ_CATEGORIES[cat].name}
                <Badge variant="secondary" className="ml-1 text-xs">
                  {getFAQByCategory(cat).length}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Популярные вопросы (если не поиск и не фильтр) */}
      {!searchQuery && !activeCategory && (
        <section className="py-8 border-b bg-muted/30">
          <div className="container px-4">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Самые популярные вопросы
            </h2>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {popularFAQ.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="flex items-start gap-3 p-4 bg-background rounded-lg border hover:border-primary transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm font-medium">{item.question}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Список вопросов */}
      <section className="py-12 md:py-16">
        <div className="container px-4">
          <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
            {/* Основной контент */}
            <div className="space-y-8">
              {filteredItems.length > 0 ? (
                searchQuery || activeCategory ? (
                  // Плоский список при поиске/фильтре
                  <div>
                    <Accordion type="single" collapsible className="space-y-4">
                      {filteredItems.map((item) => (
                        <FAQItemCard key={item.id} item={item} />
                      ))}
                    </Accordion>
                  </div>
                ) : (
                  // Группировка по категориям
                  (Object.keys(FAQ_CATEGORIES) as FAQCategory[]).map((cat) => (
                    <div key={cat} id={`category-${cat}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          {categoryIcons[cat]}
                        </div>
                        <div>
                          <h2 className="text-xl font-bold">{FAQ_CATEGORIES[cat].name}</h2>
                          <p className="text-sm text-muted-foreground">
                            {FAQ_CATEGORIES[cat].description}
                          </p>
                        </div>
                      </div>
                      <Accordion type="single" collapsible className="space-y-3">
                        {getFAQByCategory(cat).map((item) => (
                          <FAQItemCard key={item.id} item={item} />
                        ))}
                      </Accordion>
                    </div>
                  ))
                )
              ) : (
                <div className="text-center py-12">
                  <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Вопросы не найдены</h2>
                  <p className="text-muted-foreground mb-4">
                    Попробуйте изменить поисковый запрос или выберите категорию.
                  </p>
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Сбросить поиск
                  </Button>
                </div>
              )}
            </div>

            {/* Сайдбар */}
            <aside className="space-y-6">
              {/* Быстрый контакт */}
              <Card className="sticky top-24">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Не нашли ответ?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Позвоните нам — ответим на любой вопрос и поможем решить проблему.
                  </p>
                  <Button asChild className="w-full">
                    <a href={`tel:${SITE_CONFIG.phoneClean}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Позвонить
                    </a>
                  </Button>
                  
                  <hr />
                  
                  {/* Ссылки на разделы */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Полезные разделы:</p>
                    <Link
                      to="/blog?category=regulations"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <FileText className="h-4 w-4" />
                      СанПиН и документы
                    </Link>
                    <Link
                      to="/uslugi"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Shield className="h-4 w-4" />
                      Наши услуги
                    </Link>
                    <Link
                      to="/vrediteli"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Bug className="h-4 w-4" />
                      Вредители
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 border-t">
        <div className="container px-4">
          <CTABlock
            title="Остались вопросы? Звоните!"
            subtitle="Бесплатная консультация по любым вопросам о дезинсекции и дератизации"
          />
        </div>
      </section>
    </MainLayout>
  );
}

// Компонент отдельного вопроса
function FAQItemCard({ item }: { item: FAQItem }) {
  // Получаем связанные ссылки
  const relatedServices = item.relatedServices?.map((slug) => 
    services.find((s) => s.slug === slug)
  ).filter(Boolean) || [];
  
  const relatedPests = item.relatedPests?.map((slug) => 
    pests.find((p) => p.slug === slug)
  ).filter(Boolean) || [];
  
  const relatedArticles = item.relatedArticles?.map((slug) => 
    getArticleBySlug(slug)
  ).filter(Boolean) || [];

  const hasRelatedLinks = relatedServices.length > 0 || relatedPests.length > 0 || relatedArticles.length > 0;

  return (
    <AccordionItem value={item.id} id={item.id} className="border rounded-lg px-4">
      <AccordionTrigger className="text-left hover:no-underline">
        <span className="font-medium">{item.question}</span>
      </AccordionTrigger>
      <AccordionContent className="pt-2 pb-4">
        {/* Ответ с форматированием */}
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {item.answer.split("\n").map((paragraph, i) => {
            // Обработка markdown-подобного форматирования
            let content = paragraph
              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
              .replace(/^\d+\.\s/, (match) => `<span class="font-medium">${match}</span>`)
              .replace(/^-\s/, "• ");
            
            if (paragraph.trim().startsWith("-") || paragraph.trim().startsWith("•")) {
              return (
                <p
                  key={i}
                  className="ml-4 my-1 text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              );
            }
            
            if (paragraph.trim().match(/^\d+\./)) {
              return (
                <p
                  key={i}
                  className="ml-4 my-1"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              );
            }
            
            return (
              <p
                key={i}
                className="my-2"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            );
          })}
        </div>

        {/* Связанные ссылки */}
        {hasRelatedLinks && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Подробнее:
            </p>
            <div className="flex flex-wrap gap-2">
              {relatedServices.map((service) => service && (
                <Link
                  key={service.slug}
                  to={`/usluga/${service.slug}`}
                  className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded hover:bg-primary/20 transition-colors"
                >
                  {service.shortName}
                  <ExternalLink className="h-3 w-3" />
                </Link>
              ))}
              {relatedPests.map((pest) => pest && (
                <Link
                  key={pest.slug}
                  to={`/vreditel/${pest.slug}`}
                  className="inline-flex items-center gap-1 text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded hover:bg-secondary/80 transition-colors"
                >
                  {pest.name}
                  <ExternalLink className="h-3 w-3" />
                </Link>
              ))}
              {relatedArticles.map((article) => article && (
                <Link
                  key={article.slug}
                  to={`/blog/${article.slug}`}
                  className="inline-flex items-center gap-1 text-xs bg-accent text-accent-foreground px-2 py-1 rounded hover:bg-accent/80 transition-colors"
                >
                  Статья: {article.title.slice(0, 30)}...
                  <ExternalLink className="h-3 w-3" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
