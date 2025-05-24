import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { FieldValue } from 'firebase-admin/firestore';
import { auth, CONFIG, firestore } from '../config';
import { TOOLS } from './tools';

export const authTwitch = onCall(() => {
	const scopes = TOOLS.map((tool) => tool.scopes).flat().filter((scope) => scope.startsWith('twitch')).map((scope) => scope.replace('twitch@', '')).join(' ');

	const url = [
		'https://id.twitch.tv/oauth2/authorize',
		`?client_id=${CONFIG.twitch.client_id}`,
		`&redirect_uri=${encodeURIComponent(CONFIG.twitch.redirect_uri)}`,
		'&response_type=code',
		`&scope=${scopes}`,
	].join('');

	return { url };
});

export const authTwitchCallback = onCall(async (request) => {
	try {
		const { code } = request.data as { code: string };

		if (!code) {
			throw new HttpsError('invalid-argument', 'Missing code parameter');
		}

		const url = [
			'https://id.twitch.tv/oauth2/token',
			`?client_id=${CONFIG.twitch.client_id}`,
			`&client_secret=${CONFIG.twitch.client_secret}`,
			`&code=${code}`,
			'&grant_type=authorization_code',
			`&redirect_uri=${CONFIG.twitch.redirect_uri}`,
		].join('');

		const tokenResp = await fetch(url, {
			method: 'POST',
		});
		const { access_token, refresh_token, scope } = await tokenResp.json();

		const userResp = await fetch('https://api.twitch.tv/helix/users', {
			headers: {
				'Client-ID': CONFIG.twitch.client_id,
				Authorization: `Bearer ${access_token}`,
			},
		});
		const { data } = await userResp.json();
		const user = data[0];
		const uid = `twitch:${user.id}`;
		const customToken = await auth.createCustomToken(uid);

		const userRef = firestore.collection('users').doc(uid);
		const doc = await userRef.get();

		await userRef.set(
			{
				uid,
				providers: {
					twitch: {
						id: user.id,
						login: user.login,
						display_name: user.display_name,
						profile_image_url: user.profile_image_url,
						offline_image_url: user.offline_image_url,
						created_at: user.created_at,
						access_token: access_token,
					},
				},
				provider: 'twitch',
				timestamp_last: FieldValue.serverTimestamp(),
				...(doc.exists
					? {}
					: { timestamp_created: FieldValue.serverTimestamp() }),
			},
			{ merge: true },
		);

		return {
			token: customToken,
			twitch: {
				access_token,
				refresh_token,
				scope,
			},
		};
	} catch (err) {
		console.error(err);
		throw new HttpsError('internal', 'Error Authentication', err);
	}
});
