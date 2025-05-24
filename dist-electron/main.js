import { ipcMain as f, shell as v, app as s, globalShortcut as a, BrowserWindow as m } from "electron";
import { createRequire as P } from "node:module";
import { fileURLToPath as g } from "node:url";
import i from "node:path";
const w = () => {
  f.handle("open-external", (r, t) => v.openExternal(t));
}, d = "tabzero", p = async (r, t) => {
  const o = new URL(t);
  if (!o.protocol.startsWith(d)) return "not a valid url";
  const n = new URLSearchParams(o.search), c = n.get("code"), u = n.get("scope");
  if (!c || !u) return "no scope or code";
  r.webContents.send("auth", { code: c, scope: u });
}, y = (r) => {
  s.setAsDefaultProtocolClient(d), s.on("open-url", async (t, o) => {
    p(r, o);
  });
}, E = (r) => {
  try {
    return a.register(r, () => {
    }), a.unregister(r), !0;
  } catch {
    return !1;
  }
}, T = (r) => {
  const t = {};
  f.handle(
    "register-hotkey",
    (o, n) => {
      if (!E(n.keys))
        return console.error(`[Hotkey] Invalid accelerator: ${n.keys}`), !1;
      const c = t[n.name];
      return c && a.unregister(c), t[n.name] = n.keys, a.register(n.keys, () => {
        console.log(`[Hotkey] ${n.name}`), r.webContents.send("hotkey", n.name);
      }), !0;
    }
  );
};
P(import.meta.url);
const h = i.dirname(g(import.meta.url));
process.env.APP_ROOT = i.join(h, "..");
const l = process.env.VITE_DEV_SERVER_URL, A = i.join(process.env.APP_ROOT, "dist-electron"), R = i.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = l ? i.join(process.env.APP_ROOT, "public") : R;
let e;
function _() {
  e = new m({
    icon: i.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: i.join(h, "preload.mjs"),
      devTools: !0
    },
    autoHideMenuBar: !0
  }), e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send("main-process-message", { hello: "world" });
  }), l ? e.loadURL(l) : e.loadFile(i.join(R, "index.html")), y(e), T(e);
}
s.on("window-all-closed", () => {
  process.platform !== "darwin" && (s.quit(), e = null);
});
s.on("activate", () => {
  m.getAllWindows().length === 0 && _();
});
w();
if (!s.requestSingleInstanceLock())
  s.quit();
else {
  const r = async (t) => {
    if (!e) return;
    const o = t.find((n) => n.startsWith(`${d}://`));
    o && p(e, o);
  };
  s.on("second-instance", (t, o) => {
    r(o), e && (e.isMinimized() && e.restore(), e.focus());
  }), s.whenReady().then(() => {
    _(), r(process.argv);
  });
}
export {
  A as MAIN_DIST,
  R as RENDERER_DIST,
  l as VITE_DEV_SERVER_URL
};
