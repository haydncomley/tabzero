import { z } from "zod";
import { tabzeroTool } from "../../types";
import { ApiClient } from "@twurple/api";
import { StaticAuthProvider } from "@twurple/auth";
import { CONFIG } from "../../../config";
import { HttpsError } from "firebase-functions/https";

const toolSchema = z.object({
    title: z.string(),
})

export const twitchStreamChangeTitle = {
    name: 'twitchStreamChangeTitle',
    description: 'Change the title of the Twitch stream',
    parameters: toolSchema,
    scopes: ['twitch@channel:manage:broadcast'],
    clientDetails: ({ title }) => ({
        name: "Update Title",
        context: `"${title}"`
    }),
    function: async ({ title, user }) => {
        const provider = new StaticAuthProvider(CONFIG.twitch.client_id, user.providers[user.provider].access_token);
        const api = new ApiClient({ authProvider: provider });
        
        const { userId } = await api.getTokenInfo();
        
        if (!userId) throw new HttpsError('invalid-argument', 'User validation failed');

        try {
            await api.channels.updateChannelInfo(userId, {
                title: title,
            })
            return { success: true }
        } catch (error) {
            console.error(error);
            throw new HttpsError('internal', 'Failed to change stream title');
        }
    }
} as const satisfies tabzeroTool<typeof toolSchema>

