/**
 * RU-PHOTO Telegram Bot
 * Принимает фото в чат, предлагает: Оживление (Veo) и Шаблоны (Imagen).
 * Inline-меню для выбора шаблонов.
 * Режим webhook: PUBLIC_URL + PORT — для верификации связи и приёма обновлений по URL.
 */
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const http = require('http');

const token = process.env.TELEGRAM_BOT_TOKEN;
const PUBLIC_URL = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
const PORT = parseInt(process.env.PORT || '3000', 10);
const WEBHOOK_PATH = process.env.WEBHOOK_PATH || '/webhook';
const FAL_VEO_URL = process.env.FAL_VEO_FUNCTION_URL || 'https://us-central1-project-1285666415996898989.cloudfunctions.net/generateFalVeoVideo';
const GOOGLE_IMAGE_URL = process.env.GOOGLE_IMAGE_FUNCTION_URL || 'https://us-central1-project-1285666415996898989.cloudfunctions.net/generateGoogleImage';

if (!token) {
  console.error('Set TELEGRAM_BOT_TOKEN in .env');
  process.exit(1);
}

const useWebhook = !!PUBLIC_URL;
const bot = new TelegramBot(token, { polling: !useWebhook });

// Presets for templates (id, title, category, prompt)
let presets = [];
try {
  presets = JSON.parse(fs.readFileSync(path.join(__dirname, 'presets.json'), 'utf8'));
} catch (e) {
  console.error('Failed to load presets.json:', e.message);
}

// User state: { lastPhotoUrl, lastPhotoPath, lastPhotoBase64, pendingAction, chatId }
const userState = new Map();

function getPhotoUrl(botToken, filePath) {
  return `https://api.telegram.org/file/bot${botToken}/${filePath}`;
}

async function downloadPhotoAsBase64(fileUrl) {
  const { data } = await axios.get(fileUrl, { responseType: 'arraybuffer' });
  return Buffer.from(data).toString('base64');
}

// --- Veo (оживление) ---
async function generateVideo(imageUrl, prompt) {
  const body = {
    prompt: prompt || 'Animate this image with smooth, natural movement. Subtle motion.',
    image_urls: [imageUrl],
    aspect_ratio: '16:9',
    duration: '8s',
    resolution: '720p',
    generate_audio: true,
    auto_fix: true,
  };
  const { data } = await axios.post(FAL_VEO_URL, body, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 300000,
  });
  if (!data.success || !data.video?.url) {
    throw new Error(data.error || data.message || 'Нет URL видео в ответе');
  }
  return data.video.url;
}

// --- Imagen (шаблон) ---
async function generateImage(prompt, imageBase64, aspectRatio = '1:1') {
  const body = {
    prompt,
    aspectRatio,
    negativePrompt: '',
    parameters: {},
    imageBase64,
    intensity: 50,
    modelId: 'gemini-2.5-flash-image',
  };
  const { data } = await axios.post(GOOGLE_IMAGE_URL, body, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 120000,
  });
  const base64 = data?.image?.base64;
  const mimeType = data?.image?.mimeType || 'image/png';
  if (!base64) {
    throw new Error(data?.error || data?.message || 'Сервер не вернул изображение');
  }
  return `data:${mimeType};base64,${base64}`;
}

function buildIdentityPrompt() {
  return [
    'TASK: Image-to-Image character preservation.',
    'STRICT REQUIREMENT: Use the ATTACHED IMAGE as the absolute visual source. The output MUST depict the EXACT SAME PERSON (same face, same gender, same features). Do not invent a new person. Apply the style ONLY to the environment and clothing.',
    'CRUCIAL: Preserve the facial features exactly. Maintain 100% identical facial identity. No plastic smoothing, natural skin texture.',
  ].join(' ');
}

// Меню команд (выпадающее рядом с полем ввода)
bot.setMyCommands([
  { command: 'start', description: 'Начать / Главное меню' },
  { command: 'menu', description: 'Открыть меню' },
]).catch(() => {});

