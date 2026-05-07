import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { SITE_CONFIG } from "@/data/siteConfig";
import { getAllServices } from "@/data/services";
import { getPopularPests } from "@/data/pests";
import { getPopularDistricts, getCityDistricts } from "@/data/districts";

export function SiteFooter() {
  const services = getAllServices();
  const popularPests = getPopularPests();
  const cityDistricts = getCityDistricts();

  return (
    <footer className="border-t bg-muted/30">
      {/* Карта 2GIS */}
      <div className="w-full h-64 bg-muted">
        <iframe
          src="https://widgets.2gis.com/widget?type=firmsonmap&options=%7B%22pos%22%3A%7B%22lat%22%3A55.0304%2C%22lon%22%3A82.9204%2C%22zoom%22%3A12%7D%2C%22opt%22%3A%7B%22city%22%3A%22novosibirsk%22%7D%2C%22org%22%3A%2270000001042246432%22%7D"
          width="100%"
          height="100%"
          frameBorder="0"
          loading="lazy"
          title="Карта расположения офиса СанРешения в Новосибирске"
        />
      </div>

      {/* Основной контент футера */}
      <div className="container px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* О компании */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">{SITE_CONFIG.companyName}</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Профессиональная санитарно-эпидемиологическая служба в Новосибирске.
              Уничтожение насекомых, грызунов, дезинфекция помещений.
              Работаем с частными лицами и организациями.
            </p>
          </div>

          {/* Услуги */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Услуги</h3>
            <ul className="space-y-2 text-sm">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    to={`/usluga/${service.slug}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/uslugi" className="font-medium text-primary hover:underline">
                  Все услуги →
                </Link>
              </li>
            </ul>
          </div>

          {/* Срочный вызов */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Срочный вызов</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/lp/klopy" className="text-muted-foreground hover:text-primary transition-colors">Уничтожение клопов</Link></li>
              <li><Link to="/lp/tarakany" className="text-muted-foreground hover:text-primary transition-colors">Травля тараканов</Link></li>
              <li><Link to="/lp/uchastok" className="text-muted-foreground hover:text-primary transition-colors">Обработка участка</Link></li>
              {popularPests.slice(0, 3).map((pest) => (
                <li key={pest.slug}>
                  <Link
                    to={`/vreditel/${pest.slug}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Уничтожение {pest.nameGenitive}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/vrediteli" className="font-medium text-primary hover:underline">
                  Все вредители →
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Контакты</h3>
            <div className="space-y-3">
              <a
                href={`tel:${SITE_CONFIG.phoneClean}`}
                className="flex items-center gap-2 text-lg font-medium text-primary hover:underline"
              >
                <Phone className="h-5 w-5" />
                {SITE_CONFIG.phoneDisplay}
              </a>
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
                {SITE_CONFIG.email}
              </a>
              <div className="flex gap-2 pt-2">
                <a
                  href={SITE_CONFIG.links.max}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-[#0077FF] text-white hover:opacity-90 transition-opacity"
                  aria-label="MAX"
                >
                  <span className="font-bold text-xs">MAX</span>
                </a>
                <a
                  href={SITE_CONFIG.links.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-[#0088CC] text-white hover:opacity-90 transition-opacity"
                  aria-label="Telegram"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </a>
                <a
                  href={SITE_CONFIG.links.twoGis}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-[#1DAD53] text-white hover:opacity-90 transition-opacity"
                  aria-label="2GIS"
                >
                  <span className="text-xs font-bold">2G</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Районы */}
        <div className="mt-8 pt-8 border-t">
          <h3 className="mb-4 text-lg font-semibold">
            Работаем по всем районам Новосибирска и области
          </h3>
          <div className="flex flex-wrap gap-2">
            {cityDistricts.map((district) => (
              <Link
                key={district.slug}
                to={`/rayon/${district.slug}`}
                className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {district.name}
              </Link>
            ))}
            <Link
              to="/rayony"
              className="inline-flex items-center rounded-full bg-primary text-primary-foreground px-3 py-1 text-sm hover:opacity-90 transition-opacity"
            >
              Все районы →
            </Link>
          </div>
        </div>
      </div>

      {/* Копирайт */}
      <div className="border-t">
        <div className="container px-4 py-4">
          <div className="flex flex-col gap-2 text-center text-sm text-muted-foreground md:flex-row md:justify-between md:text-left">
            <div>
              © {new Date().getFullYear()} {SITE_CONFIG.companyNameFull}. Все права защищены.
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:justify-end">
              <span>ИНН: {SITE_CONFIG.inn}</span>
              <span>ОГРН: {SITE_CONFIG.ogrn}</span>
              <Link to="/privacy" className="hover:text-primary transition-colors">
                Политика конфиденциальности
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
