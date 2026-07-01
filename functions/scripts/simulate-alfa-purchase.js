/**
 * Симуляция покупки тарифа Business через «Альфа-Банк» для теста.
 * Начисляет кредиты и выставляет тариф без реального платежа.
 *
 * Запуск из папки functions:
 *   node scripts/simulate-alfa-purchase.js [email] [путь_к_ключу.json]
 *
 * Примеры:
 *   node scripts/simulate-alfa-purchase.js hoaandrey@gmail.ru
 *   node scripts/simulate-alfa-purchase.js hoaandrey@gmail.ru C:\keys\firebase-key.json
 *   node scripts/simulate-alfa-purchase.js hoaandrey@gmail.ru ./firebase-key.json
 */

const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

// Второй аргумент — путь к JSON ключу сервисного аккаунта (опционально)
const keyPathArg = process.argv[3];
if (keyPathArg && fs.existsSync(path.resolve(keyPathArg))) {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(keyPathArg);
}

// Инициализация (GOOGLE_APPLICATION_CREDENTIALS или путь в argv[3])
if (!admin.apps.length) {
  let options = {};
  const firebasercPath = path.resolve(__dirname, "../../.firebaserc");
  if (fs.existsSync(firebasercPath)) {
    const firebaserc = JSON.parse(fs.readFileSync(firebasercPath, "utf8"));
    const projectId = firebaserc.projects?.default;
    if (projectId) options.projectId = projectId;
  }
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const keyPath = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    if (fs.existsSync(keyPath)) {
      options.credential = admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8")));
    }
  }
  admin.initializeApp(options);
}

const db = admin.firestore();

// Тариф Business: как в App.tsx / PricingModal
const BUSINESS_CREDITS = 4000;
const TIER = "business";

async function simulateAlfaPurchase(email) {
  const userEmail = (email || "hoaandrey@gmail.ru").trim();
  if (!userEmail) {
    console.error("❌ Укажите email: node scripts/simulate-alfa-purchase.js <email>");
    process.exit(1);
  }

  try {
    const userRecord = await admin.auth().getUserByEmail(userEmail);
    const uid = userRecord.uid;
    console.log(`✅ Пользователь найден: ${userEmail} (UID: ${uid})\n`);

    const userRef = db.collection("users").doc(uid);
    const doc = await userRef.get();

    const subscriptionEndDate = new Date();
    subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 30);

    const update = {
      credits: admin.firestore.FieldValue.increment(BUSINESS_CREDITS),
      subscriptionTier: TIER,
      subscriptionStatus: "active",
      subscriptionEndDate: admin.firestore.Timestamp.fromDate(subscriptionEndDate),
      lastPaymentDate: admin.firestore.FieldValue.serverTimestamp(),
      lastPaymentPlan: TIER,
      lastPaymentId: `simulate-alfa-${Date.now()}`,
      lastPaymentAmount: 699, // как при оплате Business в Альфа
    };

    if (!doc.exists) {
      await userRef.set({
        uid,
        email: userEmail,
        credits: BUSINESS_CREDITS,
        subscriptionTier: TIER,
        subscriptionStatus: "active",
        subscriptionEndDate: update.subscriptionEndDate,
        lastPaymentDate: update.lastPaymentDate,
        lastPaymentPlan: TIER,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log("📄 Создан документ пользователя в Firestore.");
    } else {
      await userRef.update(update);
    }

    const after = await userRef.get();
    const data = after.data();
    console.log("📊 Результат (симуляция покупки Business):");
    console.log("   Кредиты:     ", data.credits);
    console.log("   Тариф:      ", data.subscriptionTier);
    console.log("   Статус:     ", data.subscriptionStatus);
    console.log("   Действует до:", data.subscriptionEndDate?.toDate?.()?.toLocaleDateString?.("ru-RU"));
    console.log("\n✅ Готово. Аккаунт hoaandrey@gmail.ru переведён на тариф Business (без реальной оплаты).");
    process.exit(0);
  } catch (err) {
    if (err.code === "auth/user-not-found") {
      console.error(`❌ Пользователь с email ${userEmail} не найден в Firebase Auth. Сначала зарегистрируйтесь в приложении.`);
    } else if (err.message && err.message.includes("credentials")) {
      console.error("❌ Нет доступа к Firebase. Укажите ключ сервисного аккаунта одним из способов:");
      console.error("");
      console.error("   1) Передать путь к ключу третьим аргументом:");
      console.error("      node scripts/simulate-alfa-purchase.js hoaandrey@gmail.ru путь\\к\\ключу.json");
      console.error("");
      console.error("   2) Переменная окружения:");
      console.error("      set GOOGLE_APPLICATION_CREDENTIALS=путь\\к\\ключу.json   (Windows)");
      console.error("      export GOOGLE_APPLICATION_CREDENTIALS=путь/к/ключу.json (Linux/Mac)");
      console.error("");
      console.error("   Ключ: Firebase Console → Настройки проекта → Учётные записи служб → Создать ключ.");
    } else {
      console.error("❌ Ошибка:", err.message);
    }
    process.exit(1);
  }
}

const email = process.argv[2] || "hoaandrey@gmail.ru";
console.log(`🔧 Симуляция покупки тарифа Business (Альфа-Банк)\n   Email: ${email}\n`);
simulateAlfaPurchase(email);
