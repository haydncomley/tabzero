import { z } from "zod";
import { tabzeroTool } from "../../types";
import { HttpsError } from "firebase-functions/https";
import { getTwitch } from "../../../vendor/twitch.vendor";

const toolSchema = z.object({})

export const twitchClipCreate = {
    // LLM
    name: 'twitchClipCreate',
    description: 'Create a clip of the Twitch stream from the last few minutes when something fun or exciting happens',
    parameters: toolSchema,
    scopes: ['twitch@clips:edit'],
    clientDetails: ({}) => ({
        name: "Clip",
        context: `Created.`
    }),
    // User
    infoName: 'Twitch: Create Clip',
    infoDescription: 'Create a clip of the stream.',
    // Action
    function: async ({ user }) => {
        const api = getTwitch(user);
        
        const { userId } = await api.getTokenInfo();
        
        if (!userId) throw new HttpsError('invalid-argument', 'User validation failed');

        try {
            const stream = await api.streams.getStreamByUserId(userId);

            if (!stream) return { success: false, message: 'Stream not live' };

            await api.clips.createClip({
                channel: userId,
            });

            return { success: true }
        } catch (error) {
            return { success: false, message: 'Failed to create clip' }
        }
    }
} as const satisfies tabzeroTool<typeof toolSchema>

