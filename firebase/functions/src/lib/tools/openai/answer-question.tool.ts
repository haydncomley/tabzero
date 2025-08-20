import { z } from 'zod';
import { tabzeroTool } from '../../types';
import { HttpsError } from 'firebase-functions/https';
import { getOpenAI } from '../../../vendor/openai.vendor';
import { getTwitch } from '../../../vendor/twitch.vendor';

const toolSchema = z.object({
	question: z.string(),
});

export const openaiAnswerQuestion = {
	// LLM
	name: 'openaiAnswerQuestion',
	description:
		'Answer any questions the streamer may have or provide general information.',
	parameters: toolSchema,
	scopes: [],
	clientDetails: ({ question }) => ({
		name: 'Question',
		context: `Thinking about "${question}"`,
	}),
	// User
	infoName: 'General: Answer Questions',
	infoDescription: 'Get spoken answers back to questions.',
	// Action
	function: async ({ user, question, recentMessages }) => {
		const openai = getOpenAI();
		const twitch = getTwitch(user);
		const { userId } = await twitch.getTokenInfo();

		if (!userId)
			throw new HttpsError('invalid-argument', 'User validation failed');

		const stream = await twitch.streams.getStreamByUserId(userId);
		const thumbnail = stream?.getThumbnailUrl(1280, 720);

		const questionWithContext = `
		Streamers Question: ${question}
		Viewers: ${stream?.viewers ?? 'Unknown'}
		Game: ${stream?.gameName ?? 'Unknown'}
		Title: ${stream?.title ?? 'Unknown'}
		Streaming Time (in minutes): ${stream?.startDate ? (Date.now() - stream.startDate.getTime()) / 60000 : 'Unknown'}
		Recent Messages: \n${recentMessages?.map((m) => `${m.user}: ${m.message}`).join('\n') ?? 'None'}`;

		const response = await openai.chat.completions.create({
			model: 'gpt-5-nano',
			messages: [
				{
					role: 'system',
					content: `You are here to answer the questions provided by the user. The user is a streamer so while you should be helpful your answer should also be engaging and humorous (think what would be good for a Twitch stream/YouTube video  - dark/sarcastic/dry humour is good)
                    This answer will also be spoken out loud so keep it short (like 5-10 seconds to speak max) - you may also be provided a screenshot of the streamers screen - if you do then you should use this for extra context. You are encouraged to comment on what is on screen if it is provided.`,
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

		const answer = response.choices[0].message.content;

		try {
			if (answer) {
				return { success: true, tts: answer, message: `"${question}"` };
			} else {
				return { success: false, message: 'Failed to generate answer' };
			}
		} catch (error) {
			console.error(error);
			throw new HttpsError('internal', 'Failed to answer question');
		}
	},
} as const satisfies tabzeroTool<typeof toolSchema>;
