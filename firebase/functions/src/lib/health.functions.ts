import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { CONFIG } from '../config';
import { TOOLS } from './tools';

export const metaVersion = onCall(() => {
	return { version: CONFIG.version };
});

export const metaCapabilities = onCall(async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'User must be authenticated');

    return TOOLS.map((tool) => ({
        name: tool.infoName,
        description: tool.infoDescription,
    }));
});