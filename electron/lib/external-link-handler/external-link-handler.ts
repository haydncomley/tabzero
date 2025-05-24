import { ipcMain, shell } from 'electron';

export const initLinkHandler = () => {
	ipcMain.handle('open-external', (_e, url) => {
		return shell.openExternal(url);
	});
};
