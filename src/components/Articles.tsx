import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, ArrowRight } from "lucide-react";

type Category = "all" | "disinfection" | "disinsection" | "deratization" | "tips";

export default function Articles() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");

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
      date: "20 ноября 2024",
    },
    {
      category: "disinfection",
      categoryLabel: "Дезинфекция",
      readTime: "7 мин",
      title: "Виды дезинфекции: холодный и горячий туман",
      description: "Разбираем основные методы обработки помещений и их эффективность",
      date: "18 ноября 2024",
    },
    {
      category: "disinsection",
      categoryLabel: "Дезинсекция",
      readTime: "6 мин",
      title: "Борьба с тараканами: мифы и реальность",
      description: "Развенчиваем популярные заблуждения о народных методах борьбы с насекомыми",
      date: "15 ноября 2024",
    },
    {
      category: "disinfection",
      categoryLabel: "Дезинфекция",
      readTime: "5 мин",
      title: "Озонирование: что это и когда нужно",
      description: "Всё о методе озонирования помещений и его преимуществах",
      date: "12 ноября 2024",
    },
    {
      category: "deratization",
      categoryLabel: "Дератизация",
      readTime: "8 мин",
      title: "Грызуны в доме: признаки и методы борьбы",
      description: "Как распознать присутствие мышей и крыс и что делать в этой ситуации",
      date: "10 ноября 2024",
    },
    {
      category: "tips",
      categoryLabel: "Советы",
      readTime: "6 мин",
      title: "Сезонность вредителей: когда ждать проблем",
      description: "Календарь активности насекомых и грызунов по месяцам года",
      date: "5 ноября 2024",
    },
    {
      category: "disinfection",
      categoryLabel: "Дезинфекция",
      readTime: "7 мин",
      title: "Дезинфекция офисных помещений: обязательства работодателя",
      description: "Правовые аспекты санитарной обработки рабочих мест",
      date: "1 ноября 2024",
    },
    {
      category: "disinsection",
      categoryLabel: "Дезинсекция",
      readTime: "9 мин",
      title: "Постельные клопы: как обнаружить и уничтожить",
      description: "Подробное руководство по выявлению и профессиональной борьбе с клопами",
      date: "28 октября 2024",
    },
  ];

  const filteredArticles =
    activeCategory === "all"
      ? articles
      : articles.filter((article) => article.category === activeCategory);

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article, index) => (
            <Card key={index} className="p-6 hover:shadow-elevated transition-all group">
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

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{article.date}</span>
                <button className="text-primary text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                  Читать <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
