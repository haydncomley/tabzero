import { HttpsError, onCall } from 'firebase-functions/https';
import { createReadStream } from 'fs';
import { writeFile, remove } from 'fs-extra';
import { tmpdir } from 'os';
import { join } from 'path';
import { getOpenAI } from '../vendor/openai.vendor';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { TOOLS } from './tools';
import {
	firestore,
	langfuseHost,
	langfuseKey,
	langfusePublicKey,
	MAX_INSTANCES,
	MIN_INSTANCES,
	openaiKey,
} from '../config';
import { FieldValue } from 'firebase-admin/firestore';
import { tabzeroUser } from './types';
import { ChatCompletionMessageToolCall, ChatCompletion } from 'openai/resources/chat/completions.js';

export const aiChat = onCall(
	{
		secrets: [openaiKey, langfuseKey, langfusePublicKey, langfuseHost],
	},
	async (request) => {
		if (!request.auth)
			throw new HttpsError('unauthenticated', 'User must be authenticated');

		const { prompt } = request.data;
		if (!prompt) throw new HttpsError('invalid-argument', 'Missing prompt');

		const openai = getOpenAI();
		const response = await openai.chat.completions.create({
			model: 'gpt-5-mini',
			messages: [{ role: 'user', content: prompt }],
		});

		return {
			text: response.choices[0].message.content,
		};
	},
);

const getToolSchema = (schema: z.ZodSchema) => zodToJsonSchema(schema);

export const aiTranscribe = onCall(
	{
		secrets: [openaiKey, langfuseKey, langfusePublicKey, langfuseHost],
		minInstances: MIN_INSTANCES,
		maxInstances: MAX_INSTANCES,
	},
	async (request) => {
		if (!request.auth)
			throw new HttpsError('unauthenticated', 'User must be authenticated');

		const { audio, format = 'wav' } = request.data;
		if (!audio) throw new HttpsError('invalid-argument', 'Missing audio');

		const openai = getOpenAI();
		
		try {
			// GPT-4o mini supports audio input through chat completions API
			// The audio needs to be in base64 format
			
			// Use GPT-4o mini with audio input capability
			const response = await openai.chat.completions.create({
				model: 'gpt-4o-mini',
				messages: [
					{
						role: 'user',
						content: [
							{
								type: 'text',
								text: 'Please transcribe the following audio accurately. Return only the transcription without any additional commentary.',
							},
							{
								type: 'input_audio',
								input_audio: {
									data: audio,
									format: format,
								},
							},
						],
					},
				],
				// Enable audio transcription mode
				modalities: ['text'],
				audio: {
					voice: 'alloy',
					format: 'wav',
				},
			});

			const transcription = response.choices[0].message.content;
			
			return { 
				text: transcription,
				model: 'gpt-4o-mini',
				usage: response.usage,
			};
		} catch (err) {
			console.error('Transcription error:', err);
			
			// Fallback to Whisper if GPT-4o mini audio fails
			try {
				const audioBuffer = Buffer.from(audio, 'base64');
				const tempPath = join(tmpdir(), `audio.${format}`);
				
				await writeFile(tempPath, audioBuffer);
				const whisperResponse = await openai.audio.transcriptions.create({
					model: 'whisper-1',
					file: createReadStream(tempPath),
					language: 'en',
				});
				
				await remove(tempPath).catch(() => {});
				
				return { 
					text: whisperResponse.text,
					model: 'whisper-1',
					fallback: true,
				};
			} catch (fallbackErr) {
				throw new HttpsError('internal', 'Failed to transcribe audio');
			}
		}
	},
);

export const aiSpeak = onCall(
	{
		secrets: [openaiKey, langfuseKey, langfusePublicKey, langfuseHost],
		minInstances: MIN_INSTANCES,
		maxInstances: MAX_INSTANCES,
	},
	async (request) => {
		if (!request.auth)
			throw new HttpsError('unauthenticated', 'User must be authenticated');

		const { text } = request.data;
		if (!text) throw new HttpsError('invalid-argument', 'Missing text');

		const user = await firestore
			.collection('users')
			.doc(request.auth.uid)
			.get();

		const userData = user.exists ? (user.data() as tabzeroUser) : null;
		const isMale = userData?.preferences?.voiceGender !== 'female';
		const tone =
			userData?.preferences?.voiceTone ??
			`Voice: Cringe, higher pitched, slightly out of breath and a bit of a stutter.
        Tone: Exited and exaggerated, very sarcastic.
        Dialect: American/British - somewhere in-between.
        Features: GenZ slang is a must, gaming terms are also appreciated - dry humour is encouraged. I want you to sound a bit like a young football commentator.
        `;

		const openai = getOpenAI();

		const mp3 = await openai.audio.speech.create({
			model: 'gpt-4o-mini-tts',
			voice: isMale ? 'verse' : 'sage',
			input: text,
			instructions: tone,
		});

		const buffer = Buffer.from(await mp3.arrayBuffer());

		return {
			base64: buffer.toString('base64'),
			contentType: 'audio/mp3',
		};
	},
);

export const aiToolResolver = onCall(
	{
		secrets: [openaiKey, langfuseKey, langfusePublicKey, langfuseHost],
		minInstances: MIN_INSTANCES,
		maxInstances: MAX_INSTANCES,
	},
	async (request) => {
		if (!request.auth)
			throw new HttpsError('unauthenticated', 'User must be authenticated');

		const { prompt } = request.data;
		if (!prompt) throw new HttpsError('invalid-argument', 'Missing prompt');

		const openai = getOpenAI();

		const checkIfToolIsNeeded = async (
			prompt: string,
			toolsAlreadyUsed: ChatCompletionMessageToolCall[],
		) => {
			const response: ChatCompletion = await openai.chat.completions.create({
				model: 'gpt-5-nano',
				reasoning_effort: prompt.length < 50 ? 'minimal' : 'medium',
				max_completion_tokens: prompt.length < 50 ? 256 : undefined,
				parallel_tool_calls: true,
				messages: [
					{ role: 'user', content: prompt },
					...toolsAlreadyUsed
						.filter((tool) => tool.type === 'function')
						.map((tool) => [
							{
								role: 'assistant' as const,
								tool_calls: [tool],
							},
							{
								role: 'tool' as const,
								content: 'Tool finished. Do not call it again.',
								tool_call_id: tool.id,
								name: tool.function.name,
							},
						])
						.flat(),
				],
				tools: TOOLS.map((tool) => ({
					type: 'function',
					function: {
						name: tool.name,
						description: tool.description,
						parameters: getToolSchema(tool.parameters),
						strict: true,
					},
				})),
			});

			return response.choices
				.map((choice) => choice.message.tool_calls ?? [])
				.flat();
		};

		const tools: ChatCompletionMessageToolCall[] = [];

		while (true) {
			const toolsNeeded = await checkIfToolIsNeeded(prompt, tools);
			if (toolsNeeded.length === 0 || tools.length >= 5) break;

			tools.push(...toolsNeeded);
		}

		const userRef = firestore.collection('users').doc(request.auth.uid);
		const logRef = userRef.collection('log').doc();

		const toolAction = {
			id: logRef.id,
			name: 'Transcription',
			text: prompt,
			timestamp: FieldValue.serverTimestamp(),
			tools: tools.filter((tool) => tool.type === 'function').map((tool) => ({
				...TOOLS.find((t) => t.name === tool.function.name)?.clientDetails(
					JSON.parse(tool.function.arguments),
				),
				id: tool.id,
				status: 'pending',
				details: tool.function,
			})),
		};

		await logRef.set(toolAction);

		return {
			action: toolAction,
		};
	},
);
