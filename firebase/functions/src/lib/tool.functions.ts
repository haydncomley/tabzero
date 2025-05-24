import { HttpsError, onCall } from 'firebase-functions/https';
import { ChatCompletionMessageToolCall } from 'openai/resources/index.mjs';
import { TOOLS } from './tools';

export const tool = onCall(async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'User must be authenticated');

    const { tools, token } = request.data as { tools: ChatCompletionMessageToolCall[], token: string };
    if (!tools || !tools.length) throw new HttpsError('invalid-argument', 'Missing tools');

    const toolsToRun = tools.map((tool) => ({
        id: tool.id,
        name: tool.function.name,
        arguments: JSON.parse(tool.function.arguments),
        tool: TOOLS.find((t) => t.name === tool.function.name),
    })).filter((tool) => !!tool.tool);

    const results = await Promise.all(toolsToRun.map((tool) => tool.tool?.function({ 
        ...tool.arguments,
        token,
     })));

    return results;

});