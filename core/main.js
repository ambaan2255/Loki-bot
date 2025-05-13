const { jidNormalizedUser, getContentType, downloadMediaMessage, proto } = require("@whiskeysockets/baileys");
const sudo = ["916235723929@s.whatsapp.net"];
const { getBuffer } = require('./request');
const FileType = require("file-type");
const fs = require("fs");

async function Serialize(client, message) {
    const type = getContentType(message.message) || "conversation";
    const msgContent = message.message?.[type] || {};
    const m = {
        key: message.key,
        id: message.key.id,
        fromMe: message.key.fromMe,
        chat: message.key.remoteJid,
        jid: message.key.remoteJid,
        from: message.key.remoteJid,
        isGroup: message.key.remoteJid.endsWith("@g.us"),
        sender: jidNormalizedUser(
            (message.key.fromMe ? client.user?.id : message.key.participant) || message.key.remoteJid || ""
        ),
        pushName: message.pushName || "Unknown",
        type,
        message: message.message,
        msg: msgContent,
        text: (
            message.message?.conversation ||
            message.message?.extendedTextMessage?.text ||
            msgContent?.text ||
            msgContent?.caption ||
            msgContent?.contentText ||
            msgContent?.selectedDisplayText ||
            msgContent?.title ||
            message.message?.editedMessage?.message?.protocolMessage?.editedMessage?.conversation ||
            ""
        ).trim(),
        data: message,
        prefix: (!config.HANDLERS || config.HANDLERS.trim() === 'null' || config.HANDLERS.trim() === 'false') ? '' : config.HANDLERS.trim(),
        mentionedJid: msgContent?.contextInfo?.mentionedJid || []
    };

    Object.defineProperty(m, "client", { value: client });
    Object.defineProperty(m, "sudo", { value: sudo.concat(botSudo || []) });

    m.number = m.sender.replace(/[^0-9]/g, '');
    m.isBot = m.id.startsWith("3EB") || m.id.endsWith("LOKIXER") || (m.id.length === 16 || m.id.length === 15);

    const quotedMsg = msgContent?.contextInfo?.quotedMessage || null;
    m.isReply = !!quotedMsg;

    if (m.isReply) {
        const quotedType = getContentType(quotedMsg);
        m.quoted = {
            message: quotedMsg,
            type: quotedType,
            msg: quotedMsg[quotedType],
            id: msgContent.contextInfo.stanzaId,
            sender: jidNormalizedUser(msgContent.contextInfo.participant),
            jid: msgContent.contextInfo.remoteJid || m.jid,
        };
        m.quoted.fromMe = m.quoted.sender === jidNormalizedUser(client.user?.id);
        m.quoted.isGroup = m.quoted.jid.endsWith("@g.us");
        m.quoted.data = proto.WebMessageInfo.fromObject({
            key: {
                remoteJid: m.quoted.jid,
                fromMe: m.quoted.fromMe,
                id: m.quoted.id,
                participant: m.quoted.sender
            },
            message: m.quoted.message,
            ...(m.quoted.isGroup ? { participant: m.quoted.sender } : {})
        });
        m.quoted.text = (
            m.quoted.msg?.text ||
            m.quoted.msg?.caption ||
            m.quoted.msg?.contentText ||
            m.quoted.msg?.selectedDisplayText ||
            m.quoted.msg?.title ||
            ""
        ).trim();
        m.quoted.download = async () =>
            await downloadMediaMessage(m.quoted.data, "buffer", { reuploadRequest: client.updateMediaMessage });
    } else {
        m.quoted = {};
    }

    m.reply = async (content, options = {}, type = "text", jid = m.jid) => {
        const msg = await client.sendMessage(jid, { [type]: content, ...options }, { quoted: m.data });

        msg.delete = async () => {
            return await client.sendMessage(msg.key.remoteJid, {
                delete: {
                    ...msg.key,
                    participant: m.sender
                }
            });
        };

        msg.edit = async (conversation) => {
            return await client.sendMessage(msg.key.remoteJid, {
                text: conversation,
                edit: msg.key
            });
        };

        msg.react = async (emoji) => {
            return await client.sendMessage(msg.key.remoteJid, {
                react: {
                    text: emoji,
                    key: msg.key
                }
            });
        };

        return msg;
    };

    m.save = async (content, options = { type: 'buffer' }) => {
        const buffer = await downloadMediaMessage(content, "buffer", { reuploadRequest: client.updateMediaMessage });
        if (options.type === 'buffer') return buffer;

        const fileType = await FileType.fromBuffer(buffer);
        const trueFileName = `media.${fileType.ext}`;
        fs.writeFileSync(trueFileName, buffer);
        return trueFileName;
    };

    m.sendFromUrl = async (url, options = {}) => {
        const buff = await getBuffer(url);
        const mime = await FileType.fromBuffer(buff);
        let type = mime.mime.split("/")[0];
        if (type === "audio") options.mimetype = "audio/mpeg";
        if (type === "application") type = "document";
        return client.sendMessage(m.jid, { [type]: buff, ...options }, { ...options });
    };

    return m;
}

module.exports = { Serialize };
