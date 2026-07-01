/**
 * Telegram Bot Webhook для RU-PHOTO.
 * Обрабатывает GET (страница верификации) и POST (обновления от Telegram).
 * Токен: process.env.TELEGRAM_BOT_TOKEN или functions/.env (TELEGRAM_BOT_TOKEN).
 */
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const fs = require("fs");
const admin = require("firebase-admin");

let token = process.env.TELEGRAM_BOT_TOKEN;
if (!token && typeof require("firebase-functions") !== "undefined") {
  try {
    token = require("firebase-functions").config().telegram?.bot_token;
  } catch (_) {}
}
const FAL_VEO_URL =
  process.env.FAL_VEO_FUNCTION_URL ||
  "https://us-central1-project-1285666415996898989.cloudfunctions.net/generateFalVeoVideo";
const GOOGLE_IMAGE_URL =
  process.env.GOOGLE_IMAGE_FUNCTION_URL ||
  "https://us-central1-project-1285666415996898989.cloudfunctions.net/generateGoogleImage";

let presets = [];
let documentSpecs = [];
try {
  const presetsPath = path.join(__dirname, "presets.json");
  if (fs.existsSync(presetsPath)) {
    presets = JSON.parse(fs.readFileSync(presetsPath, "utf8"));
  }
} catch (e) {
  console.error("telegramWebhook: Failed to load presets", e.message);
}
try {
  const specsPath = path.join(__dirname, "documentSpecs.json");
  if (fs.existsSync(specsPath)) {
    documentSpecs = JSON.parse(fs.readFileSync(specsPath, "utf8"));
  }
} catch (e) {
  console.error("telegramWebhook: Failed to load documentSpecs", e.message);
}

const userState = new Map();
const bot = token ? new TelegramBot(token, { polling: false }) : null;

// URL публичных изображений с сайта
const SITE_URL = "https://smartphotos.ru";
const MENU_IMAGE_URL = `${SITE_URL}/main/main_after.jpeg`;
const TERMS_URL = "https://telegra.ph/Politika-obrabotki-personalnyh-dannyh--II-Foto-Studiya-03-18";

// Установить список команд в меню бота (выпадающее меню рядом с полем ввода)
if (bot) {
  bot.setMyCommands([
    { command: "start", description: "Начать / Главное меню" },
    { command: "menu", description: "Открыть меню" },
    { command: "price", description: "Стоимость услуг" },
  ]).catch(() => {});
}

// Inline-меню после текста: компактно
const mainInlineMenu = {
  inline_keyboard: [
    [
      { text: "🌐 Наш Сайт", url: "https://smartphotos.ru" },
      { text: "👤 Профиль", callback_data: "menu_profile" },
    ],
    [
      { text: "💰 Стоимость", callback_data: "menu_pricing" },
      { text: "📖 Инструкции", callback_data: "menu_instructions" },
    ],
    [
      { text: "📄 Политика данных", url: "https://telegra.ph/Politika-obrabotki-personalnyh-dannyh--II-Foto-Studiya-03-18" },
      { text: "📋 Публичная оферта", url: "https://telegra.ph/Publichnaya-oferta--II-Foto-Studiya-03-23" },
    ],
  ],
};

const whatNextMenu = {
  inline_keyboard: [
    [
      { text: "📋 Меню", callback_data: "menu_start" },
      { text: "📷 Новое фото", callback_data: "menu_new_photo" },
    ],
  ],
};

function sendWhatNextMessage(chatId) {
  if (!bot) return;
  bot
    .sendMessage(
      chatId,
      "✅ Готово! Что делаем дальше?\n\nОтправьте новое фото или нажмите Меню 👇",
      { reply_markup: whatNextMenu }
    )
    .catch(() => {});
}

