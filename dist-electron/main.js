import { app, BrowserWindow, ipcMain, shell } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
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
      preload: path.join(__dirname, "preload.mjs")
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
app.on("open-url", async (event, rawUrl) => {
  event.preventDefault();
  const url = new URL(rawUrl);
  if (!url.protocol.startsWith("tabzero")) return;
  const searchParams = new URLSearchParams(url.search);
  const code = searchParams.get("code");
  const scope = searchParams.get("scope");
  if (!code || !scope) return;
  const repsonse = await fetch(
    `https://authtwitchcallback-xcnznm7gbq-uc.a.run.app/authTwitchCallback?code=${code}`
  );
  const data = await repsonse.json();
  if (!data.token || !data.twitch) {
    return;
  }
  win == null ? void 0 : win.webContents.send("auth", data);
});
app.setAsDefaultProtocolClient("tabzero");
app.whenReady().then(createWindow);
ipcMain.handle("open-external", (_e, url) => {
  return shell.openExternal(url);
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
