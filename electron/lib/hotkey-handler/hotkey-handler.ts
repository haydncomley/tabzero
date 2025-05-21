import type { BrowserWindow} from "electron";
import { globalShortcut, ipcMain } from "electron"

const isValidAccelerator = (accelerator: string): boolean => {
    try {
      globalShortcut.register(accelerator, () => {});
      globalShortcut.unregister(accelerator);
      return true;
    } catch {
      return false;
    }
  }

export const initHotkeyHandler = (window: BrowserWindow) => {
    const hotkeys: Record<string, string> = {};

    ipcMain.handle('register-hotkey', (_e, options: { name: string, keys: string }) => {
        console.log('New Hotkey')

        if (!isValidAccelerator(options.keys)) {
            // TODO: Handle invalid bindings
            console.error(`[Hotkey] Invalid accelerator: ${options.keys}`);
            return false;
        }

        const previous = hotkeys[options.name];
        if (previous) globalShortcut.unregister(previous);

        hotkeys[options.name] = options.keys;
        globalShortcut.register(options.keys, () => {
            console.log(`[Hotkey] ${options.name}`)
            window.webContents.send('hotkey', options.name);
        })

        return true;
      });
}