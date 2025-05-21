/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  type ProcessEnv = {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
    VITE_DEV_SERVER_URL: string;
  }
}

// Used in Renderer process, expose in `preload.ts`
type Window = {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  ipcRenderer: import('electron').IpcRenderer
}
