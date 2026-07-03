/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const { setGlobalOptions } = require("firebase-functions");
const { onRequest } = require("firebase-functions/https");
const logger = require("firebase-functions/logger");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

const admin = require("firebase-admin");
admin.initializeApp();

const { telegramWebhookHandler } = require("./telegramWebhook");
const { generateTemplateImageHandler, generateTemplateBatchHandler } = require("./generateTemplateImage");
const { generateStudioImageHandler } = require("./generateStudioImage");
const { enhancePromptHandler } = require("./enhancePrompt");

exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

exports.telegramWebhook = onRequest(telegramWebhookHandler);

exports.generateTemplateImage = generateTemplateImageHandler;
exports.generateTemplateBatch = generateTemplateBatchHandler;
exports.generateStudioImage = generateStudioImageHandler;
exports.enhancePrompt = enhancePromptHandler;

/**
 * Google Imagen / Gemini image generation (Nano Banana).
 * Body: prompt, aspectRatio, imageBase64?, intensity?, modelId?, negativePrompt?, parameters?
 * Returns: { image: { base64, mimeType } }
 */
exports.generateGoogleImage = onRequest({ timeoutSeconds: 120 }, async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    logger.error("generateGoogleImage: GEMINI_API_KEY not set");
    res.status(500).json({ error: "GEMINI_API_KEY not configured" });
    return;
  }

  const { prompt, aspectRatio = "1:1", imageBase64, mimeType, referenceImages, intensity = 50, modelId = "gemini-2.5-flash-image", quality } = req.body || {};
  if (!prompt || typeof prompt !== "string") {
    res.status(400).json({ error: "Missing or invalid prompt" });
    return;
  }

  try {
    const { GoogleGenAI } = require("@google/genai");
    const ai = new GoogleGenAI({ apiKey });

    const contents = [];
    contents.push({ text: prompt });

    const images = Array.isArray(referenceImages) && referenceImages.length > 0
      ? referenceImages
      : imageBase64
        ? [{ data: imageBase64, mimeType: mimeType || "image/jpeg" }]
        : [];

    for (const img of images) {
      if (img?.data && typeof img.data === "string") {
        contents.push({
          inlineData: {
            mimeType: img.mimeType || "image/jpeg",
            data: img.data,
          },
        });
      }
    }

    const allowedRatios = ["1:1", "16:9", "9:16", "4:3", "3:4", "4:5", "5:4", "2:3", "3:2", "21:9"];
    const safeRatio = allowedRatios.includes(String(aspectRatio)) ? aspectRatio : "1:1";
    const imageConfig = { aspectRatio: safeRatio };
    if (quality === "4K" || quality === "2K" || quality === "1K") {
      imageConfig.imageSize = quality;
    }
    const config = {
      responseModalities: ["TEXT", "IMAGE"],
      imageConfig,
    };

    const modelName = (modelId === "gemini-3-pro-image-preview") ? "gemini-3-pro-image-preview" : "gemini-2.5-flash-image";
    const response = await ai.models.generateContent({
      model: modelName,
      contents,
      config,
    });

    const parts = response.candidates?.[0]?.content?.parts || [];
    let base64 = null;
    let mimeType = "image/png";

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        base64 = part.inlineData.data;
        mimeType = part.inlineData.mimeType || mimeType;
        break;
      }
    }

    if (!base64) {
      logger.warn("generateGoogleImage: no image in response", { partCount: parts.length });
      res.status(500).json({ error: "Model did not return an image" });
      return;
    }

    res.status(200).json({ image: { base64, mimeType } });
  } catch (err) {
    logger.error("generateGoogleImage error", err);
    const message = err.message || String(err);
    res.status(500).json({ error: message });
  }
});

