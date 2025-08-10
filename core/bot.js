const fs = require('fs');
const pino = require("pino");
const axios = require('axios');
const { Serialize } = require('./main');
const { loadPlugins } = require('./core');
const bs = require("@whiskeysockets/baileys");


/*async function Bot({ isStarted = true, sessionId }) {
    try {
        const cmds = await loadPlugins();

        const sessionFolderPath = `./session/${sessionId}`;

        if (!fs.existsSync(sessionFolderPath)) {
            fs.mkdirSync(sessionFolderPath, { recursive: true });
            console.log(`Session folder created for ${sessionId}.`);
        }

        const sessionfile = await axios.get(`${api}bot/session?query=${sessionId}`);
        if (!sessionfile?.data?.result) {
            throw new Error(`Invalid SESSION ID: ${sessionId}`);
        }

        Object.entries(sessionfile.data.result).forEach(([key, value]) => {
            fs.writeFileSync(`${sessionFolderPath}/${key}`, value, "utf8");
        });*/
async function Bot() {

		
	const {
		state,
		saveCreds
	} = await useMultiFileAuthState(
		"./session"
	);

       // const { state, saveCreds } = await bs.useMultiFileAuthState(sessionFolderPath);

        const client = bs.default({
            logger: pino({ level: "silent" }),
            auth: state,
            printQRInTerminal: true,
            generateHighQualityLinkPreview: true,
            browser: bs.Browsers.macOS("Desktop"),
            getMessage: async () => ({ conversation: "Hello!" })
        });

        client.user.jid = bs.jidNormalizedUser(client.user.id);
        client.user.number = client.user.jid.replace(/\D/g, '');

        const sudoNumbers = [
            ...(config.SUDO ? config.SUDO.split(/[;,|:/]/) : []),
            client.user.number
        ].map(v => v.replace(/\D/g, '')).filter(Boolean);

        global.botSudo = [];

        client.ev.process(async event => {
            if (event["connection.update"]) {
                const update = event["connection.update"];
                switch (update.connection) {
                    case "connecting":
                        console.log(`[${sessionId}] 🎏 Connecting to WhatsApp...`);
                        break;
                    case "open":
                        console.log(`[${sessionId}] ✅ Login Successful!`);
                        for (const number of sudoNumbers) {
                            try {
                                const [{ exists, jid }] = await client.onWhatsApp(number);
                                if (exists) global.botSudo.push(jid);
                            } catch (e) {
                                console.error(`Error checking number ${number}:`, e.message);
                            }
                        }
                        if (!global.botSudo.length) global.botSudo.push(client.user.jid);
                        if (isStarted) {
                            await client.sendMessage(client.user.jid, { text: "*Bot Started Successfully ✅*" });
                        }
                        break;
                    case "close":
                        console.log(`[${sessionId}] ❌ Connection closed. Reconnecting...`);
                        return setTimeout(() => Bot({ isStarted: false, sessionId }), 5000);
                }
            }

            if (event["creds.update"]) {
                await saveCreds();
            }

            if (event["messages.upsert"]) {
                for (const m of event["messages.upsert"].messages) {
                    if (!m.message || m.message?.reactionMessage) continue;

                    let msg = await Serialize(client, m);

                    const regex = new RegExp("^(" + msg.prefix.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + ")(\\s)(.+)");
                    if (msg.text.startsWith(msg.prefix) && msg.text[1] === " ") {
                        msg.text = msg.text.replace(regex, '$1$3');
                    }

                    let sudo = msg.sudo.includes(msg.sender);

                    for (const command of cmds) {
                        if (command.fromMe && command.fromMe !== 'public' && !sudo) continue;

                        if (command.event) {
                            await command.execute({ message: msg, client }).catch(console.error);
                        } else if (Array.isArray(command.command)) {
                            for (const cmd of command.command) {
                                let EventCmd = msg.prefix + cmd;
                                if (msg.text.toLowerCase().startsWith(EventCmd) && !msg.isBot) {
                                    if (config.AUTO_REACT && command.react) {
                                        await msg.reply({ text: command.react, key: msg.key }, {}, "react");
                                    }
                                    msg.command = EventCmd;
                                    msg.text = msg.text.slice(EventCmd.length).trim();
                                    await command.execute({ message: msg, match: msg.text, client }).catch(console.error);
                                }
                            }
                        }
                    }

                    if (msg.message) {
                        console.log(`===== [${sessionId} NEW MESSAGE] =====`);
                        console.log(`Time     : ${new Date().toLocaleString()}`);
                        console.log(`From     : ${msg.pushName} (${msg.number})`);
                        console.log(`Chat Type: ${msg.isGroup ? "Group" : "Private Chat"} - ${msg.jid}`);
                        console.log(`Message  : ${msg.text || msg.type}`);
                        console.log("=======================================");
                    }
                }
            }
        });

    } catch (error) {
        console.error(`[${sessionId}] ❌ Error:`, error.message);
        setTimeout(() => Bot({ isStarted: false, sessionId }), 5000);
    }
}

module.exports = { Bot };
