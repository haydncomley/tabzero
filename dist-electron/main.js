import V, { ipcMain as O, shell as C, app as d, globalShortcut as k, BrowserWindow as q } from "electron";
import z from "node:assert";
import F from "node:fs";
import W from "node:os";
import h from "node:path";
import J from "node:util";
import { createRequire as G } from "node:module";
import { fileURLToPath as K } from "node:url";
var A = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, U = {}, b = 1e3, _ = b * 60, y = _ * 60, v = y * 24, Q = v * 7, X = v * 365.25, Y = function(t, r) {
  r = r || {};
  var e = typeof t;
  if (e === "string" && t.length > 0)
    return Z(t);
  if (e === "number" && isFinite(t))
    return r.long ? te(t) : ee(t);
  throw new Error(
    "val is not a non-empty string or a valid number. val=" + JSON.stringify(t)
  );
};
function Z(t) {
  if (t = String(t), !(t.length > 100)) {
    var r = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
      t
    );
    if (r) {
      var e = parseFloat(r[1]), o = (r[2] || "ms").toLowerCase();
      switch (o) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return e * X;
        case "weeks":
        case "week":
        case "w":
          return e * Q;
        case "days":
        case "day":
        case "d":
          return e * v;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return e * y;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return e * _;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return e * b;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return e;
        default:
          return;
      }
    }
  }
}
function ee(t) {
  var r = Math.abs(t);
  return r >= v ? Math.round(t / v) + "d" : r >= y ? Math.round(t / y) + "h" : r >= _ ? Math.round(t / _) + "m" : r >= b ? Math.round(t / b) + "s" : t + "ms";
}
function te(t) {
  var r = Math.abs(t);
  return r >= v ? R(t, r, v, "day") : r >= y ? R(t, r, y, "hour") : r >= _ ? R(t, r, _, "minute") : r >= b ? R(t, r, b, "second") : t + " ms";
}
function R(t, r, e, o) {
  var a = r >= e * 1.5;
  return Math.round(t / e) + " " + o + (a ? "s" : "");
}
var re = se, oe = /^(?:\w+:)?\/\/(\S+)$/, ae = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/, ne = /^[^\s\.]+\.\S{2,}$/;
function se(t) {
  if (typeof t != "string")
    return !1;
  var r = t.match(oe);
  if (!r)
    return !1;
  var e = r[1];
  return e ? !!(ae.test(e) || ne.test(e)) : !1;
}
var ie = re, ce = /(?:(?:[^:]+:)?[/][/])?(?:.+@)?([^/]+)([/][^?#]+)/, ue = function(t, r) {
  var e = {};
  if (r = r || {}, !t || (t.url && (t = t.url), typeof t != "string"))
    return null;
  var o = t.match(/^([\w-_]+)\/([\w-_\.]+)(?:#([\w-_\.]+))?$/), a = t.match(/^github:([\w-_]+)\/([\w-_\.]+)(?:#([\w-_\.]+))?$/), c = t.match(/^git@[\w-_\.]+:([\w-_]+)\/([\w-_\.]+)$/);
  if (o)
    e.user = o[1], e.repo = o[2], e.branch = o[3] || "master", e.host = "github.com";
  else if (a)
    e.user = a[1], e.repo = a[2], e.branch = a[3] || "master", e.host = "github.com";
  else if (c)
    e.user = c[1], e.repo = c[2].replace(/\.git$/i, ""), e.branch = "master", e.host = "github.com";
  else {
    if (t = t.replace(/^git\+/, ""), !ie(t))
      return null;
    var f = t.match(ce) || [], s = f[1], n = f[2];
    if (!s || s !== "github.com" && s !== "www.github.com" && !r.enterprise)
      return null;
    var u = n.match(/^\/([\w-_]+)\/([\w-_\.]+)(\/tree\/[\%\w-_\.\/]+)?(\/blob\/[\%\w-_\.\/]+)?/);
    if (!u)
      return null;
    if (e.user = u[1], e.repo = u[2].replace(/\.git$/i, ""), e.host = s || "github.com", u[3] && /^\/tree\/master\//.test(u[3]))
      e.branch = "master", e.path = u[3].replace(/\/$/, "");
    else if (u[3]) {
      var p = u[3].replace(/^\/tree\//, "").match(/[\%\w-_.]*\/?[\%\w-_]+/);
      e.branch = p && p[0];
    } else if (u[4]) {
      var p = u[4].replace(/^\/blob\//, "").match(/[\%\w-_.]*\/?[\%\w-_]+/);
      e.branch = p && p[0];
    } else
      e.branch = "master";
  }
  return e.host === "github.com" ? e.apiHost = "api.github.com" : e.apiHost = e.host + "/api/v3", e.tarball_url = "https://" + e.apiHost + "/repos/" + e.user + "/" + e.repo + "/tarball/" + e.branch, e.clone_url = "https://" + e.host + "/" + e.user + "/" + e.repo, e.branch === "master" ? (e.https_url = "https://" + e.host + "/" + e.user + "/" + e.repo, e.travis_url = "https://travis-ci.org/" + e.user + "/" + e.repo, e.zip_url = "https://" + e.host + "/" + e.user + "/" + e.repo + "/archive/master.zip") : (e.https_url = "https://" + e.host + "/" + e.user + "/" + e.repo + "/blob/" + e.branch, e.travis_url = "https://travis-ci.org/" + e.user + "/" + e.repo + "?branch=" + e.branch, e.zip_url = "https://" + e.host + "/" + e.user + "/" + e.repo + "/archive/" + e.branch + ".zip"), e.path && (e.https_url += e.path), e.api_url = "https://" + e.apiHost + "/repos/" + e.user + "/" + e.repo, e;
};
const le = "update-electron-app", de = "3.1.1", pe = {
  name: le,
  version: de
};
var w = A && A.__importDefault || function(t) {
  return t && t.__esModule ? t : { default: t };
};
Object.defineProperty(U, "__esModule", { value: !0 });
U.UpdateSourceType = void 0;
var fe = U.updateElectronApp = ye;
U.makeUserNotifier = H;
const M = w(Y), he = w(ue), m = w(z), me = w(F), T = w(W), ge = w(h), ve = J, l = V;
var g;
(function(t) {
  t[t.ElectronPublicUpdateService = 0] = "ElectronPublicUpdateService", t[t.StaticStorage = 1] = "StaticStorage";
})(g || (U.UpdateSourceType = g = {}));
const j = pe, be = (0, ve.format)("%s/%s (%s: %s)", j.name, j.version, T.default.platform(), T.default.arch()), _e = ["darwin", "win32"], L = (t) => {
  try {
    const { protocol: r } = new URL(t);
    return r === "https:";
  } catch {
    return !1;
  }
};
function ye(t = {}) {
  const r = Ue(t);
  if (!l.app.isPackaged) {
    const e = "update-electron-app config looks good; aborting updates since app is in development mode";
    t.logger ? t.logger.log(e) : console.log(e);
    return;
  }
  l.app.isReady() ? I(r) : l.app.on("ready", () => I(r));
}
function I(t) {
  const { updateSource: r, updateInterval: e, logger: o } = t;
  if (!_e.includes(process == null ? void 0 : process.platform)) {
    s(`Electron's autoUpdater does not support the '${process.platform}' platform. Ref: https://www.electronjs.org/docs/latest/api/auto-updater#platform-notices`);
    return;
  }
  let a, c = "default";
  switch (r.type) {
    case g.ElectronPublicUpdateService: {
      a = `${r.host}/${r.repo}/${process.platform}-${process.arch}/${l.app.getVersion()}`;
      break;
    }
    case g.StaticStorage: {
      a = r.baseUrl, process.platform === "darwin" && (a += "/RELEASES.json", c = "json");
      break;
    }
  }
  const f = { "User-Agent": be };
  function s(...n) {
    o.log(...n);
  }
  s("feedURL", a), s("requestHeaders", f), l.autoUpdater.setFeedURL({
    url: a,
    headers: f,
    serverType: c
  }), l.autoUpdater.on("error", (n) => {
    s("updater error"), s(n);
  }), l.autoUpdater.on("checking-for-update", () => {
    s("checking-for-update");
  }), l.autoUpdater.on("update-available", () => {
    s("update-available; downloading...");
  }), l.autoUpdater.on("update-not-available", () => {
    s("update-not-available");
  }), t.notifyUser && l.autoUpdater.on("update-downloaded", (n, u, p, S, P) => {
    s("update-downloaded", [n, u, p, S, P]), typeof t.onNotifyUser != "function" ? ((0, m.default)(t.onNotifyUser === void 0, "onNotifyUser option must be a callback function or undefined"), s("update-downloaded: notifyUser is true, opening default dialog"), t.onNotifyUser = H()) : s("update-downloaded: notifyUser is true, running custom onNotifyUser callback"), t.onNotifyUser({
      event: n,
      releaseNotes: u,
      releaseDate: S,
      releaseName: p,
      updateURL: P
    });
  }), l.autoUpdater.checkForUpdates(), setInterval(() => {
    l.autoUpdater.checkForUpdates();
  }, (0, M.default)(e));
}
function H(t) {
  const e = Object.assign({}, {
    title: "Application Update",
    detail: "A new version has been downloaded. Restart the application to apply the updates.",
    restartButtonText: "Restart",
    laterButtonText: "Later"
  }, t);
  return (o) => {
    const { releaseNotes: a, releaseName: c } = o, { title: f, restartButtonText: s, laterButtonText: n, detail: u } = e, p = {
      type: "info",
      buttons: [s, n],
      title: f,
      message: process.platform === "win32" ? a : c,
      detail: u
    };
    l.dialog.showMessageBox(p).then(({ response: S }) => {
      S === 0 && l.autoUpdater.quitAndInstall();
    });
  };
}
function we() {
  var t;
  const r = me.default.readFileSync(ge.default.join(l.app.getAppPath(), "package.json")), e = JSON.parse(r.toString()), o = ((t = e.repository) === null || t === void 0 ? void 0 : t.url) || e.repository, a = (0, he.default)(o);
  return (0, m.default)(a, "repo not found. Add repository string to your app's package.json file"), `${a.user}/${a.repo}`;
}
function Ue(t) {
  var r;
  const e = {
    host: "https://update.electronjs.org",
    updateInterval: "10 minutes",
    logger: console,
    notifyUser: !0
  }, { host: o, updateInterval: a, logger: c, notifyUser: f, onNotifyUser: s } = Object.assign({}, e, t);
  let n = t.updateSource;
  switch (n || (n = {
    type: g.ElectronPublicUpdateService,
    repo: t.repo || we(),
    host: o
  }), n.type) {
    case g.ElectronPublicUpdateService: {
      (0, m.default)((r = n.repo) === null || r === void 0 ? void 0 : r.includes("/"), "repo is required and should be in the format `owner/repo`"), n.host || (n.host = o), (0, m.default)(n.host && L(n.host), "host must be a valid HTTPS URL");
      break;
    }
    case g.StaticStorage: {
      (0, m.default)(n.baseUrl && L(n.baseUrl), "baseUrl must be a valid HTTPS URL");
      break;
    }
  }
  return (0, m.default)(typeof a == "string" && a.match(/^\d+/), "updateInterval must be a human-friendly string interval like `20 minutes`"), (0, m.default)((0, M.default)(a) >= 5 * 60 * 1e3, "updateInterval must be `5 minutes` or more"), (0, m.default)(c && typeof c.log, "function"), { updateSource: n, updateInterval: a, logger: c, notifyUser: f, onNotifyUser: s };
}
const Se = () => {
  O.handle("open-external", (t, r) => C.openExternal(r));
}, E = "tabzero", D = async (t, r) => {
  const e = new URL(r);
  if (!e.protocol.startsWith(E)) return "not a valid url";
  const o = new URLSearchParams(e.search), a = o.get("code"), c = o.get("scope");
  if (!a || !c) return "no scope or code";
  t.webContents.send("auth", { code: a, scope: c });
}, Re = (t) => {
  d.setAsDefaultProtocolClient(E), d.on("open-url", async (r, e) => {
    D(t, e);
  });
}, ke = (t) => {
  try {
    return k.register(t, () => {
    }), k.unregister(t), !0;
  } catch {
    return !1;
  }
}, $e = (t) => {
  const r = {};
  O.handle(
    "register-hotkey",
    (e, o) => {
      if (!ke(o.keys))
        return console.error(`[Hotkey] Invalid accelerator: ${o.keys}`), !1;
      const a = r[o.name];
      return a && k.unregister(a), r[o.name] = o.keys, k.register(o.keys, () => {
        console.log(`[Hotkey] ${o.name}`), t.webContents.send("hotkey", o.name);
      }), !0;
    }
  );
}, Ee = G(import.meta.url), N = h.dirname(K(import.meta.url));
d.setAppUserModelId("com.haydncom.tabzero");
Ee("electron-squirrel-startup") && d.quit();
process.env.APP_ROOT = h.join(N, "..");
const $ = process.env.VITE_DEV_SERVER_URL, Me = h.join(process.env.APP_ROOT, "dist-electron"), x = h.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = $ ? h.join(process.env.APP_ROOT, "public") : x;
let i;
fe();
function B() {
  i = new q({
    icon: h.join(process.env.VITE_PUBLIC, "icon.png"),
    webPreferences: {
      preload: h.join(N, "preload.mjs"),
      devTools: !0,
      webSecurity: !1
    },
    autoHideMenuBar: !0
  }), i.webContents.on("did-finish-load", () => {
    i == null || i.webContents.send("main-process-message", { hello: "world" });
  }), $ ? i.loadURL($) : i.loadFile(h.join(x, "index.html")), Re(i), $e(i);
}
d.on("window-all-closed", () => {
  process.platform !== "darwin" && (d.quit(), i = null);
});
d.on("activate", () => {
  q.getAllWindows().length === 0 && B();
});
Se();
if (!d.requestSingleInstanceLock())
  d.quit();
else {
  const t = async (r) => {
    if (!i) return;
    const e = r.find((o) => o.startsWith(`${E}://`));
    e && D(i, e);
  };
  d.on("second-instance", (r, e) => {
    t(e), i && (i.isMinimized() && i.restore(), i.focus());
  }), d.whenReady().then(() => {
    B(), t(process.argv);
  });
}
export {
  Me as MAIN_DIST,
  x as RENDERER_DIST,
  $ as VITE_DEV_SERVER_URL
};
