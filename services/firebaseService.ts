
import { db, storage, firebase } from "../lib/firebase";
import { GeneratedImage, UserProfile, SubscriptionTier } from "../types";

// Collection reference
const HISTORY_COLLECTION = "generations";
const USERS_COLLECTION = "users";

/**
 * Uploads a Base64 image string to Firebase Storage
 */
export const uploadImageToStorage = async (userId: string, base64Data: string, type: 'original' | 'generated'): Promise<string> => {
  if (!storage) {
    console.warn("Storage not initialized. Returning mock URL.");
    return base64Data; // Return original data in demo mode
  }

  try {
    // Check if it's already a URL (e.g. from history)
    if (base64Data.startsWith('http')) return base64Data;

    // Create a unique filename based on timestamp
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const path = `users/${userId}/${type}_${timestamp}_${random}.jpg`;
    
    const storageRef = storage.ref().child(path);
    
    // Determine format
    const format = base64Data.startsWith('data:') ? 'data_url' : 'base64';
    const metadata = { contentType: 'image/jpeg' };

    // Upload
    await storageRef.putString(base64Data, format, metadata);
    
    // Get URL
    const url = await storageRef.getDownloadURL();
    return url;
  } catch (error: any) {
    // If permission denied (e.g. demo user trying to write to real bucket), return raw base64
    if (error.code === 'storage/unauthorized' || error.code === 'permission-denied') {
        console.warn("Storage permission denied. Using local data.");
        return base64Data;
    }
    console.error("Error uploading image:", error);
    return base64Data; // Fallback to base64 so app doesn't crash
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
    const docRef = await db.collection(HISTORY_COLLECTION).add({
      userId,
      original: item.original,
      generated: item.generated,
      prompt: item.prompt,
      isSaved: false, // Default not saved/bookmarked
      createdAt: firebase.firestore.Timestamp.now()
    });
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
      history.push({
        id: doc.id,
        original: data.original,
        generated: data.generated,
        prompt: data.prompt,
        isSaved: data.isSaved || false,
        createdAt: data.createdAt
      });
    });

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
  const defaultCredits = 5;
  
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
      lastLogin: new Date()
  };

  if (!db) return mockProfile;

  try {
    const userRef = db.collection(USERS_COLLECTION).doc(user.uid);
    const userSnap = await userRef.get();

    if (userSnap.exists) {
      const data = userSnap.data();
      
      // Update last login
      await userRef.update({
        lastLogin: firebase.firestore.Timestamp.now()
      });

      // Safely merge existing data with defaults to avoid undefined/NaN
      return {
          ...mockProfile, // Start with safe defaults
          ...data,        // Overwrite with DB data
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

/**
 * Deducts credits from user
 */
export const deductCredits = async (userId: string, amount: number): Promise<boolean> => {
  if (!db) return true; // Allow in demo mode

  const userRef = db.collection(USERS_COLLECTION).doc(userId);
  try {
    const userSnap = await userRef.get();
    if (userSnap.exists) {
      const data = userSnap.data();
      const currentCredits = typeof data?.credits === 'number' ? data.credits : 0;
      
      if (currentCredits >= amount) {
        await userRef.update({
          credits: firebase.firestore.FieldValue.increment(-amount)
        });
        return true;
      }
    }
    return false;
  } catch (e: any) {
    if (e.code === 'permission-denied') return true; // Allow in demo
    console.error("Error deducting credits:", e);
    return false;
  }
};

/**
 * Simulates subscription purchase and updates DB
 */
export const purchaseSubscription = async (userId: string, tier: SubscriptionTier, creditsToAdd: number): Promise<void> => {
  if (!db) return;
  
  try {
    const userRef = db.collection(USERS_COLLECTION).doc(userId);
    
    // Calculate expiry (30 days from now)
    const now = new Date();
    now.setDate(now.getDate() + 30);
    const expiryDate = firebase.firestore.Timestamp.fromDate(now);

    await userRef.update({
      subscriptionTier: tier,
      subscriptionStatus: 'active',
      subscriptionEndDate: expiryDate,
      credits: firebase.firestore.FieldValue.increment(creditsToAdd)
    });
  } catch (e: any) {
    if (e.code === 'permission-denied') return;
    console.error("Error purchasing subscription:", e);
  }
};
