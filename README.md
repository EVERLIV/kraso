<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1zH5zoOc9hGF2oqKUlsrZswA5nlnu8Phu

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Проверка начисления тарифа после оплаты (Альфа-Банк)

**Без реальной оплаты** — симуляция callback банка:

```bash
node scripts/test-alfa-callback.js [email] [plan]
# Пример: node scripts/test-alfa-callback.js hoaandrey@gmail.ru business
```

Скрипт отправляет на ваш Cloud Function те же данные, что присылает Альфа при успешной оплате. Ответ `OK` и статус 200 означают, что кредиты и тариф должны быть начислены. Проверьте: войдите в приложение под указанным email и посмотрите баланс и тариф.

**С реальной оплатой:** после оплаты в Альфа-Банке смотреть логи функции: Firebase Console → Functions → alfaPaymentCallback → Логи. При успехе там будет запись о начислении кредитов.
