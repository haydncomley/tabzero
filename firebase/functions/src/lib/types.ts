import type { z } from 'zod' 

type Vendor = 'twitch';

export type tabzeroTool<T extends z.ZodSchema, K extends string = string> = {
    name: K,
    description: string,
    parameters: T,
    scopes: `${Vendor}@${string}`[],
    function: (args: z.infer<T>) => Promise<{ success: boolean, message: string }>
}