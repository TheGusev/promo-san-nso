import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Map2GIS() {
  const organizationUrl = "https://go.2gis.com/oSzHM";
  
  // Упрощенный embed URL - карта по координатам без конкретной организации (более надежный)
  const embedUrl = "https://widgets.2gis.com/widget?type=map&options=%7B%22pos%22%3A%7B%22lat%22%3A55.030204%2C%22lon%22%3A82.92043%2C%22zoom%22%3A16%7D%2C%22opt%22%3A%7B%22city%22%3A%22novosibirsk%22%7D%7D";

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Наше расположение
        </h3>
        <Button 
          variant="outline" 
          size="sm"
          asChild
          className="gap-2"
        >
          <a
            href={organizationUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Открыть в 2GIS"
          >
            <ExternalLink className="h-4 w-4" />
            Открыть в 2GIS
          </a>
        </Button>
      </div>

      <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden border border-border bg-muted">
        <iframe
          src={embedUrl}
          loading="lazy"
          className="absolute inset-0 w-full h-full"
          title="Карта 2GIS - ООО Санитарные Решения"
          allow="geolocation"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
        <Button 
          asChild
          className="w-full sm:w-auto gap-2"
        >
          <a
            href={organizationUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MapPin className="h-4 w-4" />
            Построить маршрут
          </a>
        </Button>
        <p className="text-sm text-muted-foreground">
          Мы обслуживаем Новосибирск и Новосибирскую область
        </p>
      </div>
    </div>
  );
}
