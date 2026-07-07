
import { db, storage, firebase } from "../lib/firebase";
import { CommunityPreferences, GeneratedImage, UserProfile, SubscriptionTier } from "../types";

// Collection reference
const HISTORY_COLLECTION = "generations";
const USERS_COLLECTION = "users";

const DEFAULT_COMMUNITY_PREFERENCES: CommunityPreferences = {
  publicNickname: "",
  communityHidden: false,
  communityShowPromptSettings: false,
};

const buildDefaultNickname = (user: any): string =>
  user?.displayName?.trim() || user?.email?.split("@")[0] || "Пользователь";

const normalizeCommunityPreferences = (
  data: Partial<CommunityPreferences> | undefined,
  fallbackNickname = "Пользователь"
): CommunityPreferences => ({
  publicNickname: typeof data?.publicNickname === "string" && data.publicNickname.trim()
    ? data.publicNickname.trim()
    : fallbackNickname,
  communityHidden: Boolean(data?.communityHidden),
  communityShowPromptSettings: Boolean(data?.communityShowPromptSettings),
});

/**
 * Uploads a Base64 image string to Firebase Storage
 */
export const uploadImageToStorage = async (userId: string, base64Data: string, type: 'original' | 'generated'): Promise<string> => {
  if (!storage) {
    console.warn("Storage not initialized. Returning mock URL.");
    return base64Data;
  }

  try {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const filename = `${type}_${timestamp}_${random}.jpg`;
    const path = `users/${userId}/${filename}`;
    const storageRef = storage.ref().child(path);
    console.log(`[Storage] Uploading to path: ${path} for user: ${userId}, type: ${type}`);

    // 1. Handle External URLs (Persistence)
    if (base64Data.startsWith('http')) {
      if (base64Data.includes('firebasestorage.googleapis.com') || base64Data.includes('smartphotos.ru')) return base64Data;

      try {
        console.log("Fetching external image for persistence:", base64Data);
        // Try fetch with cors mode explicit
        const response = await fetch(base64Data);
        if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);

        const blob = await response.blob();

        if (blob.size < 100) {
          throw new Error("Fetched image is too small (invalid).");
        }

        // Upload Blob
        const metadata = {
          contentType: blob.type || 'image/jpeg',
          cacheControl: 'public,max-age=31536000',
        };

        await storageRef.put(blob, metadata);
        const firebaseUrl = await storageRef.getDownloadURL();
        console.log(`[Storage] External image persisted! Path: ${path}, URL: ${firebaseUrl}`);
        
        // Verify URL contains our bucket
        if (!firebaseUrl.includes('smartphotos.ru') && !firebaseUrl.includes('firebasestorage')) {
          console.warn(`[Storage] Warning: Persisted URL doesn't contain expected bucket domain: ${firebaseUrl}`);
        }
        
        return firebaseUrl;
      } catch (e: any) {
        console.warn("Client-side fetch failed (likely CORS). Trying Server-Side Proxy...", e);

        // Fallback: Use Cloud Function Proxy
        try {
          // Determine API URL based on environment (local vs prod)
          // Hardcode likely URL pattern or use relative
          const functionUrl = "https://us-central1-project-1285666415996898989.cloudfunctions.net/saveImageToHistory";

          const proxyResp = await fetch(functionUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, imageUrl: base64Data, type })
          });

          if (!proxyResp.ok) throw new Error(`Proxy failed: ${await proxyResp.text()}`);

          const data = await proxyResp.json();
          console.log("Server-side persistence success:", data.url);
          return data.url;

        } catch (proxyError) {
          console.error("Server-side proxy also failed:", proxyError);
          throw e; // Throw original error if both fail
        }
      }
    }

    // 2. Handle Base64 Data (Original & Watermarked)
    // We use putString which is robust in the compat SDK
    const metadata = {
      contentType: 'image/jpeg',
      cacheControl: 'public,max-age=31536000',
    };

    let uploadTask;

    if (base64Data.startsWith('data:')) {
      // Upload as Data URL
      uploadTask = storageRef.putString(base64Data, 'data_url', metadata);
    } else {
      // Upload as Base64 string (assume JPEG if raw)
      uploadTask = storageRef.putString(base64Data, 'base64', metadata);
    }

    uploadTask.on('state_changed',
      (snapshot) => {
        // Progress monitoring if needed
      },
      (error) => {
        console.error("Upload error:", error);
      }
    );

    await uploadTask;
    const url = await storageRef.getDownloadURL();
    console.log(`[Storage] Upload successful! Path: ${path}, URL: ${url}`);
    
    // Verify URL contains our bucket
    if (!url.includes('smartphotos.ru') && !url.includes('firebasestorage')) {
      console.warn(`[Storage] Warning: Uploaded URL doesn't contain expected bucket domain: ${url}`);
    }
    
    return url;

  } catch (error: any) {
    console.error("Firebase Storage Error:", error);
    // Throw error so caller knows upload failed
    throw error;
  }
};

