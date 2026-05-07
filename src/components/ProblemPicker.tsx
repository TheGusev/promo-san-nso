import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { LANDINGS } from "@/data/landingContent";
import klopyImg from "@/assets/lp/lp-klopy.jpg";
import tarakanyImg from "@/assets/lp/lp-tarakany.jpg";
import uchastokImg from "@/assets/lp/lp-uchastok.jpg";

const ITEMS = [
  {
    slug: "klopy" as const,
    title: "Клопы в квартире",
    subtitle: "Травля за один выезд",
    image: klopyImg,
  },
  {
    slug: "tarakany" as const,
    title: "Тараканы",
    subtitle: "Гарантия до 12 мес.",
    image: tarakanyImg,
  },
  {
    slug: "uchastok" as const,
    title: "Клещи на участке",
    subtitle: "Дача, коттедж, база",
    image: uchastokImg,
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
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3 max-w-5xl mx-auto">
          {ITEMS.map((item) => {
            const lp = LANDINGS[item.slug];
            return (
              <Link
                key={item.slug}
                to={`/lp/${item.slug}`}
                className="group relative flex flex-col justify-end overflow-hidden rounded-xl border bg-card shadow-card hover:border-primary hover:shadow-elevated transition-all min-h-[220px] md:min-h-[260px]"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-background/10" aria-hidden />
                <div className="relative z-10 p-4 sm:p-5">
                  <h3 className="font-semibold text-lg sm:text-xl leading-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">{item.subtitle}</p>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="font-medium text-primary">
                      от {lp.priceFrom.toLocaleString("ru-RU")} ₽
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
