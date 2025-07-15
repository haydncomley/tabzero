import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { defineSecret } from 'firebase-functions/params';

export const app = initializeApp();
export const firestore = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export const CONFIG = {
	version: '0.1.5',
};

export const MIN_INSTANCES = 1;
export const MAX_INSTANCES = 4;

export const openaiKey = defineSecret('OPENAI_KEY');
export const langfuseKey = defineSecret('LANGFUSE_KEY');
export const langfusePublicKey = defineSecret('LANGFUSE_PUBLIC_KEY');
export const langfuseHost = defineSecret('LANGFUSE_HOST');

export const twitchClientId = defineSecret('TWITCH_CLIENT_ID');
export const twitchClientSecret = defineSecret('TWITCH_CLIENT_SECRET');
export const twitchRedirectUri = defineSecret('TWITCH_REDIRECT_URI');

export const stripeKey = defineSecret('STRIPE_KEY');
export const stripeWebhookSecret = defineSecret('STRIPE_WEBHOOK_SECRET');
export const stripePriceId = defineSecret('STRIPE_PRICE_ID');