const SITE_URL = process.env.SITE_URL || 'https://smartphotos.ru';
const MENU_IMAGE_URL = `${SITE_URL}/main/main_after.jpeg`;
const TERMS_URL = 'https://smartphotos.ru/terms';

const mainMenuKeyboard = {
  keyboard: [
    [{ text: '📋 Меню' }, { text: '📖 Инструкции' }],
    [{ text: '📄 Пользовательское соглашение' }],
  ],
  resize_keyboard: true,
  one_time_keyboard: false,
};

const welcomeCaption =
  '👋 **SmartPhotos** — оживление фото и стилизация за минуту.\n\n' +
  '📷 **Отправьте фото** — затем выберите:\n' +
  '🎬 **Оживление** — фото станет видео. Можно написать свой сценарий: например *«Улыбаюсь и обнимаю папу»* или *«Лёгкий ветер в волосах»*.\n' +
  '🖼 **Шаблоны** — ретро, свадьба, маркетплейс, дети, мода и др.\n\n' +
  'Кнопки ниже — **Инструкции** и **Пользовательское соглашение**. Отправьте фото, чтобы начать.';

const sendWelcome = async (chatId, withKeyboard = true) => {
  userState.delete(chatId);
  try {
    await bot.sendPhoto(chatId, MENU_IMAGE_URL, {
      caption: welcomeCaption,
      parse_mode: 'Markdown',
      reply_markup: withKeyboard ? mainMenuKeyboard : { remove_keyboard: true },
    });
  } catch (e) {
    await bot.sendMessage(chatId, welcomeCaption, {
      parse_mode: 'Markdown',
      reply_markup: withKeyboard ? mainMenuKeyboard : { remove_keyboard: true },
    });
  }
};

bot.onText(/\/start/, (msg) => sendWelcome(msg.chat.id, true));
bot.onText(/\/menu/, (msg) => sendWelcome(msg.chat.id, true));

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = (msg.text || '').trim();

  if (text === '📋 Меню') {
    sendWelcome(chatId, true);
    return;
  }

  if (text === '📖 Инструкции' || text === '📷 Как пользоваться') {
    const help =
      '**📖 Инструкции — как пользоваться SmartPhotos:**\n\n' +
      '1️⃣ Отправьте фото в этот чат\n' +
      '2️⃣ Нажмите «Оживление» или «Шаблоны»\n' +
      '3️⃣ **Оживление** — напишите свой сценарий (например: *Улыбаюсь и обнимаю папу*) или выберите быструю кнопку\n' +
      '4️⃣ **Шаблоны** — выберите стиль из списка\n\n' +
      'Отправьте фото, чтобы начать.';
    bot.sendMessage(chatId, help, { parse_mode: 'Markdown', reply_markup: mainMenuKeyboard });
    return;
  }

  if (text === '📄 Пользовательское соглашение') {
    bot.sendMessage(
      chatId,
      `📄 **Пользовательское соглашение**\n\nОзнакомиться с условиями использования сервиса SmartPhotos:\n${TERMS_URL}`,
      { parse_mode: 'Markdown', reply_markup: mainMenuKeyboard }
    );
    return;
  }
});

// Photo received
bot.on('photo', async (msg) => {
  const chatId = msg.chat.id;
  const photo = msg.photo[msg.photo.length - 1];
  const fileId = photo.file_id;

  try {
    const file = await bot.getFile(fileId);
    const filePath = file.file_path;
    const photoUrl = getPhotoUrl(token, filePath);

    userState.set(chatId, {
      lastPhotoUrl: photoUrl,
      lastPhotoPath: filePath,
      lastPhotoFileId: fileId,
      pendingAction: null,
      chatId,
    });

    await bot.sendMessage(chatId, 'Фото получено. Что сделать?', {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🎬 Оживление (видео)', callback_data: 'action_animate' }],
          [{ text: '🖼 Шаблоны (стили)', callback_data: 'action_templates' }],
        ],
      },
    });
  } catch (e) {
    console.error('Photo handling error:', e);
    bot.sendMessage(chatId, 'Не удалось обработать фото. Попробуйте ещё раз.');
  }
});

