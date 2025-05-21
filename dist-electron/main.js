import { ipcMain, shell, app, globalShortcut, BrowserWindow } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
const initLinkHandler = () => {
  ipcMain.handle("open-external", (_e, url) => {
    return shell.openExternal(url);
  });
};
const PROTOCOL = "tabzero";
const handleProtocolUrl = async (window, rawUrl) => {
  const url = new URL(rawUrl);
  if (!url.protocol.startsWith(PROTOCOL)) return "not a valid url";
  const searchParams = new URLSearchParams(url.search);
  const code = searchParams.get("code");
  const scope = searchParams.get("scope");
  if (!code || !scope) return "no scope or code";
  const repsonse = await fetch(
    `https://authtwitchcallback-xcnznm7gbq-uc.a.run.app/authTwitchCallback?code=${code}`
  );
  const data = await repsonse.json();
  if (!data.token || !data.twitch) {
    return "token and twitch not found";
  }
  window.webContents.send("auth", data);
};
const initAuthRedirectHandler = (window) => {
  app.setAsDefaultProtocolClient(PROTOCOL);
  app.on("open-url", async (_event, rawUrl) => {
    handleProtocolUrl(window, rawUrl);
  });
};
const isValidAccelerator = (accelerator) => {
  try {
    globalShortcut.register(accelerator, () => {
    });
    globalShortcut.unregister(accelerator);
    return true;
  } catch {
    return false;
  }
};
const initHotkeyHandler = (window) => {
  const hotkeys = {};
  ipcMain.handle("register-hotkey", (_e, options) => {
    console.log("New Hotkey");
    if (!isValidAccelerator(options.keys)) {
      console.error(`[Hotkey] Invalid accelerator: ${options.keys}`);
      return false;
    }
    const previous = hotkeys[options.name];
    if (previous) globalShortcut.unregister(previous);
    hotkeys[options.name] = options.keys;
    globalShortcut.register(options.keys, () => {
      console.log(`[Hotkey] ${options.name}`);
      window.webContents.send("hotkey", options.name);
    });
    return true;
  });
};
createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      devTools: true
    },
    autoHideMenuBar: true
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
  initAuthRedirectHandler(win);
  initHotkeyHandler(win);
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
initLinkHandler();
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  const handleArgs = async (argv) => {
    if (!win) return;
    const url = argv.find((arg) => arg.startsWith(`${PROTOCOL}://`));
    if (!url) return;
    handleProtocolUrl(win, url);
  };
  app.on("second-instance", (_event, argv) => {
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
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
