var ji = Object.defineProperty;
var Js = (e) => {
  throw TypeError(e);
};
var Ai = (e, t, r) => t in e ? ji(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var Dt = (e, t, r) => Ai(e, typeof t != "symbol" ? t + "" : t, r), xs = (e, t, r) => t.has(e) || Js("Cannot " + r);
var Q = (e, t, r) => (xs(e, t, "read from private field"), r ? r.call(e) : t.get(e)), Lt = (e, t, r) => t.has(e) ? Js("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), Mt = (e, t, r, n) => (xs(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r);
import Dn, { ipcMain as wt, shell as ki, app as Oe, globalShortcut as Kt, BrowserWindow as uo } from "electron";
import fo from "node:assert";
import G from "node:fs";
import Yt from "node:os";
import X from "node:path";
import Ci, { promisify as le, isDeepStrictEqual as Di } from "node:util";
import { createRequire as Li } from "node:module";
import { fileURLToPath as Mi } from "node:url";
import se from "node:process";
import Vt from "node:crypto";
import { WebSocketServer as Vi } from "ws";
var Ys = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function ho(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Zt = {}, bt = 1e3, St = bt * 60, Pt = St * 60, ot = Pt * 24, Ui = ot * 7, zi = ot * 365.25, Fi = function(e, t) {
  t = t || {};
  var r = typeof e;
  if (r === "string" && e.length > 0)
    return qi(e);
  if (r === "number" && isFinite(e))
    return t.long ? Ki(e) : Gi(e);
  throw new Error(
    "val is not a non-empty string or a valid number. val=" + JSON.stringify(e)
  );
};
function qi(e) {
  if (e = String(e), !(e.length > 100)) {
    var t = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
      e
    );
    if (t) {
      var r = parseFloat(t[1]), n = (t[2] || "ms").toLowerCase();
      switch (n) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return r * zi;
        case "weeks":
        case "week":
        case "w":
          return r * Ui;
        case "days":
        case "day":
        case "d":
          return r * ot;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return r * Pt;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return r * St;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return r * bt;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return r;
        default:
          return;
      }
    }
  }
}
function Gi(e) {
  var t = Math.abs(e);
  return t >= ot ? Math.round(e / ot) + "d" : t >= Pt ? Math.round(e / Pt) + "h" : t >= St ? Math.round(e / St) + "m" : t >= bt ? Math.round(e / bt) + "s" : e + "ms";
}
function Ki(e) {
  var t = Math.abs(e);
  return t >= ot ? rr(e, t, ot, "day") : t >= Pt ? rr(e, t, Pt, "hour") : t >= St ? rr(e, t, St, "minute") : t >= bt ? rr(e, t, bt, "second") : e + " ms";
}
function rr(e, t, r, n) {
  var s = t >= r * 1.5;
  return Math.round(e / r) + " " + n + (s ? "s" : "");
}
var Hi = Ji, Xi = /^(?:\w+:)?\/\/(\S+)$/, Wi = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/, Bi = /^[^\s\.]+\.\S{2,}$/;
function Ji(e) {
  if (typeof e != "string")
    return !1;
  var t = e.match(Xi);
  if (!t)
    return !1;
  var r = t[1];
  return r ? !!(Wi.test(r) || Bi.test(r)) : !1;
}
var xi = Hi, Yi = /(?:(?:[^:]+:)?[/][/])?(?:.+@)?([^/]+)([/][^?#]+)/, Zi = function(e, t) {
  var r = {};
  if (t = t || {}, !e || (e.url && (e = e.url), typeof e != "string"))
    return null;
  var n = e.match(/^([\w-_]+)\/([\w-_\.]+)(?:#([\w-_\.]+))?$/), s = e.match(/^github:([\w-_]+)\/([\w-_\.]+)(?:#([\w-_\.]+))?$/), a = e.match(/^git@[\w-_\.]+:([\w-_]+)\/([\w-_\.]+)$/);
  if (n)
    r.user = n[1], r.repo = n[2], r.branch = n[3] || "master", r.host = "github.com";
  else if (s)
    r.user = s[1], r.repo = s[2], r.branch = s[3] || "master", r.host = "github.com";
  else if (a)
    r.user = a[1], r.repo = a[2].replace(/\.git$/i, ""), r.branch = "master", r.host = "github.com";
  else {
    if (e = e.replace(/^git\+/, ""), !xi(e))
      return null;
    var o = e.match(Yi) || [], l = o[1], i = o[2];
    if (!l || l !== "github.com" && l !== "www.github.com" && !t.enterprise)
      return null;
    var u = i.match(/^\/([\w-_]+)\/([\w-_\.]+)(\/tree\/[\%\w-_\.\/]+)?(\/blob\/[\%\w-_\.\/]+)?/);
    if (!u)
      return null;
    if (r.user = u[1], r.repo = u[2].replace(/\.git$/i, ""), r.host = l || "github.com", u[3] && /^\/tree\/master\//.test(u[3]))
      r.branch = "master", r.path = u[3].replace(/\/$/, "");
    else if (u[3]) {
      var c = u[3].replace(/^\/tree\//, "").match(/[\%\w-_.]*\/?[\%\w-_]+/);
      r.branch = c && c[0];
    } else if (u[4]) {
      var c = u[4].replace(/^\/blob\//, "").match(/[\%\w-_.]*\/?[\%\w-_]+/);
      r.branch = c && c[0];
    } else
      r.branch = "master";
  }
  return r.host === "github.com" ? r.apiHost = "api.github.com" : r.apiHost = r.host + "/api/v3", r.tarball_url = "https://" + r.apiHost + "/repos/" + r.user + "/" + r.repo + "/tarball/" + r.branch, r.clone_url = "https://" + r.host + "/" + r.user + "/" + r.repo, r.branch === "master" ? (r.https_url = "https://" + r.host + "/" + r.user + "/" + r.repo, r.travis_url = "https://travis-ci.org/" + r.user + "/" + r.repo, r.zip_url = "https://" + r.host + "/" + r.user + "/" + r.repo + "/archive/master.zip") : (r.https_url = "https://" + r.host + "/" + r.user + "/" + r.repo + "/blob/" + r.branch, r.travis_url = "https://travis-ci.org/" + r.user + "/" + r.repo + "?branch=" + r.branch, r.zip_url = "https://" + r.host + "/" + r.user + "/" + r.repo + "/archive/" + r.branch + ".zip"), r.path && (r.https_url += r.path), r.api_url = "https://" + r.apiHost + "/repos/" + r.user + "/" + r.repo, r;
};
const Qi = "update-electron-app", ec = "3.1.1", tc = {
  name: Qi,
  version: ec
};
var It = Ys && Ys.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Zt, "__esModule", { value: !0 });
Zt.UpdateSourceType = void 0;
var rc = Zt.updateElectronApp = lc;
Zt.makeUserNotifier = po;
const mo = It(Fi), nc = It(Zi), Je = It(fo), sc = It(G), Zs = It(Yt), ac = It(X), oc = Ci, he = Dn;
var at;
(function(e) {
  e[e.ElectronPublicUpdateService = 0] = "ElectronPublicUpdateService", e[e.StaticStorage = 1] = "StaticStorage";
})(at || (Zt.UpdateSourceType = at = {}));
const Qs = tc, ic = (0, oc.format)("%s/%s (%s: %s)", Qs.name, Qs.version, Zs.default.platform(), Zs.default.arch()), cc = ["darwin", "win32"], ea = (e) => {
  try {
    const { protocol: t } = new URL(e);
    return t === "https:";
  } catch {
    return !1;
  }
};
function lc(e = {}) {
  const t = dc(e);
  if (!he.app.isPackaged) {
    const r = "update-electron-app config looks good; aborting updates since app is in development mode";
    e.logger ? e.logger.log(r) : console.log(r);
    return;
  }
  he.app.isReady() ? ta(t) : he.app.on("ready", () => ta(t));
}
function ta(e) {
  const { updateSource: t, updateInterval: r, logger: n } = e;
  if (!cc.includes(process == null ? void 0 : process.platform)) {
    l(`Electron's autoUpdater does not support the '${process.platform}' platform. Ref: https://www.electronjs.org/docs/latest/api/auto-updater#platform-notices`);
    return;
  }
  let s, a = "default";
  switch (t.type) {
    case at.ElectronPublicUpdateService: {
      s = `${t.host}/${t.repo}/${process.platform}-${process.arch}/${he.app.getVersion()}`;
      break;
    }
    case at.StaticStorage: {
      s = t.baseUrl, process.platform === "darwin" && (s += "/RELEASES.json", a = "json");
      break;
    }
  }
  const o = { "User-Agent": ic };
  function l(...i) {
    n.log(...i);
  }
  l("feedURL", s), l("requestHeaders", o), he.autoUpdater.setFeedURL({
    url: s,
    headers: o,
    serverType: a
  }), he.autoUpdater.on("error", (i) => {
    l("updater error"), l(i);
  }), he.autoUpdater.on("checking-for-update", () => {
    l("checking-for-update");
  }), he.autoUpdater.on("update-available", () => {
    l("update-available; downloading...");
  }), he.autoUpdater.on("update-not-available", () => {
    l("update-not-available");
  }), e.notifyUser && he.autoUpdater.on("update-downloaded", (i, u, c, f, _) => {
    l("update-downloaded", [i, u, c, f, _]), typeof e.onNotifyUser != "function" ? ((0, Je.default)(e.onNotifyUser === void 0, "onNotifyUser option must be a callback function or undefined"), l("update-downloaded: notifyUser is true, opening default dialog"), e.onNotifyUser = po()) : l("update-downloaded: notifyUser is true, running custom onNotifyUser callback"), e.onNotifyUser({
      event: i,
      releaseNotes: u,
      releaseDate: f,
      releaseName: c,
      updateURL: _
    });
  }), he.autoUpdater.checkForUpdates(), setInterval(() => {
    he.autoUpdater.checkForUpdates();
  }, (0, mo.default)(r));
}
function po(e) {
  const r = Object.assign({}, {
    title: "Application Update",
    detail: "A new version has been downloaded. Restart the application to apply the updates.",
    restartButtonText: "Restart",
    laterButtonText: "Later"
  }, e);
  return (n) => {
    const { releaseNotes: s, releaseName: a } = n, { title: o, restartButtonText: l, laterButtonText: i, detail: u } = r, c = {
      type: "info",
      buttons: [l, i],
      title: o,
      message: process.platform === "win32" ? s : a,
      detail: u
    };
    he.dialog.showMessageBox(c).then(({ response: f }) => {
      f === 0 && he.autoUpdater.quitAndInstall();
    });
  };
}
function uc() {
  var e;
  const t = sc.default.readFileSync(ac.default.join(he.app.getAppPath(), "package.json")), r = JSON.parse(t.toString()), n = ((e = r.repository) === null || e === void 0 ? void 0 : e.url) || r.repository, s = (0, nc.default)(n);
  return (0, Je.default)(s, "repo not found. Add repository string to your app's package.json file"), `${s.user}/${s.repo}`;
}
function dc(e) {
  var t;
  const r = {
    host: "https://update.electronjs.org",
    updateInterval: "10 minutes",
    logger: console,
    notifyUser: !0
  }, { host: n, updateInterval: s, logger: a, notifyUser: o, onNotifyUser: l } = Object.assign({}, r, e);
  let i = e.updateSource;
  switch (i || (i = {
    type: at.ElectronPublicUpdateService,
    repo: e.repo || uc(),
    host: n
  }), i.type) {
    case at.ElectronPublicUpdateService: {
      (0, Je.default)((t = i.repo) === null || t === void 0 ? void 0 : t.includes("/"), "repo is required and should be in the format `owner/repo`"), i.host || (i.host = n), (0, Je.default)(i.host && ea(i.host), "host must be a valid HTTPS URL");
      break;
    }
    case at.StaticStorage: {
      (0, Je.default)(i.baseUrl && ea(i.baseUrl), "baseUrl must be a valid HTTPS URL");
      break;
    }
  }
  return (0, Je.default)(typeof s == "string" && s.match(/^\d+/), "updateInterval must be a human-friendly string interval like `20 minutes`"), (0, Je.default)((0, mo.default)(s) >= 5 * 60 * 1e3, "updateInterval must be `5 minutes` or more"), (0, Je.default)(a && typeof a.log, "function"), { updateSource: i, updateInterval: s, logger: a, notifyUser: o, onNotifyUser: l };
}
const fc = () => {
  wt.handle("open-external", (e, t) => ki.openExternal(t));
}, Ln = "tabzero", $o = async (e, t) => {
  const r = new URL(t);
  if (!r.protocol.startsWith(Ln)) return "not a valid url";
  const n = new URLSearchParams(r.search), s = n.get("code"), a = n.get("scope");
  if (!s || !a) return "no scope or code";
  e.webContents.send("auth", { code: s, scope: a });
}, hc = (e) => {
  Oe.setAsDefaultProtocolClient(Ln), Oe.on("open-url", async (t, r) => {
    $o(e, r);
  });
}, mc = (e) => {
  try {
    return Kt.register(e, () => {
    }), Kt.unregister(e), !0;
  } catch {
    return !1;
  }
}, pc = (e) => {
  const t = {};
  wt.handle(
    "register-hotkey",
    (r, n) => {
      if (!mc(n.keys))
        return console.error(`[Hotkey] Invalid accelerator: ${n.keys}`), !1;
      const s = t[n.name];
      return s && Kt.unregister(s), t[n.name] = n.keys, Kt.register(n.keys, () => {
        console.log(`[Hotkey] ${n.name}`), e.webContents.send("hotkey", n.name);
      }), !0;
    }
  ), e.on("close", () => {
    Object.values(t).forEach((r) => {
      Kt.unregister(r);
    }), wt.removeHandler("register-hotkey");
  });
}, it = (e) => {
  const t = typeof e;
  return e !== null && (t === "object" || t === "function");
}, on = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), $c = new Set("0123456789");
function Nr(e) {
  const t = [];
  let r = "", n = "start", s = !1;
  for (const a of e)
    switch (a) {
      case "\\": {
        if (n === "index")
          throw new Error("Invalid character in an index");
        if (n === "indexEnd")
          throw new Error("Invalid character after an index");
        s && (r += a), n = "property", s = !s;
        break;
      }
      case ".": {
        if (n === "index")
          throw new Error("Invalid character in an index");
        if (n === "indexEnd") {
          n = "property";
          break;
        }
        if (s) {
          s = !1, r += a;
          break;
        }
        if (on.has(r))
          return [];
        t.push(r), r = "", n = "property";
        break;
      }
      case "[": {
        if (n === "index")
          throw new Error("Invalid character in an index");
        if (n === "indexEnd") {
          n = "index";
          break;
        }
        if (s) {
          s = !1, r += a;
          break;
        }
        if (n === "property") {
          if (on.has(r))
            return [];
          t.push(r), r = "";
        }
        n = "index";
        break;
      }
      case "]": {
        if (n === "index") {
          t.push(Number.parseInt(r, 10)), r = "", n = "indexEnd";
          break;
        }
        if (n === "indexEnd")
          throw new Error("Invalid character after an index");
      }
      default: {
        if (n === "index" && !$c.has(a))
          throw new Error("Invalid character in an index");
        if (n === "indexEnd")
          throw new Error("Invalid character after an index");
        n === "start" && (n = "property"), s && (s = !1, r += "\\"), r += a;
      }
    }
  switch (s && (r += "\\"), n) {
    case "property": {
      if (on.has(r))
        return [];
      t.push(r);
      break;
    }
    case "index":
      throw new Error("Index was not closed");
    case "start": {
      t.push("");
      break;
    }
  }
  return t;
}
function Mn(e, t) {
  if (typeof t != "number" && Array.isArray(e)) {
    const r = Number.parseInt(t, 10);
    return Number.isInteger(r) && e[r] === e[t];
  }
  return !1;
}
function yo(e, t) {
  if (Mn(e, t))
    throw new Error("Cannot use string index");
}
function yc(e, t, r) {
  if (!it(e) || typeof t != "string")
    return r === void 0 ? e : r;
  const n = Nr(t);
  if (n.length === 0)
    return r;
  for (let s = 0; s < n.length; s++) {
    const a = n[s];
    if (Mn(e, a) ? e = s === n.length - 1 ? void 0 : null : e = e[a], e == null) {
      if (s !== n.length - 1)
        return r;
      break;
    }
  }
  return e === void 0 ? r : e;
}
function ra(e, t, r) {
  if (!it(e) || typeof t != "string")
    return e;
  const n = e, s = Nr(t);
  for (let a = 0; a < s.length; a++) {
    const o = s[a];
    yo(e, o), a === s.length - 1 ? e[o] = r : it(e[o]) || (e[o] = typeof s[a + 1] == "number" ? [] : {}), e = e[o];
  }
  return n;
}
function gc(e, t) {
  if (!it(e) || typeof t != "string")
    return !1;
  const r = Nr(t);
  for (let n = 0; n < r.length; n++) {
    const s = r[n];
    if (yo(e, s), n === r.length - 1)
      return delete e[s], !0;
    if (e = e[s], !it(e))
      return !1;
  }
}
function vc(e, t) {
  if (!it(e) || typeof t != "string")
    return !1;
  const r = Nr(t);
  if (r.length === 0)
    return !1;
  for (const n of r) {
    if (!it(e) || !(n in e) || Mn(e, n))
      return !1;
    e = e[n];
  }
  return !0;
}
const xe = Yt.homedir(), Vn = Yt.tmpdir(), { env: gt } = se, _c = (e) => {
  const t = X.join(xe, "Library");
  return {
    data: X.join(t, "Application Support", e),
    config: X.join(t, "Preferences", e),
    cache: X.join(t, "Caches", e),
    log: X.join(t, "Logs", e),
    temp: X.join(Vn, e)
  };
}, Ec = (e) => {
  const t = gt.APPDATA || X.join(xe, "AppData", "Roaming"), r = gt.LOCALAPPDATA || X.join(xe, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: X.join(r, e, "Data"),
    config: X.join(t, e, "Config"),
    cache: X.join(r, e, "Cache"),
    log: X.join(r, e, "Log"),
    temp: X.join(Vn, e)
  };
}, wc = (e) => {
  const t = X.basename(xe);
  return {
    data: X.join(gt.XDG_DATA_HOME || X.join(xe, ".local", "share"), e),
    config: X.join(gt.XDG_CONFIG_HOME || X.join(xe, ".config"), e),
    cache: X.join(gt.XDG_CACHE_HOME || X.join(xe, ".cache"), e),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: X.join(gt.XDG_STATE_HOME || X.join(xe, ".local", "state"), e),
    temp: X.join(Vn, t, e)
  };
};
function bc(e, { suffix: t = "nodejs" } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  return t && (e += `-${t}`), se.platform === "darwin" ? _c(e) : se.platform === "win32" ? Ec(e) : wc(e);
}
const Ge = (e, t) => function(...n) {
  return e.apply(void 0, n).catch(t);
}, Le = (e, t) => function(...n) {
  try {
    return e.apply(void 0, n);
  } catch (s) {
    return t(s);
  }
}, Sc = se.getuid ? !se.getuid() : !1, Pc = 1e4, ve = () => {
}, ee = {
  /* API */
  isChangeErrorOk: (e) => {
    if (!ee.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "ENOSYS" || !Sc && (t === "EINVAL" || t === "EPERM");
  },
  isNodeError: (e) => e instanceof Error,
  isRetriableError: (e) => {
    if (!ee.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "EMFILE" || t === "ENFILE" || t === "EAGAIN" || t === "EBUSY" || t === "EACCESS" || t === "EACCES" || t === "EACCS" || t === "EPERM";
  },
  onChangeError: (e) => {
    if (!ee.isNodeError(e))
      throw e;
    if (!ee.isChangeErrorOk(e))
      throw e;
  }
};
class Rc {
  constructor() {
    this.interval = 25, this.intervalId = void 0, this.limit = Pc, this.queueActive = /* @__PURE__ */ new Set(), this.queueWaiting = /* @__PURE__ */ new Set(), this.init = () => {
      this.intervalId || (this.intervalId = setInterval(this.tick, this.interval));
    }, this.reset = () => {
      this.intervalId && (clearInterval(this.intervalId), delete this.intervalId);
    }, this.add = (t) => {
      this.queueWaiting.add(t), this.queueActive.size < this.limit / 2 ? this.tick() : this.init();
    }, this.remove = (t) => {
      this.queueWaiting.delete(t), this.queueActive.delete(t);
    }, this.schedule = () => new Promise((t) => {
      const r = () => this.remove(n), n = () => t(r);
      this.add(n);
    }), this.tick = () => {
      if (!(this.queueActive.size >= this.limit)) {
        if (!this.queueWaiting.size)
          return this.reset();
        for (const t of this.queueWaiting) {
          if (this.queueActive.size >= this.limit)
            break;
          this.queueWaiting.delete(t), this.queueActive.add(t), t();
        }
      }
    };
  }
}
const Ic = new Rc(), Ke = (e, t) => function(n) {
  return function s(...a) {
    return Ic.schedule().then((o) => {
      const l = (u) => (o(), u), i = (u) => {
        if (o(), Date.now() >= n)
          throw u;
        if (t(u)) {
          const c = Math.round(100 * Math.random());
          return new Promise((_) => setTimeout(_, c)).then(() => s.apply(void 0, a));
        }
        throw u;
      };
      return e.apply(void 0, a).then(l, i);
    });
  };
}, He = (e, t) => function(n) {
  return function s(...a) {
    try {
      return e.apply(void 0, a);
    } catch (o) {
      if (Date.now() > n)
        throw o;
      if (t(o))
        return s.apply(void 0, a);
      throw o;
    }
  };
}, de = {
  attempt: {
    /* ASYNC */
    chmod: Ge(le(G.chmod), ee.onChangeError),
    chown: Ge(le(G.chown), ee.onChangeError),
    close: Ge(le(G.close), ve),
    fsync: Ge(le(G.fsync), ve),
    mkdir: Ge(le(G.mkdir), ve),
    realpath: Ge(le(G.realpath), ve),
    stat: Ge(le(G.stat), ve),
    unlink: Ge(le(G.unlink), ve),
    /* SYNC */
    chmodSync: Le(G.chmodSync, ee.onChangeError),
    chownSync: Le(G.chownSync, ee.onChangeError),
    closeSync: Le(G.closeSync, ve),
    existsSync: Le(G.existsSync, ve),
    fsyncSync: Le(G.fsync, ve),
    mkdirSync: Le(G.mkdirSync, ve),
    realpathSync: Le(G.realpathSync, ve),
    statSync: Le(G.statSync, ve),
    unlinkSync: Le(G.unlinkSync, ve)
  },
  retry: {
    /* ASYNC */
    close: Ke(le(G.close), ee.isRetriableError),
    fsync: Ke(le(G.fsync), ee.isRetriableError),
    open: Ke(le(G.open), ee.isRetriableError),
    readFile: Ke(le(G.readFile), ee.isRetriableError),
    rename: Ke(le(G.rename), ee.isRetriableError),
    stat: Ke(le(G.stat), ee.isRetriableError),
    write: Ke(le(G.write), ee.isRetriableError),
    writeFile: Ke(le(G.writeFile), ee.isRetriableError),
    /* SYNC */
    closeSync: He(G.closeSync, ee.isRetriableError),
    fsyncSync: He(G.fsyncSync, ee.isRetriableError),
    openSync: He(G.openSync, ee.isRetriableError),
    readFileSync: He(G.readFileSync, ee.isRetriableError),
    renameSync: He(G.renameSync, ee.isRetriableError),
    statSync: He(G.statSync, ee.isRetriableError),
    writeSync: He(G.writeSync, ee.isRetriableError),
    writeFileSync: He(G.writeFileSync, ee.isRetriableError)
  }
}, Nc = "utf8", na = 438, Oc = 511, Tc = {}, jc = Yt.userInfo().uid, Ac = Yt.userInfo().gid, kc = 1e3, Cc = !!se.getuid;
se.getuid && se.getuid();
const sa = 128, Dc = (e) => e instanceof Error && "code" in e, aa = (e) => typeof e == "string", cn = (e) => e === void 0, Lc = se.platform === "linux", go = se.platform === "win32", Un = ["SIGABRT", "SIGALRM", "SIGHUP", "SIGINT", "SIGTERM"];
go || Un.push("SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
Lc && Un.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT", "SIGUNUSED");
class Mc {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (t) => {
      if (!this.exited) {
        this.exited = !0;
        for (const r of this.callbacks)
          r();
        t && (go && t !== "SIGINT" && t !== "SIGTERM" && t !== "SIGKILL" ? se.kill(se.pid, "SIGTERM") : se.kill(se.pid, t));
      }
    }, this.hook = () => {
      se.once("exit", () => this.exit());
      for (const t of Un)
        try {
          se.once(t, () => this.exit(t));
        } catch {
        }
    }, this.register = (t) => (this.callbacks.add(t), () => {
      this.callbacks.delete(t);
    }), this.hook();
  }
}
const Vc = new Mc(), Uc = Vc.register, fe = {
  /* VARIABLES */
  store: {},
  /* API */
  create: (e) => {
    const t = `000000${Math.floor(Math.random() * 16777215).toString(16)}`.slice(-6), s = `.tmp-${Date.now().toString().slice(-10)}${t}`;
    return `${e}${s}`;
  },
  get: (e, t, r = !0) => {
    const n = fe.truncate(t(e));
    return n in fe.store ? fe.get(e, t, r) : (fe.store[n] = r, [n, () => delete fe.store[n]]);
  },
  purge: (e) => {
    fe.store[e] && (delete fe.store[e], de.attempt.unlink(e));
  },
  purgeSync: (e) => {
    fe.store[e] && (delete fe.store[e], de.attempt.unlinkSync(e));
  },
  purgeSyncAll: () => {
    for (const e in fe.store)
      fe.purgeSync(e);
  },
  truncate: (e) => {
    const t = X.basename(e);
    if (t.length <= sa)
      return e;
    const r = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(t);
    if (!r)
      return e;
    const n = t.length - sa;
    return `${e.slice(0, -t.length)}${r[1]}${r[2].slice(0, -n)}${r[3]}`;
  }
};
Uc(fe.purgeSyncAll);
function vo(e, t, r = Tc) {
  if (aa(r))
    return vo(e, t, { encoding: r });
  const n = Date.now() + ((r.timeout ?? kc) || -1);
  let s = null, a = null, o = null;
  try {
    const l = de.attempt.realpathSync(e), i = !!l;
    e = l || e, [a, s] = fe.get(e, r.tmpCreate || fe.create, r.tmpPurge !== !1);
    const u = Cc && cn(r.chown), c = cn(r.mode);
    if (i && (u || c)) {
      const f = de.attempt.statSync(e);
      f && (r = { ...r }, u && (r.chown = { uid: f.uid, gid: f.gid }), c && (r.mode = f.mode));
    }
    if (!i) {
      const f = X.dirname(e);
      de.attempt.mkdirSync(f, {
        mode: Oc,
        recursive: !0
      });
    }
    o = de.retry.openSync(n)(a, "w", r.mode || na), r.tmpCreated && r.tmpCreated(a), aa(t) ? de.retry.writeSync(n)(o, t, 0, r.encoding || Nc) : cn(t) || de.retry.writeSync(n)(o, t, 0, t.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? de.retry.fsyncSync(n)(o) : de.attempt.fsync(o)), de.retry.closeSync(n)(o), o = null, r.chown && (r.chown.uid !== jc || r.chown.gid !== Ac) && de.attempt.chownSync(a, r.chown.uid, r.chown.gid), r.mode && r.mode !== na && de.attempt.chmodSync(a, r.mode);
    try {
      de.retry.renameSync(n)(a, e);
    } catch (f) {
      if (!Dc(f) || f.code !== "ENAMETOOLONG")
        throw f;
      de.retry.renameSync(n)(a, fe.truncate(e));
    }
    s(), a = null;
  } finally {
    o && de.attempt.closeSync(o), a && fe.purge(a);
  }
}
var wn = { exports: {} }, zn = {}, Se = {}, Rt = {}, Qt = {}, F = {}, xt = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class r extends t {
    constructor(w) {
      if (super(), !e.IDENTIFIER.test(w))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = w;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      return !1;
    }
    get names() {
      return { [this.str]: 1 };
    }
  }
  e.Name = r;
  class n extends t {
    constructor(w) {
      super(), this._items = typeof w == "string" ? [w] : w;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const w = this._items[0];
      return w === "" || w === '""';
    }
    get str() {
      var w;
      return (w = this._str) !== null && w !== void 0 ? w : this._str = this._items.reduce((R, O) => `${R}${O}`, "");
    }
    get names() {
      var w;
      return (w = this._names) !== null && w !== void 0 ? w : this._names = this._items.reduce((R, O) => (O instanceof r && (R[O.str] = (R[O.str] || 0) + 1), R), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function s(m, ...w) {
    const R = [m[0]];
    let O = 0;
    for (; O < w.length; )
      l(R, w[O]), R.push(m[++O]);
    return new n(R);
  }
  e._ = s;
  const a = new n("+");
  function o(m, ...w) {
    const R = [$(m[0])];
    let O = 0;
    for (; O < w.length; )
      R.push(a), l(R, w[O]), R.push(a, $(m[++O]));
    return i(R), new n(R);
  }
  e.str = o;
  function l(m, w) {
    w instanceof n ? m.push(...w._items) : w instanceof r ? m.push(w) : m.push(f(w));
  }
  e.addCodeArg = l;
  function i(m) {
    let w = 1;
    for (; w < m.length - 1; ) {
      if (m[w] === a) {
        const R = u(m[w - 1], m[w + 1]);
        if (R !== void 0) {
          m.splice(w - 1, 3, R);
          continue;
        }
        m[w++] = "+";
      }
      w++;
    }
  }
  function u(m, w) {
    if (w === '""')
      return m;
    if (m === '""')
      return w;
    if (typeof m == "string")
      return w instanceof r || m[m.length - 1] !== '"' ? void 0 : typeof w != "string" ? `${m.slice(0, -1)}${w}"` : w[0] === '"' ? m.slice(0, -1) + w.slice(1) : void 0;
    if (typeof w == "string" && w[0] === '"' && !(m instanceof r))
      return `"${m}${w.slice(1)}`;
  }
  function c(m, w) {
    return w.emptyStr() ? m : m.emptyStr() ? w : o`${m}${w}`;
  }
  e.strConcat = c;
  function f(m) {
    return typeof m == "number" || typeof m == "boolean" || m === null ? m : $(Array.isArray(m) ? m.join(",") : m);
  }
  function _(m) {
    return new n($(m));
  }
  e.stringify = _;
  function $(m) {
    return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = $;
  function E(m) {
    return typeof m == "string" && e.IDENTIFIER.test(m) ? new n(`.${m}`) : s`[${m}]`;
  }
  e.getProperty = E;
  function y(m) {
    if (typeof m == "string" && e.IDENTIFIER.test(m))
      return new n(`${m}`);
    throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
  }
  e.getEsmExportName = y;
  function v(m) {
    return new n(m.toString());
  }
  e.regexpCode = v;
})(xt);
var bn = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = xt;
  class r extends Error {
    constructor(u) {
      super(`CodeGen: "code" for ${u} not defined`), this.value = u.value;
    }
  }
  var n;
  (function(i) {
    i[i.Started = 0] = "Started", i[i.Completed = 1] = "Completed";
  })(n || (e.UsedValueState = n = {})), e.varKinds = {
    const: new t.Name("const"),
    let: new t.Name("let"),
    var: new t.Name("var")
  };
  class s {
    constructor({ prefixes: u, parent: c } = {}) {
      this._names = {}, this._prefixes = u, this._parent = c;
    }
    toName(u) {
      return u instanceof t.Name ? u : this.name(u);
    }
    name(u) {
      return new t.Name(this._newName(u));
    }
    _newName(u) {
      const c = this._names[u] || this._nameGroup(u);
      return `${u}${c.index++}`;
    }
    _nameGroup(u) {
      var c, f;
      if (!((f = (c = this._parent) === null || c === void 0 ? void 0 : c._prefixes) === null || f === void 0) && f.has(u) || this._prefixes && !this._prefixes.has(u))
        throw new Error(`CodeGen: prefix "${u}" is not allowed in this scope`);
      return this._names[u] = { prefix: u, index: 0 };
    }
  }
  e.Scope = s;
  class a extends t.Name {
    constructor(u, c) {
      super(c), this.prefix = u;
    }
    setValue(u, { property: c, itemIndex: f }) {
      this.value = u, this.scopePath = (0, t._)`.${new t.Name(c)}[${f}]`;
    }
  }
  e.ValueScopeName = a;
  const o = (0, t._)`\n`;
  class l extends s {
    constructor(u) {
      super(u), this._values = {}, this._scope = u.scope, this.opts = { ...u, _n: u.lines ? o : t.nil };
    }
    get() {
      return this._scope;
    }
    name(u) {
      return new a(u, this._newName(u));
    }
    value(u, c) {
      var f;
      if (c.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const _ = this.toName(u), { prefix: $ } = _, E = (f = c.key) !== null && f !== void 0 ? f : c.ref;
      let y = this._values[$];
      if (y) {
        const w = y.get(E);
        if (w)
          return w;
      } else
        y = this._values[$] = /* @__PURE__ */ new Map();
      y.set(E, _);
      const v = this._scope[$] || (this._scope[$] = []), m = v.length;
      return v[m] = c.ref, _.setValue(c, { property: $, itemIndex: m }), _;
    }
    getValue(u, c) {
      const f = this._values[u];
      if (f)
        return f.get(c);
    }
    scopeRefs(u, c = this._values) {
      return this._reduceValues(c, (f) => {
        if (f.scopePath === void 0)
          throw new Error(`CodeGen: name "${f}" has no value`);
        return (0, t._)`${u}${f.scopePath}`;
      });
    }
    scopeCode(u = this._values, c, f) {
      return this._reduceValues(u, (_) => {
        if (_.value === void 0)
          throw new Error(`CodeGen: name "${_}" has no value`);
        return _.value.code;
      }, c, f);
    }
    _reduceValues(u, c, f = {}, _) {
      let $ = t.nil;
      for (const E in u) {
        const y = u[E];
        if (!y)
          continue;
        const v = f[E] = f[E] || /* @__PURE__ */ new Map();
        y.forEach((m) => {
          if (v.has(m))
            return;
          v.set(m, n.Started);
          let w = c(m);
          if (w) {
            const R = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            $ = (0, t._)`${$}${R} ${m} = ${w};${this.opts._n}`;
          } else if (w = _ == null ? void 0 : _(m))
            $ = (0, t._)`${$}${w}${this.opts._n}`;
          else
            throw new r(m);
          v.set(m, n.Completed);
        });
      }
      return $;
    }
  }
  e.ValueScope = l;
})(bn);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = xt, r = bn;
  var n = xt;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return n._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return n.str;
  } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
    return n.strConcat;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return n.nil;
  } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
    return n.getProperty;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return n.stringify;
  } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
    return n.regexpCode;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return n.Name;
  } });
  var s = bn;
  Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
    return s.Scope;
  } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
    return s.ValueScope;
  } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
    return s.ValueScopeName;
  } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
    return s.varKinds;
  } }), e.operators = {
    GT: new t._Code(">"),
    GTE: new t._Code(">="),
    LT: new t._Code("<"),
    LTE: new t._Code("<="),
    EQ: new t._Code("==="),
    NEQ: new t._Code("!=="),
    NOT: new t._Code("!"),
    OR: new t._Code("||"),
    AND: new t._Code("&&"),
    ADD: new t._Code("+")
  };
  class a {
    optimizeNodes() {
      return this;
    }
    optimizeNames(d, h) {
      return this;
    }
  }
  class o extends a {
    constructor(d, h, S) {
      super(), this.varKind = d, this.name = h, this.rhs = S;
    }
    render({ es5: d, _n: h }) {
      const S = d ? r.varKinds.var : this.varKind, L = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${S} ${this.name}${L};` + h;
    }
    optimizeNames(d, h) {
      if (d[this.name.str])
        return this.rhs && (this.rhs = I(this.rhs, d, h)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class l extends a {
    constructor(d, h, S) {
      super(), this.lhs = d, this.rhs = h, this.sideEffects = S;
    }
    render({ _n: d }) {
      return `${this.lhs} = ${this.rhs};` + d;
    }
    optimizeNames(d, h) {
      if (!(this.lhs instanceof t.Name && !d[this.lhs.str] && !this.sideEffects))
        return this.rhs = I(this.rhs, d, h), this;
    }
    get names() {
      const d = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return Y(d, this.rhs);
    }
  }
  class i extends l {
    constructor(d, h, S, L) {
      super(d, S, L), this.op = h;
    }
    render({ _n: d }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + d;
    }
  }
  class u extends a {
    constructor(d) {
      super(), this.label = d, this.names = {};
    }
    render({ _n: d }) {
      return `${this.label}:` + d;
    }
  }
  class c extends a {
    constructor(d) {
      super(), this.label = d, this.names = {};
    }
    render({ _n: d }) {
      return `break${this.label ? ` ${this.label}` : ""};` + d;
    }
  }
  class f extends a {
    constructor(d) {
      super(), this.error = d;
    }
    render({ _n: d }) {
      return `throw ${this.error};` + d;
    }
    get names() {
      return this.error.names;
    }
  }
  class _ extends a {
    constructor(d) {
      super(), this.code = d;
    }
    render({ _n: d }) {
      return `${this.code};` + d;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(d, h) {
      return this.code = I(this.code, d, h), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class $ extends a {
    constructor(d = []) {
      super(), this.nodes = d;
    }
    render(d) {
      return this.nodes.reduce((h, S) => h + S.render(d), "");
    }
    optimizeNodes() {
      const { nodes: d } = this;
      let h = d.length;
      for (; h--; ) {
        const S = d[h].optimizeNodes();
        Array.isArray(S) ? d.splice(h, 1, ...S) : S ? d[h] = S : d.splice(h, 1);
      }
      return d.length > 0 ? this : void 0;
    }
    optimizeNames(d, h) {
      const { nodes: S } = this;
      let L = S.length;
      for (; L--; ) {
        const M = S[L];
        M.optimizeNames(d, h) || (N(d, M.names), S.splice(L, 1));
      }
      return S.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((d, h) => q(d, h.names), {});
    }
  }
  class E extends $ {
    render(d) {
      return "{" + d._n + super.render(d) + "}" + d._n;
    }
  }
  class y extends $ {
  }
  class v extends E {
  }
  v.kind = "else";
  class m extends E {
    constructor(d, h) {
      super(h), this.condition = d;
    }
    render(d) {
      let h = `if(${this.condition})` + super.render(d);
      return this.else && (h += "else " + this.else.render(d)), h;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const d = this.condition;
      if (d === !0)
        return this.nodes;
      let h = this.else;
      if (h) {
        const S = h.optimizeNodes();
        h = this.else = Array.isArray(S) ? new v(S) : S;
      }
      if (h)
        return d === !1 ? h instanceof m ? h : h.nodes : this.nodes.length ? this : new m(C(d), h instanceof m ? [h] : h.nodes);
      if (!(d === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(d, h) {
      var S;
      if (this.else = (S = this.else) === null || S === void 0 ? void 0 : S.optimizeNames(d, h), !!(super.optimizeNames(d, h) || this.else))
        return this.condition = I(this.condition, d, h), this;
    }
    get names() {
      const d = super.names;
      return Y(d, this.condition), this.else && q(d, this.else.names), d;
    }
  }
  m.kind = "if";
  class w extends E {
  }
  w.kind = "for";
  class R extends w {
    constructor(d) {
      super(), this.iteration = d;
    }
    render(d) {
      return `for(${this.iteration})` + super.render(d);
    }
    optimizeNames(d, h) {
      if (super.optimizeNames(d, h))
        return this.iteration = I(this.iteration, d, h), this;
    }
    get names() {
      return q(super.names, this.iteration.names);
    }
  }
  class O extends w {
    constructor(d, h, S, L) {
      super(), this.varKind = d, this.name = h, this.from = S, this.to = L;
    }
    render(d) {
      const h = d.es5 ? r.varKinds.var : this.varKind, { name: S, from: L, to: M } = this;
      return `for(${h} ${S}=${L}; ${S}<${M}; ${S}++)` + super.render(d);
    }
    get names() {
      const d = Y(super.names, this.from);
      return Y(d, this.to);
    }
  }
  class j extends w {
    constructor(d, h, S, L) {
      super(), this.loop = d, this.varKind = h, this.name = S, this.iterable = L;
    }
    render(d) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(d);
    }
    optimizeNames(d, h) {
      if (super.optimizeNames(d, h))
        return this.iterable = I(this.iterable, d, h), this;
    }
    get names() {
      return q(super.names, this.iterable.names);
    }
  }
  class B extends E {
    constructor(d, h, S) {
      super(), this.name = d, this.args = h, this.async = S;
    }
    render(d) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(d);
    }
  }
  B.kind = "func";
  class te extends $ {
    render(d) {
      return "return " + super.render(d);
    }
  }
  te.kind = "return";
  class ye extends E {
    render(d) {
      let h = "try" + super.render(d);
      return this.catch && (h += this.catch.render(d)), this.finally && (h += this.finally.render(d)), h;
    }
    optimizeNodes() {
      var d, h;
      return super.optimizeNodes(), (d = this.catch) === null || d === void 0 || d.optimizeNodes(), (h = this.finally) === null || h === void 0 || h.optimizeNodes(), this;
    }
    optimizeNames(d, h) {
      var S, L;
      return super.optimizeNames(d, h), (S = this.catch) === null || S === void 0 || S.optimizeNames(d, h), (L = this.finally) === null || L === void 0 || L.optimizeNames(d, h), this;
    }
    get names() {
      const d = super.names;
      return this.catch && q(d, this.catch.names), this.finally && q(d, this.finally.names), d;
    }
  }
  class we extends E {
    constructor(d) {
      super(), this.error = d;
    }
    render(d) {
      return `catch(${this.error})` + super.render(d);
    }
  }
  we.kind = "catch";
  class Pe extends E {
    render(d) {
      return "finally" + super.render(d);
    }
  }
  Pe.kind = "finally";
  class U {
    constructor(d, h = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...h, _n: h.lines ? `
` : "" }, this._extScope = d, this._scope = new r.Scope({ parent: d }), this._nodes = [new y()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(d) {
      return this._scope.name(d);
    }
    // reserves unique name in the external scope
    scopeName(d) {
      return this._extScope.name(d);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(d, h) {
      const S = this._extScope.value(d, h);
      return (this._values[S.prefix] || (this._values[S.prefix] = /* @__PURE__ */ new Set())).add(S), S;
    }
    getScopeValue(d, h) {
      return this._extScope.getValue(d, h);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(d) {
      return this._extScope.scopeRefs(d, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(d, h, S, L) {
      const M = this._scope.toName(h);
      return S !== void 0 && L && (this._constants[M.str] = S), this._leafNode(new o(d, M, S)), M;
    }
    // `const` declaration (`var` in es5 mode)
    const(d, h, S) {
      return this._def(r.varKinds.const, d, h, S);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(d, h, S) {
      return this._def(r.varKinds.let, d, h, S);
    }
    // `var` declaration with optional assignment
    var(d, h, S) {
      return this._def(r.varKinds.var, d, h, S);
    }
    // assignment code
    assign(d, h, S) {
      return this._leafNode(new l(d, h, S));
    }
    // `+=` code
    add(d, h) {
      return this._leafNode(new i(d, e.operators.ADD, h));
    }
    // appends passed SafeExpr to code or executes Block
    code(d) {
      return typeof d == "function" ? d() : d !== t.nil && this._leafNode(new _(d)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...d) {
      const h = ["{"];
      for (const [S, L] of d)
        h.length > 1 && h.push(","), h.push(S), (S !== L || this.opts.es5) && (h.push(":"), (0, t.addCodeArg)(h, L));
      return h.push("}"), new t._Code(h);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(d, h, S) {
      if (this._blockNode(new m(d)), h && S)
        this.code(h).else().code(S).endIf();
      else if (h)
        this.code(h).endIf();
      else if (S)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(d) {
      return this._elseNode(new m(d));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new v());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(m, v);
    }
    _for(d, h) {
      return this._blockNode(d), h && this.code(h).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(d, h) {
      return this._for(new R(d), h);
    }
    // `for` statement for a range of values
    forRange(d, h, S, L, M = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const J = this._scope.toName(d);
      return this._for(new O(M, J, h, S), () => L(J));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(d, h, S, L = r.varKinds.const) {
      const M = this._scope.toName(d);
      if (this.opts.es5) {
        const J = h instanceof t.Name ? h : this.var("_arr", h);
        return this.forRange("_i", 0, (0, t._)`${J}.length`, (W) => {
          this.var(M, (0, t._)`${J}[${W}]`), S(M);
        });
      }
      return this._for(new j("of", L, M, h), () => S(M));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(d, h, S, L = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(d, (0, t._)`Object.keys(${h})`, S);
      const M = this._scope.toName(d);
      return this._for(new j("in", L, M, h), () => S(M));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(w);
    }
    // `label` statement
    label(d) {
      return this._leafNode(new u(d));
    }
    // `break` statement
    break(d) {
      return this._leafNode(new c(d));
    }
    // `return` statement
    return(d) {
      const h = new te();
      if (this._blockNode(h), this.code(d), h.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(te);
    }
    // `try` statement
    try(d, h, S) {
      if (!h && !S)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const L = new ye();
      if (this._blockNode(L), this.code(d), h) {
        const M = this.name("e");
        this._currNode = L.catch = new we(M), h(M);
      }
      return S && (this._currNode = L.finally = new Pe(), this.code(S)), this._endBlockNode(we, Pe);
    }
    // `throw` statement
    throw(d) {
      return this._leafNode(new f(d));
    }
    // start self-balancing block
    block(d, h) {
      return this._blockStarts.push(this._nodes.length), d && this.code(d).endBlock(h), this;
    }
    // end the current self-balancing block
    endBlock(d) {
      const h = this._blockStarts.pop();
      if (h === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const S = this._nodes.length - h;
      if (S < 0 || d !== void 0 && S !== d)
        throw new Error(`CodeGen: wrong number of nodes: ${S} vs ${d} expected`);
      return this._nodes.length = h, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(d, h = t.nil, S, L) {
      return this._blockNode(new B(d, h, S)), L && this.code(L).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(B);
    }
    optimize(d = 1) {
      for (; d-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(d) {
      return this._currNode.nodes.push(d), this;
    }
    _blockNode(d) {
      this._currNode.nodes.push(d), this._nodes.push(d);
    }
    _endBlockNode(d, h) {
      const S = this._currNode;
      if (S instanceof d || h && S instanceof h)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${h ? `${d.kind}/${h.kind}` : d.kind}"`);
    }
    _elseNode(d) {
      const h = this._currNode;
      if (!(h instanceof m))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = h.else = d, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const d = this._nodes;
      return d[d.length - 1];
    }
    set _currNode(d) {
      const h = this._nodes;
      h[h.length - 1] = d;
    }
  }
  e.CodeGen = U;
  function q(g, d) {
    for (const h in d)
      g[h] = (g[h] || 0) + (d[h] || 0);
    return g;
  }
  function Y(g, d) {
    return d instanceof t._CodeOrName ? q(g, d.names) : g;
  }
  function I(g, d, h) {
    if (g instanceof t.Name)
      return S(g);
    if (!L(g))
      return g;
    return new t._Code(g._items.reduce((M, J) => (J instanceof t.Name && (J = S(J)), J instanceof t._Code ? M.push(...J._items) : M.push(J), M), []));
    function S(M) {
      const J = h[M.str];
      return J === void 0 || d[M.str] !== 1 ? M : (delete d[M.str], J);
    }
    function L(M) {
      return M instanceof t._Code && M._items.some((J) => J instanceof t.Name && d[J.str] === 1 && h[J.str] !== void 0);
    }
  }
  function N(g, d) {
    for (const h in d)
      g[h] = (g[h] || 0) - (d[h] || 0);
  }
  function C(g) {
    return typeof g == "boolean" || typeof g == "number" || g === null ? !g : (0, t._)`!${b(g)}`;
  }
  e.not = C;
  const A = p(e.operators.AND);
  function V(...g) {
    return g.reduce(A);
  }
  e.and = V;
  const k = p(e.operators.OR);
  function P(...g) {
    return g.reduce(k);
  }
  e.or = P;
  function p(g) {
    return (d, h) => d === t.nil ? h : h === t.nil ? d : (0, t._)`${b(d)} ${g} ${b(h)}`;
  }
  function b(g) {
    return g instanceof t.Name ? g : (0, t._)`(${g})`;
  }
})(F);
var T = {};
Object.defineProperty(T, "__esModule", { value: !0 });
T.checkStrictMode = T.getErrorPath = T.Type = T.useFunc = T.setEvaluated = T.evaluatedPropsToName = T.mergeEvaluated = T.eachItem = T.unescapeJsonPointer = T.escapeJsonPointer = T.escapeFragment = T.unescapeFragment = T.schemaRefOrVal = T.schemaHasRulesButRef = T.schemaHasRules = T.checkUnknownRules = T.alwaysValidSchema = T.toHash = void 0;
const x = F, zc = xt;
function Fc(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
T.toHash = Fc;
function qc(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (_o(e, t), !Eo(t, e.self.RULES.all));
}
T.alwaysValidSchema = qc;
function _o(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in t)
    s[a] || So(e, `unknown keyword: "${a}"`);
}
T.checkUnknownRules = _o;
function Eo(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
T.schemaHasRules = Eo;
function Gc(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
T.schemaHasRulesButRef = Gc;
function Kc({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, x._)`${r}`;
  }
  return (0, x._)`${e}${t}${(0, x.getProperty)(n)}`;
}
T.schemaRefOrVal = Kc;
function Hc(e) {
  return wo(decodeURIComponent(e));
}
T.unescapeFragment = Hc;
function Xc(e) {
  return encodeURIComponent(Fn(e));
}
T.escapeFragment = Xc;
function Fn(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
T.escapeJsonPointer = Fn;
function wo(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
T.unescapeJsonPointer = wo;
function Wc(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
T.eachItem = Wc;
function oa({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, a, o, l) => {
    const i = o === void 0 ? a : o instanceof x.Name ? (a instanceof x.Name ? e(s, a, o) : t(s, a, o), o) : a instanceof x.Name ? (t(s, o, a), a) : r(a, o);
    return l === x.Name && !(i instanceof x.Name) ? n(s, i) : i;
  };
}
T.mergeEvaluated = {
  props: oa({
    mergeNames: (e, t, r) => e.if((0, x._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, x._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, x._)`${r} || {}`).code((0, x._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, x._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, x._)`${r} || {}`), qn(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: bo
  }),
  items: oa({
    mergeNames: (e, t, r) => e.if((0, x._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, x._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, x._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, x._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function bo(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, x._)`{}`);
  return t !== void 0 && qn(e, r, t), r;
}
T.evaluatedPropsToName = bo;
function qn(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, x._)`${t}${(0, x.getProperty)(n)}`, !0));
}
T.setEvaluated = qn;
const ia = {};
function Bc(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: ia[t.code] || (ia[t.code] = new zc._Code(t.code))
  });
}
T.useFunc = Bc;
var Sn;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(Sn || (T.Type = Sn = {}));
function Jc(e, t, r) {
  if (e instanceof x.Name) {
    const n = t === Sn.Num;
    return r ? n ? (0, x._)`"[" + ${e} + "]"` : (0, x._)`"['" + ${e} + "']"` : n ? (0, x._)`"/" + ${e}` : (0, x._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, x.getProperty)(e).toString() : "/" + Fn(e);
}
T.getErrorPath = Jc;
function So(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
T.checkStrictMode = So;
var Ee = {};
Object.defineProperty(Ee, "__esModule", { value: !0 });
const ue = F, xc = {
  // validation function arguments
  data: new ue.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new ue.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new ue.Name("instancePath"),
  parentData: new ue.Name("parentData"),
  parentDataProperty: new ue.Name("parentDataProperty"),
  rootData: new ue.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new ue.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new ue.Name("vErrors"),
  // null or array of validation errors
  errors: new ue.Name("errors"),
  // counter of validation errors
  this: new ue.Name("this"),
  // "globals"
  self: new ue.Name("self"),
  scope: new ue.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new ue.Name("json"),
  jsonPos: new ue.Name("jsonPos"),
  jsonLen: new ue.Name("jsonLen"),
  jsonPart: new ue.Name("jsonPart")
};
Ee.default = xc;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = F, r = T, n = Ee;
  e.keywordError = {
    message: ({ keyword: v }) => (0, t.str)`must pass "${v}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: v, schemaType: m }) => m ? (0, t.str)`"${v}" keyword must be ${m} ($data)` : (0, t.str)`"${v}" keyword is invalid ($data)`
  };
  function s(v, m = e.keywordError, w, R) {
    const { it: O } = v, { gen: j, compositeRule: B, allErrors: te } = O, ye = f(v, m, w);
    R ?? (B || te) ? i(j, ye) : u(O, (0, t._)`[${ye}]`);
  }
  e.reportError = s;
  function a(v, m = e.keywordError, w) {
    const { it: R } = v, { gen: O, compositeRule: j, allErrors: B } = R, te = f(v, m, w);
    i(O, te), j || B || u(R, n.default.vErrors);
  }
  e.reportExtraError = a;
  function o(v, m) {
    v.assign(n.default.errors, m), v.if((0, t._)`${n.default.vErrors} !== null`, () => v.if(m, () => v.assign((0, t._)`${n.default.vErrors}.length`, m), () => v.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = o;
  function l({ gen: v, keyword: m, schemaValue: w, data: R, errsCount: O, it: j }) {
    if (O === void 0)
      throw new Error("ajv implementation error");
    const B = v.name("err");
    v.forRange("i", O, n.default.errors, (te) => {
      v.const(B, (0, t._)`${n.default.vErrors}[${te}]`), v.if((0, t._)`${B}.instancePath === undefined`, () => v.assign((0, t._)`${B}.instancePath`, (0, t.strConcat)(n.default.instancePath, j.errorPath))), v.assign((0, t._)`${B}.schemaPath`, (0, t.str)`${j.errSchemaPath}/${m}`), j.opts.verbose && (v.assign((0, t._)`${B}.schema`, w), v.assign((0, t._)`${B}.data`, R));
    });
  }
  e.extendErrors = l;
  function i(v, m) {
    const w = v.const("err", m);
    v.if((0, t._)`${n.default.vErrors} === null`, () => v.assign(n.default.vErrors, (0, t._)`[${w}]`), (0, t._)`${n.default.vErrors}.push(${w})`), v.code((0, t._)`${n.default.errors}++`);
  }
  function u(v, m) {
    const { gen: w, validateName: R, schemaEnv: O } = v;
    O.$async ? w.throw((0, t._)`new ${v.ValidationError}(${m})`) : (w.assign((0, t._)`${R}.errors`, m), w.return(!1));
  }
  const c = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    // also used in JTD errors
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function f(v, m, w) {
    const { createErrors: R } = v.it;
    return R === !1 ? (0, t._)`{}` : _(v, m, w);
  }
  function _(v, m, w = {}) {
    const { gen: R, it: O } = v, j = [
      $(O, w),
      E(v, w)
    ];
    return y(v, m, j), R.object(...j);
  }
  function $({ errorPath: v }, { instancePath: m }) {
    const w = m ? (0, t.str)`${v}${(0, r.getErrorPath)(m, r.Type.Str)}` : v;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, w)];
  }
  function E({ keyword: v, it: { errSchemaPath: m } }, { schemaPath: w, parentSchema: R }) {
    let O = R ? m : (0, t.str)`${m}/${v}`;
    return w && (O = (0, t.str)`${O}${(0, r.getErrorPath)(w, r.Type.Str)}`), [c.schemaPath, O];
  }
  function y(v, { params: m, message: w }, R) {
    const { keyword: O, data: j, schemaValue: B, it: te } = v, { opts: ye, propertyName: we, topSchemaRef: Pe, schemaPath: U } = te;
    R.push([c.keyword, O], [c.params, typeof m == "function" ? m(v) : m || (0, t._)`{}`]), ye.messages && R.push([c.message, typeof w == "function" ? w(v) : w]), ye.verbose && R.push([c.schema, B], [c.parentSchema, (0, t._)`${Pe}${U}`], [n.default.data, j]), we && R.push([c.propertyName, we]);
  }
})(Qt);
Object.defineProperty(Rt, "__esModule", { value: !0 });
Rt.boolOrEmptySchema = Rt.topBoolOrEmptySchema = void 0;
const Yc = Qt, Zc = F, Qc = Ee, el = {
  message: "boolean schema is false"
};
function tl(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? Po(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(Qc.default.data) : (t.assign((0, Zc._)`${n}.errors`, null), t.return(!0));
}
Rt.topBoolOrEmptySchema = tl;
function rl(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), Po(e)) : r.var(t, !0);
}
Rt.boolOrEmptySchema = rl;
function Po(e, t) {
  const { gen: r, data: n } = e, s = {
    gen: r,
    keyword: "false schema",
    data: n,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: e
  };
  (0, Yc.reportError)(s, el, void 0, t);
}
var ne = {}, ct = {};
Object.defineProperty(ct, "__esModule", { value: !0 });
ct.getRules = ct.isJSONType = void 0;
const nl = ["string", "number", "integer", "boolean", "null", "object", "array"], sl = new Set(nl);
function al(e) {
  return typeof e == "string" && sl.has(e);
}
ct.isJSONType = al;
function ol() {
  const e = {
    number: { type: "number", rules: [] },
    string: { type: "string", rules: [] },
    array: { type: "array", rules: [] },
    object: { type: "object", rules: [] }
  };
  return {
    types: { ...e, integer: !0, boolean: !0, null: !0 },
    rules: [{ rules: [] }, e.number, e.string, e.array, e.object],
    post: { rules: [] },
    all: {},
    keywords: {}
  };
}
ct.getRules = ol;
var Ue = {};
Object.defineProperty(Ue, "__esModule", { value: !0 });
Ue.shouldUseRule = Ue.shouldUseGroup = Ue.schemaHasRulesForType = void 0;
function il({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && Ro(e, n);
}
Ue.schemaHasRulesForType = il;
function Ro(e, t) {
  return t.rules.some((r) => Io(e, r));
}
Ue.shouldUseGroup = Ro;
function Io(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
Ue.shouldUseRule = Io;
Object.defineProperty(ne, "__esModule", { value: !0 });
ne.reportTypeError = ne.checkDataTypes = ne.checkDataType = ne.coerceAndCheckDataType = ne.getJSONTypes = ne.getSchemaTypes = ne.DataType = void 0;
const cl = ct, ll = Ue, ul = Qt, K = F, No = T;
var _t;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(_t || (ne.DataType = _t = {}));
function dl(e) {
  const t = Oo(e.type);
  if (t.includes("null")) {
    if (e.nullable === !1)
      throw new Error("type: null contradicts nullable: false");
  } else {
    if (!t.length && e.nullable !== void 0)
      throw new Error('"nullable" cannot be used without "type"');
    e.nullable === !0 && t.push("null");
  }
  return t;
}
ne.getSchemaTypes = dl;
function Oo(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(cl.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
ne.getJSONTypes = Oo;
function fl(e, t) {
  const { gen: r, data: n, opts: s } = e, a = hl(t, s.coerceTypes), o = t.length > 0 && !(a.length === 0 && t.length === 1 && (0, ll.schemaHasRulesForType)(e, t[0]));
  if (o) {
    const l = Gn(t, n, s.strictNumbers, _t.Wrong);
    r.if(l, () => {
      a.length ? ml(e, t, a) : Kn(e);
    });
  }
  return o;
}
ne.coerceAndCheckDataType = fl;
const To = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function hl(e, t) {
  return t ? e.filter((r) => To.has(r) || t === "array" && r === "array") : [];
}
function ml(e, t, r) {
  const { gen: n, data: s, opts: a } = e, o = n.let("dataType", (0, K._)`typeof ${s}`), l = n.let("coerced", (0, K._)`undefined`);
  a.coerceTypes === "array" && n.if((0, K._)`${o} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, K._)`${s}[0]`).assign(o, (0, K._)`typeof ${s}`).if(Gn(t, s, a.strictNumbers), () => n.assign(l, s))), n.if((0, K._)`${l} !== undefined`);
  for (const u of r)
    (To.has(u) || u === "array" && a.coerceTypes === "array") && i(u);
  n.else(), Kn(e), n.endIf(), n.if((0, K._)`${l} !== undefined`, () => {
    n.assign(s, l), pl(e, l);
  });
  function i(u) {
    switch (u) {
      case "string":
        n.elseIf((0, K._)`${o} == "number" || ${o} == "boolean"`).assign(l, (0, K._)`"" + ${s}`).elseIf((0, K._)`${s} === null`).assign(l, (0, K._)`""`);
        return;
      case "number":
        n.elseIf((0, K._)`${o} == "boolean" || ${s} === null
              || (${o} == "string" && ${s} && ${s} == +${s})`).assign(l, (0, K._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, K._)`${o} === "boolean" || ${s} === null
              || (${o} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(l, (0, K._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, K._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(l, !1).elseIf((0, K._)`${s} === "true" || ${s} === 1`).assign(l, !0);
        return;
      case "null":
        n.elseIf((0, K._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(l, null);
        return;
      case "array":
        n.elseIf((0, K._)`${o} === "string" || ${o} === "number"
              || ${o} === "boolean" || ${s} === null`).assign(l, (0, K._)`[${s}]`);
    }
  }
}
function pl({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, K._)`${t} !== undefined`, () => e.assign((0, K._)`${t}[${r}]`, n));
}
function Pn(e, t, r, n = _t.Correct) {
  const s = n === _t.Correct ? K.operators.EQ : K.operators.NEQ;
  let a;
  switch (e) {
    case "null":
      return (0, K._)`${t} ${s} null`;
    case "array":
      a = (0, K._)`Array.isArray(${t})`;
      break;
    case "object":
      a = (0, K._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      a = o((0, K._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      a = o();
      break;
    default:
      return (0, K._)`typeof ${t} ${s} ${e}`;
  }
  return n === _t.Correct ? a : (0, K.not)(a);
  function o(l = K.nil) {
    return (0, K.and)((0, K._)`typeof ${t} == "number"`, l, r ? (0, K._)`isFinite(${t})` : K.nil);
  }
}
ne.checkDataType = Pn;
function Gn(e, t, r, n) {
  if (e.length === 1)
    return Pn(e[0], t, r, n);
  let s;
  const a = (0, No.toHash)(e);
  if (a.array && a.object) {
    const o = (0, K._)`typeof ${t} != "object"`;
    s = a.null ? o : (0, K._)`!${t} || ${o}`, delete a.null, delete a.array, delete a.object;
  } else
    s = K.nil;
  a.number && delete a.integer;
  for (const o in a)
    s = (0, K.and)(s, Pn(o, t, r, n));
  return s;
}
ne.checkDataTypes = Gn;
const $l = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, K._)`{type: ${e}}` : (0, K._)`{type: ${t}}`
};
function Kn(e) {
  const t = yl(e);
  (0, ul.reportError)(t, $l);
}
ne.reportTypeError = Kn;
function yl(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, No.schemaRefOrVal)(e, n, "type");
  return {
    gen: t,
    keyword: "type",
    data: r,
    schema: n.type,
    schemaCode: s,
    schemaValue: s,
    parentSchema: n,
    params: {},
    it: e
  };
}
var Or = {};
Object.defineProperty(Or, "__esModule", { value: !0 });
Or.assignDefaults = void 0;
const ft = F, gl = T;
function vl(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      ca(e, s, r[s].default);
  else t === "array" && Array.isArray(n) && n.forEach((s, a) => ca(e, a, s.default));
}
Or.assignDefaults = vl;
function ca(e, t, r) {
  const { gen: n, compositeRule: s, data: a, opts: o } = e;
  if (r === void 0)
    return;
  const l = (0, ft._)`${a}${(0, ft.getProperty)(t)}`;
  if (s) {
    (0, gl.checkStrictMode)(e, `default is ignored for: ${l}`);
    return;
  }
  let i = (0, ft._)`${l} === undefined`;
  o.useDefaults === "empty" && (i = (0, ft._)`${i} || ${l} === null || ${l} === ""`), n.if(i, (0, ft._)`${l} = ${(0, ft.stringify)(r)}`);
}
var Ce = {}, H = {};
Object.defineProperty(H, "__esModule", { value: !0 });
H.validateUnion = H.validateArray = H.usePattern = H.callValidateCode = H.schemaProperties = H.allSchemaProperties = H.noPropertyInData = H.propertyInData = H.isOwnProperty = H.hasPropFunc = H.reportMissingProp = H.checkMissingProp = H.checkReportMissingProp = void 0;
const Z = F, Hn = T, Xe = Ee, _l = T;
function El(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(Wn(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, Z._)`${t}` }, !0), e.error();
  });
}
H.checkReportMissingProp = El;
function wl({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, Z.or)(...n.map((a) => (0, Z.and)(Wn(e, t, a, r.ownProperties), (0, Z._)`${s} = ${a}`)));
}
H.checkMissingProp = wl;
function bl(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
H.reportMissingProp = bl;
function jo(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, Z._)`Object.prototype.hasOwnProperty`
  });
}
H.hasPropFunc = jo;
function Xn(e, t, r) {
  return (0, Z._)`${jo(e)}.call(${t}, ${r})`;
}
H.isOwnProperty = Xn;
function Sl(e, t, r, n) {
  const s = (0, Z._)`${t}${(0, Z.getProperty)(r)} !== undefined`;
  return n ? (0, Z._)`${s} && ${Xn(e, t, r)}` : s;
}
H.propertyInData = Sl;
function Wn(e, t, r, n) {
  const s = (0, Z._)`${t}${(0, Z.getProperty)(r)} === undefined`;
  return n ? (0, Z.or)(s, (0, Z.not)(Xn(e, t, r))) : s;
}
H.noPropertyInData = Wn;
function Ao(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
H.allSchemaProperties = Ao;
function Pl(e, t) {
  return Ao(t).filter((r) => !(0, Hn.alwaysValidSchema)(e, t[r]));
}
H.schemaProperties = Pl;
function Rl({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: o }, l, i, u) {
  const c = u ? (0, Z._)`${e}, ${t}, ${n}${s}` : t, f = [
    [Xe.default.instancePath, (0, Z.strConcat)(Xe.default.instancePath, a)],
    [Xe.default.parentData, o.parentData],
    [Xe.default.parentDataProperty, o.parentDataProperty],
    [Xe.default.rootData, Xe.default.rootData]
  ];
  o.opts.dynamicRef && f.push([Xe.default.dynamicAnchors, Xe.default.dynamicAnchors]);
  const _ = (0, Z._)`${c}, ${r.object(...f)}`;
  return i !== Z.nil ? (0, Z._)`${l}.call(${i}, ${_})` : (0, Z._)`${l}(${_})`;
}
H.callValidateCode = Rl;
const Il = (0, Z._)`new RegExp`;
function Nl({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, a = s(r, n);
  return e.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: (0, Z._)`${s.code === "new RegExp" ? Il : (0, _l.useFunc)(e, s)}(${r}, ${n})`
  });
}
H.usePattern = Nl;
function Ol(e) {
  const { gen: t, data: r, keyword: n, it: s } = e, a = t.name("valid");
  if (s.allErrors) {
    const l = t.let("valid", !0);
    return o(() => t.assign(l, !1)), l;
  }
  return t.var(a, !0), o(() => t.break()), a;
  function o(l) {
    const i = t.const("len", (0, Z._)`${r}.length`);
    t.forRange("i", 0, i, (u) => {
      e.subschema({
        keyword: n,
        dataProp: u,
        dataPropType: Hn.Type.Num
      }, a), t.if((0, Z.not)(a), l);
    });
  }
}
H.validateArray = Ol;
function Tl(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((i) => (0, Hn.alwaysValidSchema)(s, i)) && !s.opts.unevaluated)
    return;
  const o = t.let("valid", !1), l = t.name("_valid");
  t.block(() => r.forEach((i, u) => {
    const c = e.subschema({
      keyword: n,
      schemaProp: u,
      compositeRule: !0
    }, l);
    t.assign(o, (0, Z._)`${o} || ${l}`), e.mergeValidEvaluated(c, l) || t.if((0, Z.not)(o));
  })), e.result(o, () => e.reset(), () => e.error(!0));
}
H.validateUnion = Tl;
Object.defineProperty(Ce, "__esModule", { value: !0 });
Ce.validateKeywordUsage = Ce.validSchemaType = Ce.funcKeywordCode = Ce.macroKeywordCode = void 0;
const me = F, tt = Ee, jl = H, Al = Qt;
function kl(e, t) {
  const { gen: r, keyword: n, schema: s, parentSchema: a, it: o } = e, l = t.macro.call(o.self, s, a, o), i = ko(r, n, l);
  o.opts.validateSchema !== !1 && o.self.validateSchema(l, !0);
  const u = r.name("valid");
  e.subschema({
    schema: l,
    schemaPath: me.nil,
    errSchemaPath: `${o.errSchemaPath}/${n}`,
    topSchemaRef: i,
    compositeRule: !0
  }, u), e.pass(u, () => e.error(!0));
}
Ce.macroKeywordCode = kl;
function Cl(e, t) {
  var r;
  const { gen: n, keyword: s, schema: a, parentSchema: o, $data: l, it: i } = e;
  Ll(i, t);
  const u = !l && t.compile ? t.compile.call(i.self, a, o, i) : t.validate, c = ko(n, s, u), f = n.let("valid");
  e.block$data(f, _), e.ok((r = t.valid) !== null && r !== void 0 ? r : f);
  function _() {
    if (t.errors === !1)
      y(), t.modifying && la(e), v(() => e.error());
    else {
      const m = t.async ? $() : E();
      t.modifying && la(e), v(() => Dl(e, m));
    }
  }
  function $() {
    const m = n.let("ruleErrs", null);
    return n.try(() => y((0, me._)`await `), (w) => n.assign(f, !1).if((0, me._)`${w} instanceof ${i.ValidationError}`, () => n.assign(m, (0, me._)`${w}.errors`), () => n.throw(w))), m;
  }
  function E() {
    const m = (0, me._)`${c}.errors`;
    return n.assign(m, null), y(me.nil), m;
  }
  function y(m = t.async ? (0, me._)`await ` : me.nil) {
    const w = i.opts.passContext ? tt.default.this : tt.default.self, R = !("compile" in t && !l || t.schema === !1);
    n.assign(f, (0, me._)`${m}${(0, jl.callValidateCode)(e, c, w, R)}`, t.modifying);
  }
  function v(m) {
    var w;
    n.if((0, me.not)((w = t.valid) !== null && w !== void 0 ? w : f), m);
  }
}
Ce.funcKeywordCode = Cl;
function la(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, me._)`${n.parentData}[${n.parentDataProperty}]`));
}
function Dl(e, t) {
  const { gen: r } = e;
  r.if((0, me._)`Array.isArray(${t})`, () => {
    r.assign(tt.default.vErrors, (0, me._)`${tt.default.vErrors} === null ? ${t} : ${tt.default.vErrors}.concat(${t})`).assign(tt.default.errors, (0, me._)`${tt.default.vErrors}.length`), (0, Al.extendErrors)(e);
  }, () => e.error());
}
function Ll({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function ko(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, me.stringify)(r) });
}
function Ml(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
Ce.validSchemaType = Ml;
function Vl({ schema: e, opts: t, self: r, errSchemaPath: n }, s, a) {
  if (Array.isArray(s.keyword) ? !s.keyword.includes(a) : s.keyword !== a)
    throw new Error("ajv implementation error");
  const o = s.dependencies;
  if (o != null && o.some((l) => !Object.prototype.hasOwnProperty.call(e, l)))
    throw new Error(`parent schema must have dependencies of ${a}: ${o.join(",")}`);
  if (s.validateSchema && !s.validateSchema(e[a])) {
    const i = `keyword "${a}" value is invalid at path "${n}": ` + r.errorsText(s.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(i);
    else
      throw new Error(i);
  }
}
Ce.validateKeywordUsage = Vl;
var Qe = {};
Object.defineProperty(Qe, "__esModule", { value: !0 });
Qe.extendSubschemaMode = Qe.extendSubschemaData = Qe.getSubschema = void 0;
const ke = F, Co = T;
function Ul(e, { keyword: t, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: a, topSchemaRef: o }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const l = e.schema[t];
    return r === void 0 ? {
      schema: l,
      schemaPath: (0, ke._)`${e.schemaPath}${(0, ke.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: l[r],
      schemaPath: (0, ke._)`${e.schemaPath}${(0, ke.getProperty)(t)}${(0, ke.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, Co.escapeFragment)(r)}`
    };
  }
  if (n !== void 0) {
    if (s === void 0 || a === void 0 || o === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: n,
      schemaPath: s,
      topSchemaRef: o,
      errSchemaPath: a
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
Qe.getSubschema = Ul;
function zl(e, t, { dataProp: r, dataPropType: n, data: s, dataTypes: a, propertyName: o }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: l } = t;
  if (r !== void 0) {
    const { errorPath: u, dataPathArr: c, opts: f } = t, _ = l.let("data", (0, ke._)`${t.data}${(0, ke.getProperty)(r)}`, !0);
    i(_), e.errorPath = (0, ke.str)`${u}${(0, Co.getErrorPath)(r, n, f.jsPropertySyntax)}`, e.parentDataProperty = (0, ke._)`${r}`, e.dataPathArr = [...c, e.parentDataProperty];
  }
  if (s !== void 0) {
    const u = s instanceof ke.Name ? s : l.let("data", s, !0);
    i(u), o !== void 0 && (e.propertyName = o);
  }
  a && (e.dataTypes = a);
  function i(u) {
    e.data = u, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, u];
  }
}
Qe.extendSubschemaData = zl;
function Fl(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: a }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), a !== void 0 && (e.allErrors = a), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
Qe.extendSubschemaMode = Fl;
var ce = {}, Do = function e(t, r) {
  if (t === r) return !0;
  if (t && r && typeof t == "object" && typeof r == "object") {
    if (t.constructor !== r.constructor) return !1;
    var n, s, a;
    if (Array.isArray(t)) {
      if (n = t.length, n != r.length) return !1;
      for (s = n; s-- !== 0; )
        if (!e(t[s], r[s])) return !1;
      return !0;
    }
    if (t.constructor === RegExp) return t.source === r.source && t.flags === r.flags;
    if (t.valueOf !== Object.prototype.valueOf) return t.valueOf() === r.valueOf();
    if (t.toString !== Object.prototype.toString) return t.toString() === r.toString();
    if (a = Object.keys(t), n = a.length, n !== Object.keys(r).length) return !1;
    for (s = n; s-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(r, a[s])) return !1;
    for (s = n; s-- !== 0; ) {
      var o = a[s];
      if (!e(t[o], r[o])) return !1;
    }
    return !0;
  }
  return t !== t && r !== r;
}, Lo = { exports: {} }, Ze = Lo.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  $r(t, n, s, e, "", e);
};
Ze.keywords = {
  additionalItems: !0,
  items: !0,
  contains: !0,
  additionalProperties: !0,
  propertyNames: !0,
  not: !0,
  if: !0,
  then: !0,
  else: !0
};
Ze.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
Ze.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
Ze.skipKeywords = {
  default: !0,
  enum: !0,
  const: !0,
  required: !0,
  maximum: !0,
  minimum: !0,
  exclusiveMaximum: !0,
  exclusiveMinimum: !0,
  multipleOf: !0,
  maxLength: !0,
  minLength: !0,
  pattern: !0,
  format: !0,
  maxItems: !0,
  minItems: !0,
  uniqueItems: !0,
  maxProperties: !0,
  minProperties: !0
};
function $r(e, t, r, n, s, a, o, l, i, u) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, a, o, l, i, u);
    for (var c in n) {
      var f = n[c];
      if (Array.isArray(f)) {
        if (c in Ze.arrayKeywords)
          for (var _ = 0; _ < f.length; _++)
            $r(e, t, r, f[_], s + "/" + c + "/" + _, a, s, c, n, _);
      } else if (c in Ze.propsKeywords) {
        if (f && typeof f == "object")
          for (var $ in f)
            $r(e, t, r, f[$], s + "/" + c + "/" + ql($), a, s, c, n, $);
      } else (c in Ze.keywords || e.allKeys && !(c in Ze.skipKeywords)) && $r(e, t, r, f, s + "/" + c, a, s, c, n);
    }
    r(n, s, a, o, l, i, u);
  }
}
function ql(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var Gl = Lo.exports;
Object.defineProperty(ce, "__esModule", { value: !0 });
ce.getSchemaRefs = ce.resolveUrl = ce.normalizeId = ce._getFullPath = ce.getFullPath = ce.inlineRef = void 0;
const Kl = T, Hl = Do, Xl = Gl, Wl = /* @__PURE__ */ new Set([
  "type",
  "format",
  "pattern",
  "maxLength",
  "minLength",
  "maxProperties",
  "minProperties",
  "maxItems",
  "minItems",
  "maximum",
  "minimum",
  "uniqueItems",
  "multipleOf",
  "required",
  "enum",
  "const"
]);
function Bl(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !Rn(e) : t ? Mo(e) <= t : !1;
}
ce.inlineRef = Bl;
const Jl = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function Rn(e) {
  for (const t in e) {
    if (Jl.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(Rn) || typeof r == "object" && Rn(r))
      return !0;
  }
  return !1;
}
function Mo(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !Wl.has(r) && (typeof e[r] == "object" && (0, Kl.eachItem)(e[r], (n) => t += Mo(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function Vo(e, t = "", r) {
  r !== !1 && (t = Et(t));
  const n = e.parse(t);
  return Uo(e, n);
}
ce.getFullPath = Vo;
function Uo(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
ce._getFullPath = Uo;
const xl = /#\/?$/;
function Et(e) {
  return e ? e.replace(xl, "") : "";
}
ce.normalizeId = Et;
function Yl(e, t, r) {
  return r = Et(r), e.resolve(t, r);
}
ce.resolveUrl = Yl;
const Zl = /^[a-z_][-a-z0-9._]*$/i;
function Ql(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = Et(e[r] || t), a = { "": s }, o = Vo(n, s, !1), l = {}, i = /* @__PURE__ */ new Set();
  return Xl(e, { allKeys: !0 }, (f, _, $, E) => {
    if (E === void 0)
      return;
    const y = o + _;
    let v = a[E];
    typeof f[r] == "string" && (v = m.call(this, f[r])), w.call(this, f.$anchor), w.call(this, f.$dynamicAnchor), a[_] = v;
    function m(R) {
      const O = this.opts.uriResolver.resolve;
      if (R = Et(v ? O(v, R) : R), i.has(R))
        throw c(R);
      i.add(R);
      let j = this.refs[R];
      return typeof j == "string" && (j = this.refs[j]), typeof j == "object" ? u(f, j.schema, R) : R !== Et(y) && (R[0] === "#" ? (u(f, l[R], R), l[R] = f) : this.refs[R] = y), R;
    }
    function w(R) {
      if (typeof R == "string") {
        if (!Zl.test(R))
          throw new Error(`invalid anchor "${R}"`);
        m.call(this, `#${R}`);
      }
    }
  }), l;
  function u(f, _, $) {
    if (_ !== void 0 && !Hl(f, _))
      throw c($);
  }
  function c(f) {
    return new Error(`reference "${f}" resolves to more than one schema`);
  }
}
ce.getSchemaRefs = Ql;
Object.defineProperty(Se, "__esModule", { value: !0 });
Se.getData = Se.KeywordCxt = Se.validateFunctionCode = void 0;
const zo = Rt, ua = ne, Bn = Ue, br = ne, eu = Or, Ht = Ce, ln = Qe, D = F, z = Ee, tu = ce, ze = T, Ut = Qt;
function ru(e) {
  if (Go(e) && (Ko(e), qo(e))) {
    au(e);
    return;
  }
  Fo(e, () => (0, zo.topBoolOrEmptySchema)(e));
}
Se.validateFunctionCode = ru;
function Fo({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: s }, a) {
  s.code.es5 ? e.func(t, (0, D._)`${z.default.data}, ${z.default.valCxt}`, n.$async, () => {
    e.code((0, D._)`"use strict"; ${da(r, s)}`), su(e, s), e.code(a);
  }) : e.func(t, (0, D._)`${z.default.data}, ${nu(s)}`, n.$async, () => e.code(da(r, s)).code(a));
}
function nu(e) {
  return (0, D._)`{${z.default.instancePath}="", ${z.default.parentData}, ${z.default.parentDataProperty}, ${z.default.rootData}=${z.default.data}${e.dynamicRef ? (0, D._)`, ${z.default.dynamicAnchors}={}` : D.nil}}={}`;
}
function su(e, t) {
  e.if(z.default.valCxt, () => {
    e.var(z.default.instancePath, (0, D._)`${z.default.valCxt}.${z.default.instancePath}`), e.var(z.default.parentData, (0, D._)`${z.default.valCxt}.${z.default.parentData}`), e.var(z.default.parentDataProperty, (0, D._)`${z.default.valCxt}.${z.default.parentDataProperty}`), e.var(z.default.rootData, (0, D._)`${z.default.valCxt}.${z.default.rootData}`), t.dynamicRef && e.var(z.default.dynamicAnchors, (0, D._)`${z.default.valCxt}.${z.default.dynamicAnchors}`);
  }, () => {
    e.var(z.default.instancePath, (0, D._)`""`), e.var(z.default.parentData, (0, D._)`undefined`), e.var(z.default.parentDataProperty, (0, D._)`undefined`), e.var(z.default.rootData, z.default.data), t.dynamicRef && e.var(z.default.dynamicAnchors, (0, D._)`{}`);
  });
}
function au(e) {
  const { schema: t, opts: r, gen: n } = e;
  Fo(e, () => {
    r.$comment && t.$comment && Xo(e), uu(e), n.let(z.default.vErrors, null), n.let(z.default.errors, 0), r.unevaluated && ou(e), Ho(e), hu(e);
  });
}
function ou(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, D._)`${r}.evaluated`), t.if((0, D._)`${e.evaluated}.dynamicProps`, () => t.assign((0, D._)`${e.evaluated}.props`, (0, D._)`undefined`)), t.if((0, D._)`${e.evaluated}.dynamicItems`, () => t.assign((0, D._)`${e.evaluated}.items`, (0, D._)`undefined`));
}
function da(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, D._)`/*# sourceURL=${r} */` : D.nil;
}
function iu(e, t) {
  if (Go(e) && (Ko(e), qo(e))) {
    cu(e, t);
    return;
  }
  (0, zo.boolOrEmptySchema)(e, t);
}
function qo({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function Go(e) {
  return typeof e.schema != "boolean";
}
function cu(e, t) {
  const { schema: r, gen: n, opts: s } = e;
  s.$comment && r.$comment && Xo(e), du(e), fu(e);
  const a = n.const("_errs", z.default.errors);
  Ho(e, a), n.var(t, (0, D._)`${a} === ${z.default.errors}`);
}
function Ko(e) {
  (0, ze.checkUnknownRules)(e), lu(e);
}
function Ho(e, t) {
  if (e.opts.jtd)
    return fa(e, [], !1, t);
  const r = (0, ua.getSchemaTypes)(e.schema), n = (0, ua.coerceAndCheckDataType)(e, r);
  fa(e, r, !n, t);
}
function lu(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, ze.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function uu(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, ze.checkStrictMode)(e, "default is ignored in the schema root");
}
function du(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, tu.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function fu(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function Xo({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: s }) {
  const a = r.$comment;
  if (s.$comment === !0)
    e.code((0, D._)`${z.default.self}.logger.log(${a})`);
  else if (typeof s.$comment == "function") {
    const o = (0, D.str)`${n}/$comment`, l = e.scopeValue("root", { ref: t.root });
    e.code((0, D._)`${z.default.self}.opts.$comment(${a}, ${o}, ${l}.schema)`);
  }
}
function hu(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: s, opts: a } = e;
  r.$async ? t.if((0, D._)`${z.default.errors} === 0`, () => t.return(z.default.data), () => t.throw((0, D._)`new ${s}(${z.default.vErrors})`)) : (t.assign((0, D._)`${n}.errors`, z.default.vErrors), a.unevaluated && mu(e), t.return((0, D._)`${z.default.errors} === 0`));
}
function mu({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof D.Name && e.assign((0, D._)`${t}.props`, r), n instanceof D.Name && e.assign((0, D._)`${t}.items`, n);
}
function fa(e, t, r, n) {
  const { gen: s, schema: a, data: o, allErrors: l, opts: i, self: u } = e, { RULES: c } = u;
  if (a.$ref && (i.ignoreKeywordsWithRef || !(0, ze.schemaHasRulesButRef)(a, c))) {
    s.block(() => Jo(e, "$ref", c.all.$ref.definition));
    return;
  }
  i.jtd || pu(e, t), s.block(() => {
    for (const _ of c.rules)
      f(_);
    f(c.post);
  });
  function f(_) {
    (0, Bn.shouldUseGroup)(a, _) && (_.type ? (s.if((0, br.checkDataType)(_.type, o, i.strictNumbers)), ha(e, _), t.length === 1 && t[0] === _.type && r && (s.else(), (0, br.reportTypeError)(e)), s.endIf()) : ha(e, _), l || s.if((0, D._)`${z.default.errors} === ${n || 0}`));
  }
}
function ha(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = e;
  s && (0, eu.assignDefaults)(e, t.type), r.block(() => {
    for (const a of t.rules)
      (0, Bn.shouldUseRule)(n, a) && Jo(e, a.keyword, a.definition, t.type);
  });
}
function pu(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || ($u(e, t), e.opts.allowUnionTypes || yu(e, t), gu(e, e.dataTypes));
}
function $u(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      Wo(e.dataTypes, r) || Jn(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), _u(e, t);
  }
}
function yu(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && Jn(e, "use allowUnionTypes to allow union type keyword");
}
function gu(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, Bn.shouldUseRule)(e.schema, s)) {
      const { type: a } = s.definition;
      a.length && !a.some((o) => vu(t, o)) && Jn(e, `missing type "${a.join(",")}" for keyword "${n}"`);
    }
  }
}
function vu(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function Wo(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function _u(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    Wo(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function Jn(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, ze.checkStrictMode)(e, t, e.opts.strictTypes);
}
class Bo {
  constructor(t, r, n) {
    if ((0, Ht.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, ze.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", xo(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, Ht.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = t.gen.const("_errs", z.default.errors));
  }
  result(t, r, n) {
    this.failResult((0, D.not)(t), r, n);
  }
  failResult(t, r, n) {
    this.gen.if(t), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(t, r) {
    this.failResult((0, D.not)(t), void 0, r);
  }
  fail(t) {
    if (t === void 0) {
      this.error(), this.allErrors || this.gen.if(!1);
      return;
    }
    this.gen.if(t), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  fail$data(t) {
    if (!this.$data)
      return this.fail(t);
    const { schemaCode: r } = this;
    this.fail((0, D._)`${r} !== undefined && (${(0, D.or)(this.invalid$data(), t)})`);
  }
  error(t, r, n) {
    if (r) {
      this.setParams(r), this._error(t, n), this.setParams({});
      return;
    }
    this._error(t, n);
  }
  _error(t, r) {
    (t ? Ut.reportExtraError : Ut.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, Ut.reportError)(this, this.def.$dataError || Ut.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Ut.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(t) {
    this.allErrors || this.gen.if(t);
  }
  setParams(t, r) {
    r ? Object.assign(this.params, t) : this.params = t;
  }
  block$data(t, r, n = D.nil) {
    this.gen.block(() => {
      this.check$data(t, n), r();
    });
  }
  check$data(t = D.nil, r = D.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: s, schemaType: a, def: o } = this;
    n.if((0, D.or)((0, D._)`${s} === undefined`, r)), t !== D.nil && n.assign(t, !0), (a.length || o.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== D.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: n, def: s, it: a } = this;
    return (0, D.or)(o(), l());
    function o() {
      if (n.length) {
        if (!(r instanceof D.Name))
          throw new Error("ajv implementation error");
        const i = Array.isArray(n) ? n : [n];
        return (0, D._)`${(0, br.checkDataTypes)(i, r, a.opts.strictNumbers, br.DataType.Wrong)}`;
      }
      return D.nil;
    }
    function l() {
      if (s.validateSchema) {
        const i = t.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, D._)`!${i}(${r})`;
      }
      return D.nil;
    }
  }
  subschema(t, r) {
    const n = (0, ln.getSubschema)(this.it, t);
    (0, ln.extendSubschemaData)(n, this.it, t), (0, ln.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return iu(s, r), s;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = ze.mergeEvaluated.props(s, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = ze.mergeEvaluated.items(s, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(t, D.Name)), !0;
  }
}
Se.KeywordCxt = Bo;
function Jo(e, t, r, n) {
  const s = new Bo(e, r, t);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, Ht.funcKeywordCode)(s, r) : "macro" in r ? (0, Ht.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, Ht.funcKeywordCode)(s, r);
}
const Eu = /^\/(?:[^~]|~0|~1)*$/, wu = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function xo(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let s, a;
  if (e === "")
    return z.default.rootData;
  if (e[0] === "/") {
    if (!Eu.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, a = z.default.rootData;
  } else {
    const u = wu.exec(e);
    if (!u)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const c = +u[1];
    if (s = u[2], s === "#") {
      if (c >= t)
        throw new Error(i("property/index", c));
      return n[t - c];
    }
    if (c > t)
      throw new Error(i("data", c));
    if (a = r[t - c], !s)
      return a;
  }
  let o = a;
  const l = s.split("/");
  for (const u of l)
    u && (a = (0, D._)`${a}${(0, D.getProperty)((0, ze.unescapeJsonPointer)(u))}`, o = (0, D._)`${o} && ${a}`);
  return o;
  function i(u, c) {
    return `Cannot access ${u} ${c} levels up, current level is ${t}`;
  }
}
Se.getData = xo;
var Nt = {};
Object.defineProperty(Nt, "__esModule", { value: !0 });
class bu extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
}
Nt.default = bu;
var ut = {};
Object.defineProperty(ut, "__esModule", { value: !0 });
const un = ce;
class Su extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, un.resolveUrl)(t, r, n), this.missingSchema = (0, un.normalizeId)((0, un.getFullPath)(t, this.missingRef));
  }
}
ut.default = Su;
var pe = {};
Object.defineProperty(pe, "__esModule", { value: !0 });
pe.resolveSchema = pe.getCompilingSchema = pe.resolveRef = pe.compileSchema = pe.SchemaEnv = void 0;
const Re = F, Pu = Nt, et = Ee, Ne = ce, ma = T, Ru = Se;
class Tr {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, Ne.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
pe.SchemaEnv = Tr;
function xn(e) {
  const t = Yo.call(this, e);
  if (t)
    return t;
  const r = (0, Ne.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, o = new Re.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let l;
  e.$async && (l = o.scopeValue("Error", {
    ref: Pu.default,
    code: (0, Re._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const i = o.scopeName("validate");
  e.validateName = i;
  const u = {
    gen: o,
    allErrors: this.opts.allErrors,
    data: et.default.data,
    parentData: et.default.parentData,
    parentDataProperty: et.default.parentDataProperty,
    dataNames: [et.default.data],
    dataPathArr: [Re.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: o.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, Re.stringify)(e.schema) } : { ref: e.schema }),
    validateName: i,
    ValidationError: l,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: Re.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, Re._)`""`,
    opts: this.opts,
    self: this
  };
  let c;
  try {
    this._compilations.add(e), (0, Ru.validateFunctionCode)(u), o.optimize(this.opts.code.optimize);
    const f = o.toString();
    c = `${o.scopeRefs(et.default.scope)}return ${f}`, this.opts.code.process && (c = this.opts.code.process(c, e));
    const $ = new Function(`${et.default.self}`, `${et.default.scope}`, c)(this, this.scope.get());
    if (this.scope.value(i, { ref: $ }), $.errors = null, $.schema = e.schema, $.schemaEnv = e, e.$async && ($.$async = !0), this.opts.code.source === !0 && ($.source = { validateName: i, validateCode: f, scopeValues: o._values }), this.opts.unevaluated) {
      const { props: E, items: y } = u;
      $.evaluated = {
        props: E instanceof Re.Name ? void 0 : E,
        items: y instanceof Re.Name ? void 0 : y,
        dynamicProps: E instanceof Re.Name,
        dynamicItems: y instanceof Re.Name
      }, $.source && ($.source.evaluated = (0, Re.stringify)($.evaluated));
    }
    return e.validate = $, e;
  } catch (f) {
    throw delete e.validate, delete e.validateName, c && this.logger.error("Error compiling schema, function code:", c), f;
  } finally {
    this._compilations.delete(e);
  }
}
pe.compileSchema = xn;
function Iu(e, t, r) {
  var n;
  r = (0, Ne.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let a = Tu.call(this, e, r);
  if (a === void 0) {
    const o = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: l } = this.opts;
    o && (a = new Tr({ schema: o, schemaId: l, root: e, baseId: t }));
  }
  if (a !== void 0)
    return e.refs[r] = Nu.call(this, a);
}
pe.resolveRef = Iu;
function Nu(e) {
  return (0, Ne.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : xn.call(this, e);
}
function Yo(e) {
  for (const t of this._compilations)
    if (Ou(t, e))
      return t;
}
pe.getCompilingSchema = Yo;
function Ou(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function Tu(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || jr.call(this, e, t);
}
function jr(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, Ne._getFullPath)(this.opts.uriResolver, r);
  let s = (0, Ne.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return dn.call(this, r, e);
  const a = (0, Ne.normalizeId)(n), o = this.refs[a] || this.schemas[a];
  if (typeof o == "string") {
    const l = jr.call(this, e, o);
    return typeof (l == null ? void 0 : l.schema) != "object" ? void 0 : dn.call(this, r, l);
  }
  if (typeof (o == null ? void 0 : o.schema) == "object") {
    if (o.validate || xn.call(this, o), a === (0, Ne.normalizeId)(t)) {
      const { schema: l } = o, { schemaId: i } = this.opts, u = l[i];
      return u && (s = (0, Ne.resolveUrl)(this.opts.uriResolver, s, u)), new Tr({ schema: l, schemaId: i, root: e, baseId: s });
    }
    return dn.call(this, r, o);
  }
}
pe.resolveSchema = jr;
const ju = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function dn(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const l of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const i = r[(0, ma.unescapeFragment)(l)];
    if (i === void 0)
      return;
    r = i;
    const u = typeof r == "object" && r[this.opts.schemaId];
    !ju.has(l) && u && (t = (0, Ne.resolveUrl)(this.opts.uriResolver, t, u));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, ma.schemaHasRulesButRef)(r, this.RULES)) {
    const l = (0, Ne.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    a = jr.call(this, n, l);
  }
  const { schemaId: o } = this.opts;
  if (a = a || new Tr({ schema: r, schemaId: o, root: n, baseId: t }), a.schema !== a.root.schema)
    return a;
}
const Au = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", ku = "Meta-schema for $data reference (JSON AnySchema extension proposal)", Cu = "object", Du = [
  "$data"
], Lu = {
  $data: {
    type: "string",
    anyOf: [
      {
        format: "relative-json-pointer"
      },
      {
        format: "json-pointer"
      }
    ]
  }
}, Mu = !1, Vu = {
  $id: Au,
  description: ku,
  type: Cu,
  required: Du,
  properties: Lu,
  additionalProperties: Mu
};
var Yn = {}, Ar = { exports: {} };
const Uu = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  a: 10,
  A: 10,
  b: 11,
  B: 11,
  c: 12,
  C: 12,
  d: 13,
  D: 13,
  e: 14,
  E: 14,
  f: 15,
  F: 15
};
var zu = {
  HEX: Uu
};
const { HEX: Fu } = zu, qu = /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u;
function Zo(e) {
  if (ei(e, ".") < 3)
    return { host: e, isIPV4: !1 };
  const t = e.match(qu) || [], [r] = t;
  return r ? { host: Ku(r, "."), isIPV4: !0 } : { host: e, isIPV4: !1 };
}
function pa(e, t = !1) {
  let r = "", n = !0;
  for (const s of e) {
    if (Fu[s] === void 0) return;
    s !== "0" && n === !0 && (n = !1), n || (r += s);
  }
  return t && r.length === 0 && (r = "0"), r;
}
function Gu(e) {
  let t = 0;
  const r = { error: !1, address: "", zone: "" }, n = [], s = [];
  let a = !1, o = !1, l = !1;
  function i() {
    if (s.length) {
      if (a === !1) {
        const u = pa(s);
        if (u !== void 0)
          n.push(u);
        else
          return r.error = !0, !1;
      }
      s.length = 0;
    }
    return !0;
  }
  for (let u = 0; u < e.length; u++) {
    const c = e[u];
    if (!(c === "[" || c === "]"))
      if (c === ":") {
        if (o === !0 && (l = !0), !i())
          break;
        if (t++, n.push(":"), t > 7) {
          r.error = !0;
          break;
        }
        u - 1 >= 0 && e[u - 1] === ":" && (o = !0);
        continue;
      } else if (c === "%") {
        if (!i())
          break;
        a = !0;
      } else {
        s.push(c);
        continue;
      }
  }
  return s.length && (a ? r.zone = s.join("") : l ? n.push(s.join("")) : n.push(pa(s))), r.address = n.join(""), r;
}
function Qo(e) {
  if (ei(e, ":") < 2)
    return { host: e, isIPV6: !1 };
  const t = Gu(e);
  if (t.error)
    return { host: e, isIPV6: !1 };
  {
    let r = t.address, n = t.address;
    return t.zone && (r += "%" + t.zone, n += "%25" + t.zone), { host: r, escapedHost: n, isIPV6: !0 };
  }
}
function Ku(e, t) {
  let r = "", n = !0;
  const s = e.length;
  for (let a = 0; a < s; a++) {
    const o = e[a];
    o === "0" && n ? (a + 1 <= s && e[a + 1] === t || a + 1 === s) && (r += o, n = !1) : (o === t ? n = !0 : n = !1, r += o);
  }
  return r;
}
function ei(e, t) {
  let r = 0;
  for (let n = 0; n < e.length; n++)
    e[n] === t && r++;
  return r;
}
const $a = /^\.\.?\//u, ya = /^\/\.(?:\/|$)/u, ga = /^\/\.\.(?:\/|$)/u, Hu = /^\/?(?:.|\n)*?(?=\/|$)/u;
function Xu(e) {
  const t = [];
  for (; e.length; )
    if (e.match($a))
      e = e.replace($a, "");
    else if (e.match(ya))
      e = e.replace(ya, "/");
    else if (e.match(ga))
      e = e.replace(ga, "/"), t.pop();
    else if (e === "." || e === "..")
      e = "";
    else {
      const r = e.match(Hu);
      if (r) {
        const n = r[0];
        e = e.slice(n.length), t.push(n);
      } else
        throw new Error("Unexpected dot segment condition");
    }
  return t.join("");
}
function Wu(e, t) {
  const r = t !== !0 ? escape : unescape;
  return e.scheme !== void 0 && (e.scheme = r(e.scheme)), e.userinfo !== void 0 && (e.userinfo = r(e.userinfo)), e.host !== void 0 && (e.host = r(e.host)), e.path !== void 0 && (e.path = r(e.path)), e.query !== void 0 && (e.query = r(e.query)), e.fragment !== void 0 && (e.fragment = r(e.fragment)), e;
}
function Bu(e) {
  const t = [];
  if (e.userinfo !== void 0 && (t.push(e.userinfo), t.push("@")), e.host !== void 0) {
    let r = unescape(e.host);
    const n = Zo(r);
    if (n.isIPV4)
      r = n.host;
    else {
      const s = Qo(n.host);
      s.isIPV6 === !0 ? r = `[${s.escapedHost}]` : r = e.host;
    }
    t.push(r);
  }
  return (typeof e.port == "number" || typeof e.port == "string") && (t.push(":"), t.push(String(e.port))), t.length ? t.join("") : void 0;
}
var Ju = {
  recomposeAuthority: Bu,
  normalizeComponentEncoding: Wu,
  removeDotSegments: Xu,
  normalizeIPv4: Zo,
  normalizeIPv6: Qo
};
const xu = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu, Yu = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function ti(e) {
  return typeof e.secure == "boolean" ? e.secure : String(e.scheme).toLowerCase() === "wss";
}
function ri(e) {
  return e.host || (e.error = e.error || "HTTP URIs must have a host."), e;
}
function ni(e) {
  const t = String(e.scheme).toLowerCase() === "https";
  return (e.port === (t ? 443 : 80) || e.port === "") && (e.port = void 0), e.path || (e.path = "/"), e;
}
function Zu(e) {
  return e.secure = ti(e), e.resourceName = (e.path || "/") + (e.query ? "?" + e.query : ""), e.path = void 0, e.query = void 0, e;
}
function Qu(e) {
  if ((e.port === (ti(e) ? 443 : 80) || e.port === "") && (e.port = void 0), typeof e.secure == "boolean" && (e.scheme = e.secure ? "wss" : "ws", e.secure = void 0), e.resourceName) {
    const [t, r] = e.resourceName.split("?");
    e.path = t && t !== "/" ? t : void 0, e.query = r, e.resourceName = void 0;
  }
  return e.fragment = void 0, e;
}
function ed(e, t) {
  if (!e.path)
    return e.error = "URN can not be parsed", e;
  const r = e.path.match(Yu);
  if (r) {
    const n = t.scheme || e.scheme || "urn";
    e.nid = r[1].toLowerCase(), e.nss = r[2];
    const s = `${n}:${t.nid || e.nid}`, a = Zn[s];
    e.path = void 0, a && (e = a.parse(e, t));
  } else
    e.error = e.error || "URN can not be parsed.";
  return e;
}
function td(e, t) {
  const r = t.scheme || e.scheme || "urn", n = e.nid.toLowerCase(), s = `${r}:${t.nid || n}`, a = Zn[s];
  a && (e = a.serialize(e, t));
  const o = e, l = e.nss;
  return o.path = `${n || t.nid}:${l}`, t.skipEscape = !0, o;
}
function rd(e, t) {
  const r = e;
  return r.uuid = r.nss, r.nss = void 0, !t.tolerant && (!r.uuid || !xu.test(r.uuid)) && (r.error = r.error || "UUID is not valid."), r;
}
function nd(e) {
  const t = e;
  return t.nss = (e.uuid || "").toLowerCase(), t;
}
const si = {
  scheme: "http",
  domainHost: !0,
  parse: ri,
  serialize: ni
}, sd = {
  scheme: "https",
  domainHost: si.domainHost,
  parse: ri,
  serialize: ni
}, yr = {
  scheme: "ws",
  domainHost: !0,
  parse: Zu,
  serialize: Qu
}, ad = {
  scheme: "wss",
  domainHost: yr.domainHost,
  parse: yr.parse,
  serialize: yr.serialize
}, od = {
  scheme: "urn",
  parse: ed,
  serialize: td,
  skipNormalize: !0
}, id = {
  scheme: "urn:uuid",
  parse: rd,
  serialize: nd,
  skipNormalize: !0
}, Zn = {
  http: si,
  https: sd,
  ws: yr,
  wss: ad,
  urn: od,
  "urn:uuid": id
};
var cd = Zn;
const { normalizeIPv6: ld, normalizeIPv4: ud, removeDotSegments: qt, recomposeAuthority: dd, normalizeComponentEncoding: nr } = Ju, Qn = cd;
function fd(e, t) {
  return typeof e == "string" ? e = De(Fe(e, t), t) : typeof e == "object" && (e = Fe(De(e, t), t)), e;
}
function hd(e, t, r) {
  const n = Object.assign({ scheme: "null" }, r), s = ai(Fe(e, n), Fe(t, n), n, !0);
  return De(s, { ...n, skipEscape: !0 });
}
function ai(e, t, r, n) {
  const s = {};
  return n || (e = Fe(De(e, r), r), t = Fe(De(t, r), r)), r = r || {}, !r.tolerant && t.scheme ? (s.scheme = t.scheme, s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = qt(t.path || ""), s.query = t.query) : (t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0 ? (s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = qt(t.path || ""), s.query = t.query) : (t.path ? (t.path.charAt(0) === "/" ? s.path = qt(t.path) : ((e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0) && !e.path ? s.path = "/" + t.path : e.path ? s.path = e.path.slice(0, e.path.lastIndexOf("/") + 1) + t.path : s.path = t.path, s.path = qt(s.path)), s.query = t.query) : (s.path = e.path, t.query !== void 0 ? s.query = t.query : s.query = e.query), s.userinfo = e.userinfo, s.host = e.host, s.port = e.port), s.scheme = e.scheme), s.fragment = t.fragment, s;
}
function md(e, t, r) {
  return typeof e == "string" ? (e = unescape(e), e = De(nr(Fe(e, r), !0), { ...r, skipEscape: !0 })) : typeof e == "object" && (e = De(nr(e, !0), { ...r, skipEscape: !0 })), typeof t == "string" ? (t = unescape(t), t = De(nr(Fe(t, r), !0), { ...r, skipEscape: !0 })) : typeof t == "object" && (t = De(nr(t, !0), { ...r, skipEscape: !0 })), e.toLowerCase() === t.toLowerCase();
}
function De(e, t) {
  const r = {
    host: e.host,
    scheme: e.scheme,
    userinfo: e.userinfo,
    port: e.port,
    path: e.path,
    query: e.query,
    nid: e.nid,
    nss: e.nss,
    uuid: e.uuid,
    fragment: e.fragment,
    reference: e.reference,
    resourceName: e.resourceName,
    secure: e.secure,
    error: ""
  }, n = Object.assign({}, t), s = [], a = Qn[(n.scheme || r.scheme || "").toLowerCase()];
  a && a.serialize && a.serialize(r, n), r.path !== void 0 && (n.skipEscape ? r.path = unescape(r.path) : (r.path = escape(r.path), r.scheme !== void 0 && (r.path = r.path.split("%3A").join(":")))), n.reference !== "suffix" && r.scheme && s.push(r.scheme, ":");
  const o = dd(r);
  if (o !== void 0 && (n.reference !== "suffix" && s.push("//"), s.push(o), r.path && r.path.charAt(0) !== "/" && s.push("/")), r.path !== void 0) {
    let l = r.path;
    !n.absolutePath && (!a || !a.absolutePath) && (l = qt(l)), o === void 0 && (l = l.replace(/^\/\//u, "/%2F")), s.push(l);
  }
  return r.query !== void 0 && s.push("?", r.query), r.fragment !== void 0 && s.push("#", r.fragment), s.join("");
}
const pd = Array.from({ length: 127 }, (e, t) => /[^!"$&'()*+,\-.;=_`a-z{}~]/u.test(String.fromCharCode(t)));
function $d(e) {
  let t = 0;
  for (let r = 0, n = e.length; r < n; ++r)
    if (t = e.charCodeAt(r), t > 126 || pd[t])
      return !0;
  return !1;
}
const yd = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function Fe(e, t) {
  const r = Object.assign({}, t), n = {
    scheme: void 0,
    userinfo: void 0,
    host: "",
    port: void 0,
    path: "",
    query: void 0,
    fragment: void 0
  }, s = e.indexOf("%") !== -1;
  let a = !1;
  r.reference === "suffix" && (e = (r.scheme ? r.scheme + ":" : "") + "//" + e);
  const o = e.match(yd);
  if (o) {
    if (n.scheme = o[1], n.userinfo = o[3], n.host = o[4], n.port = parseInt(o[5], 10), n.path = o[6] || "", n.query = o[7], n.fragment = o[8], isNaN(n.port) && (n.port = o[5]), n.host) {
      const i = ud(n.host);
      if (i.isIPV4 === !1) {
        const u = ld(i.host);
        n.host = u.host.toLowerCase(), a = u.isIPV6;
      } else
        n.host = i.host, a = !0;
    }
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && n.query === void 0 && !n.path ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", r.reference && r.reference !== "suffix" && r.reference !== n.reference && (n.error = n.error || "URI is not a " + r.reference + " reference.");
    const l = Qn[(r.scheme || n.scheme || "").toLowerCase()];
    if (!r.unicodeSupport && (!l || !l.unicodeSupport) && n.host && (r.domainHost || l && l.domainHost) && a === !1 && $d(n.host))
      try {
        n.host = URL.domainToASCII(n.host.toLowerCase());
      } catch (i) {
        n.error = n.error || "Host's domain name can not be converted to ASCII: " + i;
      }
    (!l || l && !l.skipNormalize) && (s && n.scheme !== void 0 && (n.scheme = unescape(n.scheme)), s && n.host !== void 0 && (n.host = unescape(n.host)), n.path && (n.path = escape(unescape(n.path))), n.fragment && (n.fragment = encodeURI(decodeURIComponent(n.fragment)))), l && l.parse && l.parse(n, r);
  } else
    n.error = n.error || "URI can not be parsed.";
  return n;
}
const es = {
  SCHEMES: Qn,
  normalize: fd,
  resolve: hd,
  resolveComponents: ai,
  equal: md,
  serialize: De,
  parse: Fe
};
Ar.exports = es;
Ar.exports.default = es;
Ar.exports.fastUri = es;
var gd = Ar.exports;
Object.defineProperty(Yn, "__esModule", { value: !0 });
const oi = gd;
oi.code = 'require("ajv/dist/runtime/uri").default';
Yn.default = oi;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = Se;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = F;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return r._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return r.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return r.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return r.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return r.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return r.CodeGen;
  } });
  const n = Nt, s = ut, a = ct, o = pe, l = F, i = ce, u = ne, c = T, f = Vu, _ = Yn, $ = (P, p) => new RegExp(P, p);
  $.code = "new RegExp";
  const E = ["removeAdditional", "useDefaults", "coerceTypes"], y = /* @__PURE__ */ new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error"
  ]), v = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now."
  }, m = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, w = 200;
  function R(P) {
    var p, b, g, d, h, S, L, M, J, W, ae, dt, Xr, Wr, Br, Jr, xr, Yr, Zr, Qr, en, tn, rn, nn, sn;
    const Ct = P.strict, an = (p = P.code) === null || p === void 0 ? void 0 : p.optimize, Ws = an === !0 || an === void 0 ? 1 : an || 0, Bs = (g = (b = P.code) === null || b === void 0 ? void 0 : b.regExp) !== null && g !== void 0 ? g : $, Ti = (d = P.uriResolver) !== null && d !== void 0 ? d : _.default;
    return {
      strictSchema: (S = (h = P.strictSchema) !== null && h !== void 0 ? h : Ct) !== null && S !== void 0 ? S : !0,
      strictNumbers: (M = (L = P.strictNumbers) !== null && L !== void 0 ? L : Ct) !== null && M !== void 0 ? M : !0,
      strictTypes: (W = (J = P.strictTypes) !== null && J !== void 0 ? J : Ct) !== null && W !== void 0 ? W : "log",
      strictTuples: (dt = (ae = P.strictTuples) !== null && ae !== void 0 ? ae : Ct) !== null && dt !== void 0 ? dt : "log",
      strictRequired: (Wr = (Xr = P.strictRequired) !== null && Xr !== void 0 ? Xr : Ct) !== null && Wr !== void 0 ? Wr : !1,
      code: P.code ? { ...P.code, optimize: Ws, regExp: Bs } : { optimize: Ws, regExp: Bs },
      loopRequired: (Br = P.loopRequired) !== null && Br !== void 0 ? Br : w,
      loopEnum: (Jr = P.loopEnum) !== null && Jr !== void 0 ? Jr : w,
      meta: (xr = P.meta) !== null && xr !== void 0 ? xr : !0,
      messages: (Yr = P.messages) !== null && Yr !== void 0 ? Yr : !0,
      inlineRefs: (Zr = P.inlineRefs) !== null && Zr !== void 0 ? Zr : !0,
      schemaId: (Qr = P.schemaId) !== null && Qr !== void 0 ? Qr : "$id",
      addUsedSchema: (en = P.addUsedSchema) !== null && en !== void 0 ? en : !0,
      validateSchema: (tn = P.validateSchema) !== null && tn !== void 0 ? tn : !0,
      validateFormats: (rn = P.validateFormats) !== null && rn !== void 0 ? rn : !0,
      unicodeRegExp: (nn = P.unicodeRegExp) !== null && nn !== void 0 ? nn : !0,
      int32range: (sn = P.int32range) !== null && sn !== void 0 ? sn : !0,
      uriResolver: Ti
    };
  }
  class O {
    constructor(p = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), p = this.opts = { ...p, ...R(p) };
      const { es5: b, lines: g } = this.opts.code;
      this.scope = new l.ValueScope({ scope: {}, prefixes: y, es5: b, lines: g }), this.logger = q(p.logger);
      const d = p.validateFormats;
      p.validateFormats = !1, this.RULES = (0, a.getRules)(), j.call(this, v, p, "NOT SUPPORTED"), j.call(this, m, p, "DEPRECATED", "warn"), this._metaOpts = Pe.call(this), p.formats && ye.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), p.keywords && we.call(this, p.keywords), typeof p.meta == "object" && this.addMetaSchema(p.meta), te.call(this), p.validateFormats = d;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: p, meta: b, schemaId: g } = this.opts;
      let d = f;
      g === "id" && (d = { ...f }, d.id = d.$id, delete d.$id), b && p && this.addMetaSchema(d, d[g], !1);
    }
    defaultMeta() {
      const { meta: p, schemaId: b } = this.opts;
      return this.opts.defaultMeta = typeof p == "object" ? p[b] || p : void 0;
    }
    validate(p, b) {
      let g;
      if (typeof p == "string") {
        if (g = this.getSchema(p), !g)
          throw new Error(`no schema with key or ref "${p}"`);
      } else
        g = this.compile(p);
      const d = g(b);
      return "$async" in g || (this.errors = g.errors), d;
    }
    compile(p, b) {
      const g = this._addSchema(p, b);
      return g.validate || this._compileSchemaEnv(g);
    }
    compileAsync(p, b) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: g } = this.opts;
      return d.call(this, p, b);
      async function d(W, ae) {
        await h.call(this, W.$schema);
        const dt = this._addSchema(W, ae);
        return dt.validate || S.call(this, dt);
      }
      async function h(W) {
        W && !this.getSchema(W) && await d.call(this, { $ref: W }, !0);
      }
      async function S(W) {
        try {
          return this._compileSchemaEnv(W);
        } catch (ae) {
          if (!(ae instanceof s.default))
            throw ae;
          return L.call(this, ae), await M.call(this, ae.missingSchema), S.call(this, W);
        }
      }
      function L({ missingSchema: W, missingRef: ae }) {
        if (this.refs[W])
          throw new Error(`AnySchema ${W} is loaded but ${ae} cannot be resolved`);
      }
      async function M(W) {
        const ae = await J.call(this, W);
        this.refs[W] || await h.call(this, ae.$schema), this.refs[W] || this.addSchema(ae, W, b);
      }
      async function J(W) {
        const ae = this._loading[W];
        if (ae)
          return ae;
        try {
          return await (this._loading[W] = g(W));
        } finally {
          delete this._loading[W];
        }
      }
    }
    // Adds schema to the instance
    addSchema(p, b, g, d = this.opts.validateSchema) {
      if (Array.isArray(p)) {
        for (const S of p)
          this.addSchema(S, void 0, g, d);
        return this;
      }
      let h;
      if (typeof p == "object") {
        const { schemaId: S } = this.opts;
        if (h = p[S], h !== void 0 && typeof h != "string")
          throw new Error(`schema ${S} must be string`);
      }
      return b = (0, i.normalizeId)(b || h), this._checkUnique(b), this.schemas[b] = this._addSchema(p, g, b, d, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(p, b, g = this.opts.validateSchema) {
      return this.addSchema(p, b, !0, g), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(p, b) {
      if (typeof p == "boolean")
        return !0;
      let g;
      if (g = p.$schema, g !== void 0 && typeof g != "string")
        throw new Error("$schema must be a string");
      if (g = g || this.opts.defaultMeta || this.defaultMeta(), !g)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const d = this.validate(g, p);
      if (!d && b) {
        const h = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(h);
        else
          throw new Error(h);
      }
      return d;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(p) {
      let b;
      for (; typeof (b = B.call(this, p)) == "string"; )
        p = b;
      if (b === void 0) {
        const { schemaId: g } = this.opts, d = new o.SchemaEnv({ schema: {}, schemaId: g });
        if (b = o.resolveSchema.call(this, d, p), !b)
          return;
        this.refs[p] = b;
      }
      return b.validate || this._compileSchemaEnv(b);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(p) {
      if (p instanceof RegExp)
        return this._removeAllSchemas(this.schemas, p), this._removeAllSchemas(this.refs, p), this;
      switch (typeof p) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const b = B.call(this, p);
          return typeof b == "object" && this._cache.delete(b.schema), delete this.schemas[p], delete this.refs[p], this;
        }
        case "object": {
          const b = p;
          this._cache.delete(b);
          let g = p[this.opts.schemaId];
          return g && (g = (0, i.normalizeId)(g), delete this.schemas[g], delete this.refs[g]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(p) {
      for (const b of p)
        this.addKeyword(b);
      return this;
    }
    addKeyword(p, b) {
      let g;
      if (typeof p == "string")
        g = p, typeof b == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), b.keyword = g);
      else if (typeof p == "object" && b === void 0) {
        if (b = p, g = b.keyword, Array.isArray(g) && !g.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (I.call(this, g, b), !b)
        return (0, c.eachItem)(g, (h) => N.call(this, h)), this;
      A.call(this, b);
      const d = {
        ...b,
        type: (0, u.getJSONTypes)(b.type),
        schemaType: (0, u.getJSONTypes)(b.schemaType)
      };
      return (0, c.eachItem)(g, d.type.length === 0 ? (h) => N.call(this, h, d) : (h) => d.type.forEach((S) => N.call(this, h, d, S))), this;
    }
    getKeyword(p) {
      const b = this.RULES.all[p];
      return typeof b == "object" ? b.definition : !!b;
    }
    // Remove keyword
    removeKeyword(p) {
      const { RULES: b } = this;
      delete b.keywords[p], delete b.all[p];
      for (const g of b.rules) {
        const d = g.rules.findIndex((h) => h.keyword === p);
        d >= 0 && g.rules.splice(d, 1);
      }
      return this;
    }
    // Add format
    addFormat(p, b) {
      return typeof b == "string" && (b = new RegExp(b)), this.formats[p] = b, this;
    }
    errorsText(p = this.errors, { separator: b = ", ", dataVar: g = "data" } = {}) {
      return !p || p.length === 0 ? "No errors" : p.map((d) => `${g}${d.instancePath} ${d.message}`).reduce((d, h) => d + b + h);
    }
    $dataMetaSchema(p, b) {
      const g = this.RULES.all;
      p = JSON.parse(JSON.stringify(p));
      for (const d of b) {
        const h = d.split("/").slice(1);
        let S = p;
        for (const L of h)
          S = S[L];
        for (const L in g) {
          const M = g[L];
          if (typeof M != "object")
            continue;
          const { $data: J } = M.definition, W = S[L];
          J && W && (S[L] = k(W));
        }
      }
      return p;
    }
    _removeAllSchemas(p, b) {
      for (const g in p) {
        const d = p[g];
        (!b || b.test(g)) && (typeof d == "string" ? delete p[g] : d && !d.meta && (this._cache.delete(d.schema), delete p[g]));
      }
    }
    _addSchema(p, b, g, d = this.opts.validateSchema, h = this.opts.addUsedSchema) {
      let S;
      const { schemaId: L } = this.opts;
      if (typeof p == "object")
        S = p[L];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof p != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let M = this._cache.get(p);
      if (M !== void 0)
        return M;
      g = (0, i.normalizeId)(S || g);
      const J = i.getSchemaRefs.call(this, p, g);
      return M = new o.SchemaEnv({ schema: p, schemaId: L, meta: b, baseId: g, localRefs: J }), this._cache.set(M.schema, M), h && !g.startsWith("#") && (g && this._checkUnique(g), this.refs[g] = M), d && this.validateSchema(p, !0), M;
    }
    _checkUnique(p) {
      if (this.schemas[p] || this.refs[p])
        throw new Error(`schema with key or id "${p}" already exists`);
    }
    _compileSchemaEnv(p) {
      if (p.meta ? this._compileMetaSchema(p) : o.compileSchema.call(this, p), !p.validate)
        throw new Error("ajv implementation error");
      return p.validate;
    }
    _compileMetaSchema(p) {
      const b = this.opts;
      this.opts = this._metaOpts;
      try {
        o.compileSchema.call(this, p);
      } finally {
        this.opts = b;
      }
    }
  }
  O.ValidationError = n.default, O.MissingRefError = s.default, e.default = O;
  function j(P, p, b, g = "error") {
    for (const d in P) {
      const h = d;
      h in p && this.logger[g](`${b}: option ${d}. ${P[h]}`);
    }
  }
  function B(P) {
    return P = (0, i.normalizeId)(P), this.schemas[P] || this.refs[P];
  }
  function te() {
    const P = this.opts.schemas;
    if (P)
      if (Array.isArray(P))
        this.addSchema(P);
      else
        for (const p in P)
          this.addSchema(P[p], p);
  }
  function ye() {
    for (const P in this.opts.formats) {
      const p = this.opts.formats[P];
      p && this.addFormat(P, p);
    }
  }
  function we(P) {
    if (Array.isArray(P)) {
      this.addVocabulary(P);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const p in P) {
      const b = P[p];
      b.keyword || (b.keyword = p), this.addKeyword(b);
    }
  }
  function Pe() {
    const P = { ...this.opts };
    for (const p of E)
      delete P[p];
    return P;
  }
  const U = { log() {
  }, warn() {
  }, error() {
  } };
  function q(P) {
    if (P === !1)
      return U;
    if (P === void 0)
      return console;
    if (P.log && P.warn && P.error)
      return P;
    throw new Error("logger must implement log, warn and error methods");
  }
  const Y = /^[a-z_$][a-z0-9_$:-]*$/i;
  function I(P, p) {
    const { RULES: b } = this;
    if ((0, c.eachItem)(P, (g) => {
      if (b.keywords[g])
        throw new Error(`Keyword ${g} is already defined`);
      if (!Y.test(g))
        throw new Error(`Keyword ${g} has invalid name`);
    }), !!p && p.$data && !("code" in p || "validate" in p))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function N(P, p, b) {
    var g;
    const d = p == null ? void 0 : p.post;
    if (b && d)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: h } = this;
    let S = d ? h.post : h.rules.find(({ type: M }) => M === b);
    if (S || (S = { type: b, rules: [] }, h.rules.push(S)), h.keywords[P] = !0, !p)
      return;
    const L = {
      keyword: P,
      definition: {
        ...p,
        type: (0, u.getJSONTypes)(p.type),
        schemaType: (0, u.getJSONTypes)(p.schemaType)
      }
    };
    p.before ? C.call(this, S, L, p.before) : S.rules.push(L), h.all[P] = L, (g = p.implements) === null || g === void 0 || g.forEach((M) => this.addKeyword(M));
  }
  function C(P, p, b) {
    const g = P.rules.findIndex((d) => d.keyword === b);
    g >= 0 ? P.rules.splice(g, 0, p) : (P.rules.push(p), this.logger.warn(`rule ${b} is not defined`));
  }
  function A(P) {
    let { metaSchema: p } = P;
    p !== void 0 && (P.$data && this.opts.$data && (p = k(p)), P.validateSchema = this.compile(p, !0));
  }
  const V = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function k(P) {
    return { anyOf: [P, V] };
  }
})(zn);
var ts = {}, kr = {}, rs = {};
Object.defineProperty(rs, "__esModule", { value: !0 });
const vd = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
rs.default = vd;
var qe = {};
Object.defineProperty(qe, "__esModule", { value: !0 });
qe.callRef = qe.getValidate = void 0;
const _d = ut, va = H, ge = F, ht = Ee, _a = pe, sr = T, Ed = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: a, validateName: o, opts: l, self: i } = n, { root: u } = a;
    if ((r === "#" || r === "#/") && s === u.baseId)
      return f();
    const c = _a.resolveRef.call(i, u, s, r);
    if (c === void 0)
      throw new _d.default(n.opts.uriResolver, s, r);
    if (c instanceof _a.SchemaEnv)
      return _(c);
    return $(c);
    function f() {
      if (a === u)
        return gr(e, o, a, a.$async);
      const E = t.scopeValue("root", { ref: u });
      return gr(e, (0, ge._)`${E}.validate`, u, u.$async);
    }
    function _(E) {
      const y = ii(e, E);
      gr(e, y, E, E.$async);
    }
    function $(E) {
      const y = t.scopeValue("schema", l.code.source === !0 ? { ref: E, code: (0, ge.stringify)(E) } : { ref: E }), v = t.name("valid"), m = e.subschema({
        schema: E,
        dataTypes: [],
        schemaPath: ge.nil,
        topSchemaRef: y,
        errSchemaPath: r
      }, v);
      e.mergeEvaluated(m), e.ok(v);
    }
  }
};
function ii(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, ge._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
qe.getValidate = ii;
function gr(e, t, r, n) {
  const { gen: s, it: a } = e, { allErrors: o, schemaEnv: l, opts: i } = a, u = i.passContext ? ht.default.this : ge.nil;
  n ? c() : f();
  function c() {
    if (!l.$async)
      throw new Error("async schema referenced by sync schema");
    const E = s.let("valid");
    s.try(() => {
      s.code((0, ge._)`await ${(0, va.callValidateCode)(e, t, u)}`), $(t), o || s.assign(E, !0);
    }, (y) => {
      s.if((0, ge._)`!(${y} instanceof ${a.ValidationError})`, () => s.throw(y)), _(y), o || s.assign(E, !1);
    }), e.ok(E);
  }
  function f() {
    e.result((0, va.callValidateCode)(e, t, u), () => $(t), () => _(t));
  }
  function _(E) {
    const y = (0, ge._)`${E}.errors`;
    s.assign(ht.default.vErrors, (0, ge._)`${ht.default.vErrors} === null ? ${y} : ${ht.default.vErrors}.concat(${y})`), s.assign(ht.default.errors, (0, ge._)`${ht.default.vErrors}.length`);
  }
  function $(E) {
    var y;
    if (!a.opts.unevaluated)
      return;
    const v = (y = r == null ? void 0 : r.validate) === null || y === void 0 ? void 0 : y.evaluated;
    if (a.props !== !0)
      if (v && !v.dynamicProps)
        v.props !== void 0 && (a.props = sr.mergeEvaluated.props(s, v.props, a.props));
      else {
        const m = s.var("props", (0, ge._)`${E}.evaluated.props`);
        a.props = sr.mergeEvaluated.props(s, m, a.props, ge.Name);
      }
    if (a.items !== !0)
      if (v && !v.dynamicItems)
        v.items !== void 0 && (a.items = sr.mergeEvaluated.items(s, v.items, a.items));
      else {
        const m = s.var("items", (0, ge._)`${E}.evaluated.items`);
        a.items = sr.mergeEvaluated.items(s, m, a.items, ge.Name);
      }
  }
}
qe.callRef = gr;
qe.default = Ed;
Object.defineProperty(kr, "__esModule", { value: !0 });
const wd = rs, bd = qe, Sd = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  wd.default,
  bd.default
];
kr.default = Sd;
var Cr = {}, ns = {};
Object.defineProperty(ns, "__esModule", { value: !0 });
const Sr = F, We = Sr.operators, Pr = {
  maximum: { okStr: "<=", ok: We.LTE, fail: We.GT },
  minimum: { okStr: ">=", ok: We.GTE, fail: We.LT },
  exclusiveMaximum: { okStr: "<", ok: We.LT, fail: We.GTE },
  exclusiveMinimum: { okStr: ">", ok: We.GT, fail: We.LTE }
}, Pd = {
  message: ({ keyword: e, schemaCode: t }) => (0, Sr.str)`must be ${Pr[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, Sr._)`{comparison: ${Pr[e].okStr}, limit: ${t}}`
}, Rd = {
  keyword: Object.keys(Pr),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Pd,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, Sr._)`${r} ${Pr[t].fail} ${n} || isNaN(${r})`);
  }
};
ns.default = Rd;
var ss = {};
Object.defineProperty(ss, "__esModule", { value: !0 });
const Xt = F, Id = {
  message: ({ schemaCode: e }) => (0, Xt.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, Xt._)`{multipleOf: ${e}}`
}, Nd = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Id,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, a = s.opts.multipleOfPrecision, o = t.let("res"), l = a ? (0, Xt._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${a}` : (0, Xt._)`${o} !== parseInt(${o})`;
    e.fail$data((0, Xt._)`(${n} === 0 || (${o} = ${r}/${n}, ${l}))`);
  }
};
ss.default = Nd;
var as = {}, os = {};
Object.defineProperty(os, "__esModule", { value: !0 });
function ci(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
os.default = ci;
ci.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(as, "__esModule", { value: !0 });
const rt = F, Od = T, Td = os, jd = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, rt.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, rt._)`{limit: ${e}}`
}, Ad = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: jd,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, a = t === "maxLength" ? rt.operators.GT : rt.operators.LT, o = s.opts.unicode === !1 ? (0, rt._)`${r}.length` : (0, rt._)`${(0, Od.useFunc)(e.gen, Td.default)}(${r})`;
    e.fail$data((0, rt._)`${o} ${a} ${n}`);
  }
};
as.default = Ad;
var is = {};
Object.defineProperty(is, "__esModule", { value: !0 });
const kd = H, Rr = F, Cd = {
  message: ({ schemaCode: e }) => (0, Rr.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, Rr._)`{pattern: ${e}}`
}, Dd = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: Cd,
  code(e) {
    const { data: t, $data: r, schema: n, schemaCode: s, it: a } = e, o = a.opts.unicodeRegExp ? "u" : "", l = r ? (0, Rr._)`(new RegExp(${s}, ${o}))` : (0, kd.usePattern)(e, n);
    e.fail$data((0, Rr._)`!${l}.test(${t})`);
  }
};
is.default = Dd;
var cs = {};
Object.defineProperty(cs, "__esModule", { value: !0 });
const Wt = F, Ld = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, Wt.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, Wt._)`{limit: ${e}}`
}, Md = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: Ld,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? Wt.operators.GT : Wt.operators.LT;
    e.fail$data((0, Wt._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
cs.default = Md;
var ls = {};
Object.defineProperty(ls, "__esModule", { value: !0 });
const zt = H, Bt = F, Vd = T, Ud = {
  message: ({ params: { missingProperty: e } }) => (0, Bt.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, Bt._)`{missingProperty: ${e}}`
}, zd = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: Ud,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: a, it: o } = e, { opts: l } = o;
    if (!a && r.length === 0)
      return;
    const i = r.length >= l.loopRequired;
    if (o.allErrors ? u() : c(), l.strictRequired) {
      const $ = e.parentSchema.properties, { definedProperties: E } = e.it;
      for (const y of r)
        if (($ == null ? void 0 : $[y]) === void 0 && !E.has(y)) {
          const v = o.schemaEnv.baseId + o.errSchemaPath, m = `required property "${y}" is not defined at "${v}" (strictRequired)`;
          (0, Vd.checkStrictMode)(o, m, o.opts.strictRequired);
        }
    }
    function u() {
      if (i || a)
        e.block$data(Bt.nil, f);
      else
        for (const $ of r)
          (0, zt.checkReportMissingProp)(e, $);
    }
    function c() {
      const $ = t.let("missing");
      if (i || a) {
        const E = t.let("valid", !0);
        e.block$data(E, () => _($, E)), e.ok(E);
      } else
        t.if((0, zt.checkMissingProp)(e, r, $)), (0, zt.reportMissingProp)(e, $), t.else();
    }
    function f() {
      t.forOf("prop", n, ($) => {
        e.setParams({ missingProperty: $ }), t.if((0, zt.noPropertyInData)(t, s, $, l.ownProperties), () => e.error());
      });
    }
    function _($, E) {
      e.setParams({ missingProperty: $ }), t.forOf($, n, () => {
        t.assign(E, (0, zt.propertyInData)(t, s, $, l.ownProperties)), t.if((0, Bt.not)(E), () => {
          e.error(), t.break();
        });
      }, Bt.nil);
    }
  }
};
ls.default = zd;
var us = {};
Object.defineProperty(us, "__esModule", { value: !0 });
const Jt = F, Fd = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, Jt.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, Jt._)`{limit: ${e}}`
}, qd = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: Fd,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? Jt.operators.GT : Jt.operators.LT;
    e.fail$data((0, Jt._)`${r}.length ${s} ${n}`);
  }
};
us.default = qd;
var ds = {}, er = {};
Object.defineProperty(er, "__esModule", { value: !0 });
const li = Do;
li.code = 'require("ajv/dist/runtime/equal").default';
er.default = li;
Object.defineProperty(ds, "__esModule", { value: !0 });
const fn = ne, oe = F, Gd = T, Kd = er, Hd = {
  message: ({ params: { i: e, j: t } }) => (0, oe.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, oe._)`{i: ${e}, j: ${t}}`
}, Xd = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Hd,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: a, schemaCode: o, it: l } = e;
    if (!n && !s)
      return;
    const i = t.let("valid"), u = a.items ? (0, fn.getSchemaTypes)(a.items) : [];
    e.block$data(i, c, (0, oe._)`${o} === false`), e.ok(i);
    function c() {
      const E = t.let("i", (0, oe._)`${r}.length`), y = t.let("j");
      e.setParams({ i: E, j: y }), t.assign(i, !0), t.if((0, oe._)`${E} > 1`, () => (f() ? _ : $)(E, y));
    }
    function f() {
      return u.length > 0 && !u.some((E) => E === "object" || E === "array");
    }
    function _(E, y) {
      const v = t.name("item"), m = (0, fn.checkDataTypes)(u, v, l.opts.strictNumbers, fn.DataType.Wrong), w = t.const("indices", (0, oe._)`{}`);
      t.for((0, oe._)`;${E}--;`, () => {
        t.let(v, (0, oe._)`${r}[${E}]`), t.if(m, (0, oe._)`continue`), u.length > 1 && t.if((0, oe._)`typeof ${v} == "string"`, (0, oe._)`${v} += "_"`), t.if((0, oe._)`typeof ${w}[${v}] == "number"`, () => {
          t.assign(y, (0, oe._)`${w}[${v}]`), e.error(), t.assign(i, !1).break();
        }).code((0, oe._)`${w}[${v}] = ${E}`);
      });
    }
    function $(E, y) {
      const v = (0, Gd.useFunc)(t, Kd.default), m = t.name("outer");
      t.label(m).for((0, oe._)`;${E}--;`, () => t.for((0, oe._)`${y} = ${E}; ${y}--;`, () => t.if((0, oe._)`${v}(${r}[${E}], ${r}[${y}])`, () => {
        e.error(), t.assign(i, !1).break(m);
      })));
    }
  }
};
ds.default = Xd;
var fs = {};
Object.defineProperty(fs, "__esModule", { value: !0 });
const In = F, Wd = T, Bd = er, Jd = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, In._)`{allowedValue: ${e}}`
}, xd = {
  keyword: "const",
  $data: !0,
  error: Jd,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: a } = e;
    n || a && typeof a == "object" ? e.fail$data((0, In._)`!${(0, Wd.useFunc)(t, Bd.default)}(${r}, ${s})`) : e.fail((0, In._)`${a} !== ${r}`);
  }
};
fs.default = xd;
var hs = {};
Object.defineProperty(hs, "__esModule", { value: !0 });
const Gt = F, Yd = T, Zd = er, Qd = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Gt._)`{allowedValues: ${e}}`
}, ef = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: Qd,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: o } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const l = s.length >= o.opts.loopEnum;
    let i;
    const u = () => i ?? (i = (0, Yd.useFunc)(t, Zd.default));
    let c;
    if (l || n)
      c = t.let("valid"), e.block$data(c, f);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const $ = t.const("vSchema", a);
      c = (0, Gt.or)(...s.map((E, y) => _($, y)));
    }
    e.pass(c);
    function f() {
      t.assign(c, !1), t.forOf("v", a, ($) => t.if((0, Gt._)`${u()}(${r}, ${$})`, () => t.assign(c, !0).break()));
    }
    function _($, E) {
      const y = s[E];
      return typeof y == "object" && y !== null ? (0, Gt._)`${u()}(${r}, ${$}[${E}])` : (0, Gt._)`${r} === ${y}`;
    }
  }
};
hs.default = ef;
Object.defineProperty(Cr, "__esModule", { value: !0 });
const tf = ns, rf = ss, nf = as, sf = is, af = cs, of = ls, cf = us, lf = ds, uf = fs, df = hs, ff = [
  // number
  tf.default,
  rf.default,
  // string
  nf.default,
  sf.default,
  // object
  af.default,
  of.default,
  // array
  cf.default,
  lf.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  uf.default,
  df.default
];
Cr.default = ff;
var Dr = {}, Ot = {};
Object.defineProperty(Ot, "__esModule", { value: !0 });
Ot.validateAdditionalItems = void 0;
const nt = F, Nn = T, hf = {
  message: ({ params: { len: e } }) => (0, nt.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, nt._)`{limit: ${e}}`
}, mf = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: hf,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, Nn.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    ui(e, n);
  }
};
function ui(e, t) {
  const { gen: r, schema: n, data: s, keyword: a, it: o } = e;
  o.items = !0;
  const l = r.const("len", (0, nt._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, nt._)`${l} <= ${t.length}`);
  else if (typeof n == "object" && !(0, Nn.alwaysValidSchema)(o, n)) {
    const u = r.var("valid", (0, nt._)`${l} <= ${t.length}`);
    r.if((0, nt.not)(u), () => i(u)), e.ok(u);
  }
  function i(u) {
    r.forRange("i", t.length, l, (c) => {
      e.subschema({ keyword: a, dataProp: c, dataPropType: Nn.Type.Num }, u), o.allErrors || r.if((0, nt.not)(u), () => r.break());
    });
  }
}
Ot.validateAdditionalItems = ui;
Ot.default = mf;
var ms = {}, Tt = {};
Object.defineProperty(Tt, "__esModule", { value: !0 });
Tt.validateTuple = void 0;
const Ea = F, vr = T, pf = H, $f = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return di(e, "additionalItems", t);
    r.items = !0, !(0, vr.alwaysValidSchema)(r, t) && e.ok((0, pf.validateArray)(e));
  }
};
function di(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: o, it: l } = e;
  c(s), l.opts.unevaluated && r.length && l.items !== !0 && (l.items = vr.mergeEvaluated.items(n, r.length, l.items));
  const i = n.name("valid"), u = n.const("len", (0, Ea._)`${a}.length`);
  r.forEach((f, _) => {
    (0, vr.alwaysValidSchema)(l, f) || (n.if((0, Ea._)`${u} > ${_}`, () => e.subschema({
      keyword: o,
      schemaProp: _,
      dataProp: _
    }, i)), e.ok(i));
  });
  function c(f) {
    const { opts: _, errSchemaPath: $ } = l, E = r.length, y = E === f.minItems && (E === f.maxItems || f[t] === !1);
    if (_.strictTuples && !y) {
      const v = `"${o}" is ${E}-tuple, but minItems or maxItems/${t} are not specified or different at path "${$}"`;
      (0, vr.checkStrictMode)(l, v, _.strictTuples);
    }
  }
}
Tt.validateTuple = di;
Tt.default = $f;
Object.defineProperty(ms, "__esModule", { value: !0 });
const yf = Tt, gf = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, yf.validateTuple)(e, "items")
};
ms.default = gf;
var ps = {};
Object.defineProperty(ps, "__esModule", { value: !0 });
const wa = F, vf = T, _f = H, Ef = Ot, wf = {
  message: ({ params: { len: e } }) => (0, wa.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, wa._)`{limit: ${e}}`
}, bf = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: wf,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, vf.alwaysValidSchema)(n, t) && (s ? (0, Ef.validateAdditionalItems)(e, s) : e.ok((0, _f.validateArray)(e)));
  }
};
ps.default = bf;
var $s = {};
Object.defineProperty($s, "__esModule", { value: !0 });
const be = F, ar = T, Sf = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, be.str)`must contain at least ${e} valid item(s)` : (0, be.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, be._)`{minContains: ${e}}` : (0, be._)`{minContains: ${e}, maxContains: ${t}}`
}, Pf = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: Sf,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    let o, l;
    const { minContains: i, maxContains: u } = n;
    a.opts.next ? (o = i === void 0 ? 1 : i, l = u) : o = 1;
    const c = t.const("len", (0, be._)`${s}.length`);
    if (e.setParams({ min: o, max: l }), l === void 0 && o === 0) {
      (0, ar.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (l !== void 0 && o > l) {
      (0, ar.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, ar.alwaysValidSchema)(a, r)) {
      let y = (0, be._)`${c} >= ${o}`;
      l !== void 0 && (y = (0, be._)`${y} && ${c} <= ${l}`), e.pass(y);
      return;
    }
    a.items = !0;
    const f = t.name("valid");
    l === void 0 && o === 1 ? $(f, () => t.if(f, () => t.break())) : o === 0 ? (t.let(f, !0), l !== void 0 && t.if((0, be._)`${s}.length > 0`, _)) : (t.let(f, !1), _()), e.result(f, () => e.reset());
    function _() {
      const y = t.name("_valid"), v = t.let("count", 0);
      $(y, () => t.if(y, () => E(v)));
    }
    function $(y, v) {
      t.forRange("i", 0, c, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: ar.Type.Num,
          compositeRule: !0
        }, y), v();
      });
    }
    function E(y) {
      t.code((0, be._)`${y}++`), l === void 0 ? t.if((0, be._)`${y} >= ${o}`, () => t.assign(f, !0).break()) : (t.if((0, be._)`${y} > ${l}`, () => t.assign(f, !1).break()), o === 1 ? t.assign(f, !0) : t.if((0, be._)`${y} >= ${o}`, () => t.assign(f, !0)));
    }
  }
};
$s.default = Pf;
var Lr = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = F, r = T, n = H;
  e.error = {
    message: ({ params: { property: i, depsCount: u, deps: c } }) => {
      const f = u === 1 ? "property" : "properties";
      return (0, t.str)`must have ${f} ${c} when property ${i} is present`;
    },
    params: ({ params: { property: i, depsCount: u, deps: c, missingProperty: f } }) => (0, t._)`{property: ${i},
    missingProperty: ${f},
    depsCount: ${u},
    deps: ${c}}`
    // TODO change to reference
  };
  const s = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(i) {
      const [u, c] = a(i);
      o(i, u), l(i, c);
    }
  };
  function a({ schema: i }) {
    const u = {}, c = {};
    for (const f in i) {
      if (f === "__proto__")
        continue;
      const _ = Array.isArray(i[f]) ? u : c;
      _[f] = i[f];
    }
    return [u, c];
  }
  function o(i, u = i.schema) {
    const { gen: c, data: f, it: _ } = i;
    if (Object.keys(u).length === 0)
      return;
    const $ = c.let("missing");
    for (const E in u) {
      const y = u[E];
      if (y.length === 0)
        continue;
      const v = (0, n.propertyInData)(c, f, E, _.opts.ownProperties);
      i.setParams({
        property: E,
        depsCount: y.length,
        deps: y.join(", ")
      }), _.allErrors ? c.if(v, () => {
        for (const m of y)
          (0, n.checkReportMissingProp)(i, m);
      }) : (c.if((0, t._)`${v} && (${(0, n.checkMissingProp)(i, y, $)})`), (0, n.reportMissingProp)(i, $), c.else());
    }
  }
  e.validatePropertyDeps = o;
  function l(i, u = i.schema) {
    const { gen: c, data: f, keyword: _, it: $ } = i, E = c.name("valid");
    for (const y in u)
      (0, r.alwaysValidSchema)($, u[y]) || (c.if(
        (0, n.propertyInData)(c, f, y, $.opts.ownProperties),
        () => {
          const v = i.subschema({ keyword: _, schemaProp: y }, E);
          i.mergeValidEvaluated(v, E);
        },
        () => c.var(E, !0)
        // TODO var
      ), i.ok(E));
  }
  e.validateSchemaDeps = l, e.default = s;
})(Lr);
var ys = {};
Object.defineProperty(ys, "__esModule", { value: !0 });
const fi = F, Rf = T, If = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, fi._)`{propertyName: ${e.propertyName}}`
}, Nf = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: If,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, Rf.alwaysValidSchema)(s, r))
      return;
    const a = t.name("valid");
    t.forIn("key", n, (o) => {
      e.setParams({ propertyName: o }), e.subschema({
        keyword: "propertyNames",
        data: o,
        dataTypes: ["string"],
        propertyName: o,
        compositeRule: !0
      }, a), t.if((0, fi.not)(a), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(a);
  }
};
ys.default = Nf;
var Mr = {};
Object.defineProperty(Mr, "__esModule", { value: !0 });
const or = H, Ie = F, Of = Ee, ir = T, Tf = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, Ie._)`{additionalProperty: ${e.additionalProperty}}`
}, jf = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: Tf,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: a, it: o } = e;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: l, opts: i } = o;
    if (o.props = !0, i.removeAdditional !== "all" && (0, ir.alwaysValidSchema)(o, r))
      return;
    const u = (0, or.allSchemaProperties)(n.properties), c = (0, or.allSchemaProperties)(n.patternProperties);
    f(), e.ok((0, Ie._)`${a} === ${Of.default.errors}`);
    function f() {
      t.forIn("key", s, (v) => {
        !u.length && !c.length ? E(v) : t.if(_(v), () => E(v));
      });
    }
    function _(v) {
      let m;
      if (u.length > 8) {
        const w = (0, ir.schemaRefOrVal)(o, n.properties, "properties");
        m = (0, or.isOwnProperty)(t, w, v);
      } else u.length ? m = (0, Ie.or)(...u.map((w) => (0, Ie._)`${v} === ${w}`)) : m = Ie.nil;
      return c.length && (m = (0, Ie.or)(m, ...c.map((w) => (0, Ie._)`${(0, or.usePattern)(e, w)}.test(${v})`))), (0, Ie.not)(m);
    }
    function $(v) {
      t.code((0, Ie._)`delete ${s}[${v}]`);
    }
    function E(v) {
      if (i.removeAdditional === "all" || i.removeAdditional && r === !1) {
        $(v);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: v }), e.error(), l || t.break();
        return;
      }
      if (typeof r == "object" && !(0, ir.alwaysValidSchema)(o, r)) {
        const m = t.name("valid");
        i.removeAdditional === "failing" ? (y(v, m, !1), t.if((0, Ie.not)(m), () => {
          e.reset(), $(v);
        })) : (y(v, m), l || t.if((0, Ie.not)(m), () => t.break()));
      }
    }
    function y(v, m, w) {
      const R = {
        keyword: "additionalProperties",
        dataProp: v,
        dataPropType: ir.Type.Str
      };
      w === !1 && Object.assign(R, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(R, m);
    }
  }
};
Mr.default = jf;
var gs = {};
Object.defineProperty(gs, "__esModule", { value: !0 });
const Af = Se, ba = H, hn = T, Sa = Mr, kf = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && Sa.default.code(new Af.KeywordCxt(a, Sa.default, "additionalProperties"));
    const o = (0, ba.allSchemaProperties)(r);
    for (const f of o)
      a.definedProperties.add(f);
    a.opts.unevaluated && o.length && a.props !== !0 && (a.props = hn.mergeEvaluated.props(t, (0, hn.toHash)(o), a.props));
    const l = o.filter((f) => !(0, hn.alwaysValidSchema)(a, r[f]));
    if (l.length === 0)
      return;
    const i = t.name("valid");
    for (const f of l)
      u(f) ? c(f) : (t.if((0, ba.propertyInData)(t, s, f, a.opts.ownProperties)), c(f), a.allErrors || t.else().var(i, !0), t.endIf()), e.it.definedProperties.add(f), e.ok(i);
    function u(f) {
      return a.opts.useDefaults && !a.compositeRule && r[f].default !== void 0;
    }
    function c(f) {
      e.subschema({
        keyword: "properties",
        schemaProp: f,
        dataProp: f
      }, i);
    }
  }
};
gs.default = kf;
var vs = {};
Object.defineProperty(vs, "__esModule", { value: !0 });
const Pa = H, cr = F, Ra = T, Ia = T, Cf = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: a } = e, { opts: o } = a, l = (0, Pa.allSchemaProperties)(r), i = l.filter((y) => (0, Ra.alwaysValidSchema)(a, r[y]));
    if (l.length === 0 || i.length === l.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const u = o.strictSchema && !o.allowMatchingProperties && s.properties, c = t.name("valid");
    a.props !== !0 && !(a.props instanceof cr.Name) && (a.props = (0, Ia.evaluatedPropsToName)(t, a.props));
    const { props: f } = a;
    _();
    function _() {
      for (const y of l)
        u && $(y), a.allErrors ? E(y) : (t.var(c, !0), E(y), t.if(c));
    }
    function $(y) {
      for (const v in u)
        new RegExp(y).test(v) && (0, Ra.checkStrictMode)(a, `property ${v} matches pattern ${y} (use allowMatchingProperties)`);
    }
    function E(y) {
      t.forIn("key", n, (v) => {
        t.if((0, cr._)`${(0, Pa.usePattern)(e, y)}.test(${v})`, () => {
          const m = i.includes(y);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: y,
            dataProp: v,
            dataPropType: Ia.Type.Str
          }, c), a.opts.unevaluated && f !== !0 ? t.assign((0, cr._)`${f}[${v}]`, !0) : !m && !a.allErrors && t.if((0, cr.not)(c), () => t.break());
        });
      });
    }
  }
};
vs.default = Cf;
var _s = {};
Object.defineProperty(_s, "__esModule", { value: !0 });
const Df = T, Lf = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, Df.alwaysValidSchema)(n, r)) {
      e.fail();
      return;
    }
    const s = t.name("valid");
    e.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, s), e.failResult(s, () => e.reset(), () => e.error());
  },
  error: { message: "must NOT be valid" }
};
_s.default = Lf;
var Es = {};
Object.defineProperty(Es, "__esModule", { value: !0 });
const Mf = H, Vf = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: Mf.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
Es.default = Vf;
var ws = {};
Object.defineProperty(ws, "__esModule", { value: !0 });
const _r = F, Uf = T, zf = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, _r._)`{passingSchemas: ${e.passing}}`
}, Ff = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: zf,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: s } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const a = r, o = t.let("valid", !1), l = t.let("passing", null), i = t.name("_valid");
    e.setParams({ passing: l }), t.block(u), e.result(o, () => e.reset(), () => e.error(!0));
    function u() {
      a.forEach((c, f) => {
        let _;
        (0, Uf.alwaysValidSchema)(s, c) ? t.var(i, !0) : _ = e.subschema({
          keyword: "oneOf",
          schemaProp: f,
          compositeRule: !0
        }, i), f > 0 && t.if((0, _r._)`${i} && ${o}`).assign(o, !1).assign(l, (0, _r._)`[${l}, ${f}]`).else(), t.if(i, () => {
          t.assign(o, !0), t.assign(l, f), _ && e.mergeEvaluated(_, _r.Name);
        });
      });
    }
  }
};
ws.default = Ff;
var bs = {};
Object.defineProperty(bs, "__esModule", { value: !0 });
const qf = T, Gf = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((a, o) => {
      if ((0, qf.alwaysValidSchema)(n, a))
        return;
      const l = e.subschema({ keyword: "allOf", schemaProp: o }, s);
      e.ok(s), e.mergeEvaluated(l);
    });
  }
};
bs.default = Gf;
var Ss = {};
Object.defineProperty(Ss, "__esModule", { value: !0 });
const Ir = F, hi = T, Kf = {
  message: ({ params: e }) => (0, Ir.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, Ir._)`{failingKeyword: ${e.ifClause}}`
}, Hf = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: Kf,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, hi.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = Na(n, "then"), a = Na(n, "else");
    if (!s && !a)
      return;
    const o = t.let("valid", !0), l = t.name("_valid");
    if (i(), e.reset(), s && a) {
      const c = t.let("ifClause");
      e.setParams({ ifClause: c }), t.if(l, u("then", c), u("else", c));
    } else s ? t.if(l, u("then")) : t.if((0, Ir.not)(l), u("else"));
    e.pass(o, () => e.error(!0));
    function i() {
      const c = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, l);
      e.mergeEvaluated(c);
    }
    function u(c, f) {
      return () => {
        const _ = e.subschema({ keyword: c }, l);
        t.assign(o, l), e.mergeValidEvaluated(_, o), f ? t.assign(f, (0, Ir._)`${c}`) : e.setParams({ ifClause: c });
      };
    }
  }
};
function Na(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, hi.alwaysValidSchema)(e, r);
}
Ss.default = Hf;
var Ps = {};
Object.defineProperty(Ps, "__esModule", { value: !0 });
const Xf = T, Wf = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, Xf.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
Ps.default = Wf;
Object.defineProperty(Dr, "__esModule", { value: !0 });
const Bf = Ot, Jf = ms, xf = Tt, Yf = ps, Zf = $s, Qf = Lr, eh = ys, th = Mr, rh = gs, nh = vs, sh = _s, ah = Es, oh = ws, ih = bs, ch = Ss, lh = Ps;
function uh(e = !1) {
  const t = [
    // any
    sh.default,
    ah.default,
    oh.default,
    ih.default,
    ch.default,
    lh.default,
    // object
    eh.default,
    th.default,
    Qf.default,
    rh.default,
    nh.default
  ];
  return e ? t.push(Jf.default, Yf.default) : t.push(Bf.default, xf.default), t.push(Zf.default), t;
}
Dr.default = uh;
var Rs = {}, jt = {};
Object.defineProperty(jt, "__esModule", { value: !0 });
jt.dynamicAnchor = void 0;
const mn = F, dh = Ee, Oa = pe, fh = qe, hh = {
  keyword: "$dynamicAnchor",
  schemaType: "string",
  code: (e) => mi(e, e.schema)
};
function mi(e, t) {
  const { gen: r, it: n } = e;
  n.schemaEnv.root.dynamicAnchors[t] = !0;
  const s = (0, mn._)`${dh.default.dynamicAnchors}${(0, mn.getProperty)(t)}`, a = n.errSchemaPath === "#" ? n.validateName : mh(e);
  r.if((0, mn._)`!${s}`, () => r.assign(s, a));
}
jt.dynamicAnchor = mi;
function mh(e) {
  const { schemaEnv: t, schema: r, self: n } = e.it, { root: s, baseId: a, localRefs: o, meta: l } = t.root, { schemaId: i } = n.opts, u = new Oa.SchemaEnv({ schema: r, schemaId: i, root: s, baseId: a, localRefs: o, meta: l });
  return Oa.compileSchema.call(n, u), (0, fh.getValidate)(e, u);
}
jt.default = hh;
var At = {};
Object.defineProperty(At, "__esModule", { value: !0 });
At.dynamicRef = void 0;
const Ta = F, ph = Ee, ja = qe, $h = {
  keyword: "$dynamicRef",
  schemaType: "string",
  code: (e) => pi(e, e.schema)
};
function pi(e, t) {
  const { gen: r, keyword: n, it: s } = e;
  if (t[0] !== "#")
    throw new Error(`"${n}" only supports hash fragment reference`);
  const a = t.slice(1);
  if (s.allErrors)
    o();
  else {
    const i = r.let("valid", !1);
    o(i), e.ok(i);
  }
  function o(i) {
    if (s.schemaEnv.root.dynamicAnchors[a]) {
      const u = r.let("_v", (0, Ta._)`${ph.default.dynamicAnchors}${(0, Ta.getProperty)(a)}`);
      r.if(u, l(u, i), l(s.validateName, i));
    } else
      l(s.validateName, i)();
  }
  function l(i, u) {
    return u ? () => r.block(() => {
      (0, ja.callRef)(e, i), r.let(u, !0);
    }) : () => (0, ja.callRef)(e, i);
  }
}
At.dynamicRef = pi;
At.default = $h;
var Is = {};
Object.defineProperty(Is, "__esModule", { value: !0 });
const yh = jt, gh = T, vh = {
  keyword: "$recursiveAnchor",
  schemaType: "boolean",
  code(e) {
    e.schema ? (0, yh.dynamicAnchor)(e, "") : (0, gh.checkStrictMode)(e.it, "$recursiveAnchor: false is ignored");
  }
};
Is.default = vh;
var Ns = {};
Object.defineProperty(Ns, "__esModule", { value: !0 });
const _h = At, Eh = {
  keyword: "$recursiveRef",
  schemaType: "string",
  code: (e) => (0, _h.dynamicRef)(e, e.schema)
};
Ns.default = Eh;
Object.defineProperty(Rs, "__esModule", { value: !0 });
const wh = jt, bh = At, Sh = Is, Ph = Ns, Rh = [wh.default, bh.default, Sh.default, Ph.default];
Rs.default = Rh;
var Os = {}, Ts = {};
Object.defineProperty(Ts, "__esModule", { value: !0 });
const Aa = Lr, Ih = {
  keyword: "dependentRequired",
  type: "object",
  schemaType: "object",
  error: Aa.error,
  code: (e) => (0, Aa.validatePropertyDeps)(e)
};
Ts.default = Ih;
var js = {};
Object.defineProperty(js, "__esModule", { value: !0 });
const Nh = Lr, Oh = {
  keyword: "dependentSchemas",
  type: "object",
  schemaType: "object",
  code: (e) => (0, Nh.validateSchemaDeps)(e)
};
js.default = Oh;
var As = {};
Object.defineProperty(As, "__esModule", { value: !0 });
const Th = T, jh = {
  keyword: ["maxContains", "minContains"],
  type: "array",
  schemaType: "number",
  code({ keyword: e, parentSchema: t, it: r }) {
    t.contains === void 0 && (0, Th.checkStrictMode)(r, `"${e}" without "contains" is ignored`);
  }
};
As.default = jh;
Object.defineProperty(Os, "__esModule", { value: !0 });
const Ah = Ts, kh = js, Ch = As, Dh = [Ah.default, kh.default, Ch.default];
Os.default = Dh;
var ks = {}, Cs = {};
Object.defineProperty(Cs, "__esModule", { value: !0 });
const Be = F, ka = T, Lh = Ee, Mh = {
  message: "must NOT have unevaluated properties",
  params: ({ params: e }) => (0, Be._)`{unevaluatedProperty: ${e.unevaluatedProperty}}`
}, Vh = {
  keyword: "unevaluatedProperties",
  type: "object",
  schemaType: ["boolean", "object"],
  trackErrors: !0,
  error: Mh,
  code(e) {
    const { gen: t, schema: r, data: n, errsCount: s, it: a } = e;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: o, props: l } = a;
    l instanceof Be.Name ? t.if((0, Be._)`${l} !== true`, () => t.forIn("key", n, (f) => t.if(u(l, f), () => i(f)))) : l !== !0 && t.forIn("key", n, (f) => l === void 0 ? i(f) : t.if(c(l, f), () => i(f))), a.props = !0, e.ok((0, Be._)`${s} === ${Lh.default.errors}`);
    function i(f) {
      if (r === !1) {
        e.setParams({ unevaluatedProperty: f }), e.error(), o || t.break();
        return;
      }
      if (!(0, ka.alwaysValidSchema)(a, r)) {
        const _ = t.name("valid");
        e.subschema({
          keyword: "unevaluatedProperties",
          dataProp: f,
          dataPropType: ka.Type.Str
        }, _), o || t.if((0, Be.not)(_), () => t.break());
      }
    }
    function u(f, _) {
      return (0, Be._)`!${f} || !${f}[${_}]`;
    }
    function c(f, _) {
      const $ = [];
      for (const E in f)
        f[E] === !0 && $.push((0, Be._)`${_} !== ${E}`);
      return (0, Be.and)(...$);
    }
  }
};
Cs.default = Vh;
var Ds = {};
Object.defineProperty(Ds, "__esModule", { value: !0 });
const st = F, Ca = T, Uh = {
  message: ({ params: { len: e } }) => (0, st.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, st._)`{limit: ${e}}`
}, zh = {
  keyword: "unevaluatedItems",
  type: "array",
  schemaType: ["boolean", "object"],
  error: Uh,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e, a = s.items || 0;
    if (a === !0)
      return;
    const o = t.const("len", (0, st._)`${n}.length`);
    if (r === !1)
      e.setParams({ len: a }), e.fail((0, st._)`${o} > ${a}`);
    else if (typeof r == "object" && !(0, Ca.alwaysValidSchema)(s, r)) {
      const i = t.var("valid", (0, st._)`${o} <= ${a}`);
      t.if((0, st.not)(i), () => l(i, a)), e.ok(i);
    }
    s.items = !0;
    function l(i, u) {
      t.forRange("i", u, o, (c) => {
        e.subschema({ keyword: "unevaluatedItems", dataProp: c, dataPropType: Ca.Type.Num }, i), s.allErrors || t.if((0, st.not)(i), () => t.break());
      });
    }
  }
};
Ds.default = zh;
Object.defineProperty(ks, "__esModule", { value: !0 });
const Fh = Cs, qh = Ds, Gh = [Fh.default, qh.default];
ks.default = Gh;
var Vr = {}, Ls = {};
Object.defineProperty(Ls, "__esModule", { value: !0 });
const re = F, Kh = {
  message: ({ schemaCode: e }) => (0, re.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, re._)`{format: ${e}}`
}, Hh = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: Kh,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: a, schemaCode: o, it: l } = e, { opts: i, errSchemaPath: u, schemaEnv: c, self: f } = l;
    if (!i.validateFormats)
      return;
    s ? _() : $();
    function _() {
      const E = r.scopeValue("formats", {
        ref: f.formats,
        code: i.code.formats
      }), y = r.const("fDef", (0, re._)`${E}[${o}]`), v = r.let("fType"), m = r.let("format");
      r.if((0, re._)`typeof ${y} == "object" && !(${y} instanceof RegExp)`, () => r.assign(v, (0, re._)`${y}.type || "string"`).assign(m, (0, re._)`${y}.validate`), () => r.assign(v, (0, re._)`"string"`).assign(m, y)), e.fail$data((0, re.or)(w(), R()));
      function w() {
        return i.strictSchema === !1 ? re.nil : (0, re._)`${o} && !${m}`;
      }
      function R() {
        const O = c.$async ? (0, re._)`(${y}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, re._)`${m}(${n})`, j = (0, re._)`(typeof ${m} == "function" ? ${O} : ${m}.test(${n}))`;
        return (0, re._)`${m} && ${m} !== true && ${v} === ${t} && !${j}`;
      }
    }
    function $() {
      const E = f.formats[a];
      if (!E) {
        w();
        return;
      }
      if (E === !0)
        return;
      const [y, v, m] = R(E);
      y === t && e.pass(O());
      function w() {
        if (i.strictSchema === !1) {
          f.logger.warn(j());
          return;
        }
        throw new Error(j());
        function j() {
          return `unknown format "${a}" ignored in schema at path "${u}"`;
        }
      }
      function R(j) {
        const B = j instanceof RegExp ? (0, re.regexpCode)(j) : i.code.formats ? (0, re._)`${i.code.formats}${(0, re.getProperty)(a)}` : void 0, te = r.scopeValue("formats", { key: a, ref: j, code: B });
        return typeof j == "object" && !(j instanceof RegExp) ? [j.type || "string", j.validate, (0, re._)`${te}.validate`] : ["string", j, te];
      }
      function O() {
        if (typeof E == "object" && !(E instanceof RegExp) && E.async) {
          if (!c.$async)
            throw new Error("async format in sync schema");
          return (0, re._)`await ${m}(${n})`;
        }
        return typeof v == "function" ? (0, re._)`${m}(${n})` : (0, re._)`${m}.test(${n})`;
      }
    }
  }
};
Ls.default = Hh;
Object.defineProperty(Vr, "__esModule", { value: !0 });
const Xh = Ls, Wh = [Xh.default];
Vr.default = Wh;
var lt = {};
Object.defineProperty(lt, "__esModule", { value: !0 });
lt.contentVocabulary = lt.metadataVocabulary = void 0;
lt.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
lt.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(ts, "__esModule", { value: !0 });
const Bh = kr, Jh = Cr, xh = Dr, Yh = Rs, Zh = Os, Qh = ks, em = Vr, Da = lt, tm = [
  Yh.default,
  Bh.default,
  Jh.default,
  (0, xh.default)(!0),
  em.default,
  Da.metadataVocabulary,
  Da.contentVocabulary,
  Zh.default,
  Qh.default
];
ts.default = tm;
var Ur = {}, zr = {};
Object.defineProperty(zr, "__esModule", { value: !0 });
zr.DiscrError = void 0;
var La;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(La || (zr.DiscrError = La = {}));
Object.defineProperty(Ur, "__esModule", { value: !0 });
const yt = F, On = zr, Ma = pe, rm = ut, nm = T, sm = {
  message: ({ params: { discrError: e, tagName: t } }) => e === On.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, yt._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, am = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: sm,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: s, it: a } = e, { oneOf: o } = s;
    if (!a.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const l = n.propertyName;
    if (typeof l != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!o)
      throw new Error("discriminator: requires oneOf keyword");
    const i = t.let("valid", !1), u = t.const("tag", (0, yt._)`${r}${(0, yt.getProperty)(l)}`);
    t.if((0, yt._)`typeof ${u} == "string"`, () => c(), () => e.error(!1, { discrError: On.DiscrError.Tag, tag: u, tagName: l })), e.ok(i);
    function c() {
      const $ = _();
      t.if(!1);
      for (const E in $)
        t.elseIf((0, yt._)`${u} === ${E}`), t.assign(i, f($[E]));
      t.else(), e.error(!1, { discrError: On.DiscrError.Mapping, tag: u, tagName: l }), t.endIf();
    }
    function f($) {
      const E = t.name("valid"), y = e.subschema({ keyword: "oneOf", schemaProp: $ }, E);
      return e.mergeEvaluated(y, yt.Name), E;
    }
    function _() {
      var $;
      const E = {}, y = m(s);
      let v = !0;
      for (let O = 0; O < o.length; O++) {
        let j = o[O];
        if (j != null && j.$ref && !(0, nm.schemaHasRulesButRef)(j, a.self.RULES)) {
          const te = j.$ref;
          if (j = Ma.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, te), j instanceof Ma.SchemaEnv && (j = j.schema), j === void 0)
            throw new rm.default(a.opts.uriResolver, a.baseId, te);
        }
        const B = ($ = j == null ? void 0 : j.properties) === null || $ === void 0 ? void 0 : $[l];
        if (typeof B != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${l}"`);
        v = v && (y || m(j)), w(B, O);
      }
      if (!v)
        throw new Error(`discriminator: "${l}" must be required`);
      return E;
      function m({ required: O }) {
        return Array.isArray(O) && O.includes(l);
      }
      function w(O, j) {
        if (O.const)
          R(O.const, j);
        else if (O.enum)
          for (const B of O.enum)
            R(B, j);
        else
          throw new Error(`discriminator: "properties/${l}" must have "const" or "enum"`);
      }
      function R(O, j) {
        if (typeof O != "string" || O in E)
          throw new Error(`discriminator: "${l}" values must be unique strings`);
        E[O] = j;
      }
    }
  }
};
Ur.default = am;
var Ms = {};
const om = "https://json-schema.org/draft/2020-12/schema", im = "https://json-schema.org/draft/2020-12/schema", cm = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0,
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0,
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0,
  "https://json-schema.org/draft/2020-12/vocab/validation": !0,
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0,
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0,
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, lm = "meta", um = "Core and Validation specifications meta-schema", dm = [
  {
    $ref: "meta/core"
  },
  {
    $ref: "meta/applicator"
  },
  {
    $ref: "meta/unevaluated"
  },
  {
    $ref: "meta/validation"
  },
  {
    $ref: "meta/meta-data"
  },
  {
    $ref: "meta/format-annotation"
  },
  {
    $ref: "meta/content"
  }
], fm = [
  "object",
  "boolean"
], hm = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", mm = {
  definitions: {
    $comment: '"definitions" has been replaced by "$defs".',
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    deprecated: !0,
    default: {}
  },
  dependencies: {
    $comment: '"dependencies" has been split and replaced by "dependentSchemas" and "dependentRequired" in order to serve their differing semantics.',
    type: "object",
    additionalProperties: {
      anyOf: [
        {
          $dynamicRef: "#meta"
        },
        {
          $ref: "meta/validation#/$defs/stringArray"
        }
      ]
    },
    deprecated: !0,
    default: {}
  },
  $recursiveAnchor: {
    $comment: '"$recursiveAnchor" has been replaced by "$dynamicAnchor".',
    $ref: "meta/core#/$defs/anchorString",
    deprecated: !0
  },
  $recursiveRef: {
    $comment: '"$recursiveRef" has been replaced by "$dynamicRef".',
    $ref: "meta/core#/$defs/uriReferenceString",
    deprecated: !0
  }
}, pm = {
  $schema: om,
  $id: im,
  $vocabulary: cm,
  $dynamicAnchor: lm,
  title: um,
  allOf: dm,
  type: fm,
  $comment: hm,
  properties: mm
}, $m = "https://json-schema.org/draft/2020-12/schema", ym = "https://json-schema.org/draft/2020-12/meta/applicator", gm = {
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0
}, vm = "meta", _m = "Applicator vocabulary meta-schema", Em = [
  "object",
  "boolean"
], wm = {
  prefixItems: {
    $ref: "#/$defs/schemaArray"
  },
  items: {
    $dynamicRef: "#meta"
  },
  contains: {
    $dynamicRef: "#meta"
  },
  additionalProperties: {
    $dynamicRef: "#meta"
  },
  properties: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    default: {}
  },
  patternProperties: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    propertyNames: {
      format: "regex"
    },
    default: {}
  },
  dependentSchemas: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    default: {}
  },
  propertyNames: {
    $dynamicRef: "#meta"
  },
  if: {
    $dynamicRef: "#meta"
  },
  then: {
    $dynamicRef: "#meta"
  },
  else: {
    $dynamicRef: "#meta"
  },
  allOf: {
    $ref: "#/$defs/schemaArray"
  },
  anyOf: {
    $ref: "#/$defs/schemaArray"
  },
  oneOf: {
    $ref: "#/$defs/schemaArray"
  },
  not: {
    $dynamicRef: "#meta"
  }
}, bm = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $dynamicRef: "#meta"
    }
  }
}, Sm = {
  $schema: $m,
  $id: ym,
  $vocabulary: gm,
  $dynamicAnchor: vm,
  title: _m,
  type: Em,
  properties: wm,
  $defs: bm
}, Pm = "https://json-schema.org/draft/2020-12/schema", Rm = "https://json-schema.org/draft/2020-12/meta/unevaluated", Im = {
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0
}, Nm = "meta", Om = "Unevaluated applicator vocabulary meta-schema", Tm = [
  "object",
  "boolean"
], jm = {
  unevaluatedItems: {
    $dynamicRef: "#meta"
  },
  unevaluatedProperties: {
    $dynamicRef: "#meta"
  }
}, Am = {
  $schema: Pm,
  $id: Rm,
  $vocabulary: Im,
  $dynamicAnchor: Nm,
  title: Om,
  type: Tm,
  properties: jm
}, km = "https://json-schema.org/draft/2020-12/schema", Cm = "https://json-schema.org/draft/2020-12/meta/content", Dm = {
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, Lm = "meta", Mm = "Content vocabulary meta-schema", Vm = [
  "object",
  "boolean"
], Um = {
  contentEncoding: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentSchema: {
    $dynamicRef: "#meta"
  }
}, zm = {
  $schema: km,
  $id: Cm,
  $vocabulary: Dm,
  $dynamicAnchor: Lm,
  title: Mm,
  type: Vm,
  properties: Um
}, Fm = "https://json-schema.org/draft/2020-12/schema", qm = "https://json-schema.org/draft/2020-12/meta/core", Gm = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0
}, Km = "meta", Hm = "Core vocabulary meta-schema", Xm = [
  "object",
  "boolean"
], Wm = {
  $id: {
    $ref: "#/$defs/uriReferenceString",
    $comment: "Non-empty fragments not allowed.",
    pattern: "^[^#]*#?$"
  },
  $schema: {
    $ref: "#/$defs/uriString"
  },
  $ref: {
    $ref: "#/$defs/uriReferenceString"
  },
  $anchor: {
    $ref: "#/$defs/anchorString"
  },
  $dynamicRef: {
    $ref: "#/$defs/uriReferenceString"
  },
  $dynamicAnchor: {
    $ref: "#/$defs/anchorString"
  },
  $vocabulary: {
    type: "object",
    propertyNames: {
      $ref: "#/$defs/uriString"
    },
    additionalProperties: {
      type: "boolean"
    }
  },
  $comment: {
    type: "string"
  },
  $defs: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    }
  }
}, Bm = {
  anchorString: {
    type: "string",
    pattern: "^[A-Za-z_][-A-Za-z0-9._]*$"
  },
  uriString: {
    type: "string",
    format: "uri"
  },
  uriReferenceString: {
    type: "string",
    format: "uri-reference"
  }
}, Jm = {
  $schema: Fm,
  $id: qm,
  $vocabulary: Gm,
  $dynamicAnchor: Km,
  title: Hm,
  type: Xm,
  properties: Wm,
  $defs: Bm
}, xm = "https://json-schema.org/draft/2020-12/schema", Ym = "https://json-schema.org/draft/2020-12/meta/format-annotation", Zm = {
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0
}, Qm = "meta", ep = "Format vocabulary meta-schema for annotation results", tp = [
  "object",
  "boolean"
], rp = {
  format: {
    type: "string"
  }
}, np = {
  $schema: xm,
  $id: Ym,
  $vocabulary: Zm,
  $dynamicAnchor: Qm,
  title: ep,
  type: tp,
  properties: rp
}, sp = "https://json-schema.org/draft/2020-12/schema", ap = "https://json-schema.org/draft/2020-12/meta/meta-data", op = {
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0
}, ip = "meta", cp = "Meta-data vocabulary meta-schema", lp = [
  "object",
  "boolean"
], up = {
  title: {
    type: "string"
  },
  description: {
    type: "string"
  },
  default: !0,
  deprecated: {
    type: "boolean",
    default: !1
  },
  readOnly: {
    type: "boolean",
    default: !1
  },
  writeOnly: {
    type: "boolean",
    default: !1
  },
  examples: {
    type: "array",
    items: !0
  }
}, dp = {
  $schema: sp,
  $id: ap,
  $vocabulary: op,
  $dynamicAnchor: ip,
  title: cp,
  type: lp,
  properties: up
}, fp = "https://json-schema.org/draft/2020-12/schema", hp = "https://json-schema.org/draft/2020-12/meta/validation", mp = {
  "https://json-schema.org/draft/2020-12/vocab/validation": !0
}, pp = "meta", $p = "Validation vocabulary meta-schema", yp = [
  "object",
  "boolean"
], gp = {
  type: {
    anyOf: [
      {
        $ref: "#/$defs/simpleTypes"
      },
      {
        type: "array",
        items: {
          $ref: "#/$defs/simpleTypes"
        },
        minItems: 1,
        uniqueItems: !0
      }
    ]
  },
  const: !0,
  enum: {
    type: "array",
    items: !0
  },
  multipleOf: {
    type: "number",
    exclusiveMinimum: 0
  },
  maximum: {
    type: "number"
  },
  exclusiveMaximum: {
    type: "number"
  },
  minimum: {
    type: "number"
  },
  exclusiveMinimum: {
    type: "number"
  },
  maxLength: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  maxItems: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    default: !1
  },
  maxContains: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minContains: {
    $ref: "#/$defs/nonNegativeInteger",
    default: 1
  },
  maxProperties: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/$defs/stringArray"
  },
  dependentRequired: {
    type: "object",
    additionalProperties: {
      $ref: "#/$defs/stringArray"
    }
  }
}, vp = {
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    $ref: "#/$defs/nonNegativeInteger",
    default: 0
  },
  simpleTypes: {
    enum: [
      "array",
      "boolean",
      "integer",
      "null",
      "number",
      "object",
      "string"
    ]
  },
  stringArray: {
    type: "array",
    items: {
      type: "string"
    },
    uniqueItems: !0,
    default: []
  }
}, _p = {
  $schema: fp,
  $id: hp,
  $vocabulary: mp,
  $dynamicAnchor: pp,
  title: $p,
  type: yp,
  properties: gp,
  $defs: vp
};
Object.defineProperty(Ms, "__esModule", { value: !0 });
const Ep = pm, wp = Sm, bp = Am, Sp = zm, Pp = Jm, Rp = np, Ip = dp, Np = _p, Op = ["/properties"];
function Tp(e) {
  return [
    Ep,
    wp,
    bp,
    Sp,
    Pp,
    t(this, Rp),
    Ip,
    t(this, Np)
  ].forEach((r) => this.addMetaSchema(r, void 0, !1)), this;
  function t(r, n) {
    return e ? r.$dataMetaSchema(n, Op) : n;
  }
}
Ms.default = Tp;
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv2020 = void 0;
  const r = zn, n = ts, s = Ur, a = Ms, o = "https://json-schema.org/draft/2020-12/schema";
  class l extends r.default {
    constructor($ = {}) {
      super({
        ...$,
        dynamicRef: !0,
        next: !0,
        unevaluated: !0
      });
    }
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach(($) => this.addVocabulary($)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      super._addDefaultMetaSchema();
      const { $data: $, meta: E } = this.opts;
      E && (a.default.call(this, $), this.refs["http://json-schema.org/schema"] = o);
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(o) ? o : void 0);
    }
  }
  t.Ajv2020 = l, e.exports = t = l, e.exports.Ajv2020 = l, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = l;
  var i = Se;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return i.KeywordCxt;
  } });
  var u = F;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return u._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return u.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return u.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return u.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return u.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return u.CodeGen;
  } });
  var c = Nt;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return c.default;
  } });
  var f = ut;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return f.default;
  } });
})(wn, wn.exports);
var jp = wn.exports, Tn = { exports: {} }, $i = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
  function t(U, q) {
    return { validate: U, compare: q };
  }
  e.fullFormats = {
    // date: http://tools.ietf.org/html/rfc3339#section-5.6
    date: t(a, o),
    // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
    time: t(i(!0), u),
    "date-time": t(_(!0), $),
    "iso-time": t(i(), c),
    "iso-date-time": t(_(), E),
    // duration: https://tools.ietf.org/html/rfc3339#appendix-A
    duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
    uri: m,
    "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
    // uri-template: https://tools.ietf.org/html/rfc6570
    "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
    // For the source: https://gist.github.com/dperini/729294
    // For test cases: https://mathiasbynens.be/demo/url-regex
    url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
    email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
    hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
    // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
    ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
    ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
    regex: Pe,
    // uuid: http://tools.ietf.org/html/rfc4122
    uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
    // JSON-pointer: https://tools.ietf.org/html/rfc6901
    // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
    "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
    "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
    // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
    "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
    // the following formats are used by the openapi specification: https://spec.openapis.org/oas/v3.0.0#data-types
    // byte: https://github.com/miguelmota/is-base64
    byte: R,
    // signed 32 bit integer
    int32: { type: "number", validate: B },
    // signed 64 bit integer
    int64: { type: "number", validate: te },
    // C-type float
    float: { type: "number", validate: ye },
    // C-type double
    double: { type: "number", validate: ye },
    // hint to the UI to hide input strings
    password: !0,
    // unchecked string payload
    binary: !0
  }, e.fastFormats = {
    ...e.fullFormats,
    date: t(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, o),
    time: t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, u),
    "date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, $),
    "iso-time": t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, c),
    "iso-date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, E),
    // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
    uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
    "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
    // email (sources from jsen validator):
    // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
    // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
    email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
  }, e.formatNames = Object.keys(e.fullFormats);
  function r(U) {
    return U % 4 === 0 && (U % 100 !== 0 || U % 400 === 0);
  }
  const n = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, s = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function a(U) {
    const q = n.exec(U);
    if (!q)
      return !1;
    const Y = +q[1], I = +q[2], N = +q[3];
    return I >= 1 && I <= 12 && N >= 1 && N <= (I === 2 && r(Y) ? 29 : s[I]);
  }
  function o(U, q) {
    if (U && q)
      return U > q ? 1 : U < q ? -1 : 0;
  }
  const l = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
  function i(U) {
    return function(Y) {
      const I = l.exec(Y);
      if (!I)
        return !1;
      const N = +I[1], C = +I[2], A = +I[3], V = I[4], k = I[5] === "-" ? -1 : 1, P = +(I[6] || 0), p = +(I[7] || 0);
      if (P > 23 || p > 59 || U && !V)
        return !1;
      if (N <= 23 && C <= 59 && A < 60)
        return !0;
      const b = C - p * k, g = N - P * k - (b < 0 ? 1 : 0);
      return (g === 23 || g === -1) && (b === 59 || b === -1) && A < 61;
    };
  }
  function u(U, q) {
    if (!(U && q))
      return;
    const Y = (/* @__PURE__ */ new Date("2020-01-01T" + U)).valueOf(), I = (/* @__PURE__ */ new Date("2020-01-01T" + q)).valueOf();
    if (Y && I)
      return Y - I;
  }
  function c(U, q) {
    if (!(U && q))
      return;
    const Y = l.exec(U), I = l.exec(q);
    if (Y && I)
      return U = Y[1] + Y[2] + Y[3], q = I[1] + I[2] + I[3], U > q ? 1 : U < q ? -1 : 0;
  }
  const f = /t|\s/i;
  function _(U) {
    const q = i(U);
    return function(I) {
      const N = I.split(f);
      return N.length === 2 && a(N[0]) && q(N[1]);
    };
  }
  function $(U, q) {
    if (!(U && q))
      return;
    const Y = new Date(U).valueOf(), I = new Date(q).valueOf();
    if (Y && I)
      return Y - I;
  }
  function E(U, q) {
    if (!(U && q))
      return;
    const [Y, I] = U.split(f), [N, C] = q.split(f), A = o(Y, N);
    if (A !== void 0)
      return A || u(I, C);
  }
  const y = /\/|:/, v = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  function m(U) {
    return y.test(U) && v.test(U);
  }
  const w = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
  function R(U) {
    return w.lastIndex = 0, w.test(U);
  }
  const O = -2147483648, j = 2 ** 31 - 1;
  function B(U) {
    return Number.isInteger(U) && U <= j && U >= O;
  }
  function te(U) {
    return Number.isInteger(U);
  }
  function ye() {
    return !0;
  }
  const we = /[^\\]\\Z/;
  function Pe(U) {
    if (we.test(U))
      return !1;
    try {
      return new RegExp(U), !0;
    } catch {
      return !1;
    }
  }
})($i);
var yi = {}, jn = { exports: {} }, Vs = {};
Object.defineProperty(Vs, "__esModule", { value: !0 });
const Ap = kr, kp = Cr, Cp = Dr, Dp = Vr, Va = lt, Lp = [
  Ap.default,
  kp.default,
  (0, Cp.default)(),
  Dp.default,
  Va.metadataVocabulary,
  Va.contentVocabulary
];
Vs.default = Lp;
const Mp = "http://json-schema.org/draft-07/schema#", Vp = "http://json-schema.org/draft-07/schema#", Up = "Core schema meta-schema", zp = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $ref: "#"
    }
  },
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    allOf: [
      {
        $ref: "#/definitions/nonNegativeInteger"
      },
      {
        default: 0
      }
    ]
  },
  simpleTypes: {
    enum: [
      "array",
      "boolean",
      "integer",
      "null",
      "number",
      "object",
      "string"
    ]
  },
  stringArray: {
    type: "array",
    items: {
      type: "string"
    },
    uniqueItems: !0,
    default: []
  }
}, Fp = [
  "object",
  "boolean"
], qp = {
  $id: {
    type: "string",
    format: "uri-reference"
  },
  $schema: {
    type: "string",
    format: "uri"
  },
  $ref: {
    type: "string",
    format: "uri-reference"
  },
  $comment: {
    type: "string"
  },
  title: {
    type: "string"
  },
  description: {
    type: "string"
  },
  default: !0,
  readOnly: {
    type: "boolean",
    default: !1
  },
  examples: {
    type: "array",
    items: !0
  },
  multipleOf: {
    type: "number",
    exclusiveMinimum: 0
  },
  maximum: {
    type: "number"
  },
  exclusiveMaximum: {
    type: "number"
  },
  minimum: {
    type: "number"
  },
  exclusiveMinimum: {
    type: "number"
  },
  maxLength: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  additionalItems: {
    $ref: "#"
  },
  items: {
    anyOf: [
      {
        $ref: "#"
      },
      {
        $ref: "#/definitions/schemaArray"
      }
    ],
    default: !0
  },
  maxItems: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    default: !1
  },
  contains: {
    $ref: "#"
  },
  maxProperties: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/definitions/stringArray"
  },
  additionalProperties: {
    $ref: "#"
  },
  definitions: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  properties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  patternProperties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    propertyNames: {
      format: "regex"
    },
    default: {}
  },
  dependencies: {
    type: "object",
    additionalProperties: {
      anyOf: [
        {
          $ref: "#"
        },
        {
          $ref: "#/definitions/stringArray"
        }
      ]
    }
  },
  propertyNames: {
    $ref: "#"
  },
  const: !0,
  enum: {
    type: "array",
    items: !0,
    minItems: 1,
    uniqueItems: !0
  },
  type: {
    anyOf: [
      {
        $ref: "#/definitions/simpleTypes"
      },
      {
        type: "array",
        items: {
          $ref: "#/definitions/simpleTypes"
        },
        minItems: 1,
        uniqueItems: !0
      }
    ]
  },
  format: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentEncoding: {
    type: "string"
  },
  if: {
    $ref: "#"
  },
  then: {
    $ref: "#"
  },
  else: {
    $ref: "#"
  },
  allOf: {
    $ref: "#/definitions/schemaArray"
  },
  anyOf: {
    $ref: "#/definitions/schemaArray"
  },
  oneOf: {
    $ref: "#/definitions/schemaArray"
  },
  not: {
    $ref: "#"
  }
}, Gp = {
  $schema: Mp,
  $id: Vp,
  title: Up,
  definitions: zp,
  type: Fp,
  properties: qp,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
  const r = zn, n = Vs, s = Ur, a = Gp, o = ["/properties"], l = "http://json-schema.org/draft-07/schema";
  class i extends r.default {
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((E) => this.addVocabulary(E)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const E = this.opts.$data ? this.$dataMetaSchema(a, o) : a;
      this.addMetaSchema(E, l, !1), this.refs["http://json-schema.org/schema"] = l;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(l) ? l : void 0);
    }
  }
  t.Ajv = i, e.exports = t = i, e.exports.Ajv = i, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = i;
  var u = Se;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return u.KeywordCxt;
  } });
  var c = F;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return c._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return c.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return c.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return c.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return c.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return c.CodeGen;
  } });
  var f = Nt;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return f.default;
  } });
  var _ = ut;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return _.default;
  } });
})(jn, jn.exports);
var Kp = jn.exports;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
  const t = Kp, r = F, n = r.operators, s = {
    formatMaximum: { okStr: "<=", ok: n.LTE, fail: n.GT },
    formatMinimum: { okStr: ">=", ok: n.GTE, fail: n.LT },
    formatExclusiveMaximum: { okStr: "<", ok: n.LT, fail: n.GTE },
    formatExclusiveMinimum: { okStr: ">", ok: n.GT, fail: n.LTE }
  }, a = {
    message: ({ keyword: l, schemaCode: i }) => (0, r.str)`should be ${s[l].okStr} ${i}`,
    params: ({ keyword: l, schemaCode: i }) => (0, r._)`{comparison: ${s[l].okStr}, limit: ${i}}`
  };
  e.formatLimitDefinition = {
    keyword: Object.keys(s),
    type: "string",
    schemaType: "string",
    $data: !0,
    error: a,
    code(l) {
      const { gen: i, data: u, schemaCode: c, keyword: f, it: _ } = l, { opts: $, self: E } = _;
      if (!$.validateFormats)
        return;
      const y = new t.KeywordCxt(_, E.RULES.all.format.definition, "format");
      y.$data ? v() : m();
      function v() {
        const R = i.scopeValue("formats", {
          ref: E.formats,
          code: $.code.formats
        }), O = i.const("fmt", (0, r._)`${R}[${y.schemaCode}]`);
        l.fail$data((0, r.or)((0, r._)`typeof ${O} != "object"`, (0, r._)`${O} instanceof RegExp`, (0, r._)`typeof ${O}.compare != "function"`, w(O)));
      }
      function m() {
        const R = y.schema, O = E.formats[R];
        if (!O || O === !0)
          return;
        if (typeof O != "object" || O instanceof RegExp || typeof O.compare != "function")
          throw new Error(`"${f}": format "${R}" does not define "compare" function`);
        const j = i.scopeValue("formats", {
          key: R,
          ref: O,
          code: $.code.formats ? (0, r._)`${$.code.formats}${(0, r.getProperty)(R)}` : void 0
        });
        l.fail$data(w(j));
      }
      function w(R) {
        return (0, r._)`${R}.compare(${u}, ${c}) ${s[f].fail} 0`;
      }
    },
    dependencies: ["format"]
  };
  const o = (l) => (l.addKeyword(e.formatLimitDefinition), l);
  e.default = o;
})(yi);
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 });
  const r = $i, n = yi, s = F, a = new s.Name("fullFormats"), o = new s.Name("fastFormats"), l = (u, c = { keywords: !0 }) => {
    if (Array.isArray(c))
      return i(u, c, r.fullFormats, a), u;
    const [f, _] = c.mode === "fast" ? [r.fastFormats, o] : [r.fullFormats, a], $ = c.formats || r.formatNames;
    return i(u, $, f, _), c.keywords && (0, n.default)(u), u;
  };
  l.get = (u, c = "full") => {
    const _ = (c === "fast" ? r.fastFormats : r.fullFormats)[u];
    if (!_)
      throw new Error(`Unknown format "${u}"`);
    return _;
  };
  function i(u, c, f, _) {
    var $, E;
    ($ = (E = u.opts.code).formats) !== null && $ !== void 0 || (E.formats = (0, s._)`require("ajv-formats/dist/formats").${_}`);
    for (const y of c)
      u.addFormat(y, f[y]);
  }
  e.exports = t = l, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = l;
})(Tn, Tn.exports);
var Hp = Tn.exports;
const Xp = /* @__PURE__ */ ho(Hp), Wp = (e, t, r, n) => {
  if (r === "length" || r === "prototype" || r === "arguments" || r === "caller")
    return;
  const s = Object.getOwnPropertyDescriptor(e, r), a = Object.getOwnPropertyDescriptor(t, r);
  !Bp(s, a) && n || Object.defineProperty(e, r, a);
}, Bp = function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value);
}, Jp = (e, t) => {
  const r = Object.getPrototypeOf(t);
  r !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, r);
}, xp = (e, t) => `/* Wrapped ${e}*/
${t}`, Yp = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), Zp = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), Qp = (e, t, r) => {
  const n = r === "" ? "" : `with ${r.trim()}() `, s = xp.bind(null, n, t.toString());
  Object.defineProperty(s, "name", Zp);
  const { writable: a, enumerable: o, configurable: l } = Yp;
  Object.defineProperty(e, "toString", { value: s, writable: a, enumerable: o, configurable: l });
};
function e$(e, t, { ignoreNonConfigurable: r = !1 } = {}) {
  const { name: n } = e;
  for (const s of Reflect.ownKeys(t))
    Wp(e, t, s, r);
  return Jp(e, t), Qp(e, t, n), e;
}
const Ua = (e, t = {}) => {
  if (typeof e != "function")
    throw new TypeError(`Expected the first argument to be a function, got \`${typeof e}\``);
  const {
    wait: r = 0,
    maxWait: n = Number.POSITIVE_INFINITY,
    before: s = !1,
    after: a = !0
  } = t;
  if (r < 0 || n < 0)
    throw new RangeError("`wait` and `maxWait` must not be negative.");
  if (!s && !a)
    throw new Error("Both `before` and `after` are false, function wouldn't be called.");
  let o, l, i;
  const u = function(...c) {
    const f = this, _ = () => {
      o = void 0, l && (clearTimeout(l), l = void 0), a && (i = e.apply(f, c));
    }, $ = () => {
      l = void 0, o && (clearTimeout(o), o = void 0), a && (i = e.apply(f, c));
    }, E = s && !o;
    return clearTimeout(o), o = setTimeout(_, r), n > 0 && n !== Number.POSITIVE_INFINITY && !l && (l = setTimeout($, n)), E && (i = e.apply(f, c)), i;
  };
  return e$(u, e), u.cancel = () => {
    o && (clearTimeout(o), o = void 0), l && (clearTimeout(l), l = void 0);
  }, u;
};
var An = { exports: {} };
const t$ = "2.0.0", gi = 256, r$ = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, n$ = 16, s$ = gi - 6, a$ = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var Fr = {
  MAX_LENGTH: gi,
  MAX_SAFE_COMPONENT_LENGTH: n$,
  MAX_SAFE_BUILD_LENGTH: s$,
  MAX_SAFE_INTEGER: r$,
  RELEASE_TYPES: a$,
  SEMVER_SPEC_VERSION: t$,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const o$ = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var qr = o$;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: s
  } = Fr, a = qr;
  t = e.exports = {};
  const o = t.re = [], l = t.safeRe = [], i = t.src = [], u = t.safeSrc = [], c = t.t = {};
  let f = 0;
  const _ = "[a-zA-Z0-9-]", $ = [
    ["\\s", 1],
    ["\\d", s],
    [_, n]
  ], E = (v) => {
    for (const [m, w] of $)
      v = v.split(`${m}*`).join(`${m}{0,${w}}`).split(`${m}+`).join(`${m}{1,${w}}`);
    return v;
  }, y = (v, m, w) => {
    const R = E(m), O = f++;
    a(v, O, m), c[v] = O, i[O] = m, u[O] = R, o[O] = new RegExp(m, w ? "g" : void 0), l[O] = new RegExp(R, w ? "g" : void 0);
  };
  y("NUMERICIDENTIFIER", "0|[1-9]\\d*"), y("NUMERICIDENTIFIERLOOSE", "\\d+"), y("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${_}*`), y("MAINVERSION", `(${i[c.NUMERICIDENTIFIER]})\\.(${i[c.NUMERICIDENTIFIER]})\\.(${i[c.NUMERICIDENTIFIER]})`), y("MAINVERSIONLOOSE", `(${i[c.NUMERICIDENTIFIERLOOSE]})\\.(${i[c.NUMERICIDENTIFIERLOOSE]})\\.(${i[c.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASEIDENTIFIER", `(?:${i[c.NONNUMERICIDENTIFIER]}|${i[c.NUMERICIDENTIFIER]})`), y("PRERELEASEIDENTIFIERLOOSE", `(?:${i[c.NONNUMERICIDENTIFIER]}|${i[c.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASE", `(?:-(${i[c.PRERELEASEIDENTIFIER]}(?:\\.${i[c.PRERELEASEIDENTIFIER]})*))`), y("PRERELEASELOOSE", `(?:-?(${i[c.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${i[c.PRERELEASEIDENTIFIERLOOSE]})*))`), y("BUILDIDENTIFIER", `${_}+`), y("BUILD", `(?:\\+(${i[c.BUILDIDENTIFIER]}(?:\\.${i[c.BUILDIDENTIFIER]})*))`), y("FULLPLAIN", `v?${i[c.MAINVERSION]}${i[c.PRERELEASE]}?${i[c.BUILD]}?`), y("FULL", `^${i[c.FULLPLAIN]}$`), y("LOOSEPLAIN", `[v=\\s]*${i[c.MAINVERSIONLOOSE]}${i[c.PRERELEASELOOSE]}?${i[c.BUILD]}?`), y("LOOSE", `^${i[c.LOOSEPLAIN]}$`), y("GTLT", "((?:<|>)?=?)"), y("XRANGEIDENTIFIERLOOSE", `${i[c.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), y("XRANGEIDENTIFIER", `${i[c.NUMERICIDENTIFIER]}|x|X|\\*`), y("XRANGEPLAIN", `[v=\\s]*(${i[c.XRANGEIDENTIFIER]})(?:\\.(${i[c.XRANGEIDENTIFIER]})(?:\\.(${i[c.XRANGEIDENTIFIER]})(?:${i[c.PRERELEASE]})?${i[c.BUILD]}?)?)?`), y("XRANGEPLAINLOOSE", `[v=\\s]*(${i[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${i[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${i[c.XRANGEIDENTIFIERLOOSE]})(?:${i[c.PRERELEASELOOSE]})?${i[c.BUILD]}?)?)?`), y("XRANGE", `^${i[c.GTLT]}\\s*${i[c.XRANGEPLAIN]}$`), y("XRANGELOOSE", `^${i[c.GTLT]}\\s*${i[c.XRANGEPLAINLOOSE]}$`), y("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), y("COERCE", `${i[c.COERCEPLAIN]}(?:$|[^\\d])`), y("COERCEFULL", i[c.COERCEPLAIN] + `(?:${i[c.PRERELEASE]})?(?:${i[c.BUILD]})?(?:$|[^\\d])`), y("COERCERTL", i[c.COERCE], !0), y("COERCERTLFULL", i[c.COERCEFULL], !0), y("LONETILDE", "(?:~>?)"), y("TILDETRIM", `(\\s*)${i[c.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", y("TILDE", `^${i[c.LONETILDE]}${i[c.XRANGEPLAIN]}$`), y("TILDELOOSE", `^${i[c.LONETILDE]}${i[c.XRANGEPLAINLOOSE]}$`), y("LONECARET", "(?:\\^)"), y("CARETTRIM", `(\\s*)${i[c.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", y("CARET", `^${i[c.LONECARET]}${i[c.XRANGEPLAIN]}$`), y("CARETLOOSE", `^${i[c.LONECARET]}${i[c.XRANGEPLAINLOOSE]}$`), y("COMPARATORLOOSE", `^${i[c.GTLT]}\\s*(${i[c.LOOSEPLAIN]})$|^$`), y("COMPARATOR", `^${i[c.GTLT]}\\s*(${i[c.FULLPLAIN]})$|^$`), y("COMPARATORTRIM", `(\\s*)${i[c.GTLT]}\\s*(${i[c.LOOSEPLAIN]}|${i[c.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", y("HYPHENRANGE", `^\\s*(${i[c.XRANGEPLAIN]})\\s+-\\s+(${i[c.XRANGEPLAIN]})\\s*$`), y("HYPHENRANGELOOSE", `^\\s*(${i[c.XRANGEPLAINLOOSE]})\\s+-\\s+(${i[c.XRANGEPLAINLOOSE]})\\s*$`), y("STAR", "(<|>)?=?\\s*\\*"), y("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), y("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(An, An.exports);
var tr = An.exports;
const i$ = Object.freeze({ loose: !0 }), c$ = Object.freeze({}), l$ = (e) => e ? typeof e != "object" ? i$ : e : c$;
var Us = l$;
const za = /^[0-9]+$/, vi = (e, t) => {
  const r = za.test(e), n = za.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, u$ = (e, t) => vi(t, e);
var _i = {
  compareIdentifiers: vi,
  rcompareIdentifiers: u$
};
const lr = qr, { MAX_LENGTH: Fa, MAX_SAFE_INTEGER: ur } = Fr, { safeRe: dr, t: fr } = tr, d$ = Us, { compareIdentifiers: mt } = _i;
let f$ = class Ae {
  constructor(t, r) {
    if (r = d$(r), t instanceof Ae) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > Fa)
      throw new TypeError(
        `version is longer than ${Fa} characters`
      );
    lr("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? dr[fr.LOOSE] : dr[fr.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > ur || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > ur || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > ur || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((s) => {
      if (/^[0-9]+$/.test(s)) {
        const a = +s;
        if (a >= 0 && a < ur)
          return a;
      }
      return s;
    }) : this.prerelease = [], this.build = n[5] ? n[5].split(".") : [], this.format();
  }
  format() {
    return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
  }
  toString() {
    return this.version;
  }
  compare(t) {
    if (lr("SemVer.compare", this.version, this.options, t), !(t instanceof Ae)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new Ae(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof Ae || (t = new Ae(t, this.options)), mt(this.major, t.major) || mt(this.minor, t.minor) || mt(this.patch, t.patch);
  }
  comparePre(t) {
    if (t instanceof Ae || (t = new Ae(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], s = t.prerelease[r];
      if (lr("prerelease compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return mt(n, s);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof Ae || (t = new Ae(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], s = t.build[r];
      if (lr("build compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return mt(n, s);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const s = `-${r}`.match(this.options.loose ? dr[fr.PRERELEASELOOSE] : dr[fr.PRERELEASE]);
        if (!s || s[1] !== r)
          throw new Error(`invalid identifier: ${r}`);
      }
    }
    switch (t) {
      case "premajor":
        this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", r, n);
        break;
      case "preminor":
        this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", r, n);
        break;
      case "prepatch":
        this.prerelease.length = 0, this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "prerelease":
        this.prerelease.length === 0 && this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "release":
        if (this.prerelease.length === 0)
          throw new Error(`version ${this.raw} is not a prerelease`);
        this.prerelease.length = 0;
        break;
      case "major":
        (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
        break;
      case "minor":
        (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
        break;
      case "patch":
        this.prerelease.length === 0 && this.patch++, this.prerelease = [];
        break;
      case "pre": {
        const s = Number(n) ? 1 : 0;
        if (this.prerelease.length === 0)
          this.prerelease = [s];
        else {
          let a = this.prerelease.length;
          for (; --a >= 0; )
            typeof this.prerelease[a] == "number" && (this.prerelease[a]++, a = -2);
          if (a === -1) {
            if (r === this.prerelease.join(".") && n === !1)
              throw new Error("invalid increment argument: identifier already exists");
            this.prerelease.push(s);
          }
        }
        if (r) {
          let a = [r, s];
          n === !1 && (a = [r]), mt(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = a) : this.prerelease = a;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var $e = f$;
const qa = $e, h$ = (e, t, r = !1) => {
  if (e instanceof qa)
    return e;
  try {
    return new qa(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var kt = h$;
const m$ = kt, p$ = (e, t) => {
  const r = m$(e, t);
  return r ? r.version : null;
};
var $$ = p$;
const y$ = kt, g$ = (e, t) => {
  const r = y$(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var v$ = g$;
const Ga = $e, _$ = (e, t, r, n, s) => {
  typeof r == "string" && (s = n, n = r, r = void 0);
  try {
    return new Ga(
      e instanceof Ga ? e.version : e,
      r
    ).inc(t, n, s).version;
  } catch {
    return null;
  }
};
var E$ = _$;
const Ka = kt, w$ = (e, t) => {
  const r = Ka(e, null, !0), n = Ka(t, null, !0), s = r.compare(n);
  if (s === 0)
    return null;
  const a = s > 0, o = a ? r : n, l = a ? n : r, i = !!o.prerelease.length;
  if (!!l.prerelease.length && !i) {
    if (!l.patch && !l.minor)
      return "major";
    if (l.compareMain(o) === 0)
      return l.minor && !l.patch ? "minor" : "patch";
  }
  const c = i ? "pre" : "";
  return r.major !== n.major ? c + "major" : r.minor !== n.minor ? c + "minor" : r.patch !== n.patch ? c + "patch" : "prerelease";
};
var b$ = w$;
const S$ = $e, P$ = (e, t) => new S$(e, t).major;
var R$ = P$;
const I$ = $e, N$ = (e, t) => new I$(e, t).minor;
var O$ = N$;
const T$ = $e, j$ = (e, t) => new T$(e, t).patch;
var A$ = j$;
const k$ = kt, C$ = (e, t) => {
  const r = k$(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var D$ = C$;
const Ha = $e, L$ = (e, t, r) => new Ha(e, r).compare(new Ha(t, r));
var Te = L$;
const M$ = Te, V$ = (e, t, r) => M$(t, e, r);
var U$ = V$;
const z$ = Te, F$ = (e, t) => z$(e, t, !0);
var q$ = F$;
const Xa = $e, G$ = (e, t, r) => {
  const n = new Xa(e, r), s = new Xa(t, r);
  return n.compare(s) || n.compareBuild(s);
};
var zs = G$;
const K$ = zs, H$ = (e, t) => e.sort((r, n) => K$(r, n, t));
var X$ = H$;
const W$ = zs, B$ = (e, t) => e.sort((r, n) => W$(n, r, t));
var J$ = B$;
const x$ = Te, Y$ = (e, t, r) => x$(e, t, r) > 0;
var Gr = Y$;
const Z$ = Te, Q$ = (e, t, r) => Z$(e, t, r) < 0;
var Fs = Q$;
const ey = Te, ty = (e, t, r) => ey(e, t, r) === 0;
var Ei = ty;
const ry = Te, ny = (e, t, r) => ry(e, t, r) !== 0;
var wi = ny;
const sy = Te, ay = (e, t, r) => sy(e, t, r) >= 0;
var qs = ay;
const oy = Te, iy = (e, t, r) => oy(e, t, r) <= 0;
var Gs = iy;
const cy = Ei, ly = wi, uy = Gr, dy = qs, fy = Fs, hy = Gs, my = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return cy(e, r, n);
    case "!=":
      return ly(e, r, n);
    case ">":
      return uy(e, r, n);
    case ">=":
      return dy(e, r, n);
    case "<":
      return fy(e, r, n);
    case "<=":
      return hy(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var bi = my;
const py = $e, $y = kt, { safeRe: hr, t: mr } = tr, yy = (e, t) => {
  if (e instanceof py)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? hr[mr.COERCEFULL] : hr[mr.COERCE]);
  else {
    const i = t.includePrerelease ? hr[mr.COERCERTLFULL] : hr[mr.COERCERTL];
    let u;
    for (; (u = i.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || u.index + u[0].length !== r.index + r[0].length) && (r = u), i.lastIndex = u.index + u[1].length + u[2].length;
    i.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], s = r[3] || "0", a = r[4] || "0", o = t.includePrerelease && r[5] ? `-${r[5]}` : "", l = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return $y(`${n}.${s}.${a}${o}${l}`, t);
};
var gy = yy;
class vy {
  constructor() {
    this.max = 1e3, this.map = /* @__PURE__ */ new Map();
  }
  get(t) {
    const r = this.map.get(t);
    if (r !== void 0)
      return this.map.delete(t), this.map.set(t, r), r;
  }
  delete(t) {
    return this.map.delete(t);
  }
  set(t, r) {
    if (!this.delete(t) && r !== void 0) {
      if (this.map.size >= this.max) {
        const s = this.map.keys().next().value;
        this.delete(s);
      }
      this.map.set(t, r);
    }
    return this;
  }
}
var _y = vy, pn, Wa;
function je() {
  if (Wa) return pn;
  Wa = 1;
  const e = /\s+/g;
  class t {
    constructor(N, C) {
      if (C = s(C), N instanceof t)
        return N.loose === !!C.loose && N.includePrerelease === !!C.includePrerelease ? N : new t(N.raw, C);
      if (N instanceof a)
        return this.raw = N.value, this.set = [[N]], this.formatted = void 0, this;
      if (this.options = C, this.loose = !!C.loose, this.includePrerelease = !!C.includePrerelease, this.raw = N.trim().replace(e, " "), this.set = this.raw.split("||").map((A) => this.parseRange(A.trim())).filter((A) => A.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const A = this.set[0];
        if (this.set = this.set.filter((V) => !y(V[0])), this.set.length === 0)
          this.set = [A];
        else if (this.set.length > 1) {
          for (const V of this.set)
            if (V.length === 1 && v(V[0])) {
              this.set = [V];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let N = 0; N < this.set.length; N++) {
          N > 0 && (this.formatted += "||");
          const C = this.set[N];
          for (let A = 0; A < C.length; A++)
            A > 0 && (this.formatted += " "), this.formatted += C[A].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(N) {
      const A = ((this.options.includePrerelease && $) | (this.options.loose && E)) + ":" + N, V = n.get(A);
      if (V)
        return V;
      const k = this.options.loose, P = k ? i[u.HYPHENRANGELOOSE] : i[u.HYPHENRANGE];
      N = N.replace(P, q(this.options.includePrerelease)), o("hyphen replace", N), N = N.replace(i[u.COMPARATORTRIM], c), o("comparator trim", N), N = N.replace(i[u.TILDETRIM], f), o("tilde trim", N), N = N.replace(i[u.CARETTRIM], _), o("caret trim", N);
      let p = N.split(" ").map((h) => w(h, this.options)).join(" ").split(/\s+/).map((h) => U(h, this.options));
      k && (p = p.filter((h) => (o("loose invalid filter", h, this.options), !!h.match(i[u.COMPARATORLOOSE])))), o("range list", p);
      const b = /* @__PURE__ */ new Map(), g = p.map((h) => new a(h, this.options));
      for (const h of g) {
        if (y(h))
          return [h];
        b.set(h.value, h);
      }
      b.size > 1 && b.has("") && b.delete("");
      const d = [...b.values()];
      return n.set(A, d), d;
    }
    intersects(N, C) {
      if (!(N instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((A) => m(A, C) && N.set.some((V) => m(V, C) && A.every((k) => V.every((P) => k.intersects(P, C)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(N) {
      if (!N)
        return !1;
      if (typeof N == "string")
        try {
          N = new l(N, this.options);
        } catch {
          return !1;
        }
      for (let C = 0; C < this.set.length; C++)
        if (Y(this.set[C], N, this.options))
          return !0;
      return !1;
    }
  }
  pn = t;
  const r = _y, n = new r(), s = Us, a = Kr(), o = qr, l = $e, {
    safeRe: i,
    t: u,
    comparatorTrimReplace: c,
    tildeTrimReplace: f,
    caretTrimReplace: _
  } = tr, { FLAG_INCLUDE_PRERELEASE: $, FLAG_LOOSE: E } = Fr, y = (I) => I.value === "<0.0.0-0", v = (I) => I.value === "", m = (I, N) => {
    let C = !0;
    const A = I.slice();
    let V = A.pop();
    for (; C && A.length; )
      C = A.every((k) => V.intersects(k, N)), V = A.pop();
    return C;
  }, w = (I, N) => (o("comp", I, N), I = B(I, N), o("caret", I), I = O(I, N), o("tildes", I), I = ye(I, N), o("xrange", I), I = Pe(I, N), o("stars", I), I), R = (I) => !I || I.toLowerCase() === "x" || I === "*", O = (I, N) => I.trim().split(/\s+/).map((C) => j(C, N)).join(" "), j = (I, N) => {
    const C = N.loose ? i[u.TILDELOOSE] : i[u.TILDE];
    return I.replace(C, (A, V, k, P, p) => {
      o("tilde", I, A, V, k, P, p);
      let b;
      return R(V) ? b = "" : R(k) ? b = `>=${V}.0.0 <${+V + 1}.0.0-0` : R(P) ? b = `>=${V}.${k}.0 <${V}.${+k + 1}.0-0` : p ? (o("replaceTilde pr", p), b = `>=${V}.${k}.${P}-${p} <${V}.${+k + 1}.0-0`) : b = `>=${V}.${k}.${P} <${V}.${+k + 1}.0-0`, o("tilde return", b), b;
    });
  }, B = (I, N) => I.trim().split(/\s+/).map((C) => te(C, N)).join(" "), te = (I, N) => {
    o("caret", I, N);
    const C = N.loose ? i[u.CARETLOOSE] : i[u.CARET], A = N.includePrerelease ? "-0" : "";
    return I.replace(C, (V, k, P, p, b) => {
      o("caret", I, V, k, P, p, b);
      let g;
      return R(k) ? g = "" : R(P) ? g = `>=${k}.0.0${A} <${+k + 1}.0.0-0` : R(p) ? k === "0" ? g = `>=${k}.${P}.0${A} <${k}.${+P + 1}.0-0` : g = `>=${k}.${P}.0${A} <${+k + 1}.0.0-0` : b ? (o("replaceCaret pr", b), k === "0" ? P === "0" ? g = `>=${k}.${P}.${p}-${b} <${k}.${P}.${+p + 1}-0` : g = `>=${k}.${P}.${p}-${b} <${k}.${+P + 1}.0-0` : g = `>=${k}.${P}.${p}-${b} <${+k + 1}.0.0-0`) : (o("no pr"), k === "0" ? P === "0" ? g = `>=${k}.${P}.${p}${A} <${k}.${P}.${+p + 1}-0` : g = `>=${k}.${P}.${p}${A} <${k}.${+P + 1}.0-0` : g = `>=${k}.${P}.${p} <${+k + 1}.0.0-0`), o("caret return", g), g;
    });
  }, ye = (I, N) => (o("replaceXRanges", I, N), I.split(/\s+/).map((C) => we(C, N)).join(" ")), we = (I, N) => {
    I = I.trim();
    const C = N.loose ? i[u.XRANGELOOSE] : i[u.XRANGE];
    return I.replace(C, (A, V, k, P, p, b) => {
      o("xRange", I, A, V, k, P, p, b);
      const g = R(k), d = g || R(P), h = d || R(p), S = h;
      return V === "=" && S && (V = ""), b = N.includePrerelease ? "-0" : "", g ? V === ">" || V === "<" ? A = "<0.0.0-0" : A = "*" : V && S ? (d && (P = 0), p = 0, V === ">" ? (V = ">=", d ? (k = +k + 1, P = 0, p = 0) : (P = +P + 1, p = 0)) : V === "<=" && (V = "<", d ? k = +k + 1 : P = +P + 1), V === "<" && (b = "-0"), A = `${V + k}.${P}.${p}${b}`) : d ? A = `>=${k}.0.0${b} <${+k + 1}.0.0-0` : h && (A = `>=${k}.${P}.0${b} <${k}.${+P + 1}.0-0`), o("xRange return", A), A;
    });
  }, Pe = (I, N) => (o("replaceStars", I, N), I.trim().replace(i[u.STAR], "")), U = (I, N) => (o("replaceGTE0", I, N), I.trim().replace(i[N.includePrerelease ? u.GTE0PRE : u.GTE0], "")), q = (I) => (N, C, A, V, k, P, p, b, g, d, h, S) => (R(A) ? C = "" : R(V) ? C = `>=${A}.0.0${I ? "-0" : ""}` : R(k) ? C = `>=${A}.${V}.0${I ? "-0" : ""}` : P ? C = `>=${C}` : C = `>=${C}${I ? "-0" : ""}`, R(g) ? b = "" : R(d) ? b = `<${+g + 1}.0.0-0` : R(h) ? b = `<${g}.${+d + 1}.0-0` : S ? b = `<=${g}.${d}.${h}-${S}` : I ? b = `<${g}.${d}.${+h + 1}-0` : b = `<=${b}`, `${C} ${b}`.trim()), Y = (I, N, C) => {
    for (let A = 0; A < I.length; A++)
      if (!I[A].test(N))
        return !1;
    if (N.prerelease.length && !C.includePrerelease) {
      for (let A = 0; A < I.length; A++)
        if (o(I[A].semver), I[A].semver !== a.ANY && I[A].semver.prerelease.length > 0) {
          const V = I[A].semver;
          if (V.major === N.major && V.minor === N.minor && V.patch === N.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return pn;
}
var $n, Ba;
function Kr() {
  if (Ba) return $n;
  Ba = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(c, f) {
      if (f = r(f), c instanceof t) {
        if (c.loose === !!f.loose)
          return c;
        c = c.value;
      }
      c = c.trim().split(/\s+/).join(" "), o("comparator", c, f), this.options = f, this.loose = !!f.loose, this.parse(c), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, o("comp", this);
    }
    parse(c) {
      const f = this.options.loose ? n[s.COMPARATORLOOSE] : n[s.COMPARATOR], _ = c.match(f);
      if (!_)
        throw new TypeError(`Invalid comparator: ${c}`);
      this.operator = _[1] !== void 0 ? _[1] : "", this.operator === "=" && (this.operator = ""), _[2] ? this.semver = new l(_[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(c) {
      if (o("Comparator.test", c, this.options.loose), this.semver === e || c === e)
        return !0;
      if (typeof c == "string")
        try {
          c = new l(c, this.options);
        } catch {
          return !1;
        }
      return a(c, this.operator, this.semver, this.options);
    }
    intersects(c, f) {
      if (!(c instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new i(c.value, f).test(this.value) : c.operator === "" ? c.value === "" ? !0 : new i(this.value, f).test(c.semver) : (f = r(f), f.includePrerelease && (this.value === "<0.0.0-0" || c.value === "<0.0.0-0") || !f.includePrerelease && (this.value.startsWith("<0.0.0") || c.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && c.operator.startsWith(">") || this.operator.startsWith("<") && c.operator.startsWith("<") || this.semver.version === c.semver.version && this.operator.includes("=") && c.operator.includes("=") || a(this.semver, "<", c.semver, f) && this.operator.startsWith(">") && c.operator.startsWith("<") || a(this.semver, ">", c.semver, f) && this.operator.startsWith("<") && c.operator.startsWith(">")));
    }
  }
  $n = t;
  const r = Us, { safeRe: n, t: s } = tr, a = bi, o = qr, l = $e, i = je();
  return $n;
}
const Ey = je(), wy = (e, t, r) => {
  try {
    t = new Ey(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var Hr = wy;
const by = je(), Sy = (e, t) => new by(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var Py = Sy;
const Ry = $e, Iy = je(), Ny = (e, t, r) => {
  let n = null, s = null, a = null;
  try {
    a = new Iy(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    a.test(o) && (!n || s.compare(o) === -1) && (n = o, s = new Ry(n, r));
  }), n;
};
var Oy = Ny;
const Ty = $e, jy = je(), Ay = (e, t, r) => {
  let n = null, s = null, a = null;
  try {
    a = new jy(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    a.test(o) && (!n || s.compare(o) === 1) && (n = o, s = new Ty(n, r));
  }), n;
};
var ky = Ay;
const yn = $e, Cy = je(), Ja = Gr, Dy = (e, t) => {
  e = new Cy(e, t);
  let r = new yn("0.0.0");
  if (e.test(r) || (r = new yn("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const s = e.set[n];
    let a = null;
    s.forEach((o) => {
      const l = new yn(o.semver.version);
      switch (o.operator) {
        case ">":
          l.prerelease.length === 0 ? l.patch++ : l.prerelease.push(0), l.raw = l.format();
        case "":
        case ">=":
          (!a || Ja(l, a)) && (a = l);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${o.operator}`);
      }
    }), a && (!r || Ja(r, a)) && (r = a);
  }
  return r && e.test(r) ? r : null;
};
var Ly = Dy;
const My = je(), Vy = (e, t) => {
  try {
    return new My(e, t).range || "*";
  } catch {
    return null;
  }
};
var Uy = Vy;
const zy = $e, Si = Kr(), { ANY: Fy } = Si, qy = je(), Gy = Hr, xa = Gr, Ya = Fs, Ky = Gs, Hy = qs, Xy = (e, t, r, n) => {
  e = new zy(e, n), t = new qy(t, n);
  let s, a, o, l, i;
  switch (r) {
    case ">":
      s = xa, a = Ky, o = Ya, l = ">", i = ">=";
      break;
    case "<":
      s = Ya, a = Hy, o = xa, l = "<", i = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (Gy(e, t, n))
    return !1;
  for (let u = 0; u < t.set.length; ++u) {
    const c = t.set[u];
    let f = null, _ = null;
    if (c.forEach(($) => {
      $.semver === Fy && ($ = new Si(">=0.0.0")), f = f || $, _ = _ || $, s($.semver, f.semver, n) ? f = $ : o($.semver, _.semver, n) && (_ = $);
    }), f.operator === l || f.operator === i || (!_.operator || _.operator === l) && a(e, _.semver))
      return !1;
    if (_.operator === i && o(e, _.semver))
      return !1;
  }
  return !0;
};
var Ks = Xy;
const Wy = Ks, By = (e, t, r) => Wy(e, t, ">", r);
var Jy = By;
const xy = Ks, Yy = (e, t, r) => xy(e, t, "<", r);
var Zy = Yy;
const Za = je(), Qy = (e, t, r) => (e = new Za(e, r), t = new Za(t, r), e.intersects(t, r));
var e0 = Qy;
const t0 = Hr, r0 = Te;
var n0 = (e, t, r) => {
  const n = [];
  let s = null, a = null;
  const o = e.sort((c, f) => r0(c, f, r));
  for (const c of o)
    t0(c, t, r) ? (a = c, s || (s = c)) : (a && n.push([s, a]), a = null, s = null);
  s && n.push([s, null]);
  const l = [];
  for (const [c, f] of n)
    c === f ? l.push(c) : !f && c === o[0] ? l.push("*") : f ? c === o[0] ? l.push(`<=${f}`) : l.push(`${c} - ${f}`) : l.push(`>=${c}`);
  const i = l.join(" || "), u = typeof t.raw == "string" ? t.raw : String(t);
  return i.length < u.length ? i : t;
};
const Qa = je(), Hs = Kr(), { ANY: gn } = Hs, Ft = Hr, Xs = Te, s0 = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new Qa(e, r), t = new Qa(t, r);
  let n = !1;
  e: for (const s of e.set) {
    for (const a of t.set) {
      const o = o0(s, a, r);
      if (n = n || o !== null, o)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, a0 = [new Hs(">=0.0.0-0")], eo = [new Hs(">=0.0.0")], o0 = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === gn) {
    if (t.length === 1 && t[0].semver === gn)
      return !0;
    r.includePrerelease ? e = a0 : e = eo;
  }
  if (t.length === 1 && t[0].semver === gn) {
    if (r.includePrerelease)
      return !0;
    t = eo;
  }
  const n = /* @__PURE__ */ new Set();
  let s, a;
  for (const $ of e)
    $.operator === ">" || $.operator === ">=" ? s = to(s, $, r) : $.operator === "<" || $.operator === "<=" ? a = ro(a, $, r) : n.add($.semver);
  if (n.size > 1)
    return null;
  let o;
  if (s && a) {
    if (o = Xs(s.semver, a.semver, r), o > 0)
      return null;
    if (o === 0 && (s.operator !== ">=" || a.operator !== "<="))
      return null;
  }
  for (const $ of n) {
    if (s && !Ft($, String(s), r) || a && !Ft($, String(a), r))
      return null;
    for (const E of t)
      if (!Ft($, String(E), r))
        return !1;
    return !0;
  }
  let l, i, u, c, f = a && !r.includePrerelease && a.semver.prerelease.length ? a.semver : !1, _ = s && !r.includePrerelease && s.semver.prerelease.length ? s.semver : !1;
  f && f.prerelease.length === 1 && a.operator === "<" && f.prerelease[0] === 0 && (f = !1);
  for (const $ of t) {
    if (c = c || $.operator === ">" || $.operator === ">=", u = u || $.operator === "<" || $.operator === "<=", s) {
      if (_ && $.semver.prerelease && $.semver.prerelease.length && $.semver.major === _.major && $.semver.minor === _.minor && $.semver.patch === _.patch && (_ = !1), $.operator === ">" || $.operator === ">=") {
        if (l = to(s, $, r), l === $ && l !== s)
          return !1;
      } else if (s.operator === ">=" && !Ft(s.semver, String($), r))
        return !1;
    }
    if (a) {
      if (f && $.semver.prerelease && $.semver.prerelease.length && $.semver.major === f.major && $.semver.minor === f.minor && $.semver.patch === f.patch && (f = !1), $.operator === "<" || $.operator === "<=") {
        if (i = ro(a, $, r), i === $ && i !== a)
          return !1;
      } else if (a.operator === "<=" && !Ft(a.semver, String($), r))
        return !1;
    }
    if (!$.operator && (a || s) && o !== 0)
      return !1;
  }
  return !(s && u && !a && o !== 0 || a && c && !s && o !== 0 || _ || f);
}, to = (e, t, r) => {
  if (!e)
    return t;
  const n = Xs(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, ro = (e, t, r) => {
  if (!e)
    return t;
  const n = Xs(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var i0 = s0;
const vn = tr, no = Fr, c0 = $e, so = _i, l0 = kt, u0 = $$, d0 = v$, f0 = E$, h0 = b$, m0 = R$, p0 = O$, $0 = A$, y0 = D$, g0 = Te, v0 = U$, _0 = q$, E0 = zs, w0 = X$, b0 = J$, S0 = Gr, P0 = Fs, R0 = Ei, I0 = wi, N0 = qs, O0 = Gs, T0 = bi, j0 = gy, A0 = Kr(), k0 = je(), C0 = Hr, D0 = Py, L0 = Oy, M0 = ky, V0 = Ly, U0 = Uy, z0 = Ks, F0 = Jy, q0 = Zy, G0 = e0, K0 = n0, H0 = i0;
var X0 = {
  parse: l0,
  valid: u0,
  clean: d0,
  inc: f0,
  diff: h0,
  major: m0,
  minor: p0,
  patch: $0,
  prerelease: y0,
  compare: g0,
  rcompare: v0,
  compareLoose: _0,
  compareBuild: E0,
  sort: w0,
  rsort: b0,
  gt: S0,
  lt: P0,
  eq: R0,
  neq: I0,
  gte: N0,
  lte: O0,
  cmp: T0,
  coerce: j0,
  Comparator: A0,
  Range: k0,
  satisfies: C0,
  toComparators: D0,
  maxSatisfying: L0,
  minSatisfying: M0,
  minVersion: V0,
  validRange: U0,
  outside: z0,
  gtr: F0,
  ltr: q0,
  intersects: G0,
  simplifyRange: K0,
  subset: H0,
  SemVer: c0,
  re: vn.re,
  src: vn.src,
  tokens: vn.t,
  SEMVER_SPEC_VERSION: no.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: no.RELEASE_TYPES,
  compareIdentifiers: so.compareIdentifiers,
  rcompareIdentifiers: so.rcompareIdentifiers
};
const pt = /* @__PURE__ */ ho(X0), W0 = Object.prototype.toString, B0 = "[object Uint8Array]", J0 = "[object ArrayBuffer]";
function Pi(e, t, r) {
  return e ? e.constructor === t ? !0 : W0.call(e) === r : !1;
}
function Ri(e) {
  return Pi(e, Uint8Array, B0);
}
function x0(e) {
  return Pi(e, ArrayBuffer, J0);
}
function Y0(e) {
  return Ri(e) || x0(e);
}
function Z0(e) {
  if (!Ri(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
function Q0(e) {
  if (!Y0(e))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof e}\``);
}
function ao(e, t) {
  if (e.length === 0)
    return new Uint8Array(0);
  t ?? (t = e.reduce((s, a) => s + a.length, 0));
  const r = new Uint8Array(t);
  let n = 0;
  for (const s of e)
    Z0(s), r.set(s, n), n += s.length;
  return r;
}
const pr = {
  utf8: new globalThis.TextDecoder("utf8")
};
function oo(e, t = "utf8") {
  return Q0(e), pr[t] ?? (pr[t] = new globalThis.TextDecoder(t)), pr[t].decode(e);
}
function eg(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
const tg = new globalThis.TextEncoder();
function _n(e) {
  return eg(e), tg.encode(e);
}
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
const rg = Xp.default, io = "aes-256-cbc", $t = () => /* @__PURE__ */ Object.create(null), ng = (e) => e != null, sg = (e, t) => {
  const r = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), n = typeof t;
  if (r.has(n))
    throw new TypeError(`Setting a value of type \`${n}\` for key \`${e}\` is not allowed as it's not supported by JSON`);
}, Er = "__internal__", En = `${Er}.migrations.version`;
var Ye, Me, _e, Ve;
class ag {
  constructor(t = {}) {
    Dt(this, "path");
    Dt(this, "events");
    Lt(this, Ye);
    Lt(this, Me);
    Lt(this, _e);
    Lt(this, Ve, {});
    Dt(this, "_deserialize", (t) => JSON.parse(t));
    Dt(this, "_serialize", (t) => JSON.stringify(t, void 0, "	"));
    const r = {
      configName: "config",
      fileExtension: "json",
      projectSuffix: "nodejs",
      clearInvalidConfig: !1,
      accessPropertiesByDotNotation: !0,
      configFileMode: 438,
      ...t
    };
    if (!r.cwd) {
      if (!r.projectName)
        throw new Error("Please specify the `projectName` option.");
      r.cwd = bc(r.projectName, { suffix: r.projectSuffix }).config;
    }
    if (Mt(this, _e, r), r.schema ?? r.ajvOptions ?? r.rootSchema) {
      if (r.schema && typeof r.schema != "object")
        throw new TypeError("The `schema` option must be an object.");
      const o = new jp.Ajv2020({
        allErrors: !0,
        useDefaults: !0,
        ...r.ajvOptions
      });
      rg(o);
      const l = {
        ...r.rootSchema,
        type: "object",
        properties: r.schema
      };
      Mt(this, Ye, o.compile(l));
      for (const [i, u] of Object.entries(r.schema ?? {}))
        u != null && u.default && (Q(this, Ve)[i] = u.default);
    }
    r.defaults && Mt(this, Ve, {
      ...Q(this, Ve),
      ...r.defaults
    }), r.serialize && (this._serialize = r.serialize), r.deserialize && (this._deserialize = r.deserialize), this.events = new EventTarget(), Mt(this, Me, r.encryptionKey);
    const n = r.fileExtension ? `.${r.fileExtension}` : "";
    this.path = X.resolve(r.cwd, `${r.configName ?? "config"}${n}`);
    const s = this.store, a = Object.assign($t(), r.defaults, s);
    if (r.migrations) {
      if (!r.projectVersion)
        throw new Error("Please specify the `projectVersion` option.");
      this._migrate(r.migrations, r.projectVersion, r.beforeEachMigration);
    }
    this._validate(a);
    try {
      fo.deepEqual(s, a);
    } catch {
      this.store = a;
    }
    r.watch && this._watch();
  }
  get(t, r) {
    if (Q(this, _e).accessPropertiesByDotNotation)
      return this._get(t, r);
    const { store: n } = this;
    return t in n ? n[t] : r;
  }
  set(t, r) {
    if (typeof t != "string" && typeof t != "object")
      throw new TypeError(`Expected \`key\` to be of type \`string\` or \`object\`, got ${typeof t}`);
    if (typeof t != "object" && r === void 0)
      throw new TypeError("Use `delete()` to clear values");
    if (this._containsReservedKey(t))
      throw new TypeError(`Please don't use the ${Er} key, as it's used to manage this module internal operations.`);
    const { store: n } = this, s = (a, o) => {
      sg(a, o), Q(this, _e).accessPropertiesByDotNotation ? ra(n, a, o) : n[a] = o;
    };
    if (typeof t == "object") {
      const a = t;
      for (const [o, l] of Object.entries(a))
        s(o, l);
    } else
      s(t, r);
    this.store = n;
  }
  /**
      Check if an item exists.
  
      @param key - The key of the item to check.
      */
  has(t) {
    return Q(this, _e).accessPropertiesByDotNotation ? vc(this.store, t) : t in this.store;
  }
  /**
      Reset items to their default values, as defined by the `defaults` or `schema` option.
  
      @see `clear()` to reset all items.
  
      @param keys - The keys of the items to reset.
      */
  reset(...t) {
    for (const r of t)
      ng(Q(this, Ve)[r]) && this.set(r, Q(this, Ve)[r]);
  }
  delete(t) {
    const { store: r } = this;
    Q(this, _e).accessPropertiesByDotNotation ? gc(r, t) : delete r[t], this.store = r;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    this.store = $t();
    for (const t of Object.keys(Q(this, Ve)))
      this.reset(t);
  }
  /**
      Watches the given `key`, calling `callback` on any changes.
  
      @param key - The key to watch.
      @param callback - A callback function that is called on any changes. When a `key` is first set `oldValue` will be `undefined`, and when a key is deleted `newValue` will be `undefined`.
      @returns A function, that when called, will unsubscribe.
      */
  onDidChange(t, r) {
    if (typeof t != "string")
      throw new TypeError(`Expected \`key\` to be of type \`string\`, got ${typeof t}`);
    if (typeof r != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof r}`);
    return this._handleChange(() => this.get(t), r);
  }
  /**
      Watches the whole config object, calling `callback` on any changes.
  
      @param callback - A callback function that is called on any changes. When a `key` is first set `oldValue` will be `undefined`, and when a key is deleted `newValue` will be `undefined`.
      @returns A function, that when called, will unsubscribe.
      */
  onDidAnyChange(t) {
    if (typeof t != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof t}`);
    return this._handleChange(() => this.store, t);
  }
  get size() {
    return Object.keys(this.store).length;
  }
  get store() {
    try {
      const t = G.readFileSync(this.path, Q(this, Me) ? null : "utf8"), r = this._encryptData(t), n = this._deserialize(r);
      return this._validate(n), Object.assign($t(), n);
    } catch (t) {
      if ((t == null ? void 0 : t.code) === "ENOENT")
        return this._ensureDirectory(), $t();
      if (Q(this, _e).clearInvalidConfig && t.name === "SyntaxError")
        return $t();
      throw t;
    }
  }
  set store(t) {
    this._ensureDirectory(), this._validate(t), this._write(t), this.events.dispatchEvent(new Event("change"));
  }
  *[Symbol.iterator]() {
    for (const [t, r] of Object.entries(this.store))
      yield [t, r];
  }
  _encryptData(t) {
    if (!Q(this, Me))
      return typeof t == "string" ? t : oo(t);
    try {
      const r = t.slice(0, 16), n = Vt.pbkdf2Sync(Q(this, Me), r.toString(), 1e4, 32, "sha512"), s = Vt.createDecipheriv(io, n, r), a = t.slice(17), o = typeof a == "string" ? _n(a) : a;
      return oo(ao([s.update(o), s.final()]));
    } catch {
    }
    return t.toString();
  }
  _handleChange(t, r) {
    let n = t();
    const s = () => {
      const a = n, o = t();
      Di(o, a) || (n = o, r.call(this, o, a));
    };
    return this.events.addEventListener("change", s), () => {
      this.events.removeEventListener("change", s);
    };
  }
  _validate(t) {
    if (!Q(this, Ye) || Q(this, Ye).call(this, t) || !Q(this, Ye).errors)
      return;
    const n = Q(this, Ye).errors.map(({ instancePath: s, message: a = "" }) => `\`${s.slice(1)}\` ${a}`);
    throw new Error("Config schema violation: " + n.join("; "));
  }
  _ensureDirectory() {
    G.mkdirSync(X.dirname(this.path), { recursive: !0 });
  }
  _write(t) {
    let r = this._serialize(t);
    if (Q(this, Me)) {
      const n = Vt.randomBytes(16), s = Vt.pbkdf2Sync(Q(this, Me), n.toString(), 1e4, 32, "sha512"), a = Vt.createCipheriv(io, s, n);
      r = ao([n, _n(":"), a.update(_n(r)), a.final()]);
    }
    if (se.env.SNAP)
      G.writeFileSync(this.path, r, { mode: Q(this, _e).configFileMode });
    else
      try {
        vo(this.path, r, { mode: Q(this, _e).configFileMode });
      } catch (n) {
        if ((n == null ? void 0 : n.code) === "EXDEV") {
          G.writeFileSync(this.path, r, { mode: Q(this, _e).configFileMode });
          return;
        }
        throw n;
      }
  }
  _watch() {
    this._ensureDirectory(), G.existsSync(this.path) || this._write($t()), se.platform === "win32" ? G.watch(this.path, { persistent: !1 }, Ua(() => {
      this.events.dispatchEvent(new Event("change"));
    }, { wait: 100 })) : G.watchFile(this.path, { persistent: !1 }, Ua(() => {
      this.events.dispatchEvent(new Event("change"));
    }, { wait: 5e3 }));
  }
  _migrate(t, r, n) {
    let s = this._get(En, "0.0.0");
    const a = Object.keys(t).filter((l) => this._shouldPerformMigration(l, s, r));
    let o = { ...this.store };
    for (const l of a)
      try {
        n && n(this, {
          fromVersion: s,
          toVersion: l,
          finalVersion: r,
          versions: a
        });
        const i = t[l];
        i == null || i(this), this._set(En, l), s = l, o = { ...this.store };
      } catch (i) {
        throw this.store = o, new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${i}`);
      }
    (this._isVersionInRangeFormat(s) || !pt.eq(s, r)) && this._set(En, r);
  }
  _containsReservedKey(t) {
    return typeof t == "object" && Object.keys(t)[0] === Er ? !0 : typeof t != "string" ? !1 : Q(this, _e).accessPropertiesByDotNotation ? !!t.startsWith(`${Er}.`) : !1;
  }
  _isVersionInRangeFormat(t) {
    return pt.clean(t) === null;
  }
  _shouldPerformMigration(t, r, n) {
    return this._isVersionInRangeFormat(t) ? r !== "0.0.0" && pt.satisfies(r, t) ? !1 : pt.satisfies(n, t) : !(pt.lte(t, r) || pt.gt(t, n));
  }
  _get(t, r) {
    return yc(this.store, t, r);
  }
  _set(t, r) {
    const { store: n } = this;
    ra(n, t, r), this.store = n;
  }
}
Ye = new WeakMap(), Me = new WeakMap(), _e = new WeakMap(), Ve = new WeakMap();
const { app: wr, ipcMain: kn, shell: og } = Dn;
let co = !1;
const lo = () => {
  if (!kn || !wr)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const e = {
    defaultCwd: wr.getPath("userData"),
    appVersion: wr.getVersion()
  };
  return co || (kn.on("electron-store-get-data", (t) => {
    t.returnValue = e;
  }), co = !0), e;
};
class ig extends ag {
  constructor(t) {
    let r, n;
    if (se.type === "renderer") {
      const s = Dn.ipcRenderer.sendSync("electron-store-get-data");
      if (!s)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: r, appVersion: n } = s);
    } else kn && wr && ({ defaultCwd: r, appVersion: n } = lo());
    t = {
      name: "config",
      ...t
    }, t.projectVersion || (t.projectVersion = n), t.cwd ? t.cwd = X.isAbsolute(t.cwd) ? t.cwd : X.join(r, t.cwd) : t.cwd = r, t.configName = t.name, delete t.name, super(t);
  }
  static initRenderer() {
    lo();
  }
  async openInEditor() {
    const t = await og.openPath(this.path);
    if (t)
      throw new Error(t);
  }
}
const vt = new ig({
  defaults: {
    darkMode: !1,
    hotkeys: {},
    streamDeck: !1
  }
}), cg = () => {
  wt.handle("get-setting", (e, t) => vt.get(t)), wt.handle(
    "set-setting",
    (e, t, r) => {
      vt.set(t, r), e.sender.send("setting-changed", t, r);
    }
  );
}, lg = 51109, ug = (e) => {
  const t = new Vi({ port: lg, perMessageDeflate: !1 });
  vt.set("streamDeck", !1), e.webContents.send("setting-changed", "streamDeck", !1), wt.handle(
    "send-to-stream-deck",
    (r, n) => {
      t.clients.forEach((s) => {
        s.readyState === 1 && s.send(JSON.stringify(n));
      });
    }
  ), t.on("error", (r) => {
    console.error("[WS] Error:", r), vt.set("streamDeck", !1), e.webContents.send("setting-changed", "streamDeck", !1);
  }), t.on("connection", (r) => {
    console.log("[WS] Plugin connected"), vt.set("streamDeck", !0), e.webContents.send("setting-changed", "streamDeck", !0), r.on("message", (n) => {
      switch (n.toString()) {
        case "toggleRecording":
          e.webContents.send("hotkey", "toggleRecording");
          break;
        case "clipStream":
          e.webContents.send("hotkey", "clipStream");
          break;
      }
    }), r.on("close", () => {
      console.log("[WS] Plugin disconnected"), vt.set("streamDeck", !1), e.webContents.send("setting-changed", "streamDeck", !1);
    });
  });
}, dg = Li(import.meta.url), Ii = X.dirname(Mi(import.meta.url));
Oe.setAppUserModelId("com.haydncom.tabzero");
dg("electron-squirrel-startup") && Oe.quit();
process.env.APP_ROOT = X.join(Ii, "..");
const Cn = process.env.VITE_DEV_SERVER_URL, Sg = X.join(process.env.APP_ROOT, "dist-electron"), Ni = X.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = Cn ? X.join(process.env.APP_ROOT, "public") : Ni;
let ie;
rc();
function Oi() {
  ie = new uo({
    icon: X.join(process.env.VITE_PUBLIC, "icon.png"),
    webPreferences: {
      preload: X.join(Ii, "preload.mjs"),
      webSecurity: !1,
      devTools: !0
    },
    autoHideMenuBar: !0
  }), ie.webContents.on("did-finish-load", () => {
    ie == null || ie.webContents.send("main-process-message", { hello: "world" });
  }), Cn ? ie.loadURL(Cn) : ie.loadFile(X.join(Ni, "index.html")), hc(ie), pc(ie), ug(ie);
}
Oe.on("window-all-closed", () => {
  process.platform !== "darwin" && (Oe.quit(), ie = null);
});
Oe.on("activate", () => {
  uo.getAllWindows().length === 0 && Oi();
});
cg();
fc();
if (!Oe.requestSingleInstanceLock())
  Oe.quit();
else {
  const e = async (t) => {
    if (!ie) return;
    const r = t.find((n) => n.startsWith(`${Ln}://`));
    r && $o(ie, r);
  };
  Oe.on("second-instance", (t, r) => {
    e(r), ie && (ie.isMinimized() && ie.restore(), ie.focus());
  }), Oe.whenReady().then(() => {
    Oi(), e(process.argv);
  });
}
export {
  Sg as MAIN_DIST,
  Ni as RENDERER_DIST,
  Cn as VITE_DEV_SERVER_URL
};
