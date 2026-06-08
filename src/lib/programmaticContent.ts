// Генератор контента для programmatic-страниц

import {
  MatrixEntry,
  getObjectAccusative,
  getObjectGenitive,
  getObjectLocative,
  getObjectNominative,
  getServiceAccusative,
  getServiceGenitive,
} from "@/data/programmaticMatrix";
import { SITE_CONFIG } from "@/data/siteConfig";
import { getDistrictBySlug } from "@/data/districts";

// Helper: получить предложный падеж района
const getDistrictLocative = (entry: MatrixEntry): string => {
  if (!entry.districtSlug) return SITE_CONFIG.regionPrepositional;
  const district = getDistrictBySlug(entry.districtSlug);
  return district?.nameLocative || entry.districtName || SITE_CONFIG.regionPrepositional;
};

// Родительный множественного для "владельцев X"
const OBJECT_GENITIVE_PLURAL: Record<string, string> = {
  "квартира": "квартир",
  "частный дом": "частных домов",
  "ресторан": "ресторанов",
  "офис": "офисов",
  "склад": "складов",
  "участок": "участков",
  "автомобиль": "автомобилей",
  "дача": "дач",
  "общежитие": "общежитий",
  "гостиница": "гостиниц",
  "кафе": "кафе",
  "магазин": "магазинов",
};

const getObjectGenitivePlural = (entry: MatrixEntry): string =>
  OBJECT_GENITIVE_PLURAL[entry.objectName.toLowerCase()] || getObjectGenitive(entry);

// Генерация H1
export const generateH1 = (entry: MatrixEntry): string => {
  const districtLocative = getDistrictLocative(entry);
  const objLoc = getObjectLocative(entry);
  const svc = entry.serviceName;
  const svcLower = svc.toLowerCase();

  const templates = {
    withPestAndDistrict: [
      `${entry.pestName} в ${objLoc}: профессиональная ${svcLower} в ${districtLocative}`,
      `Уничтожение ${getPestGenitive(entry.pestName)} в ${objLoc} — ${entry.districtName}`,
      `${svc} от ${getPestGenitive(entry.pestName)} в ${objLoc} (${entry.districtName})`,
    ],
    withPestNoDistrict: [
      `${entry.pestName} в ${objLoc}: ${svcLower} в ${SITE_CONFIG.regionPrepositional}`,
      `Уничтожение ${getPestGenitive(entry.pestName)} в ${objLoc} — СЭС в ${SITE_CONFIG.regionPrepositional}`,
      `${svc} от ${getPestGenitive(entry.pestName)}: обработка ${getObjectGenitive(entry)}`,
    ],
    noPestWithDistrict: [
      `${svc} ${getObjectGenitive(entry)} в ${districtLocative} — СЭС в ${SITE_CONFIG.regionPrepositional}`,
      `Обработка ${getObjectGenitive(entry)}: ${svcLower} в ${districtLocative}`,
      `СЭС ${entry.districtName}: ${svcLower} ${getObjectGenitive(entry)}`,
    ],
    noPestNoDistrict: [
      `${svc} ${getObjectGenitive(entry)} в ${SITE_CONFIG.regionPrepositional} — профессиональная обработка`,
      `${svc} ${getObjectGenitive(entry)}: вызов СЭС в ${SITE_CONFIG.regionPrepositional}`,
      `Профессиональная ${svcLower} ${getObjectGenitive(entry)} — ${SITE_CONFIG.companyName}`,
    ],
  };

  let templateList: string[];
  if (entry.pestSlug && entry.districtSlug) {
    templateList = templates.withPestAndDistrict;
  } else if (entry.pestSlug) {
    templateList = templates.withPestNoDistrict;
  } else if (entry.districtSlug) {
    templateList = templates.noPestWithDistrict;
  } else {
    templateList = templates.noPestNoDistrict;
  }

  const hash = entry.mainKeyword.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
  return templateList[hash % templateList.length];
};

