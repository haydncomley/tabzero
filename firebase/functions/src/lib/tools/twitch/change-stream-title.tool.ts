import { z } from "zod";
import { tabzeroTool } from "../../types";
import { HttpsError } from "firebase-functions/https";
import { getTwitch } from "../../../vendor/twitch.vendor";

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
    infoDescription: 'Update the title of your stream.',
    // Action
    function: async ({ title, user }) => {
        const api = getTwitch(user);
        
        const { userId } = await api.getTokenInfo();
        
        if (!userId) throw new HttpsError('invalid-argument', 'User validation failed');

        try {
            await api.channels.updateChannelInfo(userId, {
                title: title,
            })
            return { success: true }
        } catch (error) {
            return { success: false, message: 'Failed to change title' }
        }
    }
} as const satisfies tabzeroTool<typeof toolSchema>

