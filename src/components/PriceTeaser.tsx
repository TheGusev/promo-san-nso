import { Button } from "@/components/ui/button";
import { ArrowRight, Home, Building2, Warehouse, Car, Trees, Store } from "lucide-react";
import { scrollToAnchor } from "@/lib/scrollToAnchor";

const ROWS = [
  { icon: Home, label: "Квартира", price: "от 1 500 ₽", priceValue: "1500" },
  { icon: Building2, label: "Офис", price: "от 1 800 ₽", priceValue: "1800" },
  { icon: Store, label: "Кафе / магазин", price: "от 2 000 ₽", priceValue: "2000" },
  { icon: Warehouse, label: "Склад", price: "от 2 400 ₽", priceValue: "2400" },
  { icon: Trees, label: "Участок / дача", price: "от 2 000 ₽", priceValue: "2000" },
  { icon: Car, label: "Автомобиль", price: "от 1 200 ₽", priceValue: "1200" },
];

export default function PriceTeaser() {
  return (
    <section aria-label="Цены на дезинфекцию в Новосибирске" className="bg-muted/30">
      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Цены на дезинфекцию в Новосибирске
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Фиксированный прайс. Выезд бесплатный.
          </p>
        </div>

        <div
          className="max-w-3xl mx-auto rounded-2xl border border-border/60 bg-card overflow-hidden shadow-card"
          itemScope
          itemType="https://schema.org/OfferCatalog"
        >
          <meta itemProp="name" content="Цены на дезинфекцию в Новосибирске" />
          <ul role="list" className="divide-y divide-border/40">
            {ROWS.map(({ icon: Icon, label, price, priceValue }) => (
              <li
                key={label}
                className="flex items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-4"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/Offer"
              >
                <meta itemProp="priceCurrency" content="RUB" />
                <meta itemProp="price" content={priceValue} />
                <meta itemProp="availability" content="https://schema.org/InStock" />
                <span
                  className="flex items-center gap-3"
                  itemProp="itemOffered"
                  itemScope
                  itemType="https://schema.org/Service"
                >
                  <Icon className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
                  <span className="font-medium text-foreground" itemProp="name">{label}</span>
                </span>
                <span className="font-bold text-primary tabular-nums">{price}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center mt-6">
          <Button
            size="lg"
            className="rounded-2xl"
            onClick={() => scrollToAnchor("calculator")}
          >
            Рассчитать точную стоимость
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