// Создать или обновить пользователя в Firestore по Telegram ID, вернуть статистику
async function getOrCreateTelegramUser(telegramUserId, username, firstName) {
  const col = admin.firestore().collection("telegram_users");
  const docRef = col.doc(String(telegramUserId));
  const doc = await docRef.get();
  if (doc.exists) {
    return doc.data();
  }
  await docRef.set({
    telegramUserId: String(telegramUserId),
    username: username || null,
    firstName: firstName || null,
    photosProcessed: 0,
    documentsMade: 0,
    templatesUsed: 0,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    lastActivityAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return {
    photosProcessed: 0,
    documentsMade: 0,
    templatesUsed: 0,
  };
}

async function incrementTelegramUserStat(chatId, statName) {
  const state = userState.get(chatId);
  const tgId = state?.telegramUserId;
  if (!tgId) return;
  try {
    const col = admin.firestore().collection("telegram_users");
    const docRef = col.doc(String(tgId));
    await docRef.set(
      {
        telegramUserId: String(tgId),
        [statName]: admin.firestore.FieldValue.increment(1),
        lastActivityAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  } catch (e) {
    console.error("incrementTelegramUserStat:", e.message);
  }
}

function getPhotoUrl(botToken, filePath) {
  return `https://api.telegram.org/file/bot${botToken}/${filePath}`;
}

async function downloadPhotoAsBase64(fileUrl) {
  const { data } = await axios.get(fileUrl, { responseType: "arraybuffer" });
  return Buffer.from(data).toString("base64");
}

async function generateVideo(imageUrl, prompt) {
  const body = {
    prompt:
      prompt ||
      "Animate this image with smooth, natural movement. Subtle motion.",
    image_urls: [imageUrl],
    aspect_ratio: "16:9",
    duration: "8s",
    resolution: "720p",
    generate_audio: true,
    auto_fix: true,
  };
  const { data } = await axios.post(FAL_VEO_URL, body, {
    headers: { "Content-Type": "application/json" },
    timeout: 300000,
  });
  if (!data.success || !data.video?.url) {
    throw new Error(data.error || data.message || "Нет URL видео в ответе");
  }
  return data.video.url;
}

async function generateImage(prompt, imageBase64, aspectRatio = "1:1") {
  const body = {
    prompt,
    aspectRatio,
    negativePrompt: "",
    parameters: {},
    imageBase64,
    intensity: 50,
    modelId: "gemini-2.5-flash-image",
  };
  const { data } = await axios.post(GOOGLE_IMAGE_URL, body, {
    headers: { "Content-Type": "application/json" },
    timeout: 120000,
  });
  const base64 = data?.image?.base64;
  const mimeType = data?.image?.mimeType || "image/png";
  if (!base64) {
    throw new Error(
      data?.error || data?.message || "Сервер не вернул изображение"
    );
  }
  return `data:${mimeType};base64,${base64}`;
}

function buildIdentityPrompt() {
  return [
    "TASK: Image-to-Image character preservation.",
    "STRICT REQUIREMENT: Use the ATTACHED IMAGE as the absolute visual source. The output MUST depict the EXACT SAME PERSON (same face, same gender, same features). Do not invent a new person. Apply the style ONLY to the environment and clothing.",
    "CRUCIAL: Preserve the facial features exactly. Maintain 100% identical facial identity. No plastic smoothing, natural skin texture.",
  ].join(" ");
}

if (bot) {
  const welcomeCaption =
    "👋 **ИИ Фото Студия** — оживление фото и стилизация за минуту.\n\n" +
    "📷 **Отправьте фото** — затем выберите:\n" +
    "🎬 **Оживление** — фото станет видео · 100 руб\n" +
    "🖼 **Шаблоны** — ретро, свадьба, маркетплейс, дети, мода и др. · нужна регистрация на сайте\n" +
    "📄 **Фото на документы** — загранпаспорт РФ, виза ЕС/США, резюме · 150 руб\n\n" +
    "Отправьте фото, чтобы начать 👇";

  const sendWelcome = async (msg, withKeyboard = true) => {
    const chatId = msg.chat.id;
    const from = msg.from || {};
    userState.delete(chatId);

    // Создать/обновить пользователя в Firestore по Telegram ID
    let stats = {};
    if (from.id) {
      try {
        stats = await getOrCreateTelegramUser(
          from.id,
          from.username,
          from.first_name
        );
        userState.set(chatId, { chatId, telegramUserId: from.id });
      } catch (e) {
        console.error("getOrCreateTelegramUser:", e.message);
      }
    }

    const statsText =
      Object.keys(stats).length > 0
        ? `\n\n📊 **Ваша статистика:**\n` +
          `🔄 Оживлено фото: ${stats.photosProcessed || 0}\n` +
          `📄 Фото на документы: ${stats.documentsMade || 0}\n` +
          `🖼 Шаблонов применено: ${stats.templatesUsed || 0}`
        : "";

    const caption = welcomeCaption + statsText;

    const replyMarkup = withKeyboard ? mainInlineMenu : undefined;

    try {
      await bot.sendPhoto(chatId, MENU_IMAGE_URL, {
        caption,
        parse_mode: "Markdown",
        reply_markup: replyMarkup,
      });
    } catch (photoErr) {
      console.warn("sendPhoto failed, falling back to text:", photoErr.message);
      await bot.sendMessage(chatId, caption, {
        parse_mode: "Markdown",
        reply_markup: replyMarkup,
      });
    }
  };

  global.__telegramSendWelcome = sendWelcome;

  bot.onText(/\/start/, (msg) => {
    sendWelcome(msg, true).catch((e) =>
      console.error("onText /start error:", e)
    );
  });

  bot.onText(/\/menu/, (msg) => {
    sendWelcome(msg, true);
  });

  bot.onText(/\/price/, (msg) => {
    sendPricing(msg.chat.id);
  });

  const sendPricing = (chatId) =>
    bot.sendMessage(
      chatId,
      "💰 **Стоимость услуг ИИ Фото Студия:**\n\n" +
        "📄 **Фото на документы** — 150 руб\n" +
        "_(загранпаспорт РФ, виза ЕС/США, резюме и др.)_\n\n" +
        "🎬 **Оживление фото** — 100 руб\n" +
        "_(фото превращается в короткое видео с движением)_\n\n" +
        "🖼 **Шаблоны** — требуется регистрация на сайте\n" +
        "_(стили: ретро, мода, дети, свадьба, маркетплейс и др.)_\n\n" +
        "🌐 Регистрация: [smartphotos.ru](https://smartphotos.ru)",
      { parse_mode: "Markdown", reply_markup: mainInlineMenu }
    );

  const sendInstructions = (chatId) =>
    bot.sendMessage(
      chatId,
      "**📖 Инструкции — как пользоваться ИИ Фото Студия:**\n\n" +
        "1️⃣ Отправьте фото в этот чат\n" +
        "2️⃣ Выберите: **Оживление**, **Шаблоны** или **Фото на документы**\n" +
        "3️⃣ **Оживление** — напишите свой сценарий (например: *Улыбаюсь и обнимаю папу*) или выберите быструю кнопку\n" +
        "4️⃣ **Шаблоны** — выберите стиль из списка (ретро, свадьба, мода, дети и др.)\n" +
        "5️⃣ **Фото на документы** — выберите тип (загранпаспорт РФ, виза ЕС, виза США, резюме)\n\n" +
        "Отправьте фото, чтобы начать.",
      { parse_mode: "Markdown", reply_markup: mainInlineMenu }
    );

  const sendProfile = async (chatId, telegramUserId) => {
    let stats = {};
    try {
      const col = admin.firestore().collection("telegram_users");
      const doc = await col.doc(String(telegramUserId)).get();
      if (doc.exists) stats = doc.data();
    } catch (e) {
      console.error("sendProfile:", e.message);
    }
    const text =
      "**👤 Ваш профиль**\n\n" +
      `🔄 Оживлено фото: ${stats.photosProcessed || 0}\n` +
      `📄 Фото на документы: ${stats.documentsMade || 0}\n` +
      `🖼 Шаблонов применено: ${stats.templatesUsed || 0}`;
    await bot.sendMessage(chatId, text, {
      parse_mode: "Markdown",
      reply_markup: mainInlineMenu,
    });
  };

  bot.on("photo", async (msg) => {
  const chatId = msg.chat.id;
  const from = msg.from || {};
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
      telegramUserId: from.id,
    });
    await bot.sendMessage(chatId, "Фото получено. Что сделать?", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🎬 Оживление (видео)", callback_data: "action_animate" }],
          [{ text: "🖼 Шаблоны (стили)", callback_data: "action_templates" }],
          [{ text: "📄 Фото на документы / резюме", callback_data: "action_documents" }],
        ],
      },
    });
  } catch (e) {
    console.error("Photo handling error:", e);
    bot.sendMessage(chatId, "Не удалось обработать фото. Попробуйте ещё раз.");
  }
  });

  bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  const msgId = query.message.message_id;

  await bot.answerCallbackQuery(query.id);

  if (data === "menu_start") {
    try {
      await bot.deleteMessage(chatId, msgId);
    } catch (_) {}
    await sendWelcome({ chat: { id: chatId }, from: query.from }, true);
    return;
  }
  if (data === "menu_new_photo") {
    try {
      await bot.deleteMessage(chatId, msgId);
    } catch (_) {}
    await bot.sendMessage(chatId, "📷 Отправьте фото в чат.");
    return;
  }
  if (data === "menu_profile") {
    try {
      await bot.deleteMessage(chatId, msgId);
    } catch (_) {}
    await sendProfile(chatId, query.from?.id || 0);
    return;
  }
  if (data === "menu_instructions") {
    try {
      await bot.deleteMessage(chatId, msgId);
    } catch (_) {}
    await sendInstructions(chatId);
    return;
  }
  if (data === "menu_pricing") {
    try {
      await bot.deleteMessage(chatId, msgId);
    } catch (_) {}
    await sendPricing(chatId);
    return;
  }

  try {
    await bot.deleteMessage(chatId, msgId);
  } catch (_) {}

  const state = userState.get(chatId);
  if (!state?.lastPhotoUrl) {
    await bot.sendMessage(chatId, "Сначала отправьте фото.");
    return;
  }
  if (data === "action_animate") {
    state.pendingAction = "animate";
    userState.set(chatId, state);
    await bot.sendMessage(
      chatId,
      "🎬 **Оживление фото**\n\n" +
        "Напишите в чат свой сценарий движения — например:\n" +
        "• *Улыбаюсь и обнимаю папу*\n" +
        "• *Лёгкий ветер в волосах*\n" +
        "• *Камера медленно приближается*\n\n" +
        "Или нажмите быструю кнопку ниже.",
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "😊 Улыбка и объятия", callback_data: "animate_hug" }],
            [{ text: "💨 Ветер в волосах", callback_data: "animate_wind" }],
            [{ text: "🎥 Камера приближается", callback_data: "animate_zoom" }],
            [{ text: "✨ Лёгкое движение", callback_data: "animate_default" }],
          ],
        },
      }
    );
    return;
  }
  if (data === "action_templates") {
    state.pendingAction = "templates";
    userState.set(chatId, state);
    const rows = [];
    for (let i = 0; i < presets.length; i += 2) {
      const row = presets
        .slice(i, i + 2)
        .map((p) => ({ text: p.title, callback_data: `preset_${p.id}` }));
      rows.push(row);
    }
    await bot.sendMessage(chatId, "🖼 Выберите шаблон:", {
      reply_markup: { inline_keyboard: rows },
    });
    return;
  }
  if (data === "action_documents") {
    state.pendingAction = "documents";
    userState.set(chatId, state);
    const rows = documentSpecs.map((d) => [
      { text: `📄 ${d.title}`, callback_data: d.id },
    ]);
    await bot.sendMessage(
      chatId,
      "📄 **Фото на документы**\n\nВыберите тип документа. Фото будет приведено к требованиям (фон, кадр, выражение лица).",
      {
        parse_mode: "Markdown",
        reply_markup: { inline_keyboard: rows },
      }
    );
    return;
  }
  if (data.startsWith("doc_")) {
    const spec = documentSpecs.find((d) => d.id === data);
    if (!spec) {
      await bot.sendMessage(chatId, "Тип документа не найден.");
      return;
    }
    await runDocumentPhoto(chatId, state, spec);
    return;
  }
  if (data.startsWith("animate_")) {
    const promptMap = {
      animate_default:
        "Animate this image with smooth, natural movement. Subtle motion.",
      animate_wind:
        "Gentle wind moving through hair and clothes. Natural, cinematic.",
      animate_zoom:
        "Smooth camera zoom in toward the subject. Cinematic, professional.",
      animate_hug:
        "Person smiling warmly and giving a gentle hug. Heartwarming, natural movement. Cinematic, emotional.",
    };
    const prompt = promptMap[data] || promptMap.animate_default;
    await runAnimate(chatId, state, prompt);
    return;
  }
  if (data.startsWith("preset_")) {
    const presetId = data.replace("preset_", "");
    const preset = presets.find((p) => p.id === presetId);
    if (!preset) {
      await bot.sendMessage(chatId, "Шаблон не найден.");
      return;
    }
    await runTemplate(chatId, state, preset);
  }
  });

  bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = (msg.text || "").trim();
  if (!text || msg.photo || text.startsWith("/")) return;
  const state = userState.get(chatId);
  if (!state || state.pendingAction !== "animate") return;
  state.pendingAction = null;
  userState.set(chatId, state);
  await runAnimate(chatId, state, text);
  });
}