// Генерация вступления
export const generateIntro = (entry: MatrixEntry): string => {
  const districtLocative = getDistrictLocative(entry);
  const location = entry.districtSlug
    ? `в ${districtLocative} (${SITE_CONFIG.region})`
    : `в ${SITE_CONFIG.regionPrepositional} и области`;

  const pestMention = entry.pestName
    ? `${entry.pestName} — одна из самых частых проблем`
    : "Насекомые и грызуны";

  const svcLower = entry.serviceName.toLowerCase();
  const objGen = getObjectGenitive(entry);

  if (entry.pestSlug) {
    return `${pestMention} для владельцев ${getObjectGenitivePlural(entry)} ${location}. Мы — СЭС «${SITE_CONFIG.companyName}» — специализируемся на профессиональном уничтожении вредителей с 2015 года. ${entry.secondaryKeywords[0] ? `Наши клиенты часто ищут: «${entry.secondaryKeywords[0]}» — и находят решение у нас.` : ""}\n\nПрофессиональная ${svcLower} ${objGen} позволяет избавиться от ${getPestGenitive(entry.pestName)} за одну обработку с гарантией результата. Мы используем сертифицированные препараты и современное оборудование.`;
  }

  return `Профессиональная ${svcLower} ${objGen} ${location} — это комплексная обработка от насекомых и других вредителей. СЭС «${SITE_CONFIG.companyName}» работает с 2015 года и гарантирует результат.\n\nМы используем сертифицированные препараты, безопасные для людей и домашних животных. ${entry.secondaryKeywords[0] ? `Клиенты часто обращаются к нам с запросом «${entry.secondaryKeywords[0]}» — мы решаем эту задачу профессионально.` : ""}`;
};

// Генерация блока "Ситуация"
export const generateSituation = (entry: MatrixEntry): string => {
  const objLoc = getObjectLocative(entry);
  const svcLower = entry.serviceName.toLowerCase();

  if (!entry.pestSlug) {
    return `${getObjectNominative(entry)} требует регулярной санитарной обработки для поддержания гигиены и соответствия нормам СанПиН. Даже при отсутствии видимых вредителей профилактическая ${svcLower} защитит помещение от потенциального заражения.`;
  }

  const situations: Record<string, (entry: MatrixEntry) => string> = {
    klopy: (e) => `Постельные клопы в ${getObjectLocative(e)} — это не только дискомфорт от укусов, но и серьёзный риск для здоровья. ${e.districtSlug ? `В ${getDistrictLocative(e)} клопы часто распространяются через старый жилфонд и вентиляцию.` : "Клопы быстро размножаются и могут заразить соседние помещения."}\n\nУкусы клопов вызывают аллергические реакции, бессонницу, нервные расстройства. Самостоятельная борьба неэффективна — насекомые прячутся в труднодоступных местах и быстро вырабатывают устойчивость к бытовым средствам.`,

    tarakany: (e) => `Тараканы в ${getObjectLocative(e)} — переносчики более 40 видов опасных заболеваний, включая дизентерию, сальмонеллёз, гельминтозы. ${e.districtSlug ? `В ${getDistrictLocative(e)} тараканы активно мигрируют между помещениями через коммуникации.` : "Одна самка таракана за год производит до 800 потомков."}\n\nДля ${e.objectSlug === "restoran" ? "ресторанов и кафе появление тараканов грозит штрафами Роспотребнадзора до 1 млн рублей и закрытием заведения" : "жилых помещений тараканы создают антисанитарные условия и портят продукты"}.`,

    krysy: (e) => `Крысы ${e.objectSlug === "uchastok" ? "на" : "в"} ${getObjectLocative(e)} — это не только порча имущества и продуктов, но и опасные заболевания: лептоспироз, чума, туляремия, бешенство. ${e.districtSlug ? `В ${getDistrictLocative(e)} крысы обитают вблизи пищевых производств и складов.` : ""}\n\nКрысы повреждают электропроводку (риск пожара), портят упаковку и товары, загрязняют помещения экскрементами. Самостоятельная борьба малоэффективна — нужна профессиональная дератизация.`,

    myshi: (e) => `Мыши в ${getObjectLocative(e)} активизируются в холодный сезон, проникая в помещения в поисках тепла и пищи. ${e.districtSlug ? `В ${getDistrictLocative(e)} это особенно актуально для частного сектора и первых этажей многоэтажек.` : ""}\n\nПомимо порчи продуктов и имущества, мыши переносят опасные заболевания и аллергены. Грызуны размножаются очень быстро — одна пара за год может дать до 2000 потомков.`,

    blohi: (e) => `Блохи в ${getObjectLocative(e)} появляются от домашних животных, из подвалов или от соседей. Укусы блох болезненны и вызывают сильный зуд, а сами насекомые переносят опасные заболевания.\n\nОсобенно опасны блохи для детей и людей с аллергией. Без профессиональной обработки вывести блох практически невозможно — они откладывают яйца в щелях, коврах, мягкой мебели.`,

    muravi: (e) => `Муравьи в ${getObjectLocative(e)} — это колония с тысячами особей и маткой, которая прячется в труднодоступном месте. ${e.districtSlug ? `В ${getDistrictLocative(e)} муравьи часто проникают из соседних помещений или с улицы.` : ""}\n\nМуравьи портят продукты, могут повреждать электроприборы, разносят бактерии. Обычные средства уничтожают только рабочих особей, но колония быстро восстанавливается.`,

    kleshchi: (e) => `Клещи ${e.objectSlug === "uchastok" ? "на участке" : `в ${getObjectLocative(e)}`} — серьёзная угроза здоровью. ${e.districtSlug ? `${e.districtName} входит в зону повышенной активности клещей.` : "Новосибирская область — эндемичный регион по клещевому энцефалиту."}\n\nКлещи переносят энцефалит, боррелиоз и другие опасные заболевания. Пик активности — май-июнь, но обработка рекомендуется с апреля для максимальной защиты.`,
  };

  const generator = situations[entry.pestSlug!];
  if (generator) {
    return generator(entry);
  }

  return `${entry.pestName} в ${objLoc} создают антисанитарные условия и угрожают здоровью людей. Профессиональная ${svcLower} — единственный надёжный способ избавиться от вредителей с гарантией результата.`;
};

