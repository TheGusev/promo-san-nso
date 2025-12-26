import { Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import Map2GIS from "./Map2GIS";
import { AnimatedSection } from "@/components/ui/animated-section";

export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t" id="footer">
      <div className="container px-4 py-12">
        {/* 2GIS Map Section */}
        <AnimatedSection animation="fade-up" threshold={0.1}>
          <div className="mb-12">
            <Map2GIS />
          </div>
        </AnimatedSection>

        <div className="border-t pt-12"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-hero">
                <span className="text-xl font-bold text-primary-foreground">ГД</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold leading-none">ГорДЭЗ</span>
                <span className="text-xs text-muted-foreground">Новосибирск</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Профессиональные услуги дезинфекции, дезинсекции и дератизации для дома и бизнеса
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Услуги</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/dezinfeksiya" className="hover:text-primary transition-colors">Дезинфекция</Link></li>
              <li><Link to="/dezinseksiya" className="hover:text-primary transition-colors">Дезинсекция</Link></li>
              <li><Link to="/deratizatsiya" className="hover:text-primary transition-colors">Дератизация</Link></li>
              <li><Link to="/ozonirovanie" className="hover:text-primary transition-colors">Озонирование</Link></li>
              <li><Link to="/dezodoratsiya" className="hover:text-primary transition-colors">Дезодорация</Link></li>
              <li><Link to="/sertifikatsiya" className="hover:text-primary transition-colors">Подготовка к СЭС</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Информация</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/#faq" className="hover:text-primary transition-colors">Вопросы и ответы</a></li>
              <li><a href="/#reviews" className="hover:text-primary transition-colors">Отзывы</a></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Политика конфиденциальности</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Контакты</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-primary mt-0.5" />
                <a href="tel:+73833121660" className="hover:text-primary transition-colors">
                  +7 (383) 312-16-60
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-primary mt-0.5" />
                <a href="mailto:west-centro@mail.ru" className="hover:text-primary transition-colors">
                  west-centro@mail.ru
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-muted-foreground">Новосибирск и область</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ООО "Санитарные Решения" — профессиональные услуги дезинфекции, дезинсекции и дератизации. Все права защищены.</p>
          <p className="mt-2">
            ИНН: 5410169338 | ОГРН: 1255400030555
            <a 
              href="/admin/login" 
              className="ml-2 opacity-30 hover:opacity-100 transition-opacity"
              title="Панель администратора"
            >
              ◊
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
