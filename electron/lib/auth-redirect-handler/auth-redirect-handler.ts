import type { BrowserWindow } from 'electron';
import { app } from 'electron';
import { storeSet } from '../store-handler';

export const PROTOCOL = 'tabzero';

export const handleProtocolUrl = async (
	window: BrowserWindow,
	rawUrl: string,
) => {
	const url = new URL(rawUrl);
	if (!url.protocol.startsWith(PROTOCOL)) return 'not a valid url';

	const searchParams = new URLSearchParams(url.search);
	const code = searchParams.get('code');
	const scope = searchParams.get('scope');
	const ref = searchParams.get('referral');

	if (!code || !scope) return 'no scope or code';
	if (ref) storeSet(window, 'referral', ref);

	window.webContents.send('auth', { code, scope });
};

export const initAuthRedirectHandler = (window: BrowserWindow) => {
	app.setAsDefaultProtocolClient(PROTOCOL);
	app.on('open-url', async (_event, rawUrl) => {
		handleProtocolUrl(window, rawUrl);
	});
};
