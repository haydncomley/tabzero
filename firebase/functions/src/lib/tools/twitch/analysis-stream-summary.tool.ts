import { z } from "zod";
import { tabzeroTool } from "../../types";
import { HttpsError } from "firebase-functions/https";
import { getTwitch } from "../../../vendor/twitch.vendor";
import { getOpenAI } from "../../../vendor/openai.vendor";

const toolSchema = z.object({})

export const twitchStreamSummary = {
    // LLM
    name: 'twitchStreamSummary',
    description: 'A summary of how the stream is going so far',
    parameters: toolSchema,
    scopes: ['twitch@channel:manage:broadcast'],
    clientDetails: ({}) => ({
        name: "Stream Summary",
        context: `Summary at ${new Date().toLocaleString()}.`
    }),
    // User
    infoName: 'Twitch: Stream Summary',
    infoDescription: 'A summary of how the stream is going so far.',
    // Action
    function: async ({ user }) => {
        const api = getTwitch(user);
        
        const { userId } = await api.getTokenInfo();
        
        if (!userId) throw new HttpsError('invalid-argument', 'User validation failed');

        const stream = await api.streams.getStreamByUserId(userId);

        if (!stream) return { success: false, message: 'Stream not live yet' };

        const openai = getOpenAI();

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: `You are here to summarise the stream of the user. The user is a streamer so you should be engaging and humorous (think what would be good for a Twitch stream/YouTube video - dark/sarcastic/dry humour is good).
                    This answer will also be spoken out loud so keep it short (like 5-15 seconds to speak max)
                    You will get their viewer count, game/category, stream title and streaming time. If things are going well then tell them, if things are not... well also tell them.`
                },
                {
                    role: 'user',
                    content: `
                    Viewers: ${stream.viewers}
                    Game: ${stream.gameName}
                    Title: ${stream.title}
                    Streaming Time (in minutes): ${ (Date.now() - stream.startDate.getTime()) / 60000}
                    `
                }
            ],
        });

        const summary = response.choices[0].message.content;
        if (summary) {
            return { success: true, tts: summary };
        } else {
            return { success: false, message: 'Summary failed to generate' };
        }
    }
} as const satisfies tabzeroTool<typeof toolSchema>