/**
 * Saves a generation record to Firestore
 */
export const saveGenerationToHistory = async (userId: string, item: GeneratedImage): Promise<string | null> => {
  // 1. Check DB initialization
  if (!db) {
    console.warn("Firestore not initialized. Skipping save.");
    return `temp_${Date.now()}`;
  }

  // 2. SAFETY CHECK: Firestore Document Size Limit is 1MB.
  // If we are using raw Base64 (because Storage upload failed), we CANNOT save to Firestore.
  // A typical 1024x1024 base64 image is ~1.5MB - 3MB.
  const isTooLarge = (str: string | null) => str && str.length > 200000; // Limit to ~200KB characters to be safe

  if (isTooLarge(item.generated) || isTooLarge(item.original)) {
    console.warn("Image data is too large for database (Base64). Skipping server save to prevent crash.");
    // Return a temporary local ID so the UI still works for this session
    return `local_heavy_${Date.now()}`;
  }

  try {
    // Log what we're saving
    console.log(`[Firestore] Saving generation for user: ${userId}, prompt: ${item.prompt?.substring(0, 50)}...`);
    console.log(`[Firestore] Generated URL: ${item.generated?.substring(0, 100)}...`);
    
    const docRef = await db.collection(HISTORY_COLLECTION).add({
      userId,
      original: item.original,
      generated: item.generated,
      prompt: item.prompt,
      source: item.source || 'studio',
      isSaved: true, // Auto-save all generations by default
      sharedToCommunity: Boolean(item.sharedToCommunity),
      communityPostId: item.communityPostId || null,
      communitySharedAt: item.communitySharedAt || null,
      createdAt: firebase.firestore.Timestamp.now()
    });
    
    console.log(`[Firestore] Generation saved successfully! Doc ID: ${docRef.id}`);
    return docRef.id;
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      console.warn("Firestore permission denied. Returning temp ID.");
      return `temp_perm_${Date.now()}`;
    }
    console.error("Error saving history:", error);
    return `temp_err_${Date.now()}`;
  }
};

/**
 * Toggles the 'isSaved' status of a generation
 */
/** Removes a generation record from Firestore history. */
export const deleteGenerationFromHistory = async (docId: string): Promise<boolean> => {
  if (!db || !docId) return false;
  if (docId.startsWith('temp_') || docId.startsWith('local_')) return true;

  try {
    await db.collection(HISTORY_COLLECTION).doc(docId).delete();
    return true;
  } catch (error) {
    console.error('Error deleting generation:', error);
    return false;
  }
};

export const toggleSavedStatus = async (docId: string, isSaved: boolean): Promise<boolean> => {
  if (!db || !docId) return false;

  // Don't try to update temporary local IDs in the database
  if (docId.startsWith('temp_') || docId.startsWith('local_')) return true;

  try {
    await db.collection(HISTORY_COLLECTION).doc(docId).update({
      isSaved: isSaved
    });
    return true;
  } catch (error) {
    console.error("Error toggling saved status:", error);
    return false;
  }
};

/**
 * Fetches user's generation history
 */
