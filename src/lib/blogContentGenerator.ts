// Генератор контента для статей блога
// Создаёт структурированный контент на основе темы

import { BlogTopic, BLOG_CATEGORIES } from "@/data/blogTopics";
import { services } from "@/data/services";
import { pests } from "@/data/pests";
import { objects } from "@/data/objects";

export interface GeneratedArticleContent {
  title: string;
  description: string;
  category: string;
  categoryName: string;
  publishDate: string;
  readTime: number;
  keywords: string[];
  sections: ArticleSection[];
  faq: FAQItem[];
  relatedLinks: RelatedLink[];
  relatedArticles: { slug: string; title: string }[];
}

interface ArticleSection {
  heading: string;
  content: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface RelatedLink {
  url: string;
  text: string;
  type: "service" | "pest" | "object";
}

// Шаблоны для генерации вступлений
const introTemplates = {
  pests: (topic: BlogTopic) => `
    <p class="lead">
      ${topic.title} — один из самых частых запросов жителей Новосибирска в поисковых системах. 
      В этой статье эксперты СЭС «Санитарные Решения» подробно разберут ${topic.description.toLowerCase()}.
    </p>
    <p>
      Наша компания работает в Новосибирске и области более 10 лет. За это время мы накопили 
      обширный опыт борьбы с вредителями в квартирах, частных домах и коммерческих объектах. 
      Делимся профессиональными знаниями, которые помогут вам решить проблему.
    </p>
  `,
  disinfection: (topic: BlogTopic) => `
    <p class="lead">
      Профессиональная дезинфекция — это не просто уборка, а комплекс мероприятий по уничтожению 
      патогенных микроорганизмов. ${topic.description}
    </p>
    <p>
      СЭС «Санитарные Решения» проводит дезинфекцию в Новосибирске с использованием сертифицированных 
      препаратов IV класса опасности — безопасных для людей и домашних животных при соблюдении 
      рекомендаций специалистов.
    </p>
  `,
  regulations: (topic: BlogTopic) => `
    <p class="lead">
      Соблюдение санитарных норм — обязанность каждого предприятия и предпринимателя. 
      ${topic.description}
    </p>
    <p>
      В этой статье мы рассмотрим актуальные требования законодательства без цитирования 
      официальных документов — только практические рекомендации и пошаговые инструкции от 
      специалистов СЭС «Санитарные Решения».
    </p>
  `,
  faq: (topic: BlogTopic) => `
    <p class="lead">
      «${topic.keywords[0]}» — этот вопрос задают нам практически каждый день. 
      ${topic.description}
    </p>
    <p>
      Мы собрали ответы на самые частые вопросы клиентов СЭС «Санитарные Решения» в Новосибирске и 
      подготовили подробное руководство, которое поможет вам правильно подготовиться к обработке 
      и обеспечить безопасность семьи.
    </p>
  `,
};

// Генератор контента для секций H2
function generateSectionContent(heading: string, topic: BlogTopic): string {
  // Базовые шаблоны контента (в реальном проекте — уникальный контент)
  const contentLength = 300 + Math.floor(Math.random() * 200); // 300-500 слов на секцию
  
  const templates = [
    `<p>
      Рассмотрим подробнее: <strong>${heading.toLowerCase()}</strong>. Этот аспект критически важен 
      для успешного решения проблемы.
    </p>
    <p>
      По опыту специалистов СЭС «Санитарные Решения», большинство ошибок при самостоятельной обработке связаны 
      именно с недостаточным вниманием к этому этапу. Профессиональный подход предполагает 
      тщательную подготовку и системный анализ ситуации.
    </p>
    <ul>
      <li>Первый важный момент — правильная диагностика проблемы</li>
      <li>Второй аспект — выбор оптимального метода обработки</li>
      <li>Третий фактор — соблюдение технологии и сроков</li>
      <li>Четвёртый элемент — контроль результата и профилактика</li>
    </ul>
    <p>
      Наши специалисты используют современное оборудование и сертифицированные препараты, 
      что гарантирует эффективность обработки и безопасность для людей.
    </p>`,
    
    `<p>
      <strong>${heading}</strong> — вопрос, который требует детального рассмотрения. 
      Многие клиенты обращаются к нам именно после неудачных попыток решить проблему самостоятельно.
    </p>
    <p>
      Профессиональный подход СЭС «Санитарные Решения» включает несколько ключевых этапов:
    </p>
    <ol>
      <li><strong>Диагностика:</strong> определение масштаба проблемы и её источников</li>
      <li><strong>Планирование:</strong> разработка оптимальной стратегии обработки</li>
      <li><strong>Реализация:</strong> проведение обработки с использованием профессионального оборудования</li>
      <li><strong>Контроль:</strong> проверка результатов и рекомендации по профилактике</li>
    </ol>
    <blockquote>
      <p>
        «Ключ к успеху — комплексный подход. Обработка одной точки без устранения источника 
        проблемы даёт только временный эффект», — главный специалист СЭС «Санитарные Решения».
      </p>
    </blockquote>`,
    
    `<p>
      В контексте <em>${heading.toLowerCase()}</em> важно понимать несколько ключевых моментов. 
      Опыт работы СЭС «Санитарные Решения» в Новосибирске показывает типичные ошибки, которых можно избежать.
    </p>
    <h3>На что обратить внимание</h3>
    <p>
      Прежде всего, необходимо правильно оценить ситуацию. Многие проблемы связаны с тем, что 
      люди недооценивают масштаб заражения или используют неподходящие методы борьбы.
    </p>
    <p>
      Профессиональная обработка включает:
    </p>
    <ul>
      <li>Использование сертифицированных препаратов IV класса опасности</li>
      <li>Применение современного оборудования (генераторы тумана, УФ-обеззараживатели)</li>
      <li>Соблюдение технологических регламентов</li>
      <li>Документальное оформление работ</li>
    </ul>
    <p>
      После обработки специалисты дают подробные рекомендации по дальнейшим действиям и 
      профилактике повторного появления проблемы.
    </p>`,
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

// Генератор FAQ
function generateFAQ(topic: BlogTopic): FAQItem[] {
  const baseFAQ: FAQItem[] = [
    {
      question: `Сколько стоит ${topic.title.toLowerCase().replace(/[:?]/g, "")}?`,
      answer: `Стоимость зависит от площади помещения, степени заражения и выбранного метода обработки. 
        Средняя цена в Новосибирске — от 1500 до 5000 рублей. Для точного расчёта 
        рекомендуем воспользоваться калькулятором на нашем сайте или позвонить по телефону.`,
    },
    {
      question: "Какие гарантии вы даёте?",
      answer: `СЭС «Санитарные Решения» предоставляет гарантию на все виды обработок. Срок гарантии — от 6 месяцев 
        до 1 года в зависимости от типа услуги. Если в течение гарантийного срока проблема 
        повторится, повторная обработка проводится бесплатно.`,
    },
    {
      question: "Безопасна ли обработка для детей и животных?",
      answer: `Мы используем препараты IV класса опасности — самого низкого. При соблюдении 
        рекомендаций специалистов (проветривание, влажная уборка) обработка полностью безопасна. 
        Для семей с маленькими детьми рекомендуем покинуть помещение на 3-4 часа после обработки.`,
    },
    {
      question: "Как быстро вы можете приехать?",
      answer: `В большинстве районов Новосибирска время выезда составляет 1-2 часа после заявки. 
        Для отдалённых районов области — в течение дня. Срочный выезд возможен в любое время суток.`,
    },
    {
      question: "Нужно ли мне что-то делать перед обработкой?",
      answer: `Да, рекомендуется провести подготовку: убрать продукты питания, отодвинуть мебель от стен, 
        обеспечить доступ к плинтусам и углам. Подробную инструкцию специалист передаст при 
        оформлении заявки.`,
    },
  ];

  // Добавляем специфичные вопросы в зависимости от категории
  if (topic.category === "pests" && topic.relatedPests.length > 0) {
    baseFAQ.push({
      question: `Сколько времени займёт полное уничтожение ${topic.relatedPests[0]}?`,
      answer: `Полный цикл уничтожения обычно занимает от 1 до 3 недель. Это связано с жизненным циклом 
        вредителей — препарат должен подействовать на все стадии развития, включая яйца и личинки.`,
    });
  }

  if (topic.category === "regulations") {
    baseFAQ.push({
      question: "Какие документы вы оформляете после обработки?",
      answer: `После каждой обработки мы предоставляем: договор на оказание услуг, акт выполненных работ, 
        сертификаты на используемые препараты. Эти документы принимаются Роспотребнадзором 
        при проверках.`,
    });
  }

  return baseFAQ.slice(0, 6);
}

// Генератор связанных ссылок
function generateRelatedLinks(topic: BlogTopic): RelatedLink[] {
  const links: RelatedLink[] = [];

  // Добавляем ссылки на услуги
  topic.relatedServices.forEach((serviceSlug) => {
    const service = services.find((s) => s.slug === serviceSlug);
    if (service) {
      links.push({
        url: `/usluga/${service.slug}`,
        text: service.name,
        type: "service",
      });
    }
  });

  // Добавляем ссылки на вредителей
  topic.relatedPests.forEach((pestSlug) => {
    const pest = pests.find((p) => p.slug === pestSlug);
    if (pest) {
      links.push({
        url: `/vreditel/${pest.slug}`,
        text: pest.name,
        type: "pest",
      });
    }
  });

  // Добавляем ссылки на объекты
  topic.relatedObjects.forEach((objectSlug) => {
    const obj = objects.find((o) => o.slug === objectSlug);
    if (obj) {
      links.push({
        url: `/obekt/${obj.slug}`,
        text: obj.name,
        type: "object",
      });
    }
  });

  return links;
}

// Основная функция генерации контента статьи
export function generateArticleContent(topic: BlogTopic): GeneratedArticleContent {
  const categoryInfo = BLOG_CATEGORIES[topic.category];
  
  // Генерируем секции
  const sections: ArticleSection[] = [
    {
      heading: "Введение",
      content: introTemplates[topic.category](topic),
    },
    ...topic.h2Sections.map((heading) => ({
      heading,
      content: generateSectionContent(heading, topic),
    })),
  ];

  // Генерируем FAQ
  const faq = generateFAQ(topic);

  // Генерируем связанные ссылки
  const relatedLinks = generateRelatedLinks(topic);

  // Получаем связанные статьи
  const relatedArticles = topic.relatedArticles.map((slug) => {
    // В реальном проекте здесь был бы import из blogTopics
    return {
      slug,
      title: slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    };
  });

  return {
    title: topic.title,
    description: topic.description,
    category: topic.category,
    categoryName: categoryInfo.name,
    publishDate: topic.publishDate,
    readTime: topic.readTime,
    keywords: topic.keywords,
    sections,
    faq,
    relatedLinks,
    relatedArticles,
  };
}

// Функция для получения структуры оглавления
export function generateTableOfContents(sections: ArticleSection[]): { id: string; title: string }[] {
  return sections.map((section, index) => ({
    id: `section-${index}`,
    title: section.heading,
  }));
}