// Генерация блока "Как проходит обработка"
export const generateTreatmentSteps = (entry: MatrixEntry): { step: number; title: string; description: string }[] => {
  const pestSpecific = entry.pestSlug ? ` от ${getPestGenitive(entry.pestName)}` : "";
  const objAcc = getObjectAccusative(entry);
  const svcAcc = getServiceAccusative(entry);

  return [
    {
      step: 1,
      title: "Осмотр и диагностика",
      description: `Специалист осматривает ${objAcc}, определяет ${entry.pestSlug ? `места скопления ${getPestGenitive(entry.pestName)}` : "тип и степень заражения"}, оценивает площадь обработки. На основе осмотра подбирается оптимальный метод и препараты.`,
    },
    {
      step: 2,
      title: "Подготовка помещения",
      description: `Перед обработкой необходимо убрать продукты питания, посуду, личные вещи. Вывести людей и домашних животных. Обеспечить доступ к плинтусам, мебели и другим местам обработки.`,
    },
    {
      step: 3,
      title: "Основная обработка",
      description: `Проводим ${svcAcc}${pestSpecific} методом холодного или горячего тумана. Обрабатываем все поверхности, щели, труднодоступные места. Используем сертифицированные препараты IV класса опасности.`,
    },
    {
      step: 4,
      title: "Барьерная защита",
      description: `После основной обработки наносим барьерные препараты длительного действия. Они защитят ${objAcc} от повторного заражения и уничтожат особей, которые могли выжить или вылупиться позже.`,
    },
    {
      step: 5,
      title: "Проветривание и контроль",
      description: `После обработки помещение проветривается 2-4 часа. Специалист даёт рекомендации по уборке и профилактике. Через 2-3 недели проводим контрольный осмотр (при необходимости — бесплатную повторную обработку).`,
    },
  ];
};

// Генерация блока "Цены и сроки"
export const generatePricing = (entry: MatrixEntry): { text: string; factors: string[] } => {
  const priceFrom = entry.priceFrom || 1500;
  const objectPrices: Record<string, string> = {
    kvartira: `от ${priceFrom}₽ за однокомнатную квартиру`,
    dom: `от ${priceFrom}₽ за дом до 100 м²`,
    restoran: `от ${priceFrom}₽ за помещение до 50 м²`,
    ofis: `от ${priceFrom}₽ за офис до 50 м²`,
    sklad: `от ${priceFrom}₽ за склад до 200 м²`,
    uchastok: `от ${priceFrom}₽ за участок до 6 соток`,
    avtomobil: `от ${priceFrom}₽ за легковой автомобиль`,
  };

  const price = objectPrices[entry.objectSlug] || `от ${priceFrom}₽`;
  const districtLocative = getDistrictLocative(entry);

  return {
    text: `Стоимость ${getServiceGenitive(entry)} ${getObjectGenitive(entry)}${entry.pestSlug ? ` от ${getPestGenitive(entry.pestName)}` : ""} ${entry.districtSlug ? `в ${districtLocative}` : `в ${SITE_CONFIG.regionPrepositional}`}: **${price}**. Выезд бесплатный. Точную стоимость назовём после осмотра — она зависит от площади, степени заражения и выбранного метода обработки.`,
    factors: [
      "Площадь помещения (м²)",
      entry.pestSlug ? `Степень заражения ${getPestGenitive(entry.pestName).toLowerCase()}` : "Тип обработки",
      "Метод обработки (холодный/горячий туман, комплекс)",
      "Необходимость барьерной защиты",
      "Срочность выезда (стандартный или экстренный)",
    ],
  };
};

