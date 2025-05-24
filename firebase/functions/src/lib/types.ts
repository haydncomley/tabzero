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
            access_token: string,
        }
    },
    timestamp_last: Timestamp,
    timestamp_created: Timestamp,
}

export type tabzeroTool<T extends z.ZodSchema, K extends string = string> = {
    name: K,
    description: string,
    parameters: T,
    scopes: `${Vendor}@${string}`[],
    function: (args: z.infer<T> & { user: tabzeroUser }) => Promise<{ success: boolean, message: string }>
}