module.exports = {
  command: ["uptime", "runtime"],
  type: "system",
  react: "💐",
  fromMe: config.MODE,
  desc: 'Shows bot/server uptime',
  execute: async ({ message }) => {
    message.reply(`_*Runtime is ${Math.floor(process.uptime()/86400)?Math.floor(process.uptime()/86400)+'d ':''}${Math.floor(process.uptime()%86400/3600)?Math.floor(process.uptime()%86400/3600)+'h ':''}${Math.floor(process.uptime()%3600/60)?Math.floor(process.uptime()%3600/60)+'m ':''}${Math.floor(process.uptime()%60)}s*_`);
  }
};
