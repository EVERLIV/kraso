/**
 * Проверка начисления тарифа после «оплаты» в Альфа-Банк.
 * Отправляет на ваш callback те же данные, что мог бы прислать банк (без реальной оплаты).
 *
 * Запуск из корня проекта:
 *   node scripts/test-alfa-callback.js [email] [plan]
 *   node scripts/test-alfa-callback.js buran.050872@gmail.com business
 *
 * Проверить декодирование %40 -> @ (как присылает Альфа):
 *   node scripts/test-alfa-callback.js buran.050872@gmail.com business --encoded
 *
 * URL callback: ALFA_CALLBACK_URL или по умолчанию из деплоя.
 */

import https from "node:https";
import http from "node:http";

const DEFAULT_CALLBACK_URL =
  process.env.ALFA_CALLBACK_URL ||
  "https://alfapaymentcallback-c4vb4ahytq-uc.a.run.app";

// Суммы, которые принимает callback (index.js): 99/299/699 или в копейках
const PLANS = {
  creator: { amount: 99, credits: 100 },
  pro: { amount: 299, credits: 500 },
  business: { amount: 699, credits: 2000 },
};

async function testCallback(email, plan, useEncodedEmail) {
  const planLower = (plan || "business").toLowerCase();
  const planConfig = PLANS[planLower] || PLANS.business;
  let userEmail = (email || "hoaandrey@gmail.ru").trim();

  // Опция --encoded: отправить email как %40 (симуляция Альфа), чтобы проверить декодирование
  let emailForBody = userEmail;
  if (useEncodedEmail && userEmail.includes("@")) {
    emailForBody = userEmail.replace("@", "%40");
    console.log("   (отправляем email в виде %40 для проверки декодирования)");
  }

  const body = new URLSearchParams({
    email: emailForBody,
    emailaccount: emailForBody,
    status: "success",
    plan: planLower,
    amount: String(planConfig.amount),
    orderNumber: `test-${Date.now()}`,
  }).toString();

  const url = new URL(DEFAULT_CALLBACK_URL);
  const options = {
    hostname: url.hostname,
    port: url.port || (url.protocol === "https:" ? 443 : 80),
    path: url.pathname + url.search,
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(body),
    },
  };

  console.log("🔧 Тест callback Альфа-Банк (симуляция успешной оплаты)\n");
  console.log("   URL:    ", DEFAULT_CALLBACK_URL);
  console.log("   Email:  ", userEmail);
  console.log("   Тариф:  ", planLower);
  console.log("   Сумма:  ", planConfig.amount, "₽");
  console.log("   Ожидаемо кредитов:", planConfig.credits);
  console.log("");

  return new Promise((resolve, reject) => {
    const client = url.protocol === "https:" ? https : http;
    const req = client.request(options, (res) => {
      let data = "";
      res.on("data", (ch) => (data += ch));
      res.on("end", () => {
        if (res.statusCode === 200 && data === "OK") {
          console.log("✅ Ответ: OK — начисление должно было пройти.");
          console.log("   Проверьте в приложении: войдите как", userEmail, "и посмотрите баланс/тариф.");
        } else {
          console.log("⚠️ Ответ:", res.statusCode, data || "(пусто)");
          if (res.statusCode === 500) {
            console.log("   При 500 проверьте: Firebase Console → Functions → alfaPaymentCallback → Логи. Часто: пользователь с таким email не найден в Auth — сначала зарегистрируйтесь в приложении.");
          }
          if (res.statusCode === 404 && data && data.includes("User not found")) {
            console.log("   Пользователь не найден в Firebase Auth. Зарегистрируйтесь в приложении под этим email.");
          }
        }
        resolve();
      });
    });
    req.on("error", (e) => {
      console.error("❌ Ошибка запроса:", e.message);
      reject(e);
    });
    req.write(body);
    req.end();
  });
}

const args = process.argv.slice(2).filter((a) => a !== "--encoded");
const useEncoded = process.argv.includes("--encoded");
const email = args[0] || "hoaandrey@gmail.ru";
const plan = args[1] || "business";

testCallback(email, plan, useEncoded).then(
  () => process.exit(0),
  () => process.exit(1)
);
