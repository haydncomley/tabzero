import { HttpsError, onCall } from 'firebase-functions/https';
import { ChatCompletionMessageToolCall } from 'openai/resources/index.mjs';
import { TOOLS } from './tools';
import { firestore } from '../config';
import { tabzeroUser } from './types';

export const tool = onCall(async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'User must be authenticated');

    const { tools } = request.data as { tools: ChatCompletionMessageToolCall[], token: string };
    if (!tools || !tools.length) throw new HttpsError('invalid-argument', 'Missing tools');

    const userRef = firestore.collection('users').doc(request.auth.uid);
    const doc = await userRef.get();
    const user = doc.data() as tabzeroUser;

    const toolsToRun = tools.map((tool) => ({
        id: tool.id,
        name: tool.function.name,
        arguments: JSON.parse(tool.function.arguments),
        tool: TOOLS.find((t) => t.name === tool.function.name),
    })).filter((tool) => !!tool.tool);

    const results = await Promise.all(toolsToRun.map((tool) => tool.tool?.function({ 
        ...tool.arguments,
        user
     })));
    const resultsMapped = results.map((result, index) => ({
        id: toolsToRun[index].id,
        result
    }));

    return resultsMapped;

});