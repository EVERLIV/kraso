import { auth } from '../lib/firebase';
import { CommunityPreferences, GeneratedImage } from '../types';

const COMMUNITY_FUNCTION_URL =
    import.meta.env.VITE_COMMUNITY_FUNCTION_URL ||
    'https://us-central1-project-1285666415996898989.cloudfunctions.net/communityApi';

export interface CommunityPostSettings {
    source?: GeneratedImage['source'];
    mediaType: 'image' | 'video';
}

export interface CommunityPost {
    id?: string;
    userId: string;
    userName: string;
    authorNickname: string;
    authorPhoto?: string | null;
    mediaUrl: string;
    mediaType: 'image' | 'video';
    prompt?: string;
    settings?: CommunityPostSettings | null;
    showPromptSettings: boolean;
    likes: number;
    likedBy: string[];
    status: 'active' | 'hidden';
    createdAt?: { seconds?: number } | null;
    sourceGenerationId?: string | null;
    publishedAt?: { seconds?: number } | null;
}

async function callCommunityFunction(payload: Record<string, unknown>) {
    const token = auth?.currentUser ? await auth.currentUser.getIdToken() : null;
    const resp = await fetch(COMMUNITY_FUNCTION_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
    });

    const text = await resp.text();
    let data: any = {};
    try {
        data = text ? JSON.parse(text) : {};
    } catch {
        data = { error: text };
    }

    if (!resp.ok) {
        throw new Error(data?.error || data?.message || `Community API error (${resp.status})`);
    }

    return data;
}

export async function publishToCommunity(
    userId: string,
    userName: string,
    userPhoto: string | null | undefined,
    item: GeneratedImage,
    preferences: CommunityPreferences,
): Promise<string | null> {
    const data = await callCommunityFunction({
        action: 'publish',
        item,
        preferences,
        userId,
        userName,
        userPhoto,
    });
    return data?.postId || null;
}

export async function fetchCommunityFeed(limit = 48): Promise<CommunityPost[]> {
    try {
        const data = await callCommunityFunction({ action: 'feed', limit });
        return Array.isArray(data?.posts) ? data.posts as CommunityPost[] : [];
    } catch (e) {
        console.error('Community feed error:', e);
        return [];
    }
}

export async function toggleCommunityLike(postId: string, userId: string): Promise<{ likes: number; liked: boolean }> {
    const data = await callCommunityFunction({ action: 'like', postId, userId });
    return {
        likes: typeof data?.likes === 'number' ? data.likes : 0,
        liked: Boolean(data?.liked),
    };
}

export async function hideCommunityPostsByUser(userId: string): Promise<number> {
    const data = await callCommunityFunction({ action: 'hideAll', userId });
    return typeof data?.hiddenCount === 'number' ? data.hiddenCount : 0;
}
