import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, ArrowRight, ChevronDown } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { cn } from "@/lib/utils";

type Category = "all" | "disinfection" | "disinsection" | "deratization" | "tips";

export default function Articles() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [expandedArticle, setExpandedArticle] = useState<number | null>(null);

  const categories = [
    { id: "all" as Category, label: "Все статьи" },
    { id: "disinfection" as Category, label: "Дезинфекция" },
    { id: "disinsection" as Category, label: "Дезинсекция" },
    { id: "deratization" as Category, label: "Дератизация" },
    { id: "tips" as Category, label: "Советы" },
  ];

  const articles = [
    {
      category: "tips",
      categoryLabel: "Советы",
      readTime: "5 мин",
      title: "Как подготовить помещение к дезинфекции",
      description: "Пошаговая инструкция по подготовке квартиры или офиса перед приездом специалистов",
      date: "28 ноября 2025",
      content: "Перед обработкой помещения необходимо: 1) Убрать все продукты питания в холодильник или герметичные контейнеры. 2) Отодвинуть мебель от стен на 10-15 см для доступа к плинтусам. 3) Закрыть аквариумы и вывести домашних животных. 4) Снять постельное бельё и покрывала. 5) Открыть все шкафы и ящики. После обработки проветрите помещение 2-3 часа и проведите влажную уборку контактных поверхностей.",
    },
    {
      category: "disinfection",
      categoryLabel: "Дезинфекция",
      readTime: "7 мин",
      title: "Виды дезинфекции: холодный и горячий туман",
      description: "Разбираем основные методы обработки помещений и их эффективность",
      date: "20 ноября 2025",
      content: "Холодный туман — это распыление дезинфицирующего раствора при температуре окружающей среды. Частицы размером 50-100 микрон оседают на поверхностях за 3-4 часа. Горячий туман нагревает раствор до 70°C, создавая частицы 5-30 микрон. Они проникают в мельчайшие щели и держатся в воздухе до 10 часов. Горячий туман эффективнее на 30-40%, но требует эвакуации на сутки. Выбор метода зависит от степени заражения и типа объекта.",
    },
    {
      category: "disinsection",
      categoryLabel: "Дезинсекция",
      readTime: "6 мин",
      title: "Борьба с тараканами: мифы и реальность",
      description: "Развенчиваем популярные заблуждения о народных методах борьбы с насекомыми",
      date: "11 ноября 2025",
      content: "Миф 1: Борная кислота уничтожит всех тараканов. Реальность: эффективность 15-20%, не действует на яйца. Миф 2: Ультразвуковые отпугиватели работают. Реальность: научных доказательств нет, тараканы адаптируются. Миф 3: Если убрать еду, тараканы уйдут. Реальность: они могут месяц жить без пищи и питаться обойным клеем. Эффективное решение — профессиональная обработка инсектицидами с барьерной защитой и повторной обработкой через 2 недели.",
    },
    {
      category: "disinfection",
      categoryLabel: "Дезинфекция",
      readTime: "5 мин",
      title: "Озонирование: что это и когда нужно",
      description: "Всё о методе озонирования помещений и его преимуществах",
      date: "2 ноября 2025",
      content: "Озонирование — обработка помещения озоном (O₃), мощным окислителем. Уничтожает 99.9% бактерий, вирусов, плесени и неприятных запахов. Применяется после: затопления, пожара, длительного нахождения умершего, сильной задымлённости, появления плесени. Озон разлагается на кислород за 30-40 минут, не оставляя химических следов. Важно: во время обработки в помещении не должно быть людей, животных и растений. Время обработки — от 1 до 4 часов в зависимости от площади.",
    },
    {
      category: "deratization",
      categoryLabel: "Дератизация",
      readTime: "8 мин",
      title: "Грызуны в доме: признаки и методы борьбы",
      description: "Как распознать присутствие мышей и крыс и что делать в этой ситуации",
      date: "23 октября 2025",
      content: "Признаки присутствия грызунов: помёт (у мышей 3-6 мм, у крыс до 2 см), погрызы на продуктах и мебели, характерный запах, шорохи ночью, гнёзда из бумаги и ткани. Мыши редко уходят дальше 5 метров от гнезда, крысы обследуют до 50 метров. Методы борьбы: механические ловушки, клеевые площадки, родентициды (антикоагулянты). Профессиональная дератизация включает обследование, размещение приманок в безопасных контейнерах и мониторинг в течение 2-4 недель.",
    },
    {
      category: "tips",
      categoryLabel: "Советы",
      readTime: "6 мин",
      title: "Сезонность вредителей: когда ждать проблем",
      description: "Календарь активности насекомых и грызунов по месяцам года",
      date: "14 октября 2025",
      content: "Весна (март-май): пробуждение муравьёв, клопов, появление первых комаров. Лето (июнь-август): пик активности всех насекомых, особенно ос и мух. Осень (сентябрь-ноябрь): грызуны ищут тепло, мигрируют в дома; тараканы активизируются. Зима (декабрь-февраль): насекомые в помещениях (клопы, тараканы) активны круглый год из-за отопления. Рекомендация: профилактическую обработку проводить в марте-апреле и сентябре-октябре.",
    },
    {
      category: "disinfection",
      categoryLabel: "Дезинфекция",
      readTime: "7 мин",
      title: "Дезинфекция офисных помещений: обязательства работодателя",
      description: "Правовые аспекты санитарной обработки рабочих мест",
      date: "3 октября 2025",
      content: "Согласно ст. 212 ТК РФ и СанПиН 2.2.4.3359-16, работодатель обязан обеспечить санитарно-бытовое обслуживание работников. Регулярная дезинфекция обязательна для: медицинских учреждений (ежедневно), предприятий общепита (ежедневно), офисов (по эпидпоказаниям). При выявлении инфекционного заболевания у сотрудника требуется заключительная дезинфекция. Штраф за нарушение санитарных норм — до 500 000 рублей для юрлиц (ст. 6.3 КоАП).",
    },
    {
      category: "disinsection",
      categoryLabel: "Дезинсекция",
      readTime: "9 мин",
      title: "Постельные клопы: как обнаружить и уничтожить",
      description: "Подробное руководство по выявлению и профессиональной борьбе с клопами",
      date: "18 сентября 2025",
      content: "Признаки клопов: укусы в ряд по 3-5 штук, тёмные точки на матрасе (экскременты), сладковатый запах, сброшенные шкурки. Где искать: швы матраса, каркас кровати, за плинтусами, в розетках, за картинами. Клопы устойчивы к большинству бытовых инсектицидов. Профессиональная обработка включает: горячий пар (60°C убивает мгновенно), инсектициды пролонгированного действия, обязательную повторную обработку через 10-14 дней для уничтожения вылупившихся личинок.",
    },
  ];

  const filteredArticles =
    activeCategory === "all"
      ? articles
      : articles.filter((article) => article.category === activeCategory);

  const toggleArticle = (index: number) => {
    setExpandedArticle(expandedArticle === index ? null : index);
  };

  return (
    <section className="py-16 px-2 sm:px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold">
                Полезные <span className="text-primary">статьи</span>
              </h2>
            </div>
            <p className="text-muted-foreground text-lg">
              Экспертные советы о дезинфекции, дезинсекции и дератизации
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                onClick={() => setActiveCategory(category.id)}
                className="rounded-full"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredArticles.map((article, index) => (
            <AnimatedSection key={index} animation="fade-up" delay={(index % 3) * 100}>
              <Card className="p-6 hover:shadow-elevated transition-all group h-full flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary">{article.categoryLabel}</Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>

                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {article.description}
                </p>

                {/* Раскрытый контент */}
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    expandedArticle === index ? "max-h-96 opacity-100 mb-4" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="pt-4 border-t text-sm text-muted-foreground leading-relaxed">
                    {article.content}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs text-muted-foreground">{article.date}</span>
                  <button
                    onClick={() => toggleArticle(index)}
                    className="text-primary text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    {expandedArticle === index ? "Свернуть" : "Читать"}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-300",
                        expandedArticle === index && "rotate-180"
                      )}
                    />
                  </button>
                </div>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
