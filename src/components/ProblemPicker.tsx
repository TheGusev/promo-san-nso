import { Link } from "react-router-dom";
import { ArrowRight, Bug, Trees } from "lucide-react";
import { LANDINGS } from "@/data/landingContent";
import { scrollToAnchor } from "@/lib/scrollToAnchor";

const ITEMS = [
  {
    slug: "klopy" as const,
    title: "Клопы в квартире",
    subtitle: "Травля за один выезд",
    Icon: Bug,
    iconBg: "bg-red-500/15 text-red-500",
  },
  {
    slug: "tarakany" as const,
    title: "Тараканы",
    subtitle: "Гарантия до 12 мес.",
    Icon: Bug,
    iconBg: "bg-amber-500/15 text-amber-500",
  },
  {
    slug: "uchastok" as const,
    title: "Клещи на участке",
    subtitle: "Дача, коттедж, база",
    Icon: Trees,
    iconBg: "bg-green-600/15 text-green-600",
  },
];

export function ProblemPicker() {
  return (
    <section className="py-8 md:py-12 bg-muted/30 border-y" aria-labelledby="problem-picker-title">
      <div className="container px-3 sm:px-4">
        <div className="text-center mb-6">
          <h2 id="problem-picker-title" className="text-2xl md:text-3xl font-bold">
            С какой проблемой вы столкнулись?
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Выберите — откроется страница с ценой, гарантией и заявкой
          </p>
        </div>

        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item) => {
            const lp = LANDINGS[item.slug];
            const Icon = item.Icon;
            return (
              <Link
                key={item.slug}
                to={`/lp/${item.slug}`}
                className="group relative flex flex-col rounded-xl border bg-card p-4 sm:p-5 hover:border-primary hover:shadow-elevated transition-all"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${item.iconBg} mb-3`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-base sm:text-lg leading-tight">{item.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{item.subtitle}</p>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="font-medium text-primary">от {lp.priceFrom.toLocaleString("ru-RU")} ₽</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            );
          })}

          {/* Другое — скролл к калькулятору */}
          <button
            onClick={() => scrollToAnchor("calculator")}
            className="group relative flex flex-col rounded-xl border-2 border-dashed bg-card p-4 sm:p-5 hover:border-primary hover:bg-accent transition-all text-left"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
              <ArrowRight className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-base sm:text-lg leading-tight">Другое</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Мыши, муравьи, дезинфекция, СЭС
            </p>
            <div className="mt-3 text-sm font-medium text-primary">
              Открыть калькулятор →
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
