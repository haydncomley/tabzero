import { ipcMain as h, shell as g, app as s, globalShortcut as i, BrowserWindow as p } from "electron";
import { createRequire as k } from "node:module";
import { fileURLToPath as v } from "node:url";
import a from "node:path";
const P = () => {
  h.handle("open-external", (n, o) => g.openExternal(o));
}, u = "tabzero", f = async (n, o) => {
  const r = new URL(o);
  if (!r.protocol.startsWith(u)) return "not a valid url";
  const t = new URLSearchParams(r.search), c = t.get("code"), _ = t.get("scope");
  if (!c || !_) return "no scope or code";
  const l = await (await fetch(
    `https://authtwitchcallback-xcnznm7gbq-uc.a.run.app/authTwitchCallback?code=${c}`
  )).json();
  if (!l.token || !l.twitch)
    return "token and twitch not found";
  n.webContents.send("auth", l);
}, y = (n) => {
  s.setAsDefaultProtocolClient(u), s.on("open-url", async (o, r) => {
    f(n, r);
  });
}, E = (n) => {
  try {
    return i.register(n, () => {
    }), i.unregister(n), !0;
  } catch {
    return !1;
  }
}, T = (n) => {
  const o = {};
  h.handle("register-hotkey", (r, t) => {
    if (console.log("New Hotkey"), !E(t.keys))
      return console.error(`[Hotkey] Invalid accelerator: ${t.keys}`), !1;
    const c = o[t.name];
    return c && i.unregister(c), o[t.name] = t.keys, i.register(t.keys, () => {
      console.log(`[Hotkey] ${t.name}`), n.webContents.send("hotkey", t.name);
    }), !0;
  });
};
k(import.meta.url);
const m = a.dirname(v(import.meta.url));
process.env.APP_ROOT = a.join(m, "..");
const d = process.env.VITE_DEV_SERVER_URL, j = a.join(process.env.APP_ROOT, "dist-electron"), w = a.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = d ? a.join(process.env.APP_ROOT, "public") : w;
let e;
function R() {
  e = new p({
    icon: a.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: a.join(m, "preload.mjs"),
      devTools: !0
    },
    autoHideMenuBar: !0
  }), e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), d ? e.loadURL(d) : e.loadFile(a.join(w, "index.html")), y(e), T(e);
}
s.on("window-all-closed", () => {
  process.platform !== "darwin" && (s.quit(), e = null);
});
s.on("activate", () => {
  p.getAllWindows().length === 0 && R();
});
P();
if (!s.requestSingleInstanceLock())
  s.quit();
else {
  const n = async (o) => {
    if (!e) return;
    const r = o.find((t) => t.startsWith(`${u}://`));
    r && f(e, r);
  };
  s.on("second-instance", (o, r) => {
    n(r), e && (e.isMinimized() && e.restore(), e.focus());
  }), s.whenReady().then(() => {
    R(), n(process.argv);
  });
}
export {
  j as MAIN_DIST,
  w as RENDERER_DIST,
  d as VITE_DEV_SERVER_URL
};
