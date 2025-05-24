import { HttpsError, onCall } from 'firebase-functions/https';
import { createReadStream } from 'fs';
import { writeFile, remove } from 'fs-extra';
import { tmpdir } from 'os';
import { join } from 'path';
import { getOpenAI } from '../vendor/openai.vendor';
import { ChatCompletionMessageToolCall } from 'openai/resources/index.mjs';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { TOOLS } from './tools';

export const aiChat = onCall(async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'User must be authenticated');

    const { prompt } = request.data;
    if (!prompt) throw new HttpsError('invalid-argument', 'Missing prompt');
    
    const openai = getOpenAI();
    const response = await openai.chat.completions.create({
        model: 'gpt-4.1',
        messages: [{ role: 'user', content: prompt }],
    });

    return {
        text: response.choices[0].message.content,
    };
});

const getToolSchema = (schema: z.ZodSchema) => zodToJsonSchema(schema);

export const aiTranscribe = onCall(async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'User must be authenticated');

    const { audio } = request.data;
    if (!audio) throw new HttpsError('invalid-argument', 'Missing audio');

    const openai = getOpenAI();
    const audioBuffer = Buffer.from(audio, 'base64');
    const tempPath = join(tmpdir(), 'audio.ogg');

    try {
        await writeFile(tempPath, audioBuffer);
        const response = await openai.audio.transcriptions.create({
            model: 'whisper-1',
            file: createReadStream(tempPath),
            language: 'en'
        });

        return { text: response.text };
    } catch (err) {
        throw new HttpsError('internal', 'Failed to transcribe audio');
    } finally {
        await remove(tempPath).catch(() => {});
    }
});

export const aiSpeak = onCall(async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'User must be authenticated');

    const { text } = request.data;
    if (!text) throw new HttpsError('invalid-argument', 'Missing text');

    const openai = getOpenAI();

    const mp3 = await openai.audio.speech.create({
        model: 'gpt-4o-mini-tts',
        voice: 'ballad',
        input: text,
        instructions: `Voice: Cringe, slightly warn out of breath, and a bit of a stutter - imagine you\'ve been playing video games for hours.
        Tone: Slightly exited and exaggerated, throw in some sarcasm.
        Dialect: American/British - somewhere in-between.
        Features: GenZ slang is a must, gaming terms are also appreciated - dry humour is encouraged. I want you to sound a bit like a young football commentator.
        `
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
   
    return {
      base64: buffer.toString('base64'),
      contentType: 'audio/mp3'
    };
});

export const aiToolResolver = onCall(async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'User must be authenticated');

    const { prompt } = request.data;
    if (!prompt) throw new HttpsError('invalid-argument', 'Missing prompt');

    const openai = getOpenAI();

    const checkIfToolIsNeeded = async (prompt: string, toolsAlreadyUsed: ChatCompletionMessageToolCall[]) => {
        const response = await openai.chat.completions.create({
            model: 'gpt-4.1-mini',
            messages: [
                { role: 'user', content: prompt },
                ...toolsAlreadyUsed.map((tool) => [
                    {
                        role: 'assistant' as const,
                        tool_calls: [tool],
                    },
                    {
                        role: 'tool' as const,
                        content: 'Tool finished. Do not call it again.',
                        tool_call_id: tool.id,
                        name: tool.function.name,
                    }
                ]).flat(),
            ],
            tools: TOOLS.map((tool) => ({
                type: 'function',
                function: {
                    name: tool.name,
                    description: tool.description,
                    parameters: getToolSchema(tool.parameters),
                    strict: true,
                }
            })),
        });

        return response.choices.map((choice) => choice.message.tool_calls ?? []).flat();
    }

    const tools: ChatCompletionMessageToolCall[] = [];

    while (true) {
        const toolsNeeded = await checkIfToolIsNeeded(prompt, tools);
        if (toolsNeeded.length === 0 || tools.length >= 5) break;

        tools.push(...toolsNeeded);
    }

    return {
        tools,
    };
});
