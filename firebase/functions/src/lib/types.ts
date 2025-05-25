import { Timestamp } from 'firebase-admin/firestore';
import type { z } from 'zod' 

type Vendor = 'twitch';

export interface tabzeroUser {
    uid: string,
    provider: Vendor,
    providers: {
        twitch: {
            id: string,
            login: string,
            display_name: string,
            profile_image_url: string,
            offline_image_url: string,
            created_at: string,
            expires_in: number,
            access_token: string,
            refresh_token: string,
        }
    },
    timestamp_last: Timestamp,
    timestamp_created: Timestamp,
    stripe_customer_id?: string,
    stripe_subscription_id?: string,
    stripe_subscription_status?: boolean,
}

export type tabzeroTool<T extends z.ZodSchema, K extends string = string> = {
    name: K,
    description: string,
    parameters: T,
    scopes: `${Vendor}@${string}`[],
    function: (args: z.infer<T> & { user: tabzeroUser }) => Promise<{ success: boolean, message: string, tts?: string }>
}