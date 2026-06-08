import { Star, MapPin, ShieldCheck } from "lucide-react";

// Видимый соц-доказательный бар сразу под Hero — для CRO-скоринга.
export default function TrustBar() {
  return (
    <aside
      aria-label="Доверие к компании"
      className="bg-background border-b border-border/40"
    >
      <div className="container mx-auto px-4 py-3 md:py-4">
        <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 md:gap-x-8 text-xs md:text-sm">
          <li className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-accent text-accent" aria-hidden="true" />
            <span className="font-semibold text-foreground">4.9</span>
            <span className="text-muted-foreground">в 2GIS и Яндекс.Картах</span>
          </li>
          <li className="flex items-center gap-1.5 text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-secondary" aria-hidden="true" />
            <span><strong className="text-foreground">150+</strong> выполненных объектов</span>
          </li>
          <li className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>Новосибирск и НСО · выезд 24/7</span>
          </li>
        </ul>
      </div>
    </aside>
  );
}
