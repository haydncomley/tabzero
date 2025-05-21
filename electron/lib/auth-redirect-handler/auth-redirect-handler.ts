import type { BrowserWindow } from "electron";
import { app } from "electron";

const PROTOCOL = 'tabzero'

export const initAuthRedirectHandler = (window: BrowserWindow) => {   
    app.setAsDefaultProtocolClient(PROTOCOL); 
    app.on('open-url', async (event, rawUrl) => {
        event.preventDefault();
        const url = new URL(rawUrl);
        console.log('Got URL', rawUrl)
        if (!url.protocol.startsWith(PROTOCOL)) return;
    
        const searchParams = new URLSearchParams(url.search);
        const code = searchParams.get('code');
        const scope = searchParams.get('scope');
    
        if (!code || !scope) return;
    
        const repsonse = await fetch(
            `https://authtwitchcallback-xcnznm7gbq-uc.a.run.app/authTwitchCallback?code=${code}`,
        );
        const data = await repsonse.json();
    
        if (!data.token || !data.twitch) {
            // Handle login failure
            return;
        }
    
        window.webContents.send('auth', data);
      });
}