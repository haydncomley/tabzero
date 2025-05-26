import { z } from "zod";
import { tabzeroTool } from "../../types";
import { ApiClient } from "@twurple/api";
import { StaticAuthProvider } from "@twurple/auth";
import { CONFIG } from "../../../config";
import { HttpsError } from "firebase-functions/https";

const toolSchema = z.object({
    twitchCategory: z.string(),
})

export const twitchStreamChangeCategory = {
    name: 'twitchStreamChangeCategory',
    description: 'Change the category/game of the Twitch stream',
    parameters: toolSchema,
    scopes: ['twitch@channel:manage:broadcast'],
    clientDetails: ({ twitchCategory }) => ({
        name: "Update Category",
        context: `"${twitchCategory}"`
    }),
    function: async ({ twitchCategory, user }) => {
        const provider = new StaticAuthProvider(CONFIG.twitch.client_id, user.providers[user.provider].access_token);
        const api = new ApiClient({ authProvider: provider });
        
        const { userId } = await api.getTokenInfo();
        
        if (!userId) throw new HttpsError('invalid-argument', 'User validation failed');

        const games = await api.games.getGamesByNames([twitchCategory])

        if (games.length === 0) {
            return {
                success: false,
                message: `"${twitchCategory}" not found`,
            }
        };

        try {
            await api.channels.updateChannelInfo(userId, {
                gameId: games[0].id,
            })
            return { success: true }
        } catch (error) {
            console.error(error);
            throw new HttpsError('internal', 'Failed to change stream category');
        }
    }
} as const satisfies tabzeroTool<typeof toolSchema>

