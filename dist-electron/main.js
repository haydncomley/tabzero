import { app as n, BrowserWindow as i } from "electron";
import { createRequire as l } from "node:module";
import { fileURLToPath as c } from "node:url";
import o from "node:path";
l(import.meta.url);
const r = o.dirname(c(import.meta.url));
process.env.APP_ROOT = o.join(r, "..");
const t = process.env.VITE_DEV_SERVER_URL, _ = o.join(process.env.APP_ROOT, "dist-electron"), s = o.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = t ? o.join(process.env.APP_ROOT, "public") : s;
let e;
function a() {
  e = new i({
    icon: o.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: o.join(r, "preload.mjs")
    },
    autoHideMenuBar: !0
  }), e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), t ? e.loadURL(t) : e.loadFile(o.join(s, "index.html"));
}
n.on("window-all-closed", () => {
  process.platform !== "darwin" && (n.quit(), e = null);
});
n.on("activate", () => {
  i.getAllWindows().length === 0 && a();
});
n.whenReady().then(a);
export {
  _ as MAIN_DIST,
  s as RENDERER_DIST,
  t as VITE_DEV_SERVER_URL
};
