import { Link } from "react-router-dom";
import { Phone, Clock, Shield, CheckCircle, Star, ChevronRight, FileText, AlertTriangle, Banknote, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MainLayout } from "@/components/layout/MainLayout";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { CTABlock } from "@/components/shared/CTABlock";
import { RelatedLinks } from "@/components/shared/RelatedLinks";
import { FAQTeaser, FAQ_PRESETS } from "@/components/shared/FAQTeaser";
import { SEOHead } from "@/components/shared/SEOHead";
import { CostCalculatorPlaceholder } from "@/components/shared/CostCalculatorPlaceholder";
import { SITE_CONFIG } from "@/data/siteConfig";
import { type Service } from "@/data/services";
import { getServiceContent, type ServiceContent } from "@/data/serviceContent";
import { getPestBySlug } from "@/data/pests";
import { getObjectBySlug } from "@/data/objects";
import { cn } from "@/lib/utils";

interface ServicePageTemplateProps {
  service: Service;
}

// Дефолтные значения для услуг без детального контента
const DEFAULT_ADVANTAGES = [
  { icon: Clock, title: "Выезд 24/7", description: "Работаем круглосуточно без выходных" },
  { icon: Shield, title: "Гарантия", description: "Даём гарантию на все виды работ" },
  { icon: CheckCircle, title: "Безопасность", description: "Используем безопасные для людей и животных препараты" },
  { icon: Star, title: "Опыт", description: "Более 10 лет успешной работы" },
];