exports.alfaPaymentCallback = onRequest(async (req, res) => {
  try {
    const { token } = req.query;
    const { orderNumber, status, amount, email } = req.body;

    // Log the incoming request for debugging
    logger.info("Alfa Callback Received", {
      query: req.query,
      body: req.body,
      headers: req.headers
    });

    const SECRET_TOKEN = "YOUR_SECRET_TOKEN_FROM_ALFA";
    if (token && token !== SECRET_TOKEN && SECRET_TOKEN !== "YOUR_SECRET_TOKEN_FROM_ALFA") {
      // Only block if a real token is actually configured in the code
      logger.warn("Invalid token provided:", token);
      res.status(403).send("Invalid token");
      return;
    }

    // Checking status. 
    // Alfa Bank often sends '0' (number) for success or 'approved'/'paid' strings.
    // We treat 0, '0', 'success', 'paid', 'approved' as valid.
    const isSuccess = status === 0 || status === '0' || status === 'success' || status === 'paid' || status === 'approved';

    if (!isSuccess) {
      logger.info("Ignoring non-success status:", status);
      res.status(200).send("Ignored status");
      return;
    }

    // Try to find email in various places (Alfa присылает emailaccount, payerEmail и т.д., часто URL-encoded: %40 вместо @)
    let userEmail = email
      || req.body.emailaccount || req.body.emailAccount
      || req.body.payerEmail || req.body.payer_email
      || req.body.cust_email || req.body.metadata?.email
      || (req.body.data && req.body.data.email);
    if (req.query && (req.query.emailaccount || req.query.email)) {
      userEmail = userEmail || req.query.emailaccount || req.query.email;
    }
    userEmail = (userEmail != null && userEmail !== "") ? String(userEmail).trim() : "";
    // Нормализация: декодируем %40 -> @ (иногда приходит буквально "buran.050872%40gmail.com")
    if (userEmail) {
      try {
        const decoded = decodeURIComponent(userEmail);
        if (decoded && decoded.includes("@")) userEmail = decoded;
      } catch (_) { /* ignore */ }
      if (userEmail.includes("%40")) {
        userEmail = userEmail.replace(/%40/g, "@");
      }
    }

    if (!userEmail) {
      logger.error("No email found in callback payload");
      res.status(400).send("No email provided");
      return;
    }

    // Logic to determine plan
    let creditsToAdd = 0;
    let newTier = 'free';

    // Handle amounts like 99.00 or 9900 (cents)
    const paidAmount = parseFloat(amount);

    // Check amounts (handle both RUB and Kapecks)
    if (paidAmount === 99 || paidAmount === 9900) {
      creditsToAdd = 100;
      newTier = 'creator';
    } else if (paidAmount === 299 || paidAmount === 29900) {
      creditsToAdd = 500;
      newTier = 'pro';
    } else if (paidAmount === 699 || paidAmount === 69900) {
      creditsToAdd = 2000;
      newTier = 'business';
    } else {
      logger.warn("Unknown amount paid:", paidAmount);
      // Fallback: log it, but maybe grant basic credits or just return OK so we don't block.
      res.status(200).send("Unknown amount");
      return;
    }

    // Find user
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(userEmail);
    } catch (e) {
      logger.error("User not found for email:", userEmail);
      res.status(404).send("User not found in Auth");
      return;
    }

    // Update Database
    const userRef = admin.firestore().collection('users').doc(userRecord.uid);

    // Calculate subscription end date (30 days from now)
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 30);

    await admin.firestore().runTransaction(async (t) => {
      const doc = await t.get(userRef);

      // Ensure document exists with defaults before updating
      if (!doc.exists) {
        logger.info(`Creating new user document for ${userRecord.uid}`);
        t.set(userRef, {
          uid: userRecord.uid,
          email: userEmail,
          credits: 0,
          subscriptionTier: 'free',
          subscriptionStatus: 'inactive',
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }

      // Update with atomic increment and subscription details
      t.update(userRef, {
        credits: admin.firestore.FieldValue.increment(creditsToAdd),
        subscriptionTier: newTier,
        subscriptionStatus: 'active',
        subscriptionEndDate: admin.firestore.Timestamp.fromDate(subscriptionEndDate),
        lastPaymentId: orderNumber?.toString() || new Date().toISOString(),
        lastPaymentDate: admin.firestore.FieldValue.serverTimestamp(),
        lastPaymentAmount: paidAmount,
        lastPaymentPlan: newTier
      });
    });

    logger.info(`✅ Successfully credited ${creditsToAdd} credits to ${userEmail} (UID: ${userRecord.uid})`);
    logger.info(`📊 Payment Details:`, {
      plan: newTier,
      credits: creditsToAdd,
      amount: paidAmount,
      orderId: orderNumber
    });

    res.status(200).send("OK");

  } catch (error) {
    logger.error("❌ Callback Error:", error);
    logger.error("Error Stack:", error.stack);
    res.status(500).send("Internal Error");
  }
});

/**
 * Temporary Admin Tool to manually add credits
 * Usage: https://REGION-PROJECT.cloudfunctions.net/manualAddCredits?uid=USER_ID&credits=100&secret=ADMIN123
 */
