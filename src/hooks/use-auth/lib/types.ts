import type { Timestamp } from 'firebase/firestore';

// TODO: Merge the user types from the frontend and backend
export type tabzeroUser = {
	uid: string;
	provider: 'twitch';
	timestamp_last: Timestamp;
	timestamp_created: Timestamp;
	providers: {
		twitch: {
			id: string;
			login: string;
			display_name: string;
			profile_image_url: string;
			offline_image_url: string;
			create_at: string;
			access_token: string;
		};
	};
	preferences?: {
		voiceTone?: string;
		voiceGender?: 'male' | 'female';
	};
	stripe_customer_id?: string;
	stripe_subscription_id?: string;
	stripe_subscription_status?: 'active' | 'active-canceled' | 'inactive';
	stripe_subscription_expires?: Timestamp;
};
