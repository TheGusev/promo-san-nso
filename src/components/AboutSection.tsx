import { Shield, Award, MapPin } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";

export default function AboutSection() {
  return (
    <section className="py-4 sm:py-16 bg-background" id="about" aria-label="О компании СанРешения">
      <div className="container px-4">
        <AnimatedSection animation="fade-up">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-center">
              Профессиональная дезинфекция <span className="text-primary">в Новосибирске</span>
            </h2>
            
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p>
                <strong>ООО «Санитарные Решения»</strong> — это команда сертифицированных специалистов по дезинфекции, дезинсекции и дератизации в Новосибирске и Новосибирской области. С 2025 года мы защищаем дома и бизнес от вредителей, вирусов и бактерий, используя современные технологии и безопасные препараты.
              </p>
              
              <p>
                Наша компания оказывает полный спектр санитарных услуг: <strong>уничтожение тараканов, клопов, муравьёв, блох</strong> и других насекомых; <strong>дератизацию</strong> — борьбу с крысами и мышами; <strong>дезинфекцию помещений</strong> от вирусов, бактерий и плесени; <strong>озонирование</strong> и <strong>дезодорацию</strong> для устранения неприятных запахов после пожара, затопления или длительного отсутствия.
              </p>

              <p>
                Работаем по всем районам Новосибирска: <strong>Центральный, Железнодорожный, Заельцовский, Калининский, Кировский, Ленинский, Октябрьский, Первомайский, Советский, Дзержинский</strong>. Также выезжаем в <strong>Бердск, Искитим, Академгородок, Кольцово, Краснообск</strong> и другие населённые пункты Новосибирской области. Срочный выезд в течение 2-4 часов после заявки.
              </p>

              <p>
                Мы используем только <strong>сертифицированные препараты 4 класса опасности</strong> (малоопасные), безопасные для людей и домашних животных. Все средства имеют разрешения Роспотребнадзора. Методы обработки включают <strong>холодный и горячий туман</strong>, барьерную защиту, точечное нанесение гелей и установку приманочных станций.
              </p>
            </div>

            {/* Key points */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm">Гарантия до 2 лет</div>
                  <div className="text-xs text-muted-foreground">Бесплатная повторная обработка</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <Award className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm">Лицензия и сертификаты</div>
                  <div className="text-xs text-muted-foreground">Документы для СЭС и Роспотребнадзора</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm">Вся НСО</div>
                  <div className="text-xs text-muted-foreground">Новосибирск и область</div>
                </div>
              </div>
            </div>

            <p className="text-center text-muted-foreground mt-6 text-sm">
              ИНН: 5410169338 • ОГРН: 1255400030555 • Работаем с 2025 года
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