exports.manualAddCredits = onRequest(async (req, res) => {
  const { uid, credits, secret } = req.query;

  // Simple protection
  if (secret !== "ADMIN_FIX_2025") {
    res.status(403).send("Forbidden");
    return;
  }

  if (!uid || !credits) {
    res.status(400).send("Missing uid or credits parameters");
    return;
  }

  try {
    const amount = parseInt(credits);
    if (isNaN(amount)) {
      res.status(400).send("Invalid credits amount");
      return;
    }

    await admin.firestore().collection('users').doc(uid).set({
      credits: admin.firestore.FieldValue.increment(amount),
      lastManualCredit: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    res.status(200).send(`SUCCESS: Added ${amount} credits to User ${uid}.`);
  } catch (error) {
    logger.error("Manual Credit Error", error);
    res.status(500).send("Error: " + error.message);
  }
});

/**
 * Proxy for Replicate (Flux) Generation
 * Client-side calls to Replicate fail due to CORS.
 */
exports.generateFluxImage = onRequest({ timeoutSeconds: 300 }, async (req, res) => {
  // CORS Headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  const { prompt, aspectRatio, apiKey } = req.body;
  const token = apiKey || process.env.REPLICATE_API_TOKEN; // token from env/secret only — never hardcode

  if (!token) {
    res.status(500).send("Missing Replicate API Token Configuration");
    return;
  }

  try {
    const Replicate = require("replicate");
    const replicate = new Replicate({ auth: token });

    let width = 1024, height = 1024;
    // ------------------------------------------------------------------
    // POLLING LOGIC
    // Replicate .run() usually waits, but sometimes for long tasks we need polling if using pure HTTP.
    // The Replicate SDK .run() method DOES wait by default for the prediction to finish. 
    // However, if we used .predictions.create() it would be async.
    // Let's rely on .run() behaving synchronously as per SDK docs for convenience, or handle the output.
    // If output is null but no error, maybe it timed out?
    // Let's verify standard SDK usage: Use 'await replicate.run(...)' -> returns Output directly.
    // ------------------------------------------------------------------

    const output = await replicate.run("black-forest-labs/flux-dev", {
      input: {
        prompt: prompt,
        // If image is present, add it.
        ...(req.body.image ? { image: req.body.image } : {}),
        aspect_ratio: aspectRatio,
        go_fast: true,
        megapixels: "1",
        num_outputs: 1,
        output_format: "jpg",
        guidance: 3.5,
        // Make strength dynamic or default to 0.8
        prompt_strength: req.body.prompt_strength ? parseFloat(req.body.prompt_strength) : 0.8,
        num_inference_steps: 28,
        disable_safety_checker: true,
        output_quality: 90
      }
    });

    // Output from Replicate SDK can be an array of "FileOutput" objects (which have a .url() method) or strings.
    logger.info("Flux Raw Output Type:", typeof output);
    if (Array.isArray(output) && output.length > 0) {
      logger.info("Flux Output[0] Type:", typeof output[0]);
    }

    let imageUrl = Array.isArray(output) ? output[0] : output;

    // Handle Replicate's FileOutput object (checking if it has .url() function)
    if (imageUrl && typeof imageUrl === 'object' && typeof imageUrl.url === 'function') {
      imageUrl = imageUrl.url();
    } else if (imageUrl && typeof imageUrl === 'object' && imageUrl.url) {
      // Fallback if it's a property
      imageUrl = imageUrl.url;
    } else if (imageUrl && typeof imageUrl === 'object') {
      // Fallback: try toString() which often returns URL for these objects
      imageUrl = imageUrl.toString();
    }

    // Force string conversion securely
    let finalUrl = String(imageUrl).trim();

    // If it's a FileOutput object that turned into [object Object], we failed usage.
    // But looking at logs, it seems to stringify correctly to the URL.

    // RELAXED VALIDATION: Just send it if it's long enough.
    if (!finalUrl || finalUrl.length < 10) {
      logger.error("Flux Bad Output:", output);
      throw new Error(`Invalid output from Replicate (too short). Raw: ${output}`);
    }

    res.status(200).json({ url: finalUrl });

  } catch (error) {
    logger.error("Flux Error", error);
    res.status(500).send(error.message);
  }
});

/**
 * Placeholder for GigaChat
 */
exports.generateGigaChatImage = onRequest(async (req, res) => {
  res.status(501).send("GigaChat integration pending certificates.");
});

/**
 * Universal FAL AI Proxy
 * Proxies requests to FAL AI to handle CORS and Authentication securely (or semi-securely via passed key).
 */
exports.generateFalProxy = onRequest({ timeoutSeconds: 300 }, async (req, res) => {
  // CORS Headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  const { model, input, apiKey } = req.body;

  // Use provided key or fallback to env. 
  // NOTE: In production, store keys in Firebase Secrets.
  const token = apiKey || process.env.FAL_KEY;

  if (!token) {
    res.status(401).send("Missing FAL API Key");
    return;
  }

  if (!model) {
    res.status(400).send("Missing model path");
    return;
  }

  const FAL_QUEUE_URL = `https://queue.fal.run/${model}`;

  try {
    // 1. Submit Request to Queue
    logger.info(`FAL Proxy: Submitting to ${model}`);
    const submitResp = await fetch(FAL_QUEUE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(input)
    });

    if (!submitResp.ok) {
      const errText = await submitResp.text();
      logger.error(`FAL Submit Error (${submitResp.status}):`, errText);
      throw new Error(`FAL Submit Failed: ${errText}`);
    }

    const submitData = await submitResp.json();
    const requestId = submitData.request_id;

    // If completed immediately (sync mode sometimes returns result direct, but queue usually returns request_id)
    if (submitData.status === 'COMPLETED') {
      // ... handled same as poll result
    }

    if (!requestId) {
      // Fallback: maybe it returned result directly?
      if (submitData.images && submitData.images.length > 0) {
        res.status(200).json({ url: submitData.images[0].url });
        return;
      }
      throw new Error("No request_id returned from FAL");
    }

    logger.info(`FAL Proxy: Request ID ${requestId}. Polling...`);

    // 2. Poll for Result
    const STATUS_URL = `${FAL_QUEUE_URL}/requests/${requestId}/status`;
    let attempts = 0;
    while (attempts < 60) { // Max 60 * 2s = 120s wait (Function timeout is 300s)
      await new Promise(r => setTimeout(r, 2000)); // Wait 2s
      attempts++;

      const statusResp = await fetch(STATUS_URL, {
        headers: {
          'Authorization': `Key ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!statusResp.ok) {
        const errText = await statusResp.text();
        // 404 might mean not ready? usually 200.
        logger.warn(`FAL Poll Error: ${errText}`);
        continue;
      }

      const statusData = await statusResp.json();

      if (statusData.status === 'COMPLETED') {
        // Success
        if (statusData.images && statusData.images.length > 0) {
          res.status(200).json({ url: statusData.images[0].url });
        } else if (statusData.image && statusData.image.url) {
          res.status(200).json({ url: statusData.image.url });
        } else {
          throw new Error("FAL Completed but no image found in response");
        }
        return;
      }

      if (statusData.status === 'FAILED') {
        throw new Error(`FAL Failed: ${statusData.error || 'Unknown Error'}`);
      }

      // otherwise IN_QUEUE or IN_PROGRESS, continue loop
    }

    throw new Error("FAL Timeout: Generation took too long");

  } catch (error) {
    logger.error("FAL Proxy Error", error);
    res.status(500).send(error.message);
  }
});

/**
 * Server-side save image to storage function.
 * Downloads an external image on the server (bypassing Client CORS) and saves it to Firestore/Storage.
 */
exports.saveImageToHistory = onRequest(async (req, res) => {
  // CORS Headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  const { userId, imageUrl, type } = req.body;

  if (!userId || !imageUrl) {
    res.status(400).send("Missing userId or imageUrl");
    return;
  }

  try {
    // 1. Download Image (Server-side, no CORS issues)
    const fetchResp = await fetch(imageUrl);
    if (!fetchResp.ok) throw new Error(`Failed to fetch image: ${fetchResp.statusText}`);

    const buffer = await fetchResp.arrayBuffer();
    const nodeBuffer = Buffer.from(buffer);

    if (nodeBuffer.length < 100) {
      throw new Error("Image too small/invalid");
    }

    // 2. Upload to Firebase Storage
    const bucket = admin.storage().bucket();
    const randomId = Math.random().toString(36).substring(7);
    const filename = `users/${userId}/${type || 'generated'}_${Date.now()}_${randomId}.jpg`;
    const file = bucket.file(filename);

    await file.save(nodeBuffer, {
      metadata: {
        contentType: 'image/jpeg',
        cacheControl: 'public, max-age=31536000'
      }
    });

    await file.makePublic(); // Make it publicly accessible (or use signed URL if preferred)
    const publicUrl = file.publicUrl();

    // Return the new permanent URL
    res.status(200).json({ url: publicUrl });

  } catch (error) {
    logger.error("Save Image Error:", error);
    res.status(500).send(error.message);
  }
});
