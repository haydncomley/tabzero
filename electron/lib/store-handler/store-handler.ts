import type { BrowserWindow } from 'electron';
import { ipcMain } from 'electron';
import Store from 'electron-store';

export const store = new Store<{
	darkMode: boolean;
	deviceId?: string;
	lastApiVersion?: string;
	hotkeys: Record<string, string>;
	streamDeck?: boolean;
	referral?: string;
}>({
	defaults: {
		darkMode: false,
		hotkeys: {},
		streamDeck: false,
		referral: undefined,
	},
});

export type StoreType = typeof store.store;

export const initStoreHandler = () => {
	ipcMain.handle('get-setting', (_e, key: keyof StoreType) => {
		return store.get(key);
	});

	ipcMain.handle(
		'set-setting',
		(e, key: keyof StoreType, value: StoreType[typeof key]) => {
			store.set(key, value);
			e.sender.send('setting-changed', key, value);
		},
	);
};

export const storeSet = (
	window: BrowserWindow,
	key: keyof StoreType,
	value: StoreType[typeof key],
) => {
	store.set(key, value);
	window.webContents.send('setting-changed', key, value);
};
