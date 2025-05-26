import { HttpsError, onCall } from 'firebase-functions/https';
import { TOOLS } from './tools';
import { firestore, openaiKey, twitchClientId, twitchClientSecret } from '../config';
import { tabzeroToolAction, tabzeroUser } from './types';

export const tool = onCall({ secrets: [twitchClientId, twitchClientSecret, openaiKey] }, async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'User must be authenticated');

    const { action } = request.data as { action: tabzeroToolAction };
    if (!action) throw new HttpsError('invalid-argument', 'Missing action');

    const userRef = firestore.collection('users').doc(request.auth.uid);
    const doc = await userRef.get();
    const user = doc.data() as tabzeroUser;

    if (user.providers.twitch.expires_in < Date.now()) {
        const url = [
			'https://id.twitch.tv/oauth2/token',
			`?client_id=${twitchClientId.value()}`,
			`&client_secret=${twitchClientSecret.value()}`,
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

    const toolsToRun = action.tools.map((tool) => ({
        id: tool.id,
        name: tool.details.name,
        arguments: JSON.parse(tool.details.arguments),
        tool: TOOLS.find((t) => t.name === tool.details.name),
    })).filter((tool) => !!tool.tool);

    const results = await Promise.all(toolsToRun.map((tool) => tool.tool?.function({ 
        ...tool.arguments,
        user
     })));

    const resultsMapped = results.map((result, index) => ({
        id: toolsToRun[index].id,
        result
    }));

    const logRef = userRef.collection('log').doc(action.id);
    const log = (await logRef.get()).data() as tabzeroToolAction;

    for (const result of resultsMapped) {
        const toolIndex = log.tools.findIndex((t) => t.id === result.id);
        if (toolIndex !== -1) {
            if (typeof result.result?.success !== 'undefined') {
                log.tools[toolIndex].status = result.result.success ? 'success' : 'error'
            } else {
                log.tools[toolIndex].status = 'error'
            }

            if (result.result?.tts) {
                log.tools[toolIndex].tts = result.result?.tts;
            }
        }
    }

    await logRef.update(log);

    return resultsMapped;

});