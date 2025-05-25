import { HttpsError, onCall } from 'firebase-functions/v2/https';
import packageJson from '../../package.json';

export const version = onCall(() => {
	return packageJson.version;
});

export const check = onCall((request) => {
	if (!request.auth)
		throw new HttpsError('unauthenticated', 'User must be authenticated');

	return 'authenticated';
});

export const health = onCall(() => {
	return 'ok';
});
