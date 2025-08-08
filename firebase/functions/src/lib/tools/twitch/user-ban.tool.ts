import { z } from 'zod';
import { tabzeroTool } from '../../types';
import { HttpsError } from 'firebase-functions/https';
import { getTwitch } from '../../../vendor/twitch.vendor';
import { getOpenAI } from '../../../vendor/openai.vendor';

const toolSchema = z.object({
	context: z.string(),
});

export const twitchStreamUserBan = {
	// LLM
	name: 'twitchStreamUserBan',
	description: 'Ban a user from the chat.',
	parameters: toolSchema,
	scopes: ['twitch@chat:read', 'twitch@moderator:manage:banned_users'],
	clientDetails: () => {
		return {
			name: 'Ban User',
			context: `Thinking...`,
		};
	},
	// User
	infoName: 'Twitch: Ban User',
	infoDescription: 'Ban a user from the chat.',
	// Action
	function: async ({ user, recentMessages, context }) => {
		const api = getTwitch(user);

		const { userId } = await api.getTokenInfo();
		if (!userId)
			throw new HttpsError('invalid-argument', 'User validation failed');

		const openai = getOpenAI();

		const response = await openai.chat.completions.create({
			model: 'gpt-5-mini',
			messages: [
				{
					role: 'system',
					content: `You are here to ban a user from the chat. You will be provided a set of recent chat messages. These will be formatted as follows:
                    <user>username</user><message>message</message>

					Your job will be to find the user that the streamer has asked to be banned. You should find the user that is closest to the context provided, this might be a partial name match, or maybe hints to what the message contains, for example swears or links.
					Maybe the streamer will partially provided a username, for example "Ban Jordan" and the name could be "the_gamer_jordan".
					You should ONLY return the username of the user that the streamer has asked to be banned.
					You should NOT return any other information.

					Recent Messages: 
					${recentMessages?.map((m) => `<user>${m.user}</user><message>${m.message}</message>`).join('\n')}
                    `,
				},
				{
					role: 'user',
					content: context,
				},
			],
		});

		const userName = response.choices[0].message.content;
		const usernameExistsInMessages = recentMessages?.find(
			(m) => m.user.toLowerCase() === userName?.toLowerCase(),
		);

		if (!userName) {
			return { success: false, message: `User not found` };
		}

		if (!usernameExistsInMessages) {
			return { success: false, message: `User not found in chat` };
		}

		const userToBan = await api.users.getUserByName(userName);

		if (!userToBan) {
			return { success: false, message: `User details not found` };
		}

		try {
			await api.moderation.banUser(userId, {
				user: userToBan.id,
				reason: context,
			});
			return {
				success: true,
				message: `Banned: ${userName}`,
				link: `https://www.twitch.tv/${userName}`,
			};
		} catch (error) {
			console.error(error);
			return { success: false, message: 'Failed to ban user' };
		}
	},
} as const satisfies tabzeroTool<typeof toolSchema>;
