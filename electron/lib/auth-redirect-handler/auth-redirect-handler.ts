import type { BrowserWindow } from 'electron';
import { app } from 'electron';

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

	if (!code || !scope) return 'no scope or code';

	const repsonse = await fetch(
		`https://authtwitchcallback-xcnznm7gbq-uc.a.run.app/authTwitchCallback?code=${code}`,
	);
	const data = await repsonse.json();

	if (!data.token || !data.twitch) {
		return 'token and twitch not found';
	}

	window.webContents.send('auth', data);
};

export const initAuthRedirectHandler = (window: BrowserWindow) => {
	app.setAsDefaultProtocolClient(PROTOCOL);
	app.on('open-url', async (_event, rawUrl) => {
		handleProtocolUrl(window, rawUrl);
	});
};
