import { db, firebase } from '../lib/firebase';
import { GeneratedImage } from '../types';

const COMMUNITY_COLLECTION = 'community';

export interface CommunityPost {
    id?: string;
    userId: string;
    userName: string;
    userPhoto?: string | null;
    mediaUrl: string;
    mediaType: 'image' | 'video';
    prompt?: string;
    likes: number;
    likedBy: string[];
    createdAt?: { seconds?: number } | null;
    sourceGenerationId?: string;
}

export async function publishToCommunity(
    userId: string,
    userName: string,
    userPhoto: string | null | undefined,
    item: GeneratedImage,
): Promise<string | null> {
    if (!db) return null;
    const isVideo = item.source === 'video' || /\.mp4(\?|$)/i.test(item.generated || '');
    const docRef = await db.collection(COMMUNITY_COLLECTION).add({
        userId,
        userName: userName || 'Пользователь',
        userPhoto: userPhoto || null,
        mediaUrl: item.generated,
        mediaType: isVideo ? 'video' : 'image',
        prompt: item.prompt || '',
        likes: 0,
        likedBy: [],
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        sourceGenerationId: item.id || null,
    });
    return docRef.id;
}

export async function fetchCommunityFeed(limit = 48): Promise<CommunityPost[]> {
    if (!db) return [];
    try {
        const snap = await db.collection(COMMUNITY_COLLECTION)
            .orderBy('createdAt', 'desc')
            .limit(limit)
            .get();
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as CommunityPost));
    } catch (e) {
        console.error('Community feed error:', e);
        return [];
    }
}

export async function toggleCommunityLike(postId: string, userId: string): Promise<{ likes: number; liked: boolean }> {
    if (!db) return { likes: 0, liked: false };
    const ref = db.collection(COMMUNITY_COLLECTION).doc(postId);
    return db.runTransaction(async tx => {
        const snap = await tx.get(ref);
        if (!snap.exists) throw new Error('Post not found');
        const data = snap.data() as CommunityPost;
        const likedBy = data.likedBy || [];
        const already = likedBy.includes(userId);
        const nextLikedBy = already ? likedBy.filter(id => id !== userId) : [...likedBy, userId];
        const likes = Math.max(0, nextLikedBy.length);
        tx.update(ref, { likedBy: nextLikedBy, likes });
        return { likes, liked: !already };
    });
}
