import { db, firebase, functions } from "../lib/firebase";

/**
 * Интеграция с Альфа-Банком.
 * Callback-токен задаётся в Firebase: firebase functions:config:set alfa.callback_token="ВАШ_ТОКЕН"
 */
export const createPaymentSession = async (
  userId: string,
  userEmail: string,
  planId: string,
  amount: number
): Promise<string> => {
  try {
    const email = (userEmail || "").trim();
    if (!email) throw new Error("Email обязателен для оплаты.");

    // Регистрируем ожидающий платёж: callback сможет взять email по orderNumber, если Альфа не пришлёт email
    let orderId: string | null = null;
    if (functions) {
      try {
        const register = functions.httpsCallable("registerAlfaPendingPayment");
        const res = await register({ email, plan: planId });
        orderId = (res.data as { orderId?: string })?.orderId || null;
      } catch (e) {
        console.warn("[Alfa] registerAlfaPendingPayment failed, callback may need email in payload", e);
      }
    }

    // Динамическая ссылка: передаём emailaccount и plan в URL — Альфа вернёт их в callback
    const successReturnUrl = `${window.location.origin}?payment=success&plan=${planId}&email=${encodeURIComponent(email)}`;
    const returnUrlEnc = encodeURIComponent(successReturnUrl);
    const returnParams = `&returnUrl=${returnUrlEnc}&successUrl=${returnUrlEnc}`;
    const emailaccountParam = `emailaccount=${encodeURIComponent(email)}`;
    const planParam = `plan=${encodeURIComponent(planId)}`;
    const customParams = `${planParam}${orderId ? `&orderId=${encodeURIComponent(orderId)}` : ""}`;
    const linkParams = `${emailaccountParam}&${customParams}${returnParams}`;

    if (planId === "creator") {
      return `https://payment.alfabank.ru/sc/QOxMaMqZyfWeROnc?${linkParams}`;
    }
    if (planId === "pro") {
      return `https://payment.alfabank.ru/sc/PqegJZOvMScMFvMB?${linkParams}`;
    }
    if (planId === "business") {
      return `https://payment.alfabank.ru/sc/cXuYIpqNItQsSShd?${linkParams}`;
    }

    return `${window.location.origin}?payment=success&plan=${planId}&email=${email}&mock_alfa=true`;
  } catch (error) {
    console.error("Payment registration error:", error);
    throw new Error("Не удалось создать сессию оплаты.");
  }
};
