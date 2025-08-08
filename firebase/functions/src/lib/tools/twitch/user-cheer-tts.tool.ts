import { z } from 'zod';
import { tabzeroTool } from '../../types';
import { HttpsError } from 'firebase-functions/https';
import { getTwitch } from '../../../vendor/twitch.vendor';
import { getOpenAI } from '../../../vendor/openai.vendor';

const toolSchema = z.object({
	chatUser: z.string(),
	chatMessage: z.string(),
});

export const twitchStreamUserCheerTTS = {
	// LLM
	name: 'twitchStreamUserCheerTTS',
	description:
		'When a user cheers, the AI will speak out loud and say something witty and funny based on their message.',
	parameters: toolSchema,
	scopes: [],
	clientDetails: () => {
		return {
			name: 'User Cheer TTS',
			context: `Thinking...`,
		};
	},
	// User
	infoName: 'Twitch: User Cheer TTS',
	infoDescription:
		'When a user cheers, the AI will speak out loud their message.',
	// Action
	function: async ({ user, chatUser, chatMessage }) => {
		const api = getTwitch(user);

		const { userId } = await api.getTokenInfo();
		if (!userId)
			throw new HttpsError('invalid-argument', 'User validation failed');

		const openai = getOpenAI();

		const response = await openai.chat.completions.create({
			model: 'gpt-5',
			messages: [
				{
					role: 'system',
					content: `A user has cheered in chat, this means that they have spent points in order to have their message spoken out loud.
                    You should speak out loud their message on their behalf, you are talking to the streamer. Make sure to read their name out and then their message.
                    If the message is a question, then answer it in a witty and funny way - remember to keep it short and concise and entertaining for the stream.
                    
                    Example: "haydncomley said 'This stream is so good and you rock!':
                    Example: "haydncomley said 'Why are you so bad at the game?, I think he should stop back-seat gaming and get good himself!':
                    `,
				},
				{
					role: 'user',
					content: `Cheer: ${chatUser} - ${chatMessage}`,
				},
			],
		});

		const reply = response.choices[0].message.content;

		try {
			return {
				success: true,
				message: `Cheer: ${chatUser}`,
				link: `https://www.twitch.tv/${chatUser}`,
				tts: reply ?? undefined,
			};
		} catch (error) {
			console.error(error);
			return { success: false, message: 'Something went wrong.' };
		}
	},
} as const satisfies tabzeroTool<typeof toolSchema>;
