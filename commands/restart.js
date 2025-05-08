module.exports = {
  command: ["restart", "reboot"],
  type: "system",
  react: "📴",
  fromMe: true,
  desc: 'Restarts the bot/server',
  execute: async ({ message }) => {
    process.exit(0);
  }
};
