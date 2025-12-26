import { functions } from "../lib/firebase";

interface CreatePaymentResponse {
  checkoutUrl: string;
}

/**
 * Calls the Firebase Cloud Function to generate a PayOS Checkout URL
 */
export const createPayOSPayment = async (
  userId: string,
  planId: string,
  amount: number
): Promise<string> => {
  try {
    /* 
    // REAL IMPLEMENTATION:
    if (!functions) throw new Error("Firebase Functions not initialized");
    // In v8, using httpsCallable via the functions instance
    const createPaymentLink = functions.httpsCallable('createPaymentLink');
    const result = await createPaymentLink({
      userId,
      planId,
      amount,
      returnUrl: window.location.origin + "?payment=success",
      cancelUrl: window.location.origin + "?payment=cancelled"
    });
    return (result.data as CreatePaymentResponse).checkoutUrl;
    */

    // --- SIMULATION FOR DEMO ---
    console.log(`[PayOS] Creating payment for User ${userId}, Plan ${planId}, Amount ${amount}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockCheckoutUrl = `${window.location.origin}?payment=success&plan=${planId}`;
    return mockCheckoutUrl;

  } catch (error) {
    console.error("PayOS Error:", error);
    throw new Error("Не удалось создать ссылку на оплату. Пожалуйста, попробуйте еще раз.");
  }
};
