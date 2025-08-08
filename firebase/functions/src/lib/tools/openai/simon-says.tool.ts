import { z } from 'zod';
import { tabzeroTool } from '../../types';
import { HttpsError } from 'firebase-functions/https';
import { getOpenAI } from '../../../vendor/openai.vendor';

const toolSchema = z.object({
	prompt: z.string(),
});

export const openaiSimonSays = {
	// LLM
	name: 'openaiSimonSays',
	description:
		'Simon says... This tool should just repeat back what the user is asking for it to say, like a parrot. E.g. Simon Says: "Hello, how are you doing today?", your reply with "Hello, how are you doing today?"',
	parameters: toolSchema,
	scopes: [],
	clientDetails: ({ prompt }) => ({
		name: 'Simon Says',
		context: `Simon says... "${prompt}"`,
	}),
	// User
	infoName: 'General: Simon Says',
	infoDescription: 'Your handy AI assistant that repeats back what you say.',
	// Action
	function: async ({ prompt }) => {
		const openai = getOpenAI();

		const response = await openai.chat.completions.create({
			model: 'gpt-5-mini',
			messages: [
				{
					role: 'system',
					content: `You are a helpful assistant that repeats back what the user says.`,
				},
				{
					role: 'user',
					content: [
						{
							type: 'text',
							text: prompt,
						},
					],
				},
			],
		});

		const answer = response.choices[0].message.content;

		try {
			if (answer) {
				return {
					success: true,
					tts: answer,
					message: `"${answer}"`,
				};
			} else {
				return { success: false, message: 'Something went wrong.' };
			}
		} catch (error) {
			console.error(error);
			throw new HttpsError('internal', 'Something went wrong.');
		}
	},
} as const satisfies tabzeroTool<typeof toolSchema>;