async function runAnimate(chatId, state, prompt) {
  const sent = await bot.sendMessage(
    chatId,
    "⏳ Генерация видео (1–3 мин)..."
  );
  try {
    const videoUrl = await generateVideo(state.lastPhotoUrl, prompt);
    await incrementTelegramUserStat(chatId, "photosProcessed").catch(() => {});
    await bot.deleteMessage(chatId, sent.message_id);
    await bot.sendVideo(chatId, videoUrl, {
      caption: "Готово! Оживление по вашему описанию.",
    });
    sendWhatNextMessage(chatId);
  } catch (e) {
    console.error("Veo error:", e.response?.data || e.message);
    await bot.editMessageText(
      "Ошибка: " +
        (e.response?.data?.error || e.message || "не удалось сгенерировать видео"),
      { chat_id: chatId, message_id: sent.message_id }
    );
  }
}

async function runTemplate(chatId, state, preset) {
  const sent = await bot.sendMessage(
    chatId,
    `⏳ Применяю шаблон «${preset.title}»...`
  );
  try {
    const imageBase64 = await downloadPhotoAsBase64(state.lastPhotoUrl);
    const fullPrompt = `${buildIdentityPrompt()} STYLE/ENVIRONMENT: ${preset.prompt}`;
    const dataUrl = await generateImage(fullPrompt, imageBase64, "1:1");
    const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64, "base64");
    await incrementTelegramUserStat(chatId, "templatesUsed").catch(() => {});
    await bot.deleteMessage(chatId, sent.message_id);
    await bot.sendPhoto(chatId, buffer, { caption: `Шаблон: ${preset.title}` });
    sendWhatNextMessage(chatId);
  } catch (e) {
    console.error("Imagen error:", e.response?.data || e.message);
    await bot.editMessageText(
      "Ошибка: " +
        (e.response?.data?.error || e.message || "не удалось применить шаблон"),
      { chat_id: chatId, message_id: sent.message_id }
    );
  }
}

