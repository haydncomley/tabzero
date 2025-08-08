import { z } from 'zod';
import { tabzeroTool } from '../../types';
import { HttpsError } from 'firebase-functions/https';
import { getTwitch } from '../../../vendor/twitch.vendor';
import { getOpenAI } from '../../../vendor/openai.vendor';

const toolSchema = z.object({});

export const twitchStreamUserCallout = {
	// LLM
	name: 'twitchStreamUserCallout',
	description:
		'Callout a random user in the chat, good for engagement and getting the audience involved.',
	parameters: toolSchema,
	scopes: ['twitch@chat:read'],
	clientDetails: () => {
		return {
			name: 'User Callout',
			context: `Finding victim...`,
		};
	},
	// User
	infoName: 'Twitch: User Callout',
	infoDescription: 'Callout a random user in the chat based on their messages.',
	// Action
	function: async ({ user, recentMessages }) => {
		const api = getTwitch(user);

		const { userId } = await api.getTokenInfo();
		if (!userId)
			throw new HttpsError('invalid-argument', 'User validation failed');

		if (!recentMessages?.length) {
			return { success: false, message: 'No users found in chat.' };
		}

		const openai = getOpenAI();

		const users = recentMessages?.map((m) => m.user);
		const randomUser = users?.[Math.floor(Math.random() * users.length)];

		const response = await openai.chat.completions.create({
			model: 'gpt-5',
			messages: [
				{
					role: 'system',
					content: `You are here to callout a user in chat for stream engagement. The generated response will be spoken out loud so keep it short and concise.
                    Dry humour and taking the piss out of the user is encouraged. Keep it gamer related and match their messages. If other users are interacting with them then also
                    use those as references. I want you to say their name and then speak as if you are the streamer talking to them, roast them and come up with a witty response.

					Recent Messages: 
					${recentMessages?.map((m) => `<user>${m.user}</user><message>${m.message}</message>`).join('\n')}
                    `,
				},
				{
					role: 'user',
					content: `Callout: ${randomUser}`,
				},
			],
		});

		const callout = response.choices[0].message.content;

		try {
			return {
				success: true,
				message: `Callout: ${randomUser}`,
				link: `https://www.twitch.tv/${randomUser}`,
				tts: callout ?? undefined,
			};
		} catch (error) {
			console.error(error);
			return { success: false, message: 'Something went wrong.' };
		}
	},
} as const satisfies tabzeroTool<typeof toolSchema>;
