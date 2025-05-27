import { ipcMain } from 'electron';
import Store from 'electron-store';

const store = new Store<{
	darkMode: boolean;
	deviceId?: string;
	lastApiVersion?: string;
	hotkeys: Record<string, string>;
}>({
	defaults: {
		darkMode: false,
		hotkeys: {},
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
