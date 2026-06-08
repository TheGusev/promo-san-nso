// Q&A блок для AI-цитирования и Я.Директа. Каждый вопрос — отдельный <article> с микроразметкой Question/Answer.

const ITEMS = [
  {
    q: "Сколько стоит дезинфекция квартиры в Новосибирске?",
    a: "Стоимость дезинсекции 1-комнатной квартиры — от 1 500 ₽, 2-комнатной — от 1 800 ₽, 3-комнатной — от 2 000 ₽. Выезд по городу бесплатный.",
  },
  {
    q: "Как быстро приедет специалист СЭС?",
    a: "Стандартное время выезда по Новосибирску — 30–60 минут. Работаем ежедневно, включая выходные и праздники, 24/7.",
  },
  {
    q: "Безопасны ли препараты для детей и животных?",
    a: "Да. Мы используем препараты IV класса опасности — самого безопасного. После проветривания 2–4 часа помещение полностью безопасно.",
  },
];

export default function QuickAnswers() {
  return (
    <section
      aria-label="Короткие ответы на частые вопросы о дезинфекции"
      className="bg-background"
    >
      <div className="container mx-auto px-4 py-10 md:py-14">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8 text-center">
          Коротко о главном
        </h2>
        <div className="grid gap-4 md:grid-cols-3 md:gap-6 max-w-5xl mx-auto">
          {ITEMS.map((item) => (
            <article
              key={item.q}
              itemScope
              itemType="https://schema.org/Question"
              className="rounded-2xl border border-border/60 bg-card p-5 shadow-card"
            >
              <h3 itemProp="name" className="font-semibold text-foreground mb-2 text-base leading-snug">
                {item.q}
              </h3>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p itemProp="text" className="text-sm text-muted-foreground leading-relaxed">
                  {item.a}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
