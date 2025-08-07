var Li = Object.defineProperty;
var es = (e) => {
  throw TypeError(e);
};
var Mi = (e, t, r) => t in e ? Li(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var Ct = (e, t, r) => Mi(e, typeof t != "symbol" ? t + "" : t, r), ts = (e, t, r) => t.has(e) || es("Cannot " + r);
var Q = (e, t, r) => (ts(e, t, "read from private field"), r ? r.call(e) : t.get(e)), xt = (e, t, r) => t.has(e) ? es("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), Dt = (e, t, r, n) => (ts(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r);
import zn, { ipcMain as Et, shell as zi, app as Ne, globalShortcut as Gt, BrowserWindow as $o } from "electron";
import yo from "node:assert";
import * as Sn from "node:fs";
import q from "node:fs";
import Yt from "node:os";
import K, { resolve as Vi, normalize as Ui, join as Fi } from "node:path";
import qi, { promisify as le, isDeepStrictEqual as Gi } from "node:util";
import { createRequire as Hi } from "node:module";
import { fileURLToPath as Ki } from "node:url";
import ae from "node:process";
import Lt from "node:crypto";
import { WebSocketServer as Xi } from "ws";
import Wi from "node:http";
import { resolve as Bi, join as cn } from "path";
import { readdirSync as Ji, statSync as Yi } from "fs";
import * as Zi from "node:querystring";
var rs = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function go(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Zt = {}, wt = 1e3, bt = wt * 60, St = bt * 60, ot = St * 24, Qi = ot * 7, ec = ot * 365.25, tc = function(e, t) {
  t = t || {};
  var r = typeof e;
  if (r === "string" && e.length > 0)
    return rc(e);
  if (r === "number" && isFinite(e))
    return t.long ? ac(e) : nc(e);
  throw new Error(
    "val is not a non-empty string or a valid number. val=" + JSON.stringify(e)
  );
};
function rc(e) {
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
          return r * ec;
        case "weeks":
        case "week":
        case "w":
          return r * Qi;
        case "days":
        case "day":
        case "d":
          return r * ot;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return r * St;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return r * bt;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return r * wt;
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
function nc(e) {
  var t = Math.abs(e);
  return t >= ot ? Math.round(e / ot) + "d" : t >= St ? Math.round(e / St) + "h" : t >= bt ? Math.round(e / bt) + "m" : t >= wt ? Math.round(e / wt) + "s" : e + "ms";
}
function ac(e) {
  var t = Math.abs(e);
  return t >= ot ? rr(e, t, ot, "day") : t >= St ? rr(e, t, St, "hour") : t >= bt ? rr(e, t, bt, "minute") : t >= wt ? rr(e, t, wt, "second") : e + " ms";
}
function rr(e, t, r, n) {
  var a = t >= r * 1.5;
  return Math.round(e / r) + " " + n + (a ? "s" : "");
}
var sc = lc, oc = /^(?:\w+:)?\/\/(\S+)$/, ic = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/, cc = /^[^\s\.]+\.\S{2,}$/;
function lc(e) {
  if (typeof e != "string")
    return !1;
  var t = e.match(oc);
  if (!t)
    return !1;
  var r = t[1];
  return r ? !!(ic.test(r) || cc.test(r)) : !1;
}
var uc = sc, dc = /(?:(?:[^:]+:)?[/][/])?(?:.+@)?([^/]+)([/][^?#]+)/, fc = function(e, t) {
  var r = {};
  if (t = t || {}, !e || (e.url && (e = e.url), typeof e != "string"))
    return null;
  var n = e.match(/^([\w-_]+)\/([\w-_\.]+)(?:#([\w-_\.]+))?$/), a = e.match(/^github:([\w-_]+)\/([\w-_\.]+)(?:#([\w-_\.]+))?$/), s = e.match(/^git@[\w-_\.]+:([\w-_]+)\/([\w-_\.]+)$/);
  if (n)
    r.user = n[1], r.repo = n[2], r.branch = n[3] || "master", r.host = "github.com";
  else if (a)
    r.user = a[1], r.repo = a[2], r.branch = a[3] || "master", r.host = "github.com";
  else if (s)
    r.user = s[1], r.repo = s[2].replace(/\.git$/i, ""), r.branch = "master", r.host = "github.com";
  else {
    if (e = e.replace(/^git\+/, ""), !uc(e))
      return null;
    var o = e.match(dc) || [], c = o[1], i = o[2];
    if (!c || c !== "github.com" && c !== "www.github.com" && !t.enterprise)
      return null;
    var u = i.match(/^\/([\w-_]+)\/([\w-_\.]+)(\/tree\/[\%\w-_\.\/]+)?(\/blob\/[\%\w-_\.\/]+)?/);
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
const pc = "update-electron-app", mc = "3.1.1", hc = {
  name: pc,
  version: mc
};
var Rt = rs && rs.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Zt, "__esModule", { value: !0 });
Zt.UpdateSourceType = void 0;
var $c = Zt.updateElectronApp = bc;
Zt.makeUserNotifier = _o;
const vo = Rt(tc), yc = Rt(fc), Be = Rt(yo), gc = Rt(q), ns = Rt(Yt), vc = Rt(K), _c = qi, pe = zn;
var st;
(function(e) {
  e[e.ElectronPublicUpdateService = 0] = "ElectronPublicUpdateService", e[e.StaticStorage = 1] = "StaticStorage";
})(st || (Zt.UpdateSourceType = st = {}));
const as = hc, Ec = (0, _c.format)("%s/%s (%s: %s)", as.name, as.version, ns.default.platform(), ns.default.arch()), wc = ["darwin", "win32"], ss = (e) => {
  try {
    const { protocol: t } = new URL(e);
    return t === "https:";
  } catch {
    return !1;
  }
};
function bc(e = {}) {
  const t = Pc(e);
  if (!pe.app.isPackaged) {
    const r = "update-electron-app config looks good; aborting updates since app is in development mode";
    e.logger ? e.logger.log(r) : console.log(r);
    return;
  }
  pe.app.isReady() ? os(t) : pe.app.on("ready", () => os(t));
}
function os(e) {
  const { updateSource: t, updateInterval: r, logger: n } = e;
  if (!wc.includes(process == null ? void 0 : process.platform)) {
    c(`Electron's autoUpdater does not support the '${process.platform}' platform. Ref: https://www.electronjs.org/docs/latest/api/auto-updater#platform-notices`);
    return;
  }
  let a, s = "default";
  switch (t.type) {
    case st.ElectronPublicUpdateService: {
      a = `${t.host}/${t.repo}/${process.platform}-${process.arch}/${pe.app.getVersion()}`;
      break;
    }
    case st.StaticStorage: {
      a = t.baseUrl, process.platform === "darwin" && (a += "/RELEASES.json", s = "json");
      break;
    }
  }
  const o = { "User-Agent": Ec };
  function c(...i) {
    n.log(...i);
  }
  c("feedURL", a), c("requestHeaders", o), pe.autoUpdater.setFeedURL({
    url: a,
    headers: o,
    serverType: s
  }), pe.autoUpdater.on("error", (i) => {
    c("updater error"), c(i);
  }), pe.autoUpdater.on("checking-for-update", () => {
    c("checking-for-update");
  }), pe.autoUpdater.on("update-available", () => {
    c("update-available; downloading...");
  }), pe.autoUpdater.on("update-not-available", () => {
    c("update-not-available");
  }), e.notifyUser && pe.autoUpdater.on("update-downloaded", (i, u, l, f, E) => {
    c("update-downloaded", [i, u, l, f, E]), typeof e.onNotifyUser != "function" ? ((0, Be.default)(e.onNotifyUser === void 0, "onNotifyUser option must be a callback function or undefined"), c("update-downloaded: notifyUser is true, opening default dialog"), e.onNotifyUser = _o()) : c("update-downloaded: notifyUser is true, running custom onNotifyUser callback"), e.onNotifyUser({
      event: i,
      releaseNotes: u,
      releaseDate: f,
      releaseName: l,
      updateURL: E
    });
  }), pe.autoUpdater.checkForUpdates(), setInterval(() => {
    pe.autoUpdater.checkForUpdates();
  }, (0, vo.default)(r));
}
function _o(e) {
  const r = Object.assign({}, {
    title: "Application Update",
    detail: "A new version has been downloaded. Restart the application to apply the updates.",
    restartButtonText: "Restart",
    laterButtonText: "Later"
  }, e);
  return (n) => {
    const { releaseNotes: a, releaseName: s } = n, { title: o, restartButtonText: c, laterButtonText: i, detail: u } = r, l = {
      type: "info",
      buttons: [c, i],
      title: o,
      message: process.platform === "win32" ? a : s,
      detail: u
    };
    pe.dialog.showMessageBox(l).then(({ response: f }) => {
      f === 0 && pe.autoUpdater.quitAndInstall();
    });
  };
}
function Sc() {
  var e;
  const t = gc.default.readFileSync(vc.default.join(pe.app.getAppPath(), "package.json")), r = JSON.parse(t.toString()), n = ((e = r.repository) === null || e === void 0 ? void 0 : e.url) || r.repository, a = (0, yc.default)(n);
  return (0, Be.default)(a, "repo not found. Add repository string to your app's package.json file"), `${a.user}/${a.repo}`;
}
function Pc(e) {
  var t;
  const r = {
    host: "https://update.electronjs.org",
    updateInterval: "10 minutes",
    logger: console,
    notifyUser: !0
  }, { host: n, updateInterval: a, logger: s, notifyUser: o, onNotifyUser: c } = Object.assign({}, r, e);
  let i = e.updateSource;
  switch (i || (i = {
    type: st.ElectronPublicUpdateService,
    repo: e.repo || Sc(),
    host: n
  }), i.type) {
    case st.ElectronPublicUpdateService: {
      (0, Be.default)((t = i.repo) === null || t === void 0 ? void 0 : t.includes("/"), "repo is required and should be in the format `owner/repo`"), i.host || (i.host = n), (0, Be.default)(i.host && ss(i.host), "host must be a valid HTTPS URL");
      break;
    }
    case st.StaticStorage: {
      (0, Be.default)(i.baseUrl && ss(i.baseUrl), "baseUrl must be a valid HTTPS URL");
      break;
    }
  }
  return (0, Be.default)(typeof a == "string" && a.match(/^\d+/), "updateInterval must be a human-friendly string interval like `20 minutes`"), (0, Be.default)((0, vo.default)(a) >= 5 * 60 * 1e3, "updateInterval must be `5 minutes` or more"), (0, Be.default)(s && typeof s.log, "function"), { updateSource: i, updateInterval: a, logger: s, notifyUser: o, onNotifyUser: c };
}
const Rc = () => {
  Et.handle("open-external", (e, t) => zi.openExternal(t));
}, it = (e) => {
  const t = typeof e;
  return e !== null && (t === "object" || t === "function");
}, ln = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), Ic = new Set("0123456789");
function Nr(e) {
  const t = [];
  let r = "", n = "start", a = !1;
  for (const s of e)
    switch (s) {
      case "\\": {
        if (n === "index")
          throw new Error("Invalid character in an index");
        if (n === "indexEnd")
          throw new Error("Invalid character after an index");
        a && (r += s), n = "property", a = !a;
        break;
      }
      case ".": {
        if (n === "index")
          throw new Error("Invalid character in an index");
        if (n === "indexEnd") {
          n = "property";
          break;
        }
        if (a) {
          a = !1, r += s;
          break;
        }
        if (ln.has(r))
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
        if (a) {
          a = !1, r += s;
          break;
        }
        if (n === "property") {
          if (ln.has(r))
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
        if (n === "index" && !Ic.has(s))
          throw new Error("Invalid character in an index");
        if (n === "indexEnd")
          throw new Error("Invalid character after an index");
        n === "start" && (n = "property"), a && (a = !1, r += "\\"), r += s;
      }
    }
  switch (a && (r += "\\"), n) {
    case "property": {
      if (ln.has(r))
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
function Vn(e, t) {
  if (typeof t != "number" && Array.isArray(e)) {
    const r = Number.parseInt(t, 10);
    return Number.isInteger(r) && e[r] === e[t];
  }
  return !1;
}
function Eo(e, t) {
  if (Vn(e, t))
    throw new Error("Cannot use string index");
}
function jc(e, t, r) {
  if (!it(e) || typeof t != "string")
    return r === void 0 ? e : r;
  const n = Nr(t);
  if (n.length === 0)
    return r;
  for (let a = 0; a < n.length; a++) {
    const s = n[a];
    if (Vn(e, s) ? e = a === n.length - 1 ? void 0 : null : e = e[s], e == null) {
      if (a !== n.length - 1)
        return r;
      break;
    }
  }
  return e === void 0 ? r : e;
}
function is(e, t, r) {
  if (!it(e) || typeof t != "string")
    return e;
  const n = e, a = Nr(t);
  for (let s = 0; s < a.length; s++) {
    const o = a[s];
    Eo(e, o), s === a.length - 1 ? e[o] = r : it(e[o]) || (e[o] = typeof a[s + 1] == "number" ? [] : {}), e = e[o];
  }
  return n;
}
function Nc(e, t) {
  if (!it(e) || typeof t != "string")
    return !1;
  const r = Nr(t);
  for (let n = 0; n < r.length; n++) {
    const a = r[n];
    if (Eo(e, a), n === r.length - 1)
      return delete e[a], !0;
    if (e = e[a], !it(e))
      return !1;
  }
}
function Oc(e, t) {
  if (!it(e) || typeof t != "string")
    return !1;
  const r = Nr(t);
  if (r.length === 0)
    return !1;
  for (const n of r) {
    if (!it(e) || !(n in e) || Vn(e, n))
      return !1;
    e = e[n];
  }
  return !0;
}
const Je = Yt.homedir(), Un = Yt.tmpdir(), { env: gt } = ae, Tc = (e) => {
  const t = K.join(Je, "Library");
  return {
    data: K.join(t, "Application Support", e),
    config: K.join(t, "Preferences", e),
    cache: K.join(t, "Caches", e),
    log: K.join(t, "Logs", e),
    temp: K.join(Un, e)
  };
}, Ac = (e) => {
  const t = gt.APPDATA || K.join(Je, "AppData", "Roaming"), r = gt.LOCALAPPDATA || K.join(Je, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: K.join(r, e, "Data"),
    config: K.join(t, e, "Config"),
    cache: K.join(r, e, "Cache"),
    log: K.join(r, e, "Log"),
    temp: K.join(Un, e)
  };
}, kc = (e) => {
  const t = K.basename(Je);
  return {
    data: K.join(gt.XDG_DATA_HOME || K.join(Je, ".local", "share"), e),
    config: K.join(gt.XDG_CONFIG_HOME || K.join(Je, ".config"), e),
    cache: K.join(gt.XDG_CACHE_HOME || K.join(Je, ".cache"), e),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: K.join(gt.XDG_STATE_HOME || K.join(Je, ".local", "state"), e),
    temp: K.join(Un, t, e)
  };
};
function Cc(e, { suffix: t = "nodejs" } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  return t && (e += `-${t}`), ae.platform === "darwin" ? Tc(e) : ae.platform === "win32" ? Ac(e) : kc(e);
}
const qe = (e, t) => function(...n) {
  return e.apply(void 0, n).catch(t);
}, De = (e, t) => function(...n) {
  try {
    return e.apply(void 0, n);
  } catch (a) {
    return t(a);
  }
}, xc = ae.getuid ? !ae.getuid() : !1, Dc = 1e4, ve = () => {
}, ee = {
  /* API */
  isChangeErrorOk: (e) => {
    if (!ee.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "ENOSYS" || !xc && (t === "EINVAL" || t === "EPERM");
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
class Lc {
  constructor() {
    this.interval = 25, this.intervalId = void 0, this.limit = Dc, this.queueActive = /* @__PURE__ */ new Set(), this.queueWaiting = /* @__PURE__ */ new Set(), this.init = () => {
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
const Mc = new Lc(), Ge = (e, t) => function(n) {
  return function a(...s) {
    return Mc.schedule().then((o) => {
      const c = (u) => (o(), u), i = (u) => {
        if (o(), Date.now() >= n)
          throw u;
        if (t(u)) {
          const l = Math.round(100 * Math.random());
          return new Promise((E) => setTimeout(E, l)).then(() => a.apply(void 0, s));
        }
        throw u;
      };
      return e.apply(void 0, s).then(c, i);
    });
  };
}, He = (e, t) => function(n) {
  return function a(...s) {
    try {
      return e.apply(void 0, s);
    } catch (o) {
      if (Date.now() > n)
        throw o;
      if (t(o))
        return a.apply(void 0, s);
      throw o;
    }
  };
}, de = {
  attempt: {
    /* ASYNC */
    chmod: qe(le(q.chmod), ee.onChangeError),
    chown: qe(le(q.chown), ee.onChangeError),
    close: qe(le(q.close), ve),
    fsync: qe(le(q.fsync), ve),
    mkdir: qe(le(q.mkdir), ve),
    realpath: qe(le(q.realpath), ve),
    stat: qe(le(q.stat), ve),
    unlink: qe(le(q.unlink), ve),
    /* SYNC */
    chmodSync: De(q.chmodSync, ee.onChangeError),
    chownSync: De(q.chownSync, ee.onChangeError),
    closeSync: De(q.closeSync, ve),
    existsSync: De(q.existsSync, ve),
    fsyncSync: De(q.fsync, ve),
    mkdirSync: De(q.mkdirSync, ve),
    realpathSync: De(q.realpathSync, ve),
    statSync: De(q.statSync, ve),
    unlinkSync: De(q.unlinkSync, ve)
  },
  retry: {
    /* ASYNC */
    close: Ge(le(q.close), ee.isRetriableError),
    fsync: Ge(le(q.fsync), ee.isRetriableError),
    open: Ge(le(q.open), ee.isRetriableError),
    readFile: Ge(le(q.readFile), ee.isRetriableError),
    rename: Ge(le(q.rename), ee.isRetriableError),
    stat: Ge(le(q.stat), ee.isRetriableError),
    write: Ge(le(q.write), ee.isRetriableError),
    writeFile: Ge(le(q.writeFile), ee.isRetriableError),
    /* SYNC */
    closeSync: He(q.closeSync, ee.isRetriableError),
    fsyncSync: He(q.fsyncSync, ee.isRetriableError),
    openSync: He(q.openSync, ee.isRetriableError),
    readFileSync: He(q.readFileSync, ee.isRetriableError),
    renameSync: He(q.renameSync, ee.isRetriableError),
    statSync: He(q.statSync, ee.isRetriableError),
    writeSync: He(q.writeSync, ee.isRetriableError),
    writeFileSync: He(q.writeFileSync, ee.isRetriableError)
  }
}, zc = "utf8", cs = 438, Vc = 511, Uc = {}, Fc = Yt.userInfo().uid, qc = Yt.userInfo().gid, Gc = 1e3, Hc = !!ae.getuid;
ae.getuid && ae.getuid();
const ls = 128, Kc = (e) => e instanceof Error && "code" in e, us = (e) => typeof e == "string", un = (e) => e === void 0, Xc = ae.platform === "linux", wo = ae.platform === "win32", Fn = ["SIGABRT", "SIGALRM", "SIGHUP", "SIGINT", "SIGTERM"];
wo || Fn.push("SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
Xc && Fn.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT", "SIGUNUSED");
class Wc {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (t) => {
      if (!this.exited) {
        this.exited = !0;
        for (const r of this.callbacks)
          r();
        t && (wo && t !== "SIGINT" && t !== "SIGTERM" && t !== "SIGKILL" ? ae.kill(ae.pid, "SIGTERM") : ae.kill(ae.pid, t));
      }
    }, this.hook = () => {
      ae.once("exit", () => this.exit());
      for (const t of Fn)
        try {
          ae.once(t, () => this.exit(t));
        } catch {
        }
    }, this.register = (t) => (this.callbacks.add(t), () => {
      this.callbacks.delete(t);
    }), this.hook();
  }
}
const Bc = new Wc(), Jc = Bc.register, fe = {
  /* VARIABLES */
  store: {},
  /* API */
  create: (e) => {
    const t = `000000${Math.floor(Math.random() * 16777215).toString(16)}`.slice(-6), a = `.tmp-${Date.now().toString().slice(-10)}${t}`;
    return `${e}${a}`;
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
    const t = K.basename(e);
    if (t.length <= ls)
      return e;
    const r = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(t);
    if (!r)
      return e;
    const n = t.length - ls;
    return `${e.slice(0, -t.length)}${r[1]}${r[2].slice(0, -n)}${r[3]}`;
  }
};
Jc(fe.purgeSyncAll);
function bo(e, t, r = Uc) {
  if (us(r))
    return bo(e, t, { encoding: r });
  const n = Date.now() + ((r.timeout ?? Gc) || -1);
  let a = null, s = null, o = null;
  try {
    const c = de.attempt.realpathSync(e), i = !!c;
    e = c || e, [s, a] = fe.get(e, r.tmpCreate || fe.create, r.tmpPurge !== !1);
    const u = Hc && un(r.chown), l = un(r.mode);
    if (i && (u || l)) {
      const f = de.attempt.statSync(e);
      f && (r = { ...r }, u && (r.chown = { uid: f.uid, gid: f.gid }), l && (r.mode = f.mode));
    }
    if (!i) {
      const f = K.dirname(e);
      de.attempt.mkdirSync(f, {
        mode: Vc,
        recursive: !0
      });
    }
    o = de.retry.openSync(n)(s, "w", r.mode || cs), r.tmpCreated && r.tmpCreated(s), us(t) ? de.retry.writeSync(n)(o, t, 0, r.encoding || zc) : un(t) || de.retry.writeSync(n)(o, t, 0, t.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? de.retry.fsyncSync(n)(o) : de.attempt.fsync(o)), de.retry.closeSync(n)(o), o = null, r.chown && (r.chown.uid !== Fc || r.chown.gid !== qc) && de.attempt.chownSync(s, r.chown.uid, r.chown.gid), r.mode && r.mode !== cs && de.attempt.chmodSync(s, r.mode);
    try {
      de.retry.renameSync(n)(s, e);
    } catch (f) {
      if (!Kc(f) || f.code !== "ENAMETOOLONG")
        throw f;
      de.retry.renameSync(n)(s, fe.truncate(e));
    }
    a(), s = null;
  } finally {
    o && de.attempt.closeSync(o), s && fe.purge(s);
  }
}
var Pn = { exports: {} }, qn = {}, Se = {}, Pt = {}, Qt = {}, U = {}, Jt = {};
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
      return (w = this._str) !== null && w !== void 0 ? w : this._str = this._items.reduce((R, N) => `${R}${N}`, "");
    }
    get names() {
      var w;
      return (w = this._names) !== null && w !== void 0 ? w : this._names = this._items.reduce((R, N) => (N instanceof r && (R[N.str] = (R[N.str] || 0) + 1), R), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function a(m, ...w) {
    const R = [m[0]];
    let N = 0;
    for (; N < w.length; )
      c(R, w[N]), R.push(m[++N]);
    return new n(R);
  }
  e._ = a;
  const s = new n("+");
  function o(m, ...w) {
    const R = [h(m[0])];
    let N = 0;
    for (; N < w.length; )
      R.push(s), c(R, w[N]), R.push(s, h(m[++N]));
    return i(R), new n(R);
  }
  e.str = o;
  function c(m, w) {
    w instanceof n ? m.push(...w._items) : w instanceof r ? m.push(w) : m.push(f(w));
  }
  e.addCodeArg = c;
  function i(m) {
    let w = 1;
    for (; w < m.length - 1; ) {
      if (m[w] === s) {
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
  function l(m, w) {
    return w.emptyStr() ? m : m.emptyStr() ? w : o`${m}${w}`;
  }
  e.strConcat = l;
  function f(m) {
    return typeof m == "number" || typeof m == "boolean" || m === null ? m : h(Array.isArray(m) ? m.join(",") : m);
  }
  function E(m) {
    return new n(h(m));
  }
  e.stringify = E;
  function h(m) {
    return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = h;
  function v(m) {
    return typeof m == "string" && e.IDENTIFIER.test(m) ? new n(`.${m}`) : a`[${m}]`;
  }
  e.getProperty = v;
  function y(m) {
    if (typeof m == "string" && e.IDENTIFIER.test(m))
      return new n(`${m}`);
    throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
  }
  e.getEsmExportName = y;
  function _(m) {
    return new n(m.toString());
  }
  e.regexpCode = _;
})(Jt);
var Rn = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = Jt;
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
  class a {
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
  e.Scope = a;
  class s extends t.Name {
    constructor(u, l) {
      super(l), this.prefix = u;
    }
    setValue(u, { property: l, itemIndex: f }) {
      this.value = u, this.scopePath = (0, t._)`.${new t.Name(l)}[${f}]`;
    }
  }
  e.ValueScopeName = s;
  const o = (0, t._)`\n`;
  class c extends a {
    constructor(u) {
      super(u), this._values = {}, this._scope = u.scope, this.opts = { ...u, _n: u.lines ? o : t.nil };
    }
    get() {
      return this._scope;
    }
    name(u) {
      return new s(u, this._newName(u));
    }
    value(u, l) {
      var f;
      if (l.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const E = this.toName(u), { prefix: h } = E, v = (f = l.key) !== null && f !== void 0 ? f : l.ref;
      let y = this._values[h];
      if (y) {
        const w = y.get(v);
        if (w)
          return w;
      } else
        y = this._values[h] = /* @__PURE__ */ new Map();
      y.set(v, E);
      const _ = this._scope[h] || (this._scope[h] = []), m = _.length;
      return _[m] = l.ref, E.setValue(l, { property: h, itemIndex: m }), E;
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
      return this._reduceValues(u, (E) => {
        if (E.value === void 0)
          throw new Error(`CodeGen: name "${E}" has no value`);
        return E.value.code;
      }, l, f);
    }
    _reduceValues(u, l, f = {}, E) {
      let h = t.nil;
      for (const v in u) {
        const y = u[v];
        if (!y)
          continue;
        const _ = f[v] = f[v] || /* @__PURE__ */ new Map();
        y.forEach((m) => {
          if (_.has(m))
            return;
          _.set(m, n.Started);
          let w = l(m);
          if (w) {
            const R = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            h = (0, t._)`${h}${R} ${m} = ${w};${this.opts._n}`;
          } else if (w = E == null ? void 0 : E(m))
            h = (0, t._)`${h}${w}${this.opts._n}`;
          else
            throw new r(m);
          _.set(m, n.Completed);
        });
      }
      return h;
    }
  }
  e.ValueScope = c;
})(Rn);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = Jt, r = Rn;
  var n = Jt;
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
  var a = Rn;
  Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
    return a.Scope;
  } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
    return a.ValueScope;
  } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
    return a.ValueScopeName;
  } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
    return a.varKinds;
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
  class s {
    optimizeNodes() {
      return this;
    }
    optimizeNames(d, p) {
      return this;
    }
  }
  class o extends s {
    constructor(d, p, S) {
      super(), this.varKind = d, this.name = p, this.rhs = S;
    }
    render({ es5: d, _n: p }) {
      const S = d ? r.varKinds.var : this.varKind, D = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${S} ${this.name}${D};` + p;
    }
    optimizeNames(d, p) {
      if (d[this.name.str])
        return this.rhs && (this.rhs = I(this.rhs, d, p)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class c extends s {
    constructor(d, p, S) {
      super(), this.lhs = d, this.rhs = p, this.sideEffects = S;
    }
    render({ _n: d }) {
      return `${this.lhs} = ${this.rhs};` + d;
    }
    optimizeNames(d, p) {
      if (!(this.lhs instanceof t.Name && !d[this.lhs.str] && !this.sideEffects))
        return this.rhs = I(this.rhs, d, p), this;
    }
    get names() {
      const d = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return Y(d, this.rhs);
    }
  }
  class i extends c {
    constructor(d, p, S, D) {
      super(d, S, D), this.op = p;
    }
    render({ _n: d }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + d;
    }
  }
  class u extends s {
    constructor(d) {
      super(), this.label = d, this.names = {};
    }
    render({ _n: d }) {
      return `${this.label}:` + d;
    }
  }
  class l extends s {
    constructor(d) {
      super(), this.label = d, this.names = {};
    }
    render({ _n: d }) {
      return `break${this.label ? ` ${this.label}` : ""};` + d;
    }
  }
  class f extends s {
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
  class E extends s {
    constructor(d) {
      super(), this.code = d;
    }
    render({ _n: d }) {
      return `${this.code};` + d;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(d, p) {
      return this.code = I(this.code, d, p), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class h extends s {
    constructor(d = []) {
      super(), this.nodes = d;
    }
    render(d) {
      return this.nodes.reduce((p, S) => p + S.render(d), "");
    }
    optimizeNodes() {
      const { nodes: d } = this;
      let p = d.length;
      for (; p--; ) {
        const S = d[p].optimizeNodes();
        Array.isArray(S) ? d.splice(p, 1, ...S) : S ? d[p] = S : d.splice(p, 1);
      }
      return d.length > 0 ? this : void 0;
    }
    optimizeNames(d, p) {
      const { nodes: S } = this;
      let D = S.length;
      for (; D--; ) {
        const L = S[D];
        L.optimizeNames(d, p) || (j(d, L.names), S.splice(D, 1));
      }
      return S.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((d, p) => F(d, p.names), {});
    }
  }
  class v extends h {
    render(d) {
      return "{" + d._n + super.render(d) + "}" + d._n;
    }
  }
  class y extends h {
  }
  class _ extends v {
  }
  _.kind = "else";
  class m extends v {
    constructor(d, p) {
      super(p), this.condition = d;
    }
    render(d) {
      let p = `if(${this.condition})` + super.render(d);
      return this.else && (p += "else " + this.else.render(d)), p;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const d = this.condition;
      if (d === !0)
        return this.nodes;
      let p = this.else;
      if (p) {
        const S = p.optimizeNodes();
        p = this.else = Array.isArray(S) ? new _(S) : S;
      }
      if (p)
        return d === !1 ? p instanceof m ? p : p.nodes : this.nodes.length ? this : new m(C(d), p instanceof m ? [p] : p.nodes);
      if (!(d === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(d, p) {
      var S;
      if (this.else = (S = this.else) === null || S === void 0 ? void 0 : S.optimizeNames(d, p), !!(super.optimizeNames(d, p) || this.else))
        return this.condition = I(this.condition, d, p), this;
    }
    get names() {
      const d = super.names;
      return Y(d, this.condition), this.else && F(d, this.else.names), d;
    }
  }
  m.kind = "if";
  class w extends v {
  }
  w.kind = "for";
  class R extends w {
    constructor(d) {
      super(), this.iteration = d;
    }
    render(d) {
      return `for(${this.iteration})` + super.render(d);
    }
    optimizeNames(d, p) {
      if (super.optimizeNames(d, p))
        return this.iteration = I(this.iteration, d, p), this;
    }
    get names() {
      return F(super.names, this.iteration.names);
    }
  }
  class N extends w {
    constructor(d, p, S, D) {
      super(), this.varKind = d, this.name = p, this.from = S, this.to = D;
    }
    render(d) {
      const p = d.es5 ? r.varKinds.var : this.varKind, { name: S, from: D, to: L } = this;
      return `for(${p} ${S}=${D}; ${S}<${L}; ${S}++)` + super.render(d);
    }
    get names() {
      const d = Y(super.names, this.from);
      return Y(d, this.to);
    }
  }
  class T extends w {
    constructor(d, p, S, D) {
      super(), this.loop = d, this.varKind = p, this.name = S, this.iterable = D;
    }
    render(d) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(d);
    }
    optimizeNames(d, p) {
      if (super.optimizeNames(d, p))
        return this.iterable = I(this.iterable, d, p), this;
    }
    get names() {
      return F(super.names, this.iterable.names);
    }
  }
  class W extends v {
    constructor(d, p, S) {
      super(), this.name = d, this.args = p, this.async = S;
    }
    render(d) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(d);
    }
  }
  W.kind = "func";
  class te extends h {
    render(d) {
      return "return " + super.render(d);
    }
  }
  te.kind = "return";
  class ye extends v {
    render(d) {
      let p = "try" + super.render(d);
      return this.catch && (p += this.catch.render(d)), this.finally && (p += this.finally.render(d)), p;
    }
    optimizeNodes() {
      var d, p;
      return super.optimizeNodes(), (d = this.catch) === null || d === void 0 || d.optimizeNodes(), (p = this.finally) === null || p === void 0 || p.optimizeNodes(), this;
    }
    optimizeNames(d, p) {
      var S, D;
      return super.optimizeNames(d, p), (S = this.catch) === null || S === void 0 || S.optimizeNames(d, p), (D = this.finally) === null || D === void 0 || D.optimizeNames(d, p), this;
    }
    get names() {
      const d = super.names;
      return this.catch && F(d, this.catch.names), this.finally && F(d, this.finally.names), d;
    }
  }
  class we extends v {
    constructor(d) {
      super(), this.error = d;
    }
    render(d) {
      return `catch(${this.error})` + super.render(d);
    }
  }
  we.kind = "catch";
  class Pe extends v {
    render(d) {
      return "finally" + super.render(d);
    }
  }
  Pe.kind = "finally";
  class z {
    constructor(d, p = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...p, _n: p.lines ? `
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
    scopeValue(d, p) {
      const S = this._extScope.value(d, p);
      return (this._values[S.prefix] || (this._values[S.prefix] = /* @__PURE__ */ new Set())).add(S), S;
    }
    getScopeValue(d, p) {
      return this._extScope.getValue(d, p);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(d) {
      return this._extScope.scopeRefs(d, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(d, p, S, D) {
      const L = this._scope.toName(p);
      return S !== void 0 && D && (this._constants[L.str] = S), this._leafNode(new o(d, L, S)), L;
    }
    // `const` declaration (`var` in es5 mode)
    const(d, p, S) {
      return this._def(r.varKinds.const, d, p, S);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(d, p, S) {
      return this._def(r.varKinds.let, d, p, S);
    }
    // `var` declaration with optional assignment
    var(d, p, S) {
      return this._def(r.varKinds.var, d, p, S);
    }
    // assignment code
    assign(d, p, S) {
      return this._leafNode(new c(d, p, S));
    }
    // `+=` code
    add(d, p) {
      return this._leafNode(new i(d, e.operators.ADD, p));
    }
    // appends passed SafeExpr to code or executes Block
    code(d) {
      return typeof d == "function" ? d() : d !== t.nil && this._leafNode(new E(d)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...d) {
      const p = ["{"];
      for (const [S, D] of d)
        p.length > 1 && p.push(","), p.push(S), (S !== D || this.opts.es5) && (p.push(":"), (0, t.addCodeArg)(p, D));
      return p.push("}"), new t._Code(p);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(d, p, S) {
      if (this._blockNode(new m(d)), p && S)
        this.code(p).else().code(S).endIf();
      else if (p)
        this.code(p).endIf();
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
      return this._elseNode(new _());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(m, _);
    }
    _for(d, p) {
      return this._blockNode(d), p && this.code(p).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(d, p) {
      return this._for(new R(d), p);
    }
    // `for` statement for a range of values
    forRange(d, p, S, D, L = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const B = this._scope.toName(d);
      return this._for(new N(L, B, p, S), () => D(B));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(d, p, S, D = r.varKinds.const) {
      const L = this._scope.toName(d);
      if (this.opts.es5) {
        const B = p instanceof t.Name ? p : this.var("_arr", p);
        return this.forRange("_i", 0, (0, t._)`${B}.length`, (X) => {
          this.var(L, (0, t._)`${B}[${X}]`), S(L);
        });
      }
      return this._for(new T("of", D, L, p), () => S(L));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(d, p, S, D = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(d, (0, t._)`Object.keys(${p})`, S);
      const L = this._scope.toName(d);
      return this._for(new T("in", D, L, p), () => S(L));
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
      return this._leafNode(new l(d));
    }
    // `return` statement
    return(d) {
      const p = new te();
      if (this._blockNode(p), this.code(d), p.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(te);
    }
    // `try` statement
    try(d, p, S) {
      if (!p && !S)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const D = new ye();
      if (this._blockNode(D), this.code(d), p) {
        const L = this.name("e");
        this._currNode = D.catch = new we(L), p(L);
      }
      return S && (this._currNode = D.finally = new Pe(), this.code(S)), this._endBlockNode(we, Pe);
    }
    // `throw` statement
    throw(d) {
      return this._leafNode(new f(d));
    }
    // start self-balancing block
    block(d, p) {
      return this._blockStarts.push(this._nodes.length), d && this.code(d).endBlock(p), this;
    }
    // end the current self-balancing block
    endBlock(d) {
      const p = this._blockStarts.pop();
      if (p === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const S = this._nodes.length - p;
      if (S < 0 || d !== void 0 && S !== d)
        throw new Error(`CodeGen: wrong number of nodes: ${S} vs ${d} expected`);
      return this._nodes.length = p, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(d, p = t.nil, S, D) {
      return this._blockNode(new W(d, p, S)), D && this.code(D).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(W);
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
    _endBlockNode(d, p) {
      const S = this._currNode;
      if (S instanceof d || p && S instanceof p)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${p ? `${d.kind}/${p.kind}` : d.kind}"`);
    }
    _elseNode(d) {
      const p = this._currNode;
      if (!(p instanceof m))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = p.else = d, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const d = this._nodes;
      return d[d.length - 1];
    }
    set _currNode(d) {
      const p = this._nodes;
      p[p.length - 1] = d;
    }
  }
  e.CodeGen = z;
  function F(g, d) {
    for (const p in d)
      g[p] = (g[p] || 0) + (d[p] || 0);
    return g;
  }
  function Y(g, d) {
    return d instanceof t._CodeOrName ? F(g, d.names) : g;
  }
  function I(g, d, p) {
    if (g instanceof t.Name)
      return S(g);
    if (!D(g))
      return g;
    return new t._Code(g._items.reduce((L, B) => (B instanceof t.Name && (B = S(B)), B instanceof t._Code ? L.push(...B._items) : L.push(B), L), []));
    function S(L) {
      const B = p[L.str];
      return B === void 0 || d[L.str] !== 1 ? L : (delete d[L.str], B);
    }
    function D(L) {
      return L instanceof t._Code && L._items.some((B) => B instanceof t.Name && d[B.str] === 1 && p[B.str] !== void 0);
    }
  }
  function j(g, d) {
    for (const p in d)
      g[p] = (g[p] || 0) - (d[p] || 0);
  }
  function C(g) {
    return typeof g == "boolean" || typeof g == "number" || g === null ? !g : (0, t._)`!${b(g)}`;
  }
  e.not = C;
  const A = $(e.operators.AND);
  function M(...g) {
    return g.reduce(A);
  }
  e.and = M;
  const k = $(e.operators.OR);
  function P(...g) {
    return g.reduce(k);
  }
  e.or = P;
  function $(g) {
    return (d, p) => d === t.nil ? p : p === t.nil ? d : (0, t._)`${b(d)} ${g} ${b(p)}`;
  }
  function b(g) {
    return g instanceof t.Name ? g : (0, t._)`(${g})`;
  }
})(U);
var O = {};
Object.defineProperty(O, "__esModule", { value: !0 });
O.checkStrictMode = O.getErrorPath = O.Type = O.useFunc = O.setEvaluated = O.evaluatedPropsToName = O.mergeEvaluated = O.eachItem = O.unescapeJsonPointer = O.escapeJsonPointer = O.escapeFragment = O.unescapeFragment = O.schemaRefOrVal = O.schemaHasRulesButRef = O.schemaHasRules = O.checkUnknownRules = O.alwaysValidSchema = O.toHash = void 0;
const J = U, Yc = Jt;
function Zc(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
O.toHash = Zc;
function Qc(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (So(e, t), !Po(t, e.self.RULES.all));
}
O.alwaysValidSchema = Qc;
function So(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const a = n.RULES.keywords;
  for (const s in t)
    a[s] || jo(e, `unknown keyword: "${s}"`);
}
O.checkUnknownRules = So;
function Po(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
O.schemaHasRules = Po;
function el(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
O.schemaHasRulesButRef = el;
function tl({ topSchemaRef: e, schemaPath: t }, r, n, a) {
  if (!a) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, J._)`${r}`;
  }
  return (0, J._)`${e}${t}${(0, J.getProperty)(n)}`;
}
O.schemaRefOrVal = tl;
function rl(e) {
  return Ro(decodeURIComponent(e));
}
O.unescapeFragment = rl;
function nl(e) {
  return encodeURIComponent(Gn(e));
}
O.escapeFragment = nl;
function Gn(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
O.escapeJsonPointer = Gn;
function Ro(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
O.unescapeJsonPointer = Ro;
function al(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
O.eachItem = al;
function ds({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (a, s, o, c) => {
    const i = o === void 0 ? s : o instanceof J.Name ? (s instanceof J.Name ? e(a, s, o) : t(a, s, o), o) : s instanceof J.Name ? (t(a, o, s), s) : r(s, o);
    return c === J.Name && !(i instanceof J.Name) ? n(a, i) : i;
  };
}
O.mergeEvaluated = {
  props: ds({
    mergeNames: (e, t, r) => e.if((0, J._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, J._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, J._)`${r} || {}`).code((0, J._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, J._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, J._)`${r} || {}`), Hn(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: Io
  }),
  items: ds({
    mergeNames: (e, t, r) => e.if((0, J._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, J._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, J._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, J._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function Io(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, J._)`{}`);
  return t !== void 0 && Hn(e, r, t), r;
}
O.evaluatedPropsToName = Io;
function Hn(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, J._)`${t}${(0, J.getProperty)(n)}`, !0));
}
O.setEvaluated = Hn;
const fs = {};
function sl(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: fs[t.code] || (fs[t.code] = new Yc._Code(t.code))
  });
}
O.useFunc = sl;
var In;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(In || (O.Type = In = {}));
function ol(e, t, r) {
  if (e instanceof J.Name) {
    const n = t === In.Num;
    return r ? n ? (0, J._)`"[" + ${e} + "]"` : (0, J._)`"['" + ${e} + "']"` : n ? (0, J._)`"/" + ${e}` : (0, J._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, J.getProperty)(e).toString() : "/" + Gn(e);
}
O.getErrorPath = ol;
function jo(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
O.checkStrictMode = jo;
var Ee = {};
Object.defineProperty(Ee, "__esModule", { value: !0 });
const ue = U, il = {
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
Ee.default = il;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = U, r = O, n = Ee;
  e.keywordError = {
    message: ({ keyword: _ }) => (0, t.str)`must pass "${_}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: _, schemaType: m }) => m ? (0, t.str)`"${_}" keyword must be ${m} ($data)` : (0, t.str)`"${_}" keyword is invalid ($data)`
  };
  function a(_, m = e.keywordError, w, R) {
    const { it: N } = _, { gen: T, compositeRule: W, allErrors: te } = N, ye = f(_, m, w);
    R ?? (W || te) ? i(T, ye) : u(N, (0, t._)`[${ye}]`);
  }
  e.reportError = a;
  function s(_, m = e.keywordError, w) {
    const { it: R } = _, { gen: N, compositeRule: T, allErrors: W } = R, te = f(_, m, w);
    i(N, te), T || W || u(R, n.default.vErrors);
  }
  e.reportExtraError = s;
  function o(_, m) {
    _.assign(n.default.errors, m), _.if((0, t._)`${n.default.vErrors} !== null`, () => _.if(m, () => _.assign((0, t._)`${n.default.vErrors}.length`, m), () => _.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = o;
  function c({ gen: _, keyword: m, schemaValue: w, data: R, errsCount: N, it: T }) {
    if (N === void 0)
      throw new Error("ajv implementation error");
    const W = _.name("err");
    _.forRange("i", N, n.default.errors, (te) => {
      _.const(W, (0, t._)`${n.default.vErrors}[${te}]`), _.if((0, t._)`${W}.instancePath === undefined`, () => _.assign((0, t._)`${W}.instancePath`, (0, t.strConcat)(n.default.instancePath, T.errorPath))), _.assign((0, t._)`${W}.schemaPath`, (0, t.str)`${T.errSchemaPath}/${m}`), T.opts.verbose && (_.assign((0, t._)`${W}.schema`, w), _.assign((0, t._)`${W}.data`, R));
    });
  }
  e.extendErrors = c;
  function i(_, m) {
    const w = _.const("err", m);
    _.if((0, t._)`${n.default.vErrors} === null`, () => _.assign(n.default.vErrors, (0, t._)`[${w}]`), (0, t._)`${n.default.vErrors}.push(${w})`), _.code((0, t._)`${n.default.errors}++`);
  }
  function u(_, m) {
    const { gen: w, validateName: R, schemaEnv: N } = _;
    N.$async ? w.throw((0, t._)`new ${_.ValidationError}(${m})`) : (w.assign((0, t._)`${R}.errors`, m), w.return(!1));
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
  function f(_, m, w) {
    const { createErrors: R } = _.it;
    return R === !1 ? (0, t._)`{}` : E(_, m, w);
  }
  function E(_, m, w = {}) {
    const { gen: R, it: N } = _, T = [
      h(N, w),
      v(_, w)
    ];
    return y(_, m, T), R.object(...T);
  }
  function h({ errorPath: _ }, { instancePath: m }) {
    const w = m ? (0, t.str)`${_}${(0, r.getErrorPath)(m, r.Type.Str)}` : _;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, w)];
  }
  function v({ keyword: _, it: { errSchemaPath: m } }, { schemaPath: w, parentSchema: R }) {
    let N = R ? m : (0, t.str)`${m}/${_}`;
    return w && (N = (0, t.str)`${N}${(0, r.getErrorPath)(w, r.Type.Str)}`), [l.schemaPath, N];
  }
  function y(_, { params: m, message: w }, R) {
    const { keyword: N, data: T, schemaValue: W, it: te } = _, { opts: ye, propertyName: we, topSchemaRef: Pe, schemaPath: z } = te;
    R.push([l.keyword, N], [l.params, typeof m == "function" ? m(_) : m || (0, t._)`{}`]), ye.messages && R.push([l.message, typeof w == "function" ? w(_) : w]), ye.verbose && R.push([l.schema, W], [l.parentSchema, (0, t._)`${Pe}${z}`], [n.default.data, T]), we && R.push([l.propertyName, we]);
  }
})(Qt);
Object.defineProperty(Pt, "__esModule", { value: !0 });
Pt.boolOrEmptySchema = Pt.topBoolOrEmptySchema = void 0;
const cl = Qt, ll = U, ul = Ee, dl = {
  message: "boolean schema is false"
};
function fl(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? No(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(ul.default.data) : (t.assign((0, ll._)`${n}.errors`, null), t.return(!0));
}
Pt.topBoolOrEmptySchema = fl;
function pl(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), No(e)) : r.var(t, !0);
}
Pt.boolOrEmptySchema = pl;
function No(e, t) {
  const { gen: r, data: n } = e, a = {
    gen: r,
    keyword: "false schema",
    data: n,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: e
  };
  (0, cl.reportError)(a, dl, void 0, t);
}
var ne = {}, ct = {};
Object.defineProperty(ct, "__esModule", { value: !0 });
ct.getRules = ct.isJSONType = void 0;
const ml = ["string", "number", "integer", "boolean", "null", "object", "array"], hl = new Set(ml);
function $l(e) {
  return typeof e == "string" && hl.has(e);
}
ct.isJSONType = $l;
function yl() {
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
ct.getRules = yl;
var ze = {};
Object.defineProperty(ze, "__esModule", { value: !0 });
ze.shouldUseRule = ze.shouldUseGroup = ze.schemaHasRulesForType = void 0;
function gl({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && Oo(e, n);
}
ze.schemaHasRulesForType = gl;
function Oo(e, t) {
  return t.rules.some((r) => To(e, r));
}
ze.shouldUseGroup = Oo;
function To(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
ze.shouldUseRule = To;
Object.defineProperty(ne, "__esModule", { value: !0 });
ne.reportTypeError = ne.checkDataTypes = ne.checkDataType = ne.coerceAndCheckDataType = ne.getJSONTypes = ne.getSchemaTypes = ne.DataType = void 0;
const vl = ct, _l = ze, El = Qt, G = U, Ao = O;
var vt;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(vt || (ne.DataType = vt = {}));
function wl(e) {
  const t = ko(e.type);
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
ne.getSchemaTypes = wl;
function ko(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(vl.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
ne.getJSONTypes = ko;
function bl(e, t) {
  const { gen: r, data: n, opts: a } = e, s = Sl(t, a.coerceTypes), o = t.length > 0 && !(s.length === 0 && t.length === 1 && (0, _l.schemaHasRulesForType)(e, t[0]));
  if (o) {
    const c = Kn(t, n, a.strictNumbers, vt.Wrong);
    r.if(c, () => {
      s.length ? Pl(e, t, s) : Xn(e);
    });
  }
  return o;
}
ne.coerceAndCheckDataType = bl;
const Co = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function Sl(e, t) {
  return t ? e.filter((r) => Co.has(r) || t === "array" && r === "array") : [];
}
function Pl(e, t, r) {
  const { gen: n, data: a, opts: s } = e, o = n.let("dataType", (0, G._)`typeof ${a}`), c = n.let("coerced", (0, G._)`undefined`);
  s.coerceTypes === "array" && n.if((0, G._)`${o} == 'object' && Array.isArray(${a}) && ${a}.length == 1`, () => n.assign(a, (0, G._)`${a}[0]`).assign(o, (0, G._)`typeof ${a}`).if(Kn(t, a, s.strictNumbers), () => n.assign(c, a))), n.if((0, G._)`${c} !== undefined`);
  for (const u of r)
    (Co.has(u) || u === "array" && s.coerceTypes === "array") && i(u);
  n.else(), Xn(e), n.endIf(), n.if((0, G._)`${c} !== undefined`, () => {
    n.assign(a, c), Rl(e, c);
  });
  function i(u) {
    switch (u) {
      case "string":
        n.elseIf((0, G._)`${o} == "number" || ${o} == "boolean"`).assign(c, (0, G._)`"" + ${a}`).elseIf((0, G._)`${a} === null`).assign(c, (0, G._)`""`);
        return;
      case "number":
        n.elseIf((0, G._)`${o} == "boolean" || ${a} === null
              || (${o} == "string" && ${a} && ${a} == +${a})`).assign(c, (0, G._)`+${a}`);
        return;
      case "integer":
        n.elseIf((0, G._)`${o} === "boolean" || ${a} === null
              || (${o} === "string" && ${a} && ${a} == +${a} && !(${a} % 1))`).assign(c, (0, G._)`+${a}`);
        return;
      case "boolean":
        n.elseIf((0, G._)`${a} === "false" || ${a} === 0 || ${a} === null`).assign(c, !1).elseIf((0, G._)`${a} === "true" || ${a} === 1`).assign(c, !0);
        return;
      case "null":
        n.elseIf((0, G._)`${a} === "" || ${a} === 0 || ${a} === false`), n.assign(c, null);
        return;
      case "array":
        n.elseIf((0, G._)`${o} === "string" || ${o} === "number"
              || ${o} === "boolean" || ${a} === null`).assign(c, (0, G._)`[${a}]`);
    }
  }
}
function Rl({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, G._)`${t} !== undefined`, () => e.assign((0, G._)`${t}[${r}]`, n));
}
function jn(e, t, r, n = vt.Correct) {
  const a = n === vt.Correct ? G.operators.EQ : G.operators.NEQ;
  let s;
  switch (e) {
    case "null":
      return (0, G._)`${t} ${a} null`;
    case "array":
      s = (0, G._)`Array.isArray(${t})`;
      break;
    case "object":
      s = (0, G._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      s = o((0, G._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      s = o();
      break;
    default:
      return (0, G._)`typeof ${t} ${a} ${e}`;
  }
  return n === vt.Correct ? s : (0, G.not)(s);
  function o(c = G.nil) {
    return (0, G.and)((0, G._)`typeof ${t} == "number"`, c, r ? (0, G._)`isFinite(${t})` : G.nil);
  }
}
ne.checkDataType = jn;
function Kn(e, t, r, n) {
  if (e.length === 1)
    return jn(e[0], t, r, n);
  let a;
  const s = (0, Ao.toHash)(e);
  if (s.array && s.object) {
    const o = (0, G._)`typeof ${t} != "object"`;
    a = s.null ? o : (0, G._)`!${t} || ${o}`, delete s.null, delete s.array, delete s.object;
  } else
    a = G.nil;
  s.number && delete s.integer;
  for (const o in s)
    a = (0, G.and)(a, jn(o, t, r, n));
  return a;
}
ne.checkDataTypes = Kn;
const Il = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, G._)`{type: ${e}}` : (0, G._)`{type: ${t}}`
};
function Xn(e) {
  const t = jl(e);
  (0, El.reportError)(t, Il);
}
ne.reportTypeError = Xn;
function jl(e) {
  const { gen: t, data: r, schema: n } = e, a = (0, Ao.schemaRefOrVal)(e, n, "type");
  return {
    gen: t,
    keyword: "type",
    data: r,
    schema: n.type,
    schemaCode: a,
    schemaValue: a,
    parentSchema: n,
    params: {},
    it: e
  };
}
var Or = {};
Object.defineProperty(Or, "__esModule", { value: !0 });
Or.assignDefaults = void 0;
const ft = U, Nl = O;
function Ol(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const a in r)
      ps(e, a, r[a].default);
  else t === "array" && Array.isArray(n) && n.forEach((a, s) => ps(e, s, a.default));
}
Or.assignDefaults = Ol;
function ps(e, t, r) {
  const { gen: n, compositeRule: a, data: s, opts: o } = e;
  if (r === void 0)
    return;
  const c = (0, ft._)`${s}${(0, ft.getProperty)(t)}`;
  if (a) {
    (0, Nl.checkStrictMode)(e, `default is ignored for: ${c}`);
    return;
  }
  let i = (0, ft._)`${c} === undefined`;
  o.useDefaults === "empty" && (i = (0, ft._)`${i} || ${c} === null || ${c} === ""`), n.if(i, (0, ft._)`${c} = ${(0, ft.stringify)(r)}`);
}
var Ce = {}, H = {};
Object.defineProperty(H, "__esModule", { value: !0 });
H.validateUnion = H.validateArray = H.usePattern = H.callValidateCode = H.schemaProperties = H.allSchemaProperties = H.noPropertyInData = H.propertyInData = H.isOwnProperty = H.hasPropFunc = H.reportMissingProp = H.checkMissingProp = H.checkReportMissingProp = void 0;
const Z = U, Wn = O, Ke = Ee, Tl = O;
function Al(e, t) {
  const { gen: r, data: n, it: a } = e;
  r.if(Jn(r, n, t, a.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, Z._)`${t}` }, !0), e.error();
  });
}
H.checkReportMissingProp = Al;
function kl({ gen: e, data: t, it: { opts: r } }, n, a) {
  return (0, Z.or)(...n.map((s) => (0, Z.and)(Jn(e, t, s, r.ownProperties), (0, Z._)`${a} = ${s}`)));
}
H.checkMissingProp = kl;
function Cl(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
H.reportMissingProp = Cl;
function xo(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, Z._)`Object.prototype.hasOwnProperty`
  });
}
H.hasPropFunc = xo;
function Bn(e, t, r) {
  return (0, Z._)`${xo(e)}.call(${t}, ${r})`;
}
H.isOwnProperty = Bn;
function xl(e, t, r, n) {
  const a = (0, Z._)`${t}${(0, Z.getProperty)(r)} !== undefined`;
  return n ? (0, Z._)`${a} && ${Bn(e, t, r)}` : a;
}
H.propertyInData = xl;
function Jn(e, t, r, n) {
  const a = (0, Z._)`${t}${(0, Z.getProperty)(r)} === undefined`;
  return n ? (0, Z.or)(a, (0, Z.not)(Bn(e, t, r))) : a;
}
H.noPropertyInData = Jn;
function Do(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
H.allSchemaProperties = Do;
function Dl(e, t) {
  return Do(t).filter((r) => !(0, Wn.alwaysValidSchema)(e, t[r]));
}
H.schemaProperties = Dl;
function Ll({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: a, errorPath: s }, it: o }, c, i, u) {
  const l = u ? (0, Z._)`${e}, ${t}, ${n}${a}` : t, f = [
    [Ke.default.instancePath, (0, Z.strConcat)(Ke.default.instancePath, s)],
    [Ke.default.parentData, o.parentData],
    [Ke.default.parentDataProperty, o.parentDataProperty],
    [Ke.default.rootData, Ke.default.rootData]
  ];
  o.opts.dynamicRef && f.push([Ke.default.dynamicAnchors, Ke.default.dynamicAnchors]);
  const E = (0, Z._)`${l}, ${r.object(...f)}`;
  return i !== Z.nil ? (0, Z._)`${c}.call(${i}, ${E})` : (0, Z._)`${c}(${E})`;
}
H.callValidateCode = Ll;
const Ml = (0, Z._)`new RegExp`;
function zl({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: a } = t.code, s = a(r, n);
  return e.scopeValue("pattern", {
    key: s.toString(),
    ref: s,
    code: (0, Z._)`${a.code === "new RegExp" ? Ml : (0, Tl.useFunc)(e, a)}(${r}, ${n})`
  });
}
H.usePattern = zl;
function Vl(e) {
  const { gen: t, data: r, keyword: n, it: a } = e, s = t.name("valid");
  if (a.allErrors) {
    const c = t.let("valid", !0);
    return o(() => t.assign(c, !1)), c;
  }
  return t.var(s, !0), o(() => t.break()), s;
  function o(c) {
    const i = t.const("len", (0, Z._)`${r}.length`);
    t.forRange("i", 0, i, (u) => {
      e.subschema({
        keyword: n,
        dataProp: u,
        dataPropType: Wn.Type.Num
      }, s), t.if((0, Z.not)(s), c);
    });
  }
}
H.validateArray = Vl;
function Ul(e) {
  const { gen: t, schema: r, keyword: n, it: a } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((i) => (0, Wn.alwaysValidSchema)(a, i)) && !a.opts.unevaluated)
    return;
  const o = t.let("valid", !1), c = t.name("_valid");
  t.block(() => r.forEach((i, u) => {
    const l = e.subschema({
      keyword: n,
      schemaProp: u,
      compositeRule: !0
    }, c);
    t.assign(o, (0, Z._)`${o} || ${c}`), e.mergeValidEvaluated(l, c) || t.if((0, Z.not)(o));
  })), e.result(o, () => e.reset(), () => e.error(!0));
}
H.validateUnion = Ul;
Object.defineProperty(Ce, "__esModule", { value: !0 });
Ce.validateKeywordUsage = Ce.validSchemaType = Ce.funcKeywordCode = Ce.macroKeywordCode = void 0;
const me = U, tt = Ee, Fl = H, ql = Qt;
function Gl(e, t) {
  const { gen: r, keyword: n, schema: a, parentSchema: s, it: o } = e, c = t.macro.call(o.self, a, s, o), i = Lo(r, n, c);
  o.opts.validateSchema !== !1 && o.self.validateSchema(c, !0);
  const u = r.name("valid");
  e.subschema({
    schema: c,
    schemaPath: me.nil,
    errSchemaPath: `${o.errSchemaPath}/${n}`,
    topSchemaRef: i,
    compositeRule: !0
  }, u), e.pass(u, () => e.error(!0));
}
Ce.macroKeywordCode = Gl;
function Hl(e, t) {
  var r;
  const { gen: n, keyword: a, schema: s, parentSchema: o, $data: c, it: i } = e;
  Xl(i, t);
  const u = !c && t.compile ? t.compile.call(i.self, s, o, i) : t.validate, l = Lo(n, a, u), f = n.let("valid");
  e.block$data(f, E), e.ok((r = t.valid) !== null && r !== void 0 ? r : f);
  function E() {
    if (t.errors === !1)
      y(), t.modifying && ms(e), _(() => e.error());
    else {
      const m = t.async ? h() : v();
      t.modifying && ms(e), _(() => Kl(e, m));
    }
  }
  function h() {
    const m = n.let("ruleErrs", null);
    return n.try(() => y((0, me._)`await `), (w) => n.assign(f, !1).if((0, me._)`${w} instanceof ${i.ValidationError}`, () => n.assign(m, (0, me._)`${w}.errors`), () => n.throw(w))), m;
  }
  function v() {
    const m = (0, me._)`${l}.errors`;
    return n.assign(m, null), y(me.nil), m;
  }
  function y(m = t.async ? (0, me._)`await ` : me.nil) {
    const w = i.opts.passContext ? tt.default.this : tt.default.self, R = !("compile" in t && !c || t.schema === !1);
    n.assign(f, (0, me._)`${m}${(0, Fl.callValidateCode)(e, l, w, R)}`, t.modifying);
  }
  function _(m) {
    var w;
    n.if((0, me.not)((w = t.valid) !== null && w !== void 0 ? w : f), m);
  }
}
Ce.funcKeywordCode = Hl;
function ms(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, me._)`${n.parentData}[${n.parentDataProperty}]`));
}
function Kl(e, t) {
  const { gen: r } = e;
  r.if((0, me._)`Array.isArray(${t})`, () => {
    r.assign(tt.default.vErrors, (0, me._)`${tt.default.vErrors} === null ? ${t} : ${tt.default.vErrors}.concat(${t})`).assign(tt.default.errors, (0, me._)`${tt.default.vErrors}.length`), (0, ql.extendErrors)(e);
  }, () => e.error());
}
function Xl({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function Lo(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, me.stringify)(r) });
}
function Wl(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
Ce.validSchemaType = Wl;
function Bl({ schema: e, opts: t, self: r, errSchemaPath: n }, a, s) {
  if (Array.isArray(a.keyword) ? !a.keyword.includes(s) : a.keyword !== s)
    throw new Error("ajv implementation error");
  const o = a.dependencies;
  if (o != null && o.some((c) => !Object.prototype.hasOwnProperty.call(e, c)))
    throw new Error(`parent schema must have dependencies of ${s}: ${o.join(",")}`);
  if (a.validateSchema && !a.validateSchema(e[s])) {
    const i = `keyword "${s}" value is invalid at path "${n}": ` + r.errorsText(a.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(i);
    else
      throw new Error(i);
  }
}
Ce.validateKeywordUsage = Bl;
var Qe = {};
Object.defineProperty(Qe, "__esModule", { value: !0 });
Qe.extendSubschemaMode = Qe.extendSubschemaData = Qe.getSubschema = void 0;
const ke = U, Mo = O;
function Jl(e, { keyword: t, schemaProp: r, schema: n, schemaPath: a, errSchemaPath: s, topSchemaRef: o }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const c = e.schema[t];
    return r === void 0 ? {
      schema: c,
      schemaPath: (0, ke._)`${e.schemaPath}${(0, ke.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: c[r],
      schemaPath: (0, ke._)`${e.schemaPath}${(0, ke.getProperty)(t)}${(0, ke.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, Mo.escapeFragment)(r)}`
    };
  }
  if (n !== void 0) {
    if (a === void 0 || s === void 0 || o === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: n,
      schemaPath: a,
      topSchemaRef: o,
      errSchemaPath: s
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
Qe.getSubschema = Jl;
function Yl(e, t, { dataProp: r, dataPropType: n, data: a, dataTypes: s, propertyName: o }) {
  if (a !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: c } = t;
  if (r !== void 0) {
    const { errorPath: u, dataPathArr: l, opts: f } = t, E = c.let("data", (0, ke._)`${t.data}${(0, ke.getProperty)(r)}`, !0);
    i(E), e.errorPath = (0, ke.str)`${u}${(0, Mo.getErrorPath)(r, n, f.jsPropertySyntax)}`, e.parentDataProperty = (0, ke._)`${r}`, e.dataPathArr = [...l, e.parentDataProperty];
  }
  if (a !== void 0) {
    const u = a instanceof ke.Name ? a : c.let("data", a, !0);
    i(u), o !== void 0 && (e.propertyName = o);
  }
  s && (e.dataTypes = s);
  function i(u) {
    e.data = u, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, u];
  }
}
Qe.extendSubschemaData = Yl;
function Zl(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: a, allErrors: s }) {
  n !== void 0 && (e.compositeRule = n), a !== void 0 && (e.createErrors = a), s !== void 0 && (e.allErrors = s), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
Qe.extendSubschemaMode = Zl;
var ce = {}, zo = function e(t, r) {
  if (t === r) return !0;
  if (t && r && typeof t == "object" && typeof r == "object") {
    if (t.constructor !== r.constructor) return !1;
    var n, a, s;
    if (Array.isArray(t)) {
      if (n = t.length, n != r.length) return !1;
      for (a = n; a-- !== 0; )
        if (!e(t[a], r[a])) return !1;
      return !0;
    }
    if (t.constructor === RegExp) return t.source === r.source && t.flags === r.flags;
    if (t.valueOf !== Object.prototype.valueOf) return t.valueOf() === r.valueOf();
    if (t.toString !== Object.prototype.toString) return t.toString() === r.toString();
    if (s = Object.keys(t), n = s.length, n !== Object.keys(r).length) return !1;
    for (a = n; a-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(r, s[a])) return !1;
    for (a = n; a-- !== 0; ) {
      var o = s[a];
      if (!e(t[o], r[o])) return !1;
    }
    return !0;
  }
  return t !== t && r !== r;
}, Vo = { exports: {} }, Ze = Vo.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, a = r.post || function() {
  };
  $r(t, n, a, e, "", e);
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
function $r(e, t, r, n, a, s, o, c, i, u) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, a, s, o, c, i, u);
    for (var l in n) {
      var f = n[l];
      if (Array.isArray(f)) {
        if (l in Ze.arrayKeywords)
          for (var E = 0; E < f.length; E++)
            $r(e, t, r, f[E], a + "/" + l + "/" + E, s, a, l, n, E);
      } else if (l in Ze.propsKeywords) {
        if (f && typeof f == "object")
          for (var h in f)
            $r(e, t, r, f[h], a + "/" + l + "/" + Ql(h), s, a, l, n, h);
      } else (l in Ze.keywords || e.allKeys && !(l in Ze.skipKeywords)) && $r(e, t, r, f, a + "/" + l, s, a, l, n);
    }
    r(n, a, s, o, c, i, u);
  }
}
function Ql(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var eu = Vo.exports;
Object.defineProperty(ce, "__esModule", { value: !0 });
ce.getSchemaRefs = ce.resolveUrl = ce.normalizeId = ce._getFullPath = ce.getFullPath = ce.inlineRef = void 0;
const tu = O, ru = zo, nu = eu, au = /* @__PURE__ */ new Set([
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
function su(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !Nn(e) : t ? Uo(e) <= t : !1;
}
ce.inlineRef = su;
const ou = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function Nn(e) {
  for (const t in e) {
    if (ou.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(Nn) || typeof r == "object" && Nn(r))
      return !0;
  }
  return !1;
}
function Uo(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !au.has(r) && (typeof e[r] == "object" && (0, tu.eachItem)(e[r], (n) => t += Uo(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function Fo(e, t = "", r) {
  r !== !1 && (t = _t(t));
  const n = e.parse(t);
  return qo(e, n);
}
ce.getFullPath = Fo;
function qo(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
ce._getFullPath = qo;
const iu = /#\/?$/;
function _t(e) {
  return e ? e.replace(iu, "") : "";
}
ce.normalizeId = _t;
function cu(e, t, r) {
  return r = _t(r), e.resolve(t, r);
}
ce.resolveUrl = cu;
const lu = /^[a-z_][-a-z0-9._]*$/i;
function uu(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, a = _t(e[r] || t), s = { "": a }, o = Fo(n, a, !1), c = {}, i = /* @__PURE__ */ new Set();
  return nu(e, { allKeys: !0 }, (f, E, h, v) => {
    if (v === void 0)
      return;
    const y = o + E;
    let _ = s[v];
    typeof f[r] == "string" && (_ = m.call(this, f[r])), w.call(this, f.$anchor), w.call(this, f.$dynamicAnchor), s[E] = _;
    function m(R) {
      const N = this.opts.uriResolver.resolve;
      if (R = _t(_ ? N(_, R) : R), i.has(R))
        throw l(R);
      i.add(R);
      let T = this.refs[R];
      return typeof T == "string" && (T = this.refs[T]), typeof T == "object" ? u(f, T.schema, R) : R !== _t(y) && (R[0] === "#" ? (u(f, c[R], R), c[R] = f) : this.refs[R] = y), R;
    }
    function w(R) {
      if (typeof R == "string") {
        if (!lu.test(R))
          throw new Error(`invalid anchor "${R}"`);
        m.call(this, `#${R}`);
      }
    }
  }), c;
  function u(f, E, h) {
    if (E !== void 0 && !ru(f, E))
      throw l(h);
  }
  function l(f) {
    return new Error(`reference "${f}" resolves to more than one schema`);
  }
}
ce.getSchemaRefs = uu;
Object.defineProperty(Se, "__esModule", { value: !0 });
Se.getData = Se.KeywordCxt = Se.validateFunctionCode = void 0;
const Go = Pt, hs = ne, Yn = ze, br = ne, du = Or, Ht = Ce, dn = Qe, x = U, V = Ee, fu = ce, Ve = O, Mt = Qt;
function pu(e) {
  if (Xo(e) && (Wo(e), Ko(e))) {
    $u(e);
    return;
  }
  Ho(e, () => (0, Go.topBoolOrEmptySchema)(e));
}
Se.validateFunctionCode = pu;
function Ho({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: a }, s) {
  a.code.es5 ? e.func(t, (0, x._)`${V.default.data}, ${V.default.valCxt}`, n.$async, () => {
    e.code((0, x._)`"use strict"; ${$s(r, a)}`), hu(e, a), e.code(s);
  }) : e.func(t, (0, x._)`${V.default.data}, ${mu(a)}`, n.$async, () => e.code($s(r, a)).code(s));
}
function mu(e) {
  return (0, x._)`{${V.default.instancePath}="", ${V.default.parentData}, ${V.default.parentDataProperty}, ${V.default.rootData}=${V.default.data}${e.dynamicRef ? (0, x._)`, ${V.default.dynamicAnchors}={}` : x.nil}}={}`;
}
function hu(e, t) {
  e.if(V.default.valCxt, () => {
    e.var(V.default.instancePath, (0, x._)`${V.default.valCxt}.${V.default.instancePath}`), e.var(V.default.parentData, (0, x._)`${V.default.valCxt}.${V.default.parentData}`), e.var(V.default.parentDataProperty, (0, x._)`${V.default.valCxt}.${V.default.parentDataProperty}`), e.var(V.default.rootData, (0, x._)`${V.default.valCxt}.${V.default.rootData}`), t.dynamicRef && e.var(V.default.dynamicAnchors, (0, x._)`${V.default.valCxt}.${V.default.dynamicAnchors}`);
  }, () => {
    e.var(V.default.instancePath, (0, x._)`""`), e.var(V.default.parentData, (0, x._)`undefined`), e.var(V.default.parentDataProperty, (0, x._)`undefined`), e.var(V.default.rootData, V.default.data), t.dynamicRef && e.var(V.default.dynamicAnchors, (0, x._)`{}`);
  });
}
function $u(e) {
  const { schema: t, opts: r, gen: n } = e;
  Ho(e, () => {
    r.$comment && t.$comment && Jo(e), Eu(e), n.let(V.default.vErrors, null), n.let(V.default.errors, 0), r.unevaluated && yu(e), Bo(e), Su(e);
  });
}
function yu(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, x._)`${r}.evaluated`), t.if((0, x._)`${e.evaluated}.dynamicProps`, () => t.assign((0, x._)`${e.evaluated}.props`, (0, x._)`undefined`)), t.if((0, x._)`${e.evaluated}.dynamicItems`, () => t.assign((0, x._)`${e.evaluated}.items`, (0, x._)`undefined`));
}
function $s(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, x._)`/*# sourceURL=${r} */` : x.nil;
}
function gu(e, t) {
  if (Xo(e) && (Wo(e), Ko(e))) {
    vu(e, t);
    return;
  }
  (0, Go.boolOrEmptySchema)(e, t);
}
function Ko({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function Xo(e) {
  return typeof e.schema != "boolean";
}
function vu(e, t) {
  const { schema: r, gen: n, opts: a } = e;
  a.$comment && r.$comment && Jo(e), wu(e), bu(e);
  const s = n.const("_errs", V.default.errors);
  Bo(e, s), n.var(t, (0, x._)`${s} === ${V.default.errors}`);
}
function Wo(e) {
  (0, Ve.checkUnknownRules)(e), _u(e);
}
function Bo(e, t) {
  if (e.opts.jtd)
    return ys(e, [], !1, t);
  const r = (0, hs.getSchemaTypes)(e.schema), n = (0, hs.coerceAndCheckDataType)(e, r);
  ys(e, r, !n, t);
}
function _u(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: a } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, Ve.schemaHasRulesButRef)(t, a.RULES) && a.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function Eu(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, Ve.checkStrictMode)(e, "default is ignored in the schema root");
}
function wu(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, fu.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function bu(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function Jo({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: a }) {
  const s = r.$comment;
  if (a.$comment === !0)
    e.code((0, x._)`${V.default.self}.logger.log(${s})`);
  else if (typeof a.$comment == "function") {
    const o = (0, x.str)`${n}/$comment`, c = e.scopeValue("root", { ref: t.root });
    e.code((0, x._)`${V.default.self}.opts.$comment(${s}, ${o}, ${c}.schema)`);
  }
}
function Su(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: a, opts: s } = e;
  r.$async ? t.if((0, x._)`${V.default.errors} === 0`, () => t.return(V.default.data), () => t.throw((0, x._)`new ${a}(${V.default.vErrors})`)) : (t.assign((0, x._)`${n}.errors`, V.default.vErrors), s.unevaluated && Pu(e), t.return((0, x._)`${V.default.errors} === 0`));
}
function Pu({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof x.Name && e.assign((0, x._)`${t}.props`, r), n instanceof x.Name && e.assign((0, x._)`${t}.items`, n);
}
function ys(e, t, r, n) {
  const { gen: a, schema: s, data: o, allErrors: c, opts: i, self: u } = e, { RULES: l } = u;
  if (s.$ref && (i.ignoreKeywordsWithRef || !(0, Ve.schemaHasRulesButRef)(s, l))) {
    a.block(() => Qo(e, "$ref", l.all.$ref.definition));
    return;
  }
  i.jtd || Ru(e, t), a.block(() => {
    for (const E of l.rules)
      f(E);
    f(l.post);
  });
  function f(E) {
    (0, Yn.shouldUseGroup)(s, E) && (E.type ? (a.if((0, br.checkDataType)(E.type, o, i.strictNumbers)), gs(e, E), t.length === 1 && t[0] === E.type && r && (a.else(), (0, br.reportTypeError)(e)), a.endIf()) : gs(e, E), c || a.if((0, x._)`${V.default.errors} === ${n || 0}`));
  }
}
function gs(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: a } } = e;
  a && (0, du.assignDefaults)(e, t.type), r.block(() => {
    for (const s of t.rules)
      (0, Yn.shouldUseRule)(n, s) && Qo(e, s.keyword, s.definition, t.type);
  });
}
function Ru(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (Iu(e, t), e.opts.allowUnionTypes || ju(e, t), Nu(e, e.dataTypes));
}
function Iu(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      Yo(e.dataTypes, r) || Zn(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), Tu(e, t);
  }
}
function ju(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && Zn(e, "use allowUnionTypes to allow union type keyword");
}
function Nu(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const a = r[n];
    if (typeof a == "object" && (0, Yn.shouldUseRule)(e.schema, a)) {
      const { type: s } = a.definition;
      s.length && !s.some((o) => Ou(t, o)) && Zn(e, `missing type "${s.join(",")}" for keyword "${n}"`);
    }
  }
}
function Ou(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function Yo(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function Tu(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    Yo(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function Zn(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, Ve.checkStrictMode)(e, t, e.opts.strictTypes);
}
class Zo {
  constructor(t, r, n) {
    if ((0, Ht.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, Ve.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", ei(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, Ht.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = t.gen.const("_errs", V.default.errors));
  }
  result(t, r, n) {
    this.failResult((0, x.not)(t), r, n);
  }
  failResult(t, r, n) {
    this.gen.if(t), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(t, r) {
    this.failResult((0, x.not)(t), void 0, r);
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
    this.fail((0, x._)`${r} !== undefined && (${(0, x.or)(this.invalid$data(), t)})`);
  }
  error(t, r, n) {
    if (r) {
      this.setParams(r), this._error(t, n), this.setParams({});
      return;
    }
    this._error(t, n);
  }
  _error(t, r) {
    (t ? Mt.reportExtraError : Mt.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, Mt.reportError)(this, this.def.$dataError || Mt.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Mt.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(t) {
    this.allErrors || this.gen.if(t);
  }
  setParams(t, r) {
    r ? Object.assign(this.params, t) : this.params = t;
  }
  block$data(t, r, n = x.nil) {
    this.gen.block(() => {
      this.check$data(t, n), r();
    });
  }
  check$data(t = x.nil, r = x.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: a, schemaType: s, def: o } = this;
    n.if((0, x.or)((0, x._)`${a} === undefined`, r)), t !== x.nil && n.assign(t, !0), (s.length || o.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== x.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: n, def: a, it: s } = this;
    return (0, x.or)(o(), c());
    function o() {
      if (n.length) {
        if (!(r instanceof x.Name))
          throw new Error("ajv implementation error");
        const i = Array.isArray(n) ? n : [n];
        return (0, x._)`${(0, br.checkDataTypes)(i, r, s.opts.strictNumbers, br.DataType.Wrong)}`;
      }
      return x.nil;
    }
    function c() {
      if (a.validateSchema) {
        const i = t.scopeValue("validate$data", { ref: a.validateSchema });
        return (0, x._)`!${i}(${r})`;
      }
      return x.nil;
    }
  }
  subschema(t, r) {
    const n = (0, dn.getSubschema)(this.it, t);
    (0, dn.extendSubschemaData)(n, this.it, t), (0, dn.extendSubschemaMode)(n, t);
    const a = { ...this.it, ...n, items: void 0, props: void 0 };
    return gu(a, r), a;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: a } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = Ve.mergeEvaluated.props(a, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = Ve.mergeEvaluated.items(a, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: a } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return a.if(r, () => this.mergeEvaluated(t, x.Name)), !0;
  }
}
Se.KeywordCxt = Zo;
function Qo(e, t, r, n) {
  const a = new Zo(e, r, t);
  "code" in r ? r.code(a, n) : a.$data && r.validate ? (0, Ht.funcKeywordCode)(a, r) : "macro" in r ? (0, Ht.macroKeywordCode)(a, r) : (r.compile || r.validate) && (0, Ht.funcKeywordCode)(a, r);
}
const Au = /^\/(?:[^~]|~0|~1)*$/, ku = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function ei(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let a, s;
  if (e === "")
    return V.default.rootData;
  if (e[0] === "/") {
    if (!Au.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    a = e, s = V.default.rootData;
  } else {
    const u = ku.exec(e);
    if (!u)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const l = +u[1];
    if (a = u[2], a === "#") {
      if (l >= t)
        throw new Error(i("property/index", l));
      return n[t - l];
    }
    if (l > t)
      throw new Error(i("data", l));
    if (s = r[t - l], !a)
      return s;
  }
  let o = s;
  const c = a.split("/");
  for (const u of c)
    u && (s = (0, x._)`${s}${(0, x.getProperty)((0, Ve.unescapeJsonPointer)(u))}`, o = (0, x._)`${o} && ${s}`);
  return o;
  function i(u, l) {
    return `Cannot access ${u} ${l} levels up, current level is ${t}`;
  }
}
Se.getData = ei;
var It = {};
Object.defineProperty(It, "__esModule", { value: !0 });
class Cu extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
}
It.default = Cu;
var ut = {};
Object.defineProperty(ut, "__esModule", { value: !0 });
const fn = ce;
class xu extends Error {
  constructor(t, r, n, a) {
    super(a || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, fn.resolveUrl)(t, r, n), this.missingSchema = (0, fn.normalizeId)((0, fn.getFullPath)(t, this.missingRef));
  }
}
ut.default = xu;
var he = {};
Object.defineProperty(he, "__esModule", { value: !0 });
he.resolveSchema = he.getCompilingSchema = he.resolveRef = he.compileSchema = he.SchemaEnv = void 0;
const Re = U, Du = It, et = Ee, je = ce, vs = O, Lu = Se;
class Tr {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, je.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
he.SchemaEnv = Tr;
function Qn(e) {
  const t = ti.call(this, e);
  if (t)
    return t;
  const r = (0, je.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: a } = this.opts.code, { ownProperties: s } = this.opts, o = new Re.CodeGen(this.scope, { es5: n, lines: a, ownProperties: s });
  let c;
  e.$async && (c = o.scopeValue("Error", {
    ref: Du.default,
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
    ValidationError: c,
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
  let l;
  try {
    this._compilations.add(e), (0, Lu.validateFunctionCode)(u), o.optimize(this.opts.code.optimize);
    const f = o.toString();
    l = `${o.scopeRefs(et.default.scope)}return ${f}`, this.opts.code.process && (l = this.opts.code.process(l, e));
    const h = new Function(`${et.default.self}`, `${et.default.scope}`, l)(this, this.scope.get());
    if (this.scope.value(i, { ref: h }), h.errors = null, h.schema = e.schema, h.schemaEnv = e, e.$async && (h.$async = !0), this.opts.code.source === !0 && (h.source = { validateName: i, validateCode: f, scopeValues: o._values }), this.opts.unevaluated) {
      const { props: v, items: y } = u;
      h.evaluated = {
        props: v instanceof Re.Name ? void 0 : v,
        items: y instanceof Re.Name ? void 0 : y,
        dynamicProps: v instanceof Re.Name,
        dynamicItems: y instanceof Re.Name
      }, h.source && (h.source.evaluated = (0, Re.stringify)(h.evaluated));
    }
    return e.validate = h, e;
  } catch (f) {
    throw delete e.validate, delete e.validateName, l && this.logger.error("Error compiling schema, function code:", l), f;
  } finally {
    this._compilations.delete(e);
  }
}
he.compileSchema = Qn;
function Mu(e, t, r) {
  var n;
  r = (0, je.resolveUrl)(this.opts.uriResolver, t, r);
  const a = e.refs[r];
  if (a)
    return a;
  let s = Uu.call(this, e, r);
  if (s === void 0) {
    const o = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: c } = this.opts;
    o && (s = new Tr({ schema: o, schemaId: c, root: e, baseId: t }));
  }
  if (s !== void 0)
    return e.refs[r] = zu.call(this, s);
}
he.resolveRef = Mu;
function zu(e) {
  return (0, je.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Qn.call(this, e);
}
function ti(e) {
  for (const t of this._compilations)
    if (Vu(t, e))
      return t;
}
he.getCompilingSchema = ti;
function Vu(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function Uu(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || Ar.call(this, e, t);
}
function Ar(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, je._getFullPath)(this.opts.uriResolver, r);
  let a = (0, je.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === a)
    return pn.call(this, r, e);
  const s = (0, je.normalizeId)(n), o = this.refs[s] || this.schemas[s];
  if (typeof o == "string") {
    const c = Ar.call(this, e, o);
    return typeof (c == null ? void 0 : c.schema) != "object" ? void 0 : pn.call(this, r, c);
  }
  if (typeof (o == null ? void 0 : o.schema) == "object") {
    if (o.validate || Qn.call(this, o), s === (0, je.normalizeId)(t)) {
      const { schema: c } = o, { schemaId: i } = this.opts, u = c[i];
      return u && (a = (0, je.resolveUrl)(this.opts.uriResolver, a, u)), new Tr({ schema: c, schemaId: i, root: e, baseId: a });
    }
    return pn.call(this, r, o);
  }
}
he.resolveSchema = Ar;
const Fu = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function pn(e, { baseId: t, schema: r, root: n }) {
  var a;
  if (((a = e.fragment) === null || a === void 0 ? void 0 : a[0]) !== "/")
    return;
  for (const c of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const i = r[(0, vs.unescapeFragment)(c)];
    if (i === void 0)
      return;
    r = i;
    const u = typeof r == "object" && r[this.opts.schemaId];
    !Fu.has(c) && u && (t = (0, je.resolveUrl)(this.opts.uriResolver, t, u));
  }
  let s;
  if (typeof r != "boolean" && r.$ref && !(0, vs.schemaHasRulesButRef)(r, this.RULES)) {
    const c = (0, je.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    s = Ar.call(this, n, c);
  }
  const { schemaId: o } = this.opts;
  if (s = s || new Tr({ schema: r, schemaId: o, root: n, baseId: t }), s.schema !== s.root.schema)
    return s;
}
const qu = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", Gu = "Meta-schema for $data reference (JSON AnySchema extension proposal)", Hu = "object", Ku = [
  "$data"
], Xu = {
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
}, Wu = !1, Bu = {
  $id: qu,
  description: Gu,
  type: Hu,
  required: Ku,
  properties: Xu,
  additionalProperties: Wu
};
var ea = {}, kr = { exports: {} };
const Ju = {
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
var Yu = {
  HEX: Ju
};
const { HEX: Zu } = Yu, Qu = /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u;
function ri(e) {
  if (ai(e, ".") < 3)
    return { host: e, isIPV4: !1 };
  const t = e.match(Qu) || [], [r] = t;
  return r ? { host: td(r, "."), isIPV4: !0 } : { host: e, isIPV4: !1 };
}
function _s(e, t = !1) {
  let r = "", n = !0;
  for (const a of e) {
    if (Zu[a] === void 0) return;
    a !== "0" && n === !0 && (n = !1), n || (r += a);
  }
  return t && r.length === 0 && (r = "0"), r;
}
function ed(e) {
  let t = 0;
  const r = { error: !1, address: "", zone: "" }, n = [], a = [];
  let s = !1, o = !1, c = !1;
  function i() {
    if (a.length) {
      if (s === !1) {
        const u = _s(a);
        if (u !== void 0)
          n.push(u);
        else
          return r.error = !0, !1;
      }
      a.length = 0;
    }
    return !0;
  }
  for (let u = 0; u < e.length; u++) {
    const l = e[u];
    if (!(l === "[" || l === "]"))
      if (l === ":") {
        if (o === !0 && (c = !0), !i())
          break;
        if (t++, n.push(":"), t > 7) {
          r.error = !0;
          break;
        }
        u - 1 >= 0 && e[u - 1] === ":" && (o = !0);
        continue;
      } else if (l === "%") {
        if (!i())
          break;
        s = !0;
      } else {
        a.push(l);
        continue;
      }
  }
  return a.length && (s ? r.zone = a.join("") : c ? n.push(a.join("")) : n.push(_s(a))), r.address = n.join(""), r;
}
function ni(e) {
  if (ai(e, ":") < 2)
    return { host: e, isIPV6: !1 };
  const t = ed(e);
  if (t.error)
    return { host: e, isIPV6: !1 };
  {
    let r = t.address, n = t.address;
    return t.zone && (r += "%" + t.zone, n += "%25" + t.zone), { host: r, escapedHost: n, isIPV6: !0 };
  }
}
function td(e, t) {
  let r = "", n = !0;
  const a = e.length;
  for (let s = 0; s < a; s++) {
    const o = e[s];
    o === "0" && n ? (s + 1 <= a && e[s + 1] === t || s + 1 === a) && (r += o, n = !1) : (o === t ? n = !0 : n = !1, r += o);
  }
  return r;
}
function ai(e, t) {
  let r = 0;
  for (let n = 0; n < e.length; n++)
    e[n] === t && r++;
  return r;
}
const Es = /^\.\.?\//u, ws = /^\/\.(?:\/|$)/u, bs = /^\/\.\.(?:\/|$)/u, rd = /^\/?(?:.|\n)*?(?=\/|$)/u;
function nd(e) {
  const t = [];
  for (; e.length; )
    if (e.match(Es))
      e = e.replace(Es, "");
    else if (e.match(ws))
      e = e.replace(ws, "/");
    else if (e.match(bs))
      e = e.replace(bs, "/"), t.pop();
    else if (e === "." || e === "..")
      e = "";
    else {
      const r = e.match(rd);
      if (r) {
        const n = r[0];
        e = e.slice(n.length), t.push(n);
      } else
        throw new Error("Unexpected dot segment condition");
    }
  return t.join("");
}
function ad(e, t) {
  const r = t !== !0 ? escape : unescape;
  return e.scheme !== void 0 && (e.scheme = r(e.scheme)), e.userinfo !== void 0 && (e.userinfo = r(e.userinfo)), e.host !== void 0 && (e.host = r(e.host)), e.path !== void 0 && (e.path = r(e.path)), e.query !== void 0 && (e.query = r(e.query)), e.fragment !== void 0 && (e.fragment = r(e.fragment)), e;
}
function sd(e) {
  const t = [];
  if (e.userinfo !== void 0 && (t.push(e.userinfo), t.push("@")), e.host !== void 0) {
    let r = unescape(e.host);
    const n = ri(r);
    if (n.isIPV4)
      r = n.host;
    else {
      const a = ni(n.host);
      a.isIPV6 === !0 ? r = `[${a.escapedHost}]` : r = e.host;
    }
    t.push(r);
  }
  return (typeof e.port == "number" || typeof e.port == "string") && (t.push(":"), t.push(String(e.port))), t.length ? t.join("") : void 0;
}
var od = {
  recomposeAuthority: sd,
  normalizeComponentEncoding: ad,
  removeDotSegments: nd,
  normalizeIPv4: ri,
  normalizeIPv6: ni
};
const id = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu, cd = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function si(e) {
  return typeof e.secure == "boolean" ? e.secure : String(e.scheme).toLowerCase() === "wss";
}
function oi(e) {
  return e.host || (e.error = e.error || "HTTP URIs must have a host."), e;
}
function ii(e) {
  const t = String(e.scheme).toLowerCase() === "https";
  return (e.port === (t ? 443 : 80) || e.port === "") && (e.port = void 0), e.path || (e.path = "/"), e;
}
function ld(e) {
  return e.secure = si(e), e.resourceName = (e.path || "/") + (e.query ? "?" + e.query : ""), e.path = void 0, e.query = void 0, e;
}
function ud(e) {
  if ((e.port === (si(e) ? 443 : 80) || e.port === "") && (e.port = void 0), typeof e.secure == "boolean" && (e.scheme = e.secure ? "wss" : "ws", e.secure = void 0), e.resourceName) {
    const [t, r] = e.resourceName.split("?");
    e.path = t && t !== "/" ? t : void 0, e.query = r, e.resourceName = void 0;
  }
  return e.fragment = void 0, e;
}
function dd(e, t) {
  if (!e.path)
    return e.error = "URN can not be parsed", e;
  const r = e.path.match(cd);
  if (r) {
    const n = t.scheme || e.scheme || "urn";
    e.nid = r[1].toLowerCase(), e.nss = r[2];
    const a = `${n}:${t.nid || e.nid}`, s = ta[a];
    e.path = void 0, s && (e = s.parse(e, t));
  } else
    e.error = e.error || "URN can not be parsed.";
  return e;
}
function fd(e, t) {
  const r = t.scheme || e.scheme || "urn", n = e.nid.toLowerCase(), a = `${r}:${t.nid || n}`, s = ta[a];
  s && (e = s.serialize(e, t));
  const o = e, c = e.nss;
  return o.path = `${n || t.nid}:${c}`, t.skipEscape = !0, o;
}
function pd(e, t) {
  const r = e;
  return r.uuid = r.nss, r.nss = void 0, !t.tolerant && (!r.uuid || !id.test(r.uuid)) && (r.error = r.error || "UUID is not valid."), r;
}
function md(e) {
  const t = e;
  return t.nss = (e.uuid || "").toLowerCase(), t;
}
const ci = {
  scheme: "http",
  domainHost: !0,
  parse: oi,
  serialize: ii
}, hd = {
  scheme: "https",
  domainHost: ci.domainHost,
  parse: oi,
  serialize: ii
}, yr = {
  scheme: "ws",
  domainHost: !0,
  parse: ld,
  serialize: ud
}, $d = {
  scheme: "wss",
  domainHost: yr.domainHost,
  parse: yr.parse,
  serialize: yr.serialize
}, yd = {
  scheme: "urn",
  parse: dd,
  serialize: fd,
  skipNormalize: !0
}, gd = {
  scheme: "urn:uuid",
  parse: pd,
  serialize: md,
  skipNormalize: !0
}, ta = {
  http: ci,
  https: hd,
  ws: yr,
  wss: $d,
  urn: yd,
  "urn:uuid": gd
};
var vd = ta;
const { normalizeIPv6: _d, normalizeIPv4: Ed, removeDotSegments: Ut, recomposeAuthority: wd, normalizeComponentEncoding: nr } = od, ra = vd;
function bd(e, t) {
  return typeof e == "string" ? e = xe(Ue(e, t), t) : typeof e == "object" && (e = Ue(xe(e, t), t)), e;
}
function Sd(e, t, r) {
  const n = Object.assign({ scheme: "null" }, r), a = li(Ue(e, n), Ue(t, n), n, !0);
  return xe(a, { ...n, skipEscape: !0 });
}
function li(e, t, r, n) {
  const a = {};
  return n || (e = Ue(xe(e, r), r), t = Ue(xe(t, r), r)), r = r || {}, !r.tolerant && t.scheme ? (a.scheme = t.scheme, a.userinfo = t.userinfo, a.host = t.host, a.port = t.port, a.path = Ut(t.path || ""), a.query = t.query) : (t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0 ? (a.userinfo = t.userinfo, a.host = t.host, a.port = t.port, a.path = Ut(t.path || ""), a.query = t.query) : (t.path ? (t.path.charAt(0) === "/" ? a.path = Ut(t.path) : ((e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0) && !e.path ? a.path = "/" + t.path : e.path ? a.path = e.path.slice(0, e.path.lastIndexOf("/") + 1) + t.path : a.path = t.path, a.path = Ut(a.path)), a.query = t.query) : (a.path = e.path, t.query !== void 0 ? a.query = t.query : a.query = e.query), a.userinfo = e.userinfo, a.host = e.host, a.port = e.port), a.scheme = e.scheme), a.fragment = t.fragment, a;
}
function Pd(e, t, r) {
  return typeof e == "string" ? (e = unescape(e), e = xe(nr(Ue(e, r), !0), { ...r, skipEscape: !0 })) : typeof e == "object" && (e = xe(nr(e, !0), { ...r, skipEscape: !0 })), typeof t == "string" ? (t = unescape(t), t = xe(nr(Ue(t, r), !0), { ...r, skipEscape: !0 })) : typeof t == "object" && (t = xe(nr(t, !0), { ...r, skipEscape: !0 })), e.toLowerCase() === t.toLowerCase();
}
function xe(e, t) {
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
  }, n = Object.assign({}, t), a = [], s = ra[(n.scheme || r.scheme || "").toLowerCase()];
  s && s.serialize && s.serialize(r, n), r.path !== void 0 && (n.skipEscape ? r.path = unescape(r.path) : (r.path = escape(r.path), r.scheme !== void 0 && (r.path = r.path.split("%3A").join(":")))), n.reference !== "suffix" && r.scheme && a.push(r.scheme, ":");
  const o = wd(r);
  if (o !== void 0 && (n.reference !== "suffix" && a.push("//"), a.push(o), r.path && r.path.charAt(0) !== "/" && a.push("/")), r.path !== void 0) {
    let c = r.path;
    !n.absolutePath && (!s || !s.absolutePath) && (c = Ut(c)), o === void 0 && (c = c.replace(/^\/\//u, "/%2F")), a.push(c);
  }
  return r.query !== void 0 && a.push("?", r.query), r.fragment !== void 0 && a.push("#", r.fragment), a.join("");
}
const Rd = Array.from({ length: 127 }, (e, t) => /[^!"$&'()*+,\-.;=_`a-z{}~]/u.test(String.fromCharCode(t)));
function Id(e) {
  let t = 0;
  for (let r = 0, n = e.length; r < n; ++r)
    if (t = e.charCodeAt(r), t > 126 || Rd[t])
      return !0;
  return !1;
}
const jd = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function Ue(e, t) {
  const r = Object.assign({}, t), n = {
    scheme: void 0,
    userinfo: void 0,
    host: "",
    port: void 0,
    path: "",
    query: void 0,
    fragment: void 0
  }, a = e.indexOf("%") !== -1;
  let s = !1;
  r.reference === "suffix" && (e = (r.scheme ? r.scheme + ":" : "") + "//" + e);
  const o = e.match(jd);
  if (o) {
    if (n.scheme = o[1], n.userinfo = o[3], n.host = o[4], n.port = parseInt(o[5], 10), n.path = o[6] || "", n.query = o[7], n.fragment = o[8], isNaN(n.port) && (n.port = o[5]), n.host) {
      const i = Ed(n.host);
      if (i.isIPV4 === !1) {
        const u = _d(i.host);
        n.host = u.host.toLowerCase(), s = u.isIPV6;
      } else
        n.host = i.host, s = !0;
    }
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && n.query === void 0 && !n.path ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", r.reference && r.reference !== "suffix" && r.reference !== n.reference && (n.error = n.error || "URI is not a " + r.reference + " reference.");
    const c = ra[(r.scheme || n.scheme || "").toLowerCase()];
    if (!r.unicodeSupport && (!c || !c.unicodeSupport) && n.host && (r.domainHost || c && c.domainHost) && s === !1 && Id(n.host))
      try {
        n.host = URL.domainToASCII(n.host.toLowerCase());
      } catch (i) {
        n.error = n.error || "Host's domain name can not be converted to ASCII: " + i;
      }
    (!c || c && !c.skipNormalize) && (a && n.scheme !== void 0 && (n.scheme = unescape(n.scheme)), a && n.host !== void 0 && (n.host = unescape(n.host)), n.path && (n.path = escape(unescape(n.path))), n.fragment && (n.fragment = encodeURI(decodeURIComponent(n.fragment)))), c && c.parse && c.parse(n, r);
  } else
    n.error = n.error || "URI can not be parsed.";
  return n;
}
const na = {
  SCHEMES: ra,
  normalize: bd,
  resolve: Sd,
  resolveComponents: li,
  equal: Pd,
  serialize: xe,
  parse: Ue
};
kr.exports = na;
kr.exports.default = na;
kr.exports.fastUri = na;
var Nd = kr.exports;
Object.defineProperty(ea, "__esModule", { value: !0 });
const ui = Nd;
ui.code = 'require("ajv/dist/runtime/uri").default';
ea.default = ui;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = Se;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = U;
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
  const n = It, a = ut, s = ct, o = he, c = U, i = ce, u = ne, l = O, f = Bu, E = ea, h = (P, $) => new RegExp(P, $);
  h.code = "new RegExp";
  const v = ["removeAdditional", "useDefaults", "coerceTypes"], y = /* @__PURE__ */ new Set([
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
  ]), _ = {
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
    var $, b, g, d, p, S, D, L, B, X, se, dt, Xr, Wr, Br, Jr, Yr, Zr, Qr, en, tn, rn, nn, an, sn;
    const kt = P.strict, on = ($ = P.code) === null || $ === void 0 ? void 0 : $.optimize, Za = on === !0 || on === void 0 ? 1 : on || 0, Qa = (g = (b = P.code) === null || b === void 0 ? void 0 : b.regExp) !== null && g !== void 0 ? g : h, Di = (d = P.uriResolver) !== null && d !== void 0 ? d : E.default;
    return {
      strictSchema: (S = (p = P.strictSchema) !== null && p !== void 0 ? p : kt) !== null && S !== void 0 ? S : !0,
      strictNumbers: (L = (D = P.strictNumbers) !== null && D !== void 0 ? D : kt) !== null && L !== void 0 ? L : !0,
      strictTypes: (X = (B = P.strictTypes) !== null && B !== void 0 ? B : kt) !== null && X !== void 0 ? X : "log",
      strictTuples: (dt = (se = P.strictTuples) !== null && se !== void 0 ? se : kt) !== null && dt !== void 0 ? dt : "log",
      strictRequired: (Wr = (Xr = P.strictRequired) !== null && Xr !== void 0 ? Xr : kt) !== null && Wr !== void 0 ? Wr : !1,
      code: P.code ? { ...P.code, optimize: Za, regExp: Qa } : { optimize: Za, regExp: Qa },
      loopRequired: (Br = P.loopRequired) !== null && Br !== void 0 ? Br : w,
      loopEnum: (Jr = P.loopEnum) !== null && Jr !== void 0 ? Jr : w,
      meta: (Yr = P.meta) !== null && Yr !== void 0 ? Yr : !0,
      messages: (Zr = P.messages) !== null && Zr !== void 0 ? Zr : !0,
      inlineRefs: (Qr = P.inlineRefs) !== null && Qr !== void 0 ? Qr : !0,
      schemaId: (en = P.schemaId) !== null && en !== void 0 ? en : "$id",
      addUsedSchema: (tn = P.addUsedSchema) !== null && tn !== void 0 ? tn : !0,
      validateSchema: (rn = P.validateSchema) !== null && rn !== void 0 ? rn : !0,
      validateFormats: (nn = P.validateFormats) !== null && nn !== void 0 ? nn : !0,
      unicodeRegExp: (an = P.unicodeRegExp) !== null && an !== void 0 ? an : !0,
      int32range: (sn = P.int32range) !== null && sn !== void 0 ? sn : !0,
      uriResolver: Di
    };
  }
  class N {
    constructor($ = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), $ = this.opts = { ...$, ...R($) };
      const { es5: b, lines: g } = this.opts.code;
      this.scope = new c.ValueScope({ scope: {}, prefixes: y, es5: b, lines: g }), this.logger = F($.logger);
      const d = $.validateFormats;
      $.validateFormats = !1, this.RULES = (0, s.getRules)(), T.call(this, _, $, "NOT SUPPORTED"), T.call(this, m, $, "DEPRECATED", "warn"), this._metaOpts = Pe.call(this), $.formats && ye.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), $.keywords && we.call(this, $.keywords), typeof $.meta == "object" && this.addMetaSchema($.meta), te.call(this), $.validateFormats = d;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: $, meta: b, schemaId: g } = this.opts;
      let d = f;
      g === "id" && (d = { ...f }, d.id = d.$id, delete d.$id), b && $ && this.addMetaSchema(d, d[g], !1);
    }
    defaultMeta() {
      const { meta: $, schemaId: b } = this.opts;
      return this.opts.defaultMeta = typeof $ == "object" ? $[b] || $ : void 0;
    }
    validate($, b) {
      let g;
      if (typeof $ == "string") {
        if (g = this.getSchema($), !g)
          throw new Error(`no schema with key or ref "${$}"`);
      } else
        g = this.compile($);
      const d = g(b);
      return "$async" in g || (this.errors = g.errors), d;
    }
    compile($, b) {
      const g = this._addSchema($, b);
      return g.validate || this._compileSchemaEnv(g);
    }
    compileAsync($, b) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: g } = this.opts;
      return d.call(this, $, b);
      async function d(X, se) {
        await p.call(this, X.$schema);
        const dt = this._addSchema(X, se);
        return dt.validate || S.call(this, dt);
      }
      async function p(X) {
        X && !this.getSchema(X) && await d.call(this, { $ref: X }, !0);
      }
      async function S(X) {
        try {
          return this._compileSchemaEnv(X);
        } catch (se) {
          if (!(se instanceof a.default))
            throw se;
          return D.call(this, se), await L.call(this, se.missingSchema), S.call(this, X);
        }
      }
      function D({ missingSchema: X, missingRef: se }) {
        if (this.refs[X])
          throw new Error(`AnySchema ${X} is loaded but ${se} cannot be resolved`);
      }
      async function L(X) {
        const se = await B.call(this, X);
        this.refs[X] || await p.call(this, se.$schema), this.refs[X] || this.addSchema(se, X, b);
      }
      async function B(X) {
        const se = this._loading[X];
        if (se)
          return se;
        try {
          return await (this._loading[X] = g(X));
        } finally {
          delete this._loading[X];
        }
      }
    }
    // Adds schema to the instance
    addSchema($, b, g, d = this.opts.validateSchema) {
      if (Array.isArray($)) {
        for (const S of $)
          this.addSchema(S, void 0, g, d);
        return this;
      }
      let p;
      if (typeof $ == "object") {
        const { schemaId: S } = this.opts;
        if (p = $[S], p !== void 0 && typeof p != "string")
          throw new Error(`schema ${S} must be string`);
      }
      return b = (0, i.normalizeId)(b || p), this._checkUnique(b), this.schemas[b] = this._addSchema($, g, b, d, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema($, b, g = this.opts.validateSchema) {
      return this.addSchema($, b, !0, g), this;
    }
    //  Validate schema against its meta-schema
    validateSchema($, b) {
      if (typeof $ == "boolean")
        return !0;
      let g;
      if (g = $.$schema, g !== void 0 && typeof g != "string")
        throw new Error("$schema must be a string");
      if (g = g || this.opts.defaultMeta || this.defaultMeta(), !g)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const d = this.validate(g, $);
      if (!d && b) {
        const p = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(p);
        else
          throw new Error(p);
      }
      return d;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema($) {
      let b;
      for (; typeof (b = W.call(this, $)) == "string"; )
        $ = b;
      if (b === void 0) {
        const { schemaId: g } = this.opts, d = new o.SchemaEnv({ schema: {}, schemaId: g });
        if (b = o.resolveSchema.call(this, d, $), !b)
          return;
        this.refs[$] = b;
      }
      return b.validate || this._compileSchemaEnv(b);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema($) {
      if ($ instanceof RegExp)
        return this._removeAllSchemas(this.schemas, $), this._removeAllSchemas(this.refs, $), this;
      switch (typeof $) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const b = W.call(this, $);
          return typeof b == "object" && this._cache.delete(b.schema), delete this.schemas[$], delete this.refs[$], this;
        }
        case "object": {
          const b = $;
          this._cache.delete(b);
          let g = $[this.opts.schemaId];
          return g && (g = (0, i.normalizeId)(g), delete this.schemas[g], delete this.refs[g]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary($) {
      for (const b of $)
        this.addKeyword(b);
      return this;
    }
    addKeyword($, b) {
      let g;
      if (typeof $ == "string")
        g = $, typeof b == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), b.keyword = g);
      else if (typeof $ == "object" && b === void 0) {
        if (b = $, g = b.keyword, Array.isArray(g) && !g.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (I.call(this, g, b), !b)
        return (0, l.eachItem)(g, (p) => j.call(this, p)), this;
      A.call(this, b);
      const d = {
        ...b,
        type: (0, u.getJSONTypes)(b.type),
        schemaType: (0, u.getJSONTypes)(b.schemaType)
      };
      return (0, l.eachItem)(g, d.type.length === 0 ? (p) => j.call(this, p, d) : (p) => d.type.forEach((S) => j.call(this, p, d, S))), this;
    }
    getKeyword($) {
      const b = this.RULES.all[$];
      return typeof b == "object" ? b.definition : !!b;
    }
    // Remove keyword
    removeKeyword($) {
      const { RULES: b } = this;
      delete b.keywords[$], delete b.all[$];
      for (const g of b.rules) {
        const d = g.rules.findIndex((p) => p.keyword === $);
        d >= 0 && g.rules.splice(d, 1);
      }
      return this;
    }
    // Add format
    addFormat($, b) {
      return typeof b == "string" && (b = new RegExp(b)), this.formats[$] = b, this;
    }
    errorsText($ = this.errors, { separator: b = ", ", dataVar: g = "data" } = {}) {
      return !$ || $.length === 0 ? "No errors" : $.map((d) => `${g}${d.instancePath} ${d.message}`).reduce((d, p) => d + b + p);
    }
    $dataMetaSchema($, b) {
      const g = this.RULES.all;
      $ = JSON.parse(JSON.stringify($));
      for (const d of b) {
        const p = d.split("/").slice(1);
        let S = $;
        for (const D of p)
          S = S[D];
        for (const D in g) {
          const L = g[D];
          if (typeof L != "object")
            continue;
          const { $data: B } = L.definition, X = S[D];
          B && X && (S[D] = k(X));
        }
      }
      return $;
    }
    _removeAllSchemas($, b) {
      for (const g in $) {
        const d = $[g];
        (!b || b.test(g)) && (typeof d == "string" ? delete $[g] : d && !d.meta && (this._cache.delete(d.schema), delete $[g]));
      }
    }
    _addSchema($, b, g, d = this.opts.validateSchema, p = this.opts.addUsedSchema) {
      let S;
      const { schemaId: D } = this.opts;
      if (typeof $ == "object")
        S = $[D];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof $ != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let L = this._cache.get($);
      if (L !== void 0)
        return L;
      g = (0, i.normalizeId)(S || g);
      const B = i.getSchemaRefs.call(this, $, g);
      return L = new o.SchemaEnv({ schema: $, schemaId: D, meta: b, baseId: g, localRefs: B }), this._cache.set(L.schema, L), p && !g.startsWith("#") && (g && this._checkUnique(g), this.refs[g] = L), d && this.validateSchema($, !0), L;
    }
    _checkUnique($) {
      if (this.schemas[$] || this.refs[$])
        throw new Error(`schema with key or id "${$}" already exists`);
    }
    _compileSchemaEnv($) {
      if ($.meta ? this._compileMetaSchema($) : o.compileSchema.call(this, $), !$.validate)
        throw new Error("ajv implementation error");
      return $.validate;
    }
    _compileMetaSchema($) {
      const b = this.opts;
      this.opts = this._metaOpts;
      try {
        o.compileSchema.call(this, $);
      } finally {
        this.opts = b;
      }
    }
  }
  N.ValidationError = n.default, N.MissingRefError = a.default, e.default = N;
  function T(P, $, b, g = "error") {
    for (const d in P) {
      const p = d;
      p in $ && this.logger[g](`${b}: option ${d}. ${P[p]}`);
    }
  }
  function W(P) {
    return P = (0, i.normalizeId)(P), this.schemas[P] || this.refs[P];
  }
  function te() {
    const P = this.opts.schemas;
    if (P)
      if (Array.isArray(P))
        this.addSchema(P);
      else
        for (const $ in P)
          this.addSchema(P[$], $);
  }
  function ye() {
    for (const P in this.opts.formats) {
      const $ = this.opts.formats[P];
      $ && this.addFormat(P, $);
    }
  }
  function we(P) {
    if (Array.isArray(P)) {
      this.addVocabulary(P);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const $ in P) {
      const b = P[$];
      b.keyword || (b.keyword = $), this.addKeyword(b);
    }
  }
  function Pe() {
    const P = { ...this.opts };
    for (const $ of v)
      delete P[$];
    return P;
  }
  const z = { log() {
  }, warn() {
  }, error() {
  } };
  function F(P) {
    if (P === !1)
      return z;
    if (P === void 0)
      return console;
    if (P.log && P.warn && P.error)
      return P;
    throw new Error("logger must implement log, warn and error methods");
  }
  const Y = /^[a-z_$][a-z0-9_$:-]*$/i;
  function I(P, $) {
    const { RULES: b } = this;
    if ((0, l.eachItem)(P, (g) => {
      if (b.keywords[g])
        throw new Error(`Keyword ${g} is already defined`);
      if (!Y.test(g))
        throw new Error(`Keyword ${g} has invalid name`);
    }), !!$ && $.$data && !("code" in $ || "validate" in $))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function j(P, $, b) {
    var g;
    const d = $ == null ? void 0 : $.post;
    if (b && d)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: p } = this;
    let S = d ? p.post : p.rules.find(({ type: L }) => L === b);
    if (S || (S = { type: b, rules: [] }, p.rules.push(S)), p.keywords[P] = !0, !$)
      return;
    const D = {
      keyword: P,
      definition: {
        ...$,
        type: (0, u.getJSONTypes)($.type),
        schemaType: (0, u.getJSONTypes)($.schemaType)
      }
    };
    $.before ? C.call(this, S, D, $.before) : S.rules.push(D), p.all[P] = D, (g = $.implements) === null || g === void 0 || g.forEach((L) => this.addKeyword(L));
  }
  function C(P, $, b) {
    const g = P.rules.findIndex((d) => d.keyword === b);
    g >= 0 ? P.rules.splice(g, 0, $) : (P.rules.push($), this.logger.warn(`rule ${b} is not defined`));
  }
  function A(P) {
    let { metaSchema: $ } = P;
    $ !== void 0 && (P.$data && this.opts.$data && ($ = k($)), P.validateSchema = this.compile($, !0));
  }
  const M = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function k(P) {
    return { anyOf: [P, M] };
  }
})(qn);
var aa = {}, Cr = {}, sa = {};
Object.defineProperty(sa, "__esModule", { value: !0 });
const Od = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
sa.default = Od;
var Fe = {};
Object.defineProperty(Fe, "__esModule", { value: !0 });
Fe.callRef = Fe.getValidate = void 0;
const Td = ut, Ss = H, ge = U, pt = Ee, Ps = he, ar = O, Ad = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: a, schemaEnv: s, validateName: o, opts: c, self: i } = n, { root: u } = s;
    if ((r === "#" || r === "#/") && a === u.baseId)
      return f();
    const l = Ps.resolveRef.call(i, u, a, r);
    if (l === void 0)
      throw new Td.default(n.opts.uriResolver, a, r);
    if (l instanceof Ps.SchemaEnv)
      return E(l);
    return h(l);
    function f() {
      if (s === u)
        return gr(e, o, s, s.$async);
      const v = t.scopeValue("root", { ref: u });
      return gr(e, (0, ge._)`${v}.validate`, u, u.$async);
    }
    function E(v) {
      const y = di(e, v);
      gr(e, y, v, v.$async);
    }
    function h(v) {
      const y = t.scopeValue("schema", c.code.source === !0 ? { ref: v, code: (0, ge.stringify)(v) } : { ref: v }), _ = t.name("valid"), m = e.subschema({
        schema: v,
        dataTypes: [],
        schemaPath: ge.nil,
        topSchemaRef: y,
        errSchemaPath: r
      }, _);
      e.mergeEvaluated(m), e.ok(_);
    }
  }
};
function di(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, ge._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
Fe.getValidate = di;
function gr(e, t, r, n) {
  const { gen: a, it: s } = e, { allErrors: o, schemaEnv: c, opts: i } = s, u = i.passContext ? pt.default.this : ge.nil;
  n ? l() : f();
  function l() {
    if (!c.$async)
      throw new Error("async schema referenced by sync schema");
    const v = a.let("valid");
    a.try(() => {
      a.code((0, ge._)`await ${(0, Ss.callValidateCode)(e, t, u)}`), h(t), o || a.assign(v, !0);
    }, (y) => {
      a.if((0, ge._)`!(${y} instanceof ${s.ValidationError})`, () => a.throw(y)), E(y), o || a.assign(v, !1);
    }), e.ok(v);
  }
  function f() {
    e.result((0, Ss.callValidateCode)(e, t, u), () => h(t), () => E(t));
  }
  function E(v) {
    const y = (0, ge._)`${v}.errors`;
    a.assign(pt.default.vErrors, (0, ge._)`${pt.default.vErrors} === null ? ${y} : ${pt.default.vErrors}.concat(${y})`), a.assign(pt.default.errors, (0, ge._)`${pt.default.vErrors}.length`);
  }
  function h(v) {
    var y;
    if (!s.opts.unevaluated)
      return;
    const _ = (y = r == null ? void 0 : r.validate) === null || y === void 0 ? void 0 : y.evaluated;
    if (s.props !== !0)
      if (_ && !_.dynamicProps)
        _.props !== void 0 && (s.props = ar.mergeEvaluated.props(a, _.props, s.props));
      else {
        const m = a.var("props", (0, ge._)`${v}.evaluated.props`);
        s.props = ar.mergeEvaluated.props(a, m, s.props, ge.Name);
      }
    if (s.items !== !0)
      if (_ && !_.dynamicItems)
        _.items !== void 0 && (s.items = ar.mergeEvaluated.items(a, _.items, s.items));
      else {
        const m = a.var("items", (0, ge._)`${v}.evaluated.items`);
        s.items = ar.mergeEvaluated.items(a, m, s.items, ge.Name);
      }
  }
}
Fe.callRef = gr;
Fe.default = Ad;
Object.defineProperty(Cr, "__esModule", { value: !0 });
const kd = sa, Cd = Fe, xd = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  kd.default,
  Cd.default
];
Cr.default = xd;
var xr = {}, oa = {};
Object.defineProperty(oa, "__esModule", { value: !0 });
const Sr = U, Xe = Sr.operators, Pr = {
  maximum: { okStr: "<=", ok: Xe.LTE, fail: Xe.GT },
  minimum: { okStr: ">=", ok: Xe.GTE, fail: Xe.LT },
  exclusiveMaximum: { okStr: "<", ok: Xe.LT, fail: Xe.GTE },
  exclusiveMinimum: { okStr: ">", ok: Xe.GT, fail: Xe.LTE }
}, Dd = {
  message: ({ keyword: e, schemaCode: t }) => (0, Sr.str)`must be ${Pr[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, Sr._)`{comparison: ${Pr[e].okStr}, limit: ${t}}`
}, Ld = {
  keyword: Object.keys(Pr),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Dd,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, Sr._)`${r} ${Pr[t].fail} ${n} || isNaN(${r})`);
  }
};
oa.default = Ld;
var ia = {};
Object.defineProperty(ia, "__esModule", { value: !0 });
const Kt = U, Md = {
  message: ({ schemaCode: e }) => (0, Kt.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, Kt._)`{multipleOf: ${e}}`
}, zd = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Md,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: a } = e, s = a.opts.multipleOfPrecision, o = t.let("res"), c = s ? (0, Kt._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${s}` : (0, Kt._)`${o} !== parseInt(${o})`;
    e.fail$data((0, Kt._)`(${n} === 0 || (${o} = ${r}/${n}, ${c}))`);
  }
};
ia.default = zd;
var ca = {}, la = {};
Object.defineProperty(la, "__esModule", { value: !0 });
function fi(e) {
  const t = e.length;
  let r = 0, n = 0, a;
  for (; n < t; )
    r++, a = e.charCodeAt(n++), a >= 55296 && a <= 56319 && n < t && (a = e.charCodeAt(n), (a & 64512) === 56320 && n++);
  return r;
}
la.default = fi;
fi.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(ca, "__esModule", { value: !0 });
const rt = U, Vd = O, Ud = la, Fd = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, rt.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, rt._)`{limit: ${e}}`
}, qd = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: Fd,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: a } = e, s = t === "maxLength" ? rt.operators.GT : rt.operators.LT, o = a.opts.unicode === !1 ? (0, rt._)`${r}.length` : (0, rt._)`${(0, Vd.useFunc)(e.gen, Ud.default)}(${r})`;
    e.fail$data((0, rt._)`${o} ${s} ${n}`);
  }
};
ca.default = qd;
var ua = {};
Object.defineProperty(ua, "__esModule", { value: !0 });
const Gd = H, Rr = U, Hd = {
  message: ({ schemaCode: e }) => (0, Rr.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, Rr._)`{pattern: ${e}}`
}, Kd = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: Hd,
  code(e) {
    const { data: t, $data: r, schema: n, schemaCode: a, it: s } = e, o = s.opts.unicodeRegExp ? "u" : "", c = r ? (0, Rr._)`(new RegExp(${a}, ${o}))` : (0, Gd.usePattern)(e, n);
    e.fail$data((0, Rr._)`!${c}.test(${t})`);
  }
};
ua.default = Kd;
var da = {};
Object.defineProperty(da, "__esModule", { value: !0 });
const Xt = U, Xd = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, Xt.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, Xt._)`{limit: ${e}}`
}, Wd = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: Xd,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, a = t === "maxProperties" ? Xt.operators.GT : Xt.operators.LT;
    e.fail$data((0, Xt._)`Object.keys(${r}).length ${a} ${n}`);
  }
};
da.default = Wd;
var fa = {};
Object.defineProperty(fa, "__esModule", { value: !0 });
const zt = H, Wt = U, Bd = O, Jd = {
  message: ({ params: { missingProperty: e } }) => (0, Wt.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, Wt._)`{missingProperty: ${e}}`
}, Yd = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: Jd,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: a, $data: s, it: o } = e, { opts: c } = o;
    if (!s && r.length === 0)
      return;
    const i = r.length >= c.loopRequired;
    if (o.allErrors ? u() : l(), c.strictRequired) {
      const h = e.parentSchema.properties, { definedProperties: v } = e.it;
      for (const y of r)
        if ((h == null ? void 0 : h[y]) === void 0 && !v.has(y)) {
          const _ = o.schemaEnv.baseId + o.errSchemaPath, m = `required property "${y}" is not defined at "${_}" (strictRequired)`;
          (0, Bd.checkStrictMode)(o, m, o.opts.strictRequired);
        }
    }
    function u() {
      if (i || s)
        e.block$data(Wt.nil, f);
      else
        for (const h of r)
          (0, zt.checkReportMissingProp)(e, h);
    }
    function l() {
      const h = t.let("missing");
      if (i || s) {
        const v = t.let("valid", !0);
        e.block$data(v, () => E(h, v)), e.ok(v);
      } else
        t.if((0, zt.checkMissingProp)(e, r, h)), (0, zt.reportMissingProp)(e, h), t.else();
    }
    function f() {
      t.forOf("prop", n, (h) => {
        e.setParams({ missingProperty: h }), t.if((0, zt.noPropertyInData)(t, a, h, c.ownProperties), () => e.error());
      });
    }
    function E(h, v) {
      e.setParams({ missingProperty: h }), t.forOf(h, n, () => {
        t.assign(v, (0, zt.propertyInData)(t, a, h, c.ownProperties)), t.if((0, Wt.not)(v), () => {
          e.error(), t.break();
        });
      }, Wt.nil);
    }
  }
};
fa.default = Yd;
var pa = {};
Object.defineProperty(pa, "__esModule", { value: !0 });
const Bt = U, Zd = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, Bt.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, Bt._)`{limit: ${e}}`
}, Qd = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: Zd,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, a = t === "maxItems" ? Bt.operators.GT : Bt.operators.LT;
    e.fail$data((0, Bt._)`${r}.length ${a} ${n}`);
  }
};
pa.default = Qd;
var ma = {}, er = {};
Object.defineProperty(er, "__esModule", { value: !0 });
const pi = zo;
pi.code = 'require("ajv/dist/runtime/equal").default';
er.default = pi;
Object.defineProperty(ma, "__esModule", { value: !0 });
const mn = ne, oe = U, ef = O, tf = er, rf = {
  message: ({ params: { i: e, j: t } }) => (0, oe.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, oe._)`{i: ${e}, j: ${t}}`
}, nf = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: rf,
  code(e) {
    const { gen: t, data: r, $data: n, schema: a, parentSchema: s, schemaCode: o, it: c } = e;
    if (!n && !a)
      return;
    const i = t.let("valid"), u = s.items ? (0, mn.getSchemaTypes)(s.items) : [];
    e.block$data(i, l, (0, oe._)`${o} === false`), e.ok(i);
    function l() {
      const v = t.let("i", (0, oe._)`${r}.length`), y = t.let("j");
      e.setParams({ i: v, j: y }), t.assign(i, !0), t.if((0, oe._)`${v} > 1`, () => (f() ? E : h)(v, y));
    }
    function f() {
      return u.length > 0 && !u.some((v) => v === "object" || v === "array");
    }
    function E(v, y) {
      const _ = t.name("item"), m = (0, mn.checkDataTypes)(u, _, c.opts.strictNumbers, mn.DataType.Wrong), w = t.const("indices", (0, oe._)`{}`);
      t.for((0, oe._)`;${v}--;`, () => {
        t.let(_, (0, oe._)`${r}[${v}]`), t.if(m, (0, oe._)`continue`), u.length > 1 && t.if((0, oe._)`typeof ${_} == "string"`, (0, oe._)`${_} += "_"`), t.if((0, oe._)`typeof ${w}[${_}] == "number"`, () => {
          t.assign(y, (0, oe._)`${w}[${_}]`), e.error(), t.assign(i, !1).break();
        }).code((0, oe._)`${w}[${_}] = ${v}`);
      });
    }
    function h(v, y) {
      const _ = (0, ef.useFunc)(t, tf.default), m = t.name("outer");
      t.label(m).for((0, oe._)`;${v}--;`, () => t.for((0, oe._)`${y} = ${v}; ${y}--;`, () => t.if((0, oe._)`${_}(${r}[${v}], ${r}[${y}])`, () => {
        e.error(), t.assign(i, !1).break(m);
      })));
    }
  }
};
ma.default = nf;
var ha = {};
Object.defineProperty(ha, "__esModule", { value: !0 });
const On = U, af = O, sf = er, of = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, On._)`{allowedValue: ${e}}`
}, cf = {
  keyword: "const",
  $data: !0,
  error: of,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: a, schema: s } = e;
    n || s && typeof s == "object" ? e.fail$data((0, On._)`!${(0, af.useFunc)(t, sf.default)}(${r}, ${a})`) : e.fail((0, On._)`${s} !== ${r}`);
  }
};
ha.default = cf;
var $a = {};
Object.defineProperty($a, "__esModule", { value: !0 });
const Ft = U, lf = O, uf = er, df = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Ft._)`{allowedValues: ${e}}`
}, ff = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: df,
  code(e) {
    const { gen: t, data: r, $data: n, schema: a, schemaCode: s, it: o } = e;
    if (!n && a.length === 0)
      throw new Error("enum must have non-empty array");
    const c = a.length >= o.opts.loopEnum;
    let i;
    const u = () => i ?? (i = (0, lf.useFunc)(t, uf.default));
    let l;
    if (c || n)
      l = t.let("valid"), e.block$data(l, f);
    else {
      if (!Array.isArray(a))
        throw new Error("ajv implementation error");
      const h = t.const("vSchema", s);
      l = (0, Ft.or)(...a.map((v, y) => E(h, y)));
    }
    e.pass(l);
    function f() {
      t.assign(l, !1), t.forOf("v", s, (h) => t.if((0, Ft._)`${u()}(${r}, ${h})`, () => t.assign(l, !0).break()));
    }
    function E(h, v) {
      const y = a[v];
      return typeof y == "object" && y !== null ? (0, Ft._)`${u()}(${r}, ${h}[${v}])` : (0, Ft._)`${r} === ${y}`;
    }
  }
};
$a.default = ff;
Object.defineProperty(xr, "__esModule", { value: !0 });
const pf = oa, mf = ia, hf = ca, $f = ua, yf = da, gf = fa, vf = pa, _f = ma, Ef = ha, wf = $a, bf = [
  // number
  pf.default,
  mf.default,
  // string
  hf.default,
  $f.default,
  // object
  yf.default,
  gf.default,
  // array
  vf.default,
  _f.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  Ef.default,
  wf.default
];
xr.default = bf;
var Dr = {}, jt = {};
Object.defineProperty(jt, "__esModule", { value: !0 });
jt.validateAdditionalItems = void 0;
const nt = U, Tn = O, Sf = {
  message: ({ params: { len: e } }) => (0, nt.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, nt._)`{limit: ${e}}`
}, Pf = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: Sf,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, Tn.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    mi(e, n);
  }
};
function mi(e, t) {
  const { gen: r, schema: n, data: a, keyword: s, it: o } = e;
  o.items = !0;
  const c = r.const("len", (0, nt._)`${a}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, nt._)`${c} <= ${t.length}`);
  else if (typeof n == "object" && !(0, Tn.alwaysValidSchema)(o, n)) {
    const u = r.var("valid", (0, nt._)`${c} <= ${t.length}`);
    r.if((0, nt.not)(u), () => i(u)), e.ok(u);
  }
  function i(u) {
    r.forRange("i", t.length, c, (l) => {
      e.subschema({ keyword: s, dataProp: l, dataPropType: Tn.Type.Num }, u), o.allErrors || r.if((0, nt.not)(u), () => r.break());
    });
  }
}
jt.validateAdditionalItems = mi;
jt.default = Pf;
var ya = {}, Nt = {};
Object.defineProperty(Nt, "__esModule", { value: !0 });
Nt.validateTuple = void 0;
const Rs = U, vr = O, Rf = H, If = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return hi(e, "additionalItems", t);
    r.items = !0, !(0, vr.alwaysValidSchema)(r, t) && e.ok((0, Rf.validateArray)(e));
  }
};
function hi(e, t, r = e.schema) {
  const { gen: n, parentSchema: a, data: s, keyword: o, it: c } = e;
  l(a), c.opts.unevaluated && r.length && c.items !== !0 && (c.items = vr.mergeEvaluated.items(n, r.length, c.items));
  const i = n.name("valid"), u = n.const("len", (0, Rs._)`${s}.length`);
  r.forEach((f, E) => {
    (0, vr.alwaysValidSchema)(c, f) || (n.if((0, Rs._)`${u} > ${E}`, () => e.subschema({
      keyword: o,
      schemaProp: E,
      dataProp: E
    }, i)), e.ok(i));
  });
  function l(f) {
    const { opts: E, errSchemaPath: h } = c, v = r.length, y = v === f.minItems && (v === f.maxItems || f[t] === !1);
    if (E.strictTuples && !y) {
      const _ = `"${o}" is ${v}-tuple, but minItems or maxItems/${t} are not specified or different at path "${h}"`;
      (0, vr.checkStrictMode)(c, _, E.strictTuples);
    }
  }
}
Nt.validateTuple = hi;
Nt.default = If;
Object.defineProperty(ya, "__esModule", { value: !0 });
const jf = Nt, Nf = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, jf.validateTuple)(e, "items")
};
ya.default = Nf;
var ga = {};
Object.defineProperty(ga, "__esModule", { value: !0 });
const Is = U, Of = O, Tf = H, Af = jt, kf = {
  message: ({ params: { len: e } }) => (0, Is.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Is._)`{limit: ${e}}`
}, Cf = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: kf,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: a } = r;
    n.items = !0, !(0, Of.alwaysValidSchema)(n, t) && (a ? (0, Af.validateAdditionalItems)(e, a) : e.ok((0, Tf.validateArray)(e)));
  }
};
ga.default = Cf;
var va = {};
Object.defineProperty(va, "__esModule", { value: !0 });
const be = U, sr = O, xf = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, be.str)`must contain at least ${e} valid item(s)` : (0, be.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, be._)`{minContains: ${e}}` : (0, be._)`{minContains: ${e}, maxContains: ${t}}`
}, Df = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: xf,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: a, it: s } = e;
    let o, c;
    const { minContains: i, maxContains: u } = n;
    s.opts.next ? (o = i === void 0 ? 1 : i, c = u) : o = 1;
    const l = t.const("len", (0, be._)`${a}.length`);
    if (e.setParams({ min: o, max: c }), c === void 0 && o === 0) {
      (0, sr.checkStrictMode)(s, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (c !== void 0 && o > c) {
      (0, sr.checkStrictMode)(s, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, sr.alwaysValidSchema)(s, r)) {
      let y = (0, be._)`${l} >= ${o}`;
      c !== void 0 && (y = (0, be._)`${y} && ${l} <= ${c}`), e.pass(y);
      return;
    }
    s.items = !0;
    const f = t.name("valid");
    c === void 0 && o === 1 ? h(f, () => t.if(f, () => t.break())) : o === 0 ? (t.let(f, !0), c !== void 0 && t.if((0, be._)`${a}.length > 0`, E)) : (t.let(f, !1), E()), e.result(f, () => e.reset());
    function E() {
      const y = t.name("_valid"), _ = t.let("count", 0);
      h(y, () => t.if(y, () => v(_)));
    }
    function h(y, _) {
      t.forRange("i", 0, l, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: sr.Type.Num,
          compositeRule: !0
        }, y), _();
      });
    }
    function v(y) {
      t.code((0, be._)`${y}++`), c === void 0 ? t.if((0, be._)`${y} >= ${o}`, () => t.assign(f, !0).break()) : (t.if((0, be._)`${y} > ${c}`, () => t.assign(f, !1).break()), o === 1 ? t.assign(f, !0) : t.if((0, be._)`${y} >= ${o}`, () => t.assign(f, !0)));
    }
  }
};
va.default = Df;
var Lr = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = U, r = O, n = H;
  e.error = {
    message: ({ params: { property: i, depsCount: u, deps: l } }) => {
      const f = u === 1 ? "property" : "properties";
      return (0, t.str)`must have ${f} ${l} when property ${i} is present`;
    },
    params: ({ params: { property: i, depsCount: u, deps: l, missingProperty: f } }) => (0, t._)`{property: ${i},
    missingProperty: ${f},
    depsCount: ${u},
    deps: ${l}}`
    // TODO change to reference
  };
  const a = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(i) {
      const [u, l] = s(i);
      o(i, u), c(i, l);
    }
  };
  function s({ schema: i }) {
    const u = {}, l = {};
    for (const f in i) {
      if (f === "__proto__")
        continue;
      const E = Array.isArray(i[f]) ? u : l;
      E[f] = i[f];
    }
    return [u, l];
  }
  function o(i, u = i.schema) {
    const { gen: l, data: f, it: E } = i;
    if (Object.keys(u).length === 0)
      return;
    const h = l.let("missing");
    for (const v in u) {
      const y = u[v];
      if (y.length === 0)
        continue;
      const _ = (0, n.propertyInData)(l, f, v, E.opts.ownProperties);
      i.setParams({
        property: v,
        depsCount: y.length,
        deps: y.join(", ")
      }), E.allErrors ? l.if(_, () => {
        for (const m of y)
          (0, n.checkReportMissingProp)(i, m);
      }) : (l.if((0, t._)`${_} && (${(0, n.checkMissingProp)(i, y, h)})`), (0, n.reportMissingProp)(i, h), l.else());
    }
  }
  e.validatePropertyDeps = o;
  function c(i, u = i.schema) {
    const { gen: l, data: f, keyword: E, it: h } = i, v = l.name("valid");
    for (const y in u)
      (0, r.alwaysValidSchema)(h, u[y]) || (l.if(
        (0, n.propertyInData)(l, f, y, h.opts.ownProperties),
        () => {
          const _ = i.subschema({ keyword: E, schemaProp: y }, v);
          i.mergeValidEvaluated(_, v);
        },
        () => l.var(v, !0)
        // TODO var
      ), i.ok(v));
  }
  e.validateSchemaDeps = c, e.default = a;
})(Lr);
var _a = {};
Object.defineProperty(_a, "__esModule", { value: !0 });
const $i = U, Lf = O, Mf = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, $i._)`{propertyName: ${e.propertyName}}`
}, zf = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: Mf,
  code(e) {
    const { gen: t, schema: r, data: n, it: a } = e;
    if ((0, Lf.alwaysValidSchema)(a, r))
      return;
    const s = t.name("valid");
    t.forIn("key", n, (o) => {
      e.setParams({ propertyName: o }), e.subschema({
        keyword: "propertyNames",
        data: o,
        dataTypes: ["string"],
        propertyName: o,
        compositeRule: !0
      }, s), t.if((0, $i.not)(s), () => {
        e.error(!0), a.allErrors || t.break();
      });
    }), e.ok(s);
  }
};
_a.default = zf;
var Mr = {};
Object.defineProperty(Mr, "__esModule", { value: !0 });
const or = H, Ie = U, Vf = Ee, ir = O, Uf = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, Ie._)`{additionalProperty: ${e.additionalProperty}}`
}, Ff = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: Uf,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: a, errsCount: s, it: o } = e;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: c, opts: i } = o;
    if (o.props = !0, i.removeAdditional !== "all" && (0, ir.alwaysValidSchema)(o, r))
      return;
    const u = (0, or.allSchemaProperties)(n.properties), l = (0, or.allSchemaProperties)(n.patternProperties);
    f(), e.ok((0, Ie._)`${s} === ${Vf.default.errors}`);
    function f() {
      t.forIn("key", a, (_) => {
        !u.length && !l.length ? v(_) : t.if(E(_), () => v(_));
      });
    }
    function E(_) {
      let m;
      if (u.length > 8) {
        const w = (0, ir.schemaRefOrVal)(o, n.properties, "properties");
        m = (0, or.isOwnProperty)(t, w, _);
      } else u.length ? m = (0, Ie.or)(...u.map((w) => (0, Ie._)`${_} === ${w}`)) : m = Ie.nil;
      return l.length && (m = (0, Ie.or)(m, ...l.map((w) => (0, Ie._)`${(0, or.usePattern)(e, w)}.test(${_})`))), (0, Ie.not)(m);
    }
    function h(_) {
      t.code((0, Ie._)`delete ${a}[${_}]`);
    }
    function v(_) {
      if (i.removeAdditional === "all" || i.removeAdditional && r === !1) {
        h(_);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: _ }), e.error(), c || t.break();
        return;
      }
      if (typeof r == "object" && !(0, ir.alwaysValidSchema)(o, r)) {
        const m = t.name("valid");
        i.removeAdditional === "failing" ? (y(_, m, !1), t.if((0, Ie.not)(m), () => {
          e.reset(), h(_);
        })) : (y(_, m), c || t.if((0, Ie.not)(m), () => t.break()));
      }
    }
    function y(_, m, w) {
      const R = {
        keyword: "additionalProperties",
        dataProp: _,
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
Mr.default = Ff;
var Ea = {};
Object.defineProperty(Ea, "__esModule", { value: !0 });
const qf = Se, js = H, hn = O, Ns = Mr, Gf = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: a, it: s } = e;
    s.opts.removeAdditional === "all" && n.additionalProperties === void 0 && Ns.default.code(new qf.KeywordCxt(s, Ns.default, "additionalProperties"));
    const o = (0, js.allSchemaProperties)(r);
    for (const f of o)
      s.definedProperties.add(f);
    s.opts.unevaluated && o.length && s.props !== !0 && (s.props = hn.mergeEvaluated.props(t, (0, hn.toHash)(o), s.props));
    const c = o.filter((f) => !(0, hn.alwaysValidSchema)(s, r[f]));
    if (c.length === 0)
      return;
    const i = t.name("valid");
    for (const f of c)
      u(f) ? l(f) : (t.if((0, js.propertyInData)(t, a, f, s.opts.ownProperties)), l(f), s.allErrors || t.else().var(i, !0), t.endIf()), e.it.definedProperties.add(f), e.ok(i);
    function u(f) {
      return s.opts.useDefaults && !s.compositeRule && r[f].default !== void 0;
    }
    function l(f) {
      e.subschema({
        keyword: "properties",
        schemaProp: f,
        dataProp: f
      }, i);
    }
  }
};
Ea.default = Gf;
var wa = {};
Object.defineProperty(wa, "__esModule", { value: !0 });
const Os = H, cr = U, Ts = O, As = O, Hf = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: a, it: s } = e, { opts: o } = s, c = (0, Os.allSchemaProperties)(r), i = c.filter((y) => (0, Ts.alwaysValidSchema)(s, r[y]));
    if (c.length === 0 || i.length === c.length && (!s.opts.unevaluated || s.props === !0))
      return;
    const u = o.strictSchema && !o.allowMatchingProperties && a.properties, l = t.name("valid");
    s.props !== !0 && !(s.props instanceof cr.Name) && (s.props = (0, As.evaluatedPropsToName)(t, s.props));
    const { props: f } = s;
    E();
    function E() {
      for (const y of c)
        u && h(y), s.allErrors ? v(y) : (t.var(l, !0), v(y), t.if(l));
    }
    function h(y) {
      for (const _ in u)
        new RegExp(y).test(_) && (0, Ts.checkStrictMode)(s, `property ${_} matches pattern ${y} (use allowMatchingProperties)`);
    }
    function v(y) {
      t.forIn("key", n, (_) => {
        t.if((0, cr._)`${(0, Os.usePattern)(e, y)}.test(${_})`, () => {
          const m = i.includes(y);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: y,
            dataProp: _,
            dataPropType: As.Type.Str
          }, l), s.opts.unevaluated && f !== !0 ? t.assign((0, cr._)`${f}[${_}]`, !0) : !m && !s.allErrors && t.if((0, cr.not)(l), () => t.break());
        });
      });
    }
  }
};
wa.default = Hf;
var ba = {};
Object.defineProperty(ba, "__esModule", { value: !0 });
const Kf = O, Xf = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, Kf.alwaysValidSchema)(n, r)) {
      e.fail();
      return;
    }
    const a = t.name("valid");
    e.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, a), e.failResult(a, () => e.reset(), () => e.error());
  },
  error: { message: "must NOT be valid" }
};
ba.default = Xf;
var Sa = {};
Object.defineProperty(Sa, "__esModule", { value: !0 });
const Wf = H, Bf = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: Wf.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
Sa.default = Bf;
var Pa = {};
Object.defineProperty(Pa, "__esModule", { value: !0 });
const _r = U, Jf = O, Yf = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, _r._)`{passingSchemas: ${e.passing}}`
}, Zf = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: Yf,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: a } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (a.opts.discriminator && n.discriminator)
      return;
    const s = r, o = t.let("valid", !1), c = t.let("passing", null), i = t.name("_valid");
    e.setParams({ passing: c }), t.block(u), e.result(o, () => e.reset(), () => e.error(!0));
    function u() {
      s.forEach((l, f) => {
        let E;
        (0, Jf.alwaysValidSchema)(a, l) ? t.var(i, !0) : E = e.subschema({
          keyword: "oneOf",
          schemaProp: f,
          compositeRule: !0
        }, i), f > 0 && t.if((0, _r._)`${i} && ${o}`).assign(o, !1).assign(c, (0, _r._)`[${c}, ${f}]`).else(), t.if(i, () => {
          t.assign(o, !0), t.assign(c, f), E && e.mergeEvaluated(E, _r.Name);
        });
      });
    }
  }
};
Pa.default = Zf;
var Ra = {};
Object.defineProperty(Ra, "__esModule", { value: !0 });
const Qf = O, ep = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const a = t.name("valid");
    r.forEach((s, o) => {
      if ((0, Qf.alwaysValidSchema)(n, s))
        return;
      const c = e.subschema({ keyword: "allOf", schemaProp: o }, a);
      e.ok(a), e.mergeEvaluated(c);
    });
  }
};
Ra.default = ep;
var Ia = {};
Object.defineProperty(Ia, "__esModule", { value: !0 });
const Ir = U, yi = O, tp = {
  message: ({ params: e }) => (0, Ir.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, Ir._)`{failingKeyword: ${e.ifClause}}`
}, rp = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: tp,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, yi.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const a = ks(n, "then"), s = ks(n, "else");
    if (!a && !s)
      return;
    const o = t.let("valid", !0), c = t.name("_valid");
    if (i(), e.reset(), a && s) {
      const l = t.let("ifClause");
      e.setParams({ ifClause: l }), t.if(c, u("then", l), u("else", l));
    } else a ? t.if(c, u("then")) : t.if((0, Ir.not)(c), u("else"));
    e.pass(o, () => e.error(!0));
    function i() {
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
        const E = e.subschema({ keyword: l }, c);
        t.assign(o, c), e.mergeValidEvaluated(E, o), f ? t.assign(f, (0, Ir._)`${l}`) : e.setParams({ ifClause: l });
      };
    }
  }
};
function ks(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, yi.alwaysValidSchema)(e, r);
}
Ia.default = rp;
var ja = {};
Object.defineProperty(ja, "__esModule", { value: !0 });
const np = O, ap = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, np.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
ja.default = ap;
Object.defineProperty(Dr, "__esModule", { value: !0 });
const sp = jt, op = ya, ip = Nt, cp = ga, lp = va, up = Lr, dp = _a, fp = Mr, pp = Ea, mp = wa, hp = ba, $p = Sa, yp = Pa, gp = Ra, vp = Ia, _p = ja;
function Ep(e = !1) {
  const t = [
    // any
    hp.default,
    $p.default,
    yp.default,
    gp.default,
    vp.default,
    _p.default,
    // object
    dp.default,
    fp.default,
    up.default,
    pp.default,
    mp.default
  ];
  return e ? t.push(op.default, cp.default) : t.push(sp.default, ip.default), t.push(lp.default), t;
}
Dr.default = Ep;
var Na = {}, Ot = {};
Object.defineProperty(Ot, "__esModule", { value: !0 });
Ot.dynamicAnchor = void 0;
const $n = U, wp = Ee, Cs = he, bp = Fe, Sp = {
  keyword: "$dynamicAnchor",
  schemaType: "string",
  code: (e) => gi(e, e.schema)
};
function gi(e, t) {
  const { gen: r, it: n } = e;
  n.schemaEnv.root.dynamicAnchors[t] = !0;
  const a = (0, $n._)`${wp.default.dynamicAnchors}${(0, $n.getProperty)(t)}`, s = n.errSchemaPath === "#" ? n.validateName : Pp(e);
  r.if((0, $n._)`!${a}`, () => r.assign(a, s));
}
Ot.dynamicAnchor = gi;
function Pp(e) {
  const { schemaEnv: t, schema: r, self: n } = e.it, { root: a, baseId: s, localRefs: o, meta: c } = t.root, { schemaId: i } = n.opts, u = new Cs.SchemaEnv({ schema: r, schemaId: i, root: a, baseId: s, localRefs: o, meta: c });
  return Cs.compileSchema.call(n, u), (0, bp.getValidate)(e, u);
}
Ot.default = Sp;
var Tt = {};
Object.defineProperty(Tt, "__esModule", { value: !0 });
Tt.dynamicRef = void 0;
const xs = U, Rp = Ee, Ds = Fe, Ip = {
  keyword: "$dynamicRef",
  schemaType: "string",
  code: (e) => vi(e, e.schema)
};
function vi(e, t) {
  const { gen: r, keyword: n, it: a } = e;
  if (t[0] !== "#")
    throw new Error(`"${n}" only supports hash fragment reference`);
  const s = t.slice(1);
  if (a.allErrors)
    o();
  else {
    const i = r.let("valid", !1);
    o(i), e.ok(i);
  }
  function o(i) {
    if (a.schemaEnv.root.dynamicAnchors[s]) {
      const u = r.let("_v", (0, xs._)`${Rp.default.dynamicAnchors}${(0, xs.getProperty)(s)}`);
      r.if(u, c(u, i), c(a.validateName, i));
    } else
      c(a.validateName, i)();
  }
  function c(i, u) {
    return u ? () => r.block(() => {
      (0, Ds.callRef)(e, i), r.let(u, !0);
    }) : () => (0, Ds.callRef)(e, i);
  }
}
Tt.dynamicRef = vi;
Tt.default = Ip;
var Oa = {};
Object.defineProperty(Oa, "__esModule", { value: !0 });
const jp = Ot, Np = O, Op = {
  keyword: "$recursiveAnchor",
  schemaType: "boolean",
  code(e) {
    e.schema ? (0, jp.dynamicAnchor)(e, "") : (0, Np.checkStrictMode)(e.it, "$recursiveAnchor: false is ignored");
  }
};
Oa.default = Op;
var Ta = {};
Object.defineProperty(Ta, "__esModule", { value: !0 });
const Tp = Tt, Ap = {
  keyword: "$recursiveRef",
  schemaType: "string",
  code: (e) => (0, Tp.dynamicRef)(e, e.schema)
};
Ta.default = Ap;
Object.defineProperty(Na, "__esModule", { value: !0 });
const kp = Ot, Cp = Tt, xp = Oa, Dp = Ta, Lp = [kp.default, Cp.default, xp.default, Dp.default];
Na.default = Lp;
var Aa = {}, ka = {};
Object.defineProperty(ka, "__esModule", { value: !0 });
const Ls = Lr, Mp = {
  keyword: "dependentRequired",
  type: "object",
  schemaType: "object",
  error: Ls.error,
  code: (e) => (0, Ls.validatePropertyDeps)(e)
};
ka.default = Mp;
var Ca = {};
Object.defineProperty(Ca, "__esModule", { value: !0 });
const zp = Lr, Vp = {
  keyword: "dependentSchemas",
  type: "object",
  schemaType: "object",
  code: (e) => (0, zp.validateSchemaDeps)(e)
};
Ca.default = Vp;
var xa = {};
Object.defineProperty(xa, "__esModule", { value: !0 });
const Up = O, Fp = {
  keyword: ["maxContains", "minContains"],
  type: "array",
  schemaType: "number",
  code({ keyword: e, parentSchema: t, it: r }) {
    t.contains === void 0 && (0, Up.checkStrictMode)(r, `"${e}" without "contains" is ignored`);
  }
};
xa.default = Fp;
Object.defineProperty(Aa, "__esModule", { value: !0 });
const qp = ka, Gp = Ca, Hp = xa, Kp = [qp.default, Gp.default, Hp.default];
Aa.default = Kp;
var Da = {}, La = {};
Object.defineProperty(La, "__esModule", { value: !0 });
const We = U, Ms = O, Xp = Ee, Wp = {
  message: "must NOT have unevaluated properties",
  params: ({ params: e }) => (0, We._)`{unevaluatedProperty: ${e.unevaluatedProperty}}`
}, Bp = {
  keyword: "unevaluatedProperties",
  type: "object",
  schemaType: ["boolean", "object"],
  trackErrors: !0,
  error: Wp,
  code(e) {
    const { gen: t, schema: r, data: n, errsCount: a, it: s } = e;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: o, props: c } = s;
    c instanceof We.Name ? t.if((0, We._)`${c} !== true`, () => t.forIn("key", n, (f) => t.if(u(c, f), () => i(f)))) : c !== !0 && t.forIn("key", n, (f) => c === void 0 ? i(f) : t.if(l(c, f), () => i(f))), s.props = !0, e.ok((0, We._)`${a} === ${Xp.default.errors}`);
    function i(f) {
      if (r === !1) {
        e.setParams({ unevaluatedProperty: f }), e.error(), o || t.break();
        return;
      }
      if (!(0, Ms.alwaysValidSchema)(s, r)) {
        const E = t.name("valid");
        e.subschema({
          keyword: "unevaluatedProperties",
          dataProp: f,
          dataPropType: Ms.Type.Str
        }, E), o || t.if((0, We.not)(E), () => t.break());
      }
    }
    function u(f, E) {
      return (0, We._)`!${f} || !${f}[${E}]`;
    }
    function l(f, E) {
      const h = [];
      for (const v in f)
        f[v] === !0 && h.push((0, We._)`${E} !== ${v}`);
      return (0, We.and)(...h);
    }
  }
};
La.default = Bp;
var Ma = {};
Object.defineProperty(Ma, "__esModule", { value: !0 });
const at = U, zs = O, Jp = {
  message: ({ params: { len: e } }) => (0, at.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, at._)`{limit: ${e}}`
}, Yp = {
  keyword: "unevaluatedItems",
  type: "array",
  schemaType: ["boolean", "object"],
  error: Jp,
  code(e) {
    const { gen: t, schema: r, data: n, it: a } = e, s = a.items || 0;
    if (s === !0)
      return;
    const o = t.const("len", (0, at._)`${n}.length`);
    if (r === !1)
      e.setParams({ len: s }), e.fail((0, at._)`${o} > ${s}`);
    else if (typeof r == "object" && !(0, zs.alwaysValidSchema)(a, r)) {
      const i = t.var("valid", (0, at._)`${o} <= ${s}`);
      t.if((0, at.not)(i), () => c(i, s)), e.ok(i);
    }
    a.items = !0;
    function c(i, u) {
      t.forRange("i", u, o, (l) => {
        e.subschema({ keyword: "unevaluatedItems", dataProp: l, dataPropType: zs.Type.Num }, i), a.allErrors || t.if((0, at.not)(i), () => t.break());
      });
    }
  }
};
Ma.default = Yp;
Object.defineProperty(Da, "__esModule", { value: !0 });
const Zp = La, Qp = Ma, em = [Zp.default, Qp.default];
Da.default = em;
var zr = {}, za = {};
Object.defineProperty(za, "__esModule", { value: !0 });
const re = U, tm = {
  message: ({ schemaCode: e }) => (0, re.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, re._)`{format: ${e}}`
}, rm = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: tm,
  code(e, t) {
    const { gen: r, data: n, $data: a, schema: s, schemaCode: o, it: c } = e, { opts: i, errSchemaPath: u, schemaEnv: l, self: f } = c;
    if (!i.validateFormats)
      return;
    a ? E() : h();
    function E() {
      const v = r.scopeValue("formats", {
        ref: f.formats,
        code: i.code.formats
      }), y = r.const("fDef", (0, re._)`${v}[${o}]`), _ = r.let("fType"), m = r.let("format");
      r.if((0, re._)`typeof ${y} == "object" && !(${y} instanceof RegExp)`, () => r.assign(_, (0, re._)`${y}.type || "string"`).assign(m, (0, re._)`${y}.validate`), () => r.assign(_, (0, re._)`"string"`).assign(m, y)), e.fail$data((0, re.or)(w(), R()));
      function w() {
        return i.strictSchema === !1 ? re.nil : (0, re._)`${o} && !${m}`;
      }
      function R() {
        const N = l.$async ? (0, re._)`(${y}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, re._)`${m}(${n})`, T = (0, re._)`(typeof ${m} == "function" ? ${N} : ${m}.test(${n}))`;
        return (0, re._)`${m} && ${m} !== true && ${_} === ${t} && !${T}`;
      }
    }
    function h() {
      const v = f.formats[s];
      if (!v) {
        w();
        return;
      }
      if (v === !0)
        return;
      const [y, _, m] = R(v);
      y === t && e.pass(N());
      function w() {
        if (i.strictSchema === !1) {
          f.logger.warn(T());
          return;
        }
        throw new Error(T());
        function T() {
          return `unknown format "${s}" ignored in schema at path "${u}"`;
        }
      }
      function R(T) {
        const W = T instanceof RegExp ? (0, re.regexpCode)(T) : i.code.formats ? (0, re._)`${i.code.formats}${(0, re.getProperty)(s)}` : void 0, te = r.scopeValue("formats", { key: s, ref: T, code: W });
        return typeof T == "object" && !(T instanceof RegExp) ? [T.type || "string", T.validate, (0, re._)`${te}.validate`] : ["string", T, te];
      }
      function N() {
        if (typeof v == "object" && !(v instanceof RegExp) && v.async) {
          if (!l.$async)
            throw new Error("async format in sync schema");
          return (0, re._)`await ${m}(${n})`;
        }
        return typeof _ == "function" ? (0, re._)`${m}(${n})` : (0, re._)`${m}.test(${n})`;
      }
    }
  }
};
za.default = rm;
Object.defineProperty(zr, "__esModule", { value: !0 });
const nm = za, am = [nm.default];
zr.default = am;
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
Object.defineProperty(aa, "__esModule", { value: !0 });
const sm = Cr, om = xr, im = Dr, cm = Na, lm = Aa, um = Da, dm = zr, Vs = lt, fm = [
  cm.default,
  sm.default,
  om.default,
  (0, im.default)(!0),
  dm.default,
  Vs.metadataVocabulary,
  Vs.contentVocabulary,
  lm.default,
  um.default
];
aa.default = fm;
var Vr = {}, Ur = {};
Object.defineProperty(Ur, "__esModule", { value: !0 });
Ur.DiscrError = void 0;
var Us;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(Us || (Ur.DiscrError = Us = {}));
Object.defineProperty(Vr, "__esModule", { value: !0 });
const yt = U, An = Ur, Fs = he, pm = ut, mm = O, hm = {
  message: ({ params: { discrError: e, tagName: t } }) => e === An.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, yt._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, $m = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: hm,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: a, it: s } = e, { oneOf: o } = a;
    if (!s.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const c = n.propertyName;
    if (typeof c != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!o)
      throw new Error("discriminator: requires oneOf keyword");
    const i = t.let("valid", !1), u = t.const("tag", (0, yt._)`${r}${(0, yt.getProperty)(c)}`);
    t.if((0, yt._)`typeof ${u} == "string"`, () => l(), () => e.error(!1, { discrError: An.DiscrError.Tag, tag: u, tagName: c })), e.ok(i);
    function l() {
      const h = E();
      t.if(!1);
      for (const v in h)
        t.elseIf((0, yt._)`${u} === ${v}`), t.assign(i, f(h[v]));
      t.else(), e.error(!1, { discrError: An.DiscrError.Mapping, tag: u, tagName: c }), t.endIf();
    }
    function f(h) {
      const v = t.name("valid"), y = e.subschema({ keyword: "oneOf", schemaProp: h }, v);
      return e.mergeEvaluated(y, yt.Name), v;
    }
    function E() {
      var h;
      const v = {}, y = m(a);
      let _ = !0;
      for (let N = 0; N < o.length; N++) {
        let T = o[N];
        if (T != null && T.$ref && !(0, mm.schemaHasRulesButRef)(T, s.self.RULES)) {
          const te = T.$ref;
          if (T = Fs.resolveRef.call(s.self, s.schemaEnv.root, s.baseId, te), T instanceof Fs.SchemaEnv && (T = T.schema), T === void 0)
            throw new pm.default(s.opts.uriResolver, s.baseId, te);
        }
        const W = (h = T == null ? void 0 : T.properties) === null || h === void 0 ? void 0 : h[c];
        if (typeof W != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${c}"`);
        _ = _ && (y || m(T)), w(W, N);
      }
      if (!_)
        throw new Error(`discriminator: "${c}" must be required`);
      return v;
      function m({ required: N }) {
        return Array.isArray(N) && N.includes(c);
      }
      function w(N, T) {
        if (N.const)
          R(N.const, T);
        else if (N.enum)
          for (const W of N.enum)
            R(W, T);
        else
          throw new Error(`discriminator: "properties/${c}" must have "const" or "enum"`);
      }
      function R(N, T) {
        if (typeof N != "string" || N in v)
          throw new Error(`discriminator: "${c}" values must be unique strings`);
        v[N] = T;
      }
    }
  }
};
Vr.default = $m;
var Va = {};
const ym = "https://json-schema.org/draft/2020-12/schema", gm = "https://json-schema.org/draft/2020-12/schema", vm = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0,
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0,
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0,
  "https://json-schema.org/draft/2020-12/vocab/validation": !0,
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0,
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0,
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, _m = "meta", Em = "Core and Validation specifications meta-schema", wm = [
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
], bm = [
  "object",
  "boolean"
], Sm = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", Pm = {
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
}, Rm = {
  $schema: ym,
  $id: gm,
  $vocabulary: vm,
  $dynamicAnchor: _m,
  title: Em,
  allOf: wm,
  type: bm,
  $comment: Sm,
  properties: Pm
}, Im = "https://json-schema.org/draft/2020-12/schema", jm = "https://json-schema.org/draft/2020-12/meta/applicator", Nm = {
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0
}, Om = "meta", Tm = "Applicator vocabulary meta-schema", Am = [
  "object",
  "boolean"
], km = {
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
}, Cm = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $dynamicRef: "#meta"
    }
  }
}, xm = {
  $schema: Im,
  $id: jm,
  $vocabulary: Nm,
  $dynamicAnchor: Om,
  title: Tm,
  type: Am,
  properties: km,
  $defs: Cm
}, Dm = "https://json-schema.org/draft/2020-12/schema", Lm = "https://json-schema.org/draft/2020-12/meta/unevaluated", Mm = {
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0
}, zm = "meta", Vm = "Unevaluated applicator vocabulary meta-schema", Um = [
  "object",
  "boolean"
], Fm = {
  unevaluatedItems: {
    $dynamicRef: "#meta"
  },
  unevaluatedProperties: {
    $dynamicRef: "#meta"
  }
}, qm = {
  $schema: Dm,
  $id: Lm,
  $vocabulary: Mm,
  $dynamicAnchor: zm,
  title: Vm,
  type: Um,
  properties: Fm
}, Gm = "https://json-schema.org/draft/2020-12/schema", Hm = "https://json-schema.org/draft/2020-12/meta/content", Km = {
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, Xm = "meta", Wm = "Content vocabulary meta-schema", Bm = [
  "object",
  "boolean"
], Jm = {
  contentEncoding: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentSchema: {
    $dynamicRef: "#meta"
  }
}, Ym = {
  $schema: Gm,
  $id: Hm,
  $vocabulary: Km,
  $dynamicAnchor: Xm,
  title: Wm,
  type: Bm,
  properties: Jm
}, Zm = "https://json-schema.org/draft/2020-12/schema", Qm = "https://json-schema.org/draft/2020-12/meta/core", eh = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0
}, th = "meta", rh = "Core vocabulary meta-schema", nh = [
  "object",
  "boolean"
], ah = {
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
}, sh = {
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
}, oh = {
  $schema: Zm,
  $id: Qm,
  $vocabulary: eh,
  $dynamicAnchor: th,
  title: rh,
  type: nh,
  properties: ah,
  $defs: sh
}, ih = "https://json-schema.org/draft/2020-12/schema", ch = "https://json-schema.org/draft/2020-12/meta/format-annotation", lh = {
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0
}, uh = "meta", dh = "Format vocabulary meta-schema for annotation results", fh = [
  "object",
  "boolean"
], ph = {
  format: {
    type: "string"
  }
}, mh = {
  $schema: ih,
  $id: ch,
  $vocabulary: lh,
  $dynamicAnchor: uh,
  title: dh,
  type: fh,
  properties: ph
}, hh = "https://json-schema.org/draft/2020-12/schema", $h = "https://json-schema.org/draft/2020-12/meta/meta-data", yh = {
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0
}, gh = "meta", vh = "Meta-data vocabulary meta-schema", _h = [
  "object",
  "boolean"
], Eh = {
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
}, wh = {
  $schema: hh,
  $id: $h,
  $vocabulary: yh,
  $dynamicAnchor: gh,
  title: vh,
  type: _h,
  properties: Eh
}, bh = "https://json-schema.org/draft/2020-12/schema", Sh = "https://json-schema.org/draft/2020-12/meta/validation", Ph = {
  "https://json-schema.org/draft/2020-12/vocab/validation": !0
}, Rh = "meta", Ih = "Validation vocabulary meta-schema", jh = [
  "object",
  "boolean"
], Nh = {
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
}, Oh = {
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
}, Th = {
  $schema: bh,
  $id: Sh,
  $vocabulary: Ph,
  $dynamicAnchor: Rh,
  title: Ih,
  type: jh,
  properties: Nh,
  $defs: Oh
};
Object.defineProperty(Va, "__esModule", { value: !0 });
const Ah = Rm, kh = xm, Ch = qm, xh = Ym, Dh = oh, Lh = mh, Mh = wh, zh = Th, Vh = ["/properties"];
function Uh(e) {
  return [
    Ah,
    kh,
    Ch,
    xh,
    Dh,
    t(this, Lh),
    Mh,
    t(this, zh)
  ].forEach((r) => this.addMetaSchema(r, void 0, !1)), this;
  function t(r, n) {
    return e ? r.$dataMetaSchema(n, Vh) : n;
  }
}
Va.default = Uh;
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv2020 = void 0;
  const r = qn, n = aa, a = Vr, s = Va, o = "https://json-schema.org/draft/2020-12/schema";
  class c extends r.default {
    constructor(h = {}) {
      super({
        ...h,
        dynamicRef: !0,
        next: !0,
        unevaluated: !0
      });
    }
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((h) => this.addVocabulary(h)), this.opts.discriminator && this.addKeyword(a.default);
    }
    _addDefaultMetaSchema() {
      super._addDefaultMetaSchema();
      const { $data: h, meta: v } = this.opts;
      v && (s.default.call(this, h), this.refs["http://json-schema.org/schema"] = o);
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(o) ? o : void 0);
    }
  }
  t.Ajv2020 = c, e.exports = t = c, e.exports.Ajv2020 = c, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = c;
  var i = Se;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return i.KeywordCxt;
  } });
  var u = U;
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
  var l = It;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return l.default;
  } });
  var f = ut;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return f.default;
  } });
})(Pn, Pn.exports);
var Fh = Pn.exports, kn = { exports: {} }, _i = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
  function t(z, F) {
    return { validate: z, compare: F };
  }
  e.fullFormats = {
    // date: http://tools.ietf.org/html/rfc3339#section-5.6
    date: t(s, o),
    // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
    time: t(i(!0), u),
    "date-time": t(E(!0), h),
    "iso-time": t(i(), l),
    "iso-date-time": t(E(), v),
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
    int32: { type: "number", validate: W },
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
    "date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, h),
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
  const n = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, a = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function s(z) {
    const F = n.exec(z);
    if (!F)
      return !1;
    const Y = +F[1], I = +F[2], j = +F[3];
    return I >= 1 && I <= 12 && j >= 1 && j <= (I === 2 && r(Y) ? 29 : a[I]);
  }
  function o(z, F) {
    if (z && F)
      return z > F ? 1 : z < F ? -1 : 0;
  }
  const c = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
  function i(z) {
    return function(Y) {
      const I = c.exec(Y);
      if (!I)
        return !1;
      const j = +I[1], C = +I[2], A = +I[3], M = I[4], k = I[5] === "-" ? -1 : 1, P = +(I[6] || 0), $ = +(I[7] || 0);
      if (P > 23 || $ > 59 || z && !M)
        return !1;
      if (j <= 23 && C <= 59 && A < 60)
        return !0;
      const b = C - $ * k, g = j - P * k - (b < 0 ? 1 : 0);
      return (g === 23 || g === -1) && (b === 59 || b === -1) && A < 61;
    };
  }
  function u(z, F) {
    if (!(z && F))
      return;
    const Y = (/* @__PURE__ */ new Date("2020-01-01T" + z)).valueOf(), I = (/* @__PURE__ */ new Date("2020-01-01T" + F)).valueOf();
    if (Y && I)
      return Y - I;
  }
  function l(z, F) {
    if (!(z && F))
      return;
    const Y = c.exec(z), I = c.exec(F);
    if (Y && I)
      return z = Y[1] + Y[2] + Y[3], F = I[1] + I[2] + I[3], z > F ? 1 : z < F ? -1 : 0;
  }
  const f = /t|\s/i;
  function E(z) {
    const F = i(z);
    return function(I) {
      const j = I.split(f);
      return j.length === 2 && s(j[0]) && F(j[1]);
    };
  }
  function h(z, F) {
    if (!(z && F))
      return;
    const Y = new Date(z).valueOf(), I = new Date(F).valueOf();
    if (Y && I)
      return Y - I;
  }
  function v(z, F) {
    if (!(z && F))
      return;
    const [Y, I] = z.split(f), [j, C] = F.split(f), A = o(Y, j);
    if (A !== void 0)
      return A || u(I, C);
  }
  const y = /\/|:/, _ = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  function m(z) {
    return y.test(z) && _.test(z);
  }
  const w = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
  function R(z) {
    return w.lastIndex = 0, w.test(z);
  }
  const N = -2147483648, T = 2 ** 31 - 1;
  function W(z) {
    return Number.isInteger(z) && z <= T && z >= N;
  }
  function te(z) {
    return Number.isInteger(z);
  }
  function ye() {
    return !0;
  }
  const we = /[^\\]\\Z/;
  function Pe(z) {
    if (we.test(z))
      return !1;
    try {
      return new RegExp(z), !0;
    } catch {
      return !1;
    }
  }
})(_i);
var Ei = {}, Cn = { exports: {} }, Ua = {};
Object.defineProperty(Ua, "__esModule", { value: !0 });
const qh = Cr, Gh = xr, Hh = Dr, Kh = zr, qs = lt, Xh = [
  qh.default,
  Gh.default,
  (0, Hh.default)(),
  Kh.default,
  qs.metadataVocabulary,
  qs.contentVocabulary
];
Ua.default = Xh;
const Wh = "http://json-schema.org/draft-07/schema#", Bh = "http://json-schema.org/draft-07/schema#", Jh = "Core schema meta-schema", Yh = {
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
}, Zh = [
  "object",
  "boolean"
], Qh = {
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
}, e$ = {
  $schema: Wh,
  $id: Bh,
  title: Jh,
  definitions: Yh,
  type: Zh,
  properties: Qh,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
  const r = qn, n = Ua, a = Vr, s = e$, o = ["/properties"], c = "http://json-schema.org/draft-07/schema";
  class i extends r.default {
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((v) => this.addVocabulary(v)), this.opts.discriminator && this.addKeyword(a.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const v = this.opts.$data ? this.$dataMetaSchema(s, o) : s;
      this.addMetaSchema(v, c, !1), this.refs["http://json-schema.org/schema"] = c;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(c) ? c : void 0);
    }
  }
  t.Ajv = i, e.exports = t = i, e.exports.Ajv = i, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = i;
  var u = Se;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return u.KeywordCxt;
  } });
  var l = U;
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
  var f = It;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return f.default;
  } });
  var E = ut;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return E.default;
  } });
})(Cn, Cn.exports);
var t$ = Cn.exports;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
  const t = t$, r = U, n = r.operators, a = {
    formatMaximum: { okStr: "<=", ok: n.LTE, fail: n.GT },
    formatMinimum: { okStr: ">=", ok: n.GTE, fail: n.LT },
    formatExclusiveMaximum: { okStr: "<", ok: n.LT, fail: n.GTE },
    formatExclusiveMinimum: { okStr: ">", ok: n.GT, fail: n.LTE }
  }, s = {
    message: ({ keyword: c, schemaCode: i }) => (0, r.str)`should be ${a[c].okStr} ${i}`,
    params: ({ keyword: c, schemaCode: i }) => (0, r._)`{comparison: ${a[c].okStr}, limit: ${i}}`
  };
  e.formatLimitDefinition = {
    keyword: Object.keys(a),
    type: "string",
    schemaType: "string",
    $data: !0,
    error: s,
    code(c) {
      const { gen: i, data: u, schemaCode: l, keyword: f, it: E } = c, { opts: h, self: v } = E;
      if (!h.validateFormats)
        return;
      const y = new t.KeywordCxt(E, v.RULES.all.format.definition, "format");
      y.$data ? _() : m();
      function _() {
        const R = i.scopeValue("formats", {
          ref: v.formats,
          code: h.code.formats
        }), N = i.const("fmt", (0, r._)`${R}[${y.schemaCode}]`);
        c.fail$data((0, r.or)((0, r._)`typeof ${N} != "object"`, (0, r._)`${N} instanceof RegExp`, (0, r._)`typeof ${N}.compare != "function"`, w(N)));
      }
      function m() {
        const R = y.schema, N = v.formats[R];
        if (!N || N === !0)
          return;
        if (typeof N != "object" || N instanceof RegExp || typeof N.compare != "function")
          throw new Error(`"${f}": format "${R}" does not define "compare" function`);
        const T = i.scopeValue("formats", {
          key: R,
          ref: N,
          code: h.code.formats ? (0, r._)`${h.code.formats}${(0, r.getProperty)(R)}` : void 0
        });
        c.fail$data(w(T));
      }
      function w(R) {
        return (0, r._)`${R}.compare(${u}, ${l}) ${a[f].fail} 0`;
      }
    },
    dependencies: ["format"]
  };
  const o = (c) => (c.addKeyword(e.formatLimitDefinition), c);
  e.default = o;
})(Ei);
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 });
  const r = _i, n = Ei, a = U, s = new a.Name("fullFormats"), o = new a.Name("fastFormats"), c = (u, l = { keywords: !0 }) => {
    if (Array.isArray(l))
      return i(u, l, r.fullFormats, s), u;
    const [f, E] = l.mode === "fast" ? [r.fastFormats, o] : [r.fullFormats, s], h = l.formats || r.formatNames;
    return i(u, h, f, E), l.keywords && (0, n.default)(u), u;
  };
  c.get = (u, l = "full") => {
    const E = (l === "fast" ? r.fastFormats : r.fullFormats)[u];
    if (!E)
      throw new Error(`Unknown format "${u}"`);
    return E;
  };
  function i(u, l, f, E) {
    var h, v;
    (h = (v = u.opts.code).formats) !== null && h !== void 0 || (v.formats = (0, a._)`require("ajv-formats/dist/formats").${E}`);
    for (const y of l)
      u.addFormat(y, f[y]);
  }
  e.exports = t = c, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = c;
})(kn, kn.exports);
var r$ = kn.exports;
const n$ = /* @__PURE__ */ go(r$), a$ = (e, t, r, n) => {
  if (r === "length" || r === "prototype" || r === "arguments" || r === "caller")
    return;
  const a = Object.getOwnPropertyDescriptor(e, r), s = Object.getOwnPropertyDescriptor(t, r);
  !s$(a, s) && n || Object.defineProperty(e, r, s);
}, s$ = function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value);
}, o$ = (e, t) => {
  const r = Object.getPrototypeOf(t);
  r !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, r);
}, i$ = (e, t) => `/* Wrapped ${e}*/
${t}`, c$ = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), l$ = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), u$ = (e, t, r) => {
  const n = r === "" ? "" : `with ${r.trim()}() `, a = i$.bind(null, n, t.toString());
  Object.defineProperty(a, "name", l$);
  const { writable: s, enumerable: o, configurable: c } = c$;
  Object.defineProperty(e, "toString", { value: a, writable: s, enumerable: o, configurable: c });
};
function d$(e, t, { ignoreNonConfigurable: r = !1 } = {}) {
  const { name: n } = e;
  for (const a of Reflect.ownKeys(t))
    a$(e, t, a, r);
  return o$(e, t), u$(e, t, n), e;
}
const Gs = (e, t = {}) => {
  if (typeof e != "function")
    throw new TypeError(`Expected the first argument to be a function, got \`${typeof e}\``);
  const {
    wait: r = 0,
    maxWait: n = Number.POSITIVE_INFINITY,
    before: a = !1,
    after: s = !0
  } = t;
  if (r < 0 || n < 0)
    throw new RangeError("`wait` and `maxWait` must not be negative.");
  if (!a && !s)
    throw new Error("Both `before` and `after` are false, function wouldn't be called.");
  let o, c, i;
  const u = function(...l) {
    const f = this, E = () => {
      o = void 0, c && (clearTimeout(c), c = void 0), s && (i = e.apply(f, l));
    }, h = () => {
      c = void 0, o && (clearTimeout(o), o = void 0), s && (i = e.apply(f, l));
    }, v = a && !o;
    return clearTimeout(o), o = setTimeout(E, r), n > 0 && n !== Number.POSITIVE_INFINITY && !c && (c = setTimeout(h, n)), v && (i = e.apply(f, l)), i;
  };
  return d$(u, e), u.cancel = () => {
    o && (clearTimeout(o), o = void 0), c && (clearTimeout(c), c = void 0);
  }, u;
};
var xn = { exports: {} };
const f$ = "2.0.0", wi = 256, p$ = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, m$ = 16, h$ = wi - 6, $$ = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var Fr = {
  MAX_LENGTH: wi,
  MAX_SAFE_COMPONENT_LENGTH: m$,
  MAX_SAFE_BUILD_LENGTH: h$,
  MAX_SAFE_INTEGER: p$,
  RELEASE_TYPES: $$,
  SEMVER_SPEC_VERSION: f$,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const y$ = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var qr = y$;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: a
  } = Fr, s = qr;
  t = e.exports = {};
  const o = t.re = [], c = t.safeRe = [], i = t.src = [], u = t.safeSrc = [], l = t.t = {};
  let f = 0;
  const E = "[a-zA-Z0-9-]", h = [
    ["\\s", 1],
    ["\\d", a],
    [E, n]
  ], v = (_) => {
    for (const [m, w] of h)
      _ = _.split(`${m}*`).join(`${m}{0,${w}}`).split(`${m}+`).join(`${m}{1,${w}}`);
    return _;
  }, y = (_, m, w) => {
    const R = v(m), N = f++;
    s(_, N, m), l[_] = N, i[N] = m, u[N] = R, o[N] = new RegExp(m, w ? "g" : void 0), c[N] = new RegExp(R, w ? "g" : void 0);
  };
  y("NUMERICIDENTIFIER", "0|[1-9]\\d*"), y("NUMERICIDENTIFIERLOOSE", "\\d+"), y("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${E}*`), y("MAINVERSION", `(${i[l.NUMERICIDENTIFIER]})\\.(${i[l.NUMERICIDENTIFIER]})\\.(${i[l.NUMERICIDENTIFIER]})`), y("MAINVERSIONLOOSE", `(${i[l.NUMERICIDENTIFIERLOOSE]})\\.(${i[l.NUMERICIDENTIFIERLOOSE]})\\.(${i[l.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASEIDENTIFIER", `(?:${i[l.NONNUMERICIDENTIFIER]}|${i[l.NUMERICIDENTIFIER]})`), y("PRERELEASEIDENTIFIERLOOSE", `(?:${i[l.NONNUMERICIDENTIFIER]}|${i[l.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASE", `(?:-(${i[l.PRERELEASEIDENTIFIER]}(?:\\.${i[l.PRERELEASEIDENTIFIER]})*))`), y("PRERELEASELOOSE", `(?:-?(${i[l.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${i[l.PRERELEASEIDENTIFIERLOOSE]})*))`), y("BUILDIDENTIFIER", `${E}+`), y("BUILD", `(?:\\+(${i[l.BUILDIDENTIFIER]}(?:\\.${i[l.BUILDIDENTIFIER]})*))`), y("FULLPLAIN", `v?${i[l.MAINVERSION]}${i[l.PRERELEASE]}?${i[l.BUILD]}?`), y("FULL", `^${i[l.FULLPLAIN]}$`), y("LOOSEPLAIN", `[v=\\s]*${i[l.MAINVERSIONLOOSE]}${i[l.PRERELEASELOOSE]}?${i[l.BUILD]}?`), y("LOOSE", `^${i[l.LOOSEPLAIN]}$`), y("GTLT", "((?:<|>)?=?)"), y("XRANGEIDENTIFIERLOOSE", `${i[l.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), y("XRANGEIDENTIFIER", `${i[l.NUMERICIDENTIFIER]}|x|X|\\*`), y("XRANGEPLAIN", `[v=\\s]*(${i[l.XRANGEIDENTIFIER]})(?:\\.(${i[l.XRANGEIDENTIFIER]})(?:\\.(${i[l.XRANGEIDENTIFIER]})(?:${i[l.PRERELEASE]})?${i[l.BUILD]}?)?)?`), y("XRANGEPLAINLOOSE", `[v=\\s]*(${i[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${i[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${i[l.XRANGEIDENTIFIERLOOSE]})(?:${i[l.PRERELEASELOOSE]})?${i[l.BUILD]}?)?)?`), y("XRANGE", `^${i[l.GTLT]}\\s*${i[l.XRANGEPLAIN]}$`), y("XRANGELOOSE", `^${i[l.GTLT]}\\s*${i[l.XRANGEPLAINLOOSE]}$`), y("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), y("COERCE", `${i[l.COERCEPLAIN]}(?:$|[^\\d])`), y("COERCEFULL", i[l.COERCEPLAIN] + `(?:${i[l.PRERELEASE]})?(?:${i[l.BUILD]})?(?:$|[^\\d])`), y("COERCERTL", i[l.COERCE], !0), y("COERCERTLFULL", i[l.COERCEFULL], !0), y("LONETILDE", "(?:~>?)"), y("TILDETRIM", `(\\s*)${i[l.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", y("TILDE", `^${i[l.LONETILDE]}${i[l.XRANGEPLAIN]}$`), y("TILDELOOSE", `^${i[l.LONETILDE]}${i[l.XRANGEPLAINLOOSE]}$`), y("LONECARET", "(?:\\^)"), y("CARETTRIM", `(\\s*)${i[l.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", y("CARET", `^${i[l.LONECARET]}${i[l.XRANGEPLAIN]}$`), y("CARETLOOSE", `^${i[l.LONECARET]}${i[l.XRANGEPLAINLOOSE]}$`), y("COMPARATORLOOSE", `^${i[l.GTLT]}\\s*(${i[l.LOOSEPLAIN]})$|^$`), y("COMPARATOR", `^${i[l.GTLT]}\\s*(${i[l.FULLPLAIN]})$|^$`), y("COMPARATORTRIM", `(\\s*)${i[l.GTLT]}\\s*(${i[l.LOOSEPLAIN]}|${i[l.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", y("HYPHENRANGE", `^\\s*(${i[l.XRANGEPLAIN]})\\s+-\\s+(${i[l.XRANGEPLAIN]})\\s*$`), y("HYPHENRANGELOOSE", `^\\s*(${i[l.XRANGEPLAINLOOSE]})\\s+-\\s+(${i[l.XRANGEPLAINLOOSE]})\\s*$`), y("STAR", "(<|>)?=?\\s*\\*"), y("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), y("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(xn, xn.exports);
var tr = xn.exports;
const g$ = Object.freeze({ loose: !0 }), v$ = Object.freeze({}), _$ = (e) => e ? typeof e != "object" ? g$ : e : v$;
var Fa = _$;
const Hs = /^[0-9]+$/, bi = (e, t) => {
  const r = Hs.test(e), n = Hs.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, E$ = (e, t) => bi(t, e);
var Si = {
  compareIdentifiers: bi,
  rcompareIdentifiers: E$
};
const lr = qr, { MAX_LENGTH: Ks, MAX_SAFE_INTEGER: ur } = Fr, { safeRe: dr, t: fr } = tr, w$ = Fa, { compareIdentifiers: mt } = Si;
let b$ = class Ae {
  constructor(t, r) {
    if (r = w$(r), t instanceof Ae) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > Ks)
      throw new TypeError(
        `version is longer than ${Ks} characters`
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
    n[4] ? this.prerelease = n[4].split(".").map((a) => {
      if (/^[0-9]+$/.test(a)) {
        const s = +a;
        if (s >= 0 && s < ur)
          return s;
      }
      return a;
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
      const n = this.prerelease[r], a = t.prerelease[r];
      if (lr("prerelease compare", r, n, a), n === void 0 && a === void 0)
        return 0;
      if (a === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === a)
        continue;
      return mt(n, a);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof Ae || (t = new Ae(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], a = t.build[r];
      if (lr("build compare", r, n, a), n === void 0 && a === void 0)
        return 0;
      if (a === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === a)
        continue;
      return mt(n, a);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const a = `-${r}`.match(this.options.loose ? dr[fr.PRERELEASELOOSE] : dr[fr.PRERELEASE]);
        if (!a || a[1] !== r)
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
        const a = Number(n) ? 1 : 0;
        if (this.prerelease.length === 0)
          this.prerelease = [a];
        else {
          let s = this.prerelease.length;
          for (; --s >= 0; )
            typeof this.prerelease[s] == "number" && (this.prerelease[s]++, s = -2);
          if (s === -1) {
            if (r === this.prerelease.join(".") && n === !1)
              throw new Error("invalid increment argument: identifier already exists");
            this.prerelease.push(a);
          }
        }
        if (r) {
          let s = [r, a];
          n === !1 && (s = [r]), mt(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = s) : this.prerelease = s;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var $e = b$;
const Xs = $e, S$ = (e, t, r = !1) => {
  if (e instanceof Xs)
    return e;
  try {
    return new Xs(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var At = S$;
const P$ = At, R$ = (e, t) => {
  const r = P$(e, t);
  return r ? r.version : null;
};
var I$ = R$;
const j$ = At, N$ = (e, t) => {
  const r = j$(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var O$ = N$;
const Ws = $e, T$ = (e, t, r, n, a) => {
  typeof r == "string" && (a = n, n = r, r = void 0);
  try {
    return new Ws(
      e instanceof Ws ? e.version : e,
      r
    ).inc(t, n, a).version;
  } catch {
    return null;
  }
};
var A$ = T$;
const Bs = At, k$ = (e, t) => {
  const r = Bs(e, null, !0), n = Bs(t, null, !0), a = r.compare(n);
  if (a === 0)
    return null;
  const s = a > 0, o = s ? r : n, c = s ? n : r, i = !!o.prerelease.length;
  if (!!c.prerelease.length && !i) {
    if (!c.patch && !c.minor)
      return "major";
    if (c.compareMain(o) === 0)
      return c.minor && !c.patch ? "minor" : "patch";
  }
  const l = i ? "pre" : "";
  return r.major !== n.major ? l + "major" : r.minor !== n.minor ? l + "minor" : r.patch !== n.patch ? l + "patch" : "prerelease";
};
var C$ = k$;
const x$ = $e, D$ = (e, t) => new x$(e, t).major;
var L$ = D$;
const M$ = $e, z$ = (e, t) => new M$(e, t).minor;
var V$ = z$;
const U$ = $e, F$ = (e, t) => new U$(e, t).patch;
var q$ = F$;
const G$ = At, H$ = (e, t) => {
  const r = G$(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var K$ = H$;
const Js = $e, X$ = (e, t, r) => new Js(e, r).compare(new Js(t, r));
var Oe = X$;
const W$ = Oe, B$ = (e, t, r) => W$(t, e, r);
var J$ = B$;
const Y$ = Oe, Z$ = (e, t) => Y$(e, t, !0);
var Q$ = Z$;
const Ys = $e, ey = (e, t, r) => {
  const n = new Ys(e, r), a = new Ys(t, r);
  return n.compare(a) || n.compareBuild(a);
};
var qa = ey;
const ty = qa, ry = (e, t) => e.sort((r, n) => ty(r, n, t));
var ny = ry;
const ay = qa, sy = (e, t) => e.sort((r, n) => ay(n, r, t));
var oy = sy;
const iy = Oe, cy = (e, t, r) => iy(e, t, r) > 0;
var Gr = cy;
const ly = Oe, uy = (e, t, r) => ly(e, t, r) < 0;
var Ga = uy;
const dy = Oe, fy = (e, t, r) => dy(e, t, r) === 0;
var Pi = fy;
const py = Oe, my = (e, t, r) => py(e, t, r) !== 0;
var Ri = my;
const hy = Oe, $y = (e, t, r) => hy(e, t, r) >= 0;
var Ha = $y;
const yy = Oe, gy = (e, t, r) => yy(e, t, r) <= 0;
var Ka = gy;
const vy = Pi, _y = Ri, Ey = Gr, wy = Ha, by = Ga, Sy = Ka, Py = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return vy(e, r, n);
    case "!=":
      return _y(e, r, n);
    case ">":
      return Ey(e, r, n);
    case ">=":
      return wy(e, r, n);
    case "<":
      return by(e, r, n);
    case "<=":
      return Sy(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var Ii = Py;
const Ry = $e, Iy = At, { safeRe: pr, t: mr } = tr, jy = (e, t) => {
  if (e instanceof Ry)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? pr[mr.COERCEFULL] : pr[mr.COERCE]);
  else {
    const i = t.includePrerelease ? pr[mr.COERCERTLFULL] : pr[mr.COERCERTL];
    let u;
    for (; (u = i.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || u.index + u[0].length !== r.index + r[0].length) && (r = u), i.lastIndex = u.index + u[1].length + u[2].length;
    i.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], a = r[3] || "0", s = r[4] || "0", o = t.includePrerelease && r[5] ? `-${r[5]}` : "", c = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return Iy(`${n}.${a}.${s}${o}${c}`, t);
};
var Ny = jy;
class Oy {
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
        const a = this.map.keys().next().value;
        this.delete(a);
      }
      this.map.set(t, r);
    }
    return this;
  }
}
var Ty = Oy, yn, Zs;
function Te() {
  if (Zs) return yn;
  Zs = 1;
  const e = /\s+/g;
  class t {
    constructor(j, C) {
      if (C = a(C), j instanceof t)
        return j.loose === !!C.loose && j.includePrerelease === !!C.includePrerelease ? j : new t(j.raw, C);
      if (j instanceof s)
        return this.raw = j.value, this.set = [[j]], this.formatted = void 0, this;
      if (this.options = C, this.loose = !!C.loose, this.includePrerelease = !!C.includePrerelease, this.raw = j.trim().replace(e, " "), this.set = this.raw.split("||").map((A) => this.parseRange(A.trim())).filter((A) => A.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const A = this.set[0];
        if (this.set = this.set.filter((M) => !y(M[0])), this.set.length === 0)
          this.set = [A];
        else if (this.set.length > 1) {
          for (const M of this.set)
            if (M.length === 1 && _(M[0])) {
              this.set = [M];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let j = 0; j < this.set.length; j++) {
          j > 0 && (this.formatted += "||");
          const C = this.set[j];
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
    parseRange(j) {
      const A = ((this.options.includePrerelease && h) | (this.options.loose && v)) + ":" + j, M = n.get(A);
      if (M)
        return M;
      const k = this.options.loose, P = k ? i[u.HYPHENRANGELOOSE] : i[u.HYPHENRANGE];
      j = j.replace(P, F(this.options.includePrerelease)), o("hyphen replace", j), j = j.replace(i[u.COMPARATORTRIM], l), o("comparator trim", j), j = j.replace(i[u.TILDETRIM], f), o("tilde trim", j), j = j.replace(i[u.CARETTRIM], E), o("caret trim", j);
      let $ = j.split(" ").map((p) => w(p, this.options)).join(" ").split(/\s+/).map((p) => z(p, this.options));
      k && ($ = $.filter((p) => (o("loose invalid filter", p, this.options), !!p.match(i[u.COMPARATORLOOSE])))), o("range list", $);
      const b = /* @__PURE__ */ new Map(), g = $.map((p) => new s(p, this.options));
      for (const p of g) {
        if (y(p))
          return [p];
        b.set(p.value, p);
      }
      b.size > 1 && b.has("") && b.delete("");
      const d = [...b.values()];
      return n.set(A, d), d;
    }
    intersects(j, C) {
      if (!(j instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((A) => m(A, C) && j.set.some((M) => m(M, C) && A.every((k) => M.every((P) => k.intersects(P, C)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(j) {
      if (!j)
        return !1;
      if (typeof j == "string")
        try {
          j = new c(j, this.options);
        } catch {
          return !1;
        }
      for (let C = 0; C < this.set.length; C++)
        if (Y(this.set[C], j, this.options))
          return !0;
      return !1;
    }
  }
  yn = t;
  const r = Ty, n = new r(), a = Fa, s = Hr(), o = qr, c = $e, {
    safeRe: i,
    t: u,
    comparatorTrimReplace: l,
    tildeTrimReplace: f,
    caretTrimReplace: E
  } = tr, { FLAG_INCLUDE_PRERELEASE: h, FLAG_LOOSE: v } = Fr, y = (I) => I.value === "<0.0.0-0", _ = (I) => I.value === "", m = (I, j) => {
    let C = !0;
    const A = I.slice();
    let M = A.pop();
    for (; C && A.length; )
      C = A.every((k) => M.intersects(k, j)), M = A.pop();
    return C;
  }, w = (I, j) => (o("comp", I, j), I = W(I, j), o("caret", I), I = N(I, j), o("tildes", I), I = ye(I, j), o("xrange", I), I = Pe(I, j), o("stars", I), I), R = (I) => !I || I.toLowerCase() === "x" || I === "*", N = (I, j) => I.trim().split(/\s+/).map((C) => T(C, j)).join(" "), T = (I, j) => {
    const C = j.loose ? i[u.TILDELOOSE] : i[u.TILDE];
    return I.replace(C, (A, M, k, P, $) => {
      o("tilde", I, A, M, k, P, $);
      let b;
      return R(M) ? b = "" : R(k) ? b = `>=${M}.0.0 <${+M + 1}.0.0-0` : R(P) ? b = `>=${M}.${k}.0 <${M}.${+k + 1}.0-0` : $ ? (o("replaceTilde pr", $), b = `>=${M}.${k}.${P}-${$} <${M}.${+k + 1}.0-0`) : b = `>=${M}.${k}.${P} <${M}.${+k + 1}.0-0`, o("tilde return", b), b;
    });
  }, W = (I, j) => I.trim().split(/\s+/).map((C) => te(C, j)).join(" "), te = (I, j) => {
    o("caret", I, j);
    const C = j.loose ? i[u.CARETLOOSE] : i[u.CARET], A = j.includePrerelease ? "-0" : "";
    return I.replace(C, (M, k, P, $, b) => {
      o("caret", I, M, k, P, $, b);
      let g;
      return R(k) ? g = "" : R(P) ? g = `>=${k}.0.0${A} <${+k + 1}.0.0-0` : R($) ? k === "0" ? g = `>=${k}.${P}.0${A} <${k}.${+P + 1}.0-0` : g = `>=${k}.${P}.0${A} <${+k + 1}.0.0-0` : b ? (o("replaceCaret pr", b), k === "0" ? P === "0" ? g = `>=${k}.${P}.${$}-${b} <${k}.${P}.${+$ + 1}-0` : g = `>=${k}.${P}.${$}-${b} <${k}.${+P + 1}.0-0` : g = `>=${k}.${P}.${$}-${b} <${+k + 1}.0.0-0`) : (o("no pr"), k === "0" ? P === "0" ? g = `>=${k}.${P}.${$}${A} <${k}.${P}.${+$ + 1}-0` : g = `>=${k}.${P}.${$}${A} <${k}.${+P + 1}.0-0` : g = `>=${k}.${P}.${$} <${+k + 1}.0.0-0`), o("caret return", g), g;
    });
  }, ye = (I, j) => (o("replaceXRanges", I, j), I.split(/\s+/).map((C) => we(C, j)).join(" ")), we = (I, j) => {
    I = I.trim();
    const C = j.loose ? i[u.XRANGELOOSE] : i[u.XRANGE];
    return I.replace(C, (A, M, k, P, $, b) => {
      o("xRange", I, A, M, k, P, $, b);
      const g = R(k), d = g || R(P), p = d || R($), S = p;
      return M === "=" && S && (M = ""), b = j.includePrerelease ? "-0" : "", g ? M === ">" || M === "<" ? A = "<0.0.0-0" : A = "*" : M && S ? (d && (P = 0), $ = 0, M === ">" ? (M = ">=", d ? (k = +k + 1, P = 0, $ = 0) : (P = +P + 1, $ = 0)) : M === "<=" && (M = "<", d ? k = +k + 1 : P = +P + 1), M === "<" && (b = "-0"), A = `${M + k}.${P}.${$}${b}`) : d ? A = `>=${k}.0.0${b} <${+k + 1}.0.0-0` : p && (A = `>=${k}.${P}.0${b} <${k}.${+P + 1}.0-0`), o("xRange return", A), A;
    });
  }, Pe = (I, j) => (o("replaceStars", I, j), I.trim().replace(i[u.STAR], "")), z = (I, j) => (o("replaceGTE0", I, j), I.trim().replace(i[j.includePrerelease ? u.GTE0PRE : u.GTE0], "")), F = (I) => (j, C, A, M, k, P, $, b, g, d, p, S) => (R(A) ? C = "" : R(M) ? C = `>=${A}.0.0${I ? "-0" : ""}` : R(k) ? C = `>=${A}.${M}.0${I ? "-0" : ""}` : P ? C = `>=${C}` : C = `>=${C}${I ? "-0" : ""}`, R(g) ? b = "" : R(d) ? b = `<${+g + 1}.0.0-0` : R(p) ? b = `<${g}.${+d + 1}.0-0` : S ? b = `<=${g}.${d}.${p}-${S}` : I ? b = `<${g}.${d}.${+p + 1}-0` : b = `<=${b}`, `${C} ${b}`.trim()), Y = (I, j, C) => {
    for (let A = 0; A < I.length; A++)
      if (!I[A].test(j))
        return !1;
    if (j.prerelease.length && !C.includePrerelease) {
      for (let A = 0; A < I.length; A++)
        if (o(I[A].semver), I[A].semver !== s.ANY && I[A].semver.prerelease.length > 0) {
          const M = I[A].semver;
          if (M.major === j.major && M.minor === j.minor && M.patch === j.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return yn;
}
var gn, Qs;
function Hr() {
  if (Qs) return gn;
  Qs = 1;
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
      l = l.trim().split(/\s+/).join(" "), o("comparator", l, f), this.options = f, this.loose = !!f.loose, this.parse(l), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, o("comp", this);
    }
    parse(l) {
      const f = this.options.loose ? n[a.COMPARATORLOOSE] : n[a.COMPARATOR], E = l.match(f);
      if (!E)
        throw new TypeError(`Invalid comparator: ${l}`);
      this.operator = E[1] !== void 0 ? E[1] : "", this.operator === "=" && (this.operator = ""), E[2] ? this.semver = new c(E[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(l) {
      if (o("Comparator.test", l, this.options.loose), this.semver === e || l === e)
        return !0;
      if (typeof l == "string")
        try {
          l = new c(l, this.options);
        } catch {
          return !1;
        }
      return s(l, this.operator, this.semver, this.options);
    }
    intersects(l, f) {
      if (!(l instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new i(l.value, f).test(this.value) : l.operator === "" ? l.value === "" ? !0 : new i(this.value, f).test(l.semver) : (f = r(f), f.includePrerelease && (this.value === "<0.0.0-0" || l.value === "<0.0.0-0") || !f.includePrerelease && (this.value.startsWith("<0.0.0") || l.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && l.operator.startsWith(">") || this.operator.startsWith("<") && l.operator.startsWith("<") || this.semver.version === l.semver.version && this.operator.includes("=") && l.operator.includes("=") || s(this.semver, "<", l.semver, f) && this.operator.startsWith(">") && l.operator.startsWith("<") || s(this.semver, ">", l.semver, f) && this.operator.startsWith("<") && l.operator.startsWith(">")));
    }
  }
  gn = t;
  const r = Fa, { safeRe: n, t: a } = tr, s = Ii, o = qr, c = $e, i = Te();
  return gn;
}
const Ay = Te(), ky = (e, t, r) => {
  try {
    t = new Ay(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var Kr = ky;
const Cy = Te(), xy = (e, t) => new Cy(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var Dy = xy;
const Ly = $e, My = Te(), zy = (e, t, r) => {
  let n = null, a = null, s = null;
  try {
    s = new My(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    s.test(o) && (!n || a.compare(o) === -1) && (n = o, a = new Ly(n, r));
  }), n;
};
var Vy = zy;
const Uy = $e, Fy = Te(), qy = (e, t, r) => {
  let n = null, a = null, s = null;
  try {
    s = new Fy(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    s.test(o) && (!n || a.compare(o) === 1) && (n = o, a = new Uy(n, r));
  }), n;
};
var Gy = qy;
const vn = $e, Hy = Te(), eo = Gr, Ky = (e, t) => {
  e = new Hy(e, t);
  let r = new vn("0.0.0");
  if (e.test(r) || (r = new vn("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const a = e.set[n];
    let s = null;
    a.forEach((o) => {
      const c = new vn(o.semver.version);
      switch (o.operator) {
        case ">":
          c.prerelease.length === 0 ? c.patch++ : c.prerelease.push(0), c.raw = c.format();
        case "":
        case ">=":
          (!s || eo(c, s)) && (s = c);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${o.operator}`);
      }
    }), s && (!r || eo(r, s)) && (r = s);
  }
  return r && e.test(r) ? r : null;
};
var Xy = Ky;
const Wy = Te(), By = (e, t) => {
  try {
    return new Wy(e, t).range || "*";
  } catch {
    return null;
  }
};
var Jy = By;
const Yy = $e, ji = Hr(), { ANY: Zy } = ji, Qy = Te(), eg = Kr, to = Gr, ro = Ga, tg = Ka, rg = Ha, ng = (e, t, r, n) => {
  e = new Yy(e, n), t = new Qy(t, n);
  let a, s, o, c, i;
  switch (r) {
    case ">":
      a = to, s = tg, o = ro, c = ">", i = ">=";
      break;
    case "<":
      a = ro, s = rg, o = to, c = "<", i = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (eg(e, t, n))
    return !1;
  for (let u = 0; u < t.set.length; ++u) {
    const l = t.set[u];
    let f = null, E = null;
    if (l.forEach((h) => {
      h.semver === Zy && (h = new ji(">=0.0.0")), f = f || h, E = E || h, a(h.semver, f.semver, n) ? f = h : o(h.semver, E.semver, n) && (E = h);
    }), f.operator === c || f.operator === i || (!E.operator || E.operator === c) && s(e, E.semver))
      return !1;
    if (E.operator === i && o(e, E.semver))
      return !1;
  }
  return !0;
};
var Xa = ng;
const ag = Xa, sg = (e, t, r) => ag(e, t, ">", r);
var og = sg;
const ig = Xa, cg = (e, t, r) => ig(e, t, "<", r);
var lg = cg;
const no = Te(), ug = (e, t, r) => (e = new no(e, r), t = new no(t, r), e.intersects(t, r));
var dg = ug;
const fg = Kr, pg = Oe;
var mg = (e, t, r) => {
  const n = [];
  let a = null, s = null;
  const o = e.sort((l, f) => pg(l, f, r));
  for (const l of o)
    fg(l, t, r) ? (s = l, a || (a = l)) : (s && n.push([a, s]), s = null, a = null);
  a && n.push([a, null]);
  const c = [];
  for (const [l, f] of n)
    l === f ? c.push(l) : !f && l === o[0] ? c.push("*") : f ? l === o[0] ? c.push(`<=${f}`) : c.push(`${l} - ${f}`) : c.push(`>=${l}`);
  const i = c.join(" || "), u = typeof t.raw == "string" ? t.raw : String(t);
  return i.length < u.length ? i : t;
};
const ao = Te(), Wa = Hr(), { ANY: _n } = Wa, Vt = Kr, Ba = Oe, hg = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new ao(e, r), t = new ao(t, r);
  let n = !1;
  e: for (const a of e.set) {
    for (const s of t.set) {
      const o = yg(a, s, r);
      if (n = n || o !== null, o)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, $g = [new Wa(">=0.0.0-0")], so = [new Wa(">=0.0.0")], yg = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === _n) {
    if (t.length === 1 && t[0].semver === _n)
      return !0;
    r.includePrerelease ? e = $g : e = so;
  }
  if (t.length === 1 && t[0].semver === _n) {
    if (r.includePrerelease)
      return !0;
    t = so;
  }
  const n = /* @__PURE__ */ new Set();
  let a, s;
  for (const h of e)
    h.operator === ">" || h.operator === ">=" ? a = oo(a, h, r) : h.operator === "<" || h.operator === "<=" ? s = io(s, h, r) : n.add(h.semver);
  if (n.size > 1)
    return null;
  let o;
  if (a && s) {
    if (o = Ba(a.semver, s.semver, r), o > 0)
      return null;
    if (o === 0 && (a.operator !== ">=" || s.operator !== "<="))
      return null;
  }
  for (const h of n) {
    if (a && !Vt(h, String(a), r) || s && !Vt(h, String(s), r))
      return null;
    for (const v of t)
      if (!Vt(h, String(v), r))
        return !1;
    return !0;
  }
  let c, i, u, l, f = s && !r.includePrerelease && s.semver.prerelease.length ? s.semver : !1, E = a && !r.includePrerelease && a.semver.prerelease.length ? a.semver : !1;
  f && f.prerelease.length === 1 && s.operator === "<" && f.prerelease[0] === 0 && (f = !1);
  for (const h of t) {
    if (l = l || h.operator === ">" || h.operator === ">=", u = u || h.operator === "<" || h.operator === "<=", a) {
      if (E && h.semver.prerelease && h.semver.prerelease.length && h.semver.major === E.major && h.semver.minor === E.minor && h.semver.patch === E.patch && (E = !1), h.operator === ">" || h.operator === ">=") {
        if (c = oo(a, h, r), c === h && c !== a)
          return !1;
      } else if (a.operator === ">=" && !Vt(a.semver, String(h), r))
        return !1;
    }
    if (s) {
      if (f && h.semver.prerelease && h.semver.prerelease.length && h.semver.major === f.major && h.semver.minor === f.minor && h.semver.patch === f.patch && (f = !1), h.operator === "<" || h.operator === "<=") {
        if (i = io(s, h, r), i === h && i !== s)
          return !1;
      } else if (s.operator === "<=" && !Vt(s.semver, String(h), r))
        return !1;
    }
    if (!h.operator && (s || a) && o !== 0)
      return !1;
  }
  return !(a && u && !s && o !== 0 || s && l && !a && o !== 0 || E || f);
}, oo = (e, t, r) => {
  if (!e)
    return t;
  const n = Ba(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, io = (e, t, r) => {
  if (!e)
    return t;
  const n = Ba(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var gg = hg;
const En = tr, co = Fr, vg = $e, lo = Si, _g = At, Eg = I$, wg = O$, bg = A$, Sg = C$, Pg = L$, Rg = V$, Ig = q$, jg = K$, Ng = Oe, Og = J$, Tg = Q$, Ag = qa, kg = ny, Cg = oy, xg = Gr, Dg = Ga, Lg = Pi, Mg = Ri, zg = Ha, Vg = Ka, Ug = Ii, Fg = Ny, qg = Hr(), Gg = Te(), Hg = Kr, Kg = Dy, Xg = Vy, Wg = Gy, Bg = Xy, Jg = Jy, Yg = Xa, Zg = og, Qg = lg, e0 = dg, t0 = mg, r0 = gg;
var n0 = {
  parse: _g,
  valid: Eg,
  clean: wg,
  inc: bg,
  diff: Sg,
  major: Pg,
  minor: Rg,
  patch: Ig,
  prerelease: jg,
  compare: Ng,
  rcompare: Og,
  compareLoose: Tg,
  compareBuild: Ag,
  sort: kg,
  rsort: Cg,
  gt: xg,
  lt: Dg,
  eq: Lg,
  neq: Mg,
  gte: zg,
  lte: Vg,
  cmp: Ug,
  coerce: Fg,
  Comparator: qg,
  Range: Gg,
  satisfies: Hg,
  toComparators: Kg,
  maxSatisfying: Xg,
  minSatisfying: Wg,
  minVersion: Bg,
  validRange: Jg,
  outside: Yg,
  gtr: Zg,
  ltr: Qg,
  intersects: e0,
  simplifyRange: t0,
  subset: r0,
  SemVer: vg,
  re: En.re,
  src: En.src,
  tokens: En.t,
  SEMVER_SPEC_VERSION: co.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: co.RELEASE_TYPES,
  compareIdentifiers: lo.compareIdentifiers,
  rcompareIdentifiers: lo.rcompareIdentifiers
};
const ht = /* @__PURE__ */ go(n0), a0 = Object.prototype.toString, s0 = "[object Uint8Array]", o0 = "[object ArrayBuffer]";
function Ni(e, t, r) {
  return e ? e.constructor === t ? !0 : a0.call(e) === r : !1;
}
function Oi(e) {
  return Ni(e, Uint8Array, s0);
}
function i0(e) {
  return Ni(e, ArrayBuffer, o0);
}
function c0(e) {
  return Oi(e) || i0(e);
}
function l0(e) {
  if (!Oi(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
function u0(e) {
  if (!c0(e))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof e}\``);
}
function uo(e, t) {
  if (e.length === 0)
    return new Uint8Array(0);
  t ?? (t = e.reduce((a, s) => a + s.length, 0));
  const r = new Uint8Array(t);
  let n = 0;
  for (const a of e)
    l0(a), r.set(a, n), n += a.length;
  return r;
}
const hr = {
  utf8: new globalThis.TextDecoder("utf8")
};
function fo(e, t = "utf8") {
  return u0(e), hr[t] ?? (hr[t] = new globalThis.TextDecoder(t)), hr[t].decode(e);
}
function d0(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
const f0 = new globalThis.TextEncoder();
function wn(e) {
  return d0(e), f0.encode(e);
}
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
const p0 = n$.default, po = "aes-256-cbc", $t = () => /* @__PURE__ */ Object.create(null), m0 = (e) => e != null, h0 = (e, t) => {
  const r = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), n = typeof t;
  if (r.has(n))
    throw new TypeError(`Setting a value of type \`${n}\` for key \`${e}\` is not allowed as it's not supported by JSON`);
}, Er = "__internal__", bn = `${Er}.migrations.version`;
var Ye, Le, _e, Me;
class $0 {
  constructor(t = {}) {
    Ct(this, "path");
    Ct(this, "events");
    xt(this, Ye);
    xt(this, Le);
    xt(this, _e);
    xt(this, Me, {});
    Ct(this, "_deserialize", (t) => JSON.parse(t));
    Ct(this, "_serialize", (t) => JSON.stringify(t, void 0, "	"));
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
      r.cwd = Cc(r.projectName, { suffix: r.projectSuffix }).config;
    }
    if (Dt(this, _e, r), r.schema ?? r.ajvOptions ?? r.rootSchema) {
      if (r.schema && typeof r.schema != "object")
        throw new TypeError("The `schema` option must be an object.");
      const o = new Fh.Ajv2020({
        allErrors: !0,
        useDefaults: !0,
        ...r.ajvOptions
      });
      p0(o);
      const c = {
        ...r.rootSchema,
        type: "object",
        properties: r.schema
      };
      Dt(this, Ye, o.compile(c));
      for (const [i, u] of Object.entries(r.schema ?? {}))
        u != null && u.default && (Q(this, Me)[i] = u.default);
    }
    r.defaults && Dt(this, Me, {
      ...Q(this, Me),
      ...r.defaults
    }), r.serialize && (this._serialize = r.serialize), r.deserialize && (this._deserialize = r.deserialize), this.events = new EventTarget(), Dt(this, Le, r.encryptionKey);
    const n = r.fileExtension ? `.${r.fileExtension}` : "";
    this.path = K.resolve(r.cwd, `${r.configName ?? "config"}${n}`);
    const a = this.store, s = Object.assign($t(), r.defaults, a);
    if (r.migrations) {
      if (!r.projectVersion)
        throw new Error("Please specify the `projectVersion` option.");
      this._migrate(r.migrations, r.projectVersion, r.beforeEachMigration);
    }
    this._validate(s);
    try {
      yo.deepEqual(a, s);
    } catch {
      this.store = s;
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
    const { store: n } = this, a = (s, o) => {
      h0(s, o), Q(this, _e).accessPropertiesByDotNotation ? is(n, s, o) : n[s] = o;
    };
    if (typeof t == "object") {
      const s = t;
      for (const [o, c] of Object.entries(s))
        a(o, c);
    } else
      a(t, r);
    this.store = n;
  }
  /**
      Check if an item exists.
  
      @param key - The key of the item to check.
      */
  has(t) {
    return Q(this, _e).accessPropertiesByDotNotation ? Oc(this.store, t) : t in this.store;
  }
  /**
      Reset items to their default values, as defined by the `defaults` or `schema` option.
  
      @see `clear()` to reset all items.
  
      @param keys - The keys of the items to reset.
      */
  reset(...t) {
    for (const r of t)
      m0(Q(this, Me)[r]) && this.set(r, Q(this, Me)[r]);
  }
  delete(t) {
    const { store: r } = this;
    Q(this, _e).accessPropertiesByDotNotation ? Nc(r, t) : delete r[t], this.store = r;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    this.store = $t();
    for (const t of Object.keys(Q(this, Me)))
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
      const t = q.readFileSync(this.path, Q(this, Le) ? null : "utf8"), r = this._encryptData(t), n = this._deserialize(r);
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
    if (!Q(this, Le))
      return typeof t == "string" ? t : fo(t);
    try {
      const r = t.slice(0, 16), n = Lt.pbkdf2Sync(Q(this, Le), r.toString(), 1e4, 32, "sha512"), a = Lt.createDecipheriv(po, n, r), s = t.slice(17), o = typeof s == "string" ? wn(s) : s;
      return fo(uo([a.update(o), a.final()]));
    } catch {
    }
    return t.toString();
  }
  _handleChange(t, r) {
    let n = t();
    const a = () => {
      const s = n, o = t();
      Gi(o, s) || (n = o, r.call(this, o, s));
    };
    return this.events.addEventListener("change", a), () => {
      this.events.removeEventListener("change", a);
    };
  }
  _validate(t) {
    if (!Q(this, Ye) || Q(this, Ye).call(this, t) || !Q(this, Ye).errors)
      return;
    const n = Q(this, Ye).errors.map(({ instancePath: a, message: s = "" }) => `\`${a.slice(1)}\` ${s}`);
    throw new Error("Config schema violation: " + n.join("; "));
  }
  _ensureDirectory() {
    q.mkdirSync(K.dirname(this.path), { recursive: !0 });
  }
  _write(t) {
    let r = this._serialize(t);
    if (Q(this, Le)) {
      const n = Lt.randomBytes(16), a = Lt.pbkdf2Sync(Q(this, Le), n.toString(), 1e4, 32, "sha512"), s = Lt.createCipheriv(po, a, n);
      r = uo([n, wn(":"), s.update(wn(r)), s.final()]);
    }
    if (ae.env.SNAP)
      q.writeFileSync(this.path, r, { mode: Q(this, _e).configFileMode });
    else
      try {
        bo(this.path, r, { mode: Q(this, _e).configFileMode });
      } catch (n) {
        if ((n == null ? void 0 : n.code) === "EXDEV") {
          q.writeFileSync(this.path, r, { mode: Q(this, _e).configFileMode });
          return;
        }
        throw n;
      }
  }
  _watch() {
    this._ensureDirectory(), q.existsSync(this.path) || this._write($t()), ae.platform === "win32" ? q.watch(this.path, { persistent: !1 }, Gs(() => {
      this.events.dispatchEvent(new Event("change"));
    }, { wait: 100 })) : q.watchFile(this.path, { persistent: !1 }, Gs(() => {
      this.events.dispatchEvent(new Event("change"));
    }, { wait: 5e3 }));
  }
  _migrate(t, r, n) {
    let a = this._get(bn, "0.0.0");
    const s = Object.keys(t).filter((c) => this._shouldPerformMigration(c, a, r));
    let o = { ...this.store };
    for (const c of s)
      try {
        n && n(this, {
          fromVersion: a,
          toVersion: c,
          finalVersion: r,
          versions: s
        });
        const i = t[c];
        i == null || i(this), this._set(bn, c), a = c, o = { ...this.store };
      } catch (i) {
        throw this.store = o, new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${i}`);
      }
    (this._isVersionInRangeFormat(a) || !ht.eq(a, r)) && this._set(bn, r);
  }
  _containsReservedKey(t) {
    return typeof t == "object" && Object.keys(t)[0] === Er ? !0 : typeof t != "string" ? !1 : Q(this, _e).accessPropertiesByDotNotation ? !!t.startsWith(`${Er}.`) : !1;
  }
  _isVersionInRangeFormat(t) {
    return ht.clean(t) === null;
  }
  _shouldPerformMigration(t, r, n) {
    return this._isVersionInRangeFormat(t) ? r !== "0.0.0" && ht.satisfies(r, t) ? !1 : ht.satisfies(n, t) : !(ht.lte(t, r) || ht.gt(t, n));
  }
  _get(t, r) {
    return jc(this.store, t, r);
  }
  _set(t, r) {
    const { store: n } = this;
    is(n, t, r), this.store = n;
  }
}
Ye = new WeakMap(), Le = new WeakMap(), _e = new WeakMap(), Me = new WeakMap();
const { app: wr, ipcMain: Dn, shell: y0 } = zn;
let mo = !1;
const ho = () => {
  if (!Dn || !wr)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const e = {
    defaultCwd: wr.getPath("userData"),
    appVersion: wr.getVersion()
  };
  return mo || (Dn.on("electron-store-get-data", (t) => {
    t.returnValue = e;
  }), mo = !0), e;
};
class g0 extends $0 {
  constructor(t) {
    let r, n;
    if (ae.type === "renderer") {
      const a = zn.ipcRenderer.sendSync("electron-store-get-data");
      if (!a)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: r, appVersion: n } = a);
    } else Dn && wr && ({ defaultCwd: r, appVersion: n } = ho());
    t = {
      name: "config",
      ...t
    }, t.projectVersion || (t.projectVersion = n), t.cwd ? t.cwd = K.isAbsolute(t.cwd) ? t.cwd : K.join(r, t.cwd) : t.cwd = r, t.configName = t.name, delete t.name, super(t);
  }
  static initRenderer() {
    ho();
  }
  async openInEditor() {
    const t = await y0.openPath(this.path);
    if (t)
      throw new Error(t);
  }
}
const Ln = new g0({
  defaults: {
    darkMode: !1,
    hotkeys: {},
    streamDeck: !1,
    referral: void 0
  }
}), v0 = () => {
  Et.handle("get-setting", (e, t) => Ln.get(t)), Et.handle(
    "set-setting",
    (e, t, r) => {
      Ln.set(t, r), e.sender.send("setting-changed", t, r);
    }
  );
}, qt = (e, t, r) => {
  Ln.set(t, r), e.webContents.send("setting-changed", t, r);
}, Ja = "tabzero", Ti = async (e, t) => {
  const r = new URL(t);
  if (!r.protocol.startsWith(Ja)) return "not a valid url";
  const n = new URLSearchParams(r.search), a = n.get("code"), s = n.get("scope"), o = n.get("referral");
  if (!a || !s) return "no scope or code";
  o && qt(e, "referral", o), e.webContents.send("auth", { code: a, scope: s });
}, _0 = (e) => {
  Ne.setAsDefaultProtocolClient(Ja), Ne.on("open-url", async (t, r) => {
    Ti(e, r);
  });
}, E0 = (e) => {
  try {
    return Gt.register(e, () => {
    }), Gt.unregister(e), !0;
  } catch {
    return !1;
  }
}, w0 = (e) => {
  const t = {};
  Et.handle(
    "register-hotkey",
    (r, n) => {
      if (!E0(n.keys))
        return console.error(`[Hotkey] Invalid accelerator: ${n.keys}`), !1;
      const a = t[n.name];
      return a && Gt.unregister(a), t[n.name] = n.keys, Gt.register(n.keys, () => {
        console.log(`[Hotkey] ${n.name}`), e.webContents.send("hotkey", n.name);
      }), !0;
    }
  ), e.on("close", () => {
    Object.values(t).forEach((r) => {
      Gt.unregister(r);
    }), Et.removeHandler("register-hotkey");
  });
}, b0 = 51109, S0 = (e) => {
  const t = new Xi({ port: b0, perMessageDeflate: !1 });
  qt(e, "streamDeck", !1), Et.handle(
    "send-to-stream-deck",
    (r, n) => {
      t.clients.forEach((a) => {
        a.readyState === 1 && a.send(JSON.stringify(n));
      });
    }
  ), t.on("error", (r) => {
    console.error("[WS] Error:", r), qt(e, "streamDeck", !1);
  }), t.on("connection", (r) => {
    console.log("[WS] Plugin connected"), qt(e, "streamDeck", !0), r.on("message", (n) => {
      switch (n.toString()) {
        case "toggleRecording":
          e.webContents.send("hotkey", "toggleRecording");
          break;
        case "clipStream":
          e.webContents.send("hotkey", "clipStream");
          break;
      }
    }), r.on("close", () => {
      console.log("[WS] Plugin disconnected"), qt(e, "streamDeck", !1);
    });
  });
};
function Ai(e, t, r = "") {
  e = Bi(".", e);
  let n = Ji(e), a = 0, s, o;
  for (; a < n.length; a++)
    s = cn(e, n[a]), o = Yi(s), o.isDirectory() ? Ai(s, t, cn(r, n[a])) : t(cn(r, n[a]), s, o);
}
function P0(e) {
  let t = e.url;
  if (t == null) return;
  let r = e._parsedUrl;
  if (r && r.raw === t) return r;
  let n = t, a = "", s, o;
  if (t.length > 1) {
    let c = t.indexOf("#", 1);
    c !== -1 && (o = t.substring(c), n = t.substring(0, c)), c = n.indexOf("?", 1), c !== -1 && (a = n.substring(c), n = n.substring(0, c), a.length > 1 && (s = Zi.parse(a.substring(1))));
  }
  return e._parsedUrl = { pathname: n, search: a, query: s, hash: o, raw: t };
}
const R0 = {
  "3g2": "video/3gpp2",
  "3gp": "video/3gpp",
  "3gpp": "video/3gpp",
  "3mf": "model/3mf",
  aac: "audio/aac",
  ac: "application/pkix-attr-cert",
  adp: "audio/adpcm",
  adts: "audio/aac",
  ai: "application/postscript",
  aml: "application/automationml-aml+xml",
  amlx: "application/automationml-amlx+zip",
  amr: "audio/amr",
  apng: "image/apng",
  appcache: "text/cache-manifest",
  appinstaller: "application/appinstaller",
  appx: "application/appx",
  appxbundle: "application/appxbundle",
  asc: "application/pgp-keys",
  atom: "application/atom+xml",
  atomcat: "application/atomcat+xml",
  atomdeleted: "application/atomdeleted+xml",
  atomsvc: "application/atomsvc+xml",
  au: "audio/basic",
  avci: "image/avci",
  avcs: "image/avcs",
  avif: "image/avif",
  aw: "application/applixware",
  bdoc: "application/bdoc",
  bin: "application/octet-stream",
  bmp: "image/bmp",
  bpk: "application/octet-stream",
  btf: "image/prs.btif",
  btif: "image/prs.btif",
  buffer: "application/octet-stream",
  ccxml: "application/ccxml+xml",
  cdfx: "application/cdfx+xml",
  cdmia: "application/cdmi-capability",
  cdmic: "application/cdmi-container",
  cdmid: "application/cdmi-domain",
  cdmio: "application/cdmi-object",
  cdmiq: "application/cdmi-queue",
  cer: "application/pkix-cert",
  cgm: "image/cgm",
  cjs: "application/node",
  class: "application/java-vm",
  coffee: "text/coffeescript",
  conf: "text/plain",
  cpl: "application/cpl+xml",
  cpt: "application/mac-compactpro",
  crl: "application/pkix-crl",
  css: "text/css",
  csv: "text/csv",
  cu: "application/cu-seeme",
  cwl: "application/cwl",
  cww: "application/prs.cww",
  davmount: "application/davmount+xml",
  dbk: "application/docbook+xml",
  deb: "application/octet-stream",
  def: "text/plain",
  deploy: "application/octet-stream",
  dib: "image/bmp",
  "disposition-notification": "message/disposition-notification",
  dist: "application/octet-stream",
  distz: "application/octet-stream",
  dll: "application/octet-stream",
  dmg: "application/octet-stream",
  dms: "application/octet-stream",
  doc: "application/msword",
  dot: "application/msword",
  dpx: "image/dpx",
  drle: "image/dicom-rle",
  dsc: "text/prs.lines.tag",
  dssc: "application/dssc+der",
  dtd: "application/xml-dtd",
  dump: "application/octet-stream",
  dwd: "application/atsc-dwd+xml",
  ear: "application/java-archive",
  ecma: "application/ecmascript",
  elc: "application/octet-stream",
  emf: "image/emf",
  eml: "message/rfc822",
  emma: "application/emma+xml",
  emotionml: "application/emotionml+xml",
  eps: "application/postscript",
  epub: "application/epub+zip",
  exe: "application/octet-stream",
  exi: "application/exi",
  exp: "application/express",
  exr: "image/aces",
  ez: "application/andrew-inset",
  fdf: "application/fdf",
  fdt: "application/fdt+xml",
  fits: "image/fits",
  g3: "image/g3fax",
  gbr: "application/rpki-ghostbusters",
  geojson: "application/geo+json",
  gif: "image/gif",
  glb: "model/gltf-binary",
  gltf: "model/gltf+json",
  gml: "application/gml+xml",
  gpx: "application/gpx+xml",
  gram: "application/srgs",
  grxml: "application/srgs+xml",
  gxf: "application/gxf",
  gz: "application/gzip",
  h261: "video/h261",
  h263: "video/h263",
  h264: "video/h264",
  heic: "image/heic",
  heics: "image/heic-sequence",
  heif: "image/heif",
  heifs: "image/heif-sequence",
  hej2: "image/hej2k",
  held: "application/atsc-held+xml",
  hjson: "application/hjson",
  hlp: "application/winhlp",
  hqx: "application/mac-binhex40",
  hsj2: "image/hsj2",
  htm: "text/html",
  html: "text/html",
  ics: "text/calendar",
  ief: "image/ief",
  ifb: "text/calendar",
  iges: "model/iges",
  igs: "model/iges",
  img: "application/octet-stream",
  in: "text/plain",
  ini: "text/plain",
  ink: "application/inkml+xml",
  inkml: "application/inkml+xml",
  ipfix: "application/ipfix",
  iso: "application/octet-stream",
  its: "application/its+xml",
  jade: "text/jade",
  jar: "application/java-archive",
  jhc: "image/jphc",
  jls: "image/jls",
  jp2: "image/jp2",
  jpe: "image/jpeg",
  jpeg: "image/jpeg",
  jpf: "image/jpx",
  jpg: "image/jpeg",
  jpg2: "image/jp2",
  jpgm: "image/jpm",
  jpgv: "video/jpeg",
  jph: "image/jph",
  jpm: "image/jpm",
  jpx: "image/jpx",
  js: "text/javascript",
  json: "application/json",
  json5: "application/json5",
  jsonld: "application/ld+json",
  jsonml: "application/jsonml+json",
  jsx: "text/jsx",
  jt: "model/jt",
  jxl: "image/jxl",
  jxr: "image/jxr",
  jxra: "image/jxra",
  jxrs: "image/jxrs",
  jxs: "image/jxs",
  jxsc: "image/jxsc",
  jxsi: "image/jxsi",
  jxss: "image/jxss",
  kar: "audio/midi",
  ktx: "image/ktx",
  ktx2: "image/ktx2",
  less: "text/less",
  lgr: "application/lgr+xml",
  list: "text/plain",
  litcoffee: "text/coffeescript",
  log: "text/plain",
  lostxml: "application/lost+xml",
  lrf: "application/octet-stream",
  m1v: "video/mpeg",
  m21: "application/mp21",
  m2a: "audio/mpeg",
  m2t: "video/mp2t",
  m2ts: "video/mp2t",
  m2v: "video/mpeg",
  m3a: "audio/mpeg",
  m4a: "audio/mp4",
  m4p: "application/mp4",
  m4s: "video/iso.segment",
  ma: "application/mathematica",
  mads: "application/mads+xml",
  maei: "application/mmt-aei+xml",
  man: "text/troff",
  manifest: "text/cache-manifest",
  map: "application/json",
  mar: "application/octet-stream",
  markdown: "text/markdown",
  mathml: "application/mathml+xml",
  mb: "application/mathematica",
  mbox: "application/mbox",
  md: "text/markdown",
  mdx: "text/mdx",
  me: "text/troff",
  mesh: "model/mesh",
  meta4: "application/metalink4+xml",
  metalink: "application/metalink+xml",
  mets: "application/mets+xml",
  mft: "application/rpki-manifest",
  mid: "audio/midi",
  midi: "audio/midi",
  mime: "message/rfc822",
  mj2: "video/mj2",
  mjp2: "video/mj2",
  mjs: "text/javascript",
  mml: "text/mathml",
  mods: "application/mods+xml",
  mov: "video/quicktime",
  mp2: "audio/mpeg",
  mp21: "application/mp21",
  mp2a: "audio/mpeg",
  mp3: "audio/mpeg",
  mp4: "video/mp4",
  mp4a: "audio/mp4",
  mp4s: "application/mp4",
  mp4v: "video/mp4",
  mpd: "application/dash+xml",
  mpe: "video/mpeg",
  mpeg: "video/mpeg",
  mpf: "application/media-policy-dataset+xml",
  mpg: "video/mpeg",
  mpg4: "video/mp4",
  mpga: "audio/mpeg",
  mpp: "application/dash-patch+xml",
  mrc: "application/marc",
  mrcx: "application/marcxml+xml",
  ms: "text/troff",
  mscml: "application/mediaservercontrol+xml",
  msh: "model/mesh",
  msi: "application/octet-stream",
  msix: "application/msix",
  msixbundle: "application/msixbundle",
  msm: "application/octet-stream",
  msp: "application/octet-stream",
  mtl: "model/mtl",
  mts: "video/mp2t",
  musd: "application/mmt-usd+xml",
  mxf: "application/mxf",
  mxmf: "audio/mobile-xmf",
  mxml: "application/xv+xml",
  n3: "text/n3",
  nb: "application/mathematica",
  nq: "application/n-quads",
  nt: "application/n-triples",
  obj: "model/obj",
  oda: "application/oda",
  oga: "audio/ogg",
  ogg: "audio/ogg",
  ogv: "video/ogg",
  ogx: "application/ogg",
  omdoc: "application/omdoc+xml",
  onepkg: "application/onenote",
  onetmp: "application/onenote",
  onetoc: "application/onenote",
  onetoc2: "application/onenote",
  opf: "application/oebps-package+xml",
  opus: "audio/ogg",
  otf: "font/otf",
  owl: "application/rdf+xml",
  oxps: "application/oxps",
  p10: "application/pkcs10",
  p7c: "application/pkcs7-mime",
  p7m: "application/pkcs7-mime",
  p7s: "application/pkcs7-signature",
  p8: "application/pkcs8",
  pdf: "application/pdf",
  pfr: "application/font-tdpfr",
  pgp: "application/pgp-encrypted",
  pkg: "application/octet-stream",
  pki: "application/pkixcmp",
  pkipath: "application/pkix-pkipath",
  pls: "application/pls+xml",
  png: "image/png",
  prc: "model/prc",
  prf: "application/pics-rules",
  provx: "application/provenance+xml",
  ps: "application/postscript",
  pskcxml: "application/pskc+xml",
  pti: "image/prs.pti",
  qt: "video/quicktime",
  raml: "application/raml+yaml",
  rapd: "application/route-apd+xml",
  rdf: "application/rdf+xml",
  relo: "application/p2p-overlay+xml",
  rif: "application/reginfo+xml",
  rl: "application/resource-lists+xml",
  rld: "application/resource-lists-diff+xml",
  rmi: "audio/midi",
  rnc: "application/relax-ng-compact-syntax",
  rng: "application/xml",
  roa: "application/rpki-roa",
  roff: "text/troff",
  rq: "application/sparql-query",
  rs: "application/rls-services+xml",
  rsat: "application/atsc-rsat+xml",
  rsd: "application/rsd+xml",
  rsheet: "application/urc-ressheet+xml",
  rss: "application/rss+xml",
  rtf: "text/rtf",
  rtx: "text/richtext",
  rusd: "application/route-usd+xml",
  s3m: "audio/s3m",
  sbml: "application/sbml+xml",
  scq: "application/scvp-cv-request",
  scs: "application/scvp-cv-response",
  sdp: "application/sdp",
  senmlx: "application/senml+xml",
  sensmlx: "application/sensml+xml",
  ser: "application/java-serialized-object",
  setpay: "application/set-payment-initiation",
  setreg: "application/set-registration-initiation",
  sgi: "image/sgi",
  sgm: "text/sgml",
  sgml: "text/sgml",
  shex: "text/shex",
  shf: "application/shf+xml",
  shtml: "text/html",
  sieve: "application/sieve",
  sig: "application/pgp-signature",
  sil: "audio/silk",
  silo: "model/mesh",
  siv: "application/sieve",
  slim: "text/slim",
  slm: "text/slim",
  sls: "application/route-s-tsid+xml",
  smi: "application/smil+xml",
  smil: "application/smil+xml",
  snd: "audio/basic",
  so: "application/octet-stream",
  spdx: "text/spdx",
  spp: "application/scvp-vp-response",
  spq: "application/scvp-vp-request",
  spx: "audio/ogg",
  sql: "application/sql",
  sru: "application/sru+xml",
  srx: "application/sparql-results+xml",
  ssdl: "application/ssdl+xml",
  ssml: "application/ssml+xml",
  stk: "application/hyperstudio",
  stl: "model/stl",
  stpx: "model/step+xml",
  stpxz: "model/step-xml+zip",
  stpz: "model/step+zip",
  styl: "text/stylus",
  stylus: "text/stylus",
  svg: "image/svg+xml",
  svgz: "image/svg+xml",
  swidtag: "application/swid+xml",
  t: "text/troff",
  t38: "image/t38",
  td: "application/urc-targetdesc+xml",
  tei: "application/tei+xml",
  teicorpus: "application/tei+xml",
  text: "text/plain",
  tfi: "application/thraud+xml",
  tfx: "image/tiff-fx",
  tif: "image/tiff",
  tiff: "image/tiff",
  toml: "application/toml",
  tr: "text/troff",
  trig: "application/trig",
  ts: "video/mp2t",
  tsd: "application/timestamped-data",
  tsv: "text/tab-separated-values",
  ttc: "font/collection",
  ttf: "font/ttf",
  ttl: "text/turtle",
  ttml: "application/ttml+xml",
  txt: "text/plain",
  u3d: "model/u3d",
  u8dsn: "message/global-delivery-status",
  u8hdr: "message/global-headers",
  u8mdn: "message/global-disposition-notification",
  u8msg: "message/global",
  ubj: "application/ubjson",
  uri: "text/uri-list",
  uris: "text/uri-list",
  urls: "text/uri-list",
  vcard: "text/vcard",
  vrml: "model/vrml",
  vtt: "text/vtt",
  vxml: "application/voicexml+xml",
  war: "application/java-archive",
  wasm: "application/wasm",
  wav: "audio/wav",
  weba: "audio/webm",
  webm: "video/webm",
  webmanifest: "application/manifest+json",
  webp: "image/webp",
  wgsl: "text/wgsl",
  wgt: "application/widget",
  wif: "application/watcherinfo+xml",
  wmf: "image/wmf",
  woff: "font/woff",
  woff2: "font/woff2",
  wrl: "model/vrml",
  wsdl: "application/wsdl+xml",
  wspolicy: "application/wspolicy+xml",
  x3d: "model/x3d+xml",
  x3db: "model/x3d+fastinfoset",
  x3dbz: "model/x3d+binary",
  x3dv: "model/x3d-vrml",
  x3dvz: "model/x3d+vrml",
  x3dz: "model/x3d+xml",
  xaml: "application/xaml+xml",
  xav: "application/xcap-att+xml",
  xca: "application/xcap-caps+xml",
  xcs: "application/calendar+xml",
  xdf: "application/xcap-diff+xml",
  xdssc: "application/dssc+xml",
  xel: "application/xcap-el+xml",
  xenc: "application/xenc+xml",
  xer: "application/patch-ops-error+xml",
  xfdf: "application/xfdf",
  xht: "application/xhtml+xml",
  xhtml: "application/xhtml+xml",
  xhvml: "application/xv+xml",
  xlf: "application/xliff+xml",
  xm: "audio/xm",
  xml: "text/xml",
  xns: "application/xcap-ns+xml",
  xop: "application/xop+xml",
  xpl: "application/xproc+xml",
  xsd: "application/xml",
  xsf: "application/prs.xsf+xml",
  xsl: "application/xml",
  xslt: "application/xml",
  xspf: "application/xspf+xml",
  xvm: "application/xv+xml",
  xvml: "application/xv+xml",
  yaml: "text/yaml",
  yang: "application/yang",
  yin: "application/yin+xml",
  yml: "text/yaml",
  zip: "application/zip"
};
function I0(e) {
  let t = ("" + e).trim().toLowerCase(), r = t.lastIndexOf(".");
  return R0[~r ? t.substring(++r) : t];
}
const j0 = () => {
};
function N0(e, t) {
  for (let r = 0; r < t.length; r++)
    if (t[r].test(e)) return !0;
}
function ki(e, t) {
  let r = 0, n, a = e.length - 1;
  e.charCodeAt(a) === 47 && (e = e.substring(0, a));
  let s = [], o = `${e}/index`;
  for (; r < t.length; r++)
    n = t[r] ? `.${t[r]}` : "", e && s.push(e + n), s.push(o + n);
  return s;
}
function O0(e, t, r) {
  let n = 0, a, s = ki(t, r);
  for (; n < s.length; n++)
    if (a = e[s[n]]) return a;
}
function T0(e, t, r, n) {
  let a = 0, s = ki(r, n), o, c, i, u;
  for (; a < s.length; a++)
    if (o = Ui(Fi(e, i = s[a])), o.startsWith(e) && Sn.existsSync(o)) {
      if (c = Sn.statSync(o), c.isDirectory()) continue;
      return u = Ci(i, c, t), u["Cache-Control"] = t ? "no-cache" : "no-store", { abs: o, stats: c, headers: u };
    }
}
function A0(e, t) {
  return t.statusCode = 404, t.end();
}
function k0(e, t, r, n, a) {
  let s = 200, o, c = {};
  a = { ...a };
  for (let i in a)
    o = t.getHeader(i), o && (a[i] = o);
  if ((o = t.getHeader("content-type")) && (a["Content-Type"] = o), e.headers.range) {
    s = 206;
    let [i, u] = e.headers.range.replace("bytes=", "").split("-"), l = c.end = parseInt(u, 10) || n.size - 1, f = c.start = parseInt(i, 10) || 0;
    if (l >= n.size && (l = n.size - 1), f >= n.size)
      return t.setHeader("Content-Range", `bytes */${n.size}`), t.statusCode = 416, t.end();
    a["Content-Range"] = `bytes ${f}-${l}/${n.size}`, a["Content-Length"] = l - f + 1, a["Accept-Ranges"] = "bytes";
  }
  t.writeHead(s, a), Sn.createReadStream(r, c).pipe(t);
}
const C0 = {
  ".br": "br",
  ".gz": "gzip"
};
function Ci(e, t, r) {
  let n = C0[e.slice(-3)], a = I0(e.slice(0, n && -3)) || "";
  a === "text/html" && (a += ";charset=utf-8");
  let s = {
    "Content-Length": t.size,
    "Content-Type": a,
    "Last-Modified": t.mtime.toUTCString()
  };
  return n && (s["Content-Encoding"] = n), r && (s.ETag = `W/"${t.size}-${t.mtime.getTime()}"`), s;
}
function x0(e, t = {}) {
  e = Vi(e || ".");
  let r = t.onNoMatch || A0, n = t.setHeaders || j0, a = t.extensions || ["html", "htm"], s = t.gzip && a.map((v) => `${v}.gz`).concat("gz"), o = t.brotli && a.map((v) => `${v}.br`).concat("br");
  const c = {};
  let i = "/", u = !!t.etag, l = !!t.single;
  if (typeof t.single == "string") {
    let v = t.single.lastIndexOf(".");
    i += ~v ? t.single.substring(0, v) : t.single;
  }
  let f = [];
  t.ignores !== !1 && (f.push(/[/]([A-Za-z\s\d~$._-]+\.\w+){1,}$/), t.dotfiles ? f.push(/\/\.\w/) : f.push(/\/\.well-known/), [].concat(t.ignores || []).forEach((v) => {
    f.push(new RegExp(v, "i"));
  }));
  let E = t.maxAge != null && `public,max-age=${t.maxAge}`;
  E && t.immutable ? E += ",immutable" : E && t.maxAge === 0 && (E += ",must-revalidate"), t.dev || Ai(e, (v, y, _) => {
    if (!/\.well-known[\\+\/]/.test(v)) {
      if (!t.dotfiles && /(^\.|[\\+|\/+]\.)/.test(v)) return;
    }
    let m = Ci(v, _, u);
    E && (m["Cache-Control"] = E), c["/" + v.normalize().replace(/\\+/g, "/")] = { abs: y, stats: _, headers: m };
  });
  let h = t.dev ? T0.bind(0, e, u) : O0.bind(0, c);
  return function(v, y, _) {
    let m = [""], w = P0(v).pathname, R = v.headers["accept-encoding"] || "";
    if (s && R.includes("gzip") && m.unshift(...s), o && /(br|brotli)/i.test(R) && m.unshift(...o), m.push(...a), w.indexOf("%") !== -1)
      try {
        w = decodeURI(w);
      } catch {
      }
    let N = h(w, m) || l && !N0(w, f) && h(i, m);
    if (!N) return _ ? _() : r(v, y);
    if (u && v.headers["if-none-match"] === N.headers.ETag)
      return y.writeHead(304), y.end();
    (s || o) && y.setHeader("Vary", "Accept-Encoding"), n(y, w, N.stats), k0(v, y, N.abs, N.stats, N.headers);
  };
}
const D0 = Hi(import.meta.url), Ya = K.dirname(Ki(import.meta.url));
Ne.setAppUserModelId("com.haydncom.tabzero");
D0("electron-squirrel-startup") && Ne.quit();
process.env.APP_ROOT = K.join(Ya, "..");
const L0 = x0(K.join(Ya, "../dist"), {
  single: !0
}), M0 = Wi.createServer((e, t) => L0(e, t)), jr = process.env.VITE_DEV_SERVER_URL, ev = K.join(process.env.APP_ROOT, "dist-electron"), xi = K.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = jr ? K.join(process.env.APP_ROOT, "public") : xi;
let ie;
$c();
function Mn() {
  ie = new $o({
    icon: K.join(process.env.VITE_PUBLIC, "icon.png"),
    webPreferences: {
      preload: K.join(Ya, "preload.mjs"),
      webSecurity: !1,
      devTools: !0
    },
    autoHideMenuBar: !0
  }), ie.webContents.on("did-finish-load", () => {
    ie == null || ie.webContents.send("main-process-message", { hello: "world" });
  }), console.log("RENDERER_DIST", xi), jr ? ie.loadURL(jr) : ie.loadURL("http://localhost:11599"), _0(ie), w0(ie), S0(ie);
}
Ne.on("window-all-closed", () => {
  process.platform !== "darwin" && (Ne.quit(), ie = null);
});
Ne.on("activate", () => {
  $o.getAllWindows().length === 0 && Mn();
});
v0();
Rc();
if (!Ne.requestSingleInstanceLock())
  Ne.quit();
else {
  const e = async (t) => {
    if (!ie) return;
    const r = t.find((n) => n.startsWith(`${Ja}://`));
    r && Ti(ie, r);
  };
  Ne.on("second-instance", (t, r) => {
    e(r), ie && (ie.isMinimized() && ie.restore(), ie.focus());
  }), Ne.whenReady().then(() => {
    jr ? (Mn(), e(process.argv)) : M0.listen(11599, () => {
      Mn(), e(process.argv);
    });
  });
}
export {
  ev as MAIN_DIST,
  xi as RENDERER_DIST,
  jr as VITE_DEV_SERVER_URL
};
