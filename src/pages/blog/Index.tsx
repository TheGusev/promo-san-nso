import { Link } from "react-router-dom";
import { FileText, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MainLayout } from "@/components/layout/MainLayout";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SEOHead } from "@/components/shared/SEOHead";
import { RelatedLinks } from "@/components/shared/RelatedLinks";
import { SITE_CONFIG } from "@/data/siteConfig";

// Заглушка для статей блога — будут заменены реальными данными
const PLACEHOLDER_ARTICLES = [
  {
    slug: "kak-izbavitsya-ot-klopov",
    title: "Как избавиться от клопов в квартире",
    excerpt: "Подробное руководство по борьбе с постельными клопами: признаки заражения, методы обработки, профилактика.",
    date: "2025-01-15",
    category: "Советы",
  },
  {
    slug: "tarakany-v-kvartire",
    title: "Тараканы в квартире: причины и методы борьбы",
    excerpt: "Почему появляются тараканы, как их обнаружить и какие методы борьбы наиболее эффективны.",
    date: "2025-01-10",
    category: "Советы",
  },
  {
    slug: "dezinfektsiya-posle-remonta",
    title: "Дезинфекция после ремонта",
    excerpt: "Когда и зачем нужна дезинфекция после ремонта квартиры или дома.",
    date: "2025-01-05",
    category: "Услуги",
  },
  {
    slug: "sanpin-dlya-obshchepita",
    title: "СанПиН для общепита: требования к дезинсекции",
    excerpt: "Какие санитарные требования предъявляются к кафе и ресторанам, как часто нужна обработка.",
    date: "2024-12-28",
    category: "СанПиН",
  },
];

export default function BlogIndex() {
  return (
    <MainLayout>
      <SEOHead
        title={`Блог СЭС — статьи о дезинсекции и дератизации | ${SITE_CONFIG.companyName}`}
        description="Полезные статьи о борьбе с вредителями, дезинфекции, санитарных нормах. Советы экспертов СЭС Новосибирска."
        canonical="https://promo-san-nso.lovable.app/blog"
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

      <section className="py-12 md:py-16">
        <div className="container px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PLACEHOLDER_ARTICLES.map((article) => (
              <Card key={article.slug} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(article.date).toLocaleDateString("ru-RU")}
                    </span>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">
                    <Link 
                      to={`/blog/${article.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {article.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-3">
                    {article.excerpt}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-lg border bg-muted/50 px-6 py-4">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">
                Раздел в разработке. Скоро здесь появятся новые статьи.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t py-8">
        <RelatedLinks type="services" title="Услуги" />
        <RelatedLinks type="pests" title="Вредители" />
      </section>
    </MainLayout>
  );
}