// Callbacks: action_animate, action_templates, preset_<id>, animate_skip
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  await bot.answerCallbackQuery(query.id);

  const state = userState.get(chatId);
  if (!state?.lastPhotoUrl) {
    await bot.sendMessage(chatId, 'Сначала отправьте фото.');
    return;
  }

  if (data === 'action_animate') {
    state.pendingAction = 'animate';
    userState.set(chatId, state);
    await bot.sendMessage(chatId,
      '🎬 **Оживление фото**\n\n' +
      'Напишите в чат свой сценарий движения — например:\n' +
      '• *Улыбаюсь и обнимаю папу*\n' +
      '• *Лёгкий ветер в волосах*\n' +
      '• *Камера медленно приближается*\n\n' +
      'Или нажмите быструю кнопку ниже.',
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '😊 Улыбка и объятия', callback_data: 'animate_hug' }],
            [{ text: '💨 Ветер в волосах', callback_data: 'animate_wind' }],
            [{ text: '🎥 Камера приближается', callback_data: 'animate_zoom' }],
            [{ text: '✨ Лёгкое движение', callback_data: 'animate_default' }],
          ],
        },
      }
    );
    return;
  }

  if (data === 'action_templates') {
    state.pendingAction = 'templates';
    userState.set(chatId, state);
    // Inline menu: rows of 2 buttons, preset id as callback_data
    const rows = [];
    for (let i = 0; i < presets.length; i += 2) {
      const row = presets.slice(i, i + 2).map(p => ({
        text: p.title,
        callback_data: `preset_${p.id}`,
      }));
      rows.push(row);
    }
    await bot.sendMessage(chatId, '🖼 Выберите шаблон:', {
      reply_markup: { inline_keyboard: rows },
    });
    return;
  }

  if (data.startsWith('animate_')) {
    const promptMap = {
      animate_default: 'Animate this image with smooth, natural movement. Subtle motion.',
      animate_wind: 'Gentle wind moving through hair and clothes. Natural, cinematic.',
      animate_zoom: 'Smooth camera zoom in toward the subject. Cinematic, professional.',
      animate_hug: 'Person smiling warmly and giving a gentle hug. Heartwarming, natural movement. Cinematic, emotional.',
    };
    const prompt = promptMap[data] || promptMap.animate_default;
    await runAnimate(chatId, state, prompt);
    return;
  }

  if (data.startsWith('preset_')) {
    const presetId = data.replace('preset_', '');
    const preset = presets.find(p => p.id === presetId);
    if (!preset) {
      await bot.sendMessage(chatId, 'Шаблон не найден.');
      return;
    }
    await runTemplate(chatId, state, preset);
  }
});

// Text: if pendingAction === 'animate', use text as prompt and run animate
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = (msg.text || '').trim();
  if (!text || msg.photo || text.startsWith('/')) return;

  const state = userState.get(chatId);
  if (!state || state.pendingAction !== 'animate') return;

  state.pendingAction = null;
  userState.set(chatId, state);
  await runAnimate(chatId, state, text);
});

async function runAnimate(chatId, state, prompt) {
  const sent = await bot.sendMessage(chatId, '⏳ Генерация видео (1–3 мин)...');
  try {
    const videoUrl = await generateVideo(state.lastPhotoUrl, prompt);
    await bot.deleteMessage(chatId, sent.message_id);
    await bot.sendVideo(chatId, videoUrl, { caption: 'Готово! Оживление по вашему описанию.' });
  } catch (e) {
    console.error('Veo error:', e.response?.data || e.message);
    await bot.editMessageText('Ошибка: ' + (e.response?.data?.error || e.message || 'не удалось сгенерировать видео'), {
      chat_id: chatId,
      message_id: sent.message_id,
    });
  }
}