export const getUserHistory = async (userId: string): Promise<GeneratedImage[]> => {
  if (!db) return [];

  try {
    // Query without orderBy first to avoid "Missing Index" error
    const querySnapshot = await db.collection(HISTORY_COLLECTION)
      .where("userId", "==", userId)
      .limit(100)
      .get();

    const history: GeneratedImage[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      // Validate generated image URL/data
      const generated = data.generated;
      const isValidGenerated = generated && (
        typeof generated === 'string' && (
          generated.startsWith('http') ||
          generated.startsWith('data:image') ||
          generated.startsWith('blob:') ||
          // Allow Firebase Storage URLs even if they don't start with http (shouldn't happen, but safety check)
          generated.includes('firebasestorage') ||
          generated.includes('smartphotos.ru')
        )
      );

      // Skip entries with invalid or missing generated image
      if (!isValidGenerated) {
        console.warn(`[Firestore] Skipping history entry ${doc.id}: invalid generated image format`, {
          generated: typeof generated === 'string' ? generated.substring(0, 100) : generated,
          hasGenerated: !!generated
        });
        return;
      }

      history.push({
        id: doc.id,
        original: data.original || null,
        generated: generated,
        prompt: data.prompt || 'Без описания',
        source: data.source || 'studio',
        isSaved: data.isSaved || false,
        createdAt: data.createdAt,
        sharedToCommunity: Boolean(data.sharedToCommunity),
        communityPostId: data.communityPostId || null,
        communitySharedAt: data.communitySharedAt || null,
      });
    });
    
    console.log(`[Firestore] Loaded ${history.length} history entries for user: ${userId}`);

    // Sort in memory (Newest first)
    return history.sort((a, b) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });

  } catch (error: any) {
    // Gracefully handle permission errors
    if (error.code === 'permission-denied' || error.code === 'firestore/permission-denied') {
      console.warn("Firestore permission denied. Switching to local/empty history.");
      return [];
    }
    console.error("Error fetching history:", error);
    return [];
  }
};

/**
 * Creates or updates a user profile in Firestore
 */
export const syncUserProfile = async (user: any): Promise<UserProfile> => {
  // Default values
  const defaultCredits = 45;
  const defaultNickname = buildDefaultNickname(user);

  // Mock profile fallback
  const mockProfile: UserProfile = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    credits: defaultCredits,
    subscriptionTier: 'free',
    subscriptionStatus: 'active',
    subscriptionEndDate: null,
    createdAt: new Date(),
    lastLogin: new Date(),
    ...normalizeCommunityPreferences(undefined, defaultNickname),
  };

  if (!db) return mockProfile;

  try {
    const userRef = db.collection(USERS_COLLECTION).doc(user.uid);
    const userSnap = await userRef.get();

    if (userSnap.exists) {
      const data = userSnap.data();
      const normalizedPreferences = normalizeCommunityPreferences(data as Partial<CommunityPreferences>, defaultNickname);

      // Update last login
      await userRef.set({
        lastLogin: firebase.firestore.Timestamp.now(),
        ...normalizedPreferences,
      }, { merge: true });

      // Safely merge existing data with defaults to avoid undefined/NaN
      return {
        ...mockProfile, // Start with safe defaults
        ...data,        // Overwrite with DB data
        ...normalizedPreferences,
        credits: typeof data?.credits === 'number' ? data.credits : defaultCredits // Ensure credits is a number
      } as UserProfile;

    } else {
      // Create new user
      const newProfile: UserProfile = {
        ...mockProfile,
        credits: defaultCredits, // Explicitly set starting credits
        createdAt: firebase.firestore.Timestamp.now(),
        lastLogin: firebase.firestore.Timestamp.now()
      };
      await userRef.set(newProfile);
      return newProfile;
    }
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      return mockProfile;
    }
    console.error("Error syncing profile:", error);
    return mockProfile;
  }
};

export const getCommunityPreferences = async (userId: string, fallback?: { displayName?: string | null; email?: string | null }): Promise<CommunityPreferences> => {
  const fallbackNickname = fallback?.displayName?.trim() || fallback?.email?.split("@")[0] || "Пользователь";
  if (!db) {
    return normalizeCommunityPreferences(undefined, fallbackNickname);
  }

  try {
    const snap = await db.collection(USERS_COLLECTION).doc(userId).get();
    if (!snap.exists) {
      return normalizeCommunityPreferences(undefined, fallbackNickname);
    }
    return normalizeCommunityPreferences(snap.data() as Partial<CommunityPreferences>, fallbackNickname);
  } catch (error) {
    console.error("Error fetching community preferences:", error);
    return normalizeCommunityPreferences(undefined, fallbackNickname);
  }
};

