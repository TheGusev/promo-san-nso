<?php
/**
 * Основной (и единственный) канал отправки заявок в Telegram.
 *
 * Куда положить: корень сайта гордэз.рф, путь /api/lead.php
 * Итоговый URL: https://гордэз.рф/api/lead.php
 *
 * ВАЖНО: вписать TOKEN ниже (Beget блокирует .env, секреты Lovable в PHP не попадают).
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

// Валидация телефона
$phoneRaw = isset($data['phone']) ? (string)$data['phone'] : '';
$phone = preg_replace('/\D+/', '', $phoneRaw);
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

// Сбор полей (поддерживаем оба варианта именования: snake_case и camelCase)
$pick = function(array $keys) use ($data) {
    foreach ($keys as $k) {
        if (isset($data[$k]) && $data[$k] !== '' && $data[$k] !== null) {
            return is_scalar($data[$k]) ? mb_substr((string)$data[$k], 0, 500) : '';
        }
    }
    return '';
};

$name     = $pick(['name']);
$city     = $pick(['city']);
$objType  = $pick(['object_type', 'objectType']);
$problem  = $pick(['problem', 'pest']);
$service  = $pick(['service']);
$urgency  = $pick(['urgency']);
$comment  = $pick(['comment', 'message']);
$formName = $pick(['form_name', 'formName', 'source']);
$price    = isset($data['final_price']) ? (int)$data['final_price']
          : (isset($data['price']) ? (int)$data['price'] : 0);
$page     = $pick(['page', 'last_page_url']);
if (!$page) $page = $_SERVER['HTTP_REFERER'] ?? '';
$utmSrc   = $pick(['utm_source']);
$utmCmp   = $pick(['utm_campaign']);

// Сообщение в Telegram
$enc = fn($s) => htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8');
$lines = [];
$lines[] = '🔥 <b>Заявка с гордэз.рф</b>';
$lines[] = '';
$lines[] = '📞 Телефон: <b>' . $enc($phoneClean) . '</b>';
if ($name)     $lines[] = '👤 Имя: ' . $enc($name);
if ($city)     $lines[] = '🏙 Город: ' . $enc($city);
if ($objType)  $lines[] = '🏠 Объект: ' . $enc($objType);
if ($problem)  $lines[] = '⚠️ Проблема: ' . $enc($problem);
if ($service)  $lines[] = '🧪 Услуга: ' . $enc($service);
if ($urgency)  $lines[] = '⏱ Срочность: ' . $enc($urgency);
if ($price)    $lines[] = '💰 Цена: ' . number_format($price, 0, '.', ' ') . ' ₽';
if ($comment)  $lines[] = '💬 Коммент: ' . $enc($comment);
if ($formName) $lines[] = '📋 Форма: ' . $enc($formName);
if ($utmSrc)   $lines[] = '🎯 UTM: ' . $enc($utmSrc) . ' / ' . $enc($utmCmp);
$lines[] = '';
if ($page)     $lines[] = '🌐 ' . $enc($page);
$lines[] = '🕒 ' . date('d.m.Y H:i:s');

$text = implode("\n", $lines);

// Отправка в Telegram через cURL (надёжнее file_get_contents на Beget)
$tgUrl = "https://api.telegram.org/bot{$TELEGRAM_BOT_TOKEN}/sendMessage";
$tgPayload = json_encode([
    'chat_id' => $TELEGRAM_CHAT_ID,
    'text' => $text,
    'parse_mode' => 'HTML',
    'disable_web_page_preview' => true,
], JSON_UNESCAPED_UNICODE);

$tgOk = false;
$tgResponse = '';

if (function_exists('curl_init')) {
    $ch = curl_init($tgUrl);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $tgPayload,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);
    $tgResponse = curl_exec($ch);
    curl_close($ch);
    $tgOk = $tgResponse && strpos($tgResponse, '"ok":true') !== false;
} else {
    $ctx = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/json\r\n",
            'content' => $tgPayload,
            'timeout' => 10,
            'ignore_errors' => true,
        ],
    ]);
    $tgResponse = @file_get_contents($tgUrl, false, $ctx);
    $tgOk = $tgResponse && strpos($tgResponse, '"ok":true') !== false;
}

// Лог
$logLine = sprintf(
    "[%s] ip=%s phone=%s form=%s tg=%s\n",
    date('c'),
    $ip,
    $phoneClean,
    $formName,
    $tgOk ? 'ok' : 'fail'
);
@file_put_contents(__DIR__ . '/lead.log', $logLine, FILE_APPEND | LOCK_EX);

if (!$tgOk) {
    http_response_code(502);
    echo json_encode(['ok' => false, 'error' => 'telegram_failed']);
    exit;
}

echo json_encode(['ok' => true, 'channel' => 'php']);
