/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { CONFIG } from './config';

import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const app = initializeApp({
  credential: cert({
    clientEmail: 'firebase-adminsdk-fbsvc@tabzero-ai.iam.gserviceaccount.com',
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCpcfY85OEinH3i\ntOKNdoIF4K2C4KpNf9Y1dqEO2E+ObQLyJguB4RqOshZWVdE3Y6pN/8r/dkOG2Ftq\n4eal7jwXP7QQbS6yt3Se5TLjDoY2ywaI0TnSHtuX2RzO86he6AOmUMcY+qU78VCF\nlqqa8aqQ29yUr7o0/c1Dah/x4Aog9idwq7NlV/lJtNYNE0yi3TrUOCv6qMU7ml2j\ney6Tg1fDdGbLbh5XJ0K92zv+pW2uCzRZbiH0ysE3qVDbVv0K21OcAqekMMgnUyLx\nfdUKXpr1bmZuDDXS88Xc+CR+PXeDoMSRraoshcYVsQeU9GM7tWuc+npg8uOhwE/m\nXz9KWmN7AgMBAAECggEABH6v7AScTkk9c6advefvYg2IPMkN63lhKtDnS9gEIECX\nC+pjcsIQbMmfmxGyt5fuvBv1fBpchza1EhxE/JDZyjoX4jmrO/Vu5Aorc+d+OvTe\nywFV2dOUuq35PCothLr94csRxQFdIb5whuKsyuhvQGF8s/sHYwF6kPe/OjDZw+8I\ni9TgZvu9Lpa/R7AhwFd7BLqTP7XbnIKLMWZNh5XG8csg0RlEhdvaE5i6sAoy+E/O\nsmyCLqWY6SSmdWLEF8a6AlRZRd+j+28lznAJCAuLyYOXGkMsy9rnijlpN05z9PO1\nmsoK18bhPzXJtxTbvWNFv4fkiQDaNK/SBW4RphRVVQKBgQDvOUuOTPtTR9iCOXhM\nB/4vLjz/OLc4lfD8I72182HsPXZjo/JQIheNl4uUfZQYHMIKO1Lsv1+gfb5Q2oa6\nQ31iAraxB+ETFdGmQJs9CXlbfYbmp3BDYNIoxGZYzGpnquG6/luDN2VFlnZS0sEP\nBSJXXEXj4Gi5f2cVevdJlAOCRwKBgQC1U/Q/U68o3gPPh2oyYWiG8Ta9+yLCHpuC\nWEbed7zqTFTy/x+uPBMHxDIDuAKIqbBjSp7DW+JSKv/lH8b8rhDjYW9c2GdKARFk\nTtZzLaYsr0okR4/v8CaP5dkTOk2vaOIAcirQ6h+wRHhXtrQztSMSqXSYuelVRg26\n71Tz2YkbLQKBgQDc2x+3U7kgbQ8lQxudzi9MrbqgwmLdegjPL8wg5H7+VMwtN5op\ngyANl+DEiZ+lFz/JpHVtn00Q5aZEDUwfQNnMF8dE74pLTXSNsc3gbxO8dMqLvf/2\nJLhB7Pi0eJyv8uKN+fDQ1t7HfR7mXi7gyBOpZcYcmPz2bPnlqe4N3vnSVwKBgGki\nCiWFcbNyNidnTi1zyNUkmibAq0B92pBSepSWPBRkuYRCY63z6ty/5ne9gsqWCE0p\ngK+oYKpfgArqx8bNbcFIRvdACXMg92J/S1twhj62S3iJfW0SgmlATQIW9d/UIeU8\nTJLgjAr5SAUjS4wHZBR358B9Wko02dUe2tSfthzpAoGBAIwMUJ4NC/4okJWg19Hw\nI8mQK7xTEo/iYGy9ABKFaJjb7fJRLEHp1Ew2ifOJPAFqV77fMbOCCkwXdaemNdmi\n3RtM3KrDqs0W234+BEwBapnkUFzbwnLf7BjchS/ywJPyue8ItJB6scUQZlMLiNkd\nmzdZNUTr4txNZ3Fo8LN7FelA\n-----END PRIVATE KEY-----\n",
    projectId: 'tabzero-ai',
  })
});
const firestore = getFirestore(app);
const auth = getAuth(app);

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

// Kick off OAuth flow
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

// Handle callback, mint token, upsert user
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
    const { 
      access_token,
      refresh_token,
      scope
     } = await tokenResp.json();

    const userResp = await fetch('https://api.twitch.tv/helix/users', {
      headers: {
        'Client-ID': CONFIG.twitch.client_id,
        'Authorization': `Bearer ${access_token}`,
      },
    });
    const { data } = await userResp.json();
    const user = data[0];
    const uid = `twitch:${user.id}`;
    const customToken = await auth.createCustomToken(uid);

    await firestore.collection('users').doc(uid).set({
      uid,
      providers: {
        twitch: {
          id: user.id,
          login: user.login,
          display_name: user.display_name,
          profile_image_url: user.profile_image_url,
          offline_image_url: user.offline_image_url,
          created_at: user.created_at,
        }
      },
      provider: 'twitch',
      timestamp_last: FieldValue.serverTimestamp(),
      timestamp_created: FieldValue.serverTimestamp(),
    }, { merge: true });

    res.json({ 
      token: customToken,
      twitch: {
				access_token,
				refresh_token,
				scope,
			}
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Auth error');
  }
});