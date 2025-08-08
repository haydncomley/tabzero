import { z } from 'zod';
import { tabzeroTool } from '../../types';
import { HttpsError } from 'firebase-functions/https';
import { getTwitch } from '../../../vendor/twitch.vendor';
import { getOpenAI } from '../../../vendor/openai.vendor';

const toolSchema = z.object({});

export const twitchStreamSummary = {
	// LLM
	name: 'twitchStreamSummary',
	description: 'A summary of how the stream is going so far',
	parameters: toolSchema,
	scopes: ['twitch@channel:manage:broadcast'],
	clientDetails: ({}) => ({
		name: 'Stream Summary',
		context: `Summarising...`,
	}),
	// User
	infoName: 'Twitch: Stream Summary',
	infoDescription: 'A summary of how the stream is going so far.',
	// Action
	function: async ({ user, recentMessages }) => {
		const api = getTwitch(user);

		const { userId } = await api.getTokenInfo();

		if (!userId)
			throw new HttpsError('invalid-argument', 'User validation failed');

		const stream = await api.streams.getStreamByUserId(userId);
		const thumbnail = stream?.getThumbnailUrl(1280, 720);

		if (!stream) return { success: false, message: 'Stream not live yet' };

		const openai = getOpenAI();

		const questionWithContext = `
			Viewers: ${stream.viewers}
			Game: ${stream.gameName}
			Title: ${stream.title}
			Streaming Time (in minutes): ${(Date.now() - stream.startDate.getTime()) / 60000}
			Recent Messages: \n${recentMessages?.map((m) => `${m.user}: ${m.message}`).join('\n') ?? 'None'}
			`;

		const response = await openai.chat.completions.create({
			model: 'gpt-5-mini',
			messages: [
				{
					role: 'system',
					content: `You are here to summarise the stream of the user. The user is a streamer so you should be engaging and humorous (think what would be good for a Twitch stream/YouTube video - dark/sarcastic/dry humour is good).
                    This answer will also be spoken out loud so keep it short (like 5-10 seconds to speak max)
                    You will get their viewer count, game/category, stream title, streaming time and some recent messages from chat. If things are going well then tell them, if things are not... well also tell them.`,
				},
				{
					role: 'user',
					content: thumbnail
						? [
								{
									type: 'text',
									text: questionWithContext,
								},
								{
									type: 'image_url',
									image_url: {
										url: thumbnail,
										detail: 'high',
									},
								},
							]
						: [
								{
									type: 'text',
									text: questionWithContext,
								},
							],
				},
			],
		});

		const summary = response.choices[0].message.content;
		if (summary) {
			return {
				success: true,
				tts: summary,
				message: `Summary at ${new Date().toLocaleString()}`,
			};
		} else {
			return { success: false, message: 'Summary failed to generate' };
		}
	},
} as const satisfies tabzeroTool<typeof toolSchema>;
