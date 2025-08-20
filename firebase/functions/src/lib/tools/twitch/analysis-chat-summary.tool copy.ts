import { z } from 'zod';
import { tabzeroTool } from '../../types';
import { HttpsError } from 'firebase-functions/https';
import { getTwitch } from '../../../vendor/twitch.vendor';
import { getOpenAI } from '../../../vendor/openai.vendor';

const toolSchema = z.object({
	question: z.string(),
});

export const twitchStreamChatSummary = {
	// LLM
	name: 'twitchChatSummary',
	description:
		'Answer on behalf of all the Twitch viewers, or summarise the chats messages. Should be used when the Streamer asks for "Chats thoughts", or asks a question to chat. E.g. "What does chat think about this game?", "Chat, is this an L or a W?"',
	parameters: toolSchema,
	scopes: [
		'twitch@channel:manage:broadcast',
		'twitch@moderator:manage:chat_settings',
	],
	clientDetails: ({}) => ({
		name: 'Chat Summary',
		context: `Summarising...`,
	}),
	// User
	infoName: 'Twitch: Ask Chat',
	infoDescription:
		'Ask chat a question and get a response on behalf of all the viewers',
	// Action
	function: async ({ user, recentMessages, question }) => {
		const api = getTwitch(user);

		const { userId } = await api.getTokenInfo();

		if (!userId)
			throw new HttpsError('invalid-argument', 'User validation failed');

		const stream = await api.streams.getStreamByUserId(userId);
		const thumbnail = stream?.getThumbnailUrl(1280, 720);

		if (!stream) return { success: false, message: 'Stream not live yet' };

		const openai = getOpenAI();

		const questionWithContext = `
			Streamers Question: ${question}
			Title: ${stream.title}
			Game: ${stream.gameName}
			Viewer Count: ${stream.viewers}
			Recent Messages: \n${recentMessages?.map((m) => `${m.user}: ${m.message}`).join('\n') ?? 'None'}
			`;

		const response = await openai.chat.completions.create({
			model: 'gpt-5-nano',
			messages: [
				{
					role: 'system',
					content: `You are here to answer questions on behalf of all the Twitch viewers.
                    You will get their viewer count, game/category, stream title and some recent messages from chat.
                    You should answer back to the streamer as if you are the chat. This means either answering there question, or responding as a chat member.
					E.g. If the streamer asks "What does chat think of this game" and people have been sayings its good then reply with something like "Chat thinks this game looks like fun"., if the streamer asks "Chat is this an L or a W?", use the context clues to answer something like "This game is such an L and you suck at playing it"
					
					Responses should ALWAYS been in the first person as if you are the chat. You should not "summarise" in the typical way, imagine you are the chat, you are a member of chat. You should reply as if you are sending a chat message.
					Keep it similar to the viewers messages, but in the first person. Make sure it sounds like Twitch chat viewer is talking to the streamer.`,
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
				message: `Chat Summary at ${new Date().toLocaleString()}`,
			};
		} else {
			return { success: false, message: 'Failed to summarise chat' };
		}
	},
} as const satisfies tabzeroTool<typeof toolSchema>;
