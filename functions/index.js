
const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Инициализация Admin SDK (без параметров использует конфиг окружения Firebase)
admin.initializeApp();

const db = admin.firestore();

/**
 * Вебхук для приема уведомлений об оплате от Альфа-Банка.
 * Настраивается в Личном Кабинете Мерчанта Альфа-Банка.
 */
exports.alfaWebhook = functions.https.onRequest(async (req, res) => {
    // 1. Проверка метода (банк отправляет POST)
    if (req.method !== 'POST') {
        functions.logger.warn(`Method ${req.method} not allowed for webhook`);
        return res.status(405).send('Method Not Allowed');
    }

    // 2. Логирование входящих данных для отладки
    functions.logger.info('Alfa Webhook Received', { body: req.body });

    const { status, jsonParams, orderNumber, checksum } = req.body;

    // 3. Базовая валидация: статус "1" означает успешный платеж
    if (status !== "1" && status !== 1) {
        functions.logger.info(`Payment status is not successful: ${status}. Order: ${orderNumber}`);
        return res.status(200).send('OK'); 
    }

    if (!jsonParams) {
        functions.logger.error('Missing jsonParams in request');
        return res.status(400).send('Bad Request: Missing metadata');
    }

    try {
        // 4. Парсим метаданные (Email, кредиты)
        const params = JSON.parse(jsonParams);
        const userEmail = params.email;
        const creditsToAdd = parseInt(params.credits) || 0;
        const planId = params.plan || 'creator';

        if (!userEmail) {
            throw new Error('User email not found in jsonParams');
        }

        // 5. Поиск пользователя по Email в Firestore
        const usersRef = db.collection('users');
        const userQuery = await usersRef.where('email', '==', userEmail).limit(1).get();

        if (userQuery.empty) {
            functions.logger.error(`User ${userEmail} not found. Manual intervention required for order ${orderNumber}`);
            // Возвращаем 200, чтобы банк не слал повторы, но логируем критическую ошибку
            return res.status(200).send('User not found');
        }

        const userDoc = userQuery.docs[0];
        const userId = userDoc.id;

        // 6. Атомарное обновление данных через Batch
        const batch = db.batch();
        const userRef = usersRef.doc(userId);

        // Начисляем кредиты и меняем тариф
        batch.update(userRef, {
            credits: admin.firestore.FieldValue.increment(creditsToAdd),
            subscriptionTier: planId,
            subscriptionStatus: 'active',
            lastPaymentDate: admin.firestore.Timestamp.now(),
            updatedAt: admin.firestore.Timestamp.now()
        });

        // Создаем запись в истории транзакций
        const transactionRef = db.collection('transactions').doc();
        batch.set(transactionRef, {
            userId: userId,
            email: userEmail,
            credits: creditsToAdd,
            plan: planId,
            orderNumber: orderNumber,
            bank: 'Alfa-Bank',
            timestamp: admin.firestore.Timestamp.now(),
            status: 'success'
        });

        await batch.commit();

        functions.logger.info(`Successfully added ${creditsToAdd} credits to ${userEmail} (Order: ${orderNumber})`);
        
        // 7. Ответ банку (обязательно 200 OK)
        return res.status(200).send('OK');

    } catch (error) {
        functions.logger.error('Webhook processing failed', { error: error.message, stack: error.stack });
        // В случае ошибки парсинга или БД возвращаем 500, чтобы банк мог попробовать позже
        return res.status(500).send('Internal Server Error');
    }
});
