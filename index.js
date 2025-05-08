const toBool = (x) => (x && (x.toLowerCase() === 'true' || x.toLowerCase() === 'on')) || false;
process.env.NODE_OPTIONS = '--max_old_space_size=2560';
global.isUrl = (t) => /https?:\/\/[^\s]+/i.test(t);


global.config = {
    SESSION_ID: process.env.SESSION_ID || "", // multi section use jarvis_xxx, jarvis_xxx
    SUDO: process.env.SUDO ? process.env.SUDO : "",
    HANDLERS: process.env.HANDLERS || "!",
    VPS: toBool(process.env.VPS || "false"),
    MODE: (process.env.MODE || "private").toLowerCase() === "private",
    AUTO_REACT: toBool(process.env.AUTO_REACT || 'false'),
    MEDIA_URL: process.env.MEDIA_URL || 'https://files.catbox.moe/gbd2w3.png'
};
global.server = config.VPS ? "VPS" : process.env.PWD?.includes("userland") ? "LINUX" : process.env.PITCHER_API_BASE_URL?.includes("codesandbox") ? "CODESANDBOX" : process.env.REPLIT_USER ? "REPLIT" : process.env.AWS_REGION ? "AWS" : process.env.TERMUX_VERSION ? "TERMUX" : process.env.DYNO ? "HEROKU" : process.env.KOYEB_APP_ID ? "KOYEB" : process.env.GITHUB_SERVER_URL ? "GITHUB" : process.env.RENDER ? "RENDER" : process.env.RAILWAY_SERVICE_NAME ? "RAILWAY" : process.env.VERCEL ? "VERCEL" : process.env.DIGITALOCEAN_APP_NAME ? "DIGITALOCEAN" : process.env.AZURE_HTTP_FUNCTIONS ? "AZURE" : process.env.NETLIFY ? "NETLIFY" : process.env.FLY_IO ? "FLY_IO" : process.env.CF_PAGES ? "CLOUDFLARE" : process.env.SPACE_ID ? "HUGGINGFACE" : require("os").platform().toUpperCase();
global.api = "https://enthusiastic-ag-lokiking-524102b4.koyeb.app/";
const url = server === "RENDER" ? process.env.RENDER_EXTERNAL_URL : server === "KOYEB" ? "https://" + KOYEB_PUBLIC_DOMAIN : false;
const sessionIds = config.SESSION_ID.split(',').map(s => s.trim());

const http = require('http');
const axios = require('axios');
const { Bot } = require('./core/');
const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Server is Running!');
}).listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

for (const sessionId of sessionIds) {
  Bot({ isStarted: true, sessionId });
};

setInterval(() => {
    if (!url) return;
    axios.get(url, {
        timeout: 5000,
        headers: { 'User-Agent': 'Uptime-Bot' },
        validateStatus: s => s < 500
    }).then(r => 
        console.log(`[${new Date().toISOString()}] Up! ${r.status}`)
    ).catch(e => 
        console.log(`[${new Date().toISOString()}] Down! ${e.message}`)
    );
}, 5 * 60 * 1000);

