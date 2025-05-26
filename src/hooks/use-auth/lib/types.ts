export type tabzeroUser = {
	uid: string;
	provider: 'twitch';
	timestamp_last: Date;
	timestamp_created: Date;
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
	stripe_customer_id?: string;
	stripe_subscription_id?: string;
	stripe_subscription_status?: 'active' | 'active-canceled' | 'inactive';
};
