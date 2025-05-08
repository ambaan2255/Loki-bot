module.exports = {
  command: ["restart", "reboot"],
  type: "system",
  react: "📴",
  fromMe: true,
  desc: 'Restarts the bot/server',
  execute: async ({ message }) => {
    message.reply('_*Restarting*_');
    process.exit(0);
  }
};
