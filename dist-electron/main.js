var si = Object.defineProperty;
var Ls = (e) => {
  throw TypeError(e);
};
var ai = (e, t, r) => t in e ? si(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var Mt = (e, t, r) => ai(e, typeof t != "symbol" ? t + "" : t, r), Ms = (e, t, r) => t.has(e) || Ls("Cannot " + r);
var se = (e, t, r) => (Ms(e, t, "read from private field"), r ? r.call(e) : t.get(e)), Vt = (e, t, r) => t.has(e) ? Ls("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), Ut = (e, t, r, n) => (Ms(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r);
import Sn, { ipcMain as Sr, shell as oi, app as Me, globalShortcut as Pr, BrowserWindow as Ya } from "electron";
import Za from "node:assert";
import B from "node:fs";
import Yt from "node:os";
import Y from "node:path";
import ii, { promisify as pe, isDeepStrictEqual as ci } from "node:util";
import { createRequire as ui } from "node:module";
import { fileURLToPath as li } from "node:url";
import ue from "node:process";
import zt from "node:crypto";
var Vs = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Qa(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Zt = {}, Rt = 1e3, It = Rt * 60, Nt = It * 60, ft = Nt * 24, di = ft * 7, fi = ft * 365.25, hi = function(e, t) {
  t = t || {};
  var r = typeof e;
  if (r === "string" && e.length > 0)
    return mi(e);
  if (r === "number" && isFinite(e))
    return t.long ? $i(e) : pi(e);
  throw new Error(
    "val is not a non-empty string or a valid number. val=" + JSON.stringify(e)
  );
};
function mi(e) {
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
          return r * fi;
        case "weeks":
        case "week":
        case "w":
          return r * di;
        case "days":
        case "day":
        case "d":
          return r * ft;
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
function pi(e) {
  var t = Math.abs(e);
  return t >= ft ? Math.round(e / ft) + "d" : t >= Nt ? Math.round(e / Nt) + "h" : t >= It ? Math.round(e / It) + "m" : t >= Rt ? Math.round(e / Rt) + "s" : e + "ms";
}
function $i(e) {
  var t = Math.abs(e);
  return t >= ft ? nr(e, t, ft, "day") : t >= Nt ? nr(e, t, Nt, "hour") : t >= It ? nr(e, t, It, "minute") : t >= Rt ? nr(e, t, Rt, "second") : e + " ms";
}
function nr(e, t, r, n) {
  var s = t >= r * 1.5;
  return Math.round(e / r) + " " + n + (s ? "s" : "");
}
var yi = Ei, gi = /^(?:\w+:)?\/\/(\S+)$/, vi = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/, _i = /^[^\s\.]+\.\S{2,}$/;
function Ei(e) {
  if (typeof e != "string")
    return !1;
  var t = e.match(gi);
  if (!t)
    return !1;
  var r = t[1];
  return r ? !!(vi.test(r) || _i.test(r)) : !1;
}
var wi = yi, bi = /(?:(?:[^:]+:)?[/][/])?(?:.+@)?([^/]+)([/][^?#]+)/, Si = function(e, t) {
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
    if (e = e.replace(/^git\+/, ""), !wi(e))
      return null;
    var c = e.match(bi) || [], i = c[1], o = c[2];
    if (!i || i !== "github.com" && i !== "www.github.com" && !t.enterprise)
      return null;
    var l = o.match(/^\/([\w-_]+)\/([\w-_\.]+)(\/tree\/[\%\w-_\.\/]+)?(\/blob\/[\%\w-_\.\/]+)?/);
    if (!l)
      return null;
    if (r.user = l[1], r.repo = l[2].replace(/\.git$/i, ""), r.host = i || "github.com", l[3] && /^\/tree\/master\//.test(l[3]))
      r.branch = "master", r.path = l[3].replace(/\/$/, "");
    else if (l[3]) {
      var u = l[3].replace(/^\/tree\//, "").match(/[\%\w-_.]*\/?[\%\w-_]+/);
      r.branch = u && u[0];
    } else if (l[4]) {
      var u = l[4].replace(/^\/blob\//, "").match(/[\%\w-_.]*\/?[\%\w-_]+/);
      r.branch = u && u[0];
    } else
      r.branch = "master";
  }
  return r.host === "github.com" ? r.apiHost = "api.github.com" : r.apiHost = r.host + "/api/v3", r.tarball_url = "https://" + r.apiHost + "/repos/" + r.user + "/" + r.repo + "/tarball/" + r.branch, r.clone_url = "https://" + r.host + "/" + r.user + "/" + r.repo, r.branch === "master" ? (r.https_url = "https://" + r.host + "/" + r.user + "/" + r.repo, r.travis_url = "https://travis-ci.org/" + r.user + "/" + r.repo, r.zip_url = "https://" + r.host + "/" + r.user + "/" + r.repo + "/archive/master.zip") : (r.https_url = "https://" + r.host + "/" + r.user + "/" + r.repo + "/blob/" + r.branch, r.travis_url = "https://travis-ci.org/" + r.user + "/" + r.repo + "?branch=" + r.branch, r.zip_url = "https://" + r.host + "/" + r.user + "/" + r.repo + "/archive/" + r.branch + ".zip"), r.path && (r.https_url += r.path), r.api_url = "https://" + r.apiHost + "/repos/" + r.user + "/" + r.repo, r;
};
const Pi = "update-electron-app", Ri = "3.1.1", Ii = {
  name: Pi,
  version: Ri
};
var Ot = Vs && Vs.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Zt, "__esModule", { value: !0 });
Zt.UpdateSourceType = void 0;
var Ni = Zt.updateElectronApp = Di;
Zt.makeUserNotifier = to;
const eo = Ot(hi), Oi = Ot(Si), rt = Ot(Za), Ti = Ot(B), Us = Ot(Yt), ji = Ot(Y), Ai = ii, Ee = Sn;
var dt;
(function(e) {
  e[e.ElectronPublicUpdateService = 0] = "ElectronPublicUpdateService", e[e.StaticStorage = 1] = "StaticStorage";
})(dt || (Zt.UpdateSourceType = dt = {}));
const zs = Ii, ki = (0, Ai.format)("%s/%s (%s: %s)", zs.name, zs.version, Us.default.platform(), Us.default.arch()), Ci = ["darwin", "win32"], Fs = (e) => {
  try {
    const { protocol: t } = new URL(e);
    return t === "https:";
  } catch {
    return !1;
  }
};
function Di(e = {}) {
  const t = Mi(e);
  if (!Ee.app.isPackaged) {
    const r = "update-electron-app config looks good; aborting updates since app is in development mode";
    e.logger ? e.logger.log(r) : console.log(r);
    return;
  }
  Ee.app.isReady() ? qs(t) : Ee.app.on("ready", () => qs(t));
}
function qs(e) {
  const { updateSource: t, updateInterval: r, logger: n } = e;
  if (!Ci.includes(process == null ? void 0 : process.platform)) {
    i(`Electron's autoUpdater does not support the '${process.platform}' platform. Ref: https://www.electronjs.org/docs/latest/api/auto-updater#platform-notices`);
    return;
  }
  let s, a = "default";
  switch (t.type) {
    case dt.ElectronPublicUpdateService: {
      s = `${t.host}/${t.repo}/${process.platform}-${process.arch}/${Ee.app.getVersion()}`;
      break;
    }
    case dt.StaticStorage: {
      s = t.baseUrl, process.platform === "darwin" && (s += "/RELEASES.json", a = "json");
      break;
    }
  }
  const c = { "User-Agent": ki };
  function i(...o) {
    n.log(...o);
  }
  i("feedURL", s), i("requestHeaders", c), Ee.autoUpdater.setFeedURL({
    url: s,
    headers: c,
    serverType: a
  }), Ee.autoUpdater.on("error", (o) => {
    i("updater error"), i(o);
  }), Ee.autoUpdater.on("checking-for-update", () => {
    i("checking-for-update");
  }), Ee.autoUpdater.on("update-available", () => {
    i("update-available; downloading...");
  }), Ee.autoUpdater.on("update-not-available", () => {
    i("update-not-available");
  }), e.notifyUser && Ee.autoUpdater.on("update-downloaded", (o, l, u, f, g) => {
    i("update-downloaded", [o, l, u, f, g]), typeof e.onNotifyUser != "function" ? ((0, rt.default)(e.onNotifyUser === void 0, "onNotifyUser option must be a callback function or undefined"), i("update-downloaded: notifyUser is true, opening default dialog"), e.onNotifyUser = to()) : i("update-downloaded: notifyUser is true, running custom onNotifyUser callback"), e.onNotifyUser({
      event: o,
      releaseNotes: l,
      releaseDate: f,
      releaseName: u,
      updateURL: g
    });
  }), Ee.autoUpdater.checkForUpdates(), setInterval(() => {
    Ee.autoUpdater.checkForUpdates();
  }, (0, eo.default)(r));
}
function to(e) {
  const r = Object.assign({}, {
    title: "Application Update",
    detail: "A new version has been downloaded. Restart the application to apply the updates.",
    restartButtonText: "Restart",
    laterButtonText: "Later"
  }, e);
  return (n) => {
    const { releaseNotes: s, releaseName: a } = n, { title: c, restartButtonText: i, laterButtonText: o, detail: l } = r, u = {
      type: "info",
      buttons: [i, o],
      title: c,
      message: process.platform === "win32" ? s : a,
      detail: l
    };
    Ee.dialog.showMessageBox(u).then(({ response: f }) => {
      f === 0 && Ee.autoUpdater.quitAndInstall();
    });
  };
}
function Li() {
  var e;
  const t = Ti.default.readFileSync(ji.default.join(Ee.app.getAppPath(), "package.json")), r = JSON.parse(t.toString()), n = ((e = r.repository) === null || e === void 0 ? void 0 : e.url) || r.repository, s = (0, Oi.default)(n);
  return (0, rt.default)(s, "repo not found. Add repository string to your app's package.json file"), `${s.user}/${s.repo}`;
}
function Mi(e) {
  var t;
  const r = {
    host: "https://update.electronjs.org",
    updateInterval: "10 minutes",
    logger: console,
    notifyUser: !0
  }, { host: n, updateInterval: s, logger: a, notifyUser: c, onNotifyUser: i } = Object.assign({}, r, e);
  let o = e.updateSource;
  switch (o || (o = {
    type: dt.ElectronPublicUpdateService,
    repo: e.repo || Li(),
    host: n
  }), o.type) {
    case dt.ElectronPublicUpdateService: {
      (0, rt.default)((t = o.repo) === null || t === void 0 ? void 0 : t.includes("/"), "repo is required and should be in the format `owner/repo`"), o.host || (o.host = n), (0, rt.default)(o.host && Fs(o.host), "host must be a valid HTTPS URL");
      break;
    }
    case dt.StaticStorage: {
      (0, rt.default)(o.baseUrl && Fs(o.baseUrl), "baseUrl must be a valid HTTPS URL");
      break;
    }
  }
  return (0, rt.default)(typeof s == "string" && s.match(/^\d+/), "updateInterval must be a human-friendly string interval like `20 minutes`"), (0, rt.default)((0, eo.default)(s) >= 5 * 60 * 1e3, "updateInterval must be `5 minutes` or more"), (0, rt.default)(a && typeof a.log, "function"), { updateSource: o, updateInterval: s, logger: a, notifyUser: c, onNotifyUser: i };
}
const Vi = () => {
  Sr.handle("open-external", (e, t) => oi.openExternal(t));
}, Pn = "tabzero", ro = async (e, t) => {
  const r = new URL(t);
  if (!r.protocol.startsWith(Pn)) return "not a valid url";
  const n = new URLSearchParams(r.search), s = n.get("code"), a = n.get("scope");
  if (!s || !a) return "no scope or code";
  e.webContents.send("auth", { code: s, scope: a });
}, Ui = (e) => {
  Me.setAsDefaultProtocolClient(Pn), Me.on("open-url", async (t, r) => {
    ro(e, r);
  });
}, zi = (e) => {
  try {
    return Pr.register(e, () => {
    }), Pr.unregister(e), !0;
  } catch {
    return !1;
  }
}, Fi = (e) => {
  const t = {};
  Sr.handle(
    "register-hotkey",
    (r, n) => {
      if (!zi(n.keys))
        return console.error(`[Hotkey] Invalid accelerator: ${n.keys}`), !1;
      const s = t[n.name];
      return s && Pr.unregister(s), t[n.name] = n.keys, Pr.register(n.keys, () => {
        console.log(`[Hotkey] ${n.name}`), e.webContents.send("hotkey", n.name);
      }), !0;
    }
  );
}, ht = (e) => {
  const t = typeof e;
  return e !== null && (t === "object" || t === "function");
}, xr = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), qi = new Set("0123456789");
function Tr(e) {
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
        if (xr.has(r))
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
          if (xr.has(r))
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
      if (xr.has(r))
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
function Rn(e, t) {
  if (typeof t != "number" && Array.isArray(e)) {
    const r = Number.parseInt(t, 10);
    return Number.isInteger(r) && e[r] === e[t];
  }
  return !1;
}
function no(e, t) {
  if (Rn(e, t))
    throw new Error("Cannot use string index");
}
function Gi(e, t, r) {
  if (!ht(e) || typeof t != "string")
    return r === void 0 ? e : r;
  const n = Tr(t);
  if (n.length === 0)
    return r;
  for (let s = 0; s < n.length; s++) {
    const a = n[s];
    if (Rn(e, a) ? e = s === n.length - 1 ? void 0 : null : e = e[a], e == null) {
      if (s !== n.length - 1)
        return r;
      break;
    }
  }
  return e === void 0 ? r : e;
}
function Gs(e, t, r) {
  if (!ht(e) || typeof t != "string")
    return e;
  const n = e, s = Tr(t);
  for (let a = 0; a < s.length; a++) {
    const c = s[a];
    no(e, c), a === s.length - 1 ? e[c] = r : ht(e[c]) || (e[c] = typeof s[a + 1] == "number" ? [] : {}), e = e[c];
  }
  return n;
}
function Ki(e, t) {
  if (!ht(e) || typeof t != "string")
    return !1;
  const r = Tr(t);
  for (let n = 0; n < r.length; n++) {
    const s = r[n];
    if (no(e, s), n === r.length - 1)
      return delete e[s], !0;
    if (e = e[s], !ht(e))
      return !1;
  }
}
function Hi(e, t) {
  if (!ht(e) || typeof t != "string")
    return !1;
  const r = Tr(t);
  if (r.length === 0)
    return !1;
  for (const n of r) {
    if (!ht(e) || !(n in e) || Rn(e, n))
      return !1;
    e = e[n];
  }
  return !0;
}
const nt = Yt.homedir(), In = Yt.tmpdir(), { env: bt } = ue, Xi = (e) => {
  const t = Y.join(nt, "Library");
  return {
    data: Y.join(t, "Application Support", e),
    config: Y.join(t, "Preferences", e),
    cache: Y.join(t, "Caches", e),
    log: Y.join(t, "Logs", e),
    temp: Y.join(In, e)
  };
}, Bi = (e) => {
  const t = bt.APPDATA || Y.join(nt, "AppData", "Roaming"), r = bt.LOCALAPPDATA || Y.join(nt, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: Y.join(r, e, "Data"),
    config: Y.join(t, e, "Config"),
    cache: Y.join(r, e, "Cache"),
    log: Y.join(r, e, "Log"),
    temp: Y.join(In, e)
  };
}, Wi = (e) => {
  const t = Y.basename(nt);
  return {
    data: Y.join(bt.XDG_DATA_HOME || Y.join(nt, ".local", "share"), e),
    config: Y.join(bt.XDG_CONFIG_HOME || Y.join(nt, ".config"), e),
    cache: Y.join(bt.XDG_CACHE_HOME || Y.join(nt, ".cache"), e),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: Y.join(bt.XDG_STATE_HOME || Y.join(nt, ".local", "state"), e),
    temp: Y.join(In, t, e)
  };
};
function Ji(e, { suffix: t = "nodejs" } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  return t && (e += `-${t}`), ue.platform === "darwin" ? Xi(e) : ue.platform === "win32" ? Bi(e) : Wi(e);
}
const xe = (e, t) => function(...n) {
  return e.apply(void 0, n).catch(t);
}, qe = (e, t) => function(...n) {
  try {
    return e.apply(void 0, n);
  } catch (s) {
    return t(s);
  }
}, xi = ue.getuid ? !ue.getuid() : !1, Yi = 1e4, Ie = () => {
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
const Qi = new Zi(), Ye = (e, t) => function(n) {
  return function s(...a) {
    return Qi.schedule().then((c) => {
      const i = (l) => (c(), l), o = (l) => {
        if (c(), Date.now() >= n)
          throw l;
        if (t(l)) {
          const u = Math.round(100 * Math.random());
          return new Promise((g) => setTimeout(g, u)).then(() => s.apply(void 0, a));
        }
        throw l;
      };
      return e.apply(void 0, a).then(i, o);
    });
  };
}, Ze = (e, t) => function(n) {
  return function s(...a) {
    try {
      return e.apply(void 0, a);
    } catch (c) {
      if (Date.now() > n)
        throw c;
      if (t(c))
        return s.apply(void 0, a);
      throw c;
    }
  };
}, ye = {
  attempt: {
    /* ASYNC */
    chmod: xe(pe(B.chmod), ae.onChangeError),
    chown: xe(pe(B.chown), ae.onChangeError),
    close: xe(pe(B.close), Ie),
    fsync: xe(pe(B.fsync), Ie),
    mkdir: xe(pe(B.mkdir), Ie),
    realpath: xe(pe(B.realpath), Ie),
    stat: xe(pe(B.stat), Ie),
    unlink: xe(pe(B.unlink), Ie),
    /* SYNC */
    chmodSync: qe(B.chmodSync, ae.onChangeError),
    chownSync: qe(B.chownSync, ae.onChangeError),
    closeSync: qe(B.closeSync, Ie),
    existsSync: qe(B.existsSync, Ie),
    fsyncSync: qe(B.fsync, Ie),
    mkdirSync: qe(B.mkdirSync, Ie),
    realpathSync: qe(B.realpathSync, Ie),
    statSync: qe(B.statSync, Ie),
    unlinkSync: qe(B.unlinkSync, Ie)
  },
  retry: {
    /* ASYNC */
    close: Ye(pe(B.close), ae.isRetriableError),
    fsync: Ye(pe(B.fsync), ae.isRetriableError),
    open: Ye(pe(B.open), ae.isRetriableError),
    readFile: Ye(pe(B.readFile), ae.isRetriableError),
    rename: Ye(pe(B.rename), ae.isRetriableError),
    stat: Ye(pe(B.stat), ae.isRetriableError),
    write: Ye(pe(B.write), ae.isRetriableError),
    writeFile: Ye(pe(B.writeFile), ae.isRetriableError),
    /* SYNC */
    closeSync: Ze(B.closeSync, ae.isRetriableError),
    fsyncSync: Ze(B.fsyncSync, ae.isRetriableError),
    openSync: Ze(B.openSync, ae.isRetriableError),
    readFileSync: Ze(B.readFileSync, ae.isRetriableError),
    renameSync: Ze(B.renameSync, ae.isRetriableError),
    statSync: Ze(B.statSync, ae.isRetriableError),
    writeSync: Ze(B.writeSync, ae.isRetriableError),
    writeFileSync: Ze(B.writeFileSync, ae.isRetriableError)
  }
}, ec = "utf8", Ks = 438, tc = 511, rc = {}, nc = Yt.userInfo().uid, sc = Yt.userInfo().gid, ac = 1e3, oc = !!ue.getuid;
ue.getuid && ue.getuid();
const Hs = 128, ic = (e) => e instanceof Error && "code" in e, Xs = (e) => typeof e == "string", Yr = (e) => e === void 0, cc = ue.platform === "linux", so = ue.platform === "win32", Nn = ["SIGABRT", "SIGALRM", "SIGHUP", "SIGINT", "SIGTERM"];
so || Nn.push("SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
cc && Nn.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT", "SIGUNUSED");
class uc {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (t) => {
      if (!this.exited) {
        this.exited = !0;
        for (const r of this.callbacks)
          r();
        t && (so && t !== "SIGINT" && t !== "SIGTERM" && t !== "SIGKILL" ? ue.kill(ue.pid, "SIGTERM") : ue.kill(ue.pid, t));
      }
    }, this.hook = () => {
      ue.once("exit", () => this.exit());
      for (const t of Nn)
        try {
          ue.once(t, () => this.exit(t));
        } catch {
        }
    }, this.register = (t) => (this.callbacks.add(t), () => {
      this.callbacks.delete(t);
    }), this.hook();
  }
}
const lc = new uc(), dc = lc.register, ge = {
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
    if (t.length <= Hs)
      return e;
    const r = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(t);
    if (!r)
      return e;
    const n = t.length - Hs;
    return `${e.slice(0, -t.length)}${r[1]}${r[2].slice(0, -n)}${r[3]}`;
  }
};
dc(ge.purgeSyncAll);
function ao(e, t, r = rc) {
  if (Xs(r))
    return ao(e, t, { encoding: r });
  const n = Date.now() + ((r.timeout ?? ac) || -1);
  let s = null, a = null, c = null;
  try {
    const i = ye.attempt.realpathSync(e), o = !!i;
    e = i || e, [a, s] = ge.get(e, r.tmpCreate || ge.create, r.tmpPurge !== !1);
    const l = oc && Yr(r.chown), u = Yr(r.mode);
    if (o && (l || u)) {
      const f = ye.attempt.statSync(e);
      f && (r = { ...r }, l && (r.chown = { uid: f.uid, gid: f.gid }), u && (r.mode = f.mode));
    }
    if (!o) {
      const f = Y.dirname(e);
      ye.attempt.mkdirSync(f, {
        mode: tc,
        recursive: !0
      });
    }
    c = ye.retry.openSync(n)(a, "w", r.mode || Ks), r.tmpCreated && r.tmpCreated(a), Xs(t) ? ye.retry.writeSync(n)(c, t, 0, r.encoding || ec) : Yr(t) || ye.retry.writeSync(n)(c, t, 0, t.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? ye.retry.fsyncSync(n)(c) : ye.attempt.fsync(c)), ye.retry.closeSync(n)(c), c = null, r.chown && (r.chown.uid !== nc || r.chown.gid !== sc) && ye.attempt.chownSync(a, r.chown.uid, r.chown.gid), r.mode && r.mode !== Ks && ye.attempt.chmodSync(a, r.mode);
    try {
      ye.retry.renameSync(n)(a, e);
    } catch (f) {
      if (!ic(f) || f.code !== "ENAMETOOLONG")
        throw f;
      ye.retry.renameSync(n)(a, ge.truncate(e));
    }
    s(), a = null;
  } finally {
    c && ye.attempt.closeSync(c), a && ge.purge(a);
  }
}
var dn = { exports: {} }, On = {}, Ge = {}, ot = {}, Qt = {}, H = {}, xt = {};
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
      i(N, S[j]), N.push(p[++j]);
    return new n(N);
  }
  e._ = s;
  const a = new n("+");
  function c(p, ...S) {
    const N = [m(p[0])];
    let j = 0;
    for (; j < S.length; )
      N.push(a), i(N, S[j]), N.push(a, m(p[++j]));
    return o(N), new n(N);
  }
  e.str = c;
  function i(p, S) {
    S instanceof n ? p.push(...S._items) : S instanceof r ? p.push(S) : p.push(f(S));
  }
  e.addCodeArg = i;
  function o(p) {
    let S = 1;
    for (; S < p.length - 1; ) {
      if (p[S] === a) {
        const N = l(p[S - 1], p[S + 1]);
        if (N !== void 0) {
          p.splice(S - 1, 3, N);
          continue;
        }
        p[S++] = "+";
      }
      S++;
    }
  }
  function l(p, S) {
    if (S === '""')
      return p;
    if (p === '""')
      return S;
    if (typeof p == "string")
      return S instanceof r || p[p.length - 1] !== '"' ? void 0 : typeof S != "string" ? `${p.slice(0, -1)}${S}"` : S[0] === '"' ? p.slice(0, -1) + S.slice(1) : void 0;
    if (typeof S == "string" && S[0] === '"' && !(p instanceof r))
      return `"${p}${S.slice(1)}`;
  }
  function u(p, S) {
    return S.emptyStr() ? p : p.emptyStr() ? S : c`${p}${S}`;
  }
  e.strConcat = u;
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
})(xt);
var fn = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = xt;
  class r extends Error {
    constructor(l) {
      super(`CodeGen: "code" for ${l} not defined`), this.value = l.value;
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
    constructor({ prefixes: l, parent: u } = {}) {
      this._names = {}, this._prefixes = l, this._parent = u;
    }
    toName(l) {
      return l instanceof t.Name ? l : this.name(l);
    }
    name(l) {
      return new t.Name(this._newName(l));
    }
    _newName(l) {
      const u = this._names[l] || this._nameGroup(l);
      return `${l}${u.index++}`;
    }
    _nameGroup(l) {
      var u, f;
      if (!((f = (u = this._parent) === null || u === void 0 ? void 0 : u._prefixes) === null || f === void 0) && f.has(l) || this._prefixes && !this._prefixes.has(l))
        throw new Error(`CodeGen: prefix "${l}" is not allowed in this scope`);
      return this._names[l] = { prefix: l, index: 0 };
    }
  }
  e.Scope = s;
  class a extends t.Name {
    constructor(l, u) {
      super(u), this.prefix = l;
    }
    setValue(l, { property: u, itemIndex: f }) {
      this.value = l, this.scopePath = (0, t._)`.${new t.Name(u)}[${f}]`;
    }
  }
  e.ValueScopeName = a;
  const c = (0, t._)`\n`;
  class i extends s {
    constructor(l) {
      super(l), this._values = {}, this._scope = l.scope, this.opts = { ...l, _n: l.lines ? c : t.nil };
    }
    get() {
      return this._scope;
    }
    name(l) {
      return new a(l, this._newName(l));
    }
    value(l, u) {
      var f;
      if (u.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const g = this.toName(l), { prefix: m } = g, v = (f = u.key) !== null && f !== void 0 ? f : u.ref;
      let $ = this._values[m];
      if ($) {
        const S = $.get(v);
        if (S)
          return S;
      } else
        $ = this._values[m] = /* @__PURE__ */ new Map();
      $.set(v, g);
      const w = this._scope[m] || (this._scope[m] = []), p = w.length;
      return w[p] = u.ref, g.setValue(u, { property: m, itemIndex: p }), g;
    }
    getValue(l, u) {
      const f = this._values[l];
      if (f)
        return f.get(u);
    }
    scopeRefs(l, u = this._values) {
      return this._reduceValues(u, (f) => {
        if (f.scopePath === void 0)
          throw new Error(`CodeGen: name "${f}" has no value`);
        return (0, t._)`${l}${f.scopePath}`;
      });
    }
    scopeCode(l = this._values, u, f) {
      return this._reduceValues(l, (g) => {
        if (g.value === void 0)
          throw new Error(`CodeGen: name "${g}" has no value`);
        return g.value.code;
      }, u, f);
    }
    _reduceValues(l, u, f = {}, g) {
      let m = t.nil;
      for (const v in l) {
        const $ = l[v];
        if (!$)
          continue;
        const w = f[v] = f[v] || /* @__PURE__ */ new Map();
        $.forEach((p) => {
          if (w.has(p))
            return;
          w.set(p, n.Started);
          let S = u(p);
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
  e.ValueScope = i;
})(fn);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = xt, r = fn;
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
  var s = fn;
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
  class c extends a {
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
  class i extends a {
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
  class o extends i {
    constructor(d, h, R, U) {
      super(d, R, U), this.op = h;
    }
    render({ _n: d }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + d;
    }
  }
  class l extends a {
    constructor(d) {
      super(), this.label = d, this.names = {};
    }
    render({ _n: d }) {
      return `${this.label}:` + d;
    }
  }
  class u extends a {
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
  class me extends v {
    constructor(d) {
      super(), this.error = d;
    }
    render(d) {
      return `catch(${this.error})` + super.render(d);
    }
  }
  me.kind = "catch";
  class _e extends v {
    render(d) {
      return "finally" + super.render(d);
    }
  }
  _e.kind = "finally";
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
      return R !== void 0 && U && (this._constants[q.str] = R), this._leafNode(new c(d, q, R)), q;
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
      return this._leafNode(new i(d, h, R));
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
      return this._leafNode(new l(d));
    }
    // `break` statement
    break(d) {
      return this._leafNode(new u(d));
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
        this._currNode = U.catch = new me(q), h(q);
      }
      return R && (this._currNode = U.finally = new _e(), this.code(R)), this._endBlockNode(me, _e);
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
const re = H, fc = xt;
function hc(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
C.toHash = hc;
function mc(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (oo(e, t), !io(t, e.self.RULES.all));
}
C.alwaysValidSchema = mc;
function oo(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in t)
    s[a] || lo(e, `unknown keyword: "${a}"`);
}
C.checkUnknownRules = oo;
function io(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
C.schemaHasRules = io;
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
  return co(decodeURIComponent(e));
}
C.unescapeFragment = yc;
function gc(e) {
  return encodeURIComponent(Tn(e));
}
C.escapeFragment = gc;
function Tn(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
C.escapeJsonPointer = Tn;
function co(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
C.unescapeJsonPointer = co;
function vc(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
C.eachItem = vc;
function Bs({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, a, c, i) => {
    const o = c === void 0 ? a : c instanceof re.Name ? (a instanceof re.Name ? e(s, a, c) : t(s, a, c), c) : a instanceof re.Name ? (t(s, c, a), a) : r(a, c);
    return i === re.Name && !(o instanceof re.Name) ? n(s, o) : o;
  };
}
C.mergeEvaluated = {
  props: Bs({
    mergeNames: (e, t, r) => e.if((0, re._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, re._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, re._)`${r} || {}`).code((0, re._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, re._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, re._)`${r} || {}`), jn(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: uo
  }),
  items: Bs({
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
  return t !== void 0 && jn(e, r, t), r;
}
C.evaluatedPropsToName = uo;
function jn(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, re._)`${t}${(0, re.getProperty)(n)}`, !0));
}
C.setEvaluated = jn;
const Ws = {};
function _c(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: Ws[t.code] || (Ws[t.code] = new fc._Code(t.code))
  });
}
C.useFunc = _c;
var hn;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(hn || (C.Type = hn = {}));
function Ec(e, t, r) {
  if (e instanceof re.Name) {
    const n = t === hn.Num;
    return r ? n ? (0, re._)`"[" + ${e} + "]"` : (0, re._)`"['" + ${e} + "']"` : n ? (0, re._)`"/" + ${e}` : (0, re._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, re.getProperty)(e).toString() : "/" + Tn(e);
}
C.getErrorPath = Ec;
function lo(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
C.checkStrictMode = lo;
var Oe = {};
Object.defineProperty(Oe, "__esModule", { value: !0 });
const $e = H, wc = {
  // validation function arguments
  data: new $e.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new $e.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new $e.Name("instancePath"),
  parentData: new $e.Name("parentData"),
  parentDataProperty: new $e.Name("parentDataProperty"),
  rootData: new $e.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new $e.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new $e.Name("vErrors"),
  // null or array of validation errors
  errors: new $e.Name("errors"),
  // counter of validation errors
  this: new $e.Name("this"),
  // "globals"
  self: new $e.Name("self"),
  scope: new $e.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new $e.Name("json"),
  jsonPos: new $e.Name("jsonPos"),
  jsonLen: new $e.Name("jsonLen"),
  jsonPart: new $e.Name("jsonPart")
};
Oe.default = wc;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = H, r = C, n = Oe;
  e.keywordError = {
    message: ({ keyword: w }) => (0, t.str)`must pass "${w}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: w, schemaType: p }) => p ? (0, t.str)`"${w}" keyword must be ${p} ($data)` : (0, t.str)`"${w}" keyword is invalid ($data)`
  };
  function s(w, p = e.keywordError, S, N) {
    const { it: j } = w, { gen: D, compositeRule: Z, allErrors: ee } = j, ie = f(w, p, S);
    N ?? (Z || ee) ? o(D, ie) : l(j, (0, t._)`[${ie}]`);
  }
  e.reportError = s;
  function a(w, p = e.keywordError, S) {
    const { it: N } = w, { gen: j, compositeRule: D, allErrors: Z } = N, ee = f(w, p, S);
    o(j, ee), D || Z || l(N, n.default.vErrors);
  }
  e.reportExtraError = a;
  function c(w, p) {
    w.assign(n.default.errors, p), w.if((0, t._)`${n.default.vErrors} !== null`, () => w.if(p, () => w.assign((0, t._)`${n.default.vErrors}.length`, p), () => w.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = c;
  function i({ gen: w, keyword: p, schemaValue: S, data: N, errsCount: j, it: D }) {
    if (j === void 0)
      throw new Error("ajv implementation error");
    const Z = w.name("err");
    w.forRange("i", j, n.default.errors, (ee) => {
      w.const(Z, (0, t._)`${n.default.vErrors}[${ee}]`), w.if((0, t._)`${Z}.instancePath === undefined`, () => w.assign((0, t._)`${Z}.instancePath`, (0, t.strConcat)(n.default.instancePath, D.errorPath))), w.assign((0, t._)`${Z}.schemaPath`, (0, t.str)`${D.errSchemaPath}/${p}`), D.opts.verbose && (w.assign((0, t._)`${Z}.schema`, S), w.assign((0, t._)`${Z}.data`, N));
    });
  }
  e.extendErrors = i;
  function o(w, p) {
    const S = w.const("err", p);
    w.if((0, t._)`${n.default.vErrors} === null`, () => w.assign(n.default.vErrors, (0, t._)`[${S}]`), (0, t._)`${n.default.vErrors}.push(${S})`), w.code((0, t._)`${n.default.errors}++`);
  }
  function l(w, p) {
    const { gen: S, validateName: N, schemaEnv: j } = w;
    j.$async ? S.throw((0, t._)`new ${w.ValidationError}(${p})`) : (S.assign((0, t._)`${N}.errors`, p), S.return(!1));
  }
  const u = {
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
    return S && (j = (0, t.str)`${j}${(0, r.getErrorPath)(S, r.Type.Str)}`), [u.schemaPath, j];
  }
  function $(w, { params: p, message: S }, N) {
    const { keyword: j, data: D, schemaValue: Z, it: ee } = w, { opts: ie, propertyName: me, topSchemaRef: _e, schemaPath: z } = ee;
    N.push([u.keyword, j], [u.params, typeof p == "function" ? p(w) : p || (0, t._)`{}`]), ie.messages && N.push([u.message, typeof S == "function" ? S(w) : S]), ie.verbose && N.push([u.schema, Z], [u.parentSchema, (0, t._)`${_e}${z}`], [n.default.data, D]), me && N.push([u.propertyName, me]);
  }
})(Qt);
var Js;
function bc() {
  if (Js) return ot;
  Js = 1, Object.defineProperty(ot, "__esModule", { value: !0 }), ot.boolOrEmptySchema = ot.topBoolOrEmptySchema = void 0;
  const e = Qt, t = H, r = Oe, n = {
    message: "boolean schema is false"
  };
  function s(i) {
    const { gen: o, schema: l, validateName: u } = i;
    l === !1 ? c(i, !1) : typeof l == "object" && l.$async === !0 ? o.return(r.default.data) : (o.assign((0, t._)`${u}.errors`, null), o.return(!0));
  }
  ot.topBoolOrEmptySchema = s;
  function a(i, o) {
    const { gen: l, schema: u } = i;
    u === !1 ? (l.var(o, !1), c(i)) : l.var(o, !0);
  }
  ot.boolOrEmptySchema = a;
  function c(i, o) {
    const { gen: l, data: u } = i, f = {
      gen: l,
      keyword: "false schema",
      data: u,
      schema: !1,
      schemaCode: !1,
      schemaValue: !1,
      params: {},
      it: i
    };
    (0, e.reportError)(f, n, void 0, o);
  }
  return ot;
}
var ce = {}, mt = {};
Object.defineProperty(mt, "__esModule", { value: !0 });
mt.getRules = mt.isJSONType = void 0;
const Sc = ["string", "number", "integer", "boolean", "null", "object", "array"], Pc = new Set(Sc);
function Rc(e) {
  return typeof e == "string" && Pc.has(e);
}
mt.isJSONType = Rc;
function Ic() {
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
mt.getRules = Ic;
var Be = {};
Object.defineProperty(Be, "__esModule", { value: !0 });
Be.shouldUseRule = Be.shouldUseGroup = Be.schemaHasRulesForType = void 0;
function Nc({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && fo(e, n);
}
Be.schemaHasRulesForType = Nc;
function fo(e, t) {
  return t.rules.some((r) => ho(e, r));
}
Be.shouldUseGroup = fo;
function ho(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
Be.shouldUseRule = ho;
Object.defineProperty(ce, "__esModule", { value: !0 });
ce.reportTypeError = ce.checkDataTypes = ce.checkDataType = ce.coerceAndCheckDataType = ce.getJSONTypes = ce.getSchemaTypes = ce.DataType = void 0;
const Oc = mt, Tc = Be, jc = Qt, W = H, mo = C;
var St;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(St || (ce.DataType = St = {}));
function Ac(e) {
  const t = po(e.type);
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
ce.getSchemaTypes = Ac;
function po(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(Oc.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
ce.getJSONTypes = po;
function kc(e, t) {
  const { gen: r, data: n, opts: s } = e, a = Cc(t, s.coerceTypes), c = t.length > 0 && !(a.length === 0 && t.length === 1 && (0, Tc.schemaHasRulesForType)(e, t[0]));
  if (c) {
    const i = An(t, n, s.strictNumbers, St.Wrong);
    r.if(i, () => {
      a.length ? Dc(e, t, a) : kn(e);
    });
  }
  return c;
}
ce.coerceAndCheckDataType = kc;
const $o = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function Cc(e, t) {
  return t ? e.filter((r) => $o.has(r) || t === "array" && r === "array") : [];
}
function Dc(e, t, r) {
  const { gen: n, data: s, opts: a } = e, c = n.let("dataType", (0, W._)`typeof ${s}`), i = n.let("coerced", (0, W._)`undefined`);
  a.coerceTypes === "array" && n.if((0, W._)`${c} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, W._)`${s}[0]`).assign(c, (0, W._)`typeof ${s}`).if(An(t, s, a.strictNumbers), () => n.assign(i, s))), n.if((0, W._)`${i} !== undefined`);
  for (const l of r)
    ($o.has(l) || l === "array" && a.coerceTypes === "array") && o(l);
  n.else(), kn(e), n.endIf(), n.if((0, W._)`${i} !== undefined`, () => {
    n.assign(s, i), Lc(e, i);
  });
  function o(l) {
    switch (l) {
      case "string":
        n.elseIf((0, W._)`${c} == "number" || ${c} == "boolean"`).assign(i, (0, W._)`"" + ${s}`).elseIf((0, W._)`${s} === null`).assign(i, (0, W._)`""`);
        return;
      case "number":
        n.elseIf((0, W._)`${c} == "boolean" || ${s} === null
              || (${c} == "string" && ${s} && ${s} == +${s})`).assign(i, (0, W._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, W._)`${c} === "boolean" || ${s} === null
              || (${c} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(i, (0, W._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, W._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(i, !1).elseIf((0, W._)`${s} === "true" || ${s} === 1`).assign(i, !0);
        return;
      case "null":
        n.elseIf((0, W._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(i, null);
        return;
      case "array":
        n.elseIf((0, W._)`${c} === "string" || ${c} === "number"
              || ${c} === "boolean" || ${s} === null`).assign(i, (0, W._)`[${s}]`);
    }
  }
}
function Lc({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, W._)`${t} !== undefined`, () => e.assign((0, W._)`${t}[${r}]`, n));
}
function mn(e, t, r, n = St.Correct) {
  const s = n === St.Correct ? W.operators.EQ : W.operators.NEQ;
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
      a = c((0, W._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      a = c();
      break;
    default:
      return (0, W._)`typeof ${t} ${s} ${e}`;
  }
  return n === St.Correct ? a : (0, W.not)(a);
  function c(i = W.nil) {
    return (0, W.and)((0, W._)`typeof ${t} == "number"`, i, r ? (0, W._)`isFinite(${t})` : W.nil);
  }
}
ce.checkDataType = mn;
function An(e, t, r, n) {
  if (e.length === 1)
    return mn(e[0], t, r, n);
  let s;
  const a = (0, mo.toHash)(e);
  if (a.array && a.object) {
    const c = (0, W._)`typeof ${t} != "object"`;
    s = a.null ? c : (0, W._)`!${t} || ${c}`, delete a.null, delete a.array, delete a.object;
  } else
    s = W.nil;
  a.number && delete a.integer;
  for (const c in a)
    s = (0, W.and)(s, mn(c, t, r, n));
  return s;
}
ce.checkDataTypes = An;
const Mc = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, W._)`{type: ${e}}` : (0, W._)`{type: ${t}}`
};
function kn(e) {
  const t = Vc(e);
  (0, jc.reportError)(t, Mc);
}
ce.reportTypeError = kn;
function Vc(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, mo.schemaRefOrVal)(e, n, "type");
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
var Ft = {}, xs;
function Uc() {
  if (xs) return Ft;
  xs = 1, Object.defineProperty(Ft, "__esModule", { value: !0 }), Ft.assignDefaults = void 0;
  const e = H, t = C;
  function r(s, a) {
    const { properties: c, items: i } = s.schema;
    if (a === "object" && c)
      for (const o in c)
        n(s, o, c[o].default);
    else a === "array" && Array.isArray(i) && i.forEach((o, l) => n(s, l, o.default));
  }
  Ft.assignDefaults = r;
  function n(s, a, c) {
    const { gen: i, compositeRule: o, data: l, opts: u } = s;
    if (c === void 0)
      return;
    const f = (0, e._)`${l}${(0, e.getProperty)(a)}`;
    if (o) {
      (0, t.checkStrictMode)(s, `default is ignored for: ${f}`);
      return;
    }
    let g = (0, e._)`${f} === undefined`;
    u.useDefaults === "empty" && (g = (0, e._)`${g} || ${f} === null || ${f} === ""`), i.if(g, (0, e._)`${f} = ${(0, e.stringify)(c)}`);
  }
  return Ft;
}
var ke = {}, x = {};
Object.defineProperty(x, "__esModule", { value: !0 });
x.validateUnion = x.validateArray = x.usePattern = x.callValidateCode = x.schemaProperties = x.allSchemaProperties = x.noPropertyInData = x.propertyInData = x.isOwnProperty = x.hasPropFunc = x.reportMissingProp = x.checkMissingProp = x.checkReportMissingProp = void 0;
const ne = H, Cn = C, Qe = Oe, zc = C;
function Fc(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(Ln(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, ne._)`${t}` }, !0), e.error();
  });
}
x.checkReportMissingProp = Fc;
function qc({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, ne.or)(...n.map((a) => (0, ne.and)(Ln(e, t, a, r.ownProperties), (0, ne._)`${s} = ${a}`)));
}
x.checkMissingProp = qc;
function Gc(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
x.reportMissingProp = Gc;
function yo(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, ne._)`Object.prototype.hasOwnProperty`
  });
}
x.hasPropFunc = yo;
function Dn(e, t, r) {
  return (0, ne._)`${yo(e)}.call(${t}, ${r})`;
}
x.isOwnProperty = Dn;
function Kc(e, t, r, n) {
  const s = (0, ne._)`${t}${(0, ne.getProperty)(r)} !== undefined`;
  return n ? (0, ne._)`${s} && ${Dn(e, t, r)}` : s;
}
x.propertyInData = Kc;
function Ln(e, t, r, n) {
  const s = (0, ne._)`${t}${(0, ne.getProperty)(r)} === undefined`;
  return n ? (0, ne.or)(s, (0, ne.not)(Dn(e, t, r))) : s;
}
x.noPropertyInData = Ln;
function go(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
x.allSchemaProperties = go;
function Hc(e, t) {
  return go(t).filter((r) => !(0, Cn.alwaysValidSchema)(e, t[r]));
}
x.schemaProperties = Hc;
function Xc({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: c }, i, o, l) {
  const u = l ? (0, ne._)`${e}, ${t}, ${n}${s}` : t, f = [
    [Qe.default.instancePath, (0, ne.strConcat)(Qe.default.instancePath, a)],
    [Qe.default.parentData, c.parentData],
    [Qe.default.parentDataProperty, c.parentDataProperty],
    [Qe.default.rootData, Qe.default.rootData]
  ];
  c.opts.dynamicRef && f.push([Qe.default.dynamicAnchors, Qe.default.dynamicAnchors]);
  const g = (0, ne._)`${u}, ${r.object(...f)}`;
  return o !== ne.nil ? (0, ne._)`${i}.call(${o}, ${g})` : (0, ne._)`${i}(${g})`;
}
x.callValidateCode = Xc;
const Bc = (0, ne._)`new RegExp`;
function Wc({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, a = s(r, n);
  return e.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: (0, ne._)`${s.code === "new RegExp" ? Bc : (0, zc.useFunc)(e, s)}(${r}, ${n})`
  });
}
x.usePattern = Wc;
function Jc(e) {
  const { gen: t, data: r, keyword: n, it: s } = e, a = t.name("valid");
  if (s.allErrors) {
    const i = t.let("valid", !0);
    return c(() => t.assign(i, !1)), i;
  }
  return t.var(a, !0), c(() => t.break()), a;
  function c(i) {
    const o = t.const("len", (0, ne._)`${r}.length`);
    t.forRange("i", 0, o, (l) => {
      e.subschema({
        keyword: n,
        dataProp: l,
        dataPropType: Cn.Type.Num
      }, a), t.if((0, ne.not)(a), i);
    });
  }
}
x.validateArray = Jc;
function xc(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((o) => (0, Cn.alwaysValidSchema)(s, o)) && !s.opts.unevaluated)
    return;
  const c = t.let("valid", !1), i = t.name("_valid");
  t.block(() => r.forEach((o, l) => {
    const u = e.subschema({
      keyword: n,
      schemaProp: l,
      compositeRule: !0
    }, i);
    t.assign(c, (0, ne._)`${c} || ${i}`), e.mergeValidEvaluated(u, i) || t.if((0, ne.not)(c));
  })), e.result(c, () => e.reset(), () => e.error(!0));
}
x.validateUnion = xc;
var Ys;
function Yc() {
  if (Ys) return ke;
  Ys = 1, Object.defineProperty(ke, "__esModule", { value: !0 }), ke.validateKeywordUsage = ke.validSchemaType = ke.funcKeywordCode = ke.macroKeywordCode = void 0;
  const e = H, t = Oe, r = x, n = Qt;
  function s(g, m) {
    const { gen: v, keyword: $, schema: w, parentSchema: p, it: S } = g, N = m.macro.call(S.self, w, p, S), j = l(v, $, N);
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
  ke.macroKeywordCode = s;
  function a(g, m) {
    var v;
    const { gen: $, keyword: w, schema: p, parentSchema: S, $data: N, it: j } = g;
    o(j, m);
    const D = !N && m.compile ? m.compile.call(j.self, p, S, j) : m.validate, Z = l($, w, D), ee = $.let("valid");
    g.block$data(ee, ie), g.ok((v = m.valid) !== null && v !== void 0 ? v : ee);
    function ie() {
      if (m.errors === !1)
        z(), m.modifying && c(g), K(() => g.error());
      else {
        const X = m.async ? me() : _e();
        m.modifying && c(g), K(() => i(g, X));
      }
    }
    function me() {
      const X = $.let("ruleErrs", null);
      return $.try(() => z((0, e._)`await `), (O) => $.assign(ee, !1).if((0, e._)`${O} instanceof ${j.ValidationError}`, () => $.assign(X, (0, e._)`${O}.errors`), () => $.throw(O))), X;
    }
    function _e() {
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
  ke.funcKeywordCode = a;
  function c(g) {
    const { gen: m, data: v, it: $ } = g;
    m.if($.parentData, () => m.assign(v, (0, e._)`${$.parentData}[${$.parentDataProperty}]`));
  }
  function i(g, m) {
    const { gen: v } = g;
    v.if((0, e._)`Array.isArray(${m})`, () => {
      v.assign(t.default.vErrors, (0, e._)`${t.default.vErrors} === null ? ${m} : ${t.default.vErrors}.concat(${m})`).assign(t.default.errors, (0, e._)`${t.default.vErrors}.length`), (0, n.extendErrors)(g);
    }, () => g.error());
  }
  function o({ schemaEnv: g }, m) {
    if (m.async && !g.$async)
      throw new Error("async keyword in sync schema");
  }
  function l(g, m, v) {
    if (v === void 0)
      throw new Error(`keyword "${m}" failed to compile`);
    return g.scopeValue("keyword", typeof v == "function" ? { ref: v } : { ref: v, code: (0, e.stringify)(v) });
  }
  function u(g, m, v = !1) {
    return !m.length || m.some(($) => $ === "array" ? Array.isArray(g) : $ === "object" ? g && typeof g == "object" && !Array.isArray(g) : typeof g == $ || v && typeof g > "u");
  }
  ke.validSchemaType = u;
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
  return ke.validateKeywordUsage = f, ke;
}
var Ke = {}, Zs;
function Zc() {
  if (Zs) return Ke;
  Zs = 1, Object.defineProperty(Ke, "__esModule", { value: !0 }), Ke.extendSubschemaMode = Ke.extendSubschemaData = Ke.getSubschema = void 0;
  const e = H, t = C;
  function r(a, { keyword: c, schemaProp: i, schema: o, schemaPath: l, errSchemaPath: u, topSchemaRef: f }) {
    if (c !== void 0 && o !== void 0)
      throw new Error('both "keyword" and "schema" passed, only one allowed');
    if (c !== void 0) {
      const g = a.schema[c];
      return i === void 0 ? {
        schema: g,
        schemaPath: (0, e._)`${a.schemaPath}${(0, e.getProperty)(c)}`,
        errSchemaPath: `${a.errSchemaPath}/${c}`
      } : {
        schema: g[i],
        schemaPath: (0, e._)`${a.schemaPath}${(0, e.getProperty)(c)}${(0, e.getProperty)(i)}`,
        errSchemaPath: `${a.errSchemaPath}/${c}/${(0, t.escapeFragment)(i)}`
      };
    }
    if (o !== void 0) {
      if (l === void 0 || u === void 0 || f === void 0)
        throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      return {
        schema: o,
        schemaPath: l,
        topSchemaRef: f,
        errSchemaPath: u
      };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  Ke.getSubschema = r;
  function n(a, c, { dataProp: i, dataPropType: o, data: l, dataTypes: u, propertyName: f }) {
    if (l !== void 0 && i !== void 0)
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    const { gen: g } = c;
    if (i !== void 0) {
      const { errorPath: v, dataPathArr: $, opts: w } = c, p = g.let("data", (0, e._)`${c.data}${(0, e.getProperty)(i)}`, !0);
      m(p), a.errorPath = (0, e.str)`${v}${(0, t.getErrorPath)(i, o, w.jsPropertySyntax)}`, a.parentDataProperty = (0, e._)`${i}`, a.dataPathArr = [...$, a.parentDataProperty];
    }
    if (l !== void 0) {
      const v = l instanceof e.Name ? l : g.let("data", l, !0);
      m(v), f !== void 0 && (a.propertyName = f);
    }
    u && (a.dataTypes = u);
    function m(v) {
      a.data = v, a.dataLevel = c.dataLevel + 1, a.dataTypes = [], c.definedProperties = /* @__PURE__ */ new Set(), a.parentData = c.data, a.dataNames = [...c.dataNames, v];
    }
  }
  Ke.extendSubschemaData = n;
  function s(a, { jtdDiscriminator: c, jtdMetadata: i, compositeRule: o, createErrors: l, allErrors: u }) {
    o !== void 0 && (a.compositeRule = o), l !== void 0 && (a.createErrors = l), u !== void 0 && (a.allErrors = u), a.jtdDiscriminator = c, a.jtdMetadata = i;
  }
  return Ke.extendSubschemaMode = s, Ke;
}
var he = {}, vo = function e(t, r) {
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
      var c = a[s];
      if (!e(t[c], r[c])) return !1;
    }
    return !0;
  }
  return t !== t && r !== r;
}, _o = { exports: {} }, at = _o.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  yr(t, n, s, e, "", e);
};
at.keywords = {
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
at.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
at.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
at.skipKeywords = {
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
function yr(e, t, r, n, s, a, c, i, o, l) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, a, c, i, o, l);
    for (var u in n) {
      var f = n[u];
      if (Array.isArray(f)) {
        if (u in at.arrayKeywords)
          for (var g = 0; g < f.length; g++)
            yr(e, t, r, f[g], s + "/" + u + "/" + g, a, s, u, n, g);
      } else if (u in at.propsKeywords) {
        if (f && typeof f == "object")
          for (var m in f)
            yr(e, t, r, f[m], s + "/" + u + "/" + Qc(m), a, s, u, n, m);
      } else (u in at.keywords || e.allKeys && !(u in at.skipKeywords)) && yr(e, t, r, f, s + "/" + u, a, s, u, n);
    }
    r(n, s, a, c, i, o, l);
  }
}
function Qc(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var eu = _o.exports;
Object.defineProperty(he, "__esModule", { value: !0 });
he.getSchemaRefs = he.resolveUrl = he.normalizeId = he._getFullPath = he.getFullPath = he.inlineRef = void 0;
const tu = C, ru = vo, nu = eu, su = /* @__PURE__ */ new Set([
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
function au(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !pn(e) : t ? Eo(e) <= t : !1;
}
he.inlineRef = au;
const ou = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function pn(e) {
  for (const t in e) {
    if (ou.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(pn) || typeof r == "object" && pn(r))
      return !0;
  }
  return !1;
}
function Eo(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !su.has(r) && (typeof e[r] == "object" && (0, tu.eachItem)(e[r], (n) => t += Eo(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function wo(e, t = "", r) {
  r !== !1 && (t = Pt(t));
  const n = e.parse(t);
  return bo(e, n);
}
he.getFullPath = wo;
function bo(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
he._getFullPath = bo;
const iu = /#\/?$/;
function Pt(e) {
  return e ? e.replace(iu, "") : "";
}
he.normalizeId = Pt;
function cu(e, t, r) {
  return r = Pt(r), e.resolve(t, r);
}
he.resolveUrl = cu;
const uu = /^[a-z_][-a-z0-9._]*$/i;
function lu(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = Pt(e[r] || t), a = { "": s }, c = wo(n, s, !1), i = {}, o = /* @__PURE__ */ new Set();
  return nu(e, { allKeys: !0 }, (f, g, m, v) => {
    if (v === void 0)
      return;
    const $ = c + g;
    let w = a[v];
    typeof f[r] == "string" && (w = p.call(this, f[r])), S.call(this, f.$anchor), S.call(this, f.$dynamicAnchor), a[g] = w;
    function p(N) {
      const j = this.opts.uriResolver.resolve;
      if (N = Pt(w ? j(w, N) : N), o.has(N))
        throw u(N);
      o.add(N);
      let D = this.refs[N];
      return typeof D == "string" && (D = this.refs[D]), typeof D == "object" ? l(f, D.schema, N) : N !== Pt($) && (N[0] === "#" ? (l(f, i[N], N), i[N] = f) : this.refs[N] = $), N;
    }
    function S(N) {
      if (typeof N == "string") {
        if (!uu.test(N))
          throw new Error(`invalid anchor "${N}"`);
        p.call(this, `#${N}`);
      }
    }
  }), i;
  function l(f, g, m) {
    if (g !== void 0 && !ru(f, g))
      throw u(m);
  }
  function u(f) {
    return new Error(`reference "${f}" resolves to more than one schema`);
  }
}
he.getSchemaRefs = lu;
var Qs;
function er() {
  if (Qs) return Ge;
  Qs = 1, Object.defineProperty(Ge, "__esModule", { value: !0 }), Ge.getData = Ge.KeywordCxt = Ge.validateFunctionCode = void 0;
  const e = bc(), t = ce, r = Be, n = ce, s = Uc(), a = Yc(), c = Zc(), i = H, o = Oe, l = he, u = C, f = Qt;
  function g(_) {
    if (D(_) && (ee(_), j(_))) {
      w(_);
      return;
    }
    m(_, () => (0, e.topBoolOrEmptySchema)(_));
  }
  Ge.validateFunctionCode = g;
  function m({ gen: _, validateName: b, schema: T, schemaEnv: k, opts: F }, J) {
    F.code.es5 ? _.func(b, (0, i._)`${o.default.data}, ${o.default.valCxt}`, k.$async, () => {
      _.code((0, i._)`"use strict"; ${S(T, F)}`), $(_, F), _.code(J);
    }) : _.func(b, (0, i._)`${o.default.data}, ${v(F)}`, k.$async, () => _.code(S(T, F)).code(J));
  }
  function v(_) {
    return (0, i._)`{${o.default.instancePath}="", ${o.default.parentData}, ${o.default.parentDataProperty}, ${o.default.rootData}=${o.default.data}${_.dynamicRef ? (0, i._)`, ${o.default.dynamicAnchors}={}` : i.nil}}={}`;
  }
  function $(_, b) {
    _.if(o.default.valCxt, () => {
      _.var(o.default.instancePath, (0, i._)`${o.default.valCxt}.${o.default.instancePath}`), _.var(o.default.parentData, (0, i._)`${o.default.valCxt}.${o.default.parentData}`), _.var(o.default.parentDataProperty, (0, i._)`${o.default.valCxt}.${o.default.parentDataProperty}`), _.var(o.default.rootData, (0, i._)`${o.default.valCxt}.${o.default.rootData}`), b.dynamicRef && _.var(o.default.dynamicAnchors, (0, i._)`${o.default.valCxt}.${o.default.dynamicAnchors}`);
    }, () => {
      _.var(o.default.instancePath, (0, i._)`""`), _.var(o.default.parentData, (0, i._)`undefined`), _.var(o.default.parentDataProperty, (0, i._)`undefined`), _.var(o.default.rootData, o.default.data), b.dynamicRef && _.var(o.default.dynamicAnchors, (0, i._)`{}`);
    });
  }
  function w(_) {
    const { schema: b, opts: T, gen: k } = _;
    m(_, () => {
      T.$comment && b.$comment && X(_), _e(_), k.let(o.default.vErrors, null), k.let(o.default.errors, 0), T.unevaluated && p(_), ie(_), O(_);
    });
  }
  function p(_) {
    const { gen: b, validateName: T } = _;
    _.evaluated = b.const("evaluated", (0, i._)`${T}.evaluated`), b.if((0, i._)`${_.evaluated}.dynamicProps`, () => b.assign((0, i._)`${_.evaluated}.props`, (0, i._)`undefined`)), b.if((0, i._)`${_.evaluated}.dynamicItems`, () => b.assign((0, i._)`${_.evaluated}.items`, (0, i._)`undefined`));
  }
  function S(_, b) {
    const T = typeof _ == "object" && _[b.schemaId];
    return T && (b.code.source || b.code.process) ? (0, i._)`/*# sourceURL=${T} */` : i.nil;
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
    ie(_, J), k.var(b, (0, i._)`${J} === ${o.default.errors}`);
  }
  function ee(_) {
    (0, u.checkUnknownRules)(_), me(_);
  }
  function ie(_, b) {
    if (_.opts.jtd)
      return V(_, [], !1, b);
    const T = (0, t.getSchemaTypes)(_.schema), k = (0, t.coerceAndCheckDataType)(_, T);
    V(_, T, !k, b);
  }
  function me(_) {
    const { schema: b, errSchemaPath: T, opts: k, self: F } = _;
    b.$ref && k.ignoreKeywordsWithRef && (0, u.schemaHasRulesButRef)(b, F.RULES) && F.logger.warn(`$ref: keywords ignored in schema at path "${T}"`);
  }
  function _e(_) {
    const { schema: b, opts: T } = _;
    b.default !== void 0 && T.useDefaults && T.strictSchema && (0, u.checkStrictMode)(_, "default is ignored in the schema root");
  }
  function z(_) {
    const b = _.schema[_.opts.schemaId];
    b && (_.baseId = (0, l.resolveUrl)(_.opts.uriResolver, _.baseId, b));
  }
  function K(_) {
    if (_.schema.$async && !_.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function X({ gen: _, schemaEnv: b, schema: T, errSchemaPath: k, opts: F }) {
    const J = T.$comment;
    if (F.$comment === !0)
      _.code((0, i._)`${o.default.self}.logger.log(${J})`);
    else if (typeof F.$comment == "function") {
      const le = (0, i.str)`${k}/$comment`, Ae = _.scopeValue("root", { ref: b.root });
      _.code((0, i._)`${o.default.self}.opts.$comment(${J}, ${le}, ${Ae}.schema)`);
    }
  }
  function O(_) {
    const { gen: b, schemaEnv: T, validateName: k, ValidationError: F, opts: J } = _;
    T.$async ? b.if((0, i._)`${o.default.errors} === 0`, () => b.return(o.default.data), () => b.throw((0, i._)`new ${F}(${o.default.vErrors})`)) : (b.assign((0, i._)`${k}.errors`, o.default.vErrors), J.unevaluated && A(_), b.return((0, i._)`${o.default.errors} === 0`));
  }
  function A({ gen: _, evaluated: b, props: T, items: k }) {
    T instanceof i.Name && _.assign((0, i._)`${b}.props`, T), k instanceof i.Name && _.assign((0, i._)`${b}.items`, k);
  }
  function V(_, b, T, k) {
    const { gen: F, schema: J, data: le, allErrors: Ae, opts: Se, self: Pe } = _, { RULES: de } = Pe;
    if (J.$ref && (Se.ignoreKeywordsWithRef || !(0, u.schemaHasRulesButRef)(J, de))) {
      F.block(() => U(_, "$ref", de.all.$ref.definition));
      return;
    }
    Se.jtd || G(_, b), F.block(() => {
      for (const Te of de.rules)
        yt(Te);
      yt(de.post);
    });
    function yt(Te) {
      (0, r.shouldUseGroup)(J, Te) && (Te.type ? (F.if((0, n.checkDataType)(Te.type, le, Se.strictNumbers)), L(_, Te), b.length === 1 && b[0] === Te.type && T && (F.else(), (0, n.reportTypeError)(_)), F.endIf()) : L(_, Te), Ae || F.if((0, i._)`${o.default.errors} === ${k || 0}`));
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
        J.length && !J.some((le) => P(b, le)) && h(_, `missing type "${J.join(",")}" for keyword "${k}"`);
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
    b += ` at "${T}" (strictTypes)`, (0, u.checkStrictMode)(_, b, _.opts.strictTypes);
  }
  class R {
    constructor(b, T, k) {
      if ((0, a.validateKeywordUsage)(b, T, k), this.gen = b.gen, this.allErrors = b.allErrors, this.keyword = k, this.data = b.data, this.schema = b.schema[k], this.$data = T.$data && b.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, u.schemaRefOrVal)(b, this.schema, k, this.$data), this.schemaType = T.schemaType, this.parentSchema = b.schema, this.params = {}, this.it = b, this.def = T, this.$data)
        this.schemaCode = b.gen.const("vSchema", Q(this.$data, b));
      else if (this.schemaCode = this.schemaValue, !(0, a.validSchemaType)(this.schema, T.schemaType, T.allowUndefined))
        throw new Error(`${k} value must be ${JSON.stringify(T.schemaType)}`);
      ("code" in T ? T.trackErrors : T.errors !== !1) && (this.errsCount = b.gen.const("_errs", o.default.errors));
    }
    result(b, T, k) {
      this.failResult((0, i.not)(b), T, k);
    }
    failResult(b, T, k) {
      this.gen.if(b), k ? k() : this.error(), T ? (this.gen.else(), T(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    pass(b, T) {
      this.failResult((0, i.not)(b), void 0, T);
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
      this.fail((0, i._)`${T} !== undefined && (${(0, i.or)(this.invalid$data(), b)})`);
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
    block$data(b, T, k = i.nil) {
      this.gen.block(() => {
        this.check$data(b, k), T();
      });
    }
    check$data(b = i.nil, T = i.nil) {
      if (!this.$data)
        return;
      const { gen: k, schemaCode: F, schemaType: J, def: le } = this;
      k.if((0, i.or)((0, i._)`${F} === undefined`, T)), b !== i.nil && k.assign(b, !0), (J.length || le.validateSchema) && (k.elseIf(this.invalid$data()), this.$dataError(), b !== i.nil && k.assign(b, !1)), k.else();
    }
    invalid$data() {
      const { gen: b, schemaCode: T, schemaType: k, def: F, it: J } = this;
      return (0, i.or)(le(), Ae());
      function le() {
        if (k.length) {
          if (!(T instanceof i.Name))
            throw new Error("ajv implementation error");
          const Se = Array.isArray(k) ? k : [k];
          return (0, i._)`${(0, n.checkDataTypes)(Se, T, J.opts.strictNumbers, n.DataType.Wrong)}`;
        }
        return i.nil;
      }
      function Ae() {
        if (F.validateSchema) {
          const Se = b.scopeValue("validate$data", { ref: F.validateSchema });
          return (0, i._)`!${Se}(${T})`;
        }
        return i.nil;
      }
    }
    subschema(b, T) {
      const k = (0, c.getSubschema)(this.it, b);
      (0, c.extendSubschemaData)(k, this.it, b), (0, c.extendSubschemaMode)(k, b);
      const F = { ...this.it, ...k, items: void 0, props: void 0 };
      return N(F, T), F;
    }
    mergeEvaluated(b, T) {
      const { it: k, gen: F } = this;
      k.opts.unevaluated && (k.props !== !0 && b.props !== void 0 && (k.props = u.mergeEvaluated.props(F, b.props, k.props, T)), k.items !== !0 && b.items !== void 0 && (k.items = u.mergeEvaluated.items(F, b.items, k.items, T)));
    }
    mergeValidEvaluated(b, T) {
      const { it: k, gen: F } = this;
      if (k.opts.unevaluated && (k.props !== !0 || k.items !== !0))
        return F.if(T, () => this.mergeEvaluated(b, i.Name)), !0;
    }
  }
  Ge.KeywordCxt = R;
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
      const Pe = te.exec(_);
      if (!Pe)
        throw new Error(`Invalid JSON-pointer: ${_}`);
      const de = +Pe[1];
      if (F = Pe[2], F === "#") {
        if (de >= b)
          throw new Error(Se("property/index", de));
        return k[b - de];
      }
      if (de > b)
        throw new Error(Se("data", de));
      if (J = T[b - de], !F)
        return J;
    }
    let le = J;
    const Ae = F.split("/");
    for (const Pe of Ae)
      Pe && (J = (0, i._)`${J}${(0, i.getProperty)((0, u.unescapeJsonPointer)(Pe))}`, le = (0, i._)`${le} && ${J}`);
    return le;
    function Se(Pe, de) {
      return `Cannot access ${Pe} ${de} levels up, current level is ${b}`;
    }
  }
  return Ge.getData = Q, Ge;
}
var Tt = {};
Object.defineProperty(Tt, "__esModule", { value: !0 });
class du extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
}
Tt.default = du;
var $t = {};
Object.defineProperty($t, "__esModule", { value: !0 });
const Zr = he;
class fu extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Zr.resolveUrl)(t, r, n), this.missingSchema = (0, Zr.normalizeId)((0, Zr.getFullPath)(t, this.missingRef));
  }
}
$t.default = fu;
var we = {};
Object.defineProperty(we, "__esModule", { value: !0 });
we.resolveSchema = we.getCompilingSchema = we.resolveRef = we.compileSchema = we.SchemaEnv = void 0;
const Ce = H, hu = Tt, it = Oe, Le = he, ea = C, mu = er();
class jr {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, Le.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
we.SchemaEnv = jr;
function Mn(e) {
  const t = So.call(this, e);
  if (t)
    return t;
  const r = (0, Le.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, c = new Ce.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let i;
  e.$async && (i = c.scopeValue("Error", {
    ref: hu.default,
    code: (0, Ce._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const o = c.scopeName("validate");
  e.validateName = o;
  const l = {
    gen: c,
    allErrors: this.opts.allErrors,
    data: it.default.data,
    parentData: it.default.parentData,
    parentDataProperty: it.default.parentDataProperty,
    dataNames: [it.default.data],
    dataPathArr: [Ce.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: c.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, Ce.stringify)(e.schema) } : { ref: e.schema }),
    validateName: o,
    ValidationError: i,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: Ce.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, Ce._)`""`,
    opts: this.opts,
    self: this
  };
  let u;
  try {
    this._compilations.add(e), (0, mu.validateFunctionCode)(l), c.optimize(this.opts.code.optimize);
    const f = c.toString();
    u = `${c.scopeRefs(it.default.scope)}return ${f}`, this.opts.code.process && (u = this.opts.code.process(u, e));
    const m = new Function(`${it.default.self}`, `${it.default.scope}`, u)(this, this.scope.get());
    if (this.scope.value(o, { ref: m }), m.errors = null, m.schema = e.schema, m.schemaEnv = e, e.$async && (m.$async = !0), this.opts.code.source === !0 && (m.source = { validateName: o, validateCode: f, scopeValues: c._values }), this.opts.unevaluated) {
      const { props: v, items: $ } = l;
      m.evaluated = {
        props: v instanceof Ce.Name ? void 0 : v,
        items: $ instanceof Ce.Name ? void 0 : $,
        dynamicProps: v instanceof Ce.Name,
        dynamicItems: $ instanceof Ce.Name
      }, m.source && (m.source.evaluated = (0, Ce.stringify)(m.evaluated));
    }
    return e.validate = m, e;
  } catch (f) {
    throw delete e.validate, delete e.validateName, u && this.logger.error("Error compiling schema, function code:", u), f;
  } finally {
    this._compilations.delete(e);
  }
}
we.compileSchema = Mn;
function pu(e, t, r) {
  var n;
  r = (0, Le.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let a = gu.call(this, e, r);
  if (a === void 0) {
    const c = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: i } = this.opts;
    c && (a = new jr({ schema: c, schemaId: i, root: e, baseId: t }));
  }
  if (a !== void 0)
    return e.refs[r] = $u.call(this, a);
}
we.resolveRef = pu;
function $u(e) {
  return (0, Le.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Mn.call(this, e);
}
function So(e) {
  for (const t of this._compilations)
    if (yu(t, e))
      return t;
}
we.getCompilingSchema = So;
function yu(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function gu(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || Ar.call(this, e, t);
}
function Ar(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, Le._getFullPath)(this.opts.uriResolver, r);
  let s = (0, Le.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return Qr.call(this, r, e);
  const a = (0, Le.normalizeId)(n), c = this.refs[a] || this.schemas[a];
  if (typeof c == "string") {
    const i = Ar.call(this, e, c);
    return typeof (i == null ? void 0 : i.schema) != "object" ? void 0 : Qr.call(this, r, i);
  }
  if (typeof (c == null ? void 0 : c.schema) == "object") {
    if (c.validate || Mn.call(this, c), a === (0, Le.normalizeId)(t)) {
      const { schema: i } = c, { schemaId: o } = this.opts, l = i[o];
      return l && (s = (0, Le.resolveUrl)(this.opts.uriResolver, s, l)), new jr({ schema: i, schemaId: o, root: e, baseId: s });
    }
    return Qr.call(this, r, c);
  }
}
we.resolveSchema = Ar;
const vu = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function Qr(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const i of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const o = r[(0, ea.unescapeFragment)(i)];
    if (o === void 0)
      return;
    r = o;
    const l = typeof r == "object" && r[this.opts.schemaId];
    !vu.has(i) && l && (t = (0, Le.resolveUrl)(this.opts.uriResolver, t, l));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, ea.schemaHasRulesButRef)(r, this.RULES)) {
    const i = (0, Le.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    a = Ar.call(this, n, i);
  }
  const { schemaId: c } = this.opts;
  if (a = a || new jr({ schema: r, schemaId: c, root: n, baseId: t }), a.schema !== a.root.schema)
    return a;
}
const _u = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", Eu = "Meta-schema for $data reference (JSON AnySchema extension proposal)", wu = "object", bu = [
  "$data"
], Su = {
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
}, Pu = !1, Ru = {
  $id: _u,
  description: Eu,
  type: wu,
  required: bu,
  properties: Su,
  additionalProperties: Pu
};
var Vn = {}, kr = { exports: {} };
const Iu = {
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
var Nu = {
  HEX: Iu
};
const { HEX: Ou } = Nu, Tu = /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u;
function Po(e) {
  if (Io(e, ".") < 3)
    return { host: e, isIPV4: !1 };
  const t = e.match(Tu) || [], [r] = t;
  return r ? { host: Au(r, "."), isIPV4: !0 } : { host: e, isIPV4: !1 };
}
function ta(e, t = !1) {
  let r = "", n = !0;
  for (const s of e) {
    if (Ou[s] === void 0) return;
    s !== "0" && n === !0 && (n = !1), n || (r += s);
  }
  return t && r.length === 0 && (r = "0"), r;
}
function ju(e) {
  let t = 0;
  const r = { error: !1, address: "", zone: "" }, n = [], s = [];
  let a = !1, c = !1, i = !1;
  function o() {
    if (s.length) {
      if (a === !1) {
        const l = ta(s);
        if (l !== void 0)
          n.push(l);
        else
          return r.error = !0, !1;
      }
      s.length = 0;
    }
    return !0;
  }
  for (let l = 0; l < e.length; l++) {
    const u = e[l];
    if (!(u === "[" || u === "]"))
      if (u === ":") {
        if (c === !0 && (i = !0), !o())
          break;
        if (t++, n.push(":"), t > 7) {
          r.error = !0;
          break;
        }
        l - 1 >= 0 && e[l - 1] === ":" && (c = !0);
        continue;
      } else if (u === "%") {
        if (!o())
          break;
        a = !0;
      } else {
        s.push(u);
        continue;
      }
  }
  return s.length && (a ? r.zone = s.join("") : i ? n.push(s.join("")) : n.push(ta(s))), r.address = n.join(""), r;
}
function Ro(e) {
  if (Io(e, ":") < 2)
    return { host: e, isIPV6: !1 };
  const t = ju(e);
  if (t.error)
    return { host: e, isIPV6: !1 };
  {
    let r = t.address, n = t.address;
    return t.zone && (r += "%" + t.zone, n += "%25" + t.zone), { host: r, escapedHost: n, isIPV6: !0 };
  }
}
function Au(e, t) {
  let r = "", n = !0;
  const s = e.length;
  for (let a = 0; a < s; a++) {
    const c = e[a];
    c === "0" && n ? (a + 1 <= s && e[a + 1] === t || a + 1 === s) && (r += c, n = !1) : (c === t ? n = !0 : n = !1, r += c);
  }
  return r;
}
function Io(e, t) {
  let r = 0;
  for (let n = 0; n < e.length; n++)
    e[n] === t && r++;
  return r;
}
const ra = /^\.\.?\//u, na = /^\/\.(?:\/|$)/u, sa = /^\/\.\.(?:\/|$)/u, ku = /^\/?(?:.|\n)*?(?=\/|$)/u;
function Cu(e) {
  const t = [];
  for (; e.length; )
    if (e.match(ra))
      e = e.replace(ra, "");
    else if (e.match(na))
      e = e.replace(na, "/");
    else if (e.match(sa))
      e = e.replace(sa, "/"), t.pop();
    else if (e === "." || e === "..")
      e = "";
    else {
      const r = e.match(ku);
      if (r) {
        const n = r[0];
        e = e.slice(n.length), t.push(n);
      } else
        throw new Error("Unexpected dot segment condition");
    }
  return t.join("");
}
function Du(e, t) {
  const r = t !== !0 ? escape : unescape;
  return e.scheme !== void 0 && (e.scheme = r(e.scheme)), e.userinfo !== void 0 && (e.userinfo = r(e.userinfo)), e.host !== void 0 && (e.host = r(e.host)), e.path !== void 0 && (e.path = r(e.path)), e.query !== void 0 && (e.query = r(e.query)), e.fragment !== void 0 && (e.fragment = r(e.fragment)), e;
}
function Lu(e) {
  const t = [];
  if (e.userinfo !== void 0 && (t.push(e.userinfo), t.push("@")), e.host !== void 0) {
    let r = unescape(e.host);
    const n = Po(r);
    if (n.isIPV4)
      r = n.host;
    else {
      const s = Ro(n.host);
      s.isIPV6 === !0 ? r = `[${s.escapedHost}]` : r = e.host;
    }
    t.push(r);
  }
  return (typeof e.port == "number" || typeof e.port == "string") && (t.push(":"), t.push(String(e.port))), t.length ? t.join("") : void 0;
}
var Mu = {
  recomposeAuthority: Lu,
  normalizeComponentEncoding: Du,
  removeDotSegments: Cu,
  normalizeIPv4: Po,
  normalizeIPv6: Ro
};
const Vu = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu, Uu = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function No(e) {
  return typeof e.secure == "boolean" ? e.secure : String(e.scheme).toLowerCase() === "wss";
}
function Oo(e) {
  return e.host || (e.error = e.error || "HTTP URIs must have a host."), e;
}
function To(e) {
  const t = String(e.scheme).toLowerCase() === "https";
  return (e.port === (t ? 443 : 80) || e.port === "") && (e.port = void 0), e.path || (e.path = "/"), e;
}
function zu(e) {
  return e.secure = No(e), e.resourceName = (e.path || "/") + (e.query ? "?" + e.query : ""), e.path = void 0, e.query = void 0, e;
}
function Fu(e) {
  if ((e.port === (No(e) ? 443 : 80) || e.port === "") && (e.port = void 0), typeof e.secure == "boolean" && (e.scheme = e.secure ? "wss" : "ws", e.secure = void 0), e.resourceName) {
    const [t, r] = e.resourceName.split("?");
    e.path = t && t !== "/" ? t : void 0, e.query = r, e.resourceName = void 0;
  }
  return e.fragment = void 0, e;
}
function qu(e, t) {
  if (!e.path)
    return e.error = "URN can not be parsed", e;
  const r = e.path.match(Uu);
  if (r) {
    const n = t.scheme || e.scheme || "urn";
    e.nid = r[1].toLowerCase(), e.nss = r[2];
    const s = `${n}:${t.nid || e.nid}`, a = Un[s];
    e.path = void 0, a && (e = a.parse(e, t));
  } else
    e.error = e.error || "URN can not be parsed.";
  return e;
}
function Gu(e, t) {
  const r = t.scheme || e.scheme || "urn", n = e.nid.toLowerCase(), s = `${r}:${t.nid || n}`, a = Un[s];
  a && (e = a.serialize(e, t));
  const c = e, i = e.nss;
  return c.path = `${n || t.nid}:${i}`, t.skipEscape = !0, c;
}
function Ku(e, t) {
  const r = e;
  return r.uuid = r.nss, r.nss = void 0, !t.tolerant && (!r.uuid || !Vu.test(r.uuid)) && (r.error = r.error || "UUID is not valid."), r;
}
function Hu(e) {
  const t = e;
  return t.nss = (e.uuid || "").toLowerCase(), t;
}
const jo = {
  scheme: "http",
  domainHost: !0,
  parse: Oo,
  serialize: To
}, Xu = {
  scheme: "https",
  domainHost: jo.domainHost,
  parse: Oo,
  serialize: To
}, gr = {
  scheme: "ws",
  domainHost: !0,
  parse: zu,
  serialize: Fu
}, Bu = {
  scheme: "wss",
  domainHost: gr.domainHost,
  parse: gr.parse,
  serialize: gr.serialize
}, Wu = {
  scheme: "urn",
  parse: qu,
  serialize: Gu,
  skipNormalize: !0
}, Ju = {
  scheme: "urn:uuid",
  parse: Ku,
  serialize: Hu,
  skipNormalize: !0
}, Un = {
  http: jo,
  https: Xu,
  ws: gr,
  wss: Bu,
  urn: Wu,
  "urn:uuid": Ju
};
var xu = Un;
const { normalizeIPv6: Yu, normalizeIPv4: Zu, removeDotSegments: Kt, recomposeAuthority: Qu, normalizeComponentEncoding: sr } = Mu, zn = xu;
function el(e, t) {
  return typeof e == "string" ? e = Fe(We(e, t), t) : typeof e == "object" && (e = We(Fe(e, t), t)), e;
}
function tl(e, t, r) {
  const n = Object.assign({ scheme: "null" }, r), s = Ao(We(e, n), We(t, n), n, !0);
  return Fe(s, { ...n, skipEscape: !0 });
}
function Ao(e, t, r, n) {
  const s = {};
  return n || (e = We(Fe(e, r), r), t = We(Fe(t, r), r)), r = r || {}, !r.tolerant && t.scheme ? (s.scheme = t.scheme, s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = Kt(t.path || ""), s.query = t.query) : (t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0 ? (s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = Kt(t.path || ""), s.query = t.query) : (t.path ? (t.path.charAt(0) === "/" ? s.path = Kt(t.path) : ((e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0) && !e.path ? s.path = "/" + t.path : e.path ? s.path = e.path.slice(0, e.path.lastIndexOf("/") + 1) + t.path : s.path = t.path, s.path = Kt(s.path)), s.query = t.query) : (s.path = e.path, t.query !== void 0 ? s.query = t.query : s.query = e.query), s.userinfo = e.userinfo, s.host = e.host, s.port = e.port), s.scheme = e.scheme), s.fragment = t.fragment, s;
}
function rl(e, t, r) {
  return typeof e == "string" ? (e = unescape(e), e = Fe(sr(We(e, r), !0), { ...r, skipEscape: !0 })) : typeof e == "object" && (e = Fe(sr(e, !0), { ...r, skipEscape: !0 })), typeof t == "string" ? (t = unescape(t), t = Fe(sr(We(t, r), !0), { ...r, skipEscape: !0 })) : typeof t == "object" && (t = Fe(sr(t, !0), { ...r, skipEscape: !0 })), e.toLowerCase() === t.toLowerCase();
}
function Fe(e, t) {
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
  }, n = Object.assign({}, t), s = [], a = zn[(n.scheme || r.scheme || "").toLowerCase()];
  a && a.serialize && a.serialize(r, n), r.path !== void 0 && (n.skipEscape ? r.path = unescape(r.path) : (r.path = escape(r.path), r.scheme !== void 0 && (r.path = r.path.split("%3A").join(":")))), n.reference !== "suffix" && r.scheme && s.push(r.scheme, ":");
  const c = Qu(r);
  if (c !== void 0 && (n.reference !== "suffix" && s.push("//"), s.push(c), r.path && r.path.charAt(0) !== "/" && s.push("/")), r.path !== void 0) {
    let i = r.path;
    !n.absolutePath && (!a || !a.absolutePath) && (i = Kt(i)), c === void 0 && (i = i.replace(/^\/\//u, "/%2F")), s.push(i);
  }
  return r.query !== void 0 && s.push("?", r.query), r.fragment !== void 0 && s.push("#", r.fragment), s.join("");
}
const nl = Array.from({ length: 127 }, (e, t) => /[^!"$&'()*+,\-.;=_`a-z{}~]/u.test(String.fromCharCode(t)));
function sl(e) {
  let t = 0;
  for (let r = 0, n = e.length; r < n; ++r)
    if (t = e.charCodeAt(r), t > 126 || nl[t])
      return !0;
  return !1;
}
const al = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function We(e, t) {
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
  const c = e.match(al);
  if (c) {
    if (n.scheme = c[1], n.userinfo = c[3], n.host = c[4], n.port = parseInt(c[5], 10), n.path = c[6] || "", n.query = c[7], n.fragment = c[8], isNaN(n.port) && (n.port = c[5]), n.host) {
      const o = Zu(n.host);
      if (o.isIPV4 === !1) {
        const l = Yu(o.host);
        n.host = l.host.toLowerCase(), a = l.isIPV6;
      } else
        n.host = o.host, a = !0;
    }
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && n.query === void 0 && !n.path ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", r.reference && r.reference !== "suffix" && r.reference !== n.reference && (n.error = n.error || "URI is not a " + r.reference + " reference.");
    const i = zn[(r.scheme || n.scheme || "").toLowerCase()];
    if (!r.unicodeSupport && (!i || !i.unicodeSupport) && n.host && (r.domainHost || i && i.domainHost) && a === !1 && sl(n.host))
      try {
        n.host = URL.domainToASCII(n.host.toLowerCase());
      } catch (o) {
        n.error = n.error || "Host's domain name can not be converted to ASCII: " + o;
      }
    (!i || i && !i.skipNormalize) && (s && n.scheme !== void 0 && (n.scheme = unescape(n.scheme)), s && n.host !== void 0 && (n.host = unescape(n.host)), n.path && (n.path = escape(unescape(n.path))), n.fragment && (n.fragment = encodeURI(decodeURIComponent(n.fragment)))), i && i.parse && i.parse(n, r);
  } else
    n.error = n.error || "URI can not be parsed.";
  return n;
}
const Fn = {
  SCHEMES: zn,
  normalize: el,
  resolve: tl,
  resolveComponents: Ao,
  equal: rl,
  serialize: Fe,
  parse: We
};
kr.exports = Fn;
kr.exports.default = Fn;
kr.exports.fastUri = Fn;
var ol = kr.exports;
Object.defineProperty(Vn, "__esModule", { value: !0 });
const ko = ol;
ko.code = 'require("ajv/dist/runtime/uri").default';
Vn.default = ko;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = er();
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
  const n = Tt, s = $t, a = mt, c = we, i = H, o = he, l = ce, u = C, f = Ru, g = Vn, m = (I, y) => new RegExp(I, y);
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
    var y, P, E, d, h, R, U, q, te, Q, _, b, T, k, F, J, le, Ae, Se, Pe, de, yt, Te, Br, Wr;
    const Lt = I.strict, Jr = (y = I.code) === null || y === void 0 ? void 0 : y.optimize, Cs = Jr === !0 || Jr === void 0 ? 1 : Jr || 0, Ds = (E = (P = I.code) === null || P === void 0 ? void 0 : P.regExp) !== null && E !== void 0 ? E : m, ni = (d = I.uriResolver) !== null && d !== void 0 ? d : g.default;
    return {
      strictSchema: (R = (h = I.strictSchema) !== null && h !== void 0 ? h : Lt) !== null && R !== void 0 ? R : !0,
      strictNumbers: (q = (U = I.strictNumbers) !== null && U !== void 0 ? U : Lt) !== null && q !== void 0 ? q : !0,
      strictTypes: (Q = (te = I.strictTypes) !== null && te !== void 0 ? te : Lt) !== null && Q !== void 0 ? Q : "log",
      strictTuples: (b = (_ = I.strictTuples) !== null && _ !== void 0 ? _ : Lt) !== null && b !== void 0 ? b : "log",
      strictRequired: (k = (T = I.strictRequired) !== null && T !== void 0 ? T : Lt) !== null && k !== void 0 ? k : !1,
      code: I.code ? { ...I.code, optimize: Cs, regExp: Ds } : { optimize: Cs, regExp: Ds },
      loopRequired: (F = I.loopRequired) !== null && F !== void 0 ? F : S,
      loopEnum: (J = I.loopEnum) !== null && J !== void 0 ? J : S,
      meta: (le = I.meta) !== null && le !== void 0 ? le : !0,
      messages: (Ae = I.messages) !== null && Ae !== void 0 ? Ae : !0,
      inlineRefs: (Se = I.inlineRefs) !== null && Se !== void 0 ? Se : !0,
      schemaId: (Pe = I.schemaId) !== null && Pe !== void 0 ? Pe : "$id",
      addUsedSchema: (de = I.addUsedSchema) !== null && de !== void 0 ? de : !0,
      validateSchema: (yt = I.validateSchema) !== null && yt !== void 0 ? yt : !0,
      validateFormats: (Te = I.validateFormats) !== null && Te !== void 0 ? Te : !0,
      unicodeRegExp: (Br = I.unicodeRegExp) !== null && Br !== void 0 ? Br : !0,
      int32range: (Wr = I.int32range) !== null && Wr !== void 0 ? Wr : !0,
      uriResolver: ni
    };
  }
  class j {
    constructor(y = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), y = this.opts = { ...y, ...N(y) };
      const { es5: P, lines: E } = this.opts.code;
      this.scope = new i.ValueScope({ scope: {}, prefixes: $, es5: P, lines: E }), this.logger = K(y.logger);
      const d = y.validateFormats;
      y.validateFormats = !1, this.RULES = (0, a.getRules)(), D.call(this, w, y, "NOT SUPPORTED"), D.call(this, p, y, "DEPRECATED", "warn"), this._metaOpts = _e.call(this), y.formats && ie.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), y.keywords && me.call(this, y.keywords), typeof y.meta == "object" && this.addMetaSchema(y.meta), ee.call(this), y.validateFormats = d;
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
        const { schemaId: E } = this.opts, d = new c.SchemaEnv({ schema: {}, schemaId: E });
        if (P = c.resolveSchema.call(this, d, y), !P)
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
        return (0, u.eachItem)(E, (h) => A.call(this, h)), this;
      L.call(this, P);
      const d = {
        ...P,
        type: (0, l.getJSONTypes)(P.type),
        schemaType: (0, l.getJSONTypes)(P.schemaType)
      };
      return (0, u.eachItem)(E, d.type.length === 0 ? (h) => A.call(this, h, d) : (h) => d.type.forEach((R) => A.call(this, h, d, R))), this;
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
      return q = new c.SchemaEnv({ schema: y, schemaId: U, meta: P, baseId: E, localRefs: te }), this._cache.set(q.schema, q), h && !E.startsWith("#") && (E && this._checkUnique(E), this.refs[E] = q), d && this.validateSchema(y, !0), q;
    }
    _checkUnique(y) {
      if (this.schemas[y] || this.refs[y])
        throw new Error(`schema with key or id "${y}" already exists`);
    }
    _compileSchemaEnv(y) {
      if (y.meta ? this._compileMetaSchema(y) : c.compileSchema.call(this, y), !y.validate)
        throw new Error("ajv implementation error");
      return y.validate;
    }
    _compileMetaSchema(y) {
      const P = this.opts;
      this.opts = this._metaOpts;
      try {
        c.compileSchema.call(this, y);
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
  function me(I) {
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
  function _e() {
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
    if ((0, u.eachItem)(I, (E) => {
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
        type: (0, l.getJSONTypes)(y.type),
        schemaType: (0, l.getJSONTypes)(y.schemaType)
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
})(On);
var qn = {}, Cr = {}, Gn = {};
Object.defineProperty(Gn, "__esModule", { value: !0 });
const il = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
Gn.default = il;
var Je = {};
Object.defineProperty(Je, "__esModule", { value: !0 });
Je.callRef = Je.getValidate = void 0;
const cl = $t, aa = x, Re = H, gt = Oe, oa = we, ar = C, ul = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: a, validateName: c, opts: i, self: o } = n, { root: l } = a;
    if ((r === "#" || r === "#/") && s === l.baseId)
      return f();
    const u = oa.resolveRef.call(o, l, s, r);
    if (u === void 0)
      throw new cl.default(n.opts.uriResolver, s, r);
    if (u instanceof oa.SchemaEnv)
      return g(u);
    return m(u);
    function f() {
      if (a === l)
        return vr(e, c, a, a.$async);
      const v = t.scopeValue("root", { ref: l });
      return vr(e, (0, Re._)`${v}.validate`, l, l.$async);
    }
    function g(v) {
      const $ = Co(e, v);
      vr(e, $, v, v.$async);
    }
    function m(v) {
      const $ = t.scopeValue("schema", i.code.source === !0 ? { ref: v, code: (0, Re.stringify)(v) } : { ref: v }), w = t.name("valid"), p = e.subschema({
        schema: v,
        dataTypes: [],
        schemaPath: Re.nil,
        topSchemaRef: $,
        errSchemaPath: r
      }, w);
      e.mergeEvaluated(p), e.ok(w);
    }
  }
};
function Co(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, Re._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
Je.getValidate = Co;
function vr(e, t, r, n) {
  const { gen: s, it: a } = e, { allErrors: c, schemaEnv: i, opts: o } = a, l = o.passContext ? gt.default.this : Re.nil;
  n ? u() : f();
  function u() {
    if (!i.$async)
      throw new Error("async schema referenced by sync schema");
    const v = s.let("valid");
    s.try(() => {
      s.code((0, Re._)`await ${(0, aa.callValidateCode)(e, t, l)}`), m(t), c || s.assign(v, !0);
    }, ($) => {
      s.if((0, Re._)`!(${$} instanceof ${a.ValidationError})`, () => s.throw($)), g($), c || s.assign(v, !1);
    }), e.ok(v);
  }
  function f() {
    e.result((0, aa.callValidateCode)(e, t, l), () => m(t), () => g(t));
  }
  function g(v) {
    const $ = (0, Re._)`${v}.errors`;
    s.assign(gt.default.vErrors, (0, Re._)`${gt.default.vErrors} === null ? ${$} : ${gt.default.vErrors}.concat(${$})`), s.assign(gt.default.errors, (0, Re._)`${gt.default.vErrors}.length`);
  }
  function m(v) {
    var $;
    if (!a.opts.unevaluated)
      return;
    const w = ($ = r == null ? void 0 : r.validate) === null || $ === void 0 ? void 0 : $.evaluated;
    if (a.props !== !0)
      if (w && !w.dynamicProps)
        w.props !== void 0 && (a.props = ar.mergeEvaluated.props(s, w.props, a.props));
      else {
        const p = s.var("props", (0, Re._)`${v}.evaluated.props`);
        a.props = ar.mergeEvaluated.props(s, p, a.props, Re.Name);
      }
    if (a.items !== !0)
      if (w && !w.dynamicItems)
        w.items !== void 0 && (a.items = ar.mergeEvaluated.items(s, w.items, a.items));
      else {
        const p = s.var("items", (0, Re._)`${v}.evaluated.items`);
        a.items = ar.mergeEvaluated.items(s, p, a.items, Re.Name);
      }
  }
}
Je.callRef = vr;
Je.default = ul;
Object.defineProperty(Cr, "__esModule", { value: !0 });
const ll = Gn, dl = Je, fl = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  ll.default,
  dl.default
];
Cr.default = fl;
var Dr = {}, Kn = {};
Object.defineProperty(Kn, "__esModule", { value: !0 });
const Rr = H, et = Rr.operators, Ir = {
  maximum: { okStr: "<=", ok: et.LTE, fail: et.GT },
  minimum: { okStr: ">=", ok: et.GTE, fail: et.LT },
  exclusiveMaximum: { okStr: "<", ok: et.LT, fail: et.GTE },
  exclusiveMinimum: { okStr: ">", ok: et.GT, fail: et.LTE }
}, hl = {
  message: ({ keyword: e, schemaCode: t }) => (0, Rr.str)`must be ${Ir[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, Rr._)`{comparison: ${Ir[e].okStr}, limit: ${t}}`
}, ml = {
  keyword: Object.keys(Ir),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: hl,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, Rr._)`${r} ${Ir[t].fail} ${n} || isNaN(${r})`);
  }
};
Kn.default = ml;
var Hn = {};
Object.defineProperty(Hn, "__esModule", { value: !0 });
const Xt = H, pl = {
  message: ({ schemaCode: e }) => (0, Xt.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, Xt._)`{multipleOf: ${e}}`
}, $l = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: pl,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, a = s.opts.multipleOfPrecision, c = t.let("res"), i = a ? (0, Xt._)`Math.abs(Math.round(${c}) - ${c}) > 1e-${a}` : (0, Xt._)`${c} !== parseInt(${c})`;
    e.fail$data((0, Xt._)`(${n} === 0 || (${c} = ${r}/${n}, ${i}))`);
  }
};
Hn.default = $l;
var Xn = {}, Bn = {};
Object.defineProperty(Bn, "__esModule", { value: !0 });
function Do(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
Bn.default = Do;
Do.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Xn, "__esModule", { value: !0 });
const ct = H, yl = C, gl = Bn, vl = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, ct.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, ct._)`{limit: ${e}}`
}, _l = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: vl,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, a = t === "maxLength" ? ct.operators.GT : ct.operators.LT, c = s.opts.unicode === !1 ? (0, ct._)`${r}.length` : (0, ct._)`${(0, yl.useFunc)(e.gen, gl.default)}(${r})`;
    e.fail$data((0, ct._)`${c} ${a} ${n}`);
  }
};
Xn.default = _l;
var Wn = {};
Object.defineProperty(Wn, "__esModule", { value: !0 });
const El = x, Nr = H, wl = {
  message: ({ schemaCode: e }) => (0, Nr.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, Nr._)`{pattern: ${e}}`
}, bl = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: wl,
  code(e) {
    const { data: t, $data: r, schema: n, schemaCode: s, it: a } = e, c = a.opts.unicodeRegExp ? "u" : "", i = r ? (0, Nr._)`(new RegExp(${s}, ${c}))` : (0, El.usePattern)(e, n);
    e.fail$data((0, Nr._)`!${i}.test(${t})`);
  }
};
Wn.default = bl;
var Jn = {};
Object.defineProperty(Jn, "__esModule", { value: !0 });
const Bt = H, Sl = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, Bt.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, Bt._)`{limit: ${e}}`
}, Pl = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: Sl,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? Bt.operators.GT : Bt.operators.LT;
    e.fail$data((0, Bt._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
Jn.default = Pl;
var xn = {};
Object.defineProperty(xn, "__esModule", { value: !0 });
const qt = x, Wt = H, Rl = C, Il = {
  message: ({ params: { missingProperty: e } }) => (0, Wt.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, Wt._)`{missingProperty: ${e}}`
}, Nl = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: Il,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: a, it: c } = e, { opts: i } = c;
    if (!a && r.length === 0)
      return;
    const o = r.length >= i.loopRequired;
    if (c.allErrors ? l() : u(), i.strictRequired) {
      const m = e.parentSchema.properties, { definedProperties: v } = e.it;
      for (const $ of r)
        if ((m == null ? void 0 : m[$]) === void 0 && !v.has($)) {
          const w = c.schemaEnv.baseId + c.errSchemaPath, p = `required property "${$}" is not defined at "${w}" (strictRequired)`;
          (0, Rl.checkStrictMode)(c, p, c.opts.strictRequired);
        }
    }
    function l() {
      if (o || a)
        e.block$data(Wt.nil, f);
      else
        for (const m of r)
          (0, qt.checkReportMissingProp)(e, m);
    }
    function u() {
      const m = t.let("missing");
      if (o || a) {
        const v = t.let("valid", !0);
        e.block$data(v, () => g(m, v)), e.ok(v);
      } else
        t.if((0, qt.checkMissingProp)(e, r, m)), (0, qt.reportMissingProp)(e, m), t.else();
    }
    function f() {
      t.forOf("prop", n, (m) => {
        e.setParams({ missingProperty: m }), t.if((0, qt.noPropertyInData)(t, s, m, i.ownProperties), () => e.error());
      });
    }
    function g(m, v) {
      e.setParams({ missingProperty: m }), t.forOf(m, n, () => {
        t.assign(v, (0, qt.propertyInData)(t, s, m, i.ownProperties)), t.if((0, Wt.not)(v), () => {
          e.error(), t.break();
        });
      }, Wt.nil);
    }
  }
};
xn.default = Nl;
var Yn = {};
Object.defineProperty(Yn, "__esModule", { value: !0 });
const Jt = H, Ol = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, Jt.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, Jt._)`{limit: ${e}}`
}, Tl = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: Ol,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? Jt.operators.GT : Jt.operators.LT;
    e.fail$data((0, Jt._)`${r}.length ${s} ${n}`);
  }
};
Yn.default = Tl;
var Zn = {}, tr = {};
Object.defineProperty(tr, "__esModule", { value: !0 });
const Lo = vo;
Lo.code = 'require("ajv/dist/runtime/equal").default';
tr.default = Lo;
Object.defineProperty(Zn, "__esModule", { value: !0 });
const en = ce, fe = H, jl = C, Al = tr, kl = {
  message: ({ params: { i: e, j: t } }) => (0, fe.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, fe._)`{i: ${e}, j: ${t}}`
}, Cl = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: kl,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: a, schemaCode: c, it: i } = e;
    if (!n && !s)
      return;
    const o = t.let("valid"), l = a.items ? (0, en.getSchemaTypes)(a.items) : [];
    e.block$data(o, u, (0, fe._)`${c} === false`), e.ok(o);
    function u() {
      const v = t.let("i", (0, fe._)`${r}.length`), $ = t.let("j");
      e.setParams({ i: v, j: $ }), t.assign(o, !0), t.if((0, fe._)`${v} > 1`, () => (f() ? g : m)(v, $));
    }
    function f() {
      return l.length > 0 && !l.some((v) => v === "object" || v === "array");
    }
    function g(v, $) {
      const w = t.name("item"), p = (0, en.checkDataTypes)(l, w, i.opts.strictNumbers, en.DataType.Wrong), S = t.const("indices", (0, fe._)`{}`);
      t.for((0, fe._)`;${v}--;`, () => {
        t.let(w, (0, fe._)`${r}[${v}]`), t.if(p, (0, fe._)`continue`), l.length > 1 && t.if((0, fe._)`typeof ${w} == "string"`, (0, fe._)`${w} += "_"`), t.if((0, fe._)`typeof ${S}[${w}] == "number"`, () => {
          t.assign($, (0, fe._)`${S}[${w}]`), e.error(), t.assign(o, !1).break();
        }).code((0, fe._)`${S}[${w}] = ${v}`);
      });
    }
    function m(v, $) {
      const w = (0, jl.useFunc)(t, Al.default), p = t.name("outer");
      t.label(p).for((0, fe._)`;${v}--;`, () => t.for((0, fe._)`${$} = ${v}; ${$}--;`, () => t.if((0, fe._)`${w}(${r}[${v}], ${r}[${$}])`, () => {
        e.error(), t.assign(o, !1).break(p);
      })));
    }
  }
};
Zn.default = Cl;
var Qn = {};
Object.defineProperty(Qn, "__esModule", { value: !0 });
const $n = H, Dl = C, Ll = tr, Ml = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, $n._)`{allowedValue: ${e}}`
}, Vl = {
  keyword: "const",
  $data: !0,
  error: Ml,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: a } = e;
    n || a && typeof a == "object" ? e.fail$data((0, $n._)`!${(0, Dl.useFunc)(t, Ll.default)}(${r}, ${s})`) : e.fail((0, $n._)`${a} !== ${r}`);
  }
};
Qn.default = Vl;
var es = {};
Object.defineProperty(es, "__esModule", { value: !0 });
const Ht = H, Ul = C, zl = tr, Fl = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Ht._)`{allowedValues: ${e}}`
}, ql = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: Fl,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: c } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const i = s.length >= c.opts.loopEnum;
    let o;
    const l = () => o ?? (o = (0, Ul.useFunc)(t, zl.default));
    let u;
    if (i || n)
      u = t.let("valid"), e.block$data(u, f);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const m = t.const("vSchema", a);
      u = (0, Ht.or)(...s.map((v, $) => g(m, $)));
    }
    e.pass(u);
    function f() {
      t.assign(u, !1), t.forOf("v", a, (m) => t.if((0, Ht._)`${l()}(${r}, ${m})`, () => t.assign(u, !0).break()));
    }
    function g(m, v) {
      const $ = s[v];
      return typeof $ == "object" && $ !== null ? (0, Ht._)`${l()}(${r}, ${m}[${v}])` : (0, Ht._)`${r} === ${$}`;
    }
  }
};
es.default = ql;
Object.defineProperty(Dr, "__esModule", { value: !0 });
const Gl = Kn, Kl = Hn, Hl = Xn, Xl = Wn, Bl = Jn, Wl = xn, Jl = Yn, xl = Zn, Yl = Qn, Zl = es, Ql = [
  // number
  Gl.default,
  Kl.default,
  // string
  Hl.default,
  Xl.default,
  // object
  Bl.default,
  Wl.default,
  // array
  Jl.default,
  xl.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  Yl.default,
  Zl.default
];
Dr.default = Ql;
var Lr = {}, jt = {};
Object.defineProperty(jt, "__esModule", { value: !0 });
jt.validateAdditionalItems = void 0;
const ut = H, yn = C, ed = {
  message: ({ params: { len: e } }) => (0, ut.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, ut._)`{limit: ${e}}`
}, td = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: ed,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, yn.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Mo(e, n);
  }
};
function Mo(e, t) {
  const { gen: r, schema: n, data: s, keyword: a, it: c } = e;
  c.items = !0;
  const i = r.const("len", (0, ut._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, ut._)`${i} <= ${t.length}`);
  else if (typeof n == "object" && !(0, yn.alwaysValidSchema)(c, n)) {
    const l = r.var("valid", (0, ut._)`${i} <= ${t.length}`);
    r.if((0, ut.not)(l), () => o(l)), e.ok(l);
  }
  function o(l) {
    r.forRange("i", t.length, i, (u) => {
      e.subschema({ keyword: a, dataProp: u, dataPropType: yn.Type.Num }, l), c.allErrors || r.if((0, ut.not)(l), () => r.break());
    });
  }
}
jt.validateAdditionalItems = Mo;
jt.default = td;
var ts = {}, At = {};
Object.defineProperty(At, "__esModule", { value: !0 });
At.validateTuple = void 0;
const ia = H, _r = C, rd = x, nd = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return Vo(e, "additionalItems", t);
    r.items = !0, !(0, _r.alwaysValidSchema)(r, t) && e.ok((0, rd.validateArray)(e));
  }
};
function Vo(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: c, it: i } = e;
  u(s), i.opts.unevaluated && r.length && i.items !== !0 && (i.items = _r.mergeEvaluated.items(n, r.length, i.items));
  const o = n.name("valid"), l = n.const("len", (0, ia._)`${a}.length`);
  r.forEach((f, g) => {
    (0, _r.alwaysValidSchema)(i, f) || (n.if((0, ia._)`${l} > ${g}`, () => e.subschema({
      keyword: c,
      schemaProp: g,
      dataProp: g
    }, o)), e.ok(o));
  });
  function u(f) {
    const { opts: g, errSchemaPath: m } = i, v = r.length, $ = v === f.minItems && (v === f.maxItems || f[t] === !1);
    if (g.strictTuples && !$) {
      const w = `"${c}" is ${v}-tuple, but minItems or maxItems/${t} are not specified or different at path "${m}"`;
      (0, _r.checkStrictMode)(i, w, g.strictTuples);
    }
  }
}
At.validateTuple = Vo;
At.default = nd;
Object.defineProperty(ts, "__esModule", { value: !0 });
const sd = At, ad = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, sd.validateTuple)(e, "items")
};
ts.default = ad;
var rs = {};
Object.defineProperty(rs, "__esModule", { value: !0 });
const ca = H, od = C, id = x, cd = jt, ud = {
  message: ({ params: { len: e } }) => (0, ca.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, ca._)`{limit: ${e}}`
}, ld = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: ud,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, od.alwaysValidSchema)(n, t) && (s ? (0, cd.validateAdditionalItems)(e, s) : e.ok((0, id.validateArray)(e)));
  }
};
rs.default = ld;
var ns = {};
Object.defineProperty(ns, "__esModule", { value: !0 });
const je = H, or = C, dd = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, je.str)`must contain at least ${e} valid item(s)` : (0, je.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, je._)`{minContains: ${e}}` : (0, je._)`{minContains: ${e}, maxContains: ${t}}`
}, fd = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: dd,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    let c, i;
    const { minContains: o, maxContains: l } = n;
    a.opts.next ? (c = o === void 0 ? 1 : o, i = l) : c = 1;
    const u = t.const("len", (0, je._)`${s}.length`);
    if (e.setParams({ min: c, max: i }), i === void 0 && c === 0) {
      (0, or.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (i !== void 0 && c > i) {
      (0, or.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, or.alwaysValidSchema)(a, r)) {
      let $ = (0, je._)`${u} >= ${c}`;
      i !== void 0 && ($ = (0, je._)`${$} && ${u} <= ${i}`), e.pass($);
      return;
    }
    a.items = !0;
    const f = t.name("valid");
    i === void 0 && c === 1 ? m(f, () => t.if(f, () => t.break())) : c === 0 ? (t.let(f, !0), i !== void 0 && t.if((0, je._)`${s}.length > 0`, g)) : (t.let(f, !1), g()), e.result(f, () => e.reset());
    function g() {
      const $ = t.name("_valid"), w = t.let("count", 0);
      m($, () => t.if($, () => v(w)));
    }
    function m($, w) {
      t.forRange("i", 0, u, (p) => {
        e.subschema({
          keyword: "contains",
          dataProp: p,
          dataPropType: or.Type.Num,
          compositeRule: !0
        }, $), w();
      });
    }
    function v($) {
      t.code((0, je._)`${$}++`), i === void 0 ? t.if((0, je._)`${$} >= ${c}`, () => t.assign(f, !0).break()) : (t.if((0, je._)`${$} > ${i}`, () => t.assign(f, !1).break()), c === 1 ? t.assign(f, !0) : t.if((0, je._)`${$} >= ${c}`, () => t.assign(f, !0)));
    }
  }
};
ns.default = fd;
var Mr = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = H, r = C, n = x;
  e.error = {
    message: ({ params: { property: o, depsCount: l, deps: u } }) => {
      const f = l === 1 ? "property" : "properties";
      return (0, t.str)`must have ${f} ${u} when property ${o} is present`;
    },
    params: ({ params: { property: o, depsCount: l, deps: u, missingProperty: f } }) => (0, t._)`{property: ${o},
    missingProperty: ${f},
    depsCount: ${l},
    deps: ${u}}`
    // TODO change to reference
  };
  const s = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(o) {
      const [l, u] = a(o);
      c(o, l), i(o, u);
    }
  };
  function a({ schema: o }) {
    const l = {}, u = {};
    for (const f in o) {
      if (f === "__proto__")
        continue;
      const g = Array.isArray(o[f]) ? l : u;
      g[f] = o[f];
    }
    return [l, u];
  }
  function c(o, l = o.schema) {
    const { gen: u, data: f, it: g } = o;
    if (Object.keys(l).length === 0)
      return;
    const m = u.let("missing");
    for (const v in l) {
      const $ = l[v];
      if ($.length === 0)
        continue;
      const w = (0, n.propertyInData)(u, f, v, g.opts.ownProperties);
      o.setParams({
        property: v,
        depsCount: $.length,
        deps: $.join(", ")
      }), g.allErrors ? u.if(w, () => {
        for (const p of $)
          (0, n.checkReportMissingProp)(o, p);
      }) : (u.if((0, t._)`${w} && (${(0, n.checkMissingProp)(o, $, m)})`), (0, n.reportMissingProp)(o, m), u.else());
    }
  }
  e.validatePropertyDeps = c;
  function i(o, l = o.schema) {
    const { gen: u, data: f, keyword: g, it: m } = o, v = u.name("valid");
    for (const $ in l)
      (0, r.alwaysValidSchema)(m, l[$]) || (u.if(
        (0, n.propertyInData)(u, f, $, m.opts.ownProperties),
        () => {
          const w = o.subschema({ keyword: g, schemaProp: $ }, v);
          o.mergeValidEvaluated(w, v);
        },
        () => u.var(v, !0)
        // TODO var
      ), o.ok(v));
  }
  e.validateSchemaDeps = i, e.default = s;
})(Mr);
var ss = {};
Object.defineProperty(ss, "__esModule", { value: !0 });
const Uo = H, hd = C, md = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, Uo._)`{propertyName: ${e.propertyName}}`
}, pd = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: md,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, hd.alwaysValidSchema)(s, r))
      return;
    const a = t.name("valid");
    t.forIn("key", n, (c) => {
      e.setParams({ propertyName: c }), e.subschema({
        keyword: "propertyNames",
        data: c,
        dataTypes: ["string"],
        propertyName: c,
        compositeRule: !0
      }, a), t.if((0, Uo.not)(a), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(a);
  }
};
ss.default = pd;
var Vr = {};
Object.defineProperty(Vr, "__esModule", { value: !0 });
const ir = x, De = H, $d = Oe, cr = C, yd = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, De._)`{additionalProperty: ${e.additionalProperty}}`
}, gd = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: yd,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: a, it: c } = e;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: i, opts: o } = c;
    if (c.props = !0, o.removeAdditional !== "all" && (0, cr.alwaysValidSchema)(c, r))
      return;
    const l = (0, ir.allSchemaProperties)(n.properties), u = (0, ir.allSchemaProperties)(n.patternProperties);
    f(), e.ok((0, De._)`${a} === ${$d.default.errors}`);
    function f() {
      t.forIn("key", s, (w) => {
        !l.length && !u.length ? v(w) : t.if(g(w), () => v(w));
      });
    }
    function g(w) {
      let p;
      if (l.length > 8) {
        const S = (0, cr.schemaRefOrVal)(c, n.properties, "properties");
        p = (0, ir.isOwnProperty)(t, S, w);
      } else l.length ? p = (0, De.or)(...l.map((S) => (0, De._)`${w} === ${S}`)) : p = De.nil;
      return u.length && (p = (0, De.or)(p, ...u.map((S) => (0, De._)`${(0, ir.usePattern)(e, S)}.test(${w})`))), (0, De.not)(p);
    }
    function m(w) {
      t.code((0, De._)`delete ${s}[${w}]`);
    }
    function v(w) {
      if (o.removeAdditional === "all" || o.removeAdditional && r === !1) {
        m(w);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: w }), e.error(), i || t.break();
        return;
      }
      if (typeof r == "object" && !(0, cr.alwaysValidSchema)(c, r)) {
        const p = t.name("valid");
        o.removeAdditional === "failing" ? ($(w, p, !1), t.if((0, De.not)(p), () => {
          e.reset(), m(w);
        })) : ($(w, p), i || t.if((0, De.not)(p), () => t.break()));
      }
    }
    function $(w, p, S) {
      const N = {
        keyword: "additionalProperties",
        dataProp: w,
        dataPropType: cr.Type.Str
      };
      S === !1 && Object.assign(N, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(N, p);
    }
  }
};
Vr.default = gd;
var as = {};
Object.defineProperty(as, "__esModule", { value: !0 });
const vd = er(), ua = x, tn = C, la = Vr, _d = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && la.default.code(new vd.KeywordCxt(a, la.default, "additionalProperties"));
    const c = (0, ua.allSchemaProperties)(r);
    for (const f of c)
      a.definedProperties.add(f);
    a.opts.unevaluated && c.length && a.props !== !0 && (a.props = tn.mergeEvaluated.props(t, (0, tn.toHash)(c), a.props));
    const i = c.filter((f) => !(0, tn.alwaysValidSchema)(a, r[f]));
    if (i.length === 0)
      return;
    const o = t.name("valid");
    for (const f of i)
      l(f) ? u(f) : (t.if((0, ua.propertyInData)(t, s, f, a.opts.ownProperties)), u(f), a.allErrors || t.else().var(o, !0), t.endIf()), e.it.definedProperties.add(f), e.ok(o);
    function l(f) {
      return a.opts.useDefaults && !a.compositeRule && r[f].default !== void 0;
    }
    function u(f) {
      e.subschema({
        keyword: "properties",
        schemaProp: f,
        dataProp: f
      }, o);
    }
  }
};
as.default = _d;
var os = {};
Object.defineProperty(os, "__esModule", { value: !0 });
const da = x, ur = H, fa = C, ha = C, Ed = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: a } = e, { opts: c } = a, i = (0, da.allSchemaProperties)(r), o = i.filter(($) => (0, fa.alwaysValidSchema)(a, r[$]));
    if (i.length === 0 || o.length === i.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const l = c.strictSchema && !c.allowMatchingProperties && s.properties, u = t.name("valid");
    a.props !== !0 && !(a.props instanceof ur.Name) && (a.props = (0, ha.evaluatedPropsToName)(t, a.props));
    const { props: f } = a;
    g();
    function g() {
      for (const $ of i)
        l && m($), a.allErrors ? v($) : (t.var(u, !0), v($), t.if(u));
    }
    function m($) {
      for (const w in l)
        new RegExp($).test(w) && (0, fa.checkStrictMode)(a, `property ${w} matches pattern ${$} (use allowMatchingProperties)`);
    }
    function v($) {
      t.forIn("key", n, (w) => {
        t.if((0, ur._)`${(0, da.usePattern)(e, $)}.test(${w})`, () => {
          const p = o.includes($);
          p || e.subschema({
            keyword: "patternProperties",
            schemaProp: $,
            dataProp: w,
            dataPropType: ha.Type.Str
          }, u), a.opts.unevaluated && f !== !0 ? t.assign((0, ur._)`${f}[${w}]`, !0) : !p && !a.allErrors && t.if((0, ur.not)(u), () => t.break());
        });
      });
    }
  }
};
os.default = Ed;
var is = {};
Object.defineProperty(is, "__esModule", { value: !0 });
const wd = C, bd = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, wd.alwaysValidSchema)(n, r)) {
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
is.default = bd;
var cs = {};
Object.defineProperty(cs, "__esModule", { value: !0 });
const Sd = x, Pd = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: Sd.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
cs.default = Pd;
var us = {};
Object.defineProperty(us, "__esModule", { value: !0 });
const Er = H, Rd = C, Id = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, Er._)`{passingSchemas: ${e.passing}}`
}, Nd = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: Id,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: s } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const a = r, c = t.let("valid", !1), i = t.let("passing", null), o = t.name("_valid");
    e.setParams({ passing: i }), t.block(l), e.result(c, () => e.reset(), () => e.error(!0));
    function l() {
      a.forEach((u, f) => {
        let g;
        (0, Rd.alwaysValidSchema)(s, u) ? t.var(o, !0) : g = e.subschema({
          keyword: "oneOf",
          schemaProp: f,
          compositeRule: !0
        }, o), f > 0 && t.if((0, Er._)`${o} && ${c}`).assign(c, !1).assign(i, (0, Er._)`[${i}, ${f}]`).else(), t.if(o, () => {
          t.assign(c, !0), t.assign(i, f), g && e.mergeEvaluated(g, Er.Name);
        });
      });
    }
  }
};
us.default = Nd;
var ls = {};
Object.defineProperty(ls, "__esModule", { value: !0 });
const Od = C, Td = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((a, c) => {
      if ((0, Od.alwaysValidSchema)(n, a))
        return;
      const i = e.subschema({ keyword: "allOf", schemaProp: c }, s);
      e.ok(s), e.mergeEvaluated(i);
    });
  }
};
ls.default = Td;
var ds = {};
Object.defineProperty(ds, "__esModule", { value: !0 });
const Or = H, zo = C, jd = {
  message: ({ params: e }) => (0, Or.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, Or._)`{failingKeyword: ${e.ifClause}}`
}, Ad = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: jd,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, zo.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = ma(n, "then"), a = ma(n, "else");
    if (!s && !a)
      return;
    const c = t.let("valid", !0), i = t.name("_valid");
    if (o(), e.reset(), s && a) {
      const u = t.let("ifClause");
      e.setParams({ ifClause: u }), t.if(i, l("then", u), l("else", u));
    } else s ? t.if(i, l("then")) : t.if((0, Or.not)(i), l("else"));
    e.pass(c, () => e.error(!0));
    function o() {
      const u = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, i);
      e.mergeEvaluated(u);
    }
    function l(u, f) {
      return () => {
        const g = e.subschema({ keyword: u }, i);
        t.assign(c, i), e.mergeValidEvaluated(g, c), f ? t.assign(f, (0, Or._)`${u}`) : e.setParams({ ifClause: u });
      };
    }
  }
};
function ma(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, zo.alwaysValidSchema)(e, r);
}
ds.default = Ad;
var fs = {};
Object.defineProperty(fs, "__esModule", { value: !0 });
const kd = C, Cd = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, kd.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
fs.default = Cd;
Object.defineProperty(Lr, "__esModule", { value: !0 });
const Dd = jt, Ld = ts, Md = At, Vd = rs, Ud = ns, zd = Mr, Fd = ss, qd = Vr, Gd = as, Kd = os, Hd = is, Xd = cs, Bd = us, Wd = ls, Jd = ds, xd = fs;
function Yd(e = !1) {
  const t = [
    // any
    Hd.default,
    Xd.default,
    Bd.default,
    Wd.default,
    Jd.default,
    xd.default,
    // object
    Fd.default,
    qd.default,
    zd.default,
    Gd.default,
    Kd.default
  ];
  return e ? t.push(Ld.default, Vd.default) : t.push(Dd.default, Md.default), t.push(Ud.default), t;
}
Lr.default = Yd;
var hs = {}, kt = {};
Object.defineProperty(kt, "__esModule", { value: !0 });
kt.dynamicAnchor = void 0;
const rn = H, Zd = Oe, pa = we, Qd = Je, ef = {
  keyword: "$dynamicAnchor",
  schemaType: "string",
  code: (e) => Fo(e, e.schema)
};
function Fo(e, t) {
  const { gen: r, it: n } = e;
  n.schemaEnv.root.dynamicAnchors[t] = !0;
  const s = (0, rn._)`${Zd.default.dynamicAnchors}${(0, rn.getProperty)(t)}`, a = n.errSchemaPath === "#" ? n.validateName : tf(e);
  r.if((0, rn._)`!${s}`, () => r.assign(s, a));
}
kt.dynamicAnchor = Fo;
function tf(e) {
  const { schemaEnv: t, schema: r, self: n } = e.it, { root: s, baseId: a, localRefs: c, meta: i } = t.root, { schemaId: o } = n.opts, l = new pa.SchemaEnv({ schema: r, schemaId: o, root: s, baseId: a, localRefs: c, meta: i });
  return pa.compileSchema.call(n, l), (0, Qd.getValidate)(e, l);
}
kt.default = ef;
var Ct = {};
Object.defineProperty(Ct, "__esModule", { value: !0 });
Ct.dynamicRef = void 0;
const $a = H, rf = Oe, ya = Je, nf = {
  keyword: "$dynamicRef",
  schemaType: "string",
  code: (e) => qo(e, e.schema)
};
function qo(e, t) {
  const { gen: r, keyword: n, it: s } = e;
  if (t[0] !== "#")
    throw new Error(`"${n}" only supports hash fragment reference`);
  const a = t.slice(1);
  if (s.allErrors)
    c();
  else {
    const o = r.let("valid", !1);
    c(o), e.ok(o);
  }
  function c(o) {
    if (s.schemaEnv.root.dynamicAnchors[a]) {
      const l = r.let("_v", (0, $a._)`${rf.default.dynamicAnchors}${(0, $a.getProperty)(a)}`);
      r.if(l, i(l, o), i(s.validateName, o));
    } else
      i(s.validateName, o)();
  }
  function i(o, l) {
    return l ? () => r.block(() => {
      (0, ya.callRef)(e, o), r.let(l, !0);
    }) : () => (0, ya.callRef)(e, o);
  }
}
Ct.dynamicRef = qo;
Ct.default = nf;
var ms = {};
Object.defineProperty(ms, "__esModule", { value: !0 });
const sf = kt, af = C, of = {
  keyword: "$recursiveAnchor",
  schemaType: "boolean",
  code(e) {
    e.schema ? (0, sf.dynamicAnchor)(e, "") : (0, af.checkStrictMode)(e.it, "$recursiveAnchor: false is ignored");
  }
};
ms.default = of;
var ps = {};
Object.defineProperty(ps, "__esModule", { value: !0 });
const cf = Ct, uf = {
  keyword: "$recursiveRef",
  schemaType: "string",
  code: (e) => (0, cf.dynamicRef)(e, e.schema)
};
ps.default = uf;
Object.defineProperty(hs, "__esModule", { value: !0 });
const lf = kt, df = Ct, ff = ms, hf = ps, mf = [lf.default, df.default, ff.default, hf.default];
hs.default = mf;
var $s = {}, ys = {};
Object.defineProperty(ys, "__esModule", { value: !0 });
const ga = Mr, pf = {
  keyword: "dependentRequired",
  type: "object",
  schemaType: "object",
  error: ga.error,
  code: (e) => (0, ga.validatePropertyDeps)(e)
};
ys.default = pf;
var gs = {};
Object.defineProperty(gs, "__esModule", { value: !0 });
const $f = Mr, yf = {
  keyword: "dependentSchemas",
  type: "object",
  schemaType: "object",
  code: (e) => (0, $f.validateSchemaDeps)(e)
};
gs.default = yf;
var vs = {};
Object.defineProperty(vs, "__esModule", { value: !0 });
const gf = C, vf = {
  keyword: ["maxContains", "minContains"],
  type: "array",
  schemaType: "number",
  code({ keyword: e, parentSchema: t, it: r }) {
    t.contains === void 0 && (0, gf.checkStrictMode)(r, `"${e}" without "contains" is ignored`);
  }
};
vs.default = vf;
Object.defineProperty($s, "__esModule", { value: !0 });
const _f = ys, Ef = gs, wf = vs, bf = [_f.default, Ef.default, wf.default];
$s.default = bf;
var _s = {}, Es = {};
Object.defineProperty(Es, "__esModule", { value: !0 });
const tt = H, va = C, Sf = Oe, Pf = {
  message: "must NOT have unevaluated properties",
  params: ({ params: e }) => (0, tt._)`{unevaluatedProperty: ${e.unevaluatedProperty}}`
}, Rf = {
  keyword: "unevaluatedProperties",
  type: "object",
  schemaType: ["boolean", "object"],
  trackErrors: !0,
  error: Pf,
  code(e) {
    const { gen: t, schema: r, data: n, errsCount: s, it: a } = e;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: c, props: i } = a;
    i instanceof tt.Name ? t.if((0, tt._)`${i} !== true`, () => t.forIn("key", n, (f) => t.if(l(i, f), () => o(f)))) : i !== !0 && t.forIn("key", n, (f) => i === void 0 ? o(f) : t.if(u(i, f), () => o(f))), a.props = !0, e.ok((0, tt._)`${s} === ${Sf.default.errors}`);
    function o(f) {
      if (r === !1) {
        e.setParams({ unevaluatedProperty: f }), e.error(), c || t.break();
        return;
      }
      if (!(0, va.alwaysValidSchema)(a, r)) {
        const g = t.name("valid");
        e.subschema({
          keyword: "unevaluatedProperties",
          dataProp: f,
          dataPropType: va.Type.Str
        }, g), c || t.if((0, tt.not)(g), () => t.break());
      }
    }
    function l(f, g) {
      return (0, tt._)`!${f} || !${f}[${g}]`;
    }
    function u(f, g) {
      const m = [];
      for (const v in f)
        f[v] === !0 && m.push((0, tt._)`${g} !== ${v}`);
      return (0, tt.and)(...m);
    }
  }
};
Es.default = Rf;
var ws = {};
Object.defineProperty(ws, "__esModule", { value: !0 });
const lt = H, _a = C, If = {
  message: ({ params: { len: e } }) => (0, lt.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, lt._)`{limit: ${e}}`
}, Nf = {
  keyword: "unevaluatedItems",
  type: "array",
  schemaType: ["boolean", "object"],
  error: If,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e, a = s.items || 0;
    if (a === !0)
      return;
    const c = t.const("len", (0, lt._)`${n}.length`);
    if (r === !1)
      e.setParams({ len: a }), e.fail((0, lt._)`${c} > ${a}`);
    else if (typeof r == "object" && !(0, _a.alwaysValidSchema)(s, r)) {
      const o = t.var("valid", (0, lt._)`${c} <= ${a}`);
      t.if((0, lt.not)(o), () => i(o, a)), e.ok(o);
    }
    s.items = !0;
    function i(o, l) {
      t.forRange("i", l, c, (u) => {
        e.subschema({ keyword: "unevaluatedItems", dataProp: u, dataPropType: _a.Type.Num }, o), s.allErrors || t.if((0, lt.not)(o), () => t.break());
      });
    }
  }
};
ws.default = Nf;
Object.defineProperty(_s, "__esModule", { value: !0 });
const Of = Es, Tf = ws, jf = [Of.default, Tf.default];
_s.default = jf;
var Ur = {}, bs = {};
Object.defineProperty(bs, "__esModule", { value: !0 });
const oe = H, Af = {
  message: ({ schemaCode: e }) => (0, oe.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, oe._)`{format: ${e}}`
}, kf = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: Af,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: a, schemaCode: c, it: i } = e, { opts: o, errSchemaPath: l, schemaEnv: u, self: f } = i;
    if (!o.validateFormats)
      return;
    s ? g() : m();
    function g() {
      const v = r.scopeValue("formats", {
        ref: f.formats,
        code: o.code.formats
      }), $ = r.const("fDef", (0, oe._)`${v}[${c}]`), w = r.let("fType"), p = r.let("format");
      r.if((0, oe._)`typeof ${$} == "object" && !(${$} instanceof RegExp)`, () => r.assign(w, (0, oe._)`${$}.type || "string"`).assign(p, (0, oe._)`${$}.validate`), () => r.assign(w, (0, oe._)`"string"`).assign(p, $)), e.fail$data((0, oe.or)(S(), N()));
      function S() {
        return o.strictSchema === !1 ? oe.nil : (0, oe._)`${c} && !${p}`;
      }
      function N() {
        const j = u.$async ? (0, oe._)`(${$}.async ? await ${p}(${n}) : ${p}(${n}))` : (0, oe._)`${p}(${n})`, D = (0, oe._)`(typeof ${p} == "function" ? ${j} : ${p}.test(${n}))`;
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
          return `unknown format "${a}" ignored in schema at path "${l}"`;
        }
      }
      function N(D) {
        const Z = D instanceof RegExp ? (0, oe.regexpCode)(D) : o.code.formats ? (0, oe._)`${o.code.formats}${(0, oe.getProperty)(a)}` : void 0, ee = r.scopeValue("formats", { key: a, ref: D, code: Z });
        return typeof D == "object" && !(D instanceof RegExp) ? [D.type || "string", D.validate, (0, oe._)`${ee}.validate`] : ["string", D, ee];
      }
      function j() {
        if (typeof v == "object" && !(v instanceof RegExp) && v.async) {
          if (!u.$async)
            throw new Error("async format in sync schema");
          return (0, oe._)`await ${p}(${n})`;
        }
        return typeof w == "function" ? (0, oe._)`${p}(${n})` : (0, oe._)`${p}.test(${n})`;
      }
    }
  }
};
bs.default = kf;
Object.defineProperty(Ur, "__esModule", { value: !0 });
const Cf = bs, Df = [Cf.default];
Ur.default = Df;
var pt = {};
Object.defineProperty(pt, "__esModule", { value: !0 });
pt.contentVocabulary = pt.metadataVocabulary = void 0;
pt.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
pt.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(qn, "__esModule", { value: !0 });
const Lf = Cr, Mf = Dr, Vf = Lr, Uf = hs, zf = $s, Ff = _s, qf = Ur, Ea = pt, Gf = [
  Uf.default,
  Lf.default,
  Mf.default,
  (0, Vf.default)(!0),
  qf.default,
  Ea.metadataVocabulary,
  Ea.contentVocabulary,
  zf.default,
  Ff.default
];
qn.default = Gf;
var zr = {}, Fr = {};
Object.defineProperty(Fr, "__esModule", { value: !0 });
Fr.DiscrError = void 0;
var wa;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(wa || (Fr.DiscrError = wa = {}));
Object.defineProperty(zr, "__esModule", { value: !0 });
const wt = H, gn = Fr, ba = we, Kf = $t, Hf = C, Xf = {
  message: ({ params: { discrError: e, tagName: t } }) => e === gn.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, wt._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, Bf = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: Xf,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: s, it: a } = e, { oneOf: c } = s;
    if (!a.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const i = n.propertyName;
    if (typeof i != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!c)
      throw new Error("discriminator: requires oneOf keyword");
    const o = t.let("valid", !1), l = t.const("tag", (0, wt._)`${r}${(0, wt.getProperty)(i)}`);
    t.if((0, wt._)`typeof ${l} == "string"`, () => u(), () => e.error(!1, { discrError: gn.DiscrError.Tag, tag: l, tagName: i })), e.ok(o);
    function u() {
      const m = g();
      t.if(!1);
      for (const v in m)
        t.elseIf((0, wt._)`${l} === ${v}`), t.assign(o, f(m[v]));
      t.else(), e.error(!1, { discrError: gn.DiscrError.Mapping, tag: l, tagName: i }), t.endIf();
    }
    function f(m) {
      const v = t.name("valid"), $ = e.subschema({ keyword: "oneOf", schemaProp: m }, v);
      return e.mergeEvaluated($, wt.Name), v;
    }
    function g() {
      var m;
      const v = {}, $ = p(s);
      let w = !0;
      for (let j = 0; j < c.length; j++) {
        let D = c[j];
        if (D != null && D.$ref && !(0, Hf.schemaHasRulesButRef)(D, a.self.RULES)) {
          const ee = D.$ref;
          if (D = ba.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, ee), D instanceof ba.SchemaEnv && (D = D.schema), D === void 0)
            throw new Kf.default(a.opts.uriResolver, a.baseId, ee);
        }
        const Z = (m = D == null ? void 0 : D.properties) === null || m === void 0 ? void 0 : m[i];
        if (typeof Z != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${i}"`);
        w = w && ($ || p(D)), S(Z, j);
      }
      if (!w)
        throw new Error(`discriminator: "${i}" must be required`);
      return v;
      function p({ required: j }) {
        return Array.isArray(j) && j.includes(i);
      }
      function S(j, D) {
        if (j.const)
          N(j.const, D);
        else if (j.enum)
          for (const Z of j.enum)
            N(Z, D);
        else
          throw new Error(`discriminator: "properties/${i}" must have "const" or "enum"`);
      }
      function N(j, D) {
        if (typeof j != "string" || j in v)
          throw new Error(`discriminator: "${i}" values must be unique strings`);
        v[j] = D;
      }
    }
  }
};
zr.default = Bf;
var Ss = {};
const Wf = "https://json-schema.org/draft/2020-12/schema", Jf = "https://json-schema.org/draft/2020-12/schema", xf = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0,
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0,
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0,
  "https://json-schema.org/draft/2020-12/vocab/validation": !0,
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0,
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0,
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, Yf = "meta", Zf = "Core and Validation specifications meta-schema", Qf = [
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
], eh = [
  "object",
  "boolean"
], th = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", rh = {
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
}, nh = {
  $schema: Wf,
  $id: Jf,
  $vocabulary: xf,
  $dynamicAnchor: Yf,
  title: Zf,
  allOf: Qf,
  type: eh,
  $comment: th,
  properties: rh
}, sh = "https://json-schema.org/draft/2020-12/schema", ah = "https://json-schema.org/draft/2020-12/meta/applicator", oh = {
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0
}, ih = "meta", ch = "Applicator vocabulary meta-schema", uh = [
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
}, dh = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $dynamicRef: "#meta"
    }
  }
}, fh = {
  $schema: sh,
  $id: ah,
  $vocabulary: oh,
  $dynamicAnchor: ih,
  title: ch,
  type: uh,
  properties: lh,
  $defs: dh
}, hh = "https://json-schema.org/draft/2020-12/schema", mh = "https://json-schema.org/draft/2020-12/meta/unevaluated", ph = {
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0
}, $h = "meta", yh = "Unevaluated applicator vocabulary meta-schema", gh = [
  "object",
  "boolean"
], vh = {
  unevaluatedItems: {
    $dynamicRef: "#meta"
  },
  unevaluatedProperties: {
    $dynamicRef: "#meta"
  }
}, _h = {
  $schema: hh,
  $id: mh,
  $vocabulary: ph,
  $dynamicAnchor: $h,
  title: yh,
  type: gh,
  properties: vh
}, Eh = "https://json-schema.org/draft/2020-12/schema", wh = "https://json-schema.org/draft/2020-12/meta/content", bh = {
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, Sh = "meta", Ph = "Content vocabulary meta-schema", Rh = [
  "object",
  "boolean"
], Ih = {
  contentEncoding: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentSchema: {
    $dynamicRef: "#meta"
  }
}, Nh = {
  $schema: Eh,
  $id: wh,
  $vocabulary: bh,
  $dynamicAnchor: Sh,
  title: Ph,
  type: Rh,
  properties: Ih
}, Oh = "https://json-schema.org/draft/2020-12/schema", Th = "https://json-schema.org/draft/2020-12/meta/core", jh = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0
}, Ah = "meta", kh = "Core vocabulary meta-schema", Ch = [
  "object",
  "boolean"
], Dh = {
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
}, Lh = {
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
}, Mh = {
  $schema: Oh,
  $id: Th,
  $vocabulary: jh,
  $dynamicAnchor: Ah,
  title: kh,
  type: Ch,
  properties: Dh,
  $defs: Lh
}, Vh = "https://json-schema.org/draft/2020-12/schema", Uh = "https://json-schema.org/draft/2020-12/meta/format-annotation", zh = {
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0
}, Fh = "meta", qh = "Format vocabulary meta-schema for annotation results", Gh = [
  "object",
  "boolean"
], Kh = {
  format: {
    type: "string"
  }
}, Hh = {
  $schema: Vh,
  $id: Uh,
  $vocabulary: zh,
  $dynamicAnchor: Fh,
  title: qh,
  type: Gh,
  properties: Kh
}, Xh = "https://json-schema.org/draft/2020-12/schema", Bh = "https://json-schema.org/draft/2020-12/meta/meta-data", Wh = {
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0
}, Jh = "meta", xh = "Meta-data vocabulary meta-schema", Yh = [
  "object",
  "boolean"
], Zh = {
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
}, Qh = {
  $schema: Xh,
  $id: Bh,
  $vocabulary: Wh,
  $dynamicAnchor: Jh,
  title: xh,
  type: Yh,
  properties: Zh
}, em = "https://json-schema.org/draft/2020-12/schema", tm = "https://json-schema.org/draft/2020-12/meta/validation", rm = {
  "https://json-schema.org/draft/2020-12/vocab/validation": !0
}, nm = "meta", sm = "Validation vocabulary meta-schema", am = [
  "object",
  "boolean"
], om = {
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
}, im = {
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
}, cm = {
  $schema: em,
  $id: tm,
  $vocabulary: rm,
  $dynamicAnchor: nm,
  title: sm,
  type: am,
  properties: om,
  $defs: im
};
Object.defineProperty(Ss, "__esModule", { value: !0 });
const um = nh, lm = fh, dm = _h, fm = Nh, hm = Mh, mm = Hh, pm = Qh, $m = cm, ym = ["/properties"];
function gm(e) {
  return [
    um,
    lm,
    dm,
    fm,
    hm,
    t(this, mm),
    pm,
    t(this, $m)
  ].forEach((r) => this.addMetaSchema(r, void 0, !1)), this;
  function t(r, n) {
    return e ? r.$dataMetaSchema(n, ym) : n;
  }
}
Ss.default = gm;
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv2020 = void 0;
  const r = On, n = qn, s = zr, a = Ss, c = "https://json-schema.org/draft/2020-12/schema";
  class i extends r.default {
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
      v && (a.default.call(this, m), this.refs["http://json-schema.org/schema"] = c);
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(c) ? c : void 0);
    }
  }
  t.Ajv2020 = i, e.exports = t = i, e.exports.Ajv2020 = i, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = i;
  var o = er();
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return o.KeywordCxt;
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
  var u = Tt;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return u.default;
  } });
  var f = $t;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return f.default;
  } });
})(dn, dn.exports);
var vm = dn.exports, vn = { exports: {} }, Go = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
  function t(z, K) {
    return { validate: z, compare: K };
  }
  e.fullFormats = {
    // date: http://tools.ietf.org/html/rfc3339#section-5.6
    date: t(a, c),
    // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
    time: t(o(!0), l),
    "date-time": t(g(!0), m),
    "iso-time": t(o(), u),
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
    regex: _e,
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
    date: t(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, c),
    time: t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, l),
    "date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, m),
    "iso-time": t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, u),
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
  function c(z, K) {
    if (z && K)
      return z > K ? 1 : z < K ? -1 : 0;
  }
  const i = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
  function o(z) {
    return function(X) {
      const O = i.exec(X);
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
  function l(z, K) {
    if (!(z && K))
      return;
    const X = (/* @__PURE__ */ new Date("2020-01-01T" + z)).valueOf(), O = (/* @__PURE__ */ new Date("2020-01-01T" + K)).valueOf();
    if (X && O)
      return X - O;
  }
  function u(z, K) {
    if (!(z && K))
      return;
    const X = i.exec(z), O = i.exec(K);
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
    const [X, O] = z.split(f), [A, V] = K.split(f), L = c(X, A);
    if (L !== void 0)
      return L || l(O, V);
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
  const me = /[^\\]\\Z/;
  function _e(z) {
    if (me.test(z))
      return !1;
    try {
      return new RegExp(z), !0;
    } catch {
      return !1;
    }
  }
})(Go);
var Ko = {}, _n = { exports: {} }, Ps = {};
Object.defineProperty(Ps, "__esModule", { value: !0 });
const _m = Cr, Em = Dr, wm = Lr, bm = Ur, Sa = pt, Sm = [
  _m.default,
  Em.default,
  (0, wm.default)(),
  bm.default,
  Sa.metadataVocabulary,
  Sa.contentVocabulary
];
Ps.default = Sm;
const Pm = "http://json-schema.org/draft-07/schema#", Rm = "http://json-schema.org/draft-07/schema#", Im = "Core schema meta-schema", Nm = {
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
}, Om = [
  "object",
  "boolean"
], Tm = {
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
}, jm = {
  $schema: Pm,
  $id: Rm,
  title: Im,
  definitions: Nm,
  type: Om,
  properties: Tm,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
  const r = On, n = Ps, s = zr, a = jm, c = ["/properties"], i = "http://json-schema.org/draft-07/schema";
  class o extends r.default {
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((v) => this.addVocabulary(v)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const v = this.opts.$data ? this.$dataMetaSchema(a, c) : a;
      this.addMetaSchema(v, i, !1), this.refs["http://json-schema.org/schema"] = i;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(i) ? i : void 0);
    }
  }
  t.Ajv = o, e.exports = t = o, e.exports.Ajv = o, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = o;
  var l = er();
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return l.KeywordCxt;
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
  var f = Tt;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return f.default;
  } });
  var g = $t;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return g.default;
  } });
})(_n, _n.exports);
var Am = _n.exports;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
  const t = Am, r = H, n = r.operators, s = {
    formatMaximum: { okStr: "<=", ok: n.LTE, fail: n.GT },
    formatMinimum: { okStr: ">=", ok: n.GTE, fail: n.LT },
    formatExclusiveMaximum: { okStr: "<", ok: n.LT, fail: n.GTE },
    formatExclusiveMinimum: { okStr: ">", ok: n.GT, fail: n.LTE }
  }, a = {
    message: ({ keyword: i, schemaCode: o }) => (0, r.str)`should be ${s[i].okStr} ${o}`,
    params: ({ keyword: i, schemaCode: o }) => (0, r._)`{comparison: ${s[i].okStr}, limit: ${o}}`
  };
  e.formatLimitDefinition = {
    keyword: Object.keys(s),
    type: "string",
    schemaType: "string",
    $data: !0,
    error: a,
    code(i) {
      const { gen: o, data: l, schemaCode: u, keyword: f, it: g } = i, { opts: m, self: v } = g;
      if (!m.validateFormats)
        return;
      const $ = new t.KeywordCxt(g, v.RULES.all.format.definition, "format");
      $.$data ? w() : p();
      function w() {
        const N = o.scopeValue("formats", {
          ref: v.formats,
          code: m.code.formats
        }), j = o.const("fmt", (0, r._)`${N}[${$.schemaCode}]`);
        i.fail$data((0, r.or)((0, r._)`typeof ${j} != "object"`, (0, r._)`${j} instanceof RegExp`, (0, r._)`typeof ${j}.compare != "function"`, S(j)));
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
        i.fail$data(S(D));
      }
      function S(N) {
        return (0, r._)`${N}.compare(${l}, ${u}) ${s[f].fail} 0`;
      }
    },
    dependencies: ["format"]
  };
  const c = (i) => (i.addKeyword(e.formatLimitDefinition), i);
  e.default = c;
})(Ko);
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 });
  const r = Go, n = Ko, s = H, a = new s.Name("fullFormats"), c = new s.Name("fastFormats"), i = (l, u = { keywords: !0 }) => {
    if (Array.isArray(u))
      return o(l, u, r.fullFormats, a), l;
    const [f, g] = u.mode === "fast" ? [r.fastFormats, c] : [r.fullFormats, a], m = u.formats || r.formatNames;
    return o(l, m, f, g), u.keywords && (0, n.default)(l), l;
  };
  i.get = (l, u = "full") => {
    const g = (u === "fast" ? r.fastFormats : r.fullFormats)[l];
    if (!g)
      throw new Error(`Unknown format "${l}"`);
    return g;
  };
  function o(l, u, f, g) {
    var m, v;
    (m = (v = l.opts.code).formats) !== null && m !== void 0 || (v.formats = (0, s._)`require("ajv-formats/dist/formats").${g}`);
    for (const $ of u)
      l.addFormat($, f[$]);
  }
  e.exports = t = i, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = i;
})(vn, vn.exports);
var km = vn.exports;
const Cm = /* @__PURE__ */ Qa(km), Dm = (e, t, r, n) => {
  if (r === "length" || r === "prototype" || r === "arguments" || r === "caller")
    return;
  const s = Object.getOwnPropertyDescriptor(e, r), a = Object.getOwnPropertyDescriptor(t, r);
  !Lm(s, a) && n || Object.defineProperty(e, r, a);
}, Lm = function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value);
}, Mm = (e, t) => {
  const r = Object.getPrototypeOf(t);
  r !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, r);
}, Vm = (e, t) => `/* Wrapped ${e}*/
${t}`, Um = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), zm = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), Fm = (e, t, r) => {
  const n = r === "" ? "" : `with ${r.trim()}() `, s = Vm.bind(null, n, t.toString());
  Object.defineProperty(s, "name", zm);
  const { writable: a, enumerable: c, configurable: i } = Um;
  Object.defineProperty(e, "toString", { value: s, writable: a, enumerable: c, configurable: i });
};
function qm(e, t, { ignoreNonConfigurable: r = !1 } = {}) {
  const { name: n } = e;
  for (const s of Reflect.ownKeys(t))
    Dm(e, t, s, r);
  return Mm(e, t), Fm(e, t, n), e;
}
const Pa = (e, t = {}) => {
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
  let c, i, o;
  const l = function(...u) {
    const f = this, g = () => {
      c = void 0, i && (clearTimeout(i), i = void 0), a && (o = e.apply(f, u));
    }, m = () => {
      i = void 0, c && (clearTimeout(c), c = void 0), a && (o = e.apply(f, u));
    }, v = s && !c;
    return clearTimeout(c), c = setTimeout(g, r), n > 0 && n !== Number.POSITIVE_INFINITY && !i && (i = setTimeout(m, n)), v && (o = e.apply(f, u)), o;
  };
  return qm(l, e), l.cancel = () => {
    c && (clearTimeout(c), c = void 0), i && (clearTimeout(i), i = void 0);
  }, l;
};
var En = { exports: {} };
const Gm = "2.0.0", Ho = 256, Km = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, Hm = 16, Xm = Ho - 6, Bm = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var qr = {
  MAX_LENGTH: Ho,
  MAX_SAFE_COMPONENT_LENGTH: Hm,
  MAX_SAFE_BUILD_LENGTH: Xm,
  MAX_SAFE_INTEGER: Km,
  RELEASE_TYPES: Bm,
  SEMVER_SPEC_VERSION: Gm,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const Wm = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var Gr = Wm;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: s
  } = qr, a = Gr;
  t = e.exports = {};
  const c = t.re = [], i = t.safeRe = [], o = t.src = [], l = t.safeSrc = [], u = t.t = {};
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
    a(w, j, p), u[w] = j, o[j] = p, l[j] = N, c[j] = new RegExp(p, S ? "g" : void 0), i[j] = new RegExp(N, S ? "g" : void 0);
  };
  $("NUMERICIDENTIFIER", "0|[1-9]\\d*"), $("NUMERICIDENTIFIERLOOSE", "\\d+"), $("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${g}*`), $("MAINVERSION", `(${o[u.NUMERICIDENTIFIER]})\\.(${o[u.NUMERICIDENTIFIER]})\\.(${o[u.NUMERICIDENTIFIER]})`), $("MAINVERSIONLOOSE", `(${o[u.NUMERICIDENTIFIERLOOSE]})\\.(${o[u.NUMERICIDENTIFIERLOOSE]})\\.(${o[u.NUMERICIDENTIFIERLOOSE]})`), $("PRERELEASEIDENTIFIER", `(?:${o[u.NONNUMERICIDENTIFIER]}|${o[u.NUMERICIDENTIFIER]})`), $("PRERELEASEIDENTIFIERLOOSE", `(?:${o[u.NONNUMERICIDENTIFIER]}|${o[u.NUMERICIDENTIFIERLOOSE]})`), $("PRERELEASE", `(?:-(${o[u.PRERELEASEIDENTIFIER]}(?:\\.${o[u.PRERELEASEIDENTIFIER]})*))`), $("PRERELEASELOOSE", `(?:-?(${o[u.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${o[u.PRERELEASEIDENTIFIERLOOSE]})*))`), $("BUILDIDENTIFIER", `${g}+`), $("BUILD", `(?:\\+(${o[u.BUILDIDENTIFIER]}(?:\\.${o[u.BUILDIDENTIFIER]})*))`), $("FULLPLAIN", `v?${o[u.MAINVERSION]}${o[u.PRERELEASE]}?${o[u.BUILD]}?`), $("FULL", `^${o[u.FULLPLAIN]}$`), $("LOOSEPLAIN", `[v=\\s]*${o[u.MAINVERSIONLOOSE]}${o[u.PRERELEASELOOSE]}?${o[u.BUILD]}?`), $("LOOSE", `^${o[u.LOOSEPLAIN]}$`), $("GTLT", "((?:<|>)?=?)"), $("XRANGEIDENTIFIERLOOSE", `${o[u.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), $("XRANGEIDENTIFIER", `${o[u.NUMERICIDENTIFIER]}|x|X|\\*`), $("XRANGEPLAIN", `[v=\\s]*(${o[u.XRANGEIDENTIFIER]})(?:\\.(${o[u.XRANGEIDENTIFIER]})(?:\\.(${o[u.XRANGEIDENTIFIER]})(?:${o[u.PRERELEASE]})?${o[u.BUILD]}?)?)?`), $("XRANGEPLAINLOOSE", `[v=\\s]*(${o[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${o[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${o[u.XRANGEIDENTIFIERLOOSE]})(?:${o[u.PRERELEASELOOSE]})?${o[u.BUILD]}?)?)?`), $("XRANGE", `^${o[u.GTLT]}\\s*${o[u.XRANGEPLAIN]}$`), $("XRANGELOOSE", `^${o[u.GTLT]}\\s*${o[u.XRANGEPLAINLOOSE]}$`), $("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), $("COERCE", `${o[u.COERCEPLAIN]}(?:$|[^\\d])`), $("COERCEFULL", o[u.COERCEPLAIN] + `(?:${o[u.PRERELEASE]})?(?:${o[u.BUILD]})?(?:$|[^\\d])`), $("COERCERTL", o[u.COERCE], !0), $("COERCERTLFULL", o[u.COERCEFULL], !0), $("LONETILDE", "(?:~>?)"), $("TILDETRIM", `(\\s*)${o[u.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", $("TILDE", `^${o[u.LONETILDE]}${o[u.XRANGEPLAIN]}$`), $("TILDELOOSE", `^${o[u.LONETILDE]}${o[u.XRANGEPLAINLOOSE]}$`), $("LONECARET", "(?:\\^)"), $("CARETTRIM", `(\\s*)${o[u.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", $("CARET", `^${o[u.LONECARET]}${o[u.XRANGEPLAIN]}$`), $("CARETLOOSE", `^${o[u.LONECARET]}${o[u.XRANGEPLAINLOOSE]}$`), $("COMPARATORLOOSE", `^${o[u.GTLT]}\\s*(${o[u.LOOSEPLAIN]})$|^$`), $("COMPARATOR", `^${o[u.GTLT]}\\s*(${o[u.FULLPLAIN]})$|^$`), $("COMPARATORTRIM", `(\\s*)${o[u.GTLT]}\\s*(${o[u.LOOSEPLAIN]}|${o[u.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", $("HYPHENRANGE", `^\\s*(${o[u.XRANGEPLAIN]})\\s+-\\s+(${o[u.XRANGEPLAIN]})\\s*$`), $("HYPHENRANGELOOSE", `^\\s*(${o[u.XRANGEPLAINLOOSE]})\\s+-\\s+(${o[u.XRANGEPLAINLOOSE]})\\s*$`), $("STAR", "(<|>)?=?\\s*\\*"), $("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), $("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(En, En.exports);
var rr = En.exports;
const Jm = Object.freeze({ loose: !0 }), xm = Object.freeze({}), Ym = (e) => e ? typeof e != "object" ? Jm : e : xm;
var Rs = Ym;
const Ra = /^[0-9]+$/, Xo = (e, t) => {
  const r = Ra.test(e), n = Ra.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, Zm = (e, t) => Xo(t, e);
var Bo = {
  compareIdentifiers: Xo,
  rcompareIdentifiers: Zm
};
const lr = Gr, { MAX_LENGTH: Ia, MAX_SAFE_INTEGER: dr } = qr, { safeRe: fr, t: hr } = rr, Qm = Rs, { compareIdentifiers: vt } = Bo;
let ep = class ze {
  constructor(t, r) {
    if (r = Qm(r), t instanceof ze) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > Ia)
      throw new TypeError(
        `version is longer than ${Ia} characters`
      );
    lr("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? fr[hr.LOOSE] : fr[hr.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > dr || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > dr || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > dr || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((s) => {
      if (/^[0-9]+$/.test(s)) {
        const a = +s;
        if (a >= 0 && a < dr)
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
    if (lr("SemVer.compare", this.version, this.options, t), !(t instanceof ze)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new ze(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof ze || (t = new ze(t, this.options)), vt(this.major, t.major) || vt(this.minor, t.minor) || vt(this.patch, t.patch);
  }
  comparePre(t) {
    if (t instanceof ze || (t = new ze(t, this.options)), this.prerelease.length && !t.prerelease.length)
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
      return vt(n, s);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof ze || (t = new ze(t, this.options));
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
      return vt(n, s);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const s = `-${r}`.match(this.options.loose ? fr[hr.PRERELEASELOOSE] : fr[hr.PRERELEASE]);
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
          n === !1 && (a = [r]), vt(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = a) : this.prerelease = a;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var be = ep;
const Na = be, tp = (e, t, r = !1) => {
  if (e instanceof Na)
    return e;
  try {
    return new Na(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var Dt = tp;
const rp = Dt, np = (e, t) => {
  const r = rp(e, t);
  return r ? r.version : null;
};
var sp = np;
const ap = Dt, op = (e, t) => {
  const r = ap(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var ip = op;
const Oa = be, cp = (e, t, r, n, s) => {
  typeof r == "string" && (s = n, n = r, r = void 0);
  try {
    return new Oa(
      e instanceof Oa ? e.version : e,
      r
    ).inc(t, n, s).version;
  } catch {
    return null;
  }
};
var up = cp;
const Ta = Dt, lp = (e, t) => {
  const r = Ta(e, null, !0), n = Ta(t, null, !0), s = r.compare(n);
  if (s === 0)
    return null;
  const a = s > 0, c = a ? r : n, i = a ? n : r, o = !!c.prerelease.length;
  if (!!i.prerelease.length && !o) {
    if (!i.patch && !i.minor)
      return "major";
    if (i.compareMain(c) === 0)
      return i.minor && !i.patch ? "minor" : "patch";
  }
  const u = o ? "pre" : "";
  return r.major !== n.major ? u + "major" : r.minor !== n.minor ? u + "minor" : r.patch !== n.patch ? u + "patch" : "prerelease";
};
var dp = lp;
const fp = be, hp = (e, t) => new fp(e, t).major;
var mp = hp;
const pp = be, $p = (e, t) => new pp(e, t).minor;
var yp = $p;
const gp = be, vp = (e, t) => new gp(e, t).patch;
var _p = vp;
const Ep = Dt, wp = (e, t) => {
  const r = Ep(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var bp = wp;
const ja = be, Sp = (e, t, r) => new ja(e, r).compare(new ja(t, r));
var Ve = Sp;
const Pp = Ve, Rp = (e, t, r) => Pp(t, e, r);
var Ip = Rp;
const Np = Ve, Op = (e, t) => Np(e, t, !0);
var Tp = Op;
const Aa = be, jp = (e, t, r) => {
  const n = new Aa(e, r), s = new Aa(t, r);
  return n.compare(s) || n.compareBuild(s);
};
var Is = jp;
const Ap = Is, kp = (e, t) => e.sort((r, n) => Ap(r, n, t));
var Cp = kp;
const Dp = Is, Lp = (e, t) => e.sort((r, n) => Dp(n, r, t));
var Mp = Lp;
const Vp = Ve, Up = (e, t, r) => Vp(e, t, r) > 0;
var Kr = Up;
const zp = Ve, Fp = (e, t, r) => zp(e, t, r) < 0;
var Ns = Fp;
const qp = Ve, Gp = (e, t, r) => qp(e, t, r) === 0;
var Wo = Gp;
const Kp = Ve, Hp = (e, t, r) => Kp(e, t, r) !== 0;
var Jo = Hp;
const Xp = Ve, Bp = (e, t, r) => Xp(e, t, r) >= 0;
var Os = Bp;
const Wp = Ve, Jp = (e, t, r) => Wp(e, t, r) <= 0;
var Ts = Jp;
const xp = Wo, Yp = Jo, Zp = Kr, Qp = Os, e$ = Ns, t$ = Ts, r$ = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return xp(e, r, n);
    case "!=":
      return Yp(e, r, n);
    case ">":
      return Zp(e, r, n);
    case ">=":
      return Qp(e, r, n);
    case "<":
      return e$(e, r, n);
    case "<=":
      return t$(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var xo = r$;
const n$ = be, s$ = Dt, { safeRe: mr, t: pr } = rr, a$ = (e, t) => {
  if (e instanceof n$)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? mr[pr.COERCEFULL] : mr[pr.COERCE]);
  else {
    const o = t.includePrerelease ? mr[pr.COERCERTLFULL] : mr[pr.COERCERTL];
    let l;
    for (; (l = o.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || l.index + l[0].length !== r.index + r[0].length) && (r = l), o.lastIndex = l.index + l[1].length + l[2].length;
    o.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], s = r[3] || "0", a = r[4] || "0", c = t.includePrerelease && r[5] ? `-${r[5]}` : "", i = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return s$(`${n}.${s}.${a}${c}${i}`, t);
};
var o$ = a$;
class i$ {
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
var c$ = i$, nn, ka;
function Ue() {
  if (ka) return nn;
  ka = 1;
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
      const M = this.options.loose, I = M ? o[l.HYPHENRANGELOOSE] : o[l.HYPHENRANGE];
      A = A.replace(I, K(this.options.includePrerelease)), c("hyphen replace", A), A = A.replace(o[l.COMPARATORTRIM], u), c("comparator trim", A), A = A.replace(o[l.TILDETRIM], f), c("tilde trim", A), A = A.replace(o[l.CARETTRIM], g), c("caret trim", A);
      let y = A.split(" ").map((h) => S(h, this.options)).join(" ").split(/\s+/).map((h) => z(h, this.options));
      M && (y = y.filter((h) => (c("loose invalid filter", h, this.options), !!h.match(o[l.COMPARATORLOOSE])))), c("range list", y);
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
          A = new i(A, this.options);
        } catch {
          return !1;
        }
      for (let V = 0; V < this.set.length; V++)
        if (X(this.set[V], A, this.options))
          return !0;
      return !1;
    }
  }
  nn = t;
  const r = c$, n = new r(), s = Rs, a = Hr(), c = Gr, i = be, {
    safeRe: o,
    t: l,
    comparatorTrimReplace: u,
    tildeTrimReplace: f,
    caretTrimReplace: g
  } = rr, { FLAG_INCLUDE_PRERELEASE: m, FLAG_LOOSE: v } = qr, $ = (O) => O.value === "<0.0.0-0", w = (O) => O.value === "", p = (O, A) => {
    let V = !0;
    const L = O.slice();
    let G = L.pop();
    for (; V && L.length; )
      V = L.every((M) => G.intersects(M, A)), G = L.pop();
    return V;
  }, S = (O, A) => (c("comp", O, A), O = Z(O, A), c("caret", O), O = j(O, A), c("tildes", O), O = ie(O, A), c("xrange", O), O = _e(O, A), c("stars", O), O), N = (O) => !O || O.toLowerCase() === "x" || O === "*", j = (O, A) => O.trim().split(/\s+/).map((V) => D(V, A)).join(" "), D = (O, A) => {
    const V = A.loose ? o[l.TILDELOOSE] : o[l.TILDE];
    return O.replace(V, (L, G, M, I, y) => {
      c("tilde", O, L, G, M, I, y);
      let P;
      return N(G) ? P = "" : N(M) ? P = `>=${G}.0.0 <${+G + 1}.0.0-0` : N(I) ? P = `>=${G}.${M}.0 <${G}.${+M + 1}.0-0` : y ? (c("replaceTilde pr", y), P = `>=${G}.${M}.${I}-${y} <${G}.${+M + 1}.0-0`) : P = `>=${G}.${M}.${I} <${G}.${+M + 1}.0-0`, c("tilde return", P), P;
    });
  }, Z = (O, A) => O.trim().split(/\s+/).map((V) => ee(V, A)).join(" "), ee = (O, A) => {
    c("caret", O, A);
    const V = A.loose ? o[l.CARETLOOSE] : o[l.CARET], L = A.includePrerelease ? "-0" : "";
    return O.replace(V, (G, M, I, y, P) => {
      c("caret", O, G, M, I, y, P);
      let E;
      return N(M) ? E = "" : N(I) ? E = `>=${M}.0.0${L} <${+M + 1}.0.0-0` : N(y) ? M === "0" ? E = `>=${M}.${I}.0${L} <${M}.${+I + 1}.0-0` : E = `>=${M}.${I}.0${L} <${+M + 1}.0.0-0` : P ? (c("replaceCaret pr", P), M === "0" ? I === "0" ? E = `>=${M}.${I}.${y}-${P} <${M}.${I}.${+y + 1}-0` : E = `>=${M}.${I}.${y}-${P} <${M}.${+I + 1}.0-0` : E = `>=${M}.${I}.${y}-${P} <${+M + 1}.0.0-0`) : (c("no pr"), M === "0" ? I === "0" ? E = `>=${M}.${I}.${y}${L} <${M}.${I}.${+y + 1}-0` : E = `>=${M}.${I}.${y}${L} <${M}.${+I + 1}.0-0` : E = `>=${M}.${I}.${y} <${+M + 1}.0.0-0`), c("caret return", E), E;
    });
  }, ie = (O, A) => (c("replaceXRanges", O, A), O.split(/\s+/).map((V) => me(V, A)).join(" ")), me = (O, A) => {
    O = O.trim();
    const V = A.loose ? o[l.XRANGELOOSE] : o[l.XRANGE];
    return O.replace(V, (L, G, M, I, y, P) => {
      c("xRange", O, L, G, M, I, y, P);
      const E = N(M), d = E || N(I), h = d || N(y), R = h;
      return G === "=" && R && (G = ""), P = A.includePrerelease ? "-0" : "", E ? G === ">" || G === "<" ? L = "<0.0.0-0" : L = "*" : G && R ? (d && (I = 0), y = 0, G === ">" ? (G = ">=", d ? (M = +M + 1, I = 0, y = 0) : (I = +I + 1, y = 0)) : G === "<=" && (G = "<", d ? M = +M + 1 : I = +I + 1), G === "<" && (P = "-0"), L = `${G + M}.${I}.${y}${P}`) : d ? L = `>=${M}.0.0${P} <${+M + 1}.0.0-0` : h && (L = `>=${M}.${I}.0${P} <${M}.${+I + 1}.0-0`), c("xRange return", L), L;
    });
  }, _e = (O, A) => (c("replaceStars", O, A), O.trim().replace(o[l.STAR], "")), z = (O, A) => (c("replaceGTE0", O, A), O.trim().replace(o[A.includePrerelease ? l.GTE0PRE : l.GTE0], "")), K = (O) => (A, V, L, G, M, I, y, P, E, d, h, R) => (N(L) ? V = "" : N(G) ? V = `>=${L}.0.0${O ? "-0" : ""}` : N(M) ? V = `>=${L}.${G}.0${O ? "-0" : ""}` : I ? V = `>=${V}` : V = `>=${V}${O ? "-0" : ""}`, N(E) ? P = "" : N(d) ? P = `<${+E + 1}.0.0-0` : N(h) ? P = `<${E}.${+d + 1}.0-0` : R ? P = `<=${E}.${d}.${h}-${R}` : O ? P = `<${E}.${d}.${+h + 1}-0` : P = `<=${P}`, `${V} ${P}`.trim()), X = (O, A, V) => {
    for (let L = 0; L < O.length; L++)
      if (!O[L].test(A))
        return !1;
    if (A.prerelease.length && !V.includePrerelease) {
      for (let L = 0; L < O.length; L++)
        if (c(O[L].semver), O[L].semver !== a.ANY && O[L].semver.prerelease.length > 0) {
          const G = O[L].semver;
          if (G.major === A.major && G.minor === A.minor && G.patch === A.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return nn;
}
var sn, Ca;
function Hr() {
  if (Ca) return sn;
  Ca = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(u, f) {
      if (f = r(f), u instanceof t) {
        if (u.loose === !!f.loose)
          return u;
        u = u.value;
      }
      u = u.trim().split(/\s+/).join(" "), c("comparator", u, f), this.options = f, this.loose = !!f.loose, this.parse(u), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, c("comp", this);
    }
    parse(u) {
      const f = this.options.loose ? n[s.COMPARATORLOOSE] : n[s.COMPARATOR], g = u.match(f);
      if (!g)
        throw new TypeError(`Invalid comparator: ${u}`);
      this.operator = g[1] !== void 0 ? g[1] : "", this.operator === "=" && (this.operator = ""), g[2] ? this.semver = new i(g[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(u) {
      if (c("Comparator.test", u, this.options.loose), this.semver === e || u === e)
        return !0;
      if (typeof u == "string")
        try {
          u = new i(u, this.options);
        } catch {
          return !1;
        }
      return a(u, this.operator, this.semver, this.options);
    }
    intersects(u, f) {
      if (!(u instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new o(u.value, f).test(this.value) : u.operator === "" ? u.value === "" ? !0 : new o(this.value, f).test(u.semver) : (f = r(f), f.includePrerelease && (this.value === "<0.0.0-0" || u.value === "<0.0.0-0") || !f.includePrerelease && (this.value.startsWith("<0.0.0") || u.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && u.operator.startsWith(">") || this.operator.startsWith("<") && u.operator.startsWith("<") || this.semver.version === u.semver.version && this.operator.includes("=") && u.operator.includes("=") || a(this.semver, "<", u.semver, f) && this.operator.startsWith(">") && u.operator.startsWith("<") || a(this.semver, ">", u.semver, f) && this.operator.startsWith("<") && u.operator.startsWith(">")));
    }
  }
  sn = t;
  const r = Rs, { safeRe: n, t: s } = rr, a = xo, c = Gr, i = be, o = Ue();
  return sn;
}
const u$ = Ue(), l$ = (e, t, r) => {
  try {
    t = new u$(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var Xr = l$;
const d$ = Ue(), f$ = (e, t) => new d$(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var h$ = f$;
const m$ = be, p$ = Ue(), $$ = (e, t, r) => {
  let n = null, s = null, a = null;
  try {
    a = new p$(t, r);
  } catch {
    return null;
  }
  return e.forEach((c) => {
    a.test(c) && (!n || s.compare(c) === -1) && (n = c, s = new m$(n, r));
  }), n;
};
var y$ = $$;
const g$ = be, v$ = Ue(), _$ = (e, t, r) => {
  let n = null, s = null, a = null;
  try {
    a = new v$(t, r);
  } catch {
    return null;
  }
  return e.forEach((c) => {
    a.test(c) && (!n || s.compare(c) === 1) && (n = c, s = new g$(n, r));
  }), n;
};
var E$ = _$;
const an = be, w$ = Ue(), Da = Kr, b$ = (e, t) => {
  e = new w$(e, t);
  let r = new an("0.0.0");
  if (e.test(r) || (r = new an("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const s = e.set[n];
    let a = null;
    s.forEach((c) => {
      const i = new an(c.semver.version);
      switch (c.operator) {
        case ">":
          i.prerelease.length === 0 ? i.patch++ : i.prerelease.push(0), i.raw = i.format();
        case "":
        case ">=":
          (!a || Da(i, a)) && (a = i);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${c.operator}`);
      }
    }), a && (!r || Da(r, a)) && (r = a);
  }
  return r && e.test(r) ? r : null;
};
var S$ = b$;
const P$ = Ue(), R$ = (e, t) => {
  try {
    return new P$(e, t).range || "*";
  } catch {
    return null;
  }
};
var I$ = R$;
const N$ = be, Yo = Hr(), { ANY: O$ } = Yo, T$ = Ue(), j$ = Xr, La = Kr, Ma = Ns, A$ = Ts, k$ = Os, C$ = (e, t, r, n) => {
  e = new N$(e, n), t = new T$(t, n);
  let s, a, c, i, o;
  switch (r) {
    case ">":
      s = La, a = A$, c = Ma, i = ">", o = ">=";
      break;
    case "<":
      s = Ma, a = k$, c = La, i = "<", o = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (j$(e, t, n))
    return !1;
  for (let l = 0; l < t.set.length; ++l) {
    const u = t.set[l];
    let f = null, g = null;
    if (u.forEach((m) => {
      m.semver === O$ && (m = new Yo(">=0.0.0")), f = f || m, g = g || m, s(m.semver, f.semver, n) ? f = m : c(m.semver, g.semver, n) && (g = m);
    }), f.operator === i || f.operator === o || (!g.operator || g.operator === i) && a(e, g.semver))
      return !1;
    if (g.operator === o && c(e, g.semver))
      return !1;
  }
  return !0;
};
var js = C$;
const D$ = js, L$ = (e, t, r) => D$(e, t, ">", r);
var M$ = L$;
const V$ = js, U$ = (e, t, r) => V$(e, t, "<", r);
var z$ = U$;
const Va = Ue(), F$ = (e, t, r) => (e = new Va(e, r), t = new Va(t, r), e.intersects(t, r));
var q$ = F$;
const G$ = Xr, K$ = Ve;
var H$ = (e, t, r) => {
  const n = [];
  let s = null, a = null;
  const c = e.sort((u, f) => K$(u, f, r));
  for (const u of c)
    G$(u, t, r) ? (a = u, s || (s = u)) : (a && n.push([s, a]), a = null, s = null);
  s && n.push([s, null]);
  const i = [];
  for (const [u, f] of n)
    u === f ? i.push(u) : !f && u === c[0] ? i.push("*") : f ? u === c[0] ? i.push(`<=${f}`) : i.push(`${u} - ${f}`) : i.push(`>=${u}`);
  const o = i.join(" || "), l = typeof t.raw == "string" ? t.raw : String(t);
  return o.length < l.length ? o : t;
};
const Ua = Ue(), As = Hr(), { ANY: on } = As, Gt = Xr, ks = Ve, X$ = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new Ua(e, r), t = new Ua(t, r);
  let n = !1;
  e: for (const s of e.set) {
    for (const a of t.set) {
      const c = W$(s, a, r);
      if (n = n || c !== null, c)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, B$ = [new As(">=0.0.0-0")], za = [new As(">=0.0.0")], W$ = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === on) {
    if (t.length === 1 && t[0].semver === on)
      return !0;
    r.includePrerelease ? e = B$ : e = za;
  }
  if (t.length === 1 && t[0].semver === on) {
    if (r.includePrerelease)
      return !0;
    t = za;
  }
  const n = /* @__PURE__ */ new Set();
  let s, a;
  for (const m of e)
    m.operator === ">" || m.operator === ">=" ? s = Fa(s, m, r) : m.operator === "<" || m.operator === "<=" ? a = qa(a, m, r) : n.add(m.semver);
  if (n.size > 1)
    return null;
  let c;
  if (s && a) {
    if (c = ks(s.semver, a.semver, r), c > 0)
      return null;
    if (c === 0 && (s.operator !== ">=" || a.operator !== "<="))
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
  let i, o, l, u, f = a && !r.includePrerelease && a.semver.prerelease.length ? a.semver : !1, g = s && !r.includePrerelease && s.semver.prerelease.length ? s.semver : !1;
  f && f.prerelease.length === 1 && a.operator === "<" && f.prerelease[0] === 0 && (f = !1);
  for (const m of t) {
    if (u = u || m.operator === ">" || m.operator === ">=", l = l || m.operator === "<" || m.operator === "<=", s) {
      if (g && m.semver.prerelease && m.semver.prerelease.length && m.semver.major === g.major && m.semver.minor === g.minor && m.semver.patch === g.patch && (g = !1), m.operator === ">" || m.operator === ">=") {
        if (i = Fa(s, m, r), i === m && i !== s)
          return !1;
      } else if (s.operator === ">=" && !Gt(s.semver, String(m), r))
        return !1;
    }
    if (a) {
      if (f && m.semver.prerelease && m.semver.prerelease.length && m.semver.major === f.major && m.semver.minor === f.minor && m.semver.patch === f.patch && (f = !1), m.operator === "<" || m.operator === "<=") {
        if (o = qa(a, m, r), o === m && o !== a)
          return !1;
      } else if (a.operator === "<=" && !Gt(a.semver, String(m), r))
        return !1;
    }
    if (!m.operator && (a || s) && c !== 0)
      return !1;
  }
  return !(s && l && !a && c !== 0 || a && u && !s && c !== 0 || g || f);
}, Fa = (e, t, r) => {
  if (!e)
    return t;
  const n = ks(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, qa = (e, t, r) => {
  if (!e)
    return t;
  const n = ks(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var J$ = X$;
const cn = rr, Ga = qr, x$ = be, Ka = Bo, Y$ = Dt, Z$ = sp, Q$ = ip, ey = up, ty = dp, ry = mp, ny = yp, sy = _p, ay = bp, oy = Ve, iy = Ip, cy = Tp, uy = Is, ly = Cp, dy = Mp, fy = Kr, hy = Ns, my = Wo, py = Jo, $y = Os, yy = Ts, gy = xo, vy = o$, _y = Hr(), Ey = Ue(), wy = Xr, by = h$, Sy = y$, Py = E$, Ry = S$, Iy = I$, Ny = js, Oy = M$, Ty = z$, jy = q$, Ay = H$, ky = J$;
var Cy = {
  parse: Y$,
  valid: Z$,
  clean: Q$,
  inc: ey,
  diff: ty,
  major: ry,
  minor: ny,
  patch: sy,
  prerelease: ay,
  compare: oy,
  rcompare: iy,
  compareLoose: cy,
  compareBuild: uy,
  sort: ly,
  rsort: dy,
  gt: fy,
  lt: hy,
  eq: my,
  neq: py,
  gte: $y,
  lte: yy,
  cmp: gy,
  coerce: vy,
  Comparator: _y,
  Range: Ey,
  satisfies: wy,
  toComparators: by,
  maxSatisfying: Sy,
  minSatisfying: Py,
  minVersion: Ry,
  validRange: Iy,
  outside: Ny,
  gtr: Oy,
  ltr: Ty,
  intersects: jy,
  simplifyRange: Ay,
  subset: ky,
  SemVer: x$,
  re: cn.re,
  src: cn.src,
  tokens: cn.t,
  SEMVER_SPEC_VERSION: Ga.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Ga.RELEASE_TYPES,
  compareIdentifiers: Ka.compareIdentifiers,
  rcompareIdentifiers: Ka.rcompareIdentifiers
};
const _t = /* @__PURE__ */ Qa(Cy), Dy = Object.prototype.toString, Ly = "[object Uint8Array]", My = "[object ArrayBuffer]";
function Zo(e, t, r) {
  return e ? e.constructor === t ? !0 : Dy.call(e) === r : !1;
}
function Qo(e) {
  return Zo(e, Uint8Array, Ly);
}
function Vy(e) {
  return Zo(e, ArrayBuffer, My);
}
function Uy(e) {
  return Qo(e) || Vy(e);
}
function zy(e) {
  if (!Qo(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
function Fy(e) {
  if (!Uy(e))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof e}\``);
}
function Ha(e, t) {
  if (e.length === 0)
    return new Uint8Array(0);
  t ?? (t = e.reduce((s, a) => s + a.length, 0));
  const r = new Uint8Array(t);
  let n = 0;
  for (const s of e)
    zy(s), r.set(s, n), n += s.length;
  return r;
}
const $r = {
  utf8: new globalThis.TextDecoder("utf8")
};
function Xa(e, t = "utf8") {
  return Fy(e), $r[t] ?? ($r[t] = new globalThis.TextDecoder(t)), $r[t].decode(e);
}
function qy(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
const Gy = new globalThis.TextEncoder();
function un(e) {
  return qy(e), Gy.encode(e);
}
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
const Ky = Cm.default, Ba = "aes-256-cbc", Et = () => /* @__PURE__ */ Object.create(null), Hy = (e) => e != null, Xy = (e, t) => {
  const r = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), n = typeof t;
  if (r.has(n))
    throw new TypeError(`Setting a value of type \`${n}\` for key \`${e}\` is not allowed as it's not supported by JSON`);
}, wr = "__internal__", ln = `${wr}.migrations.version`;
var st, He, Ne, Xe;
class By {
  constructor(t = {}) {
    Mt(this, "path");
    Mt(this, "events");
    Vt(this, st);
    Vt(this, He);
    Vt(this, Ne);
    Vt(this, Xe, {});
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
    if (Ut(this, Ne, r), r.schema ?? r.ajvOptions ?? r.rootSchema) {
      if (r.schema && typeof r.schema != "object")
        throw new TypeError("The `schema` option must be an object.");
      const c = new vm.Ajv2020({
        allErrors: !0,
        useDefaults: !0,
        ...r.ajvOptions
      });
      Ky(c);
      const i = {
        ...r.rootSchema,
        type: "object",
        properties: r.schema
      };
      Ut(this, st, c.compile(i));
      for (const [o, l] of Object.entries(r.schema ?? {}))
        l != null && l.default && (se(this, Xe)[o] = l.default);
    }
    r.defaults && Ut(this, Xe, {
      ...se(this, Xe),
      ...r.defaults
    }), r.serialize && (this._serialize = r.serialize), r.deserialize && (this._deserialize = r.deserialize), this.events = new EventTarget(), Ut(this, He, r.encryptionKey);
    const n = r.fileExtension ? `.${r.fileExtension}` : "";
    this.path = Y.resolve(r.cwd, `${r.configName ?? "config"}${n}`);
    const s = this.store, a = Object.assign(Et(), r.defaults, s);
    if (r.migrations) {
      if (!r.projectVersion)
        throw new Error("Please specify the `projectVersion` option.");
      this._migrate(r.migrations, r.projectVersion, r.beforeEachMigration);
    }
    this._validate(a);
    try {
      Za.deepEqual(s, a);
    } catch {
      this.store = a;
    }
    r.watch && this._watch();
  }
  get(t, r) {
    if (se(this, Ne).accessPropertiesByDotNotation)
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
      throw new TypeError(`Please don't use the ${wr} key, as it's used to manage this module internal operations.`);
    const { store: n } = this, s = (a, c) => {
      Xy(a, c), se(this, Ne).accessPropertiesByDotNotation ? Gs(n, a, c) : n[a] = c;
    };
    if (typeof t == "object") {
      const a = t;
      for (const [c, i] of Object.entries(a))
        s(c, i);
    } else
      s(t, r);
    this.store = n;
  }
  /**
      Check if an item exists.
  
      @param key - The key of the item to check.
      */
  has(t) {
    return se(this, Ne).accessPropertiesByDotNotation ? Hi(this.store, t) : t in this.store;
  }
  /**
      Reset items to their default values, as defined by the `defaults` or `schema` option.
  
      @see `clear()` to reset all items.
  
      @param keys - The keys of the items to reset.
      */
  reset(...t) {
    for (const r of t)
      Hy(se(this, Xe)[r]) && this.set(r, se(this, Xe)[r]);
  }
  delete(t) {
    const { store: r } = this;
    se(this, Ne).accessPropertiesByDotNotation ? Ki(r, t) : delete r[t], this.store = r;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    this.store = Et();
    for (const t of Object.keys(se(this, Xe)))
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
      const t = B.readFileSync(this.path, se(this, He) ? null : "utf8"), r = this._encryptData(t), n = this._deserialize(r);
      return this._validate(n), Object.assign(Et(), n);
    } catch (t) {
      if ((t == null ? void 0 : t.code) === "ENOENT")
        return this._ensureDirectory(), Et();
      if (se(this, Ne).clearInvalidConfig && t.name === "SyntaxError")
        return Et();
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
    if (!se(this, He))
      return typeof t == "string" ? t : Xa(t);
    try {
      const r = t.slice(0, 16), n = zt.pbkdf2Sync(se(this, He), r.toString(), 1e4, 32, "sha512"), s = zt.createDecipheriv(Ba, n, r), a = t.slice(17), c = typeof a == "string" ? un(a) : a;
      return Xa(Ha([s.update(c), s.final()]));
    } catch {
    }
    return t.toString();
  }
  _handleChange(t, r) {
    let n = t();
    const s = () => {
      const a = n, c = t();
      ci(c, a) || (n = c, r.call(this, c, a));
    };
    return this.events.addEventListener("change", s), () => {
      this.events.removeEventListener("change", s);
    };
  }
  _validate(t) {
    if (!se(this, st) || se(this, st).call(this, t) || !se(this, st).errors)
      return;
    const n = se(this, st).errors.map(({ instancePath: s, message: a = "" }) => `\`${s.slice(1)}\` ${a}`);
    throw new Error("Config schema violation: " + n.join("; "));
  }
  _ensureDirectory() {
    B.mkdirSync(Y.dirname(this.path), { recursive: !0 });
  }
  _write(t) {
    let r = this._serialize(t);
    if (se(this, He)) {
      const n = zt.randomBytes(16), s = zt.pbkdf2Sync(se(this, He), n.toString(), 1e4, 32, "sha512"), a = zt.createCipheriv(Ba, s, n);
      r = Ha([n, un(":"), a.update(un(r)), a.final()]);
    }
    if (ue.env.SNAP)
      B.writeFileSync(this.path, r, { mode: se(this, Ne).configFileMode });
    else
      try {
        ao(this.path, r, { mode: se(this, Ne).configFileMode });
      } catch (n) {
        if ((n == null ? void 0 : n.code) === "EXDEV") {
          B.writeFileSync(this.path, r, { mode: se(this, Ne).configFileMode });
          return;
        }
        throw n;
      }
  }
  _watch() {
    this._ensureDirectory(), B.existsSync(this.path) || this._write(Et()), ue.platform === "win32" ? B.watch(this.path, { persistent: !1 }, Pa(() => {
      this.events.dispatchEvent(new Event("change"));
    }, { wait: 100 })) : B.watchFile(this.path, { persistent: !1 }, Pa(() => {
      this.events.dispatchEvent(new Event("change"));
    }, { wait: 5e3 }));
  }
  _migrate(t, r, n) {
    let s = this._get(ln, "0.0.0");
    const a = Object.keys(t).filter((i) => this._shouldPerformMigration(i, s, r));
    let c = { ...this.store };
    for (const i of a)
      try {
        n && n(this, {
          fromVersion: s,
          toVersion: i,
          finalVersion: r,
          versions: a
        });
        const o = t[i];
        o == null || o(this), this._set(ln, i), s = i, c = { ...this.store };
      } catch (o) {
        throw this.store = c, new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${o}`);
      }
    (this._isVersionInRangeFormat(s) || !_t.eq(s, r)) && this._set(ln, r);
  }
  _containsReservedKey(t) {
    return typeof t == "object" && Object.keys(t)[0] === wr ? !0 : typeof t != "string" ? !1 : se(this, Ne).accessPropertiesByDotNotation ? !!t.startsWith(`${wr}.`) : !1;
  }
  _isVersionInRangeFormat(t) {
    return _t.clean(t) === null;
  }
  _shouldPerformMigration(t, r, n) {
    return this._isVersionInRangeFormat(t) ? r !== "0.0.0" && _t.satisfies(r, t) ? !1 : _t.satisfies(n, t) : !(_t.lte(t, r) || _t.gt(t, n));
  }
  _get(t, r) {
    return Gi(this.store, t, r);
  }
  _set(t, r) {
    const { store: n } = this;
    Gs(n, t, r), this.store = n;
  }
}
st = new WeakMap(), He = new WeakMap(), Ne = new WeakMap(), Xe = new WeakMap();
const { app: br, ipcMain: wn, shell: Wy } = Sn;
let Wa = !1;
const Ja = () => {
  if (!wn || !br)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const e = {
    defaultCwd: br.getPath("userData"),
    appVersion: br.getVersion()
  };
  return Wa || (wn.on("electron-store-get-data", (t) => {
    t.returnValue = e;
  }), Wa = !0), e;
};
class Jy extends By {
  constructor(t) {
    let r, n;
    if (ue.type === "renderer") {
      const s = Sn.ipcRenderer.sendSync("electron-store-get-data");
      if (!s)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: r, appVersion: n } = s);
    } else wn && br && ({ defaultCwd: r, appVersion: n } = Ja());
    t = {
      name: "config",
      ...t
    }, t.projectVersion || (t.projectVersion = n), t.cwd ? t.cwd = Y.isAbsolute(t.cwd) ? t.cwd : Y.join(r, t.cwd) : t.cwd = r, t.configName = t.name, delete t.name, super(t);
  }
  static initRenderer() {
    Ja();
  }
  async openInEditor() {
    const t = await Wy.openPath(this.path);
    if (t)
      throw new Error(t);
  }
}
const xa = new Jy({
  defaults: {
    darkMode: !1
  }
}), xy = () => {
  Sr.handle("get-setting", (e, t) => xa.get(t)), Sr.handle(
    "set-setting",
    (e, t, r) => {
      xa.set(t, r), e.sender.send("setting-changed", t, r);
    }
  );
}, Yy = ui(import.meta.url), ei = Y.dirname(li(import.meta.url));
Me.setAppUserModelId("com.haydncom.tabzero");
Yy("electron-squirrel-startup") && Me.quit();
process.env.APP_ROOT = Y.join(ei, "..");
const bn = process.env.VITE_DEV_SERVER_URL, u0 = Y.join(process.env.APP_ROOT, "dist-electron"), ti = Y.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = bn ? Y.join(process.env.APP_ROOT, "public") : ti;
let ve;
Ni();
function ri() {
  ve = new Ya({
    icon: Y.join(process.env.VITE_PUBLIC, "icon.png"),
    webPreferences: {
      preload: Y.join(ei, "preload.mjs"),
      webSecurity: !1
    },
    autoHideMenuBar: !0
  }), ve.webContents.on("did-finish-load", () => {
    ve == null || ve.webContents.send("main-process-message", { hello: "world" });
  }), bn ? ve.loadURL(bn) : ve.loadFile(Y.join(ti, "index.html")), Ui(ve), Fi(ve);
}
Me.on("window-all-closed", () => {
  process.platform !== "darwin" && (Me.quit(), ve = null);
});
Me.on("activate", () => {
  Ya.getAllWindows().length === 0 && ri();
});
xy();
Vi();
if (!Me.requestSingleInstanceLock())
  Me.quit();
else {
  const e = async (t) => {
    if (!ve) return;
    const r = t.find((n) => n.startsWith(`${Pn}://`));
    r && ro(ve, r);
  };
  Me.on("second-instance", (t, r) => {
    e(r), ve && (ve.isMinimized() && ve.restore(), ve.focus());
  }), Me.whenReady().then(() => {
    ri(), e(process.argv);
  });
}
export {
  u0 as MAIN_DIST,
  ti as RENDERER_DIST,
  bn as VITE_DEV_SERVER_URL
};
