import { onCall } from 'firebase-functions/v2/https';
import { CONFIG } from '../config';

export const metaVersion = onCall(() => {
	return { version: CONFIG.version };
});

// export const check = onCall((request) => {
// 	if (!request.auth)
// 		throw new HttpsError('unauthenticated', 'User must be authenticated');

// 	return 'authenticated';
// });

// export const health = onCall(() => {
// 	return 'ok';
// });
