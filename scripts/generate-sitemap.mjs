#!/usr/bin/env node
/**
 * Авто-генератор public/sitemap.xml на основе данных из src/data/.
 *
 * Запуск:
 *   node scripts/generate-sitemap.mjs
 *
 * Скрипт читает blogTopics.ts регулярными выражениями, поэтому
 * не требует tsx/ts-node и работает в любом Node 18+.
 *
 * После добавления новой статьи в BLOG_TOPICS или новой услуги/района
 * запустите этот скрипт, чтобы карта сайта автоматически синхронизировалась.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const SITE = 'https://xn--c1acj0ak3f.xn--p1ai';
const TODAY = new Date().toISOString().slice(0, 10);

// ---- Парсим slug-и из data-файлов ----
const extractSlugs = (file, marker) => {
  const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const start = marker ? src.indexOf(marker) : 0;
  const block = src.slice(start);
  return [...block.matchAll(/^\s{4}slug:\s*"([^"]+)"/gm)].map((m) => m[1]);
};

const articleSlugs = extractSlugs('src/data/blogTopics.ts', 'export const BLOG_TOPICS');
const serviceSlugs = extractSlugs('src/data/services.ts');
const pestSlugs = extractSlugs('src/data/pests.ts');
const objectSlugs = extractSlugs('src/data/objects.ts');
const districtSlugs = extractSlugs('src/data/districts.ts');

// Programmatic-комбинации — извлекаем path из programmaticMatrix
const matrixSrc = fs.readFileSync(path.join(ROOT, 'src/data/programmaticMatrix.ts'), 'utf8');
const programmaticPaths = [
  ...matrixSrc.matchAll(/path:\s*"([^"]+)"/g),
].map((m) => m[1]);

// ---- Сборка XML ----
const u = (loc, lastmod, changefreq, priority) =>
  `  <url>\n    <loc>${SITE}${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;

let out = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

out += '  <!-- Главная -->\n' + u('/', TODAY, 'daily', '1.0') + '\n\n';

out += '  <!-- Индексные страницы -->\n';
for (const [p, prio, fr] of [
  ['/uslugi', '0.9', 'weekly'],
  ['/vrediteli', '0.9', 'weekly'],
  ['/obekty', '0.9', 'weekly'],
  ['/rayony', '0.9', 'weekly'],
  ['/blog', '0.8', 'weekly'],
  ['/faq', '0.7', 'monthly'],
  ['/sanpin', '0.7', 'monthly'],
]) out += u(p, TODAY, fr, prio) + '\n';
out += u('/privacy', '2026-01-01', 'yearly', '0.3') + '\n\n';

out += '  <!-- Целевые лендинги -->\n';
for (const slug of ['klopy', 'tarakany', 'uchastok']) {
  out += u(`/lp/${slug}`, TODAY, 'weekly', '0.95') + '\n';
}
out += '\n';

out += `  <!-- Услуги (${serviceSlugs.length}) -->\n`;
for (const s of serviceSlugs) out += u(`/usluga/${s}`, TODAY, 'weekly', '0.9') + '\n';
out += '\n';

out += `  <!-- Вредители (${pestSlugs.length}) -->\n`;
for (const s of pestSlugs) out += u(`/vreditel/${s}`, TODAY, 'monthly', '0.7') + '\n';
out += '\n';

out += `  <!-- Объекты (${objectSlugs.length}) -->\n`;
for (const s of objectSlugs) out += u(`/obekt/${s}`, TODAY, 'monthly', '0.7') + '\n';
out += '\n';

out += `  <!-- Районы (${districtSlugs.length}) -->\n`;
for (const s of districtSlugs) out += u(`/rayon/${s}`, TODAY, 'monthly', '0.7') + '\n';
out += '\n';

if (programmaticPaths.length) {
  out += `  <!-- Programmatic (${programmaticPaths.length}) -->\n`;
  for (const p of programmaticPaths) out += u(p, TODAY, 'monthly', '0.6') + '\n';
  out += '\n';
}

out += `  <!-- Блог (${articleSlugs.length} статей) -->\n`;
for (const s of articleSlugs) out += u(`/blog/${s}`, TODAY, 'monthly', '0.7') + '\n';

out += '</urlset>\n';

const outPath = path.join(ROOT, 'public/sitemap.xml');
fs.writeFileSync(outPath, out);

const total =
  1 + 8 + serviceSlugs.length + pestSlugs.length + objectSlugs.length +
  districtSlugs.length + programmaticPaths.length + articleSlugs.length;

console.log(`✅ sitemap.xml собран: ${total} URL`);
console.log(`   • услуг: ${serviceSlugs.length}`);
console.log(`   • вредителей: ${pestSlugs.length}`);
console.log(`   • объектов: ${objectSlugs.length}`);
console.log(`   • районов: ${districtSlugs.length}`);
console.log(`   • programmatic: ${programmaticPaths.length}`);
console.log(`   • статей блога: ${articleSlugs.length}`);
