import { useEffect, useState } from "react";
import { Users, Zap, Award } from "lucide-react";

export default function StatsCounter() {
  const [counts, setCounts] = useState({ clients: 0, treatments: 0, years: 0 });

  useEffect(() => {
    const duration = 2000;
    const targets = { clients: 500, treatments: 3000, years: 5 };
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setCounts({
        clients: Math.floor(targets.clients * progress),
        treatments: Math.floor(targets.treatments * progress),
        years: Math.floor(targets.years * progress),
      });

      if (step >= steps) {
        setCounts(targets);
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 bg-muted">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="text-4xl font-bold text-primary mb-2">{counts.clients}+</div>
            <p className="text-sm text-muted-foreground">Довольных клиентов</p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
                <Zap className="h-8 w-8 text-secondary" />
              </div>
            </div>
            <div className="text-4xl font-bold text-secondary mb-2">{counts.treatments}+</div>
            <p className="text-sm text-muted-foreground">Успешных обработок</p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                <Award className="h-8 w-8 text-accent" />
              </div>
            </div>
            <div className="text-4xl font-bold text-accent mb-2">{counts.years}+</div>
            <p className="text-sm text-muted-foreground">Лет на рынке</p>
          </div>
        </div>
      </div>
    </section>
  );
}
