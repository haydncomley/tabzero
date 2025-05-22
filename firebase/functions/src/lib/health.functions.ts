import { HttpsError, onCall } from 'firebase-functions/v2/https';

export const ping = onCall(() => {
	return 'pong';
});

export const check = onCall((request) => {
	if (!request.auth) throw new HttpsError('unauthenticated', 'User must be authenticated');

	return 'authenticated';
});

export const health = onCall(() => {
	return 'ok';
});
