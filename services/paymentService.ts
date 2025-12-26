
import { db, firebase } from "../lib/firebase";

// Ваш открытый ключ Альфа-Банка
const ALFA_MERCHANT_KEY = "n0amakmdq847n6b19acb9ps4l6";

/**
 * Интеграция с Альфа-Банком (Merchant API)
 */
export const createPaymentSession = async (
  userId: string,
  userEmail: string,
  planId: string,
  amount: number,
  method: 'card' | 'sbp' = 'card'
): Promise<string> => {
  try {
    // Определяем количество кредитов для передачи в банк (и возврата в Webhook)
    let credits = 100;
    if (planId === 'pro') credits = 500;
    if (planId === 'business') credits = 2000;

    // Эти данные банк вернет нам в Webhook в поле jsonParams
    const jsonParamsObject = {
      email: userEmail,
      userId: userId,
      plan: planId,
      credits: credits
    };

    console.log(`[Alfa-Bank] Инициализация заказа для ${userEmail}. Данные:`, jsonParamsObject);

    // Ссылка на ваш серверный обработчик (Cloud Functions)
    // Именно этот URL вы должны вставить в поле "Ссылка" в личном кабинете Альфа-Банка
    // const webhookUrl = "https://your-region-your-project.cloudfunctions.net/alfaWebhook";

    const returnUrl = encodeURIComponent(`${window.location.origin}?payment=success&plan=${planId}&email=${userEmail}`);
    
    /**
     * РЕАЛЬНЫЙ ВЫЗОВ (через ваш бэкенд):
     * const response = await fetch('/api/alfa/register', { 
     *    method: 'POST', 
     *    body: JSON.stringify({ amount, userEmail, jsonParams: jsonParamsObject }) 
     * });
     * const data = await response.json();
     * return data.formUrl;
     */

    // Для демонстрации возвращаем имитацию перехода
    await new Promise(resolve => setTimeout(resolve, 800));
    return `${window.location.origin}?payment=success&plan=${planId}&email=${userEmail}&method=${method}&mock_alfa=true`;
    
  } catch (error) {
    console.error("Payment registration error:", error);
    throw new Error("Не удалось создать сессию оплаты.");
  }
};
