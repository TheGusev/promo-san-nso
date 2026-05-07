<?php
/**
 * Резервный канал отправки лидов в Telegram.
 *
 * Куда положить: корень сайта гордэз.рф, путь /api/lead.php
 * Итоговый URL: https://гордэз.рф/api/lead.php
 *
 * ВАЖНО: вписать TOKEN и CHAT_ID ниже (Beget блокирует .env).
 * Никому этот файл не показывать — токен внутри.
 *
 * Лог пишется в /api/lead.log рядом.
 */

// ----------- НАСТРОЙКИ -----------
$TELEGRAM_BOT_TOKEN = 'PASTE_YOUR_BOT_TOKEN_HERE';
$TELEGRAM_CHAT_ID   = '-5244841627';
// ---------------------------------

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['ok' => false, 'error' => 'method']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'bad_json']);
    exit;
}

// Honeypot
if (!empty($data['honeypot']) || !empty($data['website'])) {
    echo json_encode(['ok' => true, 'skipped' => 'bot']);
    exit;
}

// Валидация
$name  = isset($data['name']) ? mb_substr(trim((string)$data['name']), 0, 100) : '';
$phone = isset($data['phone']) ? preg_replace('/\D+/', '', (string)$data['phone']) : '';
if (strlen($phone) < 10 || strlen($phone) > 11) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'bad_phone']);
    exit;
}
$phoneClean = '+7' . substr($phone, -10);

// Простой rate-limit: не более 5 заявок в минуту с одного IP
$ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$ip = explode(',', $ip)[0];
$rateFile = sys_get_temp_dir() . '/lead_rl_' . md5($ip);
$now = time();
$hits = [];
if (is_file($rateFile)) {
    $hits = array_filter(
        json_decode(file_get_contents($rateFile), true) ?: [],
        fn($t) => $t > $now - 60
    );
}
if (count($hits) >= 5) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'error' => 'rate_limit']);
    exit;
}
$hits[] = $now;
@file_put_contents($rateFile, json_encode(array_values($hits)));

// Сборка сообщения
$source   = isset($data['source']) ? (string)$data['source'] : 'unknown';
$service  = isset($data['service']) ? (string)$data['service'] : '';
$price    = isset($data['final_price']) ? (int)$data['final_price'] : 0;
$obj      = isset($data['object_type']) ? (string)$data['object_type'] : '';
$utmSrc   = isset($data['utm_source']) ? (string)$data['utm_source'] : '';
$utmCmp   = isset($data['utm_campaign']) ? (string)$data['utm_campaign'] : '';
$page     = isset($data['last_page_url']) ? (string)$data['last_page_url'] : '';

$lines = [];
$lines[] = '🚨 <b>НОВАЯ ЗАЯВКА (резерв PHP)</b>';
$lines[] = '';
if ($name)   $lines[] = "👤 Имя: <b>" . htmlspecialchars($name) . "</b>";
$lines[] = "📞 Телефон: <b>" . htmlspecialchars($phoneClean) . "</b>";
if ($service) $lines[] = "🔧 Услуга: " . htmlspecialchars($service);
if ($obj)     $lines[] = "🏠 Объект: " . htmlspecialchars($obj);
if ($price)   $lines[] = "💰 Цена: " . number_format($price, 0, '.', ' ') . " ₽";
$lines[] = "📡 Источник: " . htmlspecialchars($source);
if ($utmSrc)  $lines[] = "🎯 UTM: " . htmlspecialchars($utmSrc) . " / " . htmlspecialchars($utmCmp);
if ($page)    $lines[] = "🔗 Страница: " . htmlspecialchars($page);
$lines[] = '';
$lines[] = "⚠️ <i>Этот лид прислан резервным каналом — основной (Supabase) не ответил. В БД его нет.</i>";

$text = implode("\n", $lines);

// Отправка в Telegram
$tgUrl = "https://api.telegram.org/bot{$TELEGRAM_BOT_TOKEN}/sendMessage";
$payload = http_build_query([
    'chat_id' => $TELEGRAM_CHAT_ID,
    'text' => $text,
    'parse_mode' => 'HTML',
    'disable_web_page_preview' => 'true',
]);

$ctx = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
        'content' => $payload,
        'timeout' => 8,
        'ignore_errors' => true,
    ],
]);

$tgResponse = @file_get_contents($tgUrl, false, $ctx);
$tgOk = $tgResponse && strpos($tgResponse, '"ok":true') !== false;

// Лог
$logLine = sprintf(
    "[%s] ip=%s phone=%s src=%s tg=%s\n",
    date('c'),
    $ip,
    $phoneClean,
    $source,
    $tgOk ? 'ok' : 'fail'
);
@file_put_contents(__DIR__ . '/lead.log', $logLine, FILE_APPEND | LOCK_EX);

if (!$tgOk) {
    http_response_code(502);
    echo json_encode(['ok' => false, 'error' => 'telegram_failed']);
    exit;
}

echo json_encode(['ok' => true, 'channel' => 'php']);
