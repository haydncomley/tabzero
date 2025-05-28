import { z } from "zod";
import { tabzeroTool } from "../../types";
import { HttpsError } from "firebase-functions/https";
import { getTwitch } from "../../../vendor/twitch.vendor";

const toolSchema = z.object({
    twitchCategory: z.string(),
})

export const twitchStreamChangeCategory = {
    // LLM
    name: 'twitchStreamChangeCategory',
    description: 'Change the category/game of the Twitch stream',
    parameters: toolSchema,
    scopes: ['twitch@channel:manage:broadcast'],
    clientDetails: ({ twitchCategory }) => ({
        name: "Update Category",
        context: `"${twitchCategory}"`
    }),
    // User
    infoName: 'Twitch: Change Category',
    infoDescription: 'Change the category/game of your stream.',
    // Action
    function: async ({ twitchCategory, user }) => {
        const api = getTwitch(user);
        
        const { userId } = await api.getTokenInfo();
        
        if (!userId) throw new HttpsError('invalid-argument', 'User validation failed');

        try {
            const games = await api.games.getGamesByNames([twitchCategory])

            if (games.length === 0) {
                return {
                    success: false,
                    message: `"${twitchCategory}" not found`,
                }
            };

            await api.channels.updateChannelInfo(userId, {
                gameId: games[0].id,
            })

            return { success: true }
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Failed to change category' }
        }
    }
} as const satisfies tabzeroTool<typeof toolSchema>

