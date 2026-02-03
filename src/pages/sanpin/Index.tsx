import { Link } from "react-router-dom";
import { FileText, Book, Scale, ClipboardList, Phone, ExternalLink } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SEOHead } from "@/components/shared/SEOHead";
import { CTABlock } from "@/components/shared/CTABlock";
import { RelatedLinks } from "@/components/shared/RelatedLinks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SITE_CONFIG } from "@/data/siteConfig";
import { BLOG_TOPICS, getArticlesByCategory } from "@/data/blogTopics";

export default function SanpinIndex() {
  // Получаем статьи категории "regulations" (нормативы)
  const regulationsArticles = getArticlesByCategory("regulations");
  
  // Ключевые нормативные документы
  const keyDocuments = [
    {
      title: "СанПиН 3.3686-21",
      description: "Санитарно-эпидемиологические требования по профилактике инфекционных болезней",
      type: "СанПиН",
    },
    {
      title: "СП 3.5.3.3223-14",
      description: "Санитарно-эпидемиологические требования к организации и проведению дезинсекции",
      type: "СП",
    },
    {
      title: "СП 3.5.3.1129-02",
      description: "Санитарно-эпидемиологические требования к проведению дератизации",
      type: "СП",
    },
    {
      title: "Постановление №36",
      description: "Требования к дезинфекционной деятельности и профилактике инфекций",
      type: "Постановление",
    },
  ];

  return (
    <MainLayout>
      <SEOHead
        title={`СанПиН и нормативные документы | ${SITE_CONFIG.companyName}`}
        description="СанПиН требования к дезинфекции, дезинсекции, дератизации. Нормативные документы Роспотребнадзора для бизнеса. Журналы учёта, акты СЭС, сертификаты."
        canonical={`${SITE_CONFIG.siteUrl}/sanpin`}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 via-primary/10 to-background py-10 md:py-16">
        <div className="container px-4">
          <Breadcrumbs items={[{ label: "СанПиН и документы" }]} />

          <div className="mt-6 max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              СанПиН и нормативные документы
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              Требования Роспотребнадзора к санитарной обработке помещений. Нормативы 
              дезинфекции, дезинсекции и дератизации для бизнеса и организаций.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="gap-2" asChild>
                <a href={`tel:${SITE_CONFIG.phoneClean}`}>
                  <Phone className="h-5 w-5" />
                  Консультация по документам
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/usluga/sertifikatsiya">
                  Услуга сертификации
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Кому нужно знать СанПиН */}
      <section className="py-12 md:py-16">
        <div className="container px-4">
          <h2 className="text-2xl font-bold md:text-3xl mb-8 text-center">
            Кому важно знать требования СанПиН
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {[
              { icon: ClipboardList, title: "Рестораны и кафе", desc: "Требования к общепиту" },
              { icon: Scale, title: "Продуктовые магазины", desc: "Нормы хранения продуктов" },
              { icon: Book, title: "Детские учреждения", desc: "Школы, детские сады" },
              { icon: FileText, title: "Производства", desc: "ХАССП и пищевые предприятия" },
            ].map((item, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mx-auto mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ключевые документы */}
      <section className="bg-muted/30 py-12 md:py-16">
        <div className="container px-4">
          <h2 className="text-2xl font-bold md:text-3xl mb-8 text-center">
            Основные нормативные документы
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 max-w-4xl mx-auto">
            {keyDocuments.map((doc, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{doc.type}</Badge>
                  </div>
                  <CardTitle className="text-lg">{doc.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{doc.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Статьи по теме */}
      {regulationsArticles.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container px-4">
            <h2 className="text-2xl font-bold md:text-3xl mb-8 text-center">
              Статьи о санитарных нормах
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {regulationsArticles.map((article) => (
                <Link
                  key={article.slug}
                  to={`/blog/${article.slug}`}
                  className="group block"
                >
                  <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="line-clamp-2">
                        {article.description}
                      </CardDescription>
                      <div className="mt-3 flex items-center gap-1 text-sm text-primary">
                        Читать статью
                        <ExternalLink className="h-3 w-3" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Button variant="outline" asChild>
                <Link to="/blog?category=regulations">
                  Все статьи о нормативах →
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Что мы делаем */}
      <section className="bg-primary/5 py-12 md:py-16">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold md:text-3xl mb-6">
              Помогаем с документами для Роспотребнадзора
            </h2>
            <p className="text-muted-foreground mb-8">
              Предоставляем полный пакет документов после обработки: акты выполненных работ, 
              журналы учёта дезинсекции и дератизации, сертификаты на препараты. 
              Все документы соответствуют требованиям СанПиН.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="outline" className="text-sm py-1.5 px-3">Акт обработки</Badge>
              <Badge variant="outline" className="text-sm py-1.5 px-3">Журнал учёта</Badge>
              <Badge variant="outline" className="text-sm py-1.5 px-3">Сертификаты</Badge>
              <Badge variant="outline" className="text-sm py-1.5 px-3">Договор</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16">
        <div className="container px-4">
          <CTABlock
            title="Нужна помощь с документами СЭС?"
            subtitle="Поможем подготовиться к проверке Роспотребнадзора"
            variant="hero"
          />
        </div>
      </section>

      {/* Перелинковка */}
      <section className="border-t py-8">
        <RelatedLinks type="services" title="Услуги" />
        <RelatedLinks type="objects" title="Типы объектов" />
      </section>
    </MainLayout>
  );
}