async function runDocumentPhoto(chatId, state, spec) {
  const sent = await bot.sendMessage(
    chatId,
    `⏳ Готовлю фото для «${spec.title}»...`
  );
  try {
    const imageBase64 = await downloadPhotoAsBase64(state.lastPhotoUrl);
    const fullPrompt = `${buildIdentityPrompt()} ${spec.prompt}`;
    const aspectRatio = spec.aspectRatio || "3:4";
    const dataUrl = await generateImage(fullPrompt, imageBase64, aspectRatio);
    const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64, "base64");
    await incrementTelegramUserStat(chatId, "documentsMade").catch(() => {});
    await bot.deleteMessage(chatId, sent.message_id);
    const caption =
      `📄 ${spec.title}\n` +
      `Размер: ${spec.sizeMm} (${spec.sizePx || ""})\n` +
      (spec.hint ? `${spec.hint}` : "");
    await bot.sendPhoto(chatId, buffer, { caption });
    sendWhatNextMessage(chatId);
  } catch (e) {
    console.error("Document photo error:", e.response?.data || e.message);
    await bot.editMessageText(
      "Ошибка: " +
        (e.response?.data?.error || e.message || "не удалось создать фото на документы"),
      { chat_id: chatId, message_id: sent.message_id }
    );
  }
}

