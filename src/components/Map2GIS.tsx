import { useState, useEffect, useRef } from "react";
import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Map2GIS() {
  const [shouldLoadMap, setShouldLoadMap] = useState(false);
  const mapSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadMap(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Load map 200px before it comes into view
    );

    if (mapSectionRef.current) {
      observer.observe(mapSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);
  const organizationUrl = "https://go.2gis.com/oSzHM";
  
  // Яндекс Карты - надежное отображение на всех устройствах
  const embedUrl = "https://yandex.ru/map-widget/v1/?ll=82.9274,55.0302&z=16&pt=82.9274,55.0302,pm2rdm";

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
        {shouldLoadMap ? (
          <iframe
            src={embedUrl}
            loading="lazy"
            className="absolute inset-0 w-full h-full"
            title="Карта 2GIS - ООО Санитарные Решения"
            allow="geolocation"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Загрузка карты...</p>
            </div>
          </div>
        )}
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
