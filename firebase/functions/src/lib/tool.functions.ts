import { HttpsError, onCall } from 'firebase-functions/https';
import { ChatCompletionMessageToolCall } from 'openai/resources/index.mjs';
import { TOOLS } from './tools';
import { CONFIG, firestore } from '../config';
import { tabzeroUser } from './types';

export const tool = onCall(async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'User must be authenticated');

    const { tools } = request.data as { tools: ChatCompletionMessageToolCall[], token: string };
    if (!tools || !tools.length) throw new HttpsError('invalid-argument', 'Missing tools');

    const userRef = firestore.collection('users').doc(request.auth.uid);
    const doc = await userRef.get();
    const user = doc.data() as tabzeroUser;

    if (user.providers.twitch.expires_in < Date.now()) {
        const url = [
			'https://id.twitch.tv/oauth2/token',
			`?client_id=${CONFIG.twitch.client_id}`,
			`&client_secret=${CONFIG.twitch.client_secret}`,
			`&refresh_token=${user.providers[user.provider].refresh_token}`,
			'&grant_type=refresh_token'
		].join('');

		const tokenResp = await fetch(url, {
			method: 'POST',
		});
		const { access_token, refresh_token, expires_in } = await tokenResp.json();

        await userRef.update({
            'providers.twitch.access_token': access_token,
            'providers.twitch.refresh_token': refresh_token,
            'providers.twitch.expires_in': Date.now() + ((expires_in - 60) * 1000),
        })

        user.providers.twitch.access_token = access_token;
        user.providers.twitch.refresh_token = refresh_token;
        user.providers.twitch.expires_in = Date.now() + ((expires_in - 60) * 1000);
    }

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