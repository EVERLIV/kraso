const { onRequest } = require("firebase-functions/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const COMMUNITY_COLLECTION = "community";
const USERS_COLLECTION = "users";
const GENERATIONS_COLLECTION = "generations";

function normalizePreferences(data, fallbackNickname) {
  return {
    publicNickname: typeof data?.publicNickname === "string" && data.publicNickname.trim()
      ? data.publicNickname.trim()
      : fallbackNickname,
    communityHidden: Boolean(data?.communityHidden),
    communityShowPromptSettings: Boolean(data?.communityShowPromptSettings),
  };
}

async function verifyRequest(req, res) {
  const authHeader = req.headers.authorization || "";
  const tokenMatch = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!tokenMatch) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }

  try {
    return await admin.auth().verifyIdToken(tokenMatch[1]);
  } catch (error) {
    logger.warn("communityApi.auth_failed", error);
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
}

async function getUserProfile(uid) {
  const snap = await admin.firestore().collection(USERS_COLLECTION).doc(uid).get();
  return snap.exists ? (snap.data() || {}) : {};
}

async function publishPost(uid, decodedToken, body) {
  const item = body?.item || {};
  if (!item?.id || !item?.generated) {
    throw new Error("Missing generation data");
  }

  const profile = await getUserProfile(uid);
  const fallbackNickname = decodedToken.name || decodedToken.email || "Пользователь";
  const preferences = normalizePreferences(profile, fallbackNickname);
  const isVideo = item.source === "video" || item.source === "shorts" || /\.mp4(\?|$)/i.test(item.generated || "");
  const mediaType = isVideo ? "video" : "image";
  const createdAt = admin.firestore.FieldValue.serverTimestamp();

  const docRef = await admin.firestore().collection(COMMUNITY_COLLECTION).add({
    userId: uid,
    userName: fallbackNickname,
    authorNickname: preferences.publicNickname,
    authorPhoto: decodedToken.picture || profile.photoURL || null,
    mediaUrl: item.generated,
    mediaType,
    prompt: preferences.communityShowPromptSettings ? (item.prompt || "") : "",
    settings: preferences.communityShowPromptSettings ? {
      source: item.source || "studio",
      mediaType,
    } : null,
    showPromptSettings: preferences.communityShowPromptSettings,
    likes: 0,
    likedBy: [],
    status: "active",
    createdAt,
    publishedAt: createdAt,
    sourceGenerationId: item.id || null,
  });

  const generationId = item.id;
  if (
    generationId
    && !String(generationId).startsWith("temp_")
    && !String(generationId).startsWith("local_")
  ) {
    const generationRef = admin.firestore().collection(GENERATIONS_COLLECTION).doc(generationId);
    const generationSnap = await generationRef.get();
    if (generationSnap.exists && generationSnap.data()?.userId === uid) {
      await generationRef.set({
        sharedToCommunity: true,
        communityPostId: docRef.id,
        communitySharedAt: createdAt,
      }, { merge: true });
    }
  }

  return { postId: docRef.id };
}

async function fetchFeed(limit) {
  const snap = await admin.firestore().collection(COMMUNITY_COLLECTION)
    .orderBy("createdAt", "desc")
    .limit(Math.max(limit * 3, limit))
    .get();

  const posts = snap.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((post) => post.status === "active")
    .slice(0, limit);

  return { posts };
}

async function toggleLike(uid, postId) {
  if (!postId) {
    throw new Error("Missing postId");
  }

  const ref = admin.firestore().collection(COMMUNITY_COLLECTION).doc(postId);
  return admin.firestore().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new Error("Post not found");

    const data = snap.data() || {};
    const likedBy = Array.isArray(data.likedBy) ? data.likedBy : [];
    const already = likedBy.includes(uid);
    const nextLikedBy = already ? likedBy.filter((id) => id !== uid) : [...likedBy, uid];
    const likes = nextLikedBy.length;

    tx.update(ref, { likedBy: nextLikedBy, likes });
    return { likes, liked: !already };
  });
}

async function hideAllPosts(uid) {
  let hiddenCount = 0;
  let lastDoc = null;

  while (true) {
    let query = admin.firestore().collection(COMMUNITY_COLLECTION)
      .where("userId", "==", uid)
      .limit(200);

    if (lastDoc) {
      query = query.startAfter(lastDoc);
    }

    const snap = await query.get();
    if (snap.empty) break;

    const batch = admin.firestore().batch();
    snap.docs.forEach((doc) => {
      const data = doc.data() || {};
      if (data.status === "active") {
        batch.update(doc.ref, { status: "hidden" });
        hiddenCount += 1;
      }
    });
    await batch.commit();

    lastDoc = snap.docs[snap.docs.length - 1];
    if (snap.size < 200) break;
  }

  return { hiddenCount };
}

const communityApiHandler = onRequest({ timeoutSeconds: 120, memory: "512MiB" }, async (req, res) => {
  Object.entries(CORS).forEach(([k, v]) => res.set(k, v));
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const decodedToken = await verifyRequest(req, res);
  if (!decodedToken) return;

  const { action, postId, limit = 48 } = req.body || {};

  try {
    if (action === "publish") {
      res.status(200).json(await publishPost(decodedToken.uid, decodedToken, req.body || {}));
      return;
    }
    if (action === "feed") {
      res.status(200).json(await fetchFeed(Number(limit) || 48));
      return;
    }
    if (action === "like") {
      res.status(200).json(await toggleLike(decodedToken.uid, postId));
      return;
    }
    if (action === "hideAll") {
      res.status(200).json(await hideAllPosts(decodedToken.uid));
      return;
    }

    res.status(400).json({ error: "Unknown action" });
  } catch (error) {
    logger.error("communityApi.error", error);
    res.status(500).json({ error: error.message || "Community API failed" });
  }
});

module.exports = { communityApiHandler };
