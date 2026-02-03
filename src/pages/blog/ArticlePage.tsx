import { useParams, Link, Navigate } from "react-router-dom";
import { Calendar, Clock, Tag, ArrowLeft, ChevronRight, Phone, FileText, Bug, Building, MapPin } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SEOHead } from "@/components/shared/SEOHead";
import { CTABlock } from "@/components/shared/CTABlock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SITE_CONFIG } from "@/data/siteConfig";
import { getArticleBySlug, getRelatedArticles, BLOG_CATEGORIES, BlogTopic } from "@/data/blogTopics";
import { generateArticleContent, generateTableOfContents } from "@/lib/blogContentGenerator";

export default function ArticlePage() {
  const { articleSlug } = useParams<{ articleSlug: string }>();
  const topic = articleSlug ? getArticleBySlug(articleSlug) : undefined;

  if (!topic) {
    return <Navigate to="/blog" replace />;
  }

  const content = generateArticleContent(topic);
  const tableOfContents = generateTableOfContents(content.sections);
  const relatedArticles = getRelatedArticles(topic.slug, 3);
  const categoryInfo = BLOG_CATEGORIES[topic.category];

  // Schema.org для статьи
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: topic.title,
    description: topic.description,
    datePublished: topic.publishDate,
    dateModified: topic.publishDate,
    author: {
      "@type": "Organization",
      name: SITE_CONFIG.companyName,
      url: "https://promo-san-nso.lovable.app",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.companyName,
      logo: {
        "@type": "ImageObject",
        url: "https://promo-san-nso.lovable.app/og-image.jpg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://promo-san-nso.lovable.app/blog/${topic.slug}`,
    },
  };

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const getRelatedLinkIcon = (type: string) => {
    switch (type) {
      case "service":
        return <FileText className="h-4 w-4" />;
      case "pest":
        return <Bug className="h-4 w-4" />;
      case "object":
        return <Building className="h-4 w-4" />;
      default:
        return <ChevronRight className="h-4 w-4" />;
    }
  };

  return (
    <MainLayout>
      <SEOHead
        title={`${topic.title} | Блог СЭС ${SITE_CONFIG.companyName}`}
        description={topic.description}
        canonical={`https://promo-san-nso.lovable.app/blog/${topic.slug}`}
        type="article"
      />

      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-8 md:py-12">
        <div className="container px-4">
          <Breadcrumbs
            items={[
              { label: "Блог", href: "/blog" },
              { label: categoryInfo.name, href: `/blog?category=${topic.category}` },
              { label: topic.title },
            ]}
          />

          <div className="mt-6 max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant="secondary" className="text-sm">
                {categoryInfo.name}
              </Badge>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {new Date(topic.publishDate).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {topic.readTime} мин. чтения
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              {topic.title}
            </h1>

            <p className="mt-4 text-lg text-muted-foreground">
              {topic.description}
            </p>

            {/* Ключевые слова */}
            <div className="mt-4 flex flex-wrap gap-2">
              {topic.keywords.slice(0, 4).map((keyword) => (
                <Badge key={keyword} variant="outline" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Контент статьи */}
      <section className="py-12 md:py-16">
        <div className="container px-4">
          <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
            {/* Основной контент */}
            <article className="prose prose-lg dark:prose-invert max-w-none">
              {/* Оглавление (мобильное) */}
              <div className="lg:hidden mb-8 p-4 bg-muted/50 rounded-lg">
                <h2 className="text-lg font-semibold mb-3">Содержание</h2>
                <nav>
                  <ul className="space-y-2 list-none pl-0">
                    {tableOfContents.map((item, index) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors no-underline"
                        >
                          {index + 1}. {item.title}
                        </a>
                      </li>
                    ))}
                    <li>
                      <a
                        href="#faq"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors no-underline"
                      >
                        {tableOfContents.length + 1}. Частые вопросы
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>

              {/* Секции статьи */}
              {content.sections.map((section, index) => (
                <section key={index} id={`section-${index}`} className="mb-8">
                  {index > 0 && (
                    <h2 className="text-2xl font-bold mt-8 mb-4">{section.heading}</h2>
                  )}
                  <div dangerouslySetInnerHTML={{ __html: section.content }} />
                </section>
              ))}

              {/* Перелинковка на коммерческие страницы */}
              {content.relatedLinks.length > 0 && (
                <section className="my-8 p-6 bg-primary/5 rounded-lg not-prose">
                  <h3 className="text-lg font-semibold mb-4">Полезные ссылки по теме</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {content.relatedLinks.map((link) => (
                      <Link
                        key={link.url}
                        to={link.url}
                        className="flex items-center gap-2 p-3 bg-background rounded-md hover:bg-muted transition-colors"
                      >
                        {getRelatedLinkIcon(link.type)}
                        <span>{link.text}</span>
                        <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* FAQ */}
              <section id="faq" className="my-12">
                <h2 className="text-2xl font-bold mb-6">Частые вопросы</h2>
                <Accordion type="single" collapsible className="not-prose">
                  {content.faq.map((item, index) => (
                    <AccordionItem key={index} value={`faq-${index}`}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>

              {/* CTA */}
              <CTABlock
                title="Нужна профессиональная помощь?"
                subtitle="Специалисты СЭС «Гордез» готовы помочь вам решить проблему быстро и эффективно."
                className="not-prose"
              />
            </article>

            {/* Сайдбар */}
            <aside className="space-y-6">
              {/* Оглавление (десктоп) */}
              <Card className="sticky top-24 hidden lg:block">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Содержание</CardTitle>
                </CardHeader>
                <CardContent>
                  <nav>
                    <ul className="space-y-2">
                      {tableOfContents.map((item, index) => (
                        <li key={item.id}>
                          <a
                            href={`#${item.id}`}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors block py-1"
                          >
                            {index + 1}. {item.title}
                          </a>
                        </li>
                      ))}
                      <li>
                        <a
                          href="#faq"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors block py-1"
                        >
                          {tableOfContents.length + 1}. Частые вопросы
                        </a>
                      </li>
                    </ul>
                  </nav>

                  <hr className="my-4" />

                  {/* Быстрый контакт */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Нужна консультация?</p>
                    <Button asChild className="w-full" size="sm">
                      <a href={`tel:${SITE_CONFIG.phone.replace(/\D/g, "")}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        Позвонить
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Связанные статьи */}
              {relatedArticles.length > 0 && (
                <Card className="hidden lg:block">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Читайте также</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {relatedArticles.map((article) => (
                      <Link
                        key={article.slug}
                        to={`/blog/${article.slug}`}
                        className="block p-3 -mx-3 rounded-md hover:bg-muted transition-colors"
                      >
                        <p className="text-sm font-medium line-clamp-2">{article.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(article.publishDate).toLocaleDateString("ru-RU")}
                        </p>
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* Связанные статьи (мобильные) */}
      {relatedArticles.length > 0 && (
        <section className="py-8 border-t lg:hidden">
          <div className="container px-4">
            <h2 className="text-xl font-bold mb-4">Читайте также</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedArticles.map((article) => (
                <Link
                  key={article.slug}
                  to={`/blog/${article.slug}`}
                  className="block p-4 border rounded-lg hover:border-primary transition-colors"
                >
                  <p className="font-medium line-clamp-2">{article.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(article.publishDate).toLocaleDateString("ru-RU")}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Назад к блогу */}
      <section className="py-8 border-t">
        <div className="container px-4">
          <Button variant="outline" asChild>
            <Link to="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Все статьи блога
            </Link>
          </Button>
        </div>
      </section>
    </MainLayout>
  );
}
