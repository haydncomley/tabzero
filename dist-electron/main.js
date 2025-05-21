import { ipcMain as p, shell as g, app as r, globalShortcut as u, BrowserWindow as h } from "electron";
import { createRequire as P } from "node:module";
import { fileURLToPath as v } from "node:url";
import c from "node:path";
const k = () => {
  p.handle("open-external", (s, t) => g.openExternal(t));
}, d = "tabzero", m = async (s, t) => {
  const o = new URL(t);
  if (!o.protocol.startsWith(d)) return "not a valid url";
  const n = new URLSearchParams(o.search), a = n.get("code"), _ = n.get("scope");
  if (!a || !_) return "no scope or code";
  const i = await (await fetch(
    `https://authtwitchcallback-xcnznm7gbq-uc.a.run.app/authTwitchCallback?code=${a}`
  )).json();
  if (!i.token || !i.twitch)
    return "token and twitch not found";
  s.webContents.send("auth", i);
}, T = (s) => {
  r.setAsDefaultProtocolClient(d), r.on("open-url", async (t, o) => {
    m(s, o);
  });
}, E = (s) => {
  const t = {};
  p.handle("register-hotkey", (o, n) => {
    console.log("New Hotkey");
    const a = t[n.name];
    a && u.unregister(a), t[n.name] = n.keys, u.register(n.keys, () => {
      console.log(`[Hotkey] ${n.name}`), s.webContents.send("hotkey", n.name);
    });
  });
};
P(import.meta.url);
const f = c.dirname(v(import.meta.url));
process.env.APP_ROOT = c.join(f, "..");
const l = process.env.VITE_DEV_SERVER_URL, A = c.join(process.env.APP_ROOT, "dist-electron"), w = c.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = l ? c.join(process.env.APP_ROOT, "public") : w;
let e;
function R() {
  e = new h({
    icon: c.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: c.join(f, "preload.mjs"),
      devTools: !0
    },
    autoHideMenuBar: !0
  }), e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), l ? e.loadURL(l) : e.loadFile(c.join(w, "index.html")), T(e), E(e);
}
r.on("window-all-closed", () => {
  process.platform !== "darwin" && (r.quit(), e = null);
});
r.on("activate", () => {
  h.getAllWindows().length === 0 && R();
});
k();
const L = r.requestSingleInstanceLock();
if (!L)
  r.quit();
else {
  const s = async (t) => {
    if (!e) return;
    const o = t.find((n) => n.startsWith(`${d}://`));
    o && m(e, o);
  };
  r.on("second-instance", (t, o) => {
    s(o), e && (e.isMinimized() && e.restore(), e.focus());
  }), r.whenReady().then(() => {
    R(), s(process.argv);
  });
}
export {
  A as MAIN_DIST,
  w as RENDERER_DIST,
  l as VITE_DEV_SERVER_URL
};