// Генерация блока "Гарантия"
export const generateGuarantee = (entry: MatrixEntry): string => {
  const days = entry.guaranteeDays || 90;
  const months = Math.round(days / 30);

  return `На ${getServiceAccusative(entry)} ${getObjectGenitive(entry)}${entry.pestSlug ? ` от ${getPestGenitive(entry.pestName)}` : ""} предоставляем гарантию **${months} ${getMonthWord(months)}**. Если в течение гарантийного срока ${entry.pestSlug ? entry.pestName!.toLowerCase() : "вредители"} появятся снова — проведём повторную обработку бесплатно.\n\nГарантия действует при соблюдении рекомендаций специалиста по уборке и профилактике. Выдаём акт выполненных работ и договор.`;
};

// Генерация FAQ
export const generateFAQ = (entry: MatrixEntry): { question: string; answer: string }[] => {
  const pestMention = entry.pestName ? entry.pestName.toLowerCase() : "насекомых";
  const districtLocative = getDistrictLocative(entry);

  const faq: { question: string; answer: string }[] = [];

  // Цена
  faq.push({
    question: `Сколько стоит ${entry.serviceName.toLowerCase()} ${getObjectGenitive(entry)} ${entry.districtSlug ? `в ${districtLocative}` : `в ${SITE_CONFIG.regionPrepositional}`}?`,
    answer: `Стоимость зависит от площади и степени заражения. Минимальная цена — от ${entry.priceFrom || 1500}₽. Выезд бесплатный. Точную стоимость назовём после осмотра или по телефону после уточнения деталей.`,
  });

  // Безопасность
  faq.push({
    question: `Безопасна ли обработка от ${pestMention} для детей и домашних животных?`,
    answer: `Да, мы используем препараты IV класса опасности — самого безопасного. После обработки нужно проветрить помещение 2-4 часа, сделать влажную уборку открытых поверхностей. После этого помещение безопасно для детей и животных.`,
  });

  // Время
  faq.push({
    question: `Как быстро приедете ${entry.districtSlug ? `в ${districtLocative}` : "по вызову"}?`,
    answer: entry.districtSlug
      ? `Время выезда в ${entry.districtName} — от 30 до 90 минут в зависимости от загруженности. Для срочных случаев есть экстренный выезд. Работаем ежедневно, включая выходные.`
      : `Стандартное время выезда — от 30 минут до 2 часов. Есть экстренный выезд при срочной необходимости. Работаем ежедневно, включая выходные.`,
  });

  // Гарантия
  faq.push({
    question: `Что входит в гарантию на ${getServiceAccusative(entry)}?`,
    answer: `Гарантия ${entry.guaranteeDays ? Math.round(entry.guaranteeDays / 30) : 3} месяца. Если ${pestMention} появятся снова — приедем бесплатно и проведём повторную обработку. Выдаём договор и акт выполненных работ.`,
  });

  // Подготовка
  faq.push({
    question: `Как подготовить ${getObjectAccusative(entry)} к обработке?`,
    answer: `Уберите продукты питания и посуду, отодвиньте мебель от стен для доступа к плинтусам, выведите людей и домашних животных. После обработки — проветрите 2-4 часа и проведите влажную уборку открытых поверхностей.`,
  });

  // Специфичный для вредителя
  if (entry.pestSlug === "klopy") {
    faq.push({
      question: `Почему клопы возвращаются после самостоятельной обработки?`,
      answer: `Бытовые средства убивают только взрослых клопов, но не яйца. Яйца устойчивы к большинству препаратов и вылупляются через 7-10 дней. Профессиональная обработка включает препараты пролонгированного действия, которые уничтожают вылупившихся особей.`,
    });
  }

  if (entry.pestSlug === "tarakany" && entry.objectSlug === "restoran") {
    faq.push({
      question: `Какие документы выдаёте для проверки Роспотребнадзора?`,
      answer: `Выдаём договор на оказание услуг по дезинсекции, акт выполненных работ, сертификаты на используемые препараты. Эти документы подтверждают проведение обработки для любых проверяющих органов.`,
    });
  }

  return faq.slice(0, 6);
};

// Вспомогательные функции склонения
function getPestGenitive(pestName?: string): string {
  const genitive: Record<string, string> = {
    "Клопы": "клопов",
    "Тараканы": "тараканов",
    "Блохи": "блох",
    "Муравьи": "муравьёв",
    "Клещи": "клещей",
    "Крысы": "крыс",
    "Мыши": "мышей",
  };
  return pestName ? (genitive[pestName] || pestName.toLowerCase()) : "вредителей";
}

function getMonthWord(months: number): string {
  if (months === 1) return "месяц";
  if (months >= 2 && months <= 4) return "месяца";
  return "месяцев";
}