export const updateCommunityPreferences = async (
  userId: string,
  preferences: Partial<CommunityPreferences>
): Promise<CommunityPreferences | null> => {
  if (!db) {
    return {
      ...DEFAULT_COMMUNITY_PREFERENCES,
      ...preferences,
      publicNickname: preferences.publicNickname?.trim() || "Пользователь",
    };
  }

  try {
    const userRef = db.collection(USERS_COLLECTION).doc(userId);
    const existing = await userRef.get();
    const fallbackNickname =
      existing.data()?.displayName?.trim() ||
      existing.data()?.email?.split("@")[0] ||
      "Пользователь";
    const next = normalizeCommunityPreferences({
      ...existing.data(),
      ...preferences,
    } as Partial<CommunityPreferences>, fallbackNickname);
    await userRef.set(next, { merge: true });
    return next;
  } catch (error) {
    console.error("Error updating community preferences:", error);
    return null;
  }
};

export const markGenerationCommunityShare = async (
  generationId: string,
  payload: { sharedToCommunity: boolean; communityPostId?: string | null; communitySharedAt?: any }
): Promise<boolean> => {
  if (!db || !generationId) return false;
  if (generationId.startsWith("temp_") || generationId.startsWith("local_")) return true;

  try {
    await db.collection(HISTORY_COLLECTION).doc(generationId).set({
      sharedToCommunity: payload.sharedToCommunity,
      communityPostId: payload.communityPostId ?? null,
      communitySharedAt: payload.communitySharedAt ?? null,
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error updating generation community state:", error);
    return false;
  }
};

export const clearCommunityShareStateForUser = async (userId: string): Promise<number> => {
  if (!db || !userId) return 0;

  try {
    let clearedCount = 0;
    let lastDoc: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData> | null = null;

    while (true) {
      let query = db.collection(HISTORY_COLLECTION)
        .where("userId", "==", userId)
        .where("sharedToCommunity", "==", true)
        .limit(200);

      if (lastDoc) {
        query = query.startAfter(lastDoc);
      }

      const snap = await query.get();
      if (snap.empty) break;

      const batch = db.batch();
      snap.docs.forEach((doc) => {
        batch.set(doc.ref, {
          sharedToCommunity: false,
          communityPostId: null,
          communitySharedAt: null,
        }, { merge: true });
      });
      await batch.commit();

      clearedCount += snap.size;
      lastDoc = snap.docs[snap.docs.length - 1];

      if (snap.size < 200) break;
    }

    return clearedCount;
  } catch (error) {
    console.error("Error clearing community share state:", error);
    return 0;
  }
};

/**
 * Deducts credits from user
 */
export const deductCredits = async (userId: string, amount: number): Promise<boolean> => {
  if (!db) return true; // Allow in demo mode

  const userRef = db.collection(USERS_COLLECTION).doc(userId);
  try {
    return await db.runTransaction(async (tx) => {
      const userSnap = await tx.get(userRef);
      if (!userSnap.exists) return false;
      const data = userSnap.data();
      const currentCredits = typeof data?.credits === 'number' ? data.credits : 0;
      if (currentCredits < amount) return false;
      tx.update(userRef, {
        credits: currentCredits - amount
      });
      return true;
    });
  } catch (e: any) {
    if (e.code === 'permission-denied') return true; // Allow in demo
    console.error("Error deducting credits:", e);
    return false;
  }
};

export const addCredits = async (userId: string, amount: number): Promise<boolean> => {
  if (!db) return true;
  const userRef = db.collection(USERS_COLLECTION).doc(userId);
  try {
    await userRef.set({
      credits: firebase.firestore.FieldValue.increment(amount)
    }, { merge: true });
    return true;
  } catch (e: any) {
    if (e.code === 'permission-denied') return true;
    console.error("Error adding credits:", e);
    return false;
  }
};

export const purchaseSubscription = async (userId: string, tier: SubscriptionTier, creditsToAdd: number): Promise<void> => {
  if (!db) return;

  try {
    const userRef = db.collection(USERS_COLLECTION).doc(userId);

    // Calculate expiry (30 days from now)
    const now = new Date();
    now.setDate(now.getDate() + 30);
    const expiryDate = firebase.firestore.Timestamp.fromDate(now);

    await userRef.update({
      credits: firebase.firestore.FieldValue.increment(creditsToAdd),
      subscriptionTier: tier,
      subscriptionStatus: 'active',
      subscriptionEndDate: expiryDate,
      lastPaymentDate: firebase.firestore.FieldValue.serverTimestamp(),
      lastPaymentPlan: tier
    });
  } catch (e: any) {
    if (e.code === 'permission-denied') return;
    console.error("Error purchasing subscription:", e);
  }
};
