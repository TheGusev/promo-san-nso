import { Utensils, Store, Building, Hotel, GraduationCap, Factory } from "lucide-react";

const CLIENTS = [
  { icon: Utensils, label: "Кафе и рестораны" },
  { icon: Store, label: "Магазины" },
  { icon: Building, label: "Жилые комплексы" },
  { icon: Hotel, label: "Гостиницы" },
  { icon: GraduationCap, label: "Детсады и школы" },
  { icon: Factory, label: "Производства" },
];

export default function ClientsBar() {
  return (
    <section aria-label="Кому мы помогаем" className="bg-background">
      <div className="container mx-auto px-4 py-8 md:py-10">
        <h2 className="text-center text-sm md:text-base font-semibold uppercase tracking-wider text-muted-foreground mb-5">
          Нам доверяют
        </h2>
        <ul className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 max-w-5xl mx-auto">
          {CLIENTS.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border/40 bg-card p-3 md:p-4 text-center"
            >
              <Icon className="h-6 w-6 md:h-7 md:w-7 text-primary" aria-hidden="true" />
              <span className="text-[11px] md:text-xs font-medium text-foreground leading-tight">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
