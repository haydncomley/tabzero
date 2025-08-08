import { ipcRenderer, contextBridge } from 'electron';
import type { StoreType } from './lib/store-handler';

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
	on(...args: Parameters<typeof ipcRenderer.on>) {
		const [channel, listener] = args;
		return ipcRenderer.on(channel, (event, ...args) =>
			listener(event, ...args),
		);
	},
	off(...args: Parameters<typeof ipcRenderer.off>) {
		const [channel, ...omit] = args;
		return ipcRenderer.off(channel, ...omit);
	},
	send(...args: Parameters<typeof ipcRenderer.send>) {
		const [channel, ...omit] = args;
		return ipcRenderer.send(channel, ...omit);
	},
	invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
		const [channel, ...omit] = args;
		return ipcRenderer.invoke(channel, ...omit);
	},

	// You can expose other APTs you need here.
	// ...
	openExternal(url: string) {
		return ipcRenderer.invoke('open-external', url);
	},
	registerHotkey(options: { name: string; keys: string }) {
		return ipcRenderer.invoke('register-hotkey', options);
	},
	getSetting(key: keyof StoreType) {
		return ipcRenderer.invoke('get-setting', key);
	},
	setSetting(key: keyof StoreType, value: StoreType[typeof key]) {
		return ipcRenderer.invoke('set-setting', key, value);
	},
	sendToStreamDeck(options: { isListening: boolean; isLoading: boolean }) {
		return ipcRenderer.invoke('send-to-stream-deck', options);
	},
	broadcast(name: string, ...args: any[]) {
		return ipcRenderer.invoke(name, ...args);
	},
});
