import { z } from "zod";
import { tabzeroTool } from "../../types";
import { ApiClient } from "@twurple/api";
import { StaticAuthProvider } from "@twurple/auth";
import { HttpsError } from "firebase-functions/https";
import { twitchClientId } from "../../../config";

const toolSchema = z.object({
    title: z.string(),
})

export const twitchStreamChangeTitle = {
    // LLM
    name: 'twitchStreamChangeTitle',
    description: 'Change the title of the Twitch stream',
    parameters: toolSchema,
    scopes: ['twitch@channel:manage:broadcast'],
    clientDetails: ({ title }) => ({
        name: "Update Title",
        context: `"${title}"`
    }),
    // User
    infoName: 'Twitch: Update Title',
    infoDescription: 'Update the title of your Twitch stream.',
    // Action
    function: async ({ title, user }) => {
        const provider = new StaticAuthProvider(twitchClientId.value(), user.providers[user.provider].access_token);
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

