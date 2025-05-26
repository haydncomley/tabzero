import { app, BrowserWindow } from 'electron';
import { updateElectronApp, UpdateSourceType } from 'update-electron-app';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { initLinkHandler } from './lib/external-link-handler';
import {
	handleProtocolUrl,
	initAuthRedirectHandler,
	PROTOCOL,
} from './lib/auth-redirect-handler';
import { initHotkeyHandler } from './lib/hotkey-handler';
import { initStoreHandler } from './lib/store-handler';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.setAppUserModelId('com.haydncom.tabzero');
if (require('electron-squirrel-startup')) app.quit();

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..');

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
	? path.join(process.env.APP_ROOT, 'public')
	: RENDERER_DIST;

let win: BrowserWindow | null;

updateElectronApp();

function createWindow() {
	win = new BrowserWindow({
		icon: path.join(process.env.VITE_PUBLIC, 'icon.png'),
		webPreferences: {
			preload: path.join(__dirname, 'preload.mjs'),
			webSecurity: false,
		},
		autoHideMenuBar: true,
	});

	// Test active push message to Renderer-process.
	win.webContents.on('did-finish-load', () => {
		win?.webContents.send('main-process-message', { hello: 'world' });
	});

	if (VITE_DEV_SERVER_URL) {
		win.loadURL(VITE_DEV_SERVER_URL);
	} else {
		// win.loadFile('dist/index.html')
		win.loadFile(path.join(RENDERER_DIST, 'index.html'));
	}

	initAuthRedirectHandler(win);
	initHotkeyHandler(win);
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
		win = null;
	}
});

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

initStoreHandler();
initLinkHandler();

if (!app.requestSingleInstanceLock()) {
	app.quit();
} else {
	const handleArgs = async (argv: string[]) => {
		if (!win) return;
		const url = argv.find((arg) => arg.startsWith(`${PROTOCOL}://`));
		if (!url) return;
		handleProtocolUrl(win, url);
	};

	app.on('second-instance', (_event, argv) => {
		handleArgs(argv);

		if (win) {
			if (win.isMinimized()) win.restore();
			win.focus();
		}
	});

	app.whenReady().then(() => {
		createWindow();
		handleArgs(process.argv);
	});
}
