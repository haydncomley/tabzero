import { WebSocketServer } from 'ws';
import type { BrowserWindow } from 'electron';
import { ipcMain } from 'electron';
import { storeSet } from '../store-handler';

const PORT = 51109;

export const initStreamDeckHandler = (window: BrowserWindow) => {
	const wss = new WebSocketServer({ port: PORT, perMessageDeflate: false });
	storeSet(window, 'streamDeck', false);

	ipcMain.handle(
		'send-to-stream-deck',
		(_, options: { isListening: boolean; isLoading: boolean }) => {
			wss.clients.forEach((client) => {
				if (client.readyState === 1) {
					client.send(JSON.stringify(options));
				}
			});
		},
	);

	wss.on('error', (error) => {
		console.error('[WS] Error:', error);
		storeSet(window, 'streamDeck', false);
	});

	wss.on('connection', (socket) => {
		console.log('[WS] Plugin connected');
		storeSet(window, 'streamDeck', true);

		socket.on('message', (message) => {
			const actionName = message.toString();
			switch (actionName) {
				case 'toggleRecording':
					window.webContents.send('hotkey', 'toggleRecording');
					break;
				case 'clipStream':
					window.webContents.send('hotkey', 'clipStream');
					break;
			}
		});

		socket.on('close', () => {
			console.log('[WS] Plugin disconnected');
			storeSet(window, 'streamDeck', false);
		});
	});
};
