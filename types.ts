
export type CategoryId = 'all' | 'tet' | 'retro' | 'wedding' | 'formula1' | 'restaurants' | 'marketplaces' | 'business_print' | 'style_trends' | 'sports' | 'dating' | 'pranks' | 'documents' | 'kids' | 'family' | 'ecommerce' | 'fashion' | 'makeup' | 'business' | 'ugc' | 'bloggers' | 'rich_life' | 'trending' | 'new' | 'saved';

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '4:5';

export type ImageResolution = '1K' | '2K' | '4K';

export type GenModelId =
  | 'gemini-2.5-flash-image'          // Быстрая / дешевая (Flash)
  | 'gemini-3-pro-image-preview'     // Премиум качество (Pro превью)
  | 'nano-banana-v1';

export interface Preset {
  id: string;
  title: string;
  description: string;
  prompt: string;
  image?: string;
  category: CategoryId;
  icon?: string;
}

export interface GeneratedImage {
  id?: string;
  original: string | null;
  generated: string;
  prompt: string;
  isSaved?: boolean;
  createdAt?: any;
  source?: 'chat' | 'studio' | 'video';
}

export enum AppState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export type ChatRole = 'user' | 'model';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text?: string;
  images?: string[];
  isError?: boolean;
}

export type ViewMode = 'dashboard' | 'templates' | 'chat' | 'upscale' | 'remove-bg' | 'profile' | 'video' | 'design-system' | 'history';

export type SubscriptionTier = 'free' | 'creator' | 'pro' | 'business';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  credits: number;
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: 'active' | 'expired' | 'cancelled';
  subscriptionEndDate: any;
  createdAt: any;
  lastLogin: any;
  apiKey?: string; // New: For external API integration
}

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  price: number;
  credits: number;
  features: string[];
  isPopular?: boolean;
  color: string;
  allowedQuality: ImageResolution[];
}
