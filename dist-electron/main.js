import require$$7, { ipcMain, shell, app, globalShortcut, BrowserWindow } from "electron";
import require$$2 from "node:assert";
import require$$3 from "node:fs";
import require$$4 from "node:os";
import path from "node:path";
import require$$6 from "node:util";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var dist = {};
var s = 1e3;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;
var ms = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === "string" && val.length > 0) {
    return parse(val);
  } else if (type === "number" && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
  );
};
function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || "ms").toLowerCase();
  switch (type) {
    case "years":
    case "year":
    case "yrs":
    case "yr":
    case "y":
      return n * y;
    case "weeks":
    case "week":
    case "w":
      return n * w;
    case "days":
    case "day":
    case "d":
      return n * d;
    case "hours":
    case "hour":
    case "hrs":
    case "hr":
    case "h":
      return n * h;
    case "minutes":
    case "minute":
    case "mins":
    case "min":
    case "m":
      return n * m;
    case "seconds":
    case "second":
    case "secs":
    case "sec":
    case "s":
      return n * s;
    case "milliseconds":
    case "millisecond":
    case "msecs":
    case "msec":
    case "ms":
      return n;
    default:
      return void 0;
  }
}
function fmtShort(ms2) {
  var msAbs = Math.abs(ms2);
  if (msAbs >= d) {
    return Math.round(ms2 / d) + "d";
  }
  if (msAbs >= h) {
    return Math.round(ms2 / h) + "h";
  }
  if (msAbs >= m) {
    return Math.round(ms2 / m) + "m";
  }
  if (msAbs >= s) {
    return Math.round(ms2 / s) + "s";
  }
  return ms2 + "ms";
}
function fmtLong(ms2) {
  var msAbs = Math.abs(ms2);
  if (msAbs >= d) {
    return plural(ms2, msAbs, d, "day");
  }
  if (msAbs >= h) {
    return plural(ms2, msAbs, h, "hour");
  }
  if (msAbs >= m) {
    return plural(ms2, msAbs, m, "minute");
  }
  if (msAbs >= s) {
    return plural(ms2, msAbs, s, "second");
  }
  return ms2 + " ms";
}
function plural(ms2, msAbs, n, name2) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms2 / n) + " " + name2 + (isPlural ? "s" : "");
}
var isUrl_1 = isUrl$1;
var protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;
var localhostDomainRE = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/;
var nonLocalhostDomainRE = /^[^\s\.]+\.\S{2,}$/;
function isUrl$1(string) {
  if (typeof string !== "string") {
    return false;
  }
  var match = string.match(protocolAndDomainRE);
  if (!match) {
    return false;
  }
  var everythingAfterProtocol = match[1];
  if (!everythingAfterProtocol) {
    return false;
  }
  if (localhostDomainRE.test(everythingAfterProtocol) || nonLocalhostDomainRE.test(everythingAfterProtocol)) {
    return true;
  }
  return false;
}
var isUrl = isUrl_1;
var laxUrlRegex = /(?:(?:[^:]+:)?[/][/])?(?:.+@)?([^/]+)([/][^?#]+)/;
var commonjs = function(repoUrl, opts) {
  var obj = {};
  opts = opts || {};
  if (!repoUrl) {
    return null;
  }
  if (repoUrl.url) {
    repoUrl = repoUrl.url;
  }
  if (typeof repoUrl !== "string") {
    return null;
  }
  var shorthand = repoUrl.match(/^([\w-_]+)\/([\w-_\.]+)(?:#([\w-_\.]+))?$/);
  var mediumhand = repoUrl.match(/^github:([\w-_]+)\/([\w-_\.]+)(?:#([\w-_\.]+))?$/);
  var antiquated = repoUrl.match(/^git@[\w-_\.]+:([\w-_]+)\/([\w-_\.]+)$/);
  if (shorthand) {
    obj.user = shorthand[1];
    obj.repo = shorthand[2];
    obj.branch = shorthand[3] || "master";
    obj.host = "github.com";
  } else if (mediumhand) {
    obj.user = mediumhand[1];
    obj.repo = mediumhand[2];
    obj.branch = mediumhand[3] || "master";
    obj.host = "github.com";
  } else if (antiquated) {
    obj.user = antiquated[1];
    obj.repo = antiquated[2].replace(/\.git$/i, "");
    obj.branch = "master";
    obj.host = "github.com";
  } else {
    repoUrl = repoUrl.replace(/^git\+/, "");
    if (!isUrl(repoUrl)) {
      return null;
    }
    var ref = repoUrl.match(laxUrlRegex) || [];
    var hostname = ref[1];
    var pathname = ref[2];
    if (!hostname) {
      return null;
    }
    if (hostname !== "github.com" && hostname !== "www.github.com" && !opts.enterprise) {
      return null;
    }
    var parts = pathname.match(/^\/([\w-_]+)\/([\w-_\.]+)(\/tree\/[\%\w-_\.\/]+)?(\/blob\/[\%\w-_\.\/]+)?/);
    if (!parts) {
      return null;
    }
    obj.user = parts[1];
    obj.repo = parts[2].replace(/\.git$/i, "");
    obj.host = hostname || "github.com";
    if (parts[3] && /^\/tree\/master\//.test(parts[3])) {
      obj.branch = "master";
      obj.path = parts[3].replace(/\/$/, "");
    } else if (parts[3]) {
      var branchMatch = parts[3].replace(/^\/tree\//, "").match(/[\%\w-_.]*\/?[\%\w-_]+/);
      obj.branch = branchMatch && branchMatch[0];
    } else if (parts[4]) {
      var branchMatch = parts[4].replace(/^\/blob\//, "").match(/[\%\w-_.]*\/?[\%\w-_]+/);
      obj.branch = branchMatch && branchMatch[0];
    } else {
      obj.branch = "master";
    }
  }
  if (obj.host === "github.com") {
    obj.apiHost = "api.github.com";
  } else {
    obj.apiHost = obj.host + "/api/v3";
  }
  obj.tarball_url = "https://" + obj.apiHost + "/repos/" + obj.user + "/" + obj.repo + "/tarball/" + obj.branch;
  obj.clone_url = "https://" + obj.host + "/" + obj.user + "/" + obj.repo;
  if (obj.branch === "master") {
    obj.https_url = "https://" + obj.host + "/" + obj.user + "/" + obj.repo;
    obj.travis_url = "https://travis-ci.org/" + obj.user + "/" + obj.repo;
    obj.zip_url = "https://" + obj.host + "/" + obj.user + "/" + obj.repo + "/archive/master.zip";
  } else {
    obj.https_url = "https://" + obj.host + "/" + obj.user + "/" + obj.repo + "/blob/" + obj.branch;
    obj.travis_url = "https://travis-ci.org/" + obj.user + "/" + obj.repo + "?branch=" + obj.branch;
    obj.zip_url = "https://" + obj.host + "/" + obj.user + "/" + obj.repo + "/archive/" + obj.branch + ".zip";
  }
  if (obj.path) {
    obj.https_url += obj.path;
  }
  obj.api_url = "https://" + obj.apiHost + "/repos/" + obj.user + "/" + obj.repo;
  return obj;
};
const name = "update-electron-app";
const version = "3.1.1";
const require$$8 = {
  name,
  version
};
var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(dist, "__esModule", { value: true });
dist.UpdateSourceType = void 0;
var updateElectronApp_1 = dist.updateElectronApp = updateElectronApp;
dist.makeUserNotifier = makeUserNotifier;
const ms_1 = __importDefault(ms);
const github_url_to_object_1 = __importDefault(commonjs);
const node_assert_1 = __importDefault(require$$2);
const node_fs_1 = __importDefault(require$$3);
const node_os_1 = __importDefault(require$$4);
const node_path_1 = __importDefault(path);
const node_util_1 = require$$6;
const electron_1 = require$$7;
var UpdateSourceType;
(function(UpdateSourceType2) {
  UpdateSourceType2[UpdateSourceType2["ElectronPublicUpdateService"] = 0] = "ElectronPublicUpdateService";
  UpdateSourceType2[UpdateSourceType2["StaticStorage"] = 1] = "StaticStorage";
})(UpdateSourceType || (dist.UpdateSourceType = UpdateSourceType = {}));
const pkg = require$$8;
const userAgent = (0, node_util_1.format)("%s/%s (%s: %s)", pkg.name, pkg.version, node_os_1.default.platform(), node_os_1.default.arch());
const supportedPlatforms = ["darwin", "win32"];
const isHttpsUrl = (maybeURL) => {
  try {
    const { protocol } = new URL(maybeURL);
    return protocol === "https:";
  } catch (_a) {
    return false;
  }
};
function updateElectronApp(opts = {}) {
  const safeOpts = validateInput(opts);
  if (!electron_1.app.isPackaged) {
    const message = "update-electron-app config looks good; aborting updates since app is in development mode";
    if (opts.logger) {
      opts.logger.log(message);
    } else {
      console.log(message);
    }
    return;
  }
  if (electron_1.app.isReady()) {
    initUpdater(safeOpts);
  } else {
    electron_1.app.on("ready", () => initUpdater(safeOpts));
  }
}
function initUpdater(opts) {
  const { updateSource, updateInterval, logger } = opts;
  if (!supportedPlatforms.includes(process === null || process === void 0 ? void 0 : process.platform)) {
    log(`Electron's autoUpdater does not support the '${process.platform}' platform. Ref: https://www.electronjs.org/docs/latest/api/auto-updater#platform-notices`);
    return;
  }
  let feedURL;
  let serverType = "default";
  switch (updateSource.type) {
    case UpdateSourceType.ElectronPublicUpdateService: {
      feedURL = `${updateSource.host}/${updateSource.repo}/${process.platform}-${process.arch}/${electron_1.app.getVersion()}`;
      break;
    }
    case UpdateSourceType.StaticStorage: {
      feedURL = updateSource.baseUrl;
      if (process.platform === "darwin") {
        feedURL += "/RELEASES.json";
        serverType = "json";
      }
      break;
    }
  }
  const requestHeaders = { "User-Agent": userAgent };
  function log(...args) {
    logger.log(...args);
  }
  log("feedURL", feedURL);
  log("requestHeaders", requestHeaders);
  electron_1.autoUpdater.setFeedURL({
    url: feedURL,
    headers: requestHeaders,
    serverType
  });
  electron_1.autoUpdater.on("error", (err) => {
    log("updater error");
    log(err);
  });
  electron_1.autoUpdater.on("checking-for-update", () => {
    log("checking-for-update");
  });
  electron_1.autoUpdater.on("update-available", () => {
    log("update-available; downloading...");
  });
  electron_1.autoUpdater.on("update-not-available", () => {
    log("update-not-available");
  });
  if (opts.notifyUser) {
    electron_1.autoUpdater.on("update-downloaded", (event, releaseNotes, releaseName, releaseDate, updateURL) => {
      log("update-downloaded", [event, releaseNotes, releaseName, releaseDate, updateURL]);
      if (typeof opts.onNotifyUser !== "function") {
        (0, node_assert_1.default)(opts.onNotifyUser === void 0, "onNotifyUser option must be a callback function or undefined");
        log("update-downloaded: notifyUser is true, opening default dialog");
        opts.onNotifyUser = makeUserNotifier();
      } else {
        log("update-downloaded: notifyUser is true, running custom onNotifyUser callback");
      }
      opts.onNotifyUser({
        event,
        releaseNotes,
        releaseDate,
        releaseName,
        updateURL
      });
    });
  }
  electron_1.autoUpdater.checkForUpdates();
  setInterval(() => {
    electron_1.autoUpdater.checkForUpdates();
  }, (0, ms_1.default)(updateInterval));
}
function makeUserNotifier(dialogProps) {
  const defaultDialogMessages = {
    title: "Application Update",
    detail: "A new version has been downloaded. Restart the application to apply the updates.",
    restartButtonText: "Restart",
    laterButtonText: "Later"
  };
  const assignedDialog = Object.assign({}, defaultDialogMessages, dialogProps);
  return (info) => {
    const { releaseNotes, releaseName } = info;
    const { title, restartButtonText, laterButtonText, detail } = assignedDialog;
    const dialogOpts = {
      type: "info",
      buttons: [restartButtonText, laterButtonText],
      title,
      message: process.platform === "win32" ? releaseNotes : releaseName,
      detail
    };
    electron_1.dialog.showMessageBox(dialogOpts).then(({ response }) => {
      if (response === 0) {
        electron_1.autoUpdater.quitAndInstall();
      }
    });
  };
}
function guessRepo() {
  var _a;
  const pkgBuf = node_fs_1.default.readFileSync(node_path_1.default.join(electron_1.app.getAppPath(), "package.json"));
  const pkg2 = JSON.parse(pkgBuf.toString());
  const repoString = ((_a = pkg2.repository) === null || _a === void 0 ? void 0 : _a.url) || pkg2.repository;
  const repoObject = (0, github_url_to_object_1.default)(repoString);
  (0, node_assert_1.default)(repoObject, "repo not found. Add repository string to your app's package.json file");
  return `${repoObject.user}/${repoObject.repo}`;
}
function validateInput(opts) {
  var _a;
  const defaults = {
    host: "https://update.electronjs.org",
    updateInterval: "10 minutes",
    logger: console,
    notifyUser: true
  };
  const { host, updateInterval, logger, notifyUser, onNotifyUser } = Object.assign({}, defaults, opts);
  let updateSource = opts.updateSource;
  if (!updateSource) {
    updateSource = {
      type: UpdateSourceType.ElectronPublicUpdateService,
      repo: opts.repo || guessRepo(),
      host
    };
  }
  switch (updateSource.type) {
    case UpdateSourceType.ElectronPublicUpdateService: {
      (0, node_assert_1.default)((_a = updateSource.repo) === null || _a === void 0 ? void 0 : _a.includes("/"), "repo is required and should be in the format `owner/repo`");
      if (!updateSource.host) {
        updateSource.host = host;
      }
      (0, node_assert_1.default)(updateSource.host && isHttpsUrl(updateSource.host), "host must be a valid HTTPS URL");
      break;
    }
    case UpdateSourceType.StaticStorage: {
      (0, node_assert_1.default)(updateSource.baseUrl && isHttpsUrl(updateSource.baseUrl), "baseUrl must be a valid HTTPS URL");
      break;
    }
  }
  (0, node_assert_1.default)(typeof updateInterval === "string" && updateInterval.match(/^\d+/), "updateInterval must be a human-friendly string interval like `20 minutes`");
  (0, node_assert_1.default)((0, ms_1.default)(updateInterval) >= 5 * 60 * 1e3, "updateInterval must be `5 minutes` or more");
  (0, node_assert_1.default)(logger && typeof logger.log, "function");
  return { updateSource, updateInterval, logger, notifyUser, onNotifyUser };
}
const initLinkHandler = () => {
  ipcMain.handle("open-external", (_e, url) => {
    return shell.openExternal(url);
  });
};
const PROTOCOL = "tabzero";
const handleProtocolUrl = async (window2, rawUrl) => {
  const url = new URL(rawUrl);
  if (!url.protocol.startsWith(PROTOCOL)) return "not a valid url";
  const searchParams = new URLSearchParams(url.search);
  const code = searchParams.get("code");
  const scope = searchParams.get("scope");
  if (!code || !scope) return "no scope or code";
  window2.webContents.send("auth", { code, scope });
};
const initAuthRedirectHandler = (window2) => {
  app.setAsDefaultProtocolClient(PROTOCOL);
  app.on("open-url", async (_event, rawUrl) => {
    handleProtocolUrl(window2, rawUrl);
  });
};
const isValidAccelerator = (accelerator) => {
  try {
    globalShortcut.register(accelerator, () => {
    });
    globalShortcut.unregister(accelerator);
    return true;
  } catch {
    return false;
  }
};
const initHotkeyHandler = (window2) => {
  const hotkeys = {};
  ipcMain.handle(
    "register-hotkey",
    (_e, options) => {
      if (!isValidAccelerator(options.keys)) {
        console.error(`[Hotkey] Invalid accelerator: ${options.keys}`);
        return false;
      }
      const previous = hotkeys[options.name];
      if (previous) globalShortcut.unregister(previous);
      hotkeys[options.name] = options.keys;
      globalShortcut.register(options.keys, () => {
        console.log(`[Hotkey] ${options.name}`);
        window2.webContents.send("hotkey", options.name);
      });
      return true;
    }
  );
};
const require2 = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.setAppUserModelId("com.haydncom.tabzero");
if (require2("electron-squirrel-startup")) app.quit();
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
updateElectronApp_1();
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "icon.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      devTools: true,
      webSecurity: false
    },
    autoHideMenuBar: true
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", { hello: "world" });
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
  initAuthRedirectHandler(win);
  initHotkeyHandler(win);
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
initLinkHandler();
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  const handleArgs = async (argv) => {
    if (!win) return;
    const url = argv.find((arg) => arg.startsWith(`${PROTOCOL}://`));
    if (!url) return;
    handleProtocolUrl(win, url);
  };
  app.on("second-instance", (_event, argv) => {
    handleArgs(argv);
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });
  app.whenReady().then(() => {
    createWindow();
    handleArgs(process.argv);
  });
}
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
