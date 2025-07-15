import { z } from 'zod';
import { tabzeroTool } from '../../types';
import { HttpsError } from 'firebase-functions/https';
import { getOpenAI } from '../../../vendor/openai.vendor';

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
	infoDescription: 'Get answers back to general questions with a voice.',
	// Action
	function: async ({ question }) => {
		const openai = getOpenAI();

		const response = await openai.chat.completions.create({
			model: 'gpt-4.1-mini',
			messages: [
				{
					role: 'system',
					content: `You are here to answer the questions provided by the user. The user is a streamer so while you should be helpful your answer should also be engaging and humorous (think what would be good for a Twitch stream/YouTube video  - dark/sarcastic/dry humour is good)
                    This answer will also be spoken out loud so keep it short (like 5-10 seconds to speak max)`,
				},
				{
					role: 'user',
					content: question,
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