async function runTemplate(chatId, state, preset) {
  const sent = await bot.sendMessage(chatId, `⏳ Применяю шаблон «${preset.title}»...`);
  try {
    const imageBase64 = await downloadPhotoAsBase64(state.lastPhotoUrl);
    const fullPrompt = `${buildIdentityPrompt()} STYLE/ENVIRONMENT: ${preset.prompt}`;
    const dataUrl = await generateImage(fullPrompt, imageBase64, '1:1');
    const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');
    await bot.deleteMessage(chatId, sent.message_id);
    await bot.sendPhoto(chatId, buffer, { caption: `Шаблон: ${preset.title}` });
  } catch (e) {
    console.error('Imagen error:', e.response?.data || e.message);
    await bot.editMessageText('Ошибка: ' + (e.response?.data?.error || e.message || 'не удалось применить шаблон'), {
      chat_id: chatId,
      message_id: sent.message_id,
    });
  }
}

// --- Webhook: HTTP-сервер и страница верификации связи ---
const VERIFY_HTML = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>RU-PHOTO Bot</title></head>
<body style="font-family:sans-serif;max-width:520px;margin:2rem auto;padding:1rem;">
  <h1>RU-PHOTO Telegram Bot</h1>
  <p><strong>Верификация связи:</strong> соединение с API установлено.</p>
  <p>Бот готов принимать обновления по webhook.</p>
  <p style="color:#666;font-size:0.9rem;">Если вы видите эту страницу, введите указанный ниже URL в настройках webhook (BotFather или API setWebhook).</p>
  <hr/>
  <p><strong>URL для setWebhook (приём обновлений):</strong></p>
  <code style="background:#eee;padding:0.2rem 0.4rem;word-break:break-all;">WEBHOOK_URL_PLACEHOLDER</code>
  <p style="margin-top:1.5rem;"><a href="https://core.telegram.org/bots/api">Telegram Bot API</a></p>
</body>
</html>`;

function createServer() {
  const webhookUrl = `${PUBLIC_URL}${WEBHOOK_PATH}`;
  const verifyHtml = VERIFY_HTML.replace('WEBHOOK_URL_PLACEHOLDER', webhookUrl);

  const server = http.createServer((req, res) => {
    const url = req.url || '/';
    const method = req.method || 'GET';

    // Верификация связи: GET / или GET /verify — отдать страницу с URL для ввода в Telegram
    if (method === 'GET' && (url === '/' || url === '/verify' || url.startsWith('/verify?'))) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(verifyHtml);
      return;
    }

    // Webhook: POST /webhook — обновления от Telegram
    if (method === 'POST' && (url === WEBHOOK_PATH || url.startsWith(WEBHOOK_PATH + '?'))) {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const update = JSON.parse(body);
          bot.processUpdate(update);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true }));
        } catch (e) {
          console.error('Webhook parse error:', e);
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: 'Invalid JSON' }));
        }
      });
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  });

  server.listen(PORT, () => {
    console.log('RU-PHOTO Telegram bot (webhook) is running.');
    console.log('  Верификация связи (откройте в браузере):', PUBLIC_URL + '/');
    console.log('  URL для ввода в setWebhook:', webhookUrl);
  });

  return server;
}

async function setWebhookToTelegram() {
  const webhookUrl = `${PUBLIC_URL}${WEBHOOK_PATH}`;
  try {
    const res = await axios.get(`https://api.telegram.org/bot${token}/setWebhook`, {
      params: { url: webhookUrl },
    });
    if (res.data.ok) {
      console.log('  Webhook установлен в Telegram:', webhookUrl);
    } else {
      console.warn('  setWebhook ответ:', res.data);
    }
  } catch (e) {
    console.warn('  Не удалось установить webhook:', e.message);
  }
}

if (useWebhook) {
  createServer();
  setWebhookToTelegram();
} else {
  console.log('RU-PHOTO Telegram bot (polling) is running.');
}
