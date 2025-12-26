
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

// ТОКЕН ИЗ ВАШЕЙ ПАНЕЛИ АЛЬФА-БАНКА (сгенерируйте и вставьте сюда)
const ALFA_CALLBACK_TOKEN = "ВАШ_СЕКРЕТНЫЙ_CALLBACK_TOKEN";

/**
 * Вебхук для приема уведомлений от Альфа-Банка
 * URL: https://[ВАШ_РЕГИОН]-[ВАШ_ПРОЕКТ].cloudfunctions.net/alfaWebhook
 */
exports.alfaWebhook = functions.https.onRequest(async (req, res) => {
    // 1. Проверяем метод
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    // 2. Логируем входящий запрос для отладки (в консоли Firebase)
    console.log('Incoming Alfa Webhook:', JSON.stringify(req.body));

    const { status, jsonParams, checksum, orderNumber } = req.body;

    // 3. Базовая проверка безопасности (если банк присылает контрольную сумму)
    // В простейшем случае проверяем наличие обязательных параметров
    if (!jsonParams || status != "1") { 
        console.log('Payment not successful or missing params');
        return res.status(200).send('OK'); // Возвращаем 200, чтобы банк не повторял запрос
    }

    try {
        // 4. Парсим метаданные, которые мы отправили при создании платежа
        const params = JSON.parse(jsonParams);
        const userEmail = params.email;
        const planId = params.plan;
        const creditsToAdd = parseInt(params.credits) || 0;

        if (!userEmail) throw new Error('Email not found in jsonParams');

        // 5. Ищем пользователя в Firestore по Email
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', userEmail).limit(1).get();

        if (snapshot.empty) {
            console.error(`User with email ${userEmail} not found in database`);
            return res.status(200).send('User not found but acknowledged');
        }

        const userDoc = snapshot.docs[0];
        const userId = userDoc.id;

        // 6. Атомарно начисляем кредиты и обновляем тариф
        const batch = db.batch();
        const userRef = usersRef.doc(userId);

        batch.update(userRef, {
            credits: admin.firestore.FieldValue.increment(creditsToAdd),
            subscriptionTier: planId,
            subscriptionStatus: 'active',
            lastPaymentDate: admin.firestore.Timestamp.now(),
            lastOrderNumber: orderNumber
        });

        // Сохраняем лог транзакции
        const transRef = db.collection('transactions').doc();
        batch.set(transRef, {
            userId: userId,
            email: userEmail,
            amount: creditsToAdd,
            plan: planId,
            orderNumber: orderNumber,
            timestamp: admin.firestore.Timestamp.now(),
            status: 'completed'
        });

        await batch.commit();

        console.log(`Successfully credited ${creditsToAdd} credits to ${userEmail}`);
        return res.status(200).send('OK');

    } catch (error) {
        console.error('Webhook processing error:', error);
        return res.status(500).send('Internal Server Error');
    }
});
