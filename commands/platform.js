module.exports = {
  command: ["platform", "server"],
  type: "system",
  react: "🎈",
  fromMe: config.MODE,
  desc: 'Shows platform/server info',
  execute: async ({ message }) => {
    message.reply("*" + server + "*");
  }
};
