# Совпадение настроек Альфа-Банк и системы

## Настройки кабинета Альфа-Банка (что выставить в ЛК)

Раздел **Callback уведомления**:

| Поле | Значение |
|------|----------|
| **Продавец** | SMARTPHOTOS.RU |
| **Callback уведомления** | Включены |
| **Тип callback** | Динамический (или Статический — оба поддерживаются) |
| **Callback метод** | POST (рекомендуется; GET тоже поддерживается) |
| **Ссылка** | `https://alfapaymentcallback-c4vb4ahytq-uc.a.run.app?token=nruhck3sosbnimua7jjrf365nl` |
| **Тип подписи** | Симметричный |
| **Callback токен** | `nruhck3sosbnimua7jjrf365nl` |
| **Операции** | Включить только **«Успешное списание»** (остальные можно выключить) |

**Дополнительные параметры** (добавить по одному):

- `amount`
- `paymentState`
- `amountFormatted`
- `date`
- `paymentDate`
- `processingId`
- `approvedAmount`
- `payerEmail`
- `emailaccount`

Сохранить настройки. После успешного списания банк будет вызывать указанную ссылку с этими параметрами; в ссылке оплаты обязательно передавать **emailaccount** (email пользователя).

---

## Тарифы в ЛК Альфа-Банка (суммы и ID ссылок)

| Тариф     | ID ссылки (/sc/...)   | Сумма (RUR) | Кредиты в системе |
|-----------|------------------------|-------------|--------------------|
| Creator   | QOxMaMqZyfWeROnc       | 245,00      | 100                |
| Pro       | PqegJZOvMScMFvMB       | 450,00      | 500                |
| Business  | cXuYlpqNltQsSShd       | 845,00      | 2000               |

Callback определяет тариф по ID ссылки (если Альфа присылает formId/linkId) или по сумме платежа.

## Чеклист: что должно совпадать

| Параметр в Альфа-Банке | Значение | Наша система |
|------------------------|----------|--------------|
| **Продавец** | SMARTPHOTOS.RU | — |
| **URL callback** | `https://alfapaymentcallback-c4vb4ahytq-uc.a.run.app?token=nruhck3sosbnimua7jjrf365nl` | ✅ Совпадает |
| **Метод** | POST или GET | ✅ Оба: данные из body (POST) и из query (GET) |
| **Токен** | nruhck3sosbnimua7jjrf365nl | ✅ Задать в Firebase (см. ниже) |
| **Доп. параметры** | amount, paymentState, amountFormatted, date, paymentDate, processingId, approvedAmount, payerEmail, **emailaccount** | ✅ Все обрабатываются |
| **Операция** | Только «Успешное списание» | ✅ Начисление только при успешном списании |

## Как обрабатываются поля от Альфа-Банка

Используются **только** те доп. параметры, что настроены в ЛК Альфа-Банка:

| Параметр в callback | Как используется |
|---------------------|-------------------|
| **emailaccount** | Email пользователя для начисления (приоритет). Обязательно передавать в ссылке оплаты. |
| **payerEmail** | Запасной источник email, если нет emailaccount. |
| **amount**, **approvedAmount**, **amountFormatted** | Сумма платежа; тариф по сумме: 245 → Creator, 450 → Pro, 845 → Business (в копейках: 24500, 45000, 84500). |
| **paymentState** | Успех платежа (payment_deposited, deposited и др.) — только тогда начисляем. |
| **processingId** | Номер заказа; при отсутствии email — поиск в pendingPayments. |
| **date**, **paymentDate** | В callback приходят, в логике начисления не используются. |

Тариф дополнительно определяется по **сумме** (245/450/845 ₽) или по **ID ссылки** (/sc/...), если Альфа пришлёт formId/linkId. Поле **plan** в доп. параметрах в Альфа не настроено — тариф берётся из суммы или ссылки.

**Формат Альфа-Банка:** доп. параметры могут приходить как `orderParams.<ADDITIONAL_PARAM>` (например `orderParams.emailaccount`, `orderParams.plan`). В коде обрабатываются и плоские поля (`emailaccount`, `amount`), и вложенный объект `orderParams`, и ключи вида `orderParams.emailaccount`.

## Обязательная настройка: токен callback

В ЛК Альфа-Банка указан **Callback токен**: `nruhck3sosbnimua7jjrf365nl` (в URL: `?token=nruhck3sosbnimua7jjrf365nl`).

Чтобы система принимала запросы от Альфа-Банка, задайте **тот же токен** одним из способов.

**Вариант 1 — через Firebase CLI (рекомендуется):**

```bash
firebase functions:config:set alfa.callback_token="nruhck3sosbnimua7jjrf365nl"
```

Затем задеплойте функции:

```bash
npm run deploy
# или
firebase deploy --only functions
```

**Вариант 2 — через переменную окружения (Google Cloud):**

1. [Google Cloud Console](https://console.cloud.google.com) → ваш проект → **Cloud Run** → сервис **alfaPaymentCallback** (или через Firebase → Functions → alfaPaymentCallback → детали).
2. **Edit & deploy new revision** → вкладка **Variables & Secrets** → добавьте переменную:
   - Имя: `ALFA_CALLBACK_TOKEN`
   - Значение: `nruhck3sosbnimua7jjrf365nl`
3. Сохраните и задеплойте ревизию.

Код проверяет сначала `ALFA_CALLBACK_TOKEN`, затем `alfa.callback_token` из конфига. Если токен не задан или не совпадает с Альфа-Банком, callback вернёт **403 Invalid token** и начисление не произойдёт.

## Ошибка: «No email found in callback payload»

Если в логах callback приходит эта ошибка, Альфа-Банк **не присылает** в callback поле с email (например, `payerEmail`). В теле запроса приходят только: amount, paymentState, processingId, orderNumber, mdOrder и т.д., без email.

**Что сделать в ЛК Альфа-Банка:**

1. Откройте настройки **Callback уведомления**.
2. В блоке **Дополнительные параметры** убедитесь, что добавлен параметр **payerEmail** (или **email**).
3. Укажите, откуда брать значение: из параметров ссылки оплаты. Наша ссылка при редиректе на Альфу передаёт `email=...` в URL (например: `.../sc/QOxMaMqZyfWeROnc?email=user@mail.com&...`). В ЛК Альфа нужно привязать доп. параметр callback к этому параметру ссылки, чтобы банк подставлял email плательщика в уведомление.
4. Сохраните настройки и проверьте платёж ещё раз.

После этого при успешном списании в callback будет приходить `payerEmail`, и начисление пройдёт.

## Проверка работы

1. **Без реальной оплаты** (симуляция):
   ```bash
   node scripts/test-alfa-callback.js hoaandrey@gmail.com business
   ```
   Ответ `200 OK` — начисление прошло.

2. **Реальная оплата**: после успешного списания в Альфа-Банке проверьте логи:
   - Firebase Console → Functions → **alfaPaymentCallback** → Логи.
   - Должна быть запись «Successfully credited X credits to …».

3. В приложении под тем же email проверьте баланс кредитов и тариф.
