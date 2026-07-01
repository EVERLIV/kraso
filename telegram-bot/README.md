# RU-PHOTO Telegram Bot

Телеграм-бот на базе проекта RU-PHOTO: приём фото в чат, **оживление** (видео через Veo 3.1) и **шаблоны** (стили через Google Imagen) с inline-меню.

## Возможности

- **Фото в чат** — пользователь отправляет фото, бот предлагает: Оживление или Шаблоны.
- **Оживление** — генерация короткого видео по фото (FAL Veo 3.1): можно ввести описание движения или выбрать быстрые кнопки (лёгкое движение, ветер в волосах, камера приближается).
- **Шаблоны** — inline-меню с пресетами (ретро, свадьба, маркетплейс, дети, мода и т.д.); по выбору шаблона к фото применяется стиль через Google Imagen.

## Установка

1. Создайте бота в Telegram через [@BotFather](https://t.me/BotFather), получите токен.
2. В папке `telegram-bot` создайте файл `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

3. В `.env` укажите:

- `TELEGRAM_BOT_TOKEN` — токен от BotFather.
- `FAL_VEO_FUNCTION_URL` — URL Cloud Function для видео (по умолчанию подставлен из проекта).
- `GOOGLE_IMAGE_FUNCTION_URL` — URL Cloud Function для изображений (по умолчанию подставлен из проекта).

4. Установите зависимости и запустите:

```bash
cd telegram-bot
npm install
npm start
```

## Структура

- `index.js` — логика бота (обработка фото, callback'и, вызовы Veo и Imagen).
- `presets.json` — список шаблонов для inline-меню (id, title, category, prompt). Можно расширять, синхронизируя с пресетами из веб-приложения.

## API

Бот использует те же Cloud Functions, что и веб-приложение:

- **Veo** — POST `FAL_VEO_FUNCTION_URL` с `prompt`, `image_urls` (массив URL; для фото из Telegram подставляется URL файла Telegram).
- **Imagen** — POST `GOOGLE_IMAGE_FUNCTION_URL` с `prompt`, `imageBase64`, `aspectRatio`, `intensity`, `modelId`.

Кредиты/авторизация в текущей версии бота не проверяются; при необходимости их можно добавить (например, по `telegram_user_id` в вашей БД).

---

## Webhook и верификация связи (URL для API)

Чтобы Telegram отправлял обновления на ваш сервер по HTTPS (вместо polling), нужен **публичный URL** и страница верификации.

### 1. Настройка .env

В `telegram-bot/.env` задайте:

- **`PUBLIC_URL`** — ваш публичный HTTPS-адрес (без слэша в конце).  
  Примеры: `https://your-domain.com`, `https://abc123.ngrok-free.app`
- При необходимости: **`PORT`** (по умолчанию 3000), **`WEBHOOK_PATH`** (по умолчанию `/webhook`).

### 2. Запуск бота

```bash
cd telegram-bot
npm start
```

При запуске бот выведет в консоль:

- **Ссылку для верификации связи** — откройте её в браузере, чтобы убедиться, что сервер доступен.
- **URL для setWebhook** — этот адрес нужно ввести в Telegram как webhook (см. ниже).

### 3. Куда ввести URL для верификации / setWebhook

- **Проверка связи:** откройте в браузере ссылку верификации (например `https://your-domain.com/` или `https://your-domain.com/verify`). Должна открыться страница «RU-PHOTO Telegram Bot — Верификация связи: соединение с API установлено». На этой же странице указан **URL для setWebhook**.
- **Установка webhook в Telegram:**  
  Подставьте свой токен и URL в запрос (в браузере или через curl):

  ```
  https://api.telegram.org/bot<ВАШ_ТОКЕН>/setWebhook?url=<URL_ДЛЯ_SETWEBHOOK>
  ```

  Пример: если `PUBLIC_URL=https://mybot.example.com` и `WEBHOOK_PATH=/webhook`, то URL для setWebhook = `https://mybot.example.com/webhook`.

После успешного `setWebhook` Telegram будет отправлять обновления на этот URL, и бот перестанет использовать polling (если был запущен с `PUBLIC_URL`).

---

## Деплой как Cloud Function (smartphotos.ru)

Чтобы webhook работал по адресу `https://smartphotos.ru/webhook`, бот вынесен в Firebase Cloud Function и привязан к Hosting.

1. **Деплой функции и Hosting** (из корня проекта):
   ```bash
   firebase deploy --only "functions,hosting"
   ```

2. **Переменная окружения для бота:** в Google Cloud Console откройте **Cloud Functions** → функция **telegramWebhook** → **Edit** → **Runtime, build, connections and security** → **Environment variables**. Добавьте:
   - `TELEGRAM_BOT_TOKEN` = ваш токен от BotFather.

   Либо через Firebase Config (перед деплоем):
   ```bash
   firebase functions:config:set telegram.bot_token="ВАШ_ТОКЕН"
   firebase deploy --only "functions"
   ```

3. **Webhook уже установлен** — Telegram шлёт запросы на `https://smartphotos.ru/webhook`. После деплоя запросы будет обрабатывать Cloud Function, 404 пропадёт.
