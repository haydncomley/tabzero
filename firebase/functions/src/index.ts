/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { CONFIG } from './config';

import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';

import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const app = initializeApp({
	credential: cert({
		clientEmail: CONFIG.google.client_email,
		privateKey: CONFIG.google.private_key,
		projectId: CONFIG.google.project_id,
	}),
});
const firestore = getFirestore(app);
const auth = getAuth(app);

export const helloWorld = onRequest((request, response) => {
	logger.info('Hello logs!', { structuredData: true });
	response.send('Hello from Firebase!');
});

export const authTwitch = onRequest((request, response) => {
	const { scopes } = request.query;

	if (!scopes) {
		response.status(400).send('Missing scopes');
		return;
	}

	const url = [
		'https://id.twitch.tv/oauth2/authorize',
		`?client_id=${CONFIG.twitch.client_id}`,
		`&redirect_uri=${encodeURIComponent(CONFIG.twitch.redirect_uri)}`,
		'&response_type=code',
		`&scope=${scopes}`,
	].join('');

	response.redirect(url);
});

export const authTwitchCallback = onRequest(async (req, res) => {
	try {
		const code = req.query.code;

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

		res.json({
			token: customToken,
			twitch: {
				access_token,
				refresh_token,
				scope,
			},
		});
	} catch (err) {
		console.error(err);
		res.status(500).send('Authentication Error');
	}
});
