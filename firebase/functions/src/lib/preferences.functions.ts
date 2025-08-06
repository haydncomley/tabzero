import { HttpsError, onCall } from 'firebase-functions/https';
import { firestore } from '../config';

export const preferencesVoice = onCall(
	{
		secrets: [],
	},
	async (request) => {
		if (!request.auth)
			throw new HttpsError('unauthenticated', 'User must be authenticated');

		const data = request.data as undefined | { tone?: string; gender?: string };

		if (!data)
			throw new HttpsError('invalid-argument', 'Missing voice details');

		const user = await firestore
			.collection('users')
			.doc(request.auth.uid)
			.get();

		if (!user.exists) throw new HttpsError('not-found', 'User not found');

		await user.ref.update({
			'preferences.voiceTone': data.tone ?? null,
			'preferences.voiceGender': data.gender ?? null,
		});

		return { success: true, message: 'Voice preferences updated' };
	},
);
