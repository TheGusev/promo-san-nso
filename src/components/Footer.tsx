import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-hero">
                <span className="text-xl font-bold text-primary-foreground">СР</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold leading-none">Санитарные Решения</span>
                <span className="text-xs text-muted-foreground">Новосибирск</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Профессиональные санитарные услуги для дома и бизнеса
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Услуги</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#services" className="hover:text-primary transition-colors">Дезинфекция</a></li>
              <li><a href="#services" className="hover:text-primary transition-colors">Дезинсекция</a></li>
              <li><a href="#services" className="hover:text-primary transition-colors">Дератизация</a></li>
              <li><a href="#services" className="hover:text-primary transition-colors">Озонирование</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Информация</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#faq" className="hover:text-primary transition-colors">Вопросы и ответы</a></li>
              <li><a href="#reviews" className="hover:text-primary transition-colors">Отзывы</a></li>
              <li><a href="/privacy" className="hover:text-primary transition-colors">Политика конфиденциальности</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Контакты</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-primary mt-0.5" />
                <a href="tel:+7XXXXXXXXXX" className="hover:text-primary transition-colors">
                  +7 (XXX) XXX-XX-XX
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-primary mt-0.5" />
                <a href="mailto:xxx@mail.ru" className="hover:text-primary transition-colors">
                  xxx@mail.ru
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
          <p>© 2024 ООО "Санитарные Решения — Новосибирск". Все права защищены.</p>
          <p className="mt-2">ИНН: XXXXXXXXXX | ОГРН: XXXXXXXXXXXXXXX</p>
        </div>
      </div>
    </footer>
  );
}
