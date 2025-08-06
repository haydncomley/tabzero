var oi = Object.defineProperty;
var Vs = (e) => {
  throw TypeError(e);
};
var ii = (e, t, r) => t in e ? oi(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var Mt = (e, t, r) => ii(e, typeof t != "symbol" ? t + "" : t, r), Us = (e, t, r) => t.has(e) || Vs("Cannot " + r);
var se = (e, t, r) => (Us(e, t, "read from private field"), r ? r.call(e) : t.get(e)), Vt = (e, t, r) => t.has(e) ? Vs("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), Ut = (e, t, r, n) => (Us(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r);
import Rn, { ipcMain as Pt, shell as ci, app as De, globalShortcut as Bt, BrowserWindow as Qa } from "electron";
import eo from "node:assert";
import B from "node:fs";
import Qt from "node:os";
import Y from "node:path";
import li, { promisify as $e, isDeepStrictEqual as ui } from "node:util";
import { createRequire as di } from "node:module";
import { fileURLToPath as fi } from "node:url";
import le from "node:process";
import zt from "node:crypto";
import { WebSocketServer as hi } from "ws";
var zs = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function to(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var er = {}, Rt = 1e3, It = Rt * 60, Nt = It * 60, dt = Nt * 24, mi = dt * 7, pi = dt * 365.25, $i = function(e, t) {
  t = t || {};
  var r = typeof e;
  if (r === "string" && e.length > 0)
    return yi(e);
  if (r === "number" && isFinite(e))
    return t.long ? vi(e) : gi(e);
  throw new Error(
    "val is not a non-empty string or a valid number. val=" + JSON.stringify(e)
  );
};
function yi(e) {
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
          return r * pi;
        case "weeks":
        case "week":
        case "w":
          return r * mi;
        case "days":
        case "day":
        case "d":
          return r * dt;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return r * Nt;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return r * It;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return r * Rt;
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
function gi(e) {
  var t = Math.abs(e);
  return t >= dt ? Math.round(e / dt) + "d" : t >= Nt ? Math.round(e / Nt) + "h" : t >= It ? Math.round(e / It) + "m" : t >= Rt ? Math.round(e / Rt) + "s" : e + "ms";
}
function vi(e) {
  var t = Math.abs(e);
  return t >= dt ? ar(e, t, dt, "day") : t >= Nt ? ar(e, t, Nt, "hour") : t >= It ? ar(e, t, It, "minute") : t >= Rt ? ar(e, t, Rt, "second") : e + " ms";
}
function ar(e, t, r, n) {
  var s = t >= r * 1.5;
  return Math.round(e / r) + " " + n + (s ? "s" : "");
}
var _i = Si, Ei = /^(?:\w+:)?\/\/(\S+)$/, wi = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/, bi = /^[^\s\.]+\.\S{2,}$/;
function Si(e) {
  if (typeof e != "string")
    return !1;
  var t = e.match(Ei);
  if (!t)
    return !1;
  var r = t[1];
  return r ? !!(wi.test(r) || bi.test(r)) : !1;
}
var Pi = _i, Ri = /(?:(?:[^:]+:)?[/][/])?(?:.+@)?([^/]+)([/][^?#]+)/, Ii = function(e, t) {
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
    if (e = e.replace(/^git\+/, ""), !Pi(e))
      return null;
    var i = e.match(Ri) || [], c = i[1], o = i[2];
    if (!c || c !== "github.com" && c !== "www.github.com" && !t.enterprise)
      return null;
    var u = o.match(/^\/([\w-_]+)\/([\w-_\.]+)(\/tree\/[\%\w-_\.\/]+)?(\/blob\/[\%\w-_\.\/]+)?/);
    if (!u)
      return null;
    if (r.user = u[1], r.repo = u[2].replace(/\.git$/i, ""), r.host = c || "github.com", u[3] && /^\/tree\/master\//.test(u[3]))
      r.branch = "master", r.path = u[3].replace(/\/$/, "");
    else if (u[3]) {
      var l = u[3].replace(/^\/tree\//, "").match(/[\%\w-_.]*\/?[\%\w-_]+/);
      r.branch = l && l[0];
    } else if (u[4]) {
      var l = u[4].replace(/^\/blob\//, "").match(/[\%\w-_.]*\/?[\%\w-_]+/);
      r.branch = l && l[0];
    } else
      r.branch = "master";
  }
  return r.host === "github.com" ? r.apiHost = "api.github.com" : r.apiHost = r.host + "/api/v3", r.tarball_url = "https://" + r.apiHost + "/repos/" + r.user + "/" + r.repo + "/tarball/" + r.branch, r.clone_url = "https://" + r.host + "/" + r.user + "/" + r.repo, r.branch === "master" ? (r.https_url = "https://" + r.host + "/" + r.user + "/" + r.repo, r.travis_url = "https://travis-ci.org/" + r.user + "/" + r.repo, r.zip_url = "https://" + r.host + "/" + r.user + "/" + r.repo + "/archive/master.zip") : (r.https_url = "https://" + r.host + "/" + r.user + "/" + r.repo + "/blob/" + r.branch, r.travis_url = "https://travis-ci.org/" + r.user + "/" + r.repo + "?branch=" + r.branch, r.zip_url = "https://" + r.host + "/" + r.user + "/" + r.repo + "/archive/" + r.branch + ".zip"), r.path && (r.https_url += r.path), r.api_url = "https://" + r.apiHost + "/repos/" + r.user + "/" + r.repo, r;
};
const Ni = "update-electron-app", Oi = "3.1.1", Ti = {
  name: Ni,
  version: Oi
};
var Ot = zs && zs.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(er, "__esModule", { value: !0 });
er.UpdateSourceType = void 0;
var ji = er.updateElectronApp = Vi;
er.makeUserNotifier = no;
const ro = Ot($i), Ai = Ot(Ii), tt = Ot(eo), ki = Ot(B), Fs = Ot(Qt), Ci = Ot(Y), Di = li, _e = Rn;
var ut;
(function(e) {
  e[e.ElectronPublicUpdateService = 0] = "ElectronPublicUpdateService", e[e.StaticStorage = 1] = "StaticStorage";
})(ut || (er.UpdateSourceType = ut = {}));
const qs = Ti, Li = (0, Di.format)("%s/%s (%s: %s)", qs.name, qs.version, Fs.default.platform(), Fs.default.arch()), Mi = ["darwin", "win32"], Gs = (e) => {
  try {
    const { protocol: t } = new URL(e);
    return t === "https:";
  } catch {
    return !1;
  }
};
function Vi(e = {}) {
  const t = zi(e);
  if (!_e.app.isPackaged) {
    const r = "update-electron-app config looks good; aborting updates since app is in development mode";
    e.logger ? e.logger.log(r) : console.log(r);
    return;
  }
  _e.app.isReady() ? Ks(t) : _e.app.on("ready", () => Ks(t));
}
function Ks(e) {
  const { updateSource: t, updateInterval: r, logger: n } = e;
  if (!Mi.includes(process == null ? void 0 : process.platform)) {
    c(`Electron's autoUpdater does not support the '${process.platform}' platform. Ref: https://www.electronjs.org/docs/latest/api/auto-updater#platform-notices`);
    return;
  }
  let s, a = "default";
  switch (t.type) {
    case ut.ElectronPublicUpdateService: {
      s = `${t.host}/${t.repo}/${process.platform}-${process.arch}/${_e.app.getVersion()}`;
      break;
    }
    case ut.StaticStorage: {
      s = t.baseUrl, process.platform === "darwin" && (s += "/RELEASES.json", a = "json");
      break;
    }
  }
  const i = { "User-Agent": Li };
  function c(...o) {
    n.log(...o);
  }
  c("feedURL", s), c("requestHeaders", i), _e.autoUpdater.setFeedURL({
    url: s,
    headers: i,
    serverType: a
  }), _e.autoUpdater.on("error", (o) => {
    c("updater error"), c(o);
  }), _e.autoUpdater.on("checking-for-update", () => {
    c("checking-for-update");
  }), _e.autoUpdater.on("update-available", () => {
    c("update-available; downloading...");
  }), _e.autoUpdater.on("update-not-available", () => {
    c("update-not-available");
  }), e.notifyUser && _e.autoUpdater.on("update-downloaded", (o, u, l, f, g) => {
    c("update-downloaded", [o, u, l, f, g]), typeof e.onNotifyUser != "function" ? ((0, tt.default)(e.onNotifyUser === void 0, "onNotifyUser option must be a callback function or undefined"), c("update-downloaded: notifyUser is true, opening default dialog"), e.onNotifyUser = no()) : c("update-downloaded: notifyUser is true, running custom onNotifyUser callback"), e.onNotifyUser({
      event: o,
      releaseNotes: u,
      releaseDate: f,
      releaseName: l,
      updateURL: g
    });
  }), _e.autoUpdater.checkForUpdates(), setInterval(() => {
    _e.autoUpdater.checkForUpdates();
  }, (0, ro.default)(r));
}
function no(e) {
  const r = Object.assign({}, {
    title: "Application Update",
    detail: "A new version has been downloaded. Restart the application to apply the updates.",
    restartButtonText: "Restart",
    laterButtonText: "Later"
  }, e);
  return (n) => {
    const { releaseNotes: s, releaseName: a } = n, { title: i, restartButtonText: c, laterButtonText: o, detail: u } = r, l = {
      type: "info",
      buttons: [c, o],
      title: i,
      message: process.platform === "win32" ? s : a,
      detail: u
    };
    _e.dialog.showMessageBox(l).then(({ response: f }) => {
      f === 0 && _e.autoUpdater.quitAndInstall();
    });
  };
}
function Ui() {
  var e;
  const t = ki.default.readFileSync(Ci.default.join(_e.app.getAppPath(), "package.json")), r = JSON.parse(t.toString()), n = ((e = r.repository) === null || e === void 0 ? void 0 : e.url) || r.repository, s = (0, Ai.default)(n);
  return (0, tt.default)(s, "repo not found. Add repository string to your app's package.json file"), `${s.user}/${s.repo}`;
}
function zi(e) {
  var t;
  const r = {
    host: "https://update.electronjs.org",
    updateInterval: "10 minutes",
    logger: console,
    notifyUser: !0
  }, { host: n, updateInterval: s, logger: a, notifyUser: i, onNotifyUser: c } = Object.assign({}, r, e);
  let o = e.updateSource;
  switch (o || (o = {
    type: ut.ElectronPublicUpdateService,
    repo: e.repo || Ui(),
    host: n
  }), o.type) {
    case ut.ElectronPublicUpdateService: {
      (0, tt.default)((t = o.repo) === null || t === void 0 ? void 0 : t.includes("/"), "repo is required and should be in the format `owner/repo`"), o.host || (o.host = n), (0, tt.default)(o.host && Gs(o.host), "host must be a valid HTTPS URL");
      break;
    }
    case ut.StaticStorage: {
      (0, tt.default)(o.baseUrl && Gs(o.baseUrl), "baseUrl must be a valid HTTPS URL");
      break;
    }
  }
  return (0, tt.default)(typeof s == "string" && s.match(/^\d+/), "updateInterval must be a human-friendly string interval like `20 minutes`"), (0, tt.default)((0, ro.default)(s) >= 5 * 60 * 1e3, "updateInterval must be `5 minutes` or more"), (0, tt.default)(a && typeof a.log, "function"), { updateSource: o, updateInterval: s, logger: a, notifyUser: i, onNotifyUser: c };
}
const Fi = () => {
  Pt.handle("open-external", (e, t) => ci.openExternal(t));
}, ft = (e) => {
  const t = typeof e;
  return e !== null && (t === "object" || t === "function");
}, Yr = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), qi = new Set("0123456789");
function jr(e) {
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
        if (Yr.has(r))
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
          if (Yr.has(r))
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
        if (n === "index" && !qi.has(a))
          throw new Error("Invalid character in an index");
        if (n === "indexEnd")
          throw new Error("Invalid character after an index");
        n === "start" && (n = "property"), s && (s = !1, r += "\\"), r += a;
      }
    }
  switch (s && (r += "\\"), n) {
    case "property": {
      if (Yr.has(r))
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
function In(e, t) {
  if (typeof t != "number" && Array.isArray(e)) {
    const r = Number.parseInt(t, 10);
    return Number.isInteger(r) && e[r] === e[t];
  }
  return !1;
}
function so(e, t) {
  if (In(e, t))
    throw new Error("Cannot use string index");
}
function Gi(e, t, r) {
  if (!ft(e) || typeof t != "string")
    return r === void 0 ? e : r;
  const n = jr(t);
  if (n.length === 0)
    return r;
  for (let s = 0; s < n.length; s++) {
    const a = n[s];
    if (In(e, a) ? e = s === n.length - 1 ? void 0 : null : e = e[a], e == null) {
      if (s !== n.length - 1)
        return r;
      break;
    }
  }
  return e === void 0 ? r : e;
}
function Hs(e, t, r) {
  if (!ft(e) || typeof t != "string")
    return e;
  const n = e, s = jr(t);
  for (let a = 0; a < s.length; a++) {
    const i = s[a];
    so(e, i), a === s.length - 1 ? e[i] = r : ft(e[i]) || (e[i] = typeof s[a + 1] == "number" ? [] : {}), e = e[i];
  }
  return n;
}
function Ki(e, t) {
  if (!ft(e) || typeof t != "string")
    return !1;
  const r = jr(t);
  for (let n = 0; n < r.length; n++) {
    const s = r[n];
    if (so(e, s), n === r.length - 1)
      return delete e[s], !0;
    if (e = e[s], !ft(e))
      return !1;
  }
}
function Hi(e, t) {
  if (!ft(e) || typeof t != "string")
    return !1;
  const r = jr(t);
  if (r.length === 0)
    return !1;
  for (const n of r) {
    if (!ft(e) || !(n in e) || In(e, n))
      return !1;
    e = e[n];
  }
  return !0;
}
const rt = Qt.homedir(), Nn = Qt.tmpdir(), { env: wt } = le, Xi = (e) => {
  const t = Y.join(rt, "Library");
  return {
    data: Y.join(t, "Application Support", e),
    config: Y.join(t, "Preferences", e),
    cache: Y.join(t, "Caches", e),
    log: Y.join(t, "Logs", e),
    temp: Y.join(Nn, e)
  };
}, Bi = (e) => {
  const t = wt.APPDATA || Y.join(rt, "AppData", "Roaming"), r = wt.LOCALAPPDATA || Y.join(rt, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: Y.join(r, e, "Data"),
    config: Y.join(t, e, "Config"),
    cache: Y.join(r, e, "Cache"),
    log: Y.join(r, e, "Log"),
    temp: Y.join(Nn, e)
  };
}, Wi = (e) => {
  const t = Y.basename(rt);
  return {
    data: Y.join(wt.XDG_DATA_HOME || Y.join(rt, ".local", "share"), e),
    config: Y.join(wt.XDG_CONFIG_HOME || Y.join(rt, ".config"), e),
    cache: Y.join(wt.XDG_CACHE_HOME || Y.join(rt, ".cache"), e),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: Y.join(wt.XDG_STATE_HOME || Y.join(rt, ".local", "state"), e),
    temp: Y.join(Nn, t, e)
  };
};
function Ji(e, { suffix: t = "nodejs" } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  return t && (e += `-${t}`), le.platform === "darwin" ? Xi(e) : le.platform === "win32" ? Bi(e) : Wi(e);
}
const Je = (e, t) => function(...n) {
  return e.apply(void 0, n).catch(t);
}, Fe = (e, t) => function(...n) {
  try {
    return e.apply(void 0, n);
  } catch (s) {
    return t(s);
  }
}, xi = le.getuid ? !le.getuid() : !1, Yi = 1e4, Re = () => {
}, ae = {
  /* API */
  isChangeErrorOk: (e) => {
    if (!ae.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "ENOSYS" || !xi && (t === "EINVAL" || t === "EPERM");
  },
  isNodeError: (e) => e instanceof Error,
  isRetriableError: (e) => {
    if (!ae.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "EMFILE" || t === "ENFILE" || t === "EAGAIN" || t === "EBUSY" || t === "EACCESS" || t === "EACCES" || t === "EACCS" || t === "EPERM";
  },
  onChangeError: (e) => {
    if (!ae.isNodeError(e))
      throw e;
    if (!ae.isChangeErrorOk(e))
      throw e;
  }
};
class Zi {
  constructor() {
    this.interval = 25, this.intervalId = void 0, this.limit = Yi, this.queueActive = /* @__PURE__ */ new Set(), this.queueWaiting = /* @__PURE__ */ new Set(), this.init = () => {
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
const Qi = new Zi(), xe = (e, t) => function(n) {
  return function s(...a) {
    return Qi.schedule().then((i) => {
      const c = (u) => (i(), u), o = (u) => {
        if (i(), Date.now() >= n)
          throw u;
        if (t(u)) {
          const l = Math.round(100 * Math.random());
          return new Promise((g) => setTimeout(g, l)).then(() => s.apply(void 0, a));
        }
        throw u;
      };
      return e.apply(void 0, a).then(c, o);
    });
  };
}, Ye = (e, t) => function(n) {
  return function s(...a) {
    try {
      return e.apply(void 0, a);
    } catch (i) {
      if (Date.now() > n)
        throw i;
      if (t(i))
        return s.apply(void 0, a);
      throw i;
    }
  };
}, ye = {
  attempt: {
    /* ASYNC */
    chmod: Je($e(B.chmod), ae.onChangeError),
    chown: Je($e(B.chown), ae.onChangeError),
    close: Je($e(B.close), Re),
    fsync: Je($e(B.fsync), Re),
    mkdir: Je($e(B.mkdir), Re),
    realpath: Je($e(B.realpath), Re),
    stat: Je($e(B.stat), Re),
    unlink: Je($e(B.unlink), Re),
    /* SYNC */
    chmodSync: Fe(B.chmodSync, ae.onChangeError),
    chownSync: Fe(B.chownSync, ae.onChangeError),
    closeSync: Fe(B.closeSync, Re),
    existsSync: Fe(B.existsSync, Re),
    fsyncSync: Fe(B.fsync, Re),
    mkdirSync: Fe(B.mkdirSync, Re),
    realpathSync: Fe(B.realpathSync, Re),
    statSync: Fe(B.statSync, Re),
    unlinkSync: Fe(B.unlinkSync, Re)
  },
  retry: {
    /* ASYNC */
    close: xe($e(B.close), ae.isRetriableError),
    fsync: xe($e(B.fsync), ae.isRetriableError),
    open: xe($e(B.open), ae.isRetriableError),
    readFile: xe($e(B.readFile), ae.isRetriableError),
    rename: xe($e(B.rename), ae.isRetriableError),
    stat: xe($e(B.stat), ae.isRetriableError),
    write: xe($e(B.write), ae.isRetriableError),
    writeFile: xe($e(B.writeFile), ae.isRetriableError),
    /* SYNC */
    closeSync: Ye(B.closeSync, ae.isRetriableError),
    fsyncSync: Ye(B.fsyncSync, ae.isRetriableError),
    openSync: Ye(B.openSync, ae.isRetriableError),
    readFileSync: Ye(B.readFileSync, ae.isRetriableError),
    renameSync: Ye(B.renameSync, ae.isRetriableError),
    statSync: Ye(B.statSync, ae.isRetriableError),
    writeSync: Ye(B.writeSync, ae.isRetriableError),
    writeFileSync: Ye(B.writeFileSync, ae.isRetriableError)
  }
}, ec = "utf8", Xs = 438, tc = 511, rc = {}, nc = Qt.userInfo().uid, sc = Qt.userInfo().gid, ac = 1e3, oc = !!le.getuid;
le.getuid && le.getuid();
const Bs = 128, ic = (e) => e instanceof Error && "code" in e, Ws = (e) => typeof e == "string", Zr = (e) => e === void 0, cc = le.platform === "linux", ao = le.platform === "win32", On = ["SIGABRT", "SIGALRM", "SIGHUP", "SIGINT", "SIGTERM"];
ao || On.push("SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
cc && On.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT", "SIGUNUSED");
class lc {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (t) => {
      if (!this.exited) {
        this.exited = !0;
        for (const r of this.callbacks)
          r();
        t && (ao && t !== "SIGINT" && t !== "SIGTERM" && t !== "SIGKILL" ? le.kill(le.pid, "SIGTERM") : le.kill(le.pid, t));
      }
    }, this.hook = () => {
      le.once("exit", () => this.exit());
      for (const t of On)
        try {
          le.once(t, () => this.exit(t));
        } catch {
        }
    }, this.register = (t) => (this.callbacks.add(t), () => {
      this.callbacks.delete(t);
    }), this.hook();
  }
}
const uc = new lc(), dc = uc.register, ge = {
  /* VARIABLES */
  store: {},
  /* API */
  create: (e) => {
    const t = `000000${Math.floor(Math.random() * 16777215).toString(16)}`.slice(-6), s = `.tmp-${Date.now().toString().slice(-10)}${t}`;
    return `${e}${s}`;
  },
  get: (e, t, r = !0) => {
    const n = ge.truncate(t(e));
    return n in ge.store ? ge.get(e, t, r) : (ge.store[n] = r, [n, () => delete ge.store[n]]);
  },
  purge: (e) => {
    ge.store[e] && (delete ge.store[e], ye.attempt.unlink(e));
  },
  purgeSync: (e) => {
    ge.store[e] && (delete ge.store[e], ye.attempt.unlinkSync(e));
  },
  purgeSyncAll: () => {
    for (const e in ge.store)
      ge.purgeSync(e);
  },
  truncate: (e) => {
    const t = Y.basename(e);
    if (t.length <= Bs)
      return e;
    const r = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(t);
    if (!r)
      return e;
    const n = t.length - Bs;
    return `${e.slice(0, -t.length)}${r[1]}${r[2].slice(0, -n)}${r[3]}`;
  }
};
dc(ge.purgeSyncAll);
function oo(e, t, r = rc) {
  if (Ws(r))
    return oo(e, t, { encoding: r });
  const n = Date.now() + ((r.timeout ?? ac) || -1);
  let s = null, a = null, i = null;
  try {
    const c = ye.attempt.realpathSync(e), o = !!c;
    e = c || e, [a, s] = ge.get(e, r.tmpCreate || ge.create, r.tmpPurge !== !1);
    const u = oc && Zr(r.chown), l = Zr(r.mode);
    if (o && (u || l)) {
      const f = ye.attempt.statSync(e);
      f && (r = { ...r }, u && (r.chown = { uid: f.uid, gid: f.gid }), l && (r.mode = f.mode));
    }
    if (!o) {
      const f = Y.dirname(e);
      ye.attempt.mkdirSync(f, {
        mode: tc,
        recursive: !0
      });
    }
    i = ye.retry.openSync(n)(a, "w", r.mode || Xs), r.tmpCreated && r.tmpCreated(a), Ws(t) ? ye.retry.writeSync(n)(i, t, 0, r.encoding || ec) : Zr(t) || ye.retry.writeSync(n)(i, t, 0, t.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? ye.retry.fsyncSync(n)(i) : ye.attempt.fsync(i)), ye.retry.closeSync(n)(i), i = null, r.chown && (r.chown.uid !== nc || r.chown.gid !== sc) && ye.attempt.chownSync(a, r.chown.uid, r.chown.gid), r.mode && r.mode !== Xs && ye.attempt.chmodSync(a, r.mode);
    try {
      ye.retry.renameSync(n)(a, e);
    } catch (f) {
      if (!ic(f) || f.code !== "ENAMETOOLONG")
        throw f;
      ye.retry.renameSync(n)(a, ge.truncate(e));
    }
    s(), a = null;
  } finally {
    i && ye.attempt.closeSync(i), a && ge.purge(a);
  }
}
var fn = { exports: {} }, Tn = {}, qe = {}, at = {}, tr = {}, H = {}, Zt = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class r extends t {
    constructor(S) {
      if (super(), !e.IDENTIFIER.test(S))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = S;
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
    constructor(S) {
      super(), this._items = typeof S == "string" ? [S] : S;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const S = this._items[0];
      return S === "" || S === '""';
    }
    get str() {
      var S;
      return (S = this._str) !== null && S !== void 0 ? S : this._str = this._items.reduce((N, j) => `${N}${j}`, "");
    }
    get names() {
      var S;
      return (S = this._names) !== null && S !== void 0 ? S : this._names = this._items.reduce((N, j) => (j instanceof r && (N[j.str] = (N[j.str] || 0) + 1), N), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function s(p, ...S) {
    const N = [p[0]];
    let j = 0;
    for (; j < S.length; )
      c(N, S[j]), N.push(p[++j]);
    return new n(N);
  }
  e._ = s;
  const a = new n("+");
  function i(p, ...S) {
    const N = [m(p[0])];
    let j = 0;
    for (; j < S.length; )
      N.push(a), c(N, S[j]), N.push(a, m(p[++j]));
    return o(N), new n(N);
  }
  e.str = i;
  function c(p, S) {
    S instanceof n ? p.push(...S._items) : S instanceof r ? p.push(S) : p.push(f(S));
  }
  e.addCodeArg = c;
  function o(p) {
    let S = 1;
    for (; S < p.length - 1; ) {
      if (p[S] === a) {
        const N = u(p[S - 1], p[S + 1]);
        if (N !== void 0) {
          p.splice(S - 1, 3, N);
          continue;
        }
        p[S++] = "+";
      }
      S++;
    }
  }
  function u(p, S) {
    if (S === '""')
      return p;
    if (p === '""')
      return S;
    if (typeof p == "string")
      return S instanceof r || p[p.length - 1] !== '"' ? void 0 : typeof S != "string" ? `${p.slice(0, -1)}${S}"` : S[0] === '"' ? p.slice(0, -1) + S.slice(1) : void 0;
    if (typeof S == "string" && S[0] === '"' && !(p instanceof r))
      return `"${p}${S.slice(1)}`;
  }
  function l(p, S) {
    return S.emptyStr() ? p : p.emptyStr() ? S : i`${p}${S}`;
  }
  e.strConcat = l;
  function f(p) {
    return typeof p == "number" || typeof p == "boolean" || p === null ? p : m(Array.isArray(p) ? p.join(",") : p);
  }
  function g(p) {
    return new n(m(p));
  }
  e.stringify = g;
  function m(p) {
    return JSON.stringify(p).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = m;
  function v(p) {
    return typeof p == "string" && e.IDENTIFIER.test(p) ? new n(`.${p}`) : s`[${p}]`;
  }
  e.getProperty = v;
  function $(p) {
    if (typeof p == "string" && e.IDENTIFIER.test(p))
      return new n(`${p}`);
    throw new Error(`CodeGen: invalid export name: ${p}, use explicit $id name mapping`);
  }
  e.getEsmExportName = $;
  function w(p) {
    return new n(p.toString());
  }
  e.regexpCode = w;
})(Zt);
var hn = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = Zt;
  class r extends Error {
    constructor(u) {
      super(`CodeGen: "code" for ${u} not defined`), this.value = u.value;
    }
  }
  var n;
  (function(o) {
    o[o.Started = 0] = "Started", o[o.Completed = 1] = "Completed";
  })(n || (e.UsedValueState = n = {})), e.varKinds = {
    const: new t.Name("const"),
    let: new t.Name("let"),
    var: new t.Name("var")
  };
  class s {
    constructor({ prefixes: u, parent: l } = {}) {
      this._names = {}, this._prefixes = u, this._parent = l;
    }
    toName(u) {
      return u instanceof t.Name ? u : this.name(u);
    }
    name(u) {
      return new t.Name(this._newName(u));
    }
    _newName(u) {
      const l = this._names[u] || this._nameGroup(u);
      return `${u}${l.index++}`;
    }
    _nameGroup(u) {
      var l, f;
      if (!((f = (l = this._parent) === null || l === void 0 ? void 0 : l._prefixes) === null || f === void 0) && f.has(u) || this._prefixes && !this._prefixes.has(u))
        throw new Error(`CodeGen: prefix "${u}" is not allowed in this scope`);
      return this._names[u] = { prefix: u, index: 0 };
    }
  }
  e.Scope = s;
  class a extends t.Name {
    constructor(u, l) {
      super(l), this.prefix = u;
    }
    setValue(u, { property: l, itemIndex: f }) {
      this.value = u, this.scopePath = (0, t._)`.${new t.Name(l)}[${f}]`;
    }
  }
  e.ValueScopeName = a;
  const i = (0, t._)`\n`;
  class c extends s {
    constructor(u) {
      super(u), this._values = {}, this._scope = u.scope, this.opts = { ...u, _n: u.lines ? i : t.nil };
    }
    get() {
      return this._scope;
    }
    name(u) {
      return new a(u, this._newName(u));
    }
    value(u, l) {
      var f;
      if (l.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const g = this.toName(u), { prefix: m } = g, v = (f = l.key) !== null && f !== void 0 ? f : l.ref;
      let $ = this._values[m];
      if ($) {
        const S = $.get(v);
        if (S)
          return S;
      } else
        $ = this._values[m] = /* @__PURE__ */ new Map();
      $.set(v, g);
      const w = this._scope[m] || (this._scope[m] = []), p = w.length;
      return w[p] = l.ref, g.setValue(l, { property: m, itemIndex: p }), g;
    }
    getValue(u, l) {
      const f = this._values[u];
      if (f)
        return f.get(l);
    }
    scopeRefs(u, l = this._values) {
      return this._reduceValues(l, (f) => {
        if (f.scopePath === void 0)
          throw new Error(`CodeGen: name "${f}" has no value`);
        return (0, t._)`${u}${f.scopePath}`;
      });
    }
    scopeCode(u = this._values, l, f) {
      return this._reduceValues(u, (g) => {
        if (g.value === void 0)
          throw new Error(`CodeGen: name "${g}" has no value`);
        return g.value.code;
      }, l, f);
    }
    _reduceValues(u, l, f = {}, g) {
      let m = t.nil;
      for (const v in u) {
        const $ = u[v];
        if (!$)
          continue;
        const w = f[v] = f[v] || /* @__PURE__ */ new Map();
        $.forEach((p) => {
          if (w.has(p))
            return;
          w.set(p, n.Started);
          let S = l(p);
          if (S) {
            const N = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            m = (0, t._)`${m}${N} ${p} = ${S};${this.opts._n}`;
          } else if (S = g == null ? void 0 : g(p))
            m = (0, t._)`${m}${S}${this.opts._n}`;
          else
            throw new r(p);
          w.set(p, n.Completed);
        });
      }
      return m;
    }
  }
  e.ValueScope = c;
})(hn);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = Zt, r = hn;
  var n = Zt;
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
  var s = hn;
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
  class i extends a {
    constructor(d, h, R) {
      super(), this.varKind = d, this.name = h, this.rhs = R;
    }
    render({ es5: d, _n: h }) {
      const R = d ? r.varKinds.var : this.varKind, U = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${R} ${this.name}${U};` + h;
    }
    optimizeNames(d, h) {
      if (d[this.name.str])
        return this.rhs && (this.rhs = O(this.rhs, d, h)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class c extends a {
    constructor(d, h, R) {
      super(), this.lhs = d, this.rhs = h, this.sideEffects = R;
    }
    render({ _n: d }) {
      return `${this.lhs} = ${this.rhs};` + d;
    }
    optimizeNames(d, h) {
      if (!(this.lhs instanceof t.Name && !d[this.lhs.str] && !this.sideEffects))
        return this.rhs = O(this.rhs, d, h), this;
    }
    get names() {
      const d = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return X(d, this.rhs);
    }
  }
  class o extends c {
    constructor(d, h, R, U) {
      super(d, R, U), this.op = h;
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
  class l extends a {
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
  class g extends a {
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
      return this.code = O(this.code, d, h), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class m extends a {
    constructor(d = []) {
      super(), this.nodes = d;
    }
    render(d) {
      return this.nodes.reduce((h, R) => h + R.render(d), "");
    }
    optimizeNodes() {
      const { nodes: d } = this;
      let h = d.length;
      for (; h--; ) {
        const R = d[h].optimizeNodes();
        Array.isArray(R) ? d.splice(h, 1, ...R) : R ? d[h] = R : d.splice(h, 1);
      }
      return d.length > 0 ? this : void 0;
    }
    optimizeNames(d, h) {
      const { nodes: R } = this;
      let U = R.length;
      for (; U--; ) {
        const q = R[U];
        q.optimizeNames(d, h) || (A(d, q.names), R.splice(U, 1));
      }
      return R.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((d, h) => K(d, h.names), {});
    }
  }
  class v extends m {
    render(d) {
      return "{" + d._n + super.render(d) + "}" + d._n;
    }
  }
  class $ extends m {
  }
  class w extends v {
  }
  w.kind = "else";
  class p extends v {
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
        const R = h.optimizeNodes();
        h = this.else = Array.isArray(R) ? new w(R) : R;
      }
      if (h)
        return d === !1 ? h instanceof p ? h : h.nodes : this.nodes.length ? this : new p(V(d), h instanceof p ? [h] : h.nodes);
      if (!(d === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(d, h) {
      var R;
      if (this.else = (R = this.else) === null || R === void 0 ? void 0 : R.optimizeNames(d, h), !!(super.optimizeNames(d, h) || this.else))
        return this.condition = O(this.condition, d, h), this;
    }
    get names() {
      const d = super.names;
      return X(d, this.condition), this.else && K(d, this.else.names), d;
    }
  }
  p.kind = "if";
  class S extends v {
  }
  S.kind = "for";
  class N extends S {
    constructor(d) {
      super(), this.iteration = d;
    }
    render(d) {
      return `for(${this.iteration})` + super.render(d);
    }
    optimizeNames(d, h) {
      if (super.optimizeNames(d, h))
        return this.iteration = O(this.iteration, d, h), this;
    }
    get names() {
      return K(super.names, this.iteration.names);
    }
  }
  class j extends S {
    constructor(d, h, R, U) {
      super(), this.varKind = d, this.name = h, this.from = R, this.to = U;
    }
    render(d) {
      const h = d.es5 ? r.varKinds.var : this.varKind, { name: R, from: U, to: q } = this;
      return `for(${h} ${R}=${U}; ${R}<${q}; ${R}++)` + super.render(d);
    }
    get names() {
      const d = X(super.names, this.from);
      return X(d, this.to);
    }
  }
  class D extends S {
    constructor(d, h, R, U) {
      super(), this.loop = d, this.varKind = h, this.name = R, this.iterable = U;
    }
    render(d) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(d);
    }
    optimizeNames(d, h) {
      if (super.optimizeNames(d, h))
        return this.iterable = O(this.iterable, d, h), this;
    }
    get names() {
      return K(super.names, this.iterable.names);
    }
  }
  class Z extends v {
    constructor(d, h, R) {
      super(), this.name = d, this.args = h, this.async = R;
    }
    render(d) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(d);
    }
  }
  Z.kind = "func";
  class ee extends m {
    render(d) {
      return "return " + super.render(d);
    }
  }
  ee.kind = "return";
  class ie extends v {
    render(d) {
      let h = "try" + super.render(d);
      return this.catch && (h += this.catch.render(d)), this.finally && (h += this.finally.render(d)), h;
    }
    optimizeNodes() {
      var d, h;
      return super.optimizeNodes(), (d = this.catch) === null || d === void 0 || d.optimizeNodes(), (h = this.finally) === null || h === void 0 || h.optimizeNodes(), this;
    }
    optimizeNames(d, h) {
      var R, U;
      return super.optimizeNames(d, h), (R = this.catch) === null || R === void 0 || R.optimizeNames(d, h), (U = this.finally) === null || U === void 0 || U.optimizeNames(d, h), this;
    }
    get names() {
      const d = super.names;
      return this.catch && K(d, this.catch.names), this.finally && K(d, this.finally.names), d;
    }
  }
  class pe extends v {
    constructor(d) {
      super(), this.error = d;
    }
    render(d) {
      return `catch(${this.error})` + super.render(d);
    }
  }
  pe.kind = "catch";
  class ve extends v {
    render(d) {
      return "finally" + super.render(d);
    }
  }
  ve.kind = "finally";
  class z {
    constructor(d, h = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...h, _n: h.lines ? `
` : "" }, this._extScope = d, this._scope = new r.Scope({ parent: d }), this._nodes = [new $()];
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
      const R = this._extScope.value(d, h);
      return (this._values[R.prefix] || (this._values[R.prefix] = /* @__PURE__ */ new Set())).add(R), R;
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
    _def(d, h, R, U) {
      const q = this._scope.toName(h);
      return R !== void 0 && U && (this._constants[q.str] = R), this._leafNode(new i(d, q, R)), q;
    }
    // `const` declaration (`var` in es5 mode)
    const(d, h, R) {
      return this._def(r.varKinds.const, d, h, R);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(d, h, R) {
      return this._def(r.varKinds.let, d, h, R);
    }
    // `var` declaration with optional assignment
    var(d, h, R) {
      return this._def(r.varKinds.var, d, h, R);
    }
    // assignment code
    assign(d, h, R) {
      return this._leafNode(new c(d, h, R));
    }
    // `+=` code
    add(d, h) {
      return this._leafNode(new o(d, e.operators.ADD, h));
    }
    // appends passed SafeExpr to code or executes Block
    code(d) {
      return typeof d == "function" ? d() : d !== t.nil && this._leafNode(new g(d)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...d) {
      const h = ["{"];
      for (const [R, U] of d)
        h.length > 1 && h.push(","), h.push(R), (R !== U || this.opts.es5) && (h.push(":"), (0, t.addCodeArg)(h, U));
      return h.push("}"), new t._Code(h);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(d, h, R) {
      if (this._blockNode(new p(d)), h && R)
        this.code(h).else().code(R).endIf();
      else if (h)
        this.code(h).endIf();
      else if (R)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(d) {
      return this._elseNode(new p(d));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new w());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(p, w);
    }
    _for(d, h) {
      return this._blockNode(d), h && this.code(h).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(d, h) {
      return this._for(new N(d), h);
    }
    // `for` statement for a range of values
    forRange(d, h, R, U, q = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const te = this._scope.toName(d);
      return this._for(new j(q, te, h, R), () => U(te));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(d, h, R, U = r.varKinds.const) {
      const q = this._scope.toName(d);
      if (this.opts.es5) {
        const te = h instanceof t.Name ? h : this.var("_arr", h);
        return this.forRange("_i", 0, (0, t._)`${te}.length`, (Q) => {
          this.var(q, (0, t._)`${te}[${Q}]`), R(q);
        });
      }
      return this._for(new D("of", U, q, h), () => R(q));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(d, h, R, U = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(d, (0, t._)`Object.keys(${h})`, R);
      const q = this._scope.toName(d);
      return this._for(new D("in", U, q, h), () => R(q));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(S);
    }
    // `label` statement
    label(d) {
      return this._leafNode(new u(d));
    }
    // `break` statement
    break(d) {
      return this._leafNode(new l(d));
    }
    // `return` statement
    return(d) {
      const h = new ee();
      if (this._blockNode(h), this.code(d), h.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(ee);
    }
    // `try` statement
    try(d, h, R) {
      if (!h && !R)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const U = new ie();
      if (this._blockNode(U), this.code(d), h) {
        const q = this.name("e");
        this._currNode = U.catch = new pe(q), h(q);
      }
      return R && (this._currNode = U.finally = new ve(), this.code(R)), this._endBlockNode(pe, ve);
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
      const R = this._nodes.length - h;
      if (R < 0 || d !== void 0 && R !== d)
        throw new Error(`CodeGen: wrong number of nodes: ${R} vs ${d} expected`);
      return this._nodes.length = h, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(d, h = t.nil, R, U) {
      return this._blockNode(new Z(d, h, R)), U && this.code(U).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(Z);
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
      const R = this._currNode;
      if (R instanceof d || h && R instanceof h)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${h ? `${d.kind}/${h.kind}` : d.kind}"`);
    }
    _elseNode(d) {
      const h = this._currNode;
      if (!(h instanceof p))
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
  e.CodeGen = z;
  function K(E, d) {
    for (const h in d)
      E[h] = (E[h] || 0) + (d[h] || 0);
    return E;
  }
  function X(E, d) {
    return d instanceof t._CodeOrName ? K(E, d.names) : E;
  }
  function O(E, d, h) {
    if (E instanceof t.Name)
      return R(E);
    if (!U(E))
      return E;
    return new t._Code(E._items.reduce((q, te) => (te instanceof t.Name && (te = R(te)), te instanceof t._Code ? q.push(...te._items) : q.push(te), q), []));
    function R(q) {
      const te = h[q.str];
      return te === void 0 || d[q.str] !== 1 ? q : (delete d[q.str], te);
    }
    function U(q) {
      return q instanceof t._Code && q._items.some((te) => te instanceof t.Name && d[te.str] === 1 && h[te.str] !== void 0);
    }
  }
  function A(E, d) {
    for (const h in d)
      E[h] = (E[h] || 0) - (d[h] || 0);
  }
  function V(E) {
    return typeof E == "boolean" || typeof E == "number" || E === null ? !E : (0, t._)`!${P(E)}`;
  }
  e.not = V;
  const L = y(e.operators.AND);
  function G(...E) {
    return E.reduce(L);
  }
  e.and = G;
  const M = y(e.operators.OR);
  function I(...E) {
    return E.reduce(M);
  }
  e.or = I;
  function y(E) {
    return (d, h) => d === t.nil ? h : h === t.nil ? d : (0, t._)`${P(d)} ${E} ${P(h)}`;
  }
  function P(E) {
    return E instanceof t.Name ? E : (0, t._)`(${E})`;
  }
})(H);
var C = {};
Object.defineProperty(C, "__esModule", { value: !0 });
C.checkStrictMode = C.getErrorPath = C.Type = C.useFunc = C.setEvaluated = C.evaluatedPropsToName = C.mergeEvaluated = C.eachItem = C.unescapeJsonPointer = C.escapeJsonPointer = C.escapeFragment = C.unescapeFragment = C.schemaRefOrVal = C.schemaHasRulesButRef = C.schemaHasRules = C.checkUnknownRules = C.alwaysValidSchema = C.toHash = void 0;
const re = H, fc = Zt;
function hc(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
C.toHash = hc;
function mc(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (io(e, t), !co(t, e.self.RULES.all));
}
C.alwaysValidSchema = mc;
function io(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in t)
    s[a] || fo(e, `unknown keyword: "${a}"`);
}
C.checkUnknownRules = io;
function co(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
C.schemaHasRules = co;
function pc(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
C.schemaHasRulesButRef = pc;
function $c({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, re._)`${r}`;
  }
  return (0, re._)`${e}${t}${(0, re.getProperty)(n)}`;
}
C.schemaRefOrVal = $c;
function yc(e) {
  return lo(decodeURIComponent(e));
}
C.unescapeFragment = yc;
function gc(e) {
  return encodeURIComponent(jn(e));
}
C.escapeFragment = gc;
function jn(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
C.escapeJsonPointer = jn;
function lo(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
C.unescapeJsonPointer = lo;
function vc(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
C.eachItem = vc;
function Js({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, a, i, c) => {
    const o = i === void 0 ? a : i instanceof re.Name ? (a instanceof re.Name ? e(s, a, i) : t(s, a, i), i) : a instanceof re.Name ? (t(s, i, a), a) : r(a, i);
    return c === re.Name && !(o instanceof re.Name) ? n(s, o) : o;
  };
}
C.mergeEvaluated = {
  props: Js({
    mergeNames: (e, t, r) => e.if((0, re._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, re._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, re._)`${r} || {}`).code((0, re._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, re._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, re._)`${r} || {}`), An(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: uo
  }),
  items: Js({
    mergeNames: (e, t, r) => e.if((0, re._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, re._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, re._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, re._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function uo(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, re._)`{}`);
  return t !== void 0 && An(e, r, t), r;
}
C.evaluatedPropsToName = uo;
function An(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, re._)`${t}${(0, re.getProperty)(n)}`, !0));
}
C.setEvaluated = An;
const xs = {};
function _c(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: xs[t.code] || (xs[t.code] = new fc._Code(t.code))
  });
}
C.useFunc = _c;
var mn;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(mn || (C.Type = mn = {}));
function Ec(e, t, r) {
  if (e instanceof re.Name) {
    const n = t === mn.Num;
    return r ? n ? (0, re._)`"[" + ${e} + "]"` : (0, re._)`"['" + ${e} + "']"` : n ? (0, re._)`"/" + ${e}` : (0, re._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, re.getProperty)(e).toString() : "/" + jn(e);
}
C.getErrorPath = Ec;
function fo(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
C.checkStrictMode = fo;
var or = {}, Ys;
function Le() {
  if (Ys) return or;
  Ys = 1, Object.defineProperty(or, "__esModule", { value: !0 });
  const e = H, t = {
    // validation function arguments
    data: new e.Name("data"),
    // data passed to validation function
    // args passed from referencing schema
    valCxt: new e.Name("valCxt"),
    // validation/data context - should not be used directly, it is destructured to the names below
    instancePath: new e.Name("instancePath"),
    parentData: new e.Name("parentData"),
    parentDataProperty: new e.Name("parentDataProperty"),
    rootData: new e.Name("rootData"),
    // root data - same as the data passed to the first/top validation function
    dynamicAnchors: new e.Name("dynamicAnchors"),
    // used to support recursiveRef and dynamicRef
    // function scoped variables
    vErrors: new e.Name("vErrors"),
    // null or array of validation errors
    errors: new e.Name("errors"),
    // counter of validation errors
    this: new e.Name("this"),
    // "globals"
    self: new e.Name("self"),
    scope: new e.Name("scope"),
    // JTD serialize/parse name for JSON string and position
    json: new e.Name("json"),
    jsonPos: new e.Name("jsonPos"),
    jsonLen: new e.Name("jsonLen"),
    jsonPart: new e.Name("jsonPart")
  };
  return or.default = t, or;
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = H, r = C, n = Le();
  e.keywordError = {
    message: ({ keyword: w }) => (0, t.str)`must pass "${w}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: w, schemaType: p }) => p ? (0, t.str)`"${w}" keyword must be ${p} ($data)` : (0, t.str)`"${w}" keyword is invalid ($data)`
  };
  function s(w, p = e.keywordError, S, N) {
    const { it: j } = w, { gen: D, compositeRule: Z, allErrors: ee } = j, ie = f(w, p, S);
    N ?? (Z || ee) ? o(D, ie) : u(j, (0, t._)`[${ie}]`);
  }
  e.reportError = s;
  function a(w, p = e.keywordError, S) {
    const { it: N } = w, { gen: j, compositeRule: D, allErrors: Z } = N, ee = f(w, p, S);
    o(j, ee), D || Z || u(N, n.default.vErrors);
  }
  e.reportExtraError = a;
  function i(w, p) {
    w.assign(n.default.errors, p), w.if((0, t._)`${n.default.vErrors} !== null`, () => w.if(p, () => w.assign((0, t._)`${n.default.vErrors}.length`, p), () => w.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = i;
  function c({ gen: w, keyword: p, schemaValue: S, data: N, errsCount: j, it: D }) {
    if (j === void 0)
      throw new Error("ajv implementation error");
    const Z = w.name("err");
    w.forRange("i", j, n.default.errors, (ee) => {
      w.const(Z, (0, t._)`${n.default.vErrors}[${ee}]`), w.if((0, t._)`${Z}.instancePath === undefined`, () => w.assign((0, t._)`${Z}.instancePath`, (0, t.strConcat)(n.default.instancePath, D.errorPath))), w.assign((0, t._)`${Z}.schemaPath`, (0, t.str)`${D.errSchemaPath}/${p}`), D.opts.verbose && (w.assign((0, t._)`${Z}.schema`, S), w.assign((0, t._)`${Z}.data`, N));
    });
  }
  e.extendErrors = c;
  function o(w, p) {
    const S = w.const("err", p);
    w.if((0, t._)`${n.default.vErrors} === null`, () => w.assign(n.default.vErrors, (0, t._)`[${S}]`), (0, t._)`${n.default.vErrors}.push(${S})`), w.code((0, t._)`${n.default.errors}++`);
  }
  function u(w, p) {
    const { gen: S, validateName: N, schemaEnv: j } = w;
    j.$async ? S.throw((0, t._)`new ${w.ValidationError}(${p})`) : (S.assign((0, t._)`${N}.errors`, p), S.return(!1));
  }
  const l = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    // also used in JTD errors
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function f(w, p, S) {
    const { createErrors: N } = w.it;
    return N === !1 ? (0, t._)`{}` : g(w, p, S);
  }
  function g(w, p, S = {}) {
    const { gen: N, it: j } = w, D = [
      m(j, S),
      v(w, S)
    ];
    return $(w, p, D), N.object(...D);
  }
  function m({ errorPath: w }, { instancePath: p }) {
    const S = p ? (0, t.str)`${w}${(0, r.getErrorPath)(p, r.Type.Str)}` : w;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, S)];
  }
  function v({ keyword: w, it: { errSchemaPath: p } }, { schemaPath: S, parentSchema: N }) {
    let j = N ? p : (0, t.str)`${p}/${w}`;
    return S && (j = (0, t.str)`${j}${(0, r.getErrorPath)(S, r.Type.Str)}`), [l.schemaPath, j];
  }
  function $(w, { params: p, message: S }, N) {
    const { keyword: j, data: D, schemaValue: Z, it: ee } = w, { opts: ie, propertyName: pe, topSchemaRef: ve, schemaPath: z } = ee;
    N.push([l.keyword, j], [l.params, typeof p == "function" ? p(w) : p || (0, t._)`{}`]), ie.messages && N.push([l.message, typeof S == "function" ? S(w) : S]), ie.verbose && N.push([l.schema, Z], [l.parentSchema, (0, t._)`${ve}${z}`], [n.default.data, D]), pe && N.push([l.propertyName, pe]);
  }
})(tr);
var Zs;
function wc() {
  if (Zs) return at;
  Zs = 1, Object.defineProperty(at, "__esModule", { value: !0 }), at.boolOrEmptySchema = at.topBoolOrEmptySchema = void 0;
  const e = tr, t = H, r = Le(), n = {
    message: "boolean schema is false"
  };
  function s(c) {
    const { gen: o, schema: u, validateName: l } = c;
    u === !1 ? i(c, !1) : typeof u == "object" && u.$async === !0 ? o.return(r.default.data) : (o.assign((0, t._)`${l}.errors`, null), o.return(!0));
  }
  at.topBoolOrEmptySchema = s;
  function a(c, o) {
    const { gen: u, schema: l } = c;
    l === !1 ? (u.var(o, !1), i(c)) : u.var(o, !0);
  }
  at.boolOrEmptySchema = a;
  function i(c, o) {
    const { gen: u, data: l } = c, f = {
      gen: u,
      keyword: "false schema",
      data: l,
      schema: !1,
      schemaCode: !1,
      schemaValue: !1,
      params: {},
      it: c
    };
    (0, e.reportError)(f, n, void 0, o);
  }
  return at;
}
var ce = {}, ht = {};
Object.defineProperty(ht, "__esModule", { value: !0 });
ht.getRules = ht.isJSONType = void 0;
const bc = ["string", "number", "integer", "boolean", "null", "object", "array"], Sc = new Set(bc);
function Pc(e) {
  return typeof e == "string" && Sc.has(e);
}
ht.isJSONType = Pc;
function Rc() {
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
ht.getRules = Rc;
var Xe = {};
Object.defineProperty(Xe, "__esModule", { value: !0 });
Xe.shouldUseRule = Xe.shouldUseGroup = Xe.schemaHasRulesForType = void 0;
function Ic({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && ho(e, n);
}
Xe.schemaHasRulesForType = Ic;
function ho(e, t) {
  return t.rules.some((r) => mo(e, r));
}
Xe.shouldUseGroup = ho;
function mo(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
Xe.shouldUseRule = mo;
Object.defineProperty(ce, "__esModule", { value: !0 });
ce.reportTypeError = ce.checkDataTypes = ce.checkDataType = ce.coerceAndCheckDataType = ce.getJSONTypes = ce.getSchemaTypes = ce.DataType = void 0;
const Nc = ht, Oc = Xe, Tc = tr, W = H, po = C;
var bt;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(bt || (ce.DataType = bt = {}));
function jc(e) {
  const t = $o(e.type);
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
ce.getSchemaTypes = jc;
function $o(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(Nc.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
ce.getJSONTypes = $o;
function Ac(e, t) {
  const { gen: r, data: n, opts: s } = e, a = kc(t, s.coerceTypes), i = t.length > 0 && !(a.length === 0 && t.length === 1 && (0, Oc.schemaHasRulesForType)(e, t[0]));
  if (i) {
    const c = kn(t, n, s.strictNumbers, bt.Wrong);
    r.if(c, () => {
      a.length ? Cc(e, t, a) : Cn(e);
    });
  }
  return i;
}
ce.coerceAndCheckDataType = Ac;
const yo = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function kc(e, t) {
  return t ? e.filter((r) => yo.has(r) || t === "array" && r === "array") : [];
}
function Cc(e, t, r) {
  const { gen: n, data: s, opts: a } = e, i = n.let("dataType", (0, W._)`typeof ${s}`), c = n.let("coerced", (0, W._)`undefined`);
  a.coerceTypes === "array" && n.if((0, W._)`${i} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, W._)`${s}[0]`).assign(i, (0, W._)`typeof ${s}`).if(kn(t, s, a.strictNumbers), () => n.assign(c, s))), n.if((0, W._)`${c} !== undefined`);
  for (const u of r)
    (yo.has(u) || u === "array" && a.coerceTypes === "array") && o(u);
  n.else(), Cn(e), n.endIf(), n.if((0, W._)`${c} !== undefined`, () => {
    n.assign(s, c), Dc(e, c);
  });
  function o(u) {
    switch (u) {
      case "string":
        n.elseIf((0, W._)`${i} == "number" || ${i} == "boolean"`).assign(c, (0, W._)`"" + ${s}`).elseIf((0, W._)`${s} === null`).assign(c, (0, W._)`""`);
        return;
      case "number":
        n.elseIf((0, W._)`${i} == "boolean" || ${s} === null
              || (${i} == "string" && ${s} && ${s} == +${s})`).assign(c, (0, W._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, W._)`${i} === "boolean" || ${s} === null
              || (${i} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(c, (0, W._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, W._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(c, !1).elseIf((0, W._)`${s} === "true" || ${s} === 1`).assign(c, !0);
        return;
      case "null":
        n.elseIf((0, W._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(c, null);
        return;
      case "array":
        n.elseIf((0, W._)`${i} === "string" || ${i} === "number"
              || ${i} === "boolean" || ${s} === null`).assign(c, (0, W._)`[${s}]`);
    }
  }
}
function Dc({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, W._)`${t} !== undefined`, () => e.assign((0, W._)`${t}[${r}]`, n));
}
function pn(e, t, r, n = bt.Correct) {
  const s = n === bt.Correct ? W.operators.EQ : W.operators.NEQ;
  let a;
  switch (e) {
    case "null":
      return (0, W._)`${t} ${s} null`;
    case "array":
      a = (0, W._)`Array.isArray(${t})`;
      break;
    case "object":
      a = (0, W._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      a = i((0, W._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      a = i();
      break;
    default:
      return (0, W._)`typeof ${t} ${s} ${e}`;
  }
  return n === bt.Correct ? a : (0, W.not)(a);
  function i(c = W.nil) {
    return (0, W.and)((0, W._)`typeof ${t} == "number"`, c, r ? (0, W._)`isFinite(${t})` : W.nil);
  }
}
ce.checkDataType = pn;
function kn(e, t, r, n) {
  if (e.length === 1)
    return pn(e[0], t, r, n);
  let s;
  const a = (0, po.toHash)(e);
  if (a.array && a.object) {
    const i = (0, W._)`typeof ${t} != "object"`;
    s = a.null ? i : (0, W._)`!${t} || ${i}`, delete a.null, delete a.array, delete a.object;
  } else
    s = W.nil;
  a.number && delete a.integer;
  for (const i in a)
    s = (0, W.and)(s, pn(i, t, r, n));
  return s;
}
ce.checkDataTypes = kn;
const Lc = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, W._)`{type: ${e}}` : (0, W._)`{type: ${t}}`
};
function Cn(e) {
  const t = Mc(e);
  (0, Tc.reportError)(t, Lc);
}
ce.reportTypeError = Cn;
function Mc(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, po.schemaRefOrVal)(e, n, "type");
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
var Ft = {}, Qs;
function Vc() {
  if (Qs) return Ft;
  Qs = 1, Object.defineProperty(Ft, "__esModule", { value: !0 }), Ft.assignDefaults = void 0;
  const e = H, t = C;
  function r(s, a) {
    const { properties: i, items: c } = s.schema;
    if (a === "object" && i)
      for (const o in i)
        n(s, o, i[o].default);
    else a === "array" && Array.isArray(c) && c.forEach((o, u) => n(s, u, o.default));
  }
  Ft.assignDefaults = r;
  function n(s, a, i) {
    const { gen: c, compositeRule: o, data: u, opts: l } = s;
    if (i === void 0)
      return;
    const f = (0, e._)`${u}${(0, e.getProperty)(a)}`;
    if (o) {
      (0, t.checkStrictMode)(s, `default is ignored for: ${f}`);
      return;
    }
    let g = (0, e._)`${f} === undefined`;
    l.useDefaults === "empty" && (g = (0, e._)`${g} || ${f} === null || ${f} === ""`), c.if(g, (0, e._)`${f} = ${(0, e.stringify)(i)}`);
  }
  return Ft;
}
var je = {}, x = {};
Object.defineProperty(x, "__esModule", { value: !0 });
x.validateUnion = x.validateArray = x.usePattern = x.callValidateCode = x.schemaProperties = x.allSchemaProperties = x.noPropertyInData = x.propertyInData = x.isOwnProperty = x.hasPropFunc = x.reportMissingProp = x.checkMissingProp = x.checkReportMissingProp = void 0;
const ne = H, Dn = C, Ze = Le(), Uc = C;
function zc(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(Mn(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, ne._)`${t}` }, !0), e.error();
  });
}
x.checkReportMissingProp = zc;
function Fc({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, ne.or)(...n.map((a) => (0, ne.and)(Mn(e, t, a, r.ownProperties), (0, ne._)`${s} = ${a}`)));
}
x.checkMissingProp = Fc;
function qc(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
x.reportMissingProp = qc;
function go(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, ne._)`Object.prototype.hasOwnProperty`
  });
}
x.hasPropFunc = go;
function Ln(e, t, r) {
  return (0, ne._)`${go(e)}.call(${t}, ${r})`;
}
x.isOwnProperty = Ln;
function Gc(e, t, r, n) {
  const s = (0, ne._)`${t}${(0, ne.getProperty)(r)} !== undefined`;
  return n ? (0, ne._)`${s} && ${Ln(e, t, r)}` : s;
}
x.propertyInData = Gc;
function Mn(e, t, r, n) {
  const s = (0, ne._)`${t}${(0, ne.getProperty)(r)} === undefined`;
  return n ? (0, ne.or)(s, (0, ne.not)(Ln(e, t, r))) : s;
}
x.noPropertyInData = Mn;
function vo(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
x.allSchemaProperties = vo;
function Kc(e, t) {
  return vo(t).filter((r) => !(0, Dn.alwaysValidSchema)(e, t[r]));
}
x.schemaProperties = Kc;
function Hc({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: i }, c, o, u) {
  const l = u ? (0, ne._)`${e}, ${t}, ${n}${s}` : t, f = [
    [Ze.default.instancePath, (0, ne.strConcat)(Ze.default.instancePath, a)],
    [Ze.default.parentData, i.parentData],
    [Ze.default.parentDataProperty, i.parentDataProperty],
    [Ze.default.rootData, Ze.default.rootData]
  ];
  i.opts.dynamicRef && f.push([Ze.default.dynamicAnchors, Ze.default.dynamicAnchors]);
  const g = (0, ne._)`${l}, ${r.object(...f)}`;
  return o !== ne.nil ? (0, ne._)`${c}.call(${o}, ${g})` : (0, ne._)`${c}(${g})`;
}
x.callValidateCode = Hc;
const Xc = (0, ne._)`new RegExp`;
function Bc({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, a = s(r, n);
  return e.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: (0, ne._)`${s.code === "new RegExp" ? Xc : (0, Uc.useFunc)(e, s)}(${r}, ${n})`
  });
}
x.usePattern = Bc;
function Wc(e) {
  const { gen: t, data: r, keyword: n, it: s } = e, a = t.name("valid");
  if (s.allErrors) {
    const c = t.let("valid", !0);
    return i(() => t.assign(c, !1)), c;
  }
  return t.var(a, !0), i(() => t.break()), a;
  function i(c) {
    const o = t.const("len", (0, ne._)`${r}.length`);
    t.forRange("i", 0, o, (u) => {
      e.subschema({
        keyword: n,
        dataProp: u,
        dataPropType: Dn.Type.Num
      }, a), t.if((0, ne.not)(a), c);
    });
  }
}
x.validateArray = Wc;
function Jc(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((o) => (0, Dn.alwaysValidSchema)(s, o)) && !s.opts.unevaluated)
    return;
  const i = t.let("valid", !1), c = t.name("_valid");
  t.block(() => r.forEach((o, u) => {
    const l = e.subschema({
      keyword: n,
      schemaProp: u,
      compositeRule: !0
    }, c);
    t.assign(i, (0, ne._)`${i} || ${c}`), e.mergeValidEvaluated(l, c) || t.if((0, ne.not)(i));
  })), e.result(i, () => e.reset(), () => e.error(!0));
}
x.validateUnion = Jc;
var ea;
function xc() {
  if (ea) return je;
  ea = 1, Object.defineProperty(je, "__esModule", { value: !0 }), je.validateKeywordUsage = je.validSchemaType = je.funcKeywordCode = je.macroKeywordCode = void 0;
  const e = H, t = Le(), r = x, n = tr;
  function s(g, m) {
    const { gen: v, keyword: $, schema: w, parentSchema: p, it: S } = g, N = m.macro.call(S.self, w, p, S), j = u(v, $, N);
    S.opts.validateSchema !== !1 && S.self.validateSchema(N, !0);
    const D = v.name("valid");
    g.subschema({
      schema: N,
      schemaPath: e.nil,
      errSchemaPath: `${S.errSchemaPath}/${$}`,
      topSchemaRef: j,
      compositeRule: !0
    }, D), g.pass(D, () => g.error(!0));
  }
  je.macroKeywordCode = s;
  function a(g, m) {
    var v;
    const { gen: $, keyword: w, schema: p, parentSchema: S, $data: N, it: j } = g;
    o(j, m);
    const D = !N && m.compile ? m.compile.call(j.self, p, S, j) : m.validate, Z = u($, w, D), ee = $.let("valid");
    g.block$data(ee, ie), g.ok((v = m.valid) !== null && v !== void 0 ? v : ee);
    function ie() {
      if (m.errors === !1)
        z(), m.modifying && i(g), K(() => g.error());
      else {
        const X = m.async ? pe() : ve();
        m.modifying && i(g), K(() => c(g, X));
      }
    }
    function pe() {
      const X = $.let("ruleErrs", null);
      return $.try(() => z((0, e._)`await `), (O) => $.assign(ee, !1).if((0, e._)`${O} instanceof ${j.ValidationError}`, () => $.assign(X, (0, e._)`${O}.errors`), () => $.throw(O))), X;
    }
    function ve() {
      const X = (0, e._)`${Z}.errors`;
      return $.assign(X, null), z(e.nil), X;
    }
    function z(X = m.async ? (0, e._)`await ` : e.nil) {
      const O = j.opts.passContext ? t.default.this : t.default.self, A = !("compile" in m && !N || m.schema === !1);
      $.assign(ee, (0, e._)`${X}${(0, r.callValidateCode)(g, Z, O, A)}`, m.modifying);
    }
    function K(X) {
      var O;
      $.if((0, e.not)((O = m.valid) !== null && O !== void 0 ? O : ee), X);
    }
  }
  je.funcKeywordCode = a;
  function i(g) {
    const { gen: m, data: v, it: $ } = g;
    m.if($.parentData, () => m.assign(v, (0, e._)`${$.parentData}[${$.parentDataProperty}]`));
  }
  function c(g, m) {
    const { gen: v } = g;
    v.if((0, e._)`Array.isArray(${m})`, () => {
      v.assign(t.default.vErrors, (0, e._)`${t.default.vErrors} === null ? ${m} : ${t.default.vErrors}.concat(${m})`).assign(t.default.errors, (0, e._)`${t.default.vErrors}.length`), (0, n.extendErrors)(g);
    }, () => g.error());
  }
  function o({ schemaEnv: g }, m) {
    if (m.async && !g.$async)
      throw new Error("async keyword in sync schema");
  }
  function u(g, m, v) {
    if (v === void 0)
      throw new Error(`keyword "${m}" failed to compile`);
    return g.scopeValue("keyword", typeof v == "function" ? { ref: v } : { ref: v, code: (0, e.stringify)(v) });
  }
  function l(g, m, v = !1) {
    return !m.length || m.some(($) => $ === "array" ? Array.isArray(g) : $ === "object" ? g && typeof g == "object" && !Array.isArray(g) : typeof g == $ || v && typeof g > "u");
  }
  je.validSchemaType = l;
  function f({ schema: g, opts: m, self: v, errSchemaPath: $ }, w, p) {
    if (Array.isArray(w.keyword) ? !w.keyword.includes(p) : w.keyword !== p)
      throw new Error("ajv implementation error");
    const S = w.dependencies;
    if (S != null && S.some((N) => !Object.prototype.hasOwnProperty.call(g, N)))
      throw new Error(`parent schema must have dependencies of ${p}: ${S.join(",")}`);
    if (w.validateSchema && !w.validateSchema(g[p])) {
      const j = `keyword "${p}" value is invalid at path "${$}": ` + v.errorsText(w.validateSchema.errors);
      if (m.validateSchema === "log")
        v.logger.error(j);
      else
        throw new Error(j);
    }
  }
  return je.validateKeywordUsage = f, je;
}
var Ge = {}, ta;
function Yc() {
  if (ta) return Ge;
  ta = 1, Object.defineProperty(Ge, "__esModule", { value: !0 }), Ge.extendSubschemaMode = Ge.extendSubschemaData = Ge.getSubschema = void 0;
  const e = H, t = C;
  function r(a, { keyword: i, schemaProp: c, schema: o, schemaPath: u, errSchemaPath: l, topSchemaRef: f }) {
    if (i !== void 0 && o !== void 0)
      throw new Error('both "keyword" and "schema" passed, only one allowed');
    if (i !== void 0) {
      const g = a.schema[i];
      return c === void 0 ? {
        schema: g,
        schemaPath: (0, e._)`${a.schemaPath}${(0, e.getProperty)(i)}`,
        errSchemaPath: `${a.errSchemaPath}/${i}`
      } : {
        schema: g[c],
        schemaPath: (0, e._)`${a.schemaPath}${(0, e.getProperty)(i)}${(0, e.getProperty)(c)}`,
        errSchemaPath: `${a.errSchemaPath}/${i}/${(0, t.escapeFragment)(c)}`
      };
    }
    if (o !== void 0) {
      if (u === void 0 || l === void 0 || f === void 0)
        throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      return {
        schema: o,
        schemaPath: u,
        topSchemaRef: f,
        errSchemaPath: l
      };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  Ge.getSubschema = r;
  function n(a, i, { dataProp: c, dataPropType: o, data: u, dataTypes: l, propertyName: f }) {
    if (u !== void 0 && c !== void 0)
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    const { gen: g } = i;
    if (c !== void 0) {
      const { errorPath: v, dataPathArr: $, opts: w } = i, p = g.let("data", (0, e._)`${i.data}${(0, e.getProperty)(c)}`, !0);
      m(p), a.errorPath = (0, e.str)`${v}${(0, t.getErrorPath)(c, o, w.jsPropertySyntax)}`, a.parentDataProperty = (0, e._)`${c}`, a.dataPathArr = [...$, a.parentDataProperty];
    }
    if (u !== void 0) {
      const v = u instanceof e.Name ? u : g.let("data", u, !0);
      m(v), f !== void 0 && (a.propertyName = f);
    }
    l && (a.dataTypes = l);
    function m(v) {
      a.data = v, a.dataLevel = i.dataLevel + 1, a.dataTypes = [], i.definedProperties = /* @__PURE__ */ new Set(), a.parentData = i.data, a.dataNames = [...i.dataNames, v];
    }
  }
  Ge.extendSubschemaData = n;
  function s(a, { jtdDiscriminator: i, jtdMetadata: c, compositeRule: o, createErrors: u, allErrors: l }) {
    o !== void 0 && (a.compositeRule = o), u !== void 0 && (a.createErrors = u), l !== void 0 && (a.allErrors = l), a.jtdDiscriminator = i, a.jtdMetadata = c;
  }
  return Ge.extendSubschemaMode = s, Ge;
}
var me = {}, _o = function e(t, r) {
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
      var i = a[s];
      if (!e(t[i], r[i])) return !1;
    }
    return !0;
  }
  return t !== t && r !== r;
}, Eo = { exports: {} }, st = Eo.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  _r(t, n, s, e, "", e);
};
st.keywords = {
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
st.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
st.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
st.skipKeywords = {
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
function _r(e, t, r, n, s, a, i, c, o, u) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, a, i, c, o, u);
    for (var l in n) {
      var f = n[l];
      if (Array.isArray(f)) {
        if (l in st.arrayKeywords)
          for (var g = 0; g < f.length; g++)
            _r(e, t, r, f[g], s + "/" + l + "/" + g, a, s, l, n, g);
      } else if (l in st.propsKeywords) {
        if (f && typeof f == "object")
          for (var m in f)
            _r(e, t, r, f[m], s + "/" + l + "/" + Zc(m), a, s, l, n, m);
      } else (l in st.keywords || e.allKeys && !(l in st.skipKeywords)) && _r(e, t, r, f, s + "/" + l, a, s, l, n);
    }
    r(n, s, a, i, c, o, u);
  }
}
function Zc(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var Qc = Eo.exports;
Object.defineProperty(me, "__esModule", { value: !0 });
me.getSchemaRefs = me.resolveUrl = me.normalizeId = me._getFullPath = me.getFullPath = me.inlineRef = void 0;
const el = C, tl = _o, rl = Qc, nl = /* @__PURE__ */ new Set([
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
function sl(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !$n(e) : t ? wo(e) <= t : !1;
}
me.inlineRef = sl;
const al = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function $n(e) {
  for (const t in e) {
    if (al.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some($n) || typeof r == "object" && $n(r))
      return !0;
  }
  return !1;
}
function wo(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !nl.has(r) && (typeof e[r] == "object" && (0, el.eachItem)(e[r], (n) => t += wo(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function bo(e, t = "", r) {
  r !== !1 && (t = St(t));
  const n = e.parse(t);
  return So(e, n);
}
me.getFullPath = bo;
function So(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
me._getFullPath = So;
const ol = /#\/?$/;
function St(e) {
  return e ? e.replace(ol, "") : "";
}
me.normalizeId = St;
function il(e, t, r) {
  return r = St(r), e.resolve(t, r);
}
me.resolveUrl = il;
const cl = /^[a-z_][-a-z0-9._]*$/i;
function ll(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = St(e[r] || t), a = { "": s }, i = bo(n, s, !1), c = {}, o = /* @__PURE__ */ new Set();
  return rl(e, { allKeys: !0 }, (f, g, m, v) => {
    if (v === void 0)
      return;
    const $ = i + g;
    let w = a[v];
    typeof f[r] == "string" && (w = p.call(this, f[r])), S.call(this, f.$anchor), S.call(this, f.$dynamicAnchor), a[g] = w;
    function p(N) {
      const j = this.opts.uriResolver.resolve;
      if (N = St(w ? j(w, N) : N), o.has(N))
        throw l(N);
      o.add(N);
      let D = this.refs[N];
      return typeof D == "string" && (D = this.refs[D]), typeof D == "object" ? u(f, D.schema, N) : N !== St($) && (N[0] === "#" ? (u(f, c[N], N), c[N] = f) : this.refs[N] = $), N;
    }
    function S(N) {
      if (typeof N == "string") {
        if (!cl.test(N))
          throw new Error(`invalid anchor "${N}"`);
        p.call(this, `#${N}`);
      }
    }
  }), c;
  function u(f, g, m) {
    if (g !== void 0 && !tl(f, g))
      throw l(m);
  }
  function l(f) {
    return new Error(`reference "${f}" resolves to more than one schema`);
  }
}
me.getSchemaRefs = ll;
var ra;
function rr() {
  if (ra) return qe;
  ra = 1, Object.defineProperty(qe, "__esModule", { value: !0 }), qe.getData = qe.KeywordCxt = qe.validateFunctionCode = void 0;
  const e = wc(), t = ce, r = Xe, n = ce, s = Vc(), a = xc(), i = Yc(), c = H, o = Le(), u = me, l = C, f = tr;
  function g(_) {
    if (D(_) && (ee(_), j(_))) {
      w(_);
      return;
    }
    m(_, () => (0, e.topBoolOrEmptySchema)(_));
  }
  qe.validateFunctionCode = g;
  function m({ gen: _, validateName: b, schema: T, schemaEnv: k, opts: F }, J) {
    F.code.es5 ? _.func(b, (0, c._)`${o.default.data}, ${o.default.valCxt}`, k.$async, () => {
      _.code((0, c._)`"use strict"; ${S(T, F)}`), $(_, F), _.code(J);
    }) : _.func(b, (0, c._)`${o.default.data}, ${v(F)}`, k.$async, () => _.code(S(T, F)).code(J));
  }
  function v(_) {
    return (0, c._)`{${o.default.instancePath}="", ${o.default.parentData}, ${o.default.parentDataProperty}, ${o.default.rootData}=${o.default.data}${_.dynamicRef ? (0, c._)`, ${o.default.dynamicAnchors}={}` : c.nil}}={}`;
  }
  function $(_, b) {
    _.if(o.default.valCxt, () => {
      _.var(o.default.instancePath, (0, c._)`${o.default.valCxt}.${o.default.instancePath}`), _.var(o.default.parentData, (0, c._)`${o.default.valCxt}.${o.default.parentData}`), _.var(o.default.parentDataProperty, (0, c._)`${o.default.valCxt}.${o.default.parentDataProperty}`), _.var(o.default.rootData, (0, c._)`${o.default.valCxt}.${o.default.rootData}`), b.dynamicRef && _.var(o.default.dynamicAnchors, (0, c._)`${o.default.valCxt}.${o.default.dynamicAnchors}`);
    }, () => {
      _.var(o.default.instancePath, (0, c._)`""`), _.var(o.default.parentData, (0, c._)`undefined`), _.var(o.default.parentDataProperty, (0, c._)`undefined`), _.var(o.default.rootData, o.default.data), b.dynamicRef && _.var(o.default.dynamicAnchors, (0, c._)`{}`);
    });
  }
  function w(_) {
    const { schema: b, opts: T, gen: k } = _;
    m(_, () => {
      T.$comment && b.$comment && X(_), ve(_), k.let(o.default.vErrors, null), k.let(o.default.errors, 0), T.unevaluated && p(_), ie(_), O(_);
    });
  }
  function p(_) {
    const { gen: b, validateName: T } = _;
    _.evaluated = b.const("evaluated", (0, c._)`${T}.evaluated`), b.if((0, c._)`${_.evaluated}.dynamicProps`, () => b.assign((0, c._)`${_.evaluated}.props`, (0, c._)`undefined`)), b.if((0, c._)`${_.evaluated}.dynamicItems`, () => b.assign((0, c._)`${_.evaluated}.items`, (0, c._)`undefined`));
  }
  function S(_, b) {
    const T = typeof _ == "object" && _[b.schemaId];
    return T && (b.code.source || b.code.process) ? (0, c._)`/*# sourceURL=${T} */` : c.nil;
  }
  function N(_, b) {
    if (D(_) && (ee(_), j(_))) {
      Z(_, b);
      return;
    }
    (0, e.boolOrEmptySchema)(_, b);
  }
  function j({ schema: _, self: b }) {
    if (typeof _ == "boolean")
      return !_;
    for (const T in _)
      if (b.RULES.all[T])
        return !0;
    return !1;
  }
  function D(_) {
    return typeof _.schema != "boolean";
  }
  function Z(_, b) {
    const { schema: T, gen: k, opts: F } = _;
    F.$comment && T.$comment && X(_), z(_), K(_);
    const J = k.const("_errs", o.default.errors);
    ie(_, J), k.var(b, (0, c._)`${J} === ${o.default.errors}`);
  }
  function ee(_) {
    (0, l.checkUnknownRules)(_), pe(_);
  }
  function ie(_, b) {
    if (_.opts.jtd)
      return V(_, [], !1, b);
    const T = (0, t.getSchemaTypes)(_.schema), k = (0, t.coerceAndCheckDataType)(_, T);
    V(_, T, !k, b);
  }
  function pe(_) {
    const { schema: b, errSchemaPath: T, opts: k, self: F } = _;
    b.$ref && k.ignoreKeywordsWithRef && (0, l.schemaHasRulesButRef)(b, F.RULES) && F.logger.warn(`$ref: keywords ignored in schema at path "${T}"`);
  }
  function ve(_) {
    const { schema: b, opts: T } = _;
    b.default !== void 0 && T.useDefaults && T.strictSchema && (0, l.checkStrictMode)(_, "default is ignored in the schema root");
  }
  function z(_) {
    const b = _.schema[_.opts.schemaId];
    b && (_.baseId = (0, u.resolveUrl)(_.opts.uriResolver, _.baseId, b));
  }
  function K(_) {
    if (_.schema.$async && !_.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function X({ gen: _, schemaEnv: b, schema: T, errSchemaPath: k, opts: F }) {
    const J = T.$comment;
    if (F.$comment === !0)
      _.code((0, c._)`${o.default.self}.logger.log(${J})`);
    else if (typeof F.$comment == "function") {
      const ue = (0, c.str)`${k}/$comment`, Te = _.scopeValue("root", { ref: b.root });
      _.code((0, c._)`${o.default.self}.opts.$comment(${J}, ${ue}, ${Te}.schema)`);
    }
  }
  function O(_) {
    const { gen: b, schemaEnv: T, validateName: k, ValidationError: F, opts: J } = _;
    T.$async ? b.if((0, c._)`${o.default.errors} === 0`, () => b.return(o.default.data), () => b.throw((0, c._)`new ${F}(${o.default.vErrors})`)) : (b.assign((0, c._)`${k}.errors`, o.default.vErrors), J.unevaluated && A(_), b.return((0, c._)`${o.default.errors} === 0`));
  }
  function A({ gen: _, evaluated: b, props: T, items: k }) {
    T instanceof c.Name && _.assign((0, c._)`${b}.props`, T), k instanceof c.Name && _.assign((0, c._)`${b}.items`, k);
  }
  function V(_, b, T, k) {
    const { gen: F, schema: J, data: ue, allErrors: Te, opts: be, self: Se } = _, { RULES: de } = Se;
    if (J.$ref && (be.ignoreKeywordsWithRef || !(0, l.schemaHasRulesButRef)(J, de))) {
      F.block(() => U(_, "$ref", de.all.$ref.definition));
      return;
    }
    be.jtd || G(_, b), F.block(() => {
      for (const Ne of de.rules)
        $t(Ne);
      $t(de.post);
    });
    function $t(Ne) {
      (0, r.shouldUseGroup)(J, Ne) && (Ne.type ? (F.if((0, n.checkDataType)(Ne.type, ue, be.strictNumbers)), L(_, Ne), b.length === 1 && b[0] === Ne.type && T && (F.else(), (0, n.reportTypeError)(_)), F.endIf()) : L(_, Ne), Te || F.if((0, c._)`${o.default.errors} === ${k || 0}`));
    }
  }
  function L(_, b) {
    const { gen: T, schema: k, opts: { useDefaults: F } } = _;
    F && (0, s.assignDefaults)(_, b.type), T.block(() => {
      for (const J of b.rules)
        (0, r.shouldUseRule)(k, J) && U(_, J.keyword, J.definition, b.type);
    });
  }
  function G(_, b) {
    _.schemaEnv.meta || !_.opts.strictTypes || (M(_, b), _.opts.allowUnionTypes || I(_, b), y(_, _.dataTypes));
  }
  function M(_, b) {
    if (b.length) {
      if (!_.dataTypes.length) {
        _.dataTypes = b;
        return;
      }
      b.forEach((T) => {
        E(_.dataTypes, T) || h(_, `type "${T}" not allowed by context "${_.dataTypes.join(",")}"`);
      }), d(_, b);
    }
  }
  function I(_, b) {
    b.length > 1 && !(b.length === 2 && b.includes("null")) && h(_, "use allowUnionTypes to allow union type keyword");
  }
  function y(_, b) {
    const T = _.self.RULES.all;
    for (const k in T) {
      const F = T[k];
      if (typeof F == "object" && (0, r.shouldUseRule)(_.schema, F)) {
        const { type: J } = F.definition;
        J.length && !J.some((ue) => P(b, ue)) && h(_, `missing type "${J.join(",")}" for keyword "${k}"`);
      }
    }
  }
  function P(_, b) {
    return _.includes(b) || b === "number" && _.includes("integer");
  }
  function E(_, b) {
    return _.includes(b) || b === "integer" && _.includes("number");
  }
  function d(_, b) {
    const T = [];
    for (const k of _.dataTypes)
      E(b, k) ? T.push(k) : b.includes("integer") && k === "number" && T.push("integer");
    _.dataTypes = T;
  }
  function h(_, b) {
    const T = _.schemaEnv.baseId + _.errSchemaPath;
    b += ` at "${T}" (strictTypes)`, (0, l.checkStrictMode)(_, b, _.opts.strictTypes);
  }
  class R {
    constructor(b, T, k) {
      if ((0, a.validateKeywordUsage)(b, T, k), this.gen = b.gen, this.allErrors = b.allErrors, this.keyword = k, this.data = b.data, this.schema = b.schema[k], this.$data = T.$data && b.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, l.schemaRefOrVal)(b, this.schema, k, this.$data), this.schemaType = T.schemaType, this.parentSchema = b.schema, this.params = {}, this.it = b, this.def = T, this.$data)
        this.schemaCode = b.gen.const("vSchema", Q(this.$data, b));
      else if (this.schemaCode = this.schemaValue, !(0, a.validSchemaType)(this.schema, T.schemaType, T.allowUndefined))
        throw new Error(`${k} value must be ${JSON.stringify(T.schemaType)}`);
      ("code" in T ? T.trackErrors : T.errors !== !1) && (this.errsCount = b.gen.const("_errs", o.default.errors));
    }
    result(b, T, k) {
      this.failResult((0, c.not)(b), T, k);
    }
    failResult(b, T, k) {
      this.gen.if(b), k ? k() : this.error(), T ? (this.gen.else(), T(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    pass(b, T) {
      this.failResult((0, c.not)(b), void 0, T);
    }
    fail(b) {
      if (b === void 0) {
        this.error(), this.allErrors || this.gen.if(!1);
        return;
      }
      this.gen.if(b), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    fail$data(b) {
      if (!this.$data)
        return this.fail(b);
      const { schemaCode: T } = this;
      this.fail((0, c._)`${T} !== undefined && (${(0, c.or)(this.invalid$data(), b)})`);
    }
    error(b, T, k) {
      if (T) {
        this.setParams(T), this._error(b, k), this.setParams({});
        return;
      }
      this._error(b, k);
    }
    _error(b, T) {
      (b ? f.reportExtraError : f.reportError)(this, this.def.error, T);
    }
    $dataError() {
      (0, f.reportError)(this, this.def.$dataError || f.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0)
        throw new Error('add "trackErrors" to keyword definition');
      (0, f.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(b) {
      this.allErrors || this.gen.if(b);
    }
    setParams(b, T) {
      T ? Object.assign(this.params, b) : this.params = b;
    }
    block$data(b, T, k = c.nil) {
      this.gen.block(() => {
        this.check$data(b, k), T();
      });
    }
    check$data(b = c.nil, T = c.nil) {
      if (!this.$data)
        return;
      const { gen: k, schemaCode: F, schemaType: J, def: ue } = this;
      k.if((0, c.or)((0, c._)`${F} === undefined`, T)), b !== c.nil && k.assign(b, !0), (J.length || ue.validateSchema) && (k.elseIf(this.invalid$data()), this.$dataError(), b !== c.nil && k.assign(b, !1)), k.else();
    }
    invalid$data() {
      const { gen: b, schemaCode: T, schemaType: k, def: F, it: J } = this;
      return (0, c.or)(ue(), Te());
      function ue() {
        if (k.length) {
          if (!(T instanceof c.Name))
            throw new Error("ajv implementation error");
          const be = Array.isArray(k) ? k : [k];
          return (0, c._)`${(0, n.checkDataTypes)(be, T, J.opts.strictNumbers, n.DataType.Wrong)}`;
        }
        return c.nil;
      }
      function Te() {
        if (F.validateSchema) {
          const be = b.scopeValue("validate$data", { ref: F.validateSchema });
          return (0, c._)`!${be}(${T})`;
        }
        return c.nil;
      }
    }
    subschema(b, T) {
      const k = (0, i.getSubschema)(this.it, b);
      (0, i.extendSubschemaData)(k, this.it, b), (0, i.extendSubschemaMode)(k, b);
      const F = { ...this.it, ...k, items: void 0, props: void 0 };
      return N(F, T), F;
    }
    mergeEvaluated(b, T) {
      const { it: k, gen: F } = this;
      k.opts.unevaluated && (k.props !== !0 && b.props !== void 0 && (k.props = l.mergeEvaluated.props(F, b.props, k.props, T)), k.items !== !0 && b.items !== void 0 && (k.items = l.mergeEvaluated.items(F, b.items, k.items, T)));
    }
    mergeValidEvaluated(b, T) {
      const { it: k, gen: F } = this;
      if (k.opts.unevaluated && (k.props !== !0 || k.items !== !0))
        return F.if(T, () => this.mergeEvaluated(b, c.Name)), !0;
    }
  }
  qe.KeywordCxt = R;
  function U(_, b, T, k) {
    const F = new R(_, T, b);
    "code" in T ? T.code(F, k) : F.$data && T.validate ? (0, a.funcKeywordCode)(F, T) : "macro" in T ? (0, a.macroKeywordCode)(F, T) : (T.compile || T.validate) && (0, a.funcKeywordCode)(F, T);
  }
  const q = /^\/(?:[^~]|~0|~1)*$/, te = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function Q(_, { dataLevel: b, dataNames: T, dataPathArr: k }) {
    let F, J;
    if (_ === "")
      return o.default.rootData;
    if (_[0] === "/") {
      if (!q.test(_))
        throw new Error(`Invalid JSON-pointer: ${_}`);
      F = _, J = o.default.rootData;
    } else {
      const Se = te.exec(_);
      if (!Se)
        throw new Error(`Invalid JSON-pointer: ${_}`);
      const de = +Se[1];
      if (F = Se[2], F === "#") {
        if (de >= b)
          throw new Error(be("property/index", de));
        return k[b - de];
      }
      if (de > b)
        throw new Error(be("data", de));
      if (J = T[b - de], !F)
        return J;
    }
    let ue = J;
    const Te = F.split("/");
    for (const Se of Te)
      Se && (J = (0, c._)`${J}${(0, c.getProperty)((0, l.unescapeJsonPointer)(Se))}`, ue = (0, c._)`${ue} && ${J}`);
    return ue;
    function be(Se, de) {
      return `Cannot access ${Se} ${de} levels up, current level is ${b}`;
    }
  }
  return qe.getData = Q, qe;
}
var Tt = {};
Object.defineProperty(Tt, "__esModule", { value: !0 });
class ul extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
}
Tt.default = ul;
var pt = {};
Object.defineProperty(pt, "__esModule", { value: !0 });
const Qr = me;
class dl extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Qr.resolveUrl)(t, r, n), this.missingSchema = (0, Qr.normalizeId)((0, Qr.getFullPath)(t, this.missingRef));
  }
}
pt.default = dl;
var Ee = {};
Object.defineProperty(Ee, "__esModule", { value: !0 });
Ee.resolveSchema = Ee.getCompilingSchema = Ee.resolveRef = Ee.compileSchema = Ee.SchemaEnv = void 0;
const Ae = H, fl = Tt, ot = Le(), Ce = me, na = C, hl = rr();
class Ar {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, Ce.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
Ee.SchemaEnv = Ar;
function Vn(e) {
  const t = Po.call(this, e);
  if (t)
    return t;
  const r = (0, Ce.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, i = new Ae.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let c;
  e.$async && (c = i.scopeValue("Error", {
    ref: fl.default,
    code: (0, Ae._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const o = i.scopeName("validate");
  e.validateName = o;
  const u = {
    gen: i,
    allErrors: this.opts.allErrors,
    data: ot.default.data,
    parentData: ot.default.parentData,
    parentDataProperty: ot.default.parentDataProperty,
    dataNames: [ot.default.data],
    dataPathArr: [Ae.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: i.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, Ae.stringify)(e.schema) } : { ref: e.schema }),
    validateName: o,
    ValidationError: c,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: Ae.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, Ae._)`""`,
    opts: this.opts,
    self: this
  };
  let l;
  try {
    this._compilations.add(e), (0, hl.validateFunctionCode)(u), i.optimize(this.opts.code.optimize);
    const f = i.toString();
    l = `${i.scopeRefs(ot.default.scope)}return ${f}`, this.opts.code.process && (l = this.opts.code.process(l, e));
    const m = new Function(`${ot.default.self}`, `${ot.default.scope}`, l)(this, this.scope.get());
    if (this.scope.value(o, { ref: m }), m.errors = null, m.schema = e.schema, m.schemaEnv = e, e.$async && (m.$async = !0), this.opts.code.source === !0 && (m.source = { validateName: o, validateCode: f, scopeValues: i._values }), this.opts.unevaluated) {
      const { props: v, items: $ } = u;
      m.evaluated = {
        props: v instanceof Ae.Name ? void 0 : v,
        items: $ instanceof Ae.Name ? void 0 : $,
        dynamicProps: v instanceof Ae.Name,
        dynamicItems: $ instanceof Ae.Name
      }, m.source && (m.source.evaluated = (0, Ae.stringify)(m.evaluated));
    }
    return e.validate = m, e;
  } catch (f) {
    throw delete e.validate, delete e.validateName, l && this.logger.error("Error compiling schema, function code:", l), f;
  } finally {
    this._compilations.delete(e);
  }
}
Ee.compileSchema = Vn;
function ml(e, t, r) {
  var n;
  r = (0, Ce.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let a = yl.call(this, e, r);
  if (a === void 0) {
    const i = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: c } = this.opts;
    i && (a = new Ar({ schema: i, schemaId: c, root: e, baseId: t }));
  }
  if (a !== void 0)
    return e.refs[r] = pl.call(this, a);
}
Ee.resolveRef = ml;
function pl(e) {
  return (0, Ce.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Vn.call(this, e);
}
function Po(e) {
  for (const t of this._compilations)
    if ($l(t, e))
      return t;
}
Ee.getCompilingSchema = Po;
function $l(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function yl(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || kr.call(this, e, t);
}
function kr(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, Ce._getFullPath)(this.opts.uriResolver, r);
  let s = (0, Ce.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return en.call(this, r, e);
  const a = (0, Ce.normalizeId)(n), i = this.refs[a] || this.schemas[a];
  if (typeof i == "string") {
    const c = kr.call(this, e, i);
    return typeof (c == null ? void 0 : c.schema) != "object" ? void 0 : en.call(this, r, c);
  }
  if (typeof (i == null ? void 0 : i.schema) == "object") {
    if (i.validate || Vn.call(this, i), a === (0, Ce.normalizeId)(t)) {
      const { schema: c } = i, { schemaId: o } = this.opts, u = c[o];
      return u && (s = (0, Ce.resolveUrl)(this.opts.uriResolver, s, u)), new Ar({ schema: c, schemaId: o, root: e, baseId: s });
    }
    return en.call(this, r, i);
  }
}
Ee.resolveSchema = kr;
const gl = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function en(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const c of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const o = r[(0, na.unescapeFragment)(c)];
    if (o === void 0)
      return;
    r = o;
    const u = typeof r == "object" && r[this.opts.schemaId];
    !gl.has(c) && u && (t = (0, Ce.resolveUrl)(this.opts.uriResolver, t, u));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, na.schemaHasRulesButRef)(r, this.RULES)) {
    const c = (0, Ce.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    a = kr.call(this, n, c);
  }
  const { schemaId: i } = this.opts;
  if (a = a || new Ar({ schema: r, schemaId: i, root: n, baseId: t }), a.schema !== a.root.schema)
    return a;
}
const vl = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", _l = "Meta-schema for $data reference (JSON AnySchema extension proposal)", El = "object", wl = [
  "$data"
], bl = {
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
}, Sl = !1, Pl = {
  $id: vl,
  description: _l,
  type: El,
  required: wl,
  properties: bl,
  additionalProperties: Sl
};
var Un = {}, Cr = { exports: {} };
const Rl = {
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
var Il = {
  HEX: Rl
};
const { HEX: Nl } = Il, Ol = /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u;
function Ro(e) {
  if (No(e, ".") < 3)
    return { host: e, isIPV4: !1 };
  const t = e.match(Ol) || [], [r] = t;
  return r ? { host: jl(r, "."), isIPV4: !0 } : { host: e, isIPV4: !1 };
}
function sa(e, t = !1) {
  let r = "", n = !0;
  for (const s of e) {
    if (Nl[s] === void 0) return;
    s !== "0" && n === !0 && (n = !1), n || (r += s);
  }
  return t && r.length === 0 && (r = "0"), r;
}
function Tl(e) {
  let t = 0;
  const r = { error: !1, address: "", zone: "" }, n = [], s = [];
  let a = !1, i = !1, c = !1;
  function o() {
    if (s.length) {
      if (a === !1) {
        const u = sa(s);
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
    const l = e[u];
    if (!(l === "[" || l === "]"))
      if (l === ":") {
        if (i === !0 && (c = !0), !o())
          break;
        if (t++, n.push(":"), t > 7) {
          r.error = !0;
          break;
        }
        u - 1 >= 0 && e[u - 1] === ":" && (i = !0);
        continue;
      } else if (l === "%") {
        if (!o())
          break;
        a = !0;
      } else {
        s.push(l);
        continue;
      }
  }
  return s.length && (a ? r.zone = s.join("") : c ? n.push(s.join("")) : n.push(sa(s))), r.address = n.join(""), r;
}
function Io(e) {
  if (No(e, ":") < 2)
    return { host: e, isIPV6: !1 };
  const t = Tl(e);
  if (t.error)
    return { host: e, isIPV6: !1 };
  {
    let r = t.address, n = t.address;
    return t.zone && (r += "%" + t.zone, n += "%25" + t.zone), { host: r, escapedHost: n, isIPV6: !0 };
  }
}
function jl(e, t) {
  let r = "", n = !0;
  const s = e.length;
  for (let a = 0; a < s; a++) {
    const i = e[a];
    i === "0" && n ? (a + 1 <= s && e[a + 1] === t || a + 1 === s) && (r += i, n = !1) : (i === t ? n = !0 : n = !1, r += i);
  }
  return r;
}
function No(e, t) {
  let r = 0;
  for (let n = 0; n < e.length; n++)
    e[n] === t && r++;
  return r;
}
const aa = /^\.\.?\//u, oa = /^\/\.(?:\/|$)/u, ia = /^\/\.\.(?:\/|$)/u, Al = /^\/?(?:.|\n)*?(?=\/|$)/u;
function kl(e) {
  const t = [];
  for (; e.length; )
    if (e.match(aa))
      e = e.replace(aa, "");
    else if (e.match(oa))
      e = e.replace(oa, "/");
    else if (e.match(ia))
      e = e.replace(ia, "/"), t.pop();
    else if (e === "." || e === "..")
      e = "";
    else {
      const r = e.match(Al);
      if (r) {
        const n = r[0];
        e = e.slice(n.length), t.push(n);
      } else
        throw new Error("Unexpected dot segment condition");
    }
  return t.join("");
}
function Cl(e, t) {
  const r = t !== !0 ? escape : unescape;
  return e.scheme !== void 0 && (e.scheme = r(e.scheme)), e.userinfo !== void 0 && (e.userinfo = r(e.userinfo)), e.host !== void 0 && (e.host = r(e.host)), e.path !== void 0 && (e.path = r(e.path)), e.query !== void 0 && (e.query = r(e.query)), e.fragment !== void 0 && (e.fragment = r(e.fragment)), e;
}
function Dl(e) {
  const t = [];
  if (e.userinfo !== void 0 && (t.push(e.userinfo), t.push("@")), e.host !== void 0) {
    let r = unescape(e.host);
    const n = Ro(r);
    if (n.isIPV4)
      r = n.host;
    else {
      const s = Io(n.host);
      s.isIPV6 === !0 ? r = `[${s.escapedHost}]` : r = e.host;
    }
    t.push(r);
  }
  return (typeof e.port == "number" || typeof e.port == "string") && (t.push(":"), t.push(String(e.port))), t.length ? t.join("") : void 0;
}
var Ll = {
  recomposeAuthority: Dl,
  normalizeComponentEncoding: Cl,
  removeDotSegments: kl,
  normalizeIPv4: Ro,
  normalizeIPv6: Io
};
const Ml = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu, Vl = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function Oo(e) {
  return typeof e.secure == "boolean" ? e.secure : String(e.scheme).toLowerCase() === "wss";
}
function To(e) {
  return e.host || (e.error = e.error || "HTTP URIs must have a host."), e;
}
function jo(e) {
  const t = String(e.scheme).toLowerCase() === "https";
  return (e.port === (t ? 443 : 80) || e.port === "") && (e.port = void 0), e.path || (e.path = "/"), e;
}
function Ul(e) {
  return e.secure = Oo(e), e.resourceName = (e.path || "/") + (e.query ? "?" + e.query : ""), e.path = void 0, e.query = void 0, e;
}
function zl(e) {
  if ((e.port === (Oo(e) ? 443 : 80) || e.port === "") && (e.port = void 0), typeof e.secure == "boolean" && (e.scheme = e.secure ? "wss" : "ws", e.secure = void 0), e.resourceName) {
    const [t, r] = e.resourceName.split("?");
    e.path = t && t !== "/" ? t : void 0, e.query = r, e.resourceName = void 0;
  }
  return e.fragment = void 0, e;
}
function Fl(e, t) {
  if (!e.path)
    return e.error = "URN can not be parsed", e;
  const r = e.path.match(Vl);
  if (r) {
    const n = t.scheme || e.scheme || "urn";
    e.nid = r[1].toLowerCase(), e.nss = r[2];
    const s = `${n}:${t.nid || e.nid}`, a = zn[s];
    e.path = void 0, a && (e = a.parse(e, t));
  } else
    e.error = e.error || "URN can not be parsed.";
  return e;
}
function ql(e, t) {
  const r = t.scheme || e.scheme || "urn", n = e.nid.toLowerCase(), s = `${r}:${t.nid || n}`, a = zn[s];
  a && (e = a.serialize(e, t));
  const i = e, c = e.nss;
  return i.path = `${n || t.nid}:${c}`, t.skipEscape = !0, i;
}
function Gl(e, t) {
  const r = e;
  return r.uuid = r.nss, r.nss = void 0, !t.tolerant && (!r.uuid || !Ml.test(r.uuid)) && (r.error = r.error || "UUID is not valid."), r;
}
function Kl(e) {
  const t = e;
  return t.nss = (e.uuid || "").toLowerCase(), t;
}
const Ao = {
  scheme: "http",
  domainHost: !0,
  parse: To,
  serialize: jo
}, Hl = {
  scheme: "https",
  domainHost: Ao.domainHost,
  parse: To,
  serialize: jo
}, Er = {
  scheme: "ws",
  domainHost: !0,
  parse: Ul,
  serialize: zl
}, Xl = {
  scheme: "wss",
  domainHost: Er.domainHost,
  parse: Er.parse,
  serialize: Er.serialize
}, Bl = {
  scheme: "urn",
  parse: Fl,
  serialize: ql,
  skipNormalize: !0
}, Wl = {
  scheme: "urn:uuid",
  parse: Gl,
  serialize: Kl,
  skipNormalize: !0
}, zn = {
  http: Ao,
  https: Hl,
  ws: Er,
  wss: Xl,
  urn: Bl,
  "urn:uuid": Wl
};
var Jl = zn;
const { normalizeIPv6: xl, normalizeIPv4: Yl, removeDotSegments: Kt, recomposeAuthority: Zl, normalizeComponentEncoding: ir } = Ll, Fn = Jl;
function Ql(e, t) {
  return typeof e == "string" ? e = ze(Be(e, t), t) : typeof e == "object" && (e = Be(ze(e, t), t)), e;
}
function eu(e, t, r) {
  const n = Object.assign({ scheme: "null" }, r), s = ko(Be(e, n), Be(t, n), n, !0);
  return ze(s, { ...n, skipEscape: !0 });
}
function ko(e, t, r, n) {
  const s = {};
  return n || (e = Be(ze(e, r), r), t = Be(ze(t, r), r)), r = r || {}, !r.tolerant && t.scheme ? (s.scheme = t.scheme, s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = Kt(t.path || ""), s.query = t.query) : (t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0 ? (s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = Kt(t.path || ""), s.query = t.query) : (t.path ? (t.path.charAt(0) === "/" ? s.path = Kt(t.path) : ((e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0) && !e.path ? s.path = "/" + t.path : e.path ? s.path = e.path.slice(0, e.path.lastIndexOf("/") + 1) + t.path : s.path = t.path, s.path = Kt(s.path)), s.query = t.query) : (s.path = e.path, t.query !== void 0 ? s.query = t.query : s.query = e.query), s.userinfo = e.userinfo, s.host = e.host, s.port = e.port), s.scheme = e.scheme), s.fragment = t.fragment, s;
}
function tu(e, t, r) {
  return typeof e == "string" ? (e = unescape(e), e = ze(ir(Be(e, r), !0), { ...r, skipEscape: !0 })) : typeof e == "object" && (e = ze(ir(e, !0), { ...r, skipEscape: !0 })), typeof t == "string" ? (t = unescape(t), t = ze(ir(Be(t, r), !0), { ...r, skipEscape: !0 })) : typeof t == "object" && (t = ze(ir(t, !0), { ...r, skipEscape: !0 })), e.toLowerCase() === t.toLowerCase();
}
function ze(e, t) {
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
  }, n = Object.assign({}, t), s = [], a = Fn[(n.scheme || r.scheme || "").toLowerCase()];
  a && a.serialize && a.serialize(r, n), r.path !== void 0 && (n.skipEscape ? r.path = unescape(r.path) : (r.path = escape(r.path), r.scheme !== void 0 && (r.path = r.path.split("%3A").join(":")))), n.reference !== "suffix" && r.scheme && s.push(r.scheme, ":");
  const i = Zl(r);
  if (i !== void 0 && (n.reference !== "suffix" && s.push("//"), s.push(i), r.path && r.path.charAt(0) !== "/" && s.push("/")), r.path !== void 0) {
    let c = r.path;
    !n.absolutePath && (!a || !a.absolutePath) && (c = Kt(c)), i === void 0 && (c = c.replace(/^\/\//u, "/%2F")), s.push(c);
  }
  return r.query !== void 0 && s.push("?", r.query), r.fragment !== void 0 && s.push("#", r.fragment), s.join("");
}
const ru = Array.from({ length: 127 }, (e, t) => /[^!"$&'()*+,\-.;=_`a-z{}~]/u.test(String.fromCharCode(t)));
function nu(e) {
  let t = 0;
  for (let r = 0, n = e.length; r < n; ++r)
    if (t = e.charCodeAt(r), t > 126 || ru[t])
      return !0;
  return !1;
}
const su = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function Be(e, t) {
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
  const i = e.match(su);
  if (i) {
    if (n.scheme = i[1], n.userinfo = i[3], n.host = i[4], n.port = parseInt(i[5], 10), n.path = i[6] || "", n.query = i[7], n.fragment = i[8], isNaN(n.port) && (n.port = i[5]), n.host) {
      const o = Yl(n.host);
      if (o.isIPV4 === !1) {
        const u = xl(o.host);
        n.host = u.host.toLowerCase(), a = u.isIPV6;
      } else
        n.host = o.host, a = !0;
    }
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && n.query === void 0 && !n.path ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", r.reference && r.reference !== "suffix" && r.reference !== n.reference && (n.error = n.error || "URI is not a " + r.reference + " reference.");
    const c = Fn[(r.scheme || n.scheme || "").toLowerCase()];
    if (!r.unicodeSupport && (!c || !c.unicodeSupport) && n.host && (r.domainHost || c && c.domainHost) && a === !1 && nu(n.host))
      try {
        n.host = URL.domainToASCII(n.host.toLowerCase());
      } catch (o) {
        n.error = n.error || "Host's domain name can not be converted to ASCII: " + o;
      }
    (!c || c && !c.skipNormalize) && (s && n.scheme !== void 0 && (n.scheme = unescape(n.scheme)), s && n.host !== void 0 && (n.host = unescape(n.host)), n.path && (n.path = escape(unescape(n.path))), n.fragment && (n.fragment = encodeURI(decodeURIComponent(n.fragment)))), c && c.parse && c.parse(n, r);
  } else
    n.error = n.error || "URI can not be parsed.";
  return n;
}
const qn = {
  SCHEMES: Fn,
  normalize: Ql,
  resolve: eu,
  resolveComponents: ko,
  equal: tu,
  serialize: ze,
  parse: Be
};
Cr.exports = qn;
Cr.exports.default = qn;
Cr.exports.fastUri = qn;
var au = Cr.exports;
Object.defineProperty(Un, "__esModule", { value: !0 });
const Co = au;
Co.code = 'require("ajv/dist/runtime/uri").default';
Un.default = Co;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = rr();
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = H;
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
  const n = Tt, s = pt, a = ht, i = Ee, c = H, o = me, u = ce, l = C, f = Pl, g = Un, m = (I, y) => new RegExp(I, y);
  m.code = "new RegExp";
  const v = ["removeAdditional", "useDefaults", "coerceTypes"], $ = /* @__PURE__ */ new Set([
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
  ]), w = {
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
  }, p = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, S = 200;
  function N(I) {
    var y, P, E, d, h, R, U, q, te, Q, _, b, T, k, F, J, ue, Te, be, Se, de, $t, Ne, Wr, Jr;
    const Lt = I.strict, xr = (y = I.code) === null || y === void 0 ? void 0 : y.optimize, Ls = xr === !0 || xr === void 0 ? 1 : xr || 0, Ms = (E = (P = I.code) === null || P === void 0 ? void 0 : P.regExp) !== null && E !== void 0 ? E : m, ai = (d = I.uriResolver) !== null && d !== void 0 ? d : g.default;
    return {
      strictSchema: (R = (h = I.strictSchema) !== null && h !== void 0 ? h : Lt) !== null && R !== void 0 ? R : !0,
      strictNumbers: (q = (U = I.strictNumbers) !== null && U !== void 0 ? U : Lt) !== null && q !== void 0 ? q : !0,
      strictTypes: (Q = (te = I.strictTypes) !== null && te !== void 0 ? te : Lt) !== null && Q !== void 0 ? Q : "log",
      strictTuples: (b = (_ = I.strictTuples) !== null && _ !== void 0 ? _ : Lt) !== null && b !== void 0 ? b : "log",
      strictRequired: (k = (T = I.strictRequired) !== null && T !== void 0 ? T : Lt) !== null && k !== void 0 ? k : !1,
      code: I.code ? { ...I.code, optimize: Ls, regExp: Ms } : { optimize: Ls, regExp: Ms },
      loopRequired: (F = I.loopRequired) !== null && F !== void 0 ? F : S,
      loopEnum: (J = I.loopEnum) !== null && J !== void 0 ? J : S,
      meta: (ue = I.meta) !== null && ue !== void 0 ? ue : !0,
      messages: (Te = I.messages) !== null && Te !== void 0 ? Te : !0,
      inlineRefs: (be = I.inlineRefs) !== null && be !== void 0 ? be : !0,
      schemaId: (Se = I.schemaId) !== null && Se !== void 0 ? Se : "$id",
      addUsedSchema: (de = I.addUsedSchema) !== null && de !== void 0 ? de : !0,
      validateSchema: ($t = I.validateSchema) !== null && $t !== void 0 ? $t : !0,
      validateFormats: (Ne = I.validateFormats) !== null && Ne !== void 0 ? Ne : !0,
      unicodeRegExp: (Wr = I.unicodeRegExp) !== null && Wr !== void 0 ? Wr : !0,
      int32range: (Jr = I.int32range) !== null && Jr !== void 0 ? Jr : !0,
      uriResolver: ai
    };
  }
  class j {
    constructor(y = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), y = this.opts = { ...y, ...N(y) };
      const { es5: P, lines: E } = this.opts.code;
      this.scope = new c.ValueScope({ scope: {}, prefixes: $, es5: P, lines: E }), this.logger = K(y.logger);
      const d = y.validateFormats;
      y.validateFormats = !1, this.RULES = (0, a.getRules)(), D.call(this, w, y, "NOT SUPPORTED"), D.call(this, p, y, "DEPRECATED", "warn"), this._metaOpts = ve.call(this), y.formats && ie.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), y.keywords && pe.call(this, y.keywords), typeof y.meta == "object" && this.addMetaSchema(y.meta), ee.call(this), y.validateFormats = d;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: y, meta: P, schemaId: E } = this.opts;
      let d = f;
      E === "id" && (d = { ...f }, d.id = d.$id, delete d.$id), P && y && this.addMetaSchema(d, d[E], !1);
    }
    defaultMeta() {
      const { meta: y, schemaId: P } = this.opts;
      return this.opts.defaultMeta = typeof y == "object" ? y[P] || y : void 0;
    }
    validate(y, P) {
      let E;
      if (typeof y == "string") {
        if (E = this.getSchema(y), !E)
          throw new Error(`no schema with key or ref "${y}"`);
      } else
        E = this.compile(y);
      const d = E(P);
      return "$async" in E || (this.errors = E.errors), d;
    }
    compile(y, P) {
      const E = this._addSchema(y, P);
      return E.validate || this._compileSchemaEnv(E);
    }
    compileAsync(y, P) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: E } = this.opts;
      return d.call(this, y, P);
      async function d(Q, _) {
        await h.call(this, Q.$schema);
        const b = this._addSchema(Q, _);
        return b.validate || R.call(this, b);
      }
      async function h(Q) {
        Q && !this.getSchema(Q) && await d.call(this, { $ref: Q }, !0);
      }
      async function R(Q) {
        try {
          return this._compileSchemaEnv(Q);
        } catch (_) {
          if (!(_ instanceof s.default))
            throw _;
          return U.call(this, _), await q.call(this, _.missingSchema), R.call(this, Q);
        }
      }
      function U({ missingSchema: Q, missingRef: _ }) {
        if (this.refs[Q])
          throw new Error(`AnySchema ${Q} is loaded but ${_} cannot be resolved`);
      }
      async function q(Q) {
        const _ = await te.call(this, Q);
        this.refs[Q] || await h.call(this, _.$schema), this.refs[Q] || this.addSchema(_, Q, P);
      }
      async function te(Q) {
        const _ = this._loading[Q];
        if (_)
          return _;
        try {
          return await (this._loading[Q] = E(Q));
        } finally {
          delete this._loading[Q];
        }
      }
    }
    // Adds schema to the instance
    addSchema(y, P, E, d = this.opts.validateSchema) {
      if (Array.isArray(y)) {
        for (const R of y)
          this.addSchema(R, void 0, E, d);
        return this;
      }
      let h;
      if (typeof y == "object") {
        const { schemaId: R } = this.opts;
        if (h = y[R], h !== void 0 && typeof h != "string")
          throw new Error(`schema ${R} must be string`);
      }
      return P = (0, o.normalizeId)(P || h), this._checkUnique(P), this.schemas[P] = this._addSchema(y, E, P, d, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(y, P, E = this.opts.validateSchema) {
      return this.addSchema(y, P, !0, E), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(y, P) {
      if (typeof y == "boolean")
        return !0;
      let E;
      if (E = y.$schema, E !== void 0 && typeof E != "string")
        throw new Error("$schema must be a string");
      if (E = E || this.opts.defaultMeta || this.defaultMeta(), !E)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const d = this.validate(E, y);
      if (!d && P) {
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
    getSchema(y) {
      let P;
      for (; typeof (P = Z.call(this, y)) == "string"; )
        y = P;
      if (P === void 0) {
        const { schemaId: E } = this.opts, d = new i.SchemaEnv({ schema: {}, schemaId: E });
        if (P = i.resolveSchema.call(this, d, y), !P)
          return;
        this.refs[y] = P;
      }
      return P.validate || this._compileSchemaEnv(P);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(y) {
      if (y instanceof RegExp)
        return this._removeAllSchemas(this.schemas, y), this._removeAllSchemas(this.refs, y), this;
      switch (typeof y) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const P = Z.call(this, y);
          return typeof P == "object" && this._cache.delete(P.schema), delete this.schemas[y], delete this.refs[y], this;
        }
        case "object": {
          const P = y;
          this._cache.delete(P);
          let E = y[this.opts.schemaId];
          return E && (E = (0, o.normalizeId)(E), delete this.schemas[E], delete this.refs[E]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(y) {
      for (const P of y)
        this.addKeyword(P);
      return this;
    }
    addKeyword(y, P) {
      let E;
      if (typeof y == "string")
        E = y, typeof P == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), P.keyword = E);
      else if (typeof y == "object" && P === void 0) {
        if (P = y, E = P.keyword, Array.isArray(E) && !E.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (O.call(this, E, P), !P)
        return (0, l.eachItem)(E, (h) => A.call(this, h)), this;
      L.call(this, P);
      const d = {
        ...P,
        type: (0, u.getJSONTypes)(P.type),
        schemaType: (0, u.getJSONTypes)(P.schemaType)
      };
      return (0, l.eachItem)(E, d.type.length === 0 ? (h) => A.call(this, h, d) : (h) => d.type.forEach((R) => A.call(this, h, d, R))), this;
    }
    getKeyword(y) {
      const P = this.RULES.all[y];
      return typeof P == "object" ? P.definition : !!P;
    }
    // Remove keyword
    removeKeyword(y) {
      const { RULES: P } = this;
      delete P.keywords[y], delete P.all[y];
      for (const E of P.rules) {
        const d = E.rules.findIndex((h) => h.keyword === y);
        d >= 0 && E.rules.splice(d, 1);
      }
      return this;
    }
    // Add format
    addFormat(y, P) {
      return typeof P == "string" && (P = new RegExp(P)), this.formats[y] = P, this;
    }
    errorsText(y = this.errors, { separator: P = ", ", dataVar: E = "data" } = {}) {
      return !y || y.length === 0 ? "No errors" : y.map((d) => `${E}${d.instancePath} ${d.message}`).reduce((d, h) => d + P + h);
    }
    $dataMetaSchema(y, P) {
      const E = this.RULES.all;
      y = JSON.parse(JSON.stringify(y));
      for (const d of P) {
        const h = d.split("/").slice(1);
        let R = y;
        for (const U of h)
          R = R[U];
        for (const U in E) {
          const q = E[U];
          if (typeof q != "object")
            continue;
          const { $data: te } = q.definition, Q = R[U];
          te && Q && (R[U] = M(Q));
        }
      }
      return y;
    }
    _removeAllSchemas(y, P) {
      for (const E in y) {
        const d = y[E];
        (!P || P.test(E)) && (typeof d == "string" ? delete y[E] : d && !d.meta && (this._cache.delete(d.schema), delete y[E]));
      }
    }
    _addSchema(y, P, E, d = this.opts.validateSchema, h = this.opts.addUsedSchema) {
      let R;
      const { schemaId: U } = this.opts;
      if (typeof y == "object")
        R = y[U];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof y != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let q = this._cache.get(y);
      if (q !== void 0)
        return q;
      E = (0, o.normalizeId)(R || E);
      const te = o.getSchemaRefs.call(this, y, E);
      return q = new i.SchemaEnv({ schema: y, schemaId: U, meta: P, baseId: E, localRefs: te }), this._cache.set(q.schema, q), h && !E.startsWith("#") && (E && this._checkUnique(E), this.refs[E] = q), d && this.validateSchema(y, !0), q;
    }
    _checkUnique(y) {
      if (this.schemas[y] || this.refs[y])
        throw new Error(`schema with key or id "${y}" already exists`);
    }
    _compileSchemaEnv(y) {
      if (y.meta ? this._compileMetaSchema(y) : i.compileSchema.call(this, y), !y.validate)
        throw new Error("ajv implementation error");
      return y.validate;
    }
    _compileMetaSchema(y) {
      const P = this.opts;
      this.opts = this._metaOpts;
      try {
        i.compileSchema.call(this, y);
      } finally {
        this.opts = P;
      }
    }
  }
  j.ValidationError = n.default, j.MissingRefError = s.default, e.default = j;
  function D(I, y, P, E = "error") {
    for (const d in I) {
      const h = d;
      h in y && this.logger[E](`${P}: option ${d}. ${I[h]}`);
    }
  }
  function Z(I) {
    return I = (0, o.normalizeId)(I), this.schemas[I] || this.refs[I];
  }
  function ee() {
    const I = this.opts.schemas;
    if (I)
      if (Array.isArray(I))
        this.addSchema(I);
      else
        for (const y in I)
          this.addSchema(I[y], y);
  }
  function ie() {
    for (const I in this.opts.formats) {
      const y = this.opts.formats[I];
      y && this.addFormat(I, y);
    }
  }
  function pe(I) {
    if (Array.isArray(I)) {
      this.addVocabulary(I);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const y in I) {
      const P = I[y];
      P.keyword || (P.keyword = y), this.addKeyword(P);
    }
  }
  function ve() {
    const I = { ...this.opts };
    for (const y of v)
      delete I[y];
    return I;
  }
  const z = { log() {
  }, warn() {
  }, error() {
  } };
  function K(I) {
    if (I === !1)
      return z;
    if (I === void 0)
      return console;
    if (I.log && I.warn && I.error)
      return I;
    throw new Error("logger must implement log, warn and error methods");
  }
  const X = /^[a-z_$][a-z0-9_$:-]*$/i;
  function O(I, y) {
    const { RULES: P } = this;
    if ((0, l.eachItem)(I, (E) => {
      if (P.keywords[E])
        throw new Error(`Keyword ${E} is already defined`);
      if (!X.test(E))
        throw new Error(`Keyword ${E} has invalid name`);
    }), !!y && y.$data && !("code" in y || "validate" in y))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function A(I, y, P) {
    var E;
    const d = y == null ? void 0 : y.post;
    if (P && d)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: h } = this;
    let R = d ? h.post : h.rules.find(({ type: q }) => q === P);
    if (R || (R = { type: P, rules: [] }, h.rules.push(R)), h.keywords[I] = !0, !y)
      return;
    const U = {
      keyword: I,
      definition: {
        ...y,
        type: (0, u.getJSONTypes)(y.type),
        schemaType: (0, u.getJSONTypes)(y.schemaType)
      }
    };
    y.before ? V.call(this, R, U, y.before) : R.rules.push(U), h.all[I] = U, (E = y.implements) === null || E === void 0 || E.forEach((q) => this.addKeyword(q));
  }
  function V(I, y, P) {
    const E = I.rules.findIndex((d) => d.keyword === P);
    E >= 0 ? I.rules.splice(E, 0, y) : (I.rules.push(y), this.logger.warn(`rule ${P} is not defined`));
  }
  function L(I) {
    let { metaSchema: y } = I;
    y !== void 0 && (I.$data && this.opts.$data && (y = M(y)), I.validateSchema = this.compile(y, !0));
  }
  const G = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function M(I) {
    return { anyOf: [I, G] };
  }
})(Tn);
var Gn = {}, Dr = {}, Kn = {};
Object.defineProperty(Kn, "__esModule", { value: !0 });
const ou = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
Kn.default = ou;
var We = {};
Object.defineProperty(We, "__esModule", { value: !0 });
We.callRef = We.getValidate = void 0;
const iu = pt, ca = x, Pe = H, yt = Le(), la = Ee, cr = C, cu = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: a, validateName: i, opts: c, self: o } = n, { root: u } = a;
    if ((r === "#" || r === "#/") && s === u.baseId)
      return f();
    const l = la.resolveRef.call(o, u, s, r);
    if (l === void 0)
      throw new iu.default(n.opts.uriResolver, s, r);
    if (l instanceof la.SchemaEnv)
      return g(l);
    return m(l);
    function f() {
      if (a === u)
        return wr(e, i, a, a.$async);
      const v = t.scopeValue("root", { ref: u });
      return wr(e, (0, Pe._)`${v}.validate`, u, u.$async);
    }
    function g(v) {
      const $ = Do(e, v);
      wr(e, $, v, v.$async);
    }
    function m(v) {
      const $ = t.scopeValue("schema", c.code.source === !0 ? { ref: v, code: (0, Pe.stringify)(v) } : { ref: v }), w = t.name("valid"), p = e.subschema({
        schema: v,
        dataTypes: [],
        schemaPath: Pe.nil,
        topSchemaRef: $,
        errSchemaPath: r
      }, w);
      e.mergeEvaluated(p), e.ok(w);
    }
  }
};
function Do(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, Pe._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
We.getValidate = Do;
function wr(e, t, r, n) {
  const { gen: s, it: a } = e, { allErrors: i, schemaEnv: c, opts: o } = a, u = o.passContext ? yt.default.this : Pe.nil;
  n ? l() : f();
  function l() {
    if (!c.$async)
      throw new Error("async schema referenced by sync schema");
    const v = s.let("valid");
    s.try(() => {
      s.code((0, Pe._)`await ${(0, ca.callValidateCode)(e, t, u)}`), m(t), i || s.assign(v, !0);
    }, ($) => {
      s.if((0, Pe._)`!(${$} instanceof ${a.ValidationError})`, () => s.throw($)), g($), i || s.assign(v, !1);
    }), e.ok(v);
  }
  function f() {
    e.result((0, ca.callValidateCode)(e, t, u), () => m(t), () => g(t));
  }
  function g(v) {
    const $ = (0, Pe._)`${v}.errors`;
    s.assign(yt.default.vErrors, (0, Pe._)`${yt.default.vErrors} === null ? ${$} : ${yt.default.vErrors}.concat(${$})`), s.assign(yt.default.errors, (0, Pe._)`${yt.default.vErrors}.length`);
  }
  function m(v) {
    var $;
    if (!a.opts.unevaluated)
      return;
    const w = ($ = r == null ? void 0 : r.validate) === null || $ === void 0 ? void 0 : $.evaluated;
    if (a.props !== !0)
      if (w && !w.dynamicProps)
        w.props !== void 0 && (a.props = cr.mergeEvaluated.props(s, w.props, a.props));
      else {
        const p = s.var("props", (0, Pe._)`${v}.evaluated.props`);
        a.props = cr.mergeEvaluated.props(s, p, a.props, Pe.Name);
      }
    if (a.items !== !0)
      if (w && !w.dynamicItems)
        w.items !== void 0 && (a.items = cr.mergeEvaluated.items(s, w.items, a.items));
      else {
        const p = s.var("items", (0, Pe._)`${v}.evaluated.items`);
        a.items = cr.mergeEvaluated.items(s, p, a.items, Pe.Name);
      }
  }
}
We.callRef = wr;
We.default = cu;
Object.defineProperty(Dr, "__esModule", { value: !0 });
const lu = Kn, uu = We, du = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  lu.default,
  uu.default
];
Dr.default = du;
var Lr = {}, Hn = {};
Object.defineProperty(Hn, "__esModule", { value: !0 });
const Ir = H, Qe = Ir.operators, Nr = {
  maximum: { okStr: "<=", ok: Qe.LTE, fail: Qe.GT },
  minimum: { okStr: ">=", ok: Qe.GTE, fail: Qe.LT },
  exclusiveMaximum: { okStr: "<", ok: Qe.LT, fail: Qe.GTE },
  exclusiveMinimum: { okStr: ">", ok: Qe.GT, fail: Qe.LTE }
}, fu = {
  message: ({ keyword: e, schemaCode: t }) => (0, Ir.str)`must be ${Nr[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, Ir._)`{comparison: ${Nr[e].okStr}, limit: ${t}}`
}, hu = {
  keyword: Object.keys(Nr),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: fu,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, Ir._)`${r} ${Nr[t].fail} ${n} || isNaN(${r})`);
  }
};
Hn.default = hu;
var Xn = {};
Object.defineProperty(Xn, "__esModule", { value: !0 });
const Wt = H, mu = {
  message: ({ schemaCode: e }) => (0, Wt.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, Wt._)`{multipleOf: ${e}}`
}, pu = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: mu,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, a = s.opts.multipleOfPrecision, i = t.let("res"), c = a ? (0, Wt._)`Math.abs(Math.round(${i}) - ${i}) > 1e-${a}` : (0, Wt._)`${i} !== parseInt(${i})`;
    e.fail$data((0, Wt._)`(${n} === 0 || (${i} = ${r}/${n}, ${c}))`);
  }
};
Xn.default = pu;
var Bn = {}, Wn = {};
Object.defineProperty(Wn, "__esModule", { value: !0 });
function Lo(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
Wn.default = Lo;
Lo.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Bn, "__esModule", { value: !0 });
const it = H, $u = C, yu = Wn, gu = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, it.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, it._)`{limit: ${e}}`
}, vu = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: gu,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, a = t === "maxLength" ? it.operators.GT : it.operators.LT, i = s.opts.unicode === !1 ? (0, it._)`${r}.length` : (0, it._)`${(0, $u.useFunc)(e.gen, yu.default)}(${r})`;
    e.fail$data((0, it._)`${i} ${a} ${n}`);
  }
};
Bn.default = vu;
var Jn = {};
Object.defineProperty(Jn, "__esModule", { value: !0 });
const _u = x, Or = H, Eu = {
  message: ({ schemaCode: e }) => (0, Or.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, Or._)`{pattern: ${e}}`
}, wu = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: Eu,
  code(e) {
    const { data: t, $data: r, schema: n, schemaCode: s, it: a } = e, i = a.opts.unicodeRegExp ? "u" : "", c = r ? (0, Or._)`(new RegExp(${s}, ${i}))` : (0, _u.usePattern)(e, n);
    e.fail$data((0, Or._)`!${c}.test(${t})`);
  }
};
Jn.default = wu;
var xn = {};
Object.defineProperty(xn, "__esModule", { value: !0 });
const Jt = H, bu = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, Jt.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, Jt._)`{limit: ${e}}`
}, Su = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: bu,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? Jt.operators.GT : Jt.operators.LT;
    e.fail$data((0, Jt._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
xn.default = Su;
var Yn = {};
Object.defineProperty(Yn, "__esModule", { value: !0 });
const qt = x, xt = H, Pu = C, Ru = {
  message: ({ params: { missingProperty: e } }) => (0, xt.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, xt._)`{missingProperty: ${e}}`
}, Iu = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: Ru,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: a, it: i } = e, { opts: c } = i;
    if (!a && r.length === 0)
      return;
    const o = r.length >= c.loopRequired;
    if (i.allErrors ? u() : l(), c.strictRequired) {
      const m = e.parentSchema.properties, { definedProperties: v } = e.it;
      for (const $ of r)
        if ((m == null ? void 0 : m[$]) === void 0 && !v.has($)) {
          const w = i.schemaEnv.baseId + i.errSchemaPath, p = `required property "${$}" is not defined at "${w}" (strictRequired)`;
          (0, Pu.checkStrictMode)(i, p, i.opts.strictRequired);
        }
    }
    function u() {
      if (o || a)
        e.block$data(xt.nil, f);
      else
        for (const m of r)
          (0, qt.checkReportMissingProp)(e, m);
    }
    function l() {
      const m = t.let("missing");
      if (o || a) {
        const v = t.let("valid", !0);
        e.block$data(v, () => g(m, v)), e.ok(v);
      } else
        t.if((0, qt.checkMissingProp)(e, r, m)), (0, qt.reportMissingProp)(e, m), t.else();
    }
    function f() {
      t.forOf("prop", n, (m) => {
        e.setParams({ missingProperty: m }), t.if((0, qt.noPropertyInData)(t, s, m, c.ownProperties), () => e.error());
      });
    }
    function g(m, v) {
      e.setParams({ missingProperty: m }), t.forOf(m, n, () => {
        t.assign(v, (0, qt.propertyInData)(t, s, m, c.ownProperties)), t.if((0, xt.not)(v), () => {
          e.error(), t.break();
        });
      }, xt.nil);
    }
  }
};
Yn.default = Iu;
var Zn = {};
Object.defineProperty(Zn, "__esModule", { value: !0 });
const Yt = H, Nu = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, Yt.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, Yt._)`{limit: ${e}}`
}, Ou = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: Nu,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? Yt.operators.GT : Yt.operators.LT;
    e.fail$data((0, Yt._)`${r}.length ${s} ${n}`);
  }
};
Zn.default = Ou;
var Qn = {}, nr = {};
Object.defineProperty(nr, "__esModule", { value: !0 });
const Mo = _o;
Mo.code = 'require("ajv/dist/runtime/equal").default';
nr.default = Mo;
Object.defineProperty(Qn, "__esModule", { value: !0 });
const tn = ce, fe = H, Tu = C, ju = nr, Au = {
  message: ({ params: { i: e, j: t } }) => (0, fe.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, fe._)`{i: ${e}, j: ${t}}`
}, ku = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Au,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: a, schemaCode: i, it: c } = e;
    if (!n && !s)
      return;
    const o = t.let("valid"), u = a.items ? (0, tn.getSchemaTypes)(a.items) : [];
    e.block$data(o, l, (0, fe._)`${i} === false`), e.ok(o);
    function l() {
      const v = t.let("i", (0, fe._)`${r}.length`), $ = t.let("j");
      e.setParams({ i: v, j: $ }), t.assign(o, !0), t.if((0, fe._)`${v} > 1`, () => (f() ? g : m)(v, $));
    }
    function f() {
      return u.length > 0 && !u.some((v) => v === "object" || v === "array");
    }
    function g(v, $) {
      const w = t.name("item"), p = (0, tn.checkDataTypes)(u, w, c.opts.strictNumbers, tn.DataType.Wrong), S = t.const("indices", (0, fe._)`{}`);
      t.for((0, fe._)`;${v}--;`, () => {
        t.let(w, (0, fe._)`${r}[${v}]`), t.if(p, (0, fe._)`continue`), u.length > 1 && t.if((0, fe._)`typeof ${w} == "string"`, (0, fe._)`${w} += "_"`), t.if((0, fe._)`typeof ${S}[${w}] == "number"`, () => {
          t.assign($, (0, fe._)`${S}[${w}]`), e.error(), t.assign(o, !1).break();
        }).code((0, fe._)`${S}[${w}] = ${v}`);
      });
    }
    function m(v, $) {
      const w = (0, Tu.useFunc)(t, ju.default), p = t.name("outer");
      t.label(p).for((0, fe._)`;${v}--;`, () => t.for((0, fe._)`${$} = ${v}; ${$}--;`, () => t.if((0, fe._)`${w}(${r}[${v}], ${r}[${$}])`, () => {
        e.error(), t.assign(o, !1).break(p);
      })));
    }
  }
};
Qn.default = ku;
var es = {};
Object.defineProperty(es, "__esModule", { value: !0 });
const yn = H, Cu = C, Du = nr, Lu = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, yn._)`{allowedValue: ${e}}`
}, Mu = {
  keyword: "const",
  $data: !0,
  error: Lu,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: a } = e;
    n || a && typeof a == "object" ? e.fail$data((0, yn._)`!${(0, Cu.useFunc)(t, Du.default)}(${r}, ${s})`) : e.fail((0, yn._)`${a} !== ${r}`);
  }
};
es.default = Mu;
var ts = {};
Object.defineProperty(ts, "__esModule", { value: !0 });
const Ht = H, Vu = C, Uu = nr, zu = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Ht._)`{allowedValues: ${e}}`
}, Fu = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: zu,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: i } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const c = s.length >= i.opts.loopEnum;
    let o;
    const u = () => o ?? (o = (0, Vu.useFunc)(t, Uu.default));
    let l;
    if (c || n)
      l = t.let("valid"), e.block$data(l, f);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const m = t.const("vSchema", a);
      l = (0, Ht.or)(...s.map((v, $) => g(m, $)));
    }
    e.pass(l);
    function f() {
      t.assign(l, !1), t.forOf("v", a, (m) => t.if((0, Ht._)`${u()}(${r}, ${m})`, () => t.assign(l, !0).break()));
    }
    function g(m, v) {
      const $ = s[v];
      return typeof $ == "object" && $ !== null ? (0, Ht._)`${u()}(${r}, ${m}[${v}])` : (0, Ht._)`${r} === ${$}`;
    }
  }
};
ts.default = Fu;
Object.defineProperty(Lr, "__esModule", { value: !0 });
const qu = Hn, Gu = Xn, Ku = Bn, Hu = Jn, Xu = xn, Bu = Yn, Wu = Zn, Ju = Qn, xu = es, Yu = ts, Zu = [
  // number
  qu.default,
  Gu.default,
  // string
  Ku.default,
  Hu.default,
  // object
  Xu.default,
  Bu.default,
  // array
  Wu.default,
  Ju.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  xu.default,
  Yu.default
];
Lr.default = Zu;
var Mr = {}, jt = {};
Object.defineProperty(jt, "__esModule", { value: !0 });
jt.validateAdditionalItems = void 0;
const ct = H, gn = C, Qu = {
  message: ({ params: { len: e } }) => (0, ct.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, ct._)`{limit: ${e}}`
}, ed = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: Qu,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, gn.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Vo(e, n);
  }
};
function Vo(e, t) {
  const { gen: r, schema: n, data: s, keyword: a, it: i } = e;
  i.items = !0;
  const c = r.const("len", (0, ct._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, ct._)`${c} <= ${t.length}`);
  else if (typeof n == "object" && !(0, gn.alwaysValidSchema)(i, n)) {
    const u = r.var("valid", (0, ct._)`${c} <= ${t.length}`);
    r.if((0, ct.not)(u), () => o(u)), e.ok(u);
  }
  function o(u) {
    r.forRange("i", t.length, c, (l) => {
      e.subschema({ keyword: a, dataProp: l, dataPropType: gn.Type.Num }, u), i.allErrors || r.if((0, ct.not)(u), () => r.break());
    });
  }
}
jt.validateAdditionalItems = Vo;
jt.default = ed;
var rs = {}, At = {};
Object.defineProperty(At, "__esModule", { value: !0 });
At.validateTuple = void 0;
const ua = H, br = C, td = x, rd = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return Uo(e, "additionalItems", t);
    r.items = !0, !(0, br.alwaysValidSchema)(r, t) && e.ok((0, td.validateArray)(e));
  }
};
function Uo(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: i, it: c } = e;
  l(s), c.opts.unevaluated && r.length && c.items !== !0 && (c.items = br.mergeEvaluated.items(n, r.length, c.items));
  const o = n.name("valid"), u = n.const("len", (0, ua._)`${a}.length`);
  r.forEach((f, g) => {
    (0, br.alwaysValidSchema)(c, f) || (n.if((0, ua._)`${u} > ${g}`, () => e.subschema({
      keyword: i,
      schemaProp: g,
      dataProp: g
    }, o)), e.ok(o));
  });
  function l(f) {
    const { opts: g, errSchemaPath: m } = c, v = r.length, $ = v === f.minItems && (v === f.maxItems || f[t] === !1);
    if (g.strictTuples && !$) {
      const w = `"${i}" is ${v}-tuple, but minItems or maxItems/${t} are not specified or different at path "${m}"`;
      (0, br.checkStrictMode)(c, w, g.strictTuples);
    }
  }
}
At.validateTuple = Uo;
At.default = rd;
Object.defineProperty(rs, "__esModule", { value: !0 });
const nd = At, sd = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, nd.validateTuple)(e, "items")
};
rs.default = sd;
var ns = {};
Object.defineProperty(ns, "__esModule", { value: !0 });
const da = H, ad = C, od = x, id = jt, cd = {
  message: ({ params: { len: e } }) => (0, da.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, da._)`{limit: ${e}}`
}, ld = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: cd,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, ad.alwaysValidSchema)(n, t) && (s ? (0, id.validateAdditionalItems)(e, s) : e.ok((0, od.validateArray)(e)));
  }
};
ns.default = ld;
var ss = {};
Object.defineProperty(ss, "__esModule", { value: !0 });
const Oe = H, lr = C, ud = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Oe.str)`must contain at least ${e} valid item(s)` : (0, Oe.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Oe._)`{minContains: ${e}}` : (0, Oe._)`{minContains: ${e}, maxContains: ${t}}`
}, dd = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: ud,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    let i, c;
    const { minContains: o, maxContains: u } = n;
    a.opts.next ? (i = o === void 0 ? 1 : o, c = u) : i = 1;
    const l = t.const("len", (0, Oe._)`${s}.length`);
    if (e.setParams({ min: i, max: c }), c === void 0 && i === 0) {
      (0, lr.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (c !== void 0 && i > c) {
      (0, lr.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, lr.alwaysValidSchema)(a, r)) {
      let $ = (0, Oe._)`${l} >= ${i}`;
      c !== void 0 && ($ = (0, Oe._)`${$} && ${l} <= ${c}`), e.pass($);
      return;
    }
    a.items = !0;
    const f = t.name("valid");
    c === void 0 && i === 1 ? m(f, () => t.if(f, () => t.break())) : i === 0 ? (t.let(f, !0), c !== void 0 && t.if((0, Oe._)`${s}.length > 0`, g)) : (t.let(f, !1), g()), e.result(f, () => e.reset());
    function g() {
      const $ = t.name("_valid"), w = t.let("count", 0);
      m($, () => t.if($, () => v(w)));
    }
    function m($, w) {
      t.forRange("i", 0, l, (p) => {
        e.subschema({
          keyword: "contains",
          dataProp: p,
          dataPropType: lr.Type.Num,
          compositeRule: !0
        }, $), w();
      });
    }
    function v($) {
      t.code((0, Oe._)`${$}++`), c === void 0 ? t.if((0, Oe._)`${$} >= ${i}`, () => t.assign(f, !0).break()) : (t.if((0, Oe._)`${$} > ${c}`, () => t.assign(f, !1).break()), i === 1 ? t.assign(f, !0) : t.if((0, Oe._)`${$} >= ${i}`, () => t.assign(f, !0)));
    }
  }
};
ss.default = dd;
var Vr = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = H, r = C, n = x;
  e.error = {
    message: ({ params: { property: o, depsCount: u, deps: l } }) => {
      const f = u === 1 ? "property" : "properties";
      return (0, t.str)`must have ${f} ${l} when property ${o} is present`;
    },
    params: ({ params: { property: o, depsCount: u, deps: l, missingProperty: f } }) => (0, t._)`{property: ${o},
    missingProperty: ${f},
    depsCount: ${u},
    deps: ${l}}`
    // TODO change to reference
  };
  const s = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(o) {
      const [u, l] = a(o);
      i(o, u), c(o, l);
    }
  };
  function a({ schema: o }) {
    const u = {}, l = {};
    for (const f in o) {
      if (f === "__proto__")
        continue;
      const g = Array.isArray(o[f]) ? u : l;
      g[f] = o[f];
    }
    return [u, l];
  }
  function i(o, u = o.schema) {
    const { gen: l, data: f, it: g } = o;
    if (Object.keys(u).length === 0)
      return;
    const m = l.let("missing");
    for (const v in u) {
      const $ = u[v];
      if ($.length === 0)
        continue;
      const w = (0, n.propertyInData)(l, f, v, g.opts.ownProperties);
      o.setParams({
        property: v,
        depsCount: $.length,
        deps: $.join(", ")
      }), g.allErrors ? l.if(w, () => {
        for (const p of $)
          (0, n.checkReportMissingProp)(o, p);
      }) : (l.if((0, t._)`${w} && (${(0, n.checkMissingProp)(o, $, m)})`), (0, n.reportMissingProp)(o, m), l.else());
    }
  }
  e.validatePropertyDeps = i;
  function c(o, u = o.schema) {
    const { gen: l, data: f, keyword: g, it: m } = o, v = l.name("valid");
    for (const $ in u)
      (0, r.alwaysValidSchema)(m, u[$]) || (l.if(
        (0, n.propertyInData)(l, f, $, m.opts.ownProperties),
        () => {
          const w = o.subschema({ keyword: g, schemaProp: $ }, v);
          o.mergeValidEvaluated(w, v);
        },
        () => l.var(v, !0)
        // TODO var
      ), o.ok(v));
  }
  e.validateSchemaDeps = c, e.default = s;
})(Vr);
var as = {};
Object.defineProperty(as, "__esModule", { value: !0 });
const zo = H, fd = C, hd = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, zo._)`{propertyName: ${e.propertyName}}`
}, md = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: hd,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, fd.alwaysValidSchema)(s, r))
      return;
    const a = t.name("valid");
    t.forIn("key", n, (i) => {
      e.setParams({ propertyName: i }), e.subschema({
        keyword: "propertyNames",
        data: i,
        dataTypes: ["string"],
        propertyName: i,
        compositeRule: !0
      }, a), t.if((0, zo.not)(a), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(a);
  }
};
as.default = md;
var Ur = {};
Object.defineProperty(Ur, "__esModule", { value: !0 });
const ur = x, ke = H, pd = Le(), dr = C, $d = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, ke._)`{additionalProperty: ${e.additionalProperty}}`
}, yd = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: $d,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: a, it: i } = e;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: c, opts: o } = i;
    if (i.props = !0, o.removeAdditional !== "all" && (0, dr.alwaysValidSchema)(i, r))
      return;
    const u = (0, ur.allSchemaProperties)(n.properties), l = (0, ur.allSchemaProperties)(n.patternProperties);
    f(), e.ok((0, ke._)`${a} === ${pd.default.errors}`);
    function f() {
      t.forIn("key", s, (w) => {
        !u.length && !l.length ? v(w) : t.if(g(w), () => v(w));
      });
    }
    function g(w) {
      let p;
      if (u.length > 8) {
        const S = (0, dr.schemaRefOrVal)(i, n.properties, "properties");
        p = (0, ur.isOwnProperty)(t, S, w);
      } else u.length ? p = (0, ke.or)(...u.map((S) => (0, ke._)`${w} === ${S}`)) : p = ke.nil;
      return l.length && (p = (0, ke.or)(p, ...l.map((S) => (0, ke._)`${(0, ur.usePattern)(e, S)}.test(${w})`))), (0, ke.not)(p);
    }
    function m(w) {
      t.code((0, ke._)`delete ${s}[${w}]`);
    }
    function v(w) {
      if (o.removeAdditional === "all" || o.removeAdditional && r === !1) {
        m(w);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: w }), e.error(), c || t.break();
        return;
      }
      if (typeof r == "object" && !(0, dr.alwaysValidSchema)(i, r)) {
        const p = t.name("valid");
        o.removeAdditional === "failing" ? ($(w, p, !1), t.if((0, ke.not)(p), () => {
          e.reset(), m(w);
        })) : ($(w, p), c || t.if((0, ke.not)(p), () => t.break()));
      }
    }
    function $(w, p, S) {
      const N = {
        keyword: "additionalProperties",
        dataProp: w,
        dataPropType: dr.Type.Str
      };
      S === !1 && Object.assign(N, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(N, p);
    }
  }
};
Ur.default = yd;
var os = {};
Object.defineProperty(os, "__esModule", { value: !0 });
const gd = rr(), fa = x, rn = C, ha = Ur, vd = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && ha.default.code(new gd.KeywordCxt(a, ha.default, "additionalProperties"));
    const i = (0, fa.allSchemaProperties)(r);
    for (const f of i)
      a.definedProperties.add(f);
    a.opts.unevaluated && i.length && a.props !== !0 && (a.props = rn.mergeEvaluated.props(t, (0, rn.toHash)(i), a.props));
    const c = i.filter((f) => !(0, rn.alwaysValidSchema)(a, r[f]));
    if (c.length === 0)
      return;
    const o = t.name("valid");
    for (const f of c)
      u(f) ? l(f) : (t.if((0, fa.propertyInData)(t, s, f, a.opts.ownProperties)), l(f), a.allErrors || t.else().var(o, !0), t.endIf()), e.it.definedProperties.add(f), e.ok(o);
    function u(f) {
      return a.opts.useDefaults && !a.compositeRule && r[f].default !== void 0;
    }
    function l(f) {
      e.subschema({
        keyword: "properties",
        schemaProp: f,
        dataProp: f
      }, o);
    }
  }
};
os.default = vd;
var is = {};
Object.defineProperty(is, "__esModule", { value: !0 });
const ma = x, fr = H, pa = C, $a = C, _d = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: a } = e, { opts: i } = a, c = (0, ma.allSchemaProperties)(r), o = c.filter(($) => (0, pa.alwaysValidSchema)(a, r[$]));
    if (c.length === 0 || o.length === c.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const u = i.strictSchema && !i.allowMatchingProperties && s.properties, l = t.name("valid");
    a.props !== !0 && !(a.props instanceof fr.Name) && (a.props = (0, $a.evaluatedPropsToName)(t, a.props));
    const { props: f } = a;
    g();
    function g() {
      for (const $ of c)
        u && m($), a.allErrors ? v($) : (t.var(l, !0), v($), t.if(l));
    }
    function m($) {
      for (const w in u)
        new RegExp($).test(w) && (0, pa.checkStrictMode)(a, `property ${w} matches pattern ${$} (use allowMatchingProperties)`);
    }
    function v($) {
      t.forIn("key", n, (w) => {
        t.if((0, fr._)`${(0, ma.usePattern)(e, $)}.test(${w})`, () => {
          const p = o.includes($);
          p || e.subschema({
            keyword: "patternProperties",
            schemaProp: $,
            dataProp: w,
            dataPropType: $a.Type.Str
          }, l), a.opts.unevaluated && f !== !0 ? t.assign((0, fr._)`${f}[${w}]`, !0) : !p && !a.allErrors && t.if((0, fr.not)(l), () => t.break());
        });
      });
    }
  }
};
is.default = _d;
var cs = {};
Object.defineProperty(cs, "__esModule", { value: !0 });
const Ed = C, wd = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, Ed.alwaysValidSchema)(n, r)) {
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
cs.default = wd;
var ls = {};
Object.defineProperty(ls, "__esModule", { value: !0 });
const bd = x, Sd = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: bd.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
ls.default = Sd;
var us = {};
Object.defineProperty(us, "__esModule", { value: !0 });
const Sr = H, Pd = C, Rd = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, Sr._)`{passingSchemas: ${e.passing}}`
}, Id = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: Rd,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: s } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const a = r, i = t.let("valid", !1), c = t.let("passing", null), o = t.name("_valid");
    e.setParams({ passing: c }), t.block(u), e.result(i, () => e.reset(), () => e.error(!0));
    function u() {
      a.forEach((l, f) => {
        let g;
        (0, Pd.alwaysValidSchema)(s, l) ? t.var(o, !0) : g = e.subschema({
          keyword: "oneOf",
          schemaProp: f,
          compositeRule: !0
        }, o), f > 0 && t.if((0, Sr._)`${o} && ${i}`).assign(i, !1).assign(c, (0, Sr._)`[${c}, ${f}]`).else(), t.if(o, () => {
          t.assign(i, !0), t.assign(c, f), g && e.mergeEvaluated(g, Sr.Name);
        });
      });
    }
  }
};
us.default = Id;
var ds = {};
Object.defineProperty(ds, "__esModule", { value: !0 });
const Nd = C, Od = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((a, i) => {
      if ((0, Nd.alwaysValidSchema)(n, a))
        return;
      const c = e.subschema({ keyword: "allOf", schemaProp: i }, s);
      e.ok(s), e.mergeEvaluated(c);
    });
  }
};
ds.default = Od;
var fs = {};
Object.defineProperty(fs, "__esModule", { value: !0 });
const Tr = H, Fo = C, Td = {
  message: ({ params: e }) => (0, Tr.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, Tr._)`{failingKeyword: ${e.ifClause}}`
}, jd = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: Td,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, Fo.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = ya(n, "then"), a = ya(n, "else");
    if (!s && !a)
      return;
    const i = t.let("valid", !0), c = t.name("_valid");
    if (o(), e.reset(), s && a) {
      const l = t.let("ifClause");
      e.setParams({ ifClause: l }), t.if(c, u("then", l), u("else", l));
    } else s ? t.if(c, u("then")) : t.if((0, Tr.not)(c), u("else"));
    e.pass(i, () => e.error(!0));
    function o() {
      const l = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, c);
      e.mergeEvaluated(l);
    }
    function u(l, f) {
      return () => {
        const g = e.subschema({ keyword: l }, c);
        t.assign(i, c), e.mergeValidEvaluated(g, i), f ? t.assign(f, (0, Tr._)`${l}`) : e.setParams({ ifClause: l });
      };
    }
  }
};
function ya(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, Fo.alwaysValidSchema)(e, r);
}
fs.default = jd;
var hs = {};
Object.defineProperty(hs, "__esModule", { value: !0 });
const Ad = C, kd = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, Ad.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
hs.default = kd;
Object.defineProperty(Mr, "__esModule", { value: !0 });
const Cd = jt, Dd = rs, Ld = At, Md = ns, Vd = ss, Ud = Vr, zd = as, Fd = Ur, qd = os, Gd = is, Kd = cs, Hd = ls, Xd = us, Bd = ds, Wd = fs, Jd = hs;
function xd(e = !1) {
  const t = [
    // any
    Kd.default,
    Hd.default,
    Xd.default,
    Bd.default,
    Wd.default,
    Jd.default,
    // object
    zd.default,
    Fd.default,
    Ud.default,
    qd.default,
    Gd.default
  ];
  return e ? t.push(Dd.default, Md.default) : t.push(Cd.default, Ld.default), t.push(Vd.default), t;
}
Mr.default = xd;
var ms = {}, kt = {};
Object.defineProperty(kt, "__esModule", { value: !0 });
kt.dynamicAnchor = void 0;
const nn = H, Yd = Le(), ga = Ee, Zd = We, Qd = {
  keyword: "$dynamicAnchor",
  schemaType: "string",
  code: (e) => qo(e, e.schema)
};
function qo(e, t) {
  const { gen: r, it: n } = e;
  n.schemaEnv.root.dynamicAnchors[t] = !0;
  const s = (0, nn._)`${Yd.default.dynamicAnchors}${(0, nn.getProperty)(t)}`, a = n.errSchemaPath === "#" ? n.validateName : ef(e);
  r.if((0, nn._)`!${s}`, () => r.assign(s, a));
}
kt.dynamicAnchor = qo;
function ef(e) {
  const { schemaEnv: t, schema: r, self: n } = e.it, { root: s, baseId: a, localRefs: i, meta: c } = t.root, { schemaId: o } = n.opts, u = new ga.SchemaEnv({ schema: r, schemaId: o, root: s, baseId: a, localRefs: i, meta: c });
  return ga.compileSchema.call(n, u), (0, Zd.getValidate)(e, u);
}
kt.default = Qd;
var Ct = {};
Object.defineProperty(Ct, "__esModule", { value: !0 });
Ct.dynamicRef = void 0;
const va = H, tf = Le(), _a = We, rf = {
  keyword: "$dynamicRef",
  schemaType: "string",
  code: (e) => Go(e, e.schema)
};
function Go(e, t) {
  const { gen: r, keyword: n, it: s } = e;
  if (t[0] !== "#")
    throw new Error(`"${n}" only supports hash fragment reference`);
  const a = t.slice(1);
  if (s.allErrors)
    i();
  else {
    const o = r.let("valid", !1);
    i(o), e.ok(o);
  }
  function i(o) {
    if (s.schemaEnv.root.dynamicAnchors[a]) {
      const u = r.let("_v", (0, va._)`${tf.default.dynamicAnchors}${(0, va.getProperty)(a)}`);
      r.if(u, c(u, o), c(s.validateName, o));
    } else
      c(s.validateName, o)();
  }
  function c(o, u) {
    return u ? () => r.block(() => {
      (0, _a.callRef)(e, o), r.let(u, !0);
    }) : () => (0, _a.callRef)(e, o);
  }
}
Ct.dynamicRef = Go;
Ct.default = rf;
var ps = {};
Object.defineProperty(ps, "__esModule", { value: !0 });
const nf = kt, sf = C, af = {
  keyword: "$recursiveAnchor",
  schemaType: "boolean",
  code(e) {
    e.schema ? (0, nf.dynamicAnchor)(e, "") : (0, sf.checkStrictMode)(e.it, "$recursiveAnchor: false is ignored");
  }
};
ps.default = af;
var $s = {};
Object.defineProperty($s, "__esModule", { value: !0 });
const of = Ct, cf = {
  keyword: "$recursiveRef",
  schemaType: "string",
  code: (e) => (0, of.dynamicRef)(e, e.schema)
};
$s.default = cf;
Object.defineProperty(ms, "__esModule", { value: !0 });
const lf = kt, uf = Ct, df = ps, ff = $s, hf = [lf.default, uf.default, df.default, ff.default];
ms.default = hf;
var ys = {}, gs = {};
Object.defineProperty(gs, "__esModule", { value: !0 });
const Ea = Vr, mf = {
  keyword: "dependentRequired",
  type: "object",
  schemaType: "object",
  error: Ea.error,
  code: (e) => (0, Ea.validatePropertyDeps)(e)
};
gs.default = mf;
var vs = {};
Object.defineProperty(vs, "__esModule", { value: !0 });
const pf = Vr, $f = {
  keyword: "dependentSchemas",
  type: "object",
  schemaType: "object",
  code: (e) => (0, pf.validateSchemaDeps)(e)
};
vs.default = $f;
var _s = {};
Object.defineProperty(_s, "__esModule", { value: !0 });
const yf = C, gf = {
  keyword: ["maxContains", "minContains"],
  type: "array",
  schemaType: "number",
  code({ keyword: e, parentSchema: t, it: r }) {
    t.contains === void 0 && (0, yf.checkStrictMode)(r, `"${e}" without "contains" is ignored`);
  }
};
_s.default = gf;
Object.defineProperty(ys, "__esModule", { value: !0 });
const vf = gs, _f = vs, Ef = _s, wf = [vf.default, _f.default, Ef.default];
ys.default = wf;
var Es = {}, ws = {};
Object.defineProperty(ws, "__esModule", { value: !0 });
const et = H, wa = C, bf = Le(), Sf = {
  message: "must NOT have unevaluated properties",
  params: ({ params: e }) => (0, et._)`{unevaluatedProperty: ${e.unevaluatedProperty}}`
}, Pf = {
  keyword: "unevaluatedProperties",
  type: "object",
  schemaType: ["boolean", "object"],
  trackErrors: !0,
  error: Sf,
  code(e) {
    const { gen: t, schema: r, data: n, errsCount: s, it: a } = e;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: i, props: c } = a;
    c instanceof et.Name ? t.if((0, et._)`${c} !== true`, () => t.forIn("key", n, (f) => t.if(u(c, f), () => o(f)))) : c !== !0 && t.forIn("key", n, (f) => c === void 0 ? o(f) : t.if(l(c, f), () => o(f))), a.props = !0, e.ok((0, et._)`${s} === ${bf.default.errors}`);
    function o(f) {
      if (r === !1) {
        e.setParams({ unevaluatedProperty: f }), e.error(), i || t.break();
        return;
      }
      if (!(0, wa.alwaysValidSchema)(a, r)) {
        const g = t.name("valid");
        e.subschema({
          keyword: "unevaluatedProperties",
          dataProp: f,
          dataPropType: wa.Type.Str
        }, g), i || t.if((0, et.not)(g), () => t.break());
      }
    }
    function u(f, g) {
      return (0, et._)`!${f} || !${f}[${g}]`;
    }
    function l(f, g) {
      const m = [];
      for (const v in f)
        f[v] === !0 && m.push((0, et._)`${g} !== ${v}`);
      return (0, et.and)(...m);
    }
  }
};
ws.default = Pf;
var bs = {};
Object.defineProperty(bs, "__esModule", { value: !0 });
const lt = H, ba = C, Rf = {
  message: ({ params: { len: e } }) => (0, lt.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, lt._)`{limit: ${e}}`
}, If = {
  keyword: "unevaluatedItems",
  type: "array",
  schemaType: ["boolean", "object"],
  error: Rf,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e, a = s.items || 0;
    if (a === !0)
      return;
    const i = t.const("len", (0, lt._)`${n}.length`);
    if (r === !1)
      e.setParams({ len: a }), e.fail((0, lt._)`${i} > ${a}`);
    else if (typeof r == "object" && !(0, ba.alwaysValidSchema)(s, r)) {
      const o = t.var("valid", (0, lt._)`${i} <= ${a}`);
      t.if((0, lt.not)(o), () => c(o, a)), e.ok(o);
    }
    s.items = !0;
    function c(o, u) {
      t.forRange("i", u, i, (l) => {
        e.subschema({ keyword: "unevaluatedItems", dataProp: l, dataPropType: ba.Type.Num }, o), s.allErrors || t.if((0, lt.not)(o), () => t.break());
      });
    }
  }
};
bs.default = If;
Object.defineProperty(Es, "__esModule", { value: !0 });
const Nf = ws, Of = bs, Tf = [Nf.default, Of.default];
Es.default = Tf;
var zr = {}, Ss = {};
Object.defineProperty(Ss, "__esModule", { value: !0 });
const oe = H, jf = {
  message: ({ schemaCode: e }) => (0, oe.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, oe._)`{format: ${e}}`
}, Af = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: jf,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: a, schemaCode: i, it: c } = e, { opts: o, errSchemaPath: u, schemaEnv: l, self: f } = c;
    if (!o.validateFormats)
      return;
    s ? g() : m();
    function g() {
      const v = r.scopeValue("formats", {
        ref: f.formats,
        code: o.code.formats
      }), $ = r.const("fDef", (0, oe._)`${v}[${i}]`), w = r.let("fType"), p = r.let("format");
      r.if((0, oe._)`typeof ${$} == "object" && !(${$} instanceof RegExp)`, () => r.assign(w, (0, oe._)`${$}.type || "string"`).assign(p, (0, oe._)`${$}.validate`), () => r.assign(w, (0, oe._)`"string"`).assign(p, $)), e.fail$data((0, oe.or)(S(), N()));
      function S() {
        return o.strictSchema === !1 ? oe.nil : (0, oe._)`${i} && !${p}`;
      }
      function N() {
        const j = l.$async ? (0, oe._)`(${$}.async ? await ${p}(${n}) : ${p}(${n}))` : (0, oe._)`${p}(${n})`, D = (0, oe._)`(typeof ${p} == "function" ? ${j} : ${p}.test(${n}))`;
        return (0, oe._)`${p} && ${p} !== true && ${w} === ${t} && !${D}`;
      }
    }
    function m() {
      const v = f.formats[a];
      if (!v) {
        S();
        return;
      }
      if (v === !0)
        return;
      const [$, w, p] = N(v);
      $ === t && e.pass(j());
      function S() {
        if (o.strictSchema === !1) {
          f.logger.warn(D());
          return;
        }
        throw new Error(D());
        function D() {
          return `unknown format "${a}" ignored in schema at path "${u}"`;
        }
      }
      function N(D) {
        const Z = D instanceof RegExp ? (0, oe.regexpCode)(D) : o.code.formats ? (0, oe._)`${o.code.formats}${(0, oe.getProperty)(a)}` : void 0, ee = r.scopeValue("formats", { key: a, ref: D, code: Z });
        return typeof D == "object" && !(D instanceof RegExp) ? [D.type || "string", D.validate, (0, oe._)`${ee}.validate`] : ["string", D, ee];
      }
      function j() {
        if (typeof v == "object" && !(v instanceof RegExp) && v.async) {
          if (!l.$async)
            throw new Error("async format in sync schema");
          return (0, oe._)`await ${p}(${n})`;
        }
        return typeof w == "function" ? (0, oe._)`${p}(${n})` : (0, oe._)`${p}.test(${n})`;
      }
    }
  }
};
Ss.default = Af;
Object.defineProperty(zr, "__esModule", { value: !0 });
const kf = Ss, Cf = [kf.default];
zr.default = Cf;
var mt = {};
Object.defineProperty(mt, "__esModule", { value: !0 });
mt.contentVocabulary = mt.metadataVocabulary = void 0;
mt.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
mt.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(Gn, "__esModule", { value: !0 });
const Df = Dr, Lf = Lr, Mf = Mr, Vf = ms, Uf = ys, zf = Es, Ff = zr, Sa = mt, qf = [
  Vf.default,
  Df.default,
  Lf.default,
  (0, Mf.default)(!0),
  Ff.default,
  Sa.metadataVocabulary,
  Sa.contentVocabulary,
  Uf.default,
  zf.default
];
Gn.default = qf;
var Fr = {}, qr = {};
Object.defineProperty(qr, "__esModule", { value: !0 });
qr.DiscrError = void 0;
var Pa;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(Pa || (qr.DiscrError = Pa = {}));
Object.defineProperty(Fr, "__esModule", { value: !0 });
const Et = H, vn = qr, Ra = Ee, Gf = pt, Kf = C, Hf = {
  message: ({ params: { discrError: e, tagName: t } }) => e === vn.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, Et._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, Xf = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: Hf,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: s, it: a } = e, { oneOf: i } = s;
    if (!a.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const c = n.propertyName;
    if (typeof c != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!i)
      throw new Error("discriminator: requires oneOf keyword");
    const o = t.let("valid", !1), u = t.const("tag", (0, Et._)`${r}${(0, Et.getProperty)(c)}`);
    t.if((0, Et._)`typeof ${u} == "string"`, () => l(), () => e.error(!1, { discrError: vn.DiscrError.Tag, tag: u, tagName: c })), e.ok(o);
    function l() {
      const m = g();
      t.if(!1);
      for (const v in m)
        t.elseIf((0, Et._)`${u} === ${v}`), t.assign(o, f(m[v]));
      t.else(), e.error(!1, { discrError: vn.DiscrError.Mapping, tag: u, tagName: c }), t.endIf();
    }
    function f(m) {
      const v = t.name("valid"), $ = e.subschema({ keyword: "oneOf", schemaProp: m }, v);
      return e.mergeEvaluated($, Et.Name), v;
    }
    function g() {
      var m;
      const v = {}, $ = p(s);
      let w = !0;
      for (let j = 0; j < i.length; j++) {
        let D = i[j];
        if (D != null && D.$ref && !(0, Kf.schemaHasRulesButRef)(D, a.self.RULES)) {
          const ee = D.$ref;
          if (D = Ra.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, ee), D instanceof Ra.SchemaEnv && (D = D.schema), D === void 0)
            throw new Gf.default(a.opts.uriResolver, a.baseId, ee);
        }
        const Z = (m = D == null ? void 0 : D.properties) === null || m === void 0 ? void 0 : m[c];
        if (typeof Z != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${c}"`);
        w = w && ($ || p(D)), S(Z, j);
      }
      if (!w)
        throw new Error(`discriminator: "${c}" must be required`);
      return v;
      function p({ required: j }) {
        return Array.isArray(j) && j.includes(c);
      }
      function S(j, D) {
        if (j.const)
          N(j.const, D);
        else if (j.enum)
          for (const Z of j.enum)
            N(Z, D);
        else
          throw new Error(`discriminator: "properties/${c}" must have "const" or "enum"`);
      }
      function N(j, D) {
        if (typeof j != "string" || j in v)
          throw new Error(`discriminator: "${c}" values must be unique strings`);
        v[j] = D;
      }
    }
  }
};
Fr.default = Xf;
var Ps = {};
const Bf = "https://json-schema.org/draft/2020-12/schema", Wf = "https://json-schema.org/draft/2020-12/schema", Jf = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0,
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0,
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0,
  "https://json-schema.org/draft/2020-12/vocab/validation": !0,
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0,
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0,
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, xf = "meta", Yf = "Core and Validation specifications meta-schema", Zf = [
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
], Qf = [
  "object",
  "boolean"
], eh = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", th = {
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
}, rh = {
  $schema: Bf,
  $id: Wf,
  $vocabulary: Jf,
  $dynamicAnchor: xf,
  title: Yf,
  allOf: Zf,
  type: Qf,
  $comment: eh,
  properties: th
}, nh = "https://json-schema.org/draft/2020-12/schema", sh = "https://json-schema.org/draft/2020-12/meta/applicator", ah = {
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0
}, oh = "meta", ih = "Applicator vocabulary meta-schema", ch = [
  "object",
  "boolean"
], lh = {
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
}, uh = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $dynamicRef: "#meta"
    }
  }
}, dh = {
  $schema: nh,
  $id: sh,
  $vocabulary: ah,
  $dynamicAnchor: oh,
  title: ih,
  type: ch,
  properties: lh,
  $defs: uh
}, fh = "https://json-schema.org/draft/2020-12/schema", hh = "https://json-schema.org/draft/2020-12/meta/unevaluated", mh = {
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0
}, ph = "meta", $h = "Unevaluated applicator vocabulary meta-schema", yh = [
  "object",
  "boolean"
], gh = {
  unevaluatedItems: {
    $dynamicRef: "#meta"
  },
  unevaluatedProperties: {
    $dynamicRef: "#meta"
  }
}, vh = {
  $schema: fh,
  $id: hh,
  $vocabulary: mh,
  $dynamicAnchor: ph,
  title: $h,
  type: yh,
  properties: gh
}, _h = "https://json-schema.org/draft/2020-12/schema", Eh = "https://json-schema.org/draft/2020-12/meta/content", wh = {
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, bh = "meta", Sh = "Content vocabulary meta-schema", Ph = [
  "object",
  "boolean"
], Rh = {
  contentEncoding: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentSchema: {
    $dynamicRef: "#meta"
  }
}, Ih = {
  $schema: _h,
  $id: Eh,
  $vocabulary: wh,
  $dynamicAnchor: bh,
  title: Sh,
  type: Ph,
  properties: Rh
}, Nh = "https://json-schema.org/draft/2020-12/schema", Oh = "https://json-schema.org/draft/2020-12/meta/core", Th = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0
}, jh = "meta", Ah = "Core vocabulary meta-schema", kh = [
  "object",
  "boolean"
], Ch = {
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
}, Dh = {
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
}, Lh = {
  $schema: Nh,
  $id: Oh,
  $vocabulary: Th,
  $dynamicAnchor: jh,
  title: Ah,
  type: kh,
  properties: Ch,
  $defs: Dh
}, Mh = "https://json-schema.org/draft/2020-12/schema", Vh = "https://json-schema.org/draft/2020-12/meta/format-annotation", Uh = {
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0
}, zh = "meta", Fh = "Format vocabulary meta-schema for annotation results", qh = [
  "object",
  "boolean"
], Gh = {
  format: {
    type: "string"
  }
}, Kh = {
  $schema: Mh,
  $id: Vh,
  $vocabulary: Uh,
  $dynamicAnchor: zh,
  title: Fh,
  type: qh,
  properties: Gh
}, Hh = "https://json-schema.org/draft/2020-12/schema", Xh = "https://json-schema.org/draft/2020-12/meta/meta-data", Bh = {
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0
}, Wh = "meta", Jh = "Meta-data vocabulary meta-schema", xh = [
  "object",
  "boolean"
], Yh = {
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
}, Zh = {
  $schema: Hh,
  $id: Xh,
  $vocabulary: Bh,
  $dynamicAnchor: Wh,
  title: Jh,
  type: xh,
  properties: Yh
}, Qh = "https://json-schema.org/draft/2020-12/schema", em = "https://json-schema.org/draft/2020-12/meta/validation", tm = {
  "https://json-schema.org/draft/2020-12/vocab/validation": !0
}, rm = "meta", nm = "Validation vocabulary meta-schema", sm = [
  "object",
  "boolean"
], am = {
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
}, om = {
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
}, im = {
  $schema: Qh,
  $id: em,
  $vocabulary: tm,
  $dynamicAnchor: rm,
  title: nm,
  type: sm,
  properties: am,
  $defs: om
};
Object.defineProperty(Ps, "__esModule", { value: !0 });
const cm = rh, lm = dh, um = vh, dm = Ih, fm = Lh, hm = Kh, mm = Zh, pm = im, $m = ["/properties"];
function ym(e) {
  return [
    cm,
    lm,
    um,
    dm,
    fm,
    t(this, hm),
    mm,
    t(this, pm)
  ].forEach((r) => this.addMetaSchema(r, void 0, !1)), this;
  function t(r, n) {
    return e ? r.$dataMetaSchema(n, $m) : n;
  }
}
Ps.default = ym;
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv2020 = void 0;
  const r = Tn, n = Gn, s = Fr, a = Ps, i = "https://json-schema.org/draft/2020-12/schema";
  class c extends r.default {
    constructor(m = {}) {
      super({
        ...m,
        dynamicRef: !0,
        next: !0,
        unevaluated: !0
      });
    }
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((m) => this.addVocabulary(m)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      super._addDefaultMetaSchema();
      const { $data: m, meta: v } = this.opts;
      v && (a.default.call(this, m), this.refs["http://json-schema.org/schema"] = i);
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(i) ? i : void 0);
    }
  }
  t.Ajv2020 = c, e.exports = t = c, e.exports.Ajv2020 = c, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = c;
  var o = rr();
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return o.KeywordCxt;
  } });
  var u = H;
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
  var l = Tt;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return l.default;
  } });
  var f = pt;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return f.default;
  } });
})(fn, fn.exports);
var gm = fn.exports, _n = { exports: {} }, Ko = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
  function t(z, K) {
    return { validate: z, compare: K };
  }
  e.fullFormats = {
    // date: http://tools.ietf.org/html/rfc3339#section-5.6
    date: t(a, i),
    // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
    time: t(o(!0), u),
    "date-time": t(g(!0), m),
    "iso-time": t(o(), l),
    "iso-date-time": t(g(), v),
    // duration: https://tools.ietf.org/html/rfc3339#appendix-A
    duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
    uri: p,
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
    regex: ve,
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
    byte: N,
    // signed 32 bit integer
    int32: { type: "number", validate: Z },
    // signed 64 bit integer
    int64: { type: "number", validate: ee },
    // C-type float
    float: { type: "number", validate: ie },
    // C-type double
    double: { type: "number", validate: ie },
    // hint to the UI to hide input strings
    password: !0,
    // unchecked string payload
    binary: !0
  }, e.fastFormats = {
    ...e.fullFormats,
    date: t(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, i),
    time: t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, u),
    "date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, m),
    "iso-time": t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, l),
    "iso-date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, v),
    // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
    uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
    "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
    // email (sources from jsen validator):
    // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
    // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
    email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
  }, e.formatNames = Object.keys(e.fullFormats);
  function r(z) {
    return z % 4 === 0 && (z % 100 !== 0 || z % 400 === 0);
  }
  const n = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, s = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function a(z) {
    const K = n.exec(z);
    if (!K)
      return !1;
    const X = +K[1], O = +K[2], A = +K[3];
    return O >= 1 && O <= 12 && A >= 1 && A <= (O === 2 && r(X) ? 29 : s[O]);
  }
  function i(z, K) {
    if (z && K)
      return z > K ? 1 : z < K ? -1 : 0;
  }
  const c = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
  function o(z) {
    return function(X) {
      const O = c.exec(X);
      if (!O)
        return !1;
      const A = +O[1], V = +O[2], L = +O[3], G = O[4], M = O[5] === "-" ? -1 : 1, I = +(O[6] || 0), y = +(O[7] || 0);
      if (I > 23 || y > 59 || z && !G)
        return !1;
      if (A <= 23 && V <= 59 && L < 60)
        return !0;
      const P = V - y * M, E = A - I * M - (P < 0 ? 1 : 0);
      return (E === 23 || E === -1) && (P === 59 || P === -1) && L < 61;
    };
  }
  function u(z, K) {
    if (!(z && K))
      return;
    const X = (/* @__PURE__ */ new Date("2020-01-01T" + z)).valueOf(), O = (/* @__PURE__ */ new Date("2020-01-01T" + K)).valueOf();
    if (X && O)
      return X - O;
  }
  function l(z, K) {
    if (!(z && K))
      return;
    const X = c.exec(z), O = c.exec(K);
    if (X && O)
      return z = X[1] + X[2] + X[3], K = O[1] + O[2] + O[3], z > K ? 1 : z < K ? -1 : 0;
  }
  const f = /t|\s/i;
  function g(z) {
    const K = o(z);
    return function(O) {
      const A = O.split(f);
      return A.length === 2 && a(A[0]) && K(A[1]);
    };
  }
  function m(z, K) {
    if (!(z && K))
      return;
    const X = new Date(z).valueOf(), O = new Date(K).valueOf();
    if (X && O)
      return X - O;
  }
  function v(z, K) {
    if (!(z && K))
      return;
    const [X, O] = z.split(f), [A, V] = K.split(f), L = i(X, A);
    if (L !== void 0)
      return L || u(O, V);
  }
  const $ = /\/|:/, w = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  function p(z) {
    return $.test(z) && w.test(z);
  }
  const S = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
  function N(z) {
    return S.lastIndex = 0, S.test(z);
  }
  const j = -2147483648, D = 2 ** 31 - 1;
  function Z(z) {
    return Number.isInteger(z) && z <= D && z >= j;
  }
  function ee(z) {
    return Number.isInteger(z);
  }
  function ie() {
    return !0;
  }
  const pe = /[^\\]\\Z/;
  function ve(z) {
    if (pe.test(z))
      return !1;
    try {
      return new RegExp(z), !0;
    } catch {
      return !1;
    }
  }
})(Ko);
var Ho = {}, En = { exports: {} }, Rs = {};
Object.defineProperty(Rs, "__esModule", { value: !0 });
const vm = Dr, _m = Lr, Em = Mr, wm = zr, Ia = mt, bm = [
  vm.default,
  _m.default,
  (0, Em.default)(),
  wm.default,
  Ia.metadataVocabulary,
  Ia.contentVocabulary
];
Rs.default = bm;
const Sm = "http://json-schema.org/draft-07/schema#", Pm = "http://json-schema.org/draft-07/schema#", Rm = "Core schema meta-schema", Im = {
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
}, Nm = [
  "object",
  "boolean"
], Om = {
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
}, Tm = {
  $schema: Sm,
  $id: Pm,
  title: Rm,
  definitions: Im,
  type: Nm,
  properties: Om,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
  const r = Tn, n = Rs, s = Fr, a = Tm, i = ["/properties"], c = "http://json-schema.org/draft-07/schema";
  class o extends r.default {
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((v) => this.addVocabulary(v)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const v = this.opts.$data ? this.$dataMetaSchema(a, i) : a;
      this.addMetaSchema(v, c, !1), this.refs["http://json-schema.org/schema"] = c;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(c) ? c : void 0);
    }
  }
  t.Ajv = o, e.exports = t = o, e.exports.Ajv = o, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = o;
  var u = rr();
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return u.KeywordCxt;
  } });
  var l = H;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return l._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return l.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return l.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return l.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return l.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return l.CodeGen;
  } });
  var f = Tt;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return f.default;
  } });
  var g = pt;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return g.default;
  } });
})(En, En.exports);
var jm = En.exports;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
  const t = jm, r = H, n = r.operators, s = {
    formatMaximum: { okStr: "<=", ok: n.LTE, fail: n.GT },
    formatMinimum: { okStr: ">=", ok: n.GTE, fail: n.LT },
    formatExclusiveMaximum: { okStr: "<", ok: n.LT, fail: n.GTE },
    formatExclusiveMinimum: { okStr: ">", ok: n.GT, fail: n.LTE }
  }, a = {
    message: ({ keyword: c, schemaCode: o }) => (0, r.str)`should be ${s[c].okStr} ${o}`,
    params: ({ keyword: c, schemaCode: o }) => (0, r._)`{comparison: ${s[c].okStr}, limit: ${o}}`
  };
  e.formatLimitDefinition = {
    keyword: Object.keys(s),
    type: "string",
    schemaType: "string",
    $data: !0,
    error: a,
    code(c) {
      const { gen: o, data: u, schemaCode: l, keyword: f, it: g } = c, { opts: m, self: v } = g;
      if (!m.validateFormats)
        return;
      const $ = new t.KeywordCxt(g, v.RULES.all.format.definition, "format");
      $.$data ? w() : p();
      function w() {
        const N = o.scopeValue("formats", {
          ref: v.formats,
          code: m.code.formats
        }), j = o.const("fmt", (0, r._)`${N}[${$.schemaCode}]`);
        c.fail$data((0, r.or)((0, r._)`typeof ${j} != "object"`, (0, r._)`${j} instanceof RegExp`, (0, r._)`typeof ${j}.compare != "function"`, S(j)));
      }
      function p() {
        const N = $.schema, j = v.formats[N];
        if (!j || j === !0)
          return;
        if (typeof j != "object" || j instanceof RegExp || typeof j.compare != "function")
          throw new Error(`"${f}": format "${N}" does not define "compare" function`);
        const D = o.scopeValue("formats", {
          key: N,
          ref: j,
          code: m.code.formats ? (0, r._)`${m.code.formats}${(0, r.getProperty)(N)}` : void 0
        });
        c.fail$data(S(D));
      }
      function S(N) {
        return (0, r._)`${N}.compare(${u}, ${l}) ${s[f].fail} 0`;
      }
    },
    dependencies: ["format"]
  };
  const i = (c) => (c.addKeyword(e.formatLimitDefinition), c);
  e.default = i;
})(Ho);
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 });
  const r = Ko, n = Ho, s = H, a = new s.Name("fullFormats"), i = new s.Name("fastFormats"), c = (u, l = { keywords: !0 }) => {
    if (Array.isArray(l))
      return o(u, l, r.fullFormats, a), u;
    const [f, g] = l.mode === "fast" ? [r.fastFormats, i] : [r.fullFormats, a], m = l.formats || r.formatNames;
    return o(u, m, f, g), l.keywords && (0, n.default)(u), u;
  };
  c.get = (u, l = "full") => {
    const g = (l === "fast" ? r.fastFormats : r.fullFormats)[u];
    if (!g)
      throw new Error(`Unknown format "${u}"`);
    return g;
  };
  function o(u, l, f, g) {
    var m, v;
    (m = (v = u.opts.code).formats) !== null && m !== void 0 || (v.formats = (0, s._)`require("ajv-formats/dist/formats").${g}`);
    for (const $ of l)
      u.addFormat($, f[$]);
  }
  e.exports = t = c, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = c;
})(_n, _n.exports);
var Am = _n.exports;
const km = /* @__PURE__ */ to(Am), Cm = (e, t, r, n) => {
  if (r === "length" || r === "prototype" || r === "arguments" || r === "caller")
    return;
  const s = Object.getOwnPropertyDescriptor(e, r), a = Object.getOwnPropertyDescriptor(t, r);
  !Dm(s, a) && n || Object.defineProperty(e, r, a);
}, Dm = function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value);
}, Lm = (e, t) => {
  const r = Object.getPrototypeOf(t);
  r !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, r);
}, Mm = (e, t) => `/* Wrapped ${e}*/
${t}`, Vm = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), Um = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), zm = (e, t, r) => {
  const n = r === "" ? "" : `with ${r.trim()}() `, s = Mm.bind(null, n, t.toString());
  Object.defineProperty(s, "name", Um);
  const { writable: a, enumerable: i, configurable: c } = Vm;
  Object.defineProperty(e, "toString", { value: s, writable: a, enumerable: i, configurable: c });
};
function Fm(e, t, { ignoreNonConfigurable: r = !1 } = {}) {
  const { name: n } = e;
  for (const s of Reflect.ownKeys(t))
    Cm(e, t, s, r);
  return Lm(e, t), zm(e, t, n), e;
}
const Na = (e, t = {}) => {
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
  let i, c, o;
  const u = function(...l) {
    const f = this, g = () => {
      i = void 0, c && (clearTimeout(c), c = void 0), a && (o = e.apply(f, l));
    }, m = () => {
      c = void 0, i && (clearTimeout(i), i = void 0), a && (o = e.apply(f, l));
    }, v = s && !i;
    return clearTimeout(i), i = setTimeout(g, r), n > 0 && n !== Number.POSITIVE_INFINITY && !c && (c = setTimeout(m, n)), v && (o = e.apply(f, l)), o;
  };
  return Fm(u, e), u.cancel = () => {
    i && (clearTimeout(i), i = void 0), c && (clearTimeout(c), c = void 0);
  }, u;
};
var wn = { exports: {} };
const qm = "2.0.0", Xo = 256, Gm = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, Km = 16, Hm = Xo - 6, Xm = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var Gr = {
  MAX_LENGTH: Xo,
  MAX_SAFE_COMPONENT_LENGTH: Km,
  MAX_SAFE_BUILD_LENGTH: Hm,
  MAX_SAFE_INTEGER: Gm,
  RELEASE_TYPES: Xm,
  SEMVER_SPEC_VERSION: qm,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const Bm = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var Kr = Bm;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: s
  } = Gr, a = Kr;
  t = e.exports = {};
  const i = t.re = [], c = t.safeRe = [], o = t.src = [], u = t.safeSrc = [], l = t.t = {};
  let f = 0;
  const g = "[a-zA-Z0-9-]", m = [
    ["\\s", 1],
    ["\\d", s],
    [g, n]
  ], v = (w) => {
    for (const [p, S] of m)
      w = w.split(`${p}*`).join(`${p}{0,${S}}`).split(`${p}+`).join(`${p}{1,${S}}`);
    return w;
  }, $ = (w, p, S) => {
    const N = v(p), j = f++;
    a(w, j, p), l[w] = j, o[j] = p, u[j] = N, i[j] = new RegExp(p, S ? "g" : void 0), c[j] = new RegExp(N, S ? "g" : void 0);
  };
  $("NUMERICIDENTIFIER", "0|[1-9]\\d*"), $("NUMERICIDENTIFIERLOOSE", "\\d+"), $("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${g}*`), $("MAINVERSION", `(${o[l.NUMERICIDENTIFIER]})\\.(${o[l.NUMERICIDENTIFIER]})\\.(${o[l.NUMERICIDENTIFIER]})`), $("MAINVERSIONLOOSE", `(${o[l.NUMERICIDENTIFIERLOOSE]})\\.(${o[l.NUMERICIDENTIFIERLOOSE]})\\.(${o[l.NUMERICIDENTIFIERLOOSE]})`), $("PRERELEASEIDENTIFIER", `(?:${o[l.NONNUMERICIDENTIFIER]}|${o[l.NUMERICIDENTIFIER]})`), $("PRERELEASEIDENTIFIERLOOSE", `(?:${o[l.NONNUMERICIDENTIFIER]}|${o[l.NUMERICIDENTIFIERLOOSE]})`), $("PRERELEASE", `(?:-(${o[l.PRERELEASEIDENTIFIER]}(?:\\.${o[l.PRERELEASEIDENTIFIER]})*))`), $("PRERELEASELOOSE", `(?:-?(${o[l.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${o[l.PRERELEASEIDENTIFIERLOOSE]})*))`), $("BUILDIDENTIFIER", `${g}+`), $("BUILD", `(?:\\+(${o[l.BUILDIDENTIFIER]}(?:\\.${o[l.BUILDIDENTIFIER]})*))`), $("FULLPLAIN", `v?${o[l.MAINVERSION]}${o[l.PRERELEASE]}?${o[l.BUILD]}?`), $("FULL", `^${o[l.FULLPLAIN]}$`), $("LOOSEPLAIN", `[v=\\s]*${o[l.MAINVERSIONLOOSE]}${o[l.PRERELEASELOOSE]}?${o[l.BUILD]}?`), $("LOOSE", `^${o[l.LOOSEPLAIN]}$`), $("GTLT", "((?:<|>)?=?)"), $("XRANGEIDENTIFIERLOOSE", `${o[l.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), $("XRANGEIDENTIFIER", `${o[l.NUMERICIDENTIFIER]}|x|X|\\*`), $("XRANGEPLAIN", `[v=\\s]*(${o[l.XRANGEIDENTIFIER]})(?:\\.(${o[l.XRANGEIDENTIFIER]})(?:\\.(${o[l.XRANGEIDENTIFIER]})(?:${o[l.PRERELEASE]})?${o[l.BUILD]}?)?)?`), $("XRANGEPLAINLOOSE", `[v=\\s]*(${o[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${o[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${o[l.XRANGEIDENTIFIERLOOSE]})(?:${o[l.PRERELEASELOOSE]})?${o[l.BUILD]}?)?)?`), $("XRANGE", `^${o[l.GTLT]}\\s*${o[l.XRANGEPLAIN]}$`), $("XRANGELOOSE", `^${o[l.GTLT]}\\s*${o[l.XRANGEPLAINLOOSE]}$`), $("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), $("COERCE", `${o[l.COERCEPLAIN]}(?:$|[^\\d])`), $("COERCEFULL", o[l.COERCEPLAIN] + `(?:${o[l.PRERELEASE]})?(?:${o[l.BUILD]})?(?:$|[^\\d])`), $("COERCERTL", o[l.COERCE], !0), $("COERCERTLFULL", o[l.COERCEFULL], !0), $("LONETILDE", "(?:~>?)"), $("TILDETRIM", `(\\s*)${o[l.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", $("TILDE", `^${o[l.LONETILDE]}${o[l.XRANGEPLAIN]}$`), $("TILDELOOSE", `^${o[l.LONETILDE]}${o[l.XRANGEPLAINLOOSE]}$`), $("LONECARET", "(?:\\^)"), $("CARETTRIM", `(\\s*)${o[l.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", $("CARET", `^${o[l.LONECARET]}${o[l.XRANGEPLAIN]}$`), $("CARETLOOSE", `^${o[l.LONECARET]}${o[l.XRANGEPLAINLOOSE]}$`), $("COMPARATORLOOSE", `^${o[l.GTLT]}\\s*(${o[l.LOOSEPLAIN]})$|^$`), $("COMPARATOR", `^${o[l.GTLT]}\\s*(${o[l.FULLPLAIN]})$|^$`), $("COMPARATORTRIM", `(\\s*)${o[l.GTLT]}\\s*(${o[l.LOOSEPLAIN]}|${o[l.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", $("HYPHENRANGE", `^\\s*(${o[l.XRANGEPLAIN]})\\s+-\\s+(${o[l.XRANGEPLAIN]})\\s*$`), $("HYPHENRANGELOOSE", `^\\s*(${o[l.XRANGEPLAINLOOSE]})\\s+-\\s+(${o[l.XRANGEPLAINLOOSE]})\\s*$`), $("STAR", "(<|>)?=?\\s*\\*"), $("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), $("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(wn, wn.exports);
var sr = wn.exports;
const Wm = Object.freeze({ loose: !0 }), Jm = Object.freeze({}), xm = (e) => e ? typeof e != "object" ? Wm : e : Jm;
var Is = xm;
const Oa = /^[0-9]+$/, Bo = (e, t) => {
  const r = Oa.test(e), n = Oa.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, Ym = (e, t) => Bo(t, e);
var Wo = {
  compareIdentifiers: Bo,
  rcompareIdentifiers: Ym
};
const hr = Kr, { MAX_LENGTH: Ta, MAX_SAFE_INTEGER: mr } = Gr, { safeRe: pr, t: $r } = sr, Zm = Is, { compareIdentifiers: gt } = Wo;
let Qm = class Ue {
  constructor(t, r) {
    if (r = Zm(r), t instanceof Ue) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > Ta)
      throw new TypeError(
        `version is longer than ${Ta} characters`
      );
    hr("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? pr[$r.LOOSE] : pr[$r.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > mr || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > mr || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > mr || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((s) => {
      if (/^[0-9]+$/.test(s)) {
        const a = +s;
        if (a >= 0 && a < mr)
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
    if (hr("SemVer.compare", this.version, this.options, t), !(t instanceof Ue)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new Ue(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof Ue || (t = new Ue(t, this.options)), gt(this.major, t.major) || gt(this.minor, t.minor) || gt(this.patch, t.patch);
  }
  comparePre(t) {
    if (t instanceof Ue || (t = new Ue(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], s = t.prerelease[r];
      if (hr("prerelease compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return gt(n, s);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof Ue || (t = new Ue(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], s = t.build[r];
      if (hr("build compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return gt(n, s);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const s = `-${r}`.match(this.options.loose ? pr[$r.PRERELEASELOOSE] : pr[$r.PRERELEASE]);
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
          n === !1 && (a = [r]), gt(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = a) : this.prerelease = a;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var we = Qm;
const ja = we, ep = (e, t, r = !1) => {
  if (e instanceof ja)
    return e;
  try {
    return new ja(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var Dt = ep;
const tp = Dt, rp = (e, t) => {
  const r = tp(e, t);
  return r ? r.version : null;
};
var np = rp;
const sp = Dt, ap = (e, t) => {
  const r = sp(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var op = ap;
const Aa = we, ip = (e, t, r, n, s) => {
  typeof r == "string" && (s = n, n = r, r = void 0);
  try {
    return new Aa(
      e instanceof Aa ? e.version : e,
      r
    ).inc(t, n, s).version;
  } catch {
    return null;
  }
};
var cp = ip;
const ka = Dt, lp = (e, t) => {
  const r = ka(e, null, !0), n = ka(t, null, !0), s = r.compare(n);
  if (s === 0)
    return null;
  const a = s > 0, i = a ? r : n, c = a ? n : r, o = !!i.prerelease.length;
  if (!!c.prerelease.length && !o) {
    if (!c.patch && !c.minor)
      return "major";
    if (c.compareMain(i) === 0)
      return c.minor && !c.patch ? "minor" : "patch";
  }
  const l = o ? "pre" : "";
  return r.major !== n.major ? l + "major" : r.minor !== n.minor ? l + "minor" : r.patch !== n.patch ? l + "patch" : "prerelease";
};
var up = lp;
const dp = we, fp = (e, t) => new dp(e, t).major;
var hp = fp;
const mp = we, pp = (e, t) => new mp(e, t).minor;
var $p = pp;
const yp = we, gp = (e, t) => new yp(e, t).patch;
var vp = gp;
const _p = Dt, Ep = (e, t) => {
  const r = _p(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var wp = Ep;
const Ca = we, bp = (e, t, r) => new Ca(e, r).compare(new Ca(t, r));
var Me = bp;
const Sp = Me, Pp = (e, t, r) => Sp(t, e, r);
var Rp = Pp;
const Ip = Me, Np = (e, t) => Ip(e, t, !0);
var Op = Np;
const Da = we, Tp = (e, t, r) => {
  const n = new Da(e, r), s = new Da(t, r);
  return n.compare(s) || n.compareBuild(s);
};
var Ns = Tp;
const jp = Ns, Ap = (e, t) => e.sort((r, n) => jp(r, n, t));
var kp = Ap;
const Cp = Ns, Dp = (e, t) => e.sort((r, n) => Cp(n, r, t));
var Lp = Dp;
const Mp = Me, Vp = (e, t, r) => Mp(e, t, r) > 0;
var Hr = Vp;
const Up = Me, zp = (e, t, r) => Up(e, t, r) < 0;
var Os = zp;
const Fp = Me, qp = (e, t, r) => Fp(e, t, r) === 0;
var Jo = qp;
const Gp = Me, Kp = (e, t, r) => Gp(e, t, r) !== 0;
var xo = Kp;
const Hp = Me, Xp = (e, t, r) => Hp(e, t, r) >= 0;
var Ts = Xp;
const Bp = Me, Wp = (e, t, r) => Bp(e, t, r) <= 0;
var js = Wp;
const Jp = Jo, xp = xo, Yp = Hr, Zp = Ts, Qp = Os, e$ = js, t$ = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return Jp(e, r, n);
    case "!=":
      return xp(e, r, n);
    case ">":
      return Yp(e, r, n);
    case ">=":
      return Zp(e, r, n);
    case "<":
      return Qp(e, r, n);
    case "<=":
      return e$(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var Yo = t$;
const r$ = we, n$ = Dt, { safeRe: yr, t: gr } = sr, s$ = (e, t) => {
  if (e instanceof r$)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? yr[gr.COERCEFULL] : yr[gr.COERCE]);
  else {
    const o = t.includePrerelease ? yr[gr.COERCERTLFULL] : yr[gr.COERCERTL];
    let u;
    for (; (u = o.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || u.index + u[0].length !== r.index + r[0].length) && (r = u), o.lastIndex = u.index + u[1].length + u[2].length;
    o.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], s = r[3] || "0", a = r[4] || "0", i = t.includePrerelease && r[5] ? `-${r[5]}` : "", c = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return n$(`${n}.${s}.${a}${i}${c}`, t);
};
var a$ = s$;
class o$ {
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
var i$ = o$, sn, La;
function Ve() {
  if (La) return sn;
  La = 1;
  const e = /\s+/g;
  class t {
    constructor(A, V) {
      if (V = s(V), A instanceof t)
        return A.loose === !!V.loose && A.includePrerelease === !!V.includePrerelease ? A : new t(A.raw, V);
      if (A instanceof a)
        return this.raw = A.value, this.set = [[A]], this.formatted = void 0, this;
      if (this.options = V, this.loose = !!V.loose, this.includePrerelease = !!V.includePrerelease, this.raw = A.trim().replace(e, " "), this.set = this.raw.split("||").map((L) => this.parseRange(L.trim())).filter((L) => L.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const L = this.set[0];
        if (this.set = this.set.filter((G) => !$(G[0])), this.set.length === 0)
          this.set = [L];
        else if (this.set.length > 1) {
          for (const G of this.set)
            if (G.length === 1 && w(G[0])) {
              this.set = [G];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let A = 0; A < this.set.length; A++) {
          A > 0 && (this.formatted += "||");
          const V = this.set[A];
          for (let L = 0; L < V.length; L++)
            L > 0 && (this.formatted += " "), this.formatted += V[L].toString().trim();
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
    parseRange(A) {
      const L = ((this.options.includePrerelease && m) | (this.options.loose && v)) + ":" + A, G = n.get(L);
      if (G)
        return G;
      const M = this.options.loose, I = M ? o[u.HYPHENRANGELOOSE] : o[u.HYPHENRANGE];
      A = A.replace(I, K(this.options.includePrerelease)), i("hyphen replace", A), A = A.replace(o[u.COMPARATORTRIM], l), i("comparator trim", A), A = A.replace(o[u.TILDETRIM], f), i("tilde trim", A), A = A.replace(o[u.CARETTRIM], g), i("caret trim", A);
      let y = A.split(" ").map((h) => S(h, this.options)).join(" ").split(/\s+/).map((h) => z(h, this.options));
      M && (y = y.filter((h) => (i("loose invalid filter", h, this.options), !!h.match(o[u.COMPARATORLOOSE])))), i("range list", y);
      const P = /* @__PURE__ */ new Map(), E = y.map((h) => new a(h, this.options));
      for (const h of E) {
        if ($(h))
          return [h];
        P.set(h.value, h);
      }
      P.size > 1 && P.has("") && P.delete("");
      const d = [...P.values()];
      return n.set(L, d), d;
    }
    intersects(A, V) {
      if (!(A instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((L) => p(L, V) && A.set.some((G) => p(G, V) && L.every((M) => G.every((I) => M.intersects(I, V)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(A) {
      if (!A)
        return !1;
      if (typeof A == "string")
        try {
          A = new c(A, this.options);
        } catch {
          return !1;
        }
      for (let V = 0; V < this.set.length; V++)
        if (X(this.set[V], A, this.options))
          return !0;
      return !1;
    }
  }
  sn = t;
  const r = i$, n = new r(), s = Is, a = Xr(), i = Kr, c = we, {
    safeRe: o,
    t: u,
    comparatorTrimReplace: l,
    tildeTrimReplace: f,
    caretTrimReplace: g
  } = sr, { FLAG_INCLUDE_PRERELEASE: m, FLAG_LOOSE: v } = Gr, $ = (O) => O.value === "<0.0.0-0", w = (O) => O.value === "", p = (O, A) => {
    let V = !0;
    const L = O.slice();
    let G = L.pop();
    for (; V && L.length; )
      V = L.every((M) => G.intersects(M, A)), G = L.pop();
    return V;
  }, S = (O, A) => (i("comp", O, A), O = Z(O, A), i("caret", O), O = j(O, A), i("tildes", O), O = ie(O, A), i("xrange", O), O = ve(O, A), i("stars", O), O), N = (O) => !O || O.toLowerCase() === "x" || O === "*", j = (O, A) => O.trim().split(/\s+/).map((V) => D(V, A)).join(" "), D = (O, A) => {
    const V = A.loose ? o[u.TILDELOOSE] : o[u.TILDE];
    return O.replace(V, (L, G, M, I, y) => {
      i("tilde", O, L, G, M, I, y);
      let P;
      return N(G) ? P = "" : N(M) ? P = `>=${G}.0.0 <${+G + 1}.0.0-0` : N(I) ? P = `>=${G}.${M}.0 <${G}.${+M + 1}.0-0` : y ? (i("replaceTilde pr", y), P = `>=${G}.${M}.${I}-${y} <${G}.${+M + 1}.0-0`) : P = `>=${G}.${M}.${I} <${G}.${+M + 1}.0-0`, i("tilde return", P), P;
    });
  }, Z = (O, A) => O.trim().split(/\s+/).map((V) => ee(V, A)).join(" "), ee = (O, A) => {
    i("caret", O, A);
    const V = A.loose ? o[u.CARETLOOSE] : o[u.CARET], L = A.includePrerelease ? "-0" : "";
    return O.replace(V, (G, M, I, y, P) => {
      i("caret", O, G, M, I, y, P);
      let E;
      return N(M) ? E = "" : N(I) ? E = `>=${M}.0.0${L} <${+M + 1}.0.0-0` : N(y) ? M === "0" ? E = `>=${M}.${I}.0${L} <${M}.${+I + 1}.0-0` : E = `>=${M}.${I}.0${L} <${+M + 1}.0.0-0` : P ? (i("replaceCaret pr", P), M === "0" ? I === "0" ? E = `>=${M}.${I}.${y}-${P} <${M}.${I}.${+y + 1}-0` : E = `>=${M}.${I}.${y}-${P} <${M}.${+I + 1}.0-0` : E = `>=${M}.${I}.${y}-${P} <${+M + 1}.0.0-0`) : (i("no pr"), M === "0" ? I === "0" ? E = `>=${M}.${I}.${y}${L} <${M}.${I}.${+y + 1}-0` : E = `>=${M}.${I}.${y}${L} <${M}.${+I + 1}.0-0` : E = `>=${M}.${I}.${y} <${+M + 1}.0.0-0`), i("caret return", E), E;
    });
  }, ie = (O, A) => (i("replaceXRanges", O, A), O.split(/\s+/).map((V) => pe(V, A)).join(" ")), pe = (O, A) => {
    O = O.trim();
    const V = A.loose ? o[u.XRANGELOOSE] : o[u.XRANGE];
    return O.replace(V, (L, G, M, I, y, P) => {
      i("xRange", O, L, G, M, I, y, P);
      const E = N(M), d = E || N(I), h = d || N(y), R = h;
      return G === "=" && R && (G = ""), P = A.includePrerelease ? "-0" : "", E ? G === ">" || G === "<" ? L = "<0.0.0-0" : L = "*" : G && R ? (d && (I = 0), y = 0, G === ">" ? (G = ">=", d ? (M = +M + 1, I = 0, y = 0) : (I = +I + 1, y = 0)) : G === "<=" && (G = "<", d ? M = +M + 1 : I = +I + 1), G === "<" && (P = "-0"), L = `${G + M}.${I}.${y}${P}`) : d ? L = `>=${M}.0.0${P} <${+M + 1}.0.0-0` : h && (L = `>=${M}.${I}.0${P} <${M}.${+I + 1}.0-0`), i("xRange return", L), L;
    });
  }, ve = (O, A) => (i("replaceStars", O, A), O.trim().replace(o[u.STAR], "")), z = (O, A) => (i("replaceGTE0", O, A), O.trim().replace(o[A.includePrerelease ? u.GTE0PRE : u.GTE0], "")), K = (O) => (A, V, L, G, M, I, y, P, E, d, h, R) => (N(L) ? V = "" : N(G) ? V = `>=${L}.0.0${O ? "-0" : ""}` : N(M) ? V = `>=${L}.${G}.0${O ? "-0" : ""}` : I ? V = `>=${V}` : V = `>=${V}${O ? "-0" : ""}`, N(E) ? P = "" : N(d) ? P = `<${+E + 1}.0.0-0` : N(h) ? P = `<${E}.${+d + 1}.0-0` : R ? P = `<=${E}.${d}.${h}-${R}` : O ? P = `<${E}.${d}.${+h + 1}-0` : P = `<=${P}`, `${V} ${P}`.trim()), X = (O, A, V) => {
    for (let L = 0; L < O.length; L++)
      if (!O[L].test(A))
        return !1;
    if (A.prerelease.length && !V.includePrerelease) {
      for (let L = 0; L < O.length; L++)
        if (i(O[L].semver), O[L].semver !== a.ANY && O[L].semver.prerelease.length > 0) {
          const G = O[L].semver;
          if (G.major === A.major && G.minor === A.minor && G.patch === A.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return sn;
}
var an, Ma;
function Xr() {
  if (Ma) return an;
  Ma = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(l, f) {
      if (f = r(f), l instanceof t) {
        if (l.loose === !!f.loose)
          return l;
        l = l.value;
      }
      l = l.trim().split(/\s+/).join(" "), i("comparator", l, f), this.options = f, this.loose = !!f.loose, this.parse(l), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, i("comp", this);
    }
    parse(l) {
      const f = this.options.loose ? n[s.COMPARATORLOOSE] : n[s.COMPARATOR], g = l.match(f);
      if (!g)
        throw new TypeError(`Invalid comparator: ${l}`);
      this.operator = g[1] !== void 0 ? g[1] : "", this.operator === "=" && (this.operator = ""), g[2] ? this.semver = new c(g[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(l) {
      if (i("Comparator.test", l, this.options.loose), this.semver === e || l === e)
        return !0;
      if (typeof l == "string")
        try {
          l = new c(l, this.options);
        } catch {
          return !1;
        }
      return a(l, this.operator, this.semver, this.options);
    }
    intersects(l, f) {
      if (!(l instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new o(l.value, f).test(this.value) : l.operator === "" ? l.value === "" ? !0 : new o(this.value, f).test(l.semver) : (f = r(f), f.includePrerelease && (this.value === "<0.0.0-0" || l.value === "<0.0.0-0") || !f.includePrerelease && (this.value.startsWith("<0.0.0") || l.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && l.operator.startsWith(">") || this.operator.startsWith("<") && l.operator.startsWith("<") || this.semver.version === l.semver.version && this.operator.includes("=") && l.operator.includes("=") || a(this.semver, "<", l.semver, f) && this.operator.startsWith(">") && l.operator.startsWith("<") || a(this.semver, ">", l.semver, f) && this.operator.startsWith("<") && l.operator.startsWith(">")));
    }
  }
  an = t;
  const r = Is, { safeRe: n, t: s } = sr, a = Yo, i = Kr, c = we, o = Ve();
  return an;
}
const c$ = Ve(), l$ = (e, t, r) => {
  try {
    t = new c$(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var Br = l$;
const u$ = Ve(), d$ = (e, t) => new u$(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var f$ = d$;
const h$ = we, m$ = Ve(), p$ = (e, t, r) => {
  let n = null, s = null, a = null;
  try {
    a = new m$(t, r);
  } catch {
    return null;
  }
  return e.forEach((i) => {
    a.test(i) && (!n || s.compare(i) === -1) && (n = i, s = new h$(n, r));
  }), n;
};
var $$ = p$;
const y$ = we, g$ = Ve(), v$ = (e, t, r) => {
  let n = null, s = null, a = null;
  try {
    a = new g$(t, r);
  } catch {
    return null;
  }
  return e.forEach((i) => {
    a.test(i) && (!n || s.compare(i) === 1) && (n = i, s = new y$(n, r));
  }), n;
};
var _$ = v$;
const on = we, E$ = Ve(), Va = Hr, w$ = (e, t) => {
  e = new E$(e, t);
  let r = new on("0.0.0");
  if (e.test(r) || (r = new on("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const s = e.set[n];
    let a = null;
    s.forEach((i) => {
      const c = new on(i.semver.version);
      switch (i.operator) {
        case ">":
          c.prerelease.length === 0 ? c.patch++ : c.prerelease.push(0), c.raw = c.format();
        case "":
        case ">=":
          (!a || Va(c, a)) && (a = c);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${i.operator}`);
      }
    }), a && (!r || Va(r, a)) && (r = a);
  }
  return r && e.test(r) ? r : null;
};
var b$ = w$;
const S$ = Ve(), P$ = (e, t) => {
  try {
    return new S$(e, t).range || "*";
  } catch {
    return null;
  }
};
var R$ = P$;
const I$ = we, Zo = Xr(), { ANY: N$ } = Zo, O$ = Ve(), T$ = Br, Ua = Hr, za = Os, j$ = js, A$ = Ts, k$ = (e, t, r, n) => {
  e = new I$(e, n), t = new O$(t, n);
  let s, a, i, c, o;
  switch (r) {
    case ">":
      s = Ua, a = j$, i = za, c = ">", o = ">=";
      break;
    case "<":
      s = za, a = A$, i = Ua, c = "<", o = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (T$(e, t, n))
    return !1;
  for (let u = 0; u < t.set.length; ++u) {
    const l = t.set[u];
    let f = null, g = null;
    if (l.forEach((m) => {
      m.semver === N$ && (m = new Zo(">=0.0.0")), f = f || m, g = g || m, s(m.semver, f.semver, n) ? f = m : i(m.semver, g.semver, n) && (g = m);
    }), f.operator === c || f.operator === o || (!g.operator || g.operator === c) && a(e, g.semver))
      return !1;
    if (g.operator === o && i(e, g.semver))
      return !1;
  }
  return !0;
};
var As = k$;
const C$ = As, D$ = (e, t, r) => C$(e, t, ">", r);
var L$ = D$;
const M$ = As, V$ = (e, t, r) => M$(e, t, "<", r);
var U$ = V$;
const Fa = Ve(), z$ = (e, t, r) => (e = new Fa(e, r), t = new Fa(t, r), e.intersects(t, r));
var F$ = z$;
const q$ = Br, G$ = Me;
var K$ = (e, t, r) => {
  const n = [];
  let s = null, a = null;
  const i = e.sort((l, f) => G$(l, f, r));
  for (const l of i)
    q$(l, t, r) ? (a = l, s || (s = l)) : (a && n.push([s, a]), a = null, s = null);
  s && n.push([s, null]);
  const c = [];
  for (const [l, f] of n)
    l === f ? c.push(l) : !f && l === i[0] ? c.push("*") : f ? l === i[0] ? c.push(`<=${f}`) : c.push(`${l} - ${f}`) : c.push(`>=${l}`);
  const o = c.join(" || "), u = typeof t.raw == "string" ? t.raw : String(t);
  return o.length < u.length ? o : t;
};
const qa = Ve(), ks = Xr(), { ANY: cn } = ks, Gt = Br, Cs = Me, H$ = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new qa(e, r), t = new qa(t, r);
  let n = !1;
  e: for (const s of e.set) {
    for (const a of t.set) {
      const i = B$(s, a, r);
      if (n = n || i !== null, i)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, X$ = [new ks(">=0.0.0-0")], Ga = [new ks(">=0.0.0")], B$ = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === cn) {
    if (t.length === 1 && t[0].semver === cn)
      return !0;
    r.includePrerelease ? e = X$ : e = Ga;
  }
  if (t.length === 1 && t[0].semver === cn) {
    if (r.includePrerelease)
      return !0;
    t = Ga;
  }
  const n = /* @__PURE__ */ new Set();
  let s, a;
  for (const m of e)
    m.operator === ">" || m.operator === ">=" ? s = Ka(s, m, r) : m.operator === "<" || m.operator === "<=" ? a = Ha(a, m, r) : n.add(m.semver);
  if (n.size > 1)
    return null;
  let i;
  if (s && a) {
    if (i = Cs(s.semver, a.semver, r), i > 0)
      return null;
    if (i === 0 && (s.operator !== ">=" || a.operator !== "<="))
      return null;
  }
  for (const m of n) {
    if (s && !Gt(m, String(s), r) || a && !Gt(m, String(a), r))
      return null;
    for (const v of t)
      if (!Gt(m, String(v), r))
        return !1;
    return !0;
  }
  let c, o, u, l, f = a && !r.includePrerelease && a.semver.prerelease.length ? a.semver : !1, g = s && !r.includePrerelease && s.semver.prerelease.length ? s.semver : !1;
  f && f.prerelease.length === 1 && a.operator === "<" && f.prerelease[0] === 0 && (f = !1);
  for (const m of t) {
    if (l = l || m.operator === ">" || m.operator === ">=", u = u || m.operator === "<" || m.operator === "<=", s) {
      if (g && m.semver.prerelease && m.semver.prerelease.length && m.semver.major === g.major && m.semver.minor === g.minor && m.semver.patch === g.patch && (g = !1), m.operator === ">" || m.operator === ">=") {
        if (c = Ka(s, m, r), c === m && c !== s)
          return !1;
      } else if (s.operator === ">=" && !Gt(s.semver, String(m), r))
        return !1;
    }
    if (a) {
      if (f && m.semver.prerelease && m.semver.prerelease.length && m.semver.major === f.major && m.semver.minor === f.minor && m.semver.patch === f.patch && (f = !1), m.operator === "<" || m.operator === "<=") {
        if (o = Ha(a, m, r), o === m && o !== a)
          return !1;
      } else if (a.operator === "<=" && !Gt(a.semver, String(m), r))
        return !1;
    }
    if (!m.operator && (a || s) && i !== 0)
      return !1;
  }
  return !(s && u && !a && i !== 0 || a && l && !s && i !== 0 || g || f);
}, Ka = (e, t, r) => {
  if (!e)
    return t;
  const n = Cs(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, Ha = (e, t, r) => {
  if (!e)
    return t;
  const n = Cs(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var W$ = H$;
const ln = sr, Xa = Gr, J$ = we, Ba = Wo, x$ = Dt, Y$ = np, Z$ = op, Q$ = cp, ey = up, ty = hp, ry = $p, ny = vp, sy = wp, ay = Me, oy = Rp, iy = Op, cy = Ns, ly = kp, uy = Lp, dy = Hr, fy = Os, hy = Jo, my = xo, py = Ts, $y = js, yy = Yo, gy = a$, vy = Xr(), _y = Ve(), Ey = Br, wy = f$, by = $$, Sy = _$, Py = b$, Ry = R$, Iy = As, Ny = L$, Oy = U$, Ty = F$, jy = K$, Ay = W$;
var ky = {
  parse: x$,
  valid: Y$,
  clean: Z$,
  inc: Q$,
  diff: ey,
  major: ty,
  minor: ry,
  patch: ny,
  prerelease: sy,
  compare: ay,
  rcompare: oy,
  compareLoose: iy,
  compareBuild: cy,
  sort: ly,
  rsort: uy,
  gt: dy,
  lt: fy,
  eq: hy,
  neq: my,
  gte: py,
  lte: $y,
  cmp: yy,
  coerce: gy,
  Comparator: vy,
  Range: _y,
  satisfies: Ey,
  toComparators: wy,
  maxSatisfying: by,
  minSatisfying: Sy,
  minVersion: Py,
  validRange: Ry,
  outside: Iy,
  gtr: Ny,
  ltr: Oy,
  intersects: Ty,
  simplifyRange: jy,
  subset: Ay,
  SemVer: J$,
  re: ln.re,
  src: ln.src,
  tokens: ln.t,
  SEMVER_SPEC_VERSION: Xa.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Xa.RELEASE_TYPES,
  compareIdentifiers: Ba.compareIdentifiers,
  rcompareIdentifiers: Ba.rcompareIdentifiers
};
const vt = /* @__PURE__ */ to(ky), Cy = Object.prototype.toString, Dy = "[object Uint8Array]", Ly = "[object ArrayBuffer]";
function Qo(e, t, r) {
  return e ? e.constructor === t ? !0 : Cy.call(e) === r : !1;
}
function ei(e) {
  return Qo(e, Uint8Array, Dy);
}
function My(e) {
  return Qo(e, ArrayBuffer, Ly);
}
function Vy(e) {
  return ei(e) || My(e);
}
function Uy(e) {
  if (!ei(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
function zy(e) {
  if (!Vy(e))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof e}\``);
}
function Wa(e, t) {
  if (e.length === 0)
    return new Uint8Array(0);
  t ?? (t = e.reduce((s, a) => s + a.length, 0));
  const r = new Uint8Array(t);
  let n = 0;
  for (const s of e)
    Uy(s), r.set(s, n), n += s.length;
  return r;
}
const vr = {
  utf8: new globalThis.TextDecoder("utf8")
};
function Ja(e, t = "utf8") {
  return zy(e), vr[t] ?? (vr[t] = new globalThis.TextDecoder(t)), vr[t].decode(e);
}
function Fy(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
const qy = new globalThis.TextEncoder();
function un(e) {
  return Fy(e), qy.encode(e);
}
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
const Gy = km.default, xa = "aes-256-cbc", _t = () => /* @__PURE__ */ Object.create(null), Ky = (e) => e != null, Hy = (e, t) => {
  const r = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), n = typeof t;
  if (r.has(n))
    throw new TypeError(`Setting a value of type \`${n}\` for key \`${e}\` is not allowed as it's not supported by JSON`);
}, Pr = "__internal__", dn = `${Pr}.migrations.version`;
var nt, Ke, Ie, He;
class Xy {
  constructor(t = {}) {
    Mt(this, "path");
    Mt(this, "events");
    Vt(this, nt);
    Vt(this, Ke);
    Vt(this, Ie);
    Vt(this, He, {});
    Mt(this, "_deserialize", (t) => JSON.parse(t));
    Mt(this, "_serialize", (t) => JSON.stringify(t, void 0, "	"));
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
      r.cwd = Ji(r.projectName, { suffix: r.projectSuffix }).config;
    }
    if (Ut(this, Ie, r), r.schema ?? r.ajvOptions ?? r.rootSchema) {
      if (r.schema && typeof r.schema != "object")
        throw new TypeError("The `schema` option must be an object.");
      const i = new gm.Ajv2020({
        allErrors: !0,
        useDefaults: !0,
        ...r.ajvOptions
      });
      Gy(i);
      const c = {
        ...r.rootSchema,
        type: "object",
        properties: r.schema
      };
      Ut(this, nt, i.compile(c));
      for (const [o, u] of Object.entries(r.schema ?? {}))
        u != null && u.default && (se(this, He)[o] = u.default);
    }
    r.defaults && Ut(this, He, {
      ...se(this, He),
      ...r.defaults
    }), r.serialize && (this._serialize = r.serialize), r.deserialize && (this._deserialize = r.deserialize), this.events = new EventTarget(), Ut(this, Ke, r.encryptionKey);
    const n = r.fileExtension ? `.${r.fileExtension}` : "";
    this.path = Y.resolve(r.cwd, `${r.configName ?? "config"}${n}`);
    const s = this.store, a = Object.assign(_t(), r.defaults, s);
    if (r.migrations) {
      if (!r.projectVersion)
        throw new Error("Please specify the `projectVersion` option.");
      this._migrate(r.migrations, r.projectVersion, r.beforeEachMigration);
    }
    this._validate(a);
    try {
      eo.deepEqual(s, a);
    } catch {
      this.store = a;
    }
    r.watch && this._watch();
  }
  get(t, r) {
    if (se(this, Ie).accessPropertiesByDotNotation)
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
      throw new TypeError(`Please don't use the ${Pr} key, as it's used to manage this module internal operations.`);
    const { store: n } = this, s = (a, i) => {
      Hy(a, i), se(this, Ie).accessPropertiesByDotNotation ? Hs(n, a, i) : n[a] = i;
    };
    if (typeof t == "object") {
      const a = t;
      for (const [i, c] of Object.entries(a))
        s(i, c);
    } else
      s(t, r);
    this.store = n;
  }
  /**
      Check if an item exists.
  
      @param key - The key of the item to check.
      */
  has(t) {
    return se(this, Ie).accessPropertiesByDotNotation ? Hi(this.store, t) : t in this.store;
  }
  /**
      Reset items to their default values, as defined by the `defaults` or `schema` option.
  
      @see `clear()` to reset all items.
  
      @param keys - The keys of the items to reset.
      */
  reset(...t) {
    for (const r of t)
      Ky(se(this, He)[r]) && this.set(r, se(this, He)[r]);
  }
  delete(t) {
    const { store: r } = this;
    se(this, Ie).accessPropertiesByDotNotation ? Ki(r, t) : delete r[t], this.store = r;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    this.store = _t();
    for (const t of Object.keys(se(this, He)))
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
      const t = B.readFileSync(this.path, se(this, Ke) ? null : "utf8"), r = this._encryptData(t), n = this._deserialize(r);
      return this._validate(n), Object.assign(_t(), n);
    } catch (t) {
      if ((t == null ? void 0 : t.code) === "ENOENT")
        return this._ensureDirectory(), _t();
      if (se(this, Ie).clearInvalidConfig && t.name === "SyntaxError")
        return _t();
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
    if (!se(this, Ke))
      return typeof t == "string" ? t : Ja(t);
    try {
      const r = t.slice(0, 16), n = zt.pbkdf2Sync(se(this, Ke), r.toString(), 1e4, 32, "sha512"), s = zt.createDecipheriv(xa, n, r), a = t.slice(17), i = typeof a == "string" ? un(a) : a;
      return Ja(Wa([s.update(i), s.final()]));
    } catch {
    }
    return t.toString();
  }
  _handleChange(t, r) {
    let n = t();
    const s = () => {
      const a = n, i = t();
      ui(i, a) || (n = i, r.call(this, i, a));
    };
    return this.events.addEventListener("change", s), () => {
      this.events.removeEventListener("change", s);
    };
  }
  _validate(t) {
    if (!se(this, nt) || se(this, nt).call(this, t) || !se(this, nt).errors)
      return;
    const n = se(this, nt).errors.map(({ instancePath: s, message: a = "" }) => `\`${s.slice(1)}\` ${a}`);
    throw new Error("Config schema violation: " + n.join("; "));
  }
  _ensureDirectory() {
    B.mkdirSync(Y.dirname(this.path), { recursive: !0 });
  }
  _write(t) {
    let r = this._serialize(t);
    if (se(this, Ke)) {
      const n = zt.randomBytes(16), s = zt.pbkdf2Sync(se(this, Ke), n.toString(), 1e4, 32, "sha512"), a = zt.createCipheriv(xa, s, n);
      r = Wa([n, un(":"), a.update(un(r)), a.final()]);
    }
    if (le.env.SNAP)
      B.writeFileSync(this.path, r, { mode: se(this, Ie).configFileMode });
    else
      try {
        oo(this.path, r, { mode: se(this, Ie).configFileMode });
      } catch (n) {
        if ((n == null ? void 0 : n.code) === "EXDEV") {
          B.writeFileSync(this.path, r, { mode: se(this, Ie).configFileMode });
          return;
        }
        throw n;
      }
  }
  _watch() {
    this._ensureDirectory(), B.existsSync(this.path) || this._write(_t()), le.platform === "win32" ? B.watch(this.path, { persistent: !1 }, Na(() => {
      this.events.dispatchEvent(new Event("change"));
    }, { wait: 100 })) : B.watchFile(this.path, { persistent: !1 }, Na(() => {
      this.events.dispatchEvent(new Event("change"));
    }, { wait: 5e3 }));
  }
  _migrate(t, r, n) {
    let s = this._get(dn, "0.0.0");
    const a = Object.keys(t).filter((c) => this._shouldPerformMigration(c, s, r));
    let i = { ...this.store };
    for (const c of a)
      try {
        n && n(this, {
          fromVersion: s,
          toVersion: c,
          finalVersion: r,
          versions: a
        });
        const o = t[c];
        o == null || o(this), this._set(dn, c), s = c, i = { ...this.store };
      } catch (o) {
        throw this.store = i, new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${o}`);
      }
    (this._isVersionInRangeFormat(s) || !vt.eq(s, r)) && this._set(dn, r);
  }
  _containsReservedKey(t) {
    return typeof t == "object" && Object.keys(t)[0] === Pr ? !0 : typeof t != "string" ? !1 : se(this, Ie).accessPropertiesByDotNotation ? !!t.startsWith(`${Pr}.`) : !1;
  }
  _isVersionInRangeFormat(t) {
    return vt.clean(t) === null;
  }
  _shouldPerformMigration(t, r, n) {
    return this._isVersionInRangeFormat(t) ? r !== "0.0.0" && vt.satisfies(r, t) ? !1 : vt.satisfies(n, t) : !(vt.lte(t, r) || vt.gt(t, n));
  }
  _get(t, r) {
    return Gi(this.store, t, r);
  }
  _set(t, r) {
    const { store: n } = this;
    Hs(n, t, r), this.store = n;
  }
}
nt = new WeakMap(), Ke = new WeakMap(), Ie = new WeakMap(), He = new WeakMap();
const { app: Rr, ipcMain: bn, shell: By } = Rn;
let Ya = !1;
const Za = () => {
  if (!bn || !Rr)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const e = {
    defaultCwd: Rr.getPath("userData"),
    appVersion: Rr.getVersion()
  };
  return Ya || (bn.on("electron-store-get-data", (t) => {
    t.returnValue = e;
  }), Ya = !0), e;
};
class Wy extends Xy {
  constructor(t) {
    let r, n;
    if (le.type === "renderer") {
      const s = Rn.ipcRenderer.sendSync("electron-store-get-data");
      if (!s)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: r, appVersion: n } = s);
    } else bn && Rr && ({ defaultCwd: r, appVersion: n } = Za());
    t = {
      name: "config",
      ...t
    }, t.projectVersion || (t.projectVersion = n), t.cwd ? t.cwd = Y.isAbsolute(t.cwd) ? t.cwd : Y.join(r, t.cwd) : t.cwd = r, t.configName = t.name, delete t.name, super(t);
  }
  static initRenderer() {
    Za();
  }
  async openInEditor() {
    const t = await By.openPath(this.path);
    if (t)
      throw new Error(t);
  }
}
const Sn = new Wy({
  defaults: {
    darkMode: !1,
    hotkeys: {},
    streamDeck: !1,
    referral: void 0
  }
}), Jy = () => {
  Pt.handle("get-setting", (e, t) => Sn.get(t)), Pt.handle(
    "set-setting",
    (e, t, r) => {
      Sn.set(t, r), e.sender.send("setting-changed", t, r);
    }
  );
}, Xt = (e, t, r) => {
  Sn.set(t, r), e.webContents.send("setting-changed", t, r);
}, Ds = "tabzero", ti = async (e, t) => {
  const r = new URL(t);
  if (!r.protocol.startsWith(Ds)) return "not a valid url";
  const n = new URLSearchParams(r.search), s = n.get("code"), a = n.get("scope"), i = n.get("referral");
  if (!s || !a) return "no scope or code";
  i && Xt(e, "referral", i), e.webContents.send("auth", { code: s, scope: a });
}, xy = (e) => {
  De.setAsDefaultProtocolClient(Ds), De.on("open-url", async (t, r) => {
    ti(e, r);
  });
}, Yy = (e) => {
  try {
    return Bt.register(e, () => {
    }), Bt.unregister(e), !0;
  } catch {
    return !1;
  }
}, Zy = (e) => {
  const t = {};
  Pt.handle(
    "register-hotkey",
    (r, n) => {
      if (!Yy(n.keys))
        return console.error(`[Hotkey] Invalid accelerator: ${n.keys}`), !1;
      const s = t[n.name];
      return s && Bt.unregister(s), t[n.name] = n.keys, Bt.register(n.keys, () => {
        console.log(`[Hotkey] ${n.name}`), e.webContents.send("hotkey", n.name);
      }), !0;
    }
  ), e.on("close", () => {
    Object.values(t).forEach((r) => {
      Bt.unregister(r);
    }), Pt.removeHandler("register-hotkey");
  });
}, Qy = 51109, e0 = (e) => {
  const t = new hi({ port: Qy, perMessageDeflate: !1 });
  Xt(e, "streamDeck", !1), Pt.handle(
    "send-to-stream-deck",
    (r, n) => {
      t.clients.forEach((s) => {
        s.readyState === 1 && s.send(JSON.stringify(n));
      });
    }
  ), t.on("error", (r) => {
    console.error("[WS] Error:", r), Xt(e, "streamDeck", !1);
  }), t.on("connection", (r) => {
    console.log("[WS] Plugin connected"), Xt(e, "streamDeck", !0), r.on("message", (n) => {
      switch (n.toString()) {
        case "toggleRecording":
          e.webContents.send("hotkey", "toggleRecording");
          break;
        case "clipStream":
          e.webContents.send("hotkey", "clipStream");
          break;
      }
    }), r.on("close", () => {
      console.log("[WS] Plugin disconnected"), Xt(e, "streamDeck", !1);
    });
  });
}, t0 = di(import.meta.url), ri = Y.dirname(fi(import.meta.url));
De.setAppUserModelId("com.haydncom.tabzero");
t0("electron-squirrel-startup") && De.quit();
process.env.APP_ROOT = Y.join(ri, "..");
const Pn = process.env.VITE_DEV_SERVER_URL, m0 = Y.join(process.env.APP_ROOT, "dist-electron"), ni = Y.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = Pn ? Y.join(process.env.APP_ROOT, "public") : ni;
let he;
ji();
function si() {
  he = new Qa({
    icon: Y.join(process.env.VITE_PUBLIC, "icon.png"),
    webPreferences: {
      preload: Y.join(ri, "preload.mjs"),
      webSecurity: !1,
      devTools: !0
    },
    autoHideMenuBar: !0
  }), he.webContents.on("did-finish-load", () => {
    he == null || he.webContents.send("main-process-message", { hello: "world" });
  }), Pn ? he.loadURL(Pn) : he.loadFile(Y.join(ni, "index.html")), xy(he), Zy(he), e0(he);
}
De.on("window-all-closed", () => {
  process.platform !== "darwin" && (De.quit(), he = null);
});
De.on("activate", () => {
  Qa.getAllWindows().length === 0 && si();
});
Jy();
Fi();
if (!De.requestSingleInstanceLock())
  De.quit();
else {
  const e = async (t) => {
    if (!he) return;
    const r = t.find((n) => n.startsWith(`${Ds}://`));
    r && ti(he, r);
  };
  De.on("second-instance", (t, r) => {
    e(r), he && (he.isMinimized() && he.restore(), he.focus());
  }), De.whenReady().then(() => {
    si(), e(process.argv);
  });
}
export {
  m0 as MAIN_DIST,
  ni as RENDERER_DIST,
  Pn as VITE_DEV_SERVER_URL
};
