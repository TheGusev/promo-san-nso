import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FileText, Calendar, Clock, Filter, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MainLayout } from "@/components/layout/MainLayout";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SEOHead } from "@/components/shared/SEOHead";
import { RelatedLinks } from "@/components/shared/RelatedLinks";
import { SITE_CONFIG } from "@/data/siteConfig";
import { BLOG_TOPICS, BLOG_CATEGORIES, getArticlesByCategory, BlogTopic } from "@/data/blogTopics";

export default function BlogIndex() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  
  const activeCategory = searchParams.get("category") as keyof typeof BLOG_CATEGORIES | null;

  // Фильтрация статей
  const filteredArticles = BLOG_TOPICS.filter((article) => {
    const matchesCategory = !activeCategory || article.category === activeCategory;
    const matchesSearch = !searchQuery || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  }).sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  // Группировка по категориям для отображения
  const categoryCounts = Object.keys(BLOG_CATEGORIES).map((key) => ({
    key: key as keyof typeof BLOG_CATEGORIES,
    ...BLOG_CATEGORIES[key as keyof typeof BLOG_CATEGORIES],
    count: getArticlesByCategory(key as keyof typeof BLOG_CATEGORIES).length,
  }));

  const handleCategoryClick = (category: string | null) => {
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  return (
    <MainLayout>
      <SEOHead
        title={`Блог СЭС — статьи о дезинсекции и дератизации | ${SITE_CONFIG.companyName}`}
        description="Полезные статьи о борьбе с вредителями, дезинфекции, санитарных нормах. Советы экспертов СЭС Новосибирска. 50+ профессиональных статей."
        canonical={`${SITE_CONFIG.siteUrl}/blog`}
      />

      <section className="bg-gradient-to-b from-primary/5 to-background py-8 md:py-12">
        <div className="container px-4">
          <Breadcrumbs items={[{ label: "Блог" }]} />

          <h1 className="mt-6 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Блог СЭС {SITE_CONFIG.companyName}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Полезные статьи о борьбе с вредителями, дезинфекции помещений, 
            санитарных нормах и правилах. Советы от профессионалов.
          </p>

        </div>
      </section>

      {/* Фильтры */}
      <section className="py-6 border-b">
        <div className="container px-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Категории */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!activeCategory ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryClick(null)}
              >
                Все статьи
              </Button>
              {categoryCounts.map((cat) => (
                <Button
                  key={cat.key}
                  variant={activeCategory === cat.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryClick(cat.key)}
                >
                  {cat.name}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {cat.count}
                  </Badge>
                </Button>
              ))}
            </div>

            {/* Поиск */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск статей..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Список статей */}
      <section className="py-12 md:py-16">
        <div className="container px-4">
          {filteredArticles.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Статьи не найдены</h2>
              <p className="text-muted-foreground mb-4">
                Попробуйте изменить параметры поиска или выбрать другую категорию.
              </p>
              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setSearchParams({});
              }}>
                Сбросить фильтры
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Перелинковка */}
      <section className="border-t py-8">
        <RelatedLinks type="services" title="Услуги" />
        <RelatedLinks type="pests" title="Вредители" />
      </section>
    </MainLayout>
  );
}

// Компонент карточки статьи
function ArticleCard({ article }: { article: BlogTopic }) {
  const categoryInfo = BLOG_CATEGORIES[article.category];

  return (
    <Card className="hover:shadow-lg transition-shadow group">
      <CardHeader>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Badge 
            variant="secondary" 
            className="text-xs font-medium"
          >
            {categoryInfo.name}
          </Badge>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(article.publishDate).toLocaleDateString("ru-RU")}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {article.readTime} мин
          </span>
        </div>
        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
          <Link to={`/blog/${article.slug}`}>
            {article.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-3 mb-4">
          {article.description}
        </CardDescription>
        
        {/* Ключевые слова */}
        <div className="flex flex-wrap gap-1">
          {article.keywords.slice(0, 2).map((keyword) => (
            <Badge key={keyword} variant="outline" className="text-xs">
              {keyword}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
