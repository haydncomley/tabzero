import { Timestamp } from 'firebase-admin/firestore';
import { ChatCompletionMessageFunctionToolCall } from 'openai/resources/chat/completions/completions.js';
import type { z } from 'zod';

type Vendor = 'twitch';

// TODO: Merge the user types from the frontend and backend
export interface tabzeroUser {
	uid: string;
	provider: Vendor;
	providers: {
		twitch: {
			id: string;
			login: string;
			display_name: string;
			profile_image_url: string;
			offline_image_url: string;
			created_at: string;
			expires_in: number;
			access_token: string;
			refresh_token: string;
		};
	};
	preferences?: {
		voiceTone?: string;
		voiceGender?: 'male' | 'female';
		bitsTTS?: string;
	};
	timestamp_last: Timestamp;
	timestamp_created: Timestamp;
	stripe_customer_id?: string;
	stripe_subscription_id?: string;
	stripe_subscription_status?: 'active' | 'active-canceled' | 'inactive';
	stripe_subscription_expires?: Timestamp;
}

export type tabzeroTool<T extends z.ZodSchema, K extends string = string> = {
	name: K;
	description: string;
	parameters: T;
	scopes: `${Vendor}@${string}`[];
	infoName: string;
	infoDescription: string;
	clientDetails: (args: z.infer<T>) => { name: string; context: string };
	function: (
		args: z.infer<T> & {
			user: tabzeroUser;
			recentMessages?: {
				user: string;
				message: string;
			}[];
		},
	) => Promise<{
		success: boolean;
		message: string;
		tts?: string;
		link?: string;
	}>;
};

export type tabzeroToolAction = {
	id: string;
	name: string;
	text: string;
	timestamp: Timestamp;
	tools: {
		id: string;
		name: string;
		context: string;
		status: 'pending' | 'success' | 'error';
		details: ChatCompletionMessageFunctionToolCall.Function;
		tts?: string;
		link?: string;
	}[];
};