export function ServicePageTemplate({ service }: ServicePageTemplateProps) {
  const Icon = service.icon;
  const content = getServiceContent(service.slug);

  // Если нет детального контента — используем базовую версию
  const hasDetailedContent = !!content;

  return (
    <MainLayout>
      <SEOHead
        title={service.metaTitle}
        description={service.metaDescription}
        canonical={`https://promo-san-nso.lovable.app/usluga/${service.slug}`}
      />

      {/* Hero Section */}
      {/* LSI: H1 с основным ключом "[Услуга] в Новосибирске" */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-8 md:py-12">
        <div className="container px-4">
          <Breadcrumbs
            items={[
              { label: "Услуги", href: "/uslugi" },
              { label: service.name },
            ]}
          />

          <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary mb-4">
                <Icon className="h-4 w-4" />
                {service.shortName}
              </div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                {service.name} в {SITE_CONFIG.regionGenitive}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                {service.description}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="gap-2" asChild>
                  <a href={`tel:${SITE_CONFIG.phoneClean}`}>
                    <Phone className="h-5 w-5" />
                    Вызвать специалиста
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="gap-2" asChild>
                  <a href={`tel:${SITE_CONFIG.phoneClean}`}>
                    {SITE_CONFIG.phoneDisplay}
                  </a>
                </Button>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Работаем по {SITE_CONFIG.regionFull} {SITE_CONFIG.workingHours}</span>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl" />
                <div className="relative bg-background rounded-2xl border p-8 shadow-lg">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-2">Цена</div>
                    <div className="text-4xl font-bold text-primary">
                      {service.priceUnit} {service.priceFrom.toLocaleString("ru-RU")} ₽
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Точная цена после диагностики
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Основной текст услуги */}
      {/* LSI: основные ключевые фразы услуги в тексте */}
      {hasDetailedContent && content && (
        <section className="py-12 md:py-16">
          <div className="container px-4">
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold md:text-3xl mb-6">
                О услуге «{service.name}»
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                {content.fullDescription.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Когда нужна услуга */}
      {hasDetailedContent && content && (
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container px-4">
            <h2 className="text-2xl font-bold md:text-3xl mb-6">
              Когда нужна {service.shortName.toLowerCase()}?
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {content.whenNeeded.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-lg bg-background border p-4"
                >
                  <AlertTriangle className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Какие объекты обрабатываем + внутренние ссылки */}
      {/* LSI: типы объектов + услуга */}
      {hasDetailedContent && content && (
        <section className="py-12 md:py-16">
          <div className="container px-4">
            <h2 className="text-2xl font-bold md:text-3xl mb-6">
              Какие объекты обрабатываем
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {content.objectTypes.map((objectType, index) => {
                // Ищем соответствующий объект для создания ссылки
                const objectSlug = content.relatedObjects[index];
                const objectData = objectSlug ? getObjectBySlug(objectSlug) : null;
                
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent transition-colors"
                  >
                    <span>{objectType}</span>
                    {objectData && (
                      <Link 
                        to={`/obekt/${objectData.slug}`}
                        className="text-primary hover:underline text-sm"
                      >
                        Подробнее
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Ссылка на все объекты */}
            <div className="mt-6">
              <Link 
                to="/obekty" 
                className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
              >
                Все типы объектов
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Методы обработки */}
      {/* LSI: методы + услуга в городе */}
      {hasDetailedContent && content && (
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container px-4">
            <h2 className="text-2xl font-bold md:text-3xl mb-8">
              Методы {service.shortName.toLowerCase()}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {content.methods.map((method, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{method.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{method.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Блок "Цены" */}
      <section className="py-12 md:py-16">
        <div className="container px-4">
          <h2 className="text-2xl font-bold md:text-3xl mb-6 flex items-center gap-3">
            <Banknote className="h-8 w-8 text-primary" />
            Цены на {service.shortName.toLowerCase()} в {SITE_CONFIG.regionGenitive}
          </h2>
          
          {hasDetailedContent && content ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Тип объекта / услуги</TableHead>
                      <TableHead>Стоимость</TableHead>
                      <TableHead className="hidden sm:table-cell">Примечание</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {content.prices.map((price, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{price.type}</TableCell>
                        <TableCell className="text-primary font-semibold">{price.priceRange}</TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">
                          {price.note || "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-8">
                <h3 className="font-semibold mb-4">От чего зависит цена:</h3>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {content.priceFactors.map((factor, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-muted-foreground">{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-lg text-muted-foreground mb-4">
                Точную стоимость рассчитаем после осмотра объекта
              </p>
              <p className="text-3xl font-bold text-primary">
                от {service.priceFrom.toLocaleString("ru-RU")} ₽
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Калькулятор */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container px-4">
          <h2 className="text-2xl font-bold md:text-3xl mb-6 text-center">
            Рассчитайте стоимость онлайн
          </h2>
          <CostCalculatorPlaceholder />
        </div>
      </section>

      {/* Блок "Гарантия и документы" */}
      {hasDetailedContent && content && (
        <section className="py-12 md:py-16">
          <div className="container px-4">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Гарантия */}
              <div>
                <h2 className="text-2xl font-bold md:text-3xl mb-6 flex items-center gap-3">
                  <Shield className="h-8 w-8 text-primary" />
                  Гарантия
                </h2>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {content.guarantee.period}
                    </div>
                    <p className="text-muted-foreground">
                      {content.guarantee.conditions}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Документы */}
              <div>
                <h2 className="text-2xl font-bold md:text-3xl mb-6 flex items-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  Документы
                </h2>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground mb-4">
                      Работаем в соответствии с СанПиН. Выдаём документы для Роспотребнадзора:
                    </p>
                    <ul className="space-y-2">
                      {content.documents.map((doc, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Связанные вредители — внутренние ссылки */}
      {/* LSI: [вредитель] + [услуга] + новосибирск */}
      {hasDetailedContent && content && content.relatedPests.length > 0 && (
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container px-4">
            <h2 className="text-2xl font-bold md:text-3xl mb-6">
              От каких вредителей помогает {service.shortName.toLowerCase()}
            </h2>
            <div className="flex flex-wrap gap-3">
              {content.relatedPests.map((pestSlug) => {
                const pest = getPestBySlug(pestSlug);
                if (!pest) return null;
                return (
                  <Link
                    key={pestSlug}
                    to={`/vreditel/${pestSlug}`}
                    className="inline-flex items-center rounded-full bg-background border px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    Уничтожение {pest.nameGenitive}
                  </Link>
                );
              })}
              <Link
                to="/vrediteli"
                className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-4 py-2 hover:opacity-90 transition-opacity"
              >
                Все вредители
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Почему выбирают нас */}
      <section className="py-12 md:py-16">
        <div className="container px-4">
          <h2 className="text-2xl font-bold md:text-3xl mb-8 text-center">
            Почему выбирают нас
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {DEFAULT_ADVANTAGES.map((advantage, index) => {
              const AdvIcon = advantage.icon;
              return (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <AdvIcon className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-lg">{advantage.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {advantage.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container px-4">
          <h2 className="text-2xl font-bold md:text-3xl mb-8 text-center">
            Частые вопросы о {service.shortName.toLowerCase()}
          </h2>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {(hasDetailedContent && content ? content.faq : []).map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Связанные статьи блога */}
      {/* LSI: информационные ключи по теме услуги */}
      {hasDetailedContent && content && content.relatedArticles.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container px-4">
            <h2 className="text-2xl font-bold md:text-3xl mb-6">
              Полезные статьи
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {content.relatedArticles.map((article) => (
                <Link
                  key={article.slug}
                  to={`/blog/${article.slug}`}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent transition-colors group"
                >
                  <span className="group-hover:text-primary transition-colors">
                    {article.title}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
            <div className="mt-6">
              <Link 
                to="/blog" 
                className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
              >
                Все статьи блога
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Районы Новосибирска — внутренние ссылки */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container px-4">
          <h2 className="text-2xl font-bold md:text-3xl mb-6">
            {service.name} по районам {SITE_CONFIG.regionGenitive}
          </h2>
          <RelatedLinks type="districts" title="" maxItems={10} />
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="py-8 bg-muted/30">
        <div className="container px-4">
          <FAQTeaser 
            serviceSlug={service.slug}
            questionIds={FAQ_PRESETS[service.slug as keyof typeof FAQ_PRESETS] || FAQ_PRESETS.default}
            limit={3}
            title="Частые вопросы о услуге"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16">
        <div className="container px-4">
          <CTABlock
            title={`Заказать ${service.shortName.toLowerCase()} в ${SITE_CONFIG.regionGenitive}`}
            subtitle="Позвоните нам или оставьте заявку — мы перезвоним в течение 5 минут"
            variant="hero"
          />
        </div>
      </section>

      {/* Перелинковка на другие услуги */}
      <section className="border-t py-8">
        <RelatedLinks type="services" currentSlug={service.slug} title="Другие услуги" />
      </section>
    </MainLayout>
  );
}
