import { HttpsError, onCall } from 'firebase-functions/https';
import { createReadStream } from 'fs';
import { writeFile, remove } from 'fs-extra';
import { tmpdir } from 'os';
import { join } from 'path';
import { getOpenAI } from '../vendor/openai.vendor';
import { ChatCompletionMessageToolCall } from 'openai/resources/index.mjs';

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
        });

        return { text: response.text };
    } catch (err) {
        throw new HttpsError('internal', 'Failed to transcribe audio');
    } finally {
        await remove(tempPath).catch(() => {});
    }
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
            // TODO: Add tools
            tools: [
                {
                    type: 'function',
                    function: {
                        name: 'twitchEditChatSettings',
                        description: 'Edit settings within the twitch chat - emote only, slow mode and more.',
                        parameters: {
                            type: 'object',
                            properties: {
                                emoteOnly: { type: 'boolean' },
                                slowMode: { type: 'boolean' },
                            },
                            required: ['emoteOnly', 'slowMode'],
                            additionalProperties: false,
                        },
                        strict: true,
                    }
                }
            ]
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