const VERIFY_HTML = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>ИИ Фото Студия Bot</title></head>
<body style="font-family:sans-serif;max-width:520px;margin:2rem auto;padding:1rem;">
  <h1>ИИ Фото Студия — Telegram Bot</h1>
  <p><strong>Верификация связи:</strong> соединение с API установлено.</p>
  <p>Бот готов принимать обновления по webhook.</p>
  <hr/>
  <p><strong>URL для setWebhook:</strong></p>
  <code style="background:#eee;padding:0.2rem 0.4rem;word-break:break-all;">WEBHOOK_URL_PLACEHOLDER</code>
</body>
</html>`;

function getVerifyHtml(webhookUrl) {
  return VERIFY_HTML.replace("WEBHOOK_URL_PLACEHOLDER", webhookUrl);
}

// Обработать /start или /menu вручную и дождаться ответа (для webhook, чтобы Cloud Function не завершалась раньше времени)
async function handleStartOrMenuSync(msg) {
  if (!msg || !msg.chat) return false;
  const text = (msg.text || "").trim();
  if (text !== "/start" && text !== "/menu") return false;
  const sendWelcome = getSendWelcome();
  if (!sendWelcome) return false;
  await sendWelcome(msg, true);
  return true;
}

function getSendWelcome() {
  return typeof global.__telegramSendWelcome === "function"
    ? global.__telegramSendWelcome
    : null;
}

/**
 * HTTP handler: GET — страница верификации, POST — тело от Telegram (JSON update).
 */
async function telegramWebhookHandler(req, res) {
  const method = (req.method || "GET").toUpperCase();

  if (method === "GET") {
    const host = req.get("host") || "smartphotos.ru";
    const proto = req.get("x-forwarded-proto") || "https";
    const webhookUrl = `${proto}://${host}/webhook`;
    res.set("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(getVerifyHtml(webhookUrl));
    return;
  }

  if (method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const runUpdate = async (update) => {
    if (!bot) {
      res.status(500).json({ ok: false, error: "TELEGRAM_BOT_TOKEN not set" });
      return;
    }
    const msg = update?.message;
    const isStartOrMenu =
      msg?.text && (msg.text.trim() === "/start" || msg.text.trim() === "/menu");

    if (isStartOrMenu) {
      try {
        const handled = await handleStartOrMenuSync(msg);
        if (handled) {
          res.status(200).json({ ok: true });
          return;
        }
      } catch (e) {
        console.error("handleStartOrMenuSync error:", e);
        try {
          await bot.sendMessage(
            msg.chat.id,
            "Произошла ошибка. Попробуйте /start ещё раз.",
          );
        } catch (_) {}
        res.status(200).json({ ok: true });
        return;
      }
    }

    try {
      bot.processUpdate(update);
      res.status(200).json({ ok: true });
    } catch (e) {
      console.error("Webhook processUpdate error:", e);
      res.status(200).json({ ok: true });
    }
  };

  const parseAndRun = async (body) => {
    let update;
    if (body && typeof body === "object") {
      update = body;
    } else {
      try {
        update = JSON.parse(body && typeof body === "string" ? body : "{}");
      } catch (e) {
        console.error("Webhook parse error:", e);
        res.status(400).json({ ok: false, error: "Invalid JSON" });
        return;
      }
    }
    if ("update_id" in update || "message" in update || "callback_query" in update) {
      await runUpdate(update);
    } else {
      res.status(200).json({ ok: true });
    }
  };

  if (req.body && typeof req.body === "object" && ("update_id" in req.body || "message" in req.body || "callback_query" in req.body)) {
    await runUpdate(req.body);
    return;
  }

  const raw = req.rawBody || (req.body && typeof req.body === "string" ? req.body : null);
  if (raw) {
    await parseAndRun(raw);
    return;
  }

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", async () => {
    try {
      const update = JSON.parse(body || "{}");
      await runUpdate(update);
    } catch (e) {
      console.error("Webhook parse error:", e);
      res.status(400).json({ ok: false, error: "Invalid JSON" });
    }
  });
}

module.exports = { telegramWebhookHandler, getVerifyHtml };
