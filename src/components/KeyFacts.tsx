import { Shield, Clock, Wallet, Award, FlaskConical } from "lucide-react";

// AI-citation friendly: каждый факт — самостоятельный <article> с уникальным id и одним предложением.
const FACTS = [
  { id: "fact-warranty", icon: Shield, text: "Гарантия на работы — до 2 лет с бесплатной повторной обработкой." },
  { id: "fact-eta", icon: Clock, text: "Выезд по Новосибирску — 30–60 минут, ежедневно 24/7." },
  { id: "fact-price", icon: Wallet, text: "Стоимость дезинсекции 1-комнатной квартиры — от 1 500 ₽." },
  { id: "fact-experience", icon: Award, text: "Более 150 выполненных объектов с 2025 года." },
  { id: "fact-safety", icon: FlaskConical, text: "Используем препараты IV класса безопасности — для людей и животных." },
];

export default function KeyFacts() {
  return (
    <section
      aria-label="Ключевые факты о компании Санитарные Решения"
      className="border-y border-border/40 bg-muted/30"
    >
      <div className="container mx-auto px-4 py-6 md:py-8">
        <h2 className="sr-only">Кратко о нас</h2>
        <ul className="grid gap-3 md:grid-cols-5 md:gap-4">
          {FACTS.map(({ id, icon: Icon, text }) => (
            <li key={id}>
              <article
                id={id}
                className="flex h-full items-start gap-3 rounded-xl bg-card p-3 md:p-4 border border-border/40 shadow-card"
              >
                <Icon className="h-5 w-5 shrink-0 text-primary mt-0.5" aria-hidden="true" />
                <p className="text-sm text-foreground leading-snug">{text}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
