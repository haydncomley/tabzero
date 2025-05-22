/* eslint-disable @typescript-eslint/consistent-type-definitions */
export {};

declare global {
	interface Window {
		ipcRenderer: {
			on<T>(
				channel: string,
				listener: (event: Electron.IpcRendererEvent, ...args: T[]) => void,
			): Electron.IpcRenderer;
			off(
				channel: string,
				listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void,
			): Electron.IpcRenderer;
			send(channel: string, ...args: any[]): void;
			invoke<T>(channel: string, ...args: any[]): Promise<T>;
			openExternal: (url: string) => Promise<void>;
			registerHotkey: (options: {
				name: string;
				keys: string;
			}) => Promise<boolean>;
		};
	}
}
