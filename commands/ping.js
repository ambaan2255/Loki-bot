module.exports = {
  command: ["ping"],
  type: "system",
  react: "🐢",
  fromMe: config.MODE,
  desc: 'displays the speed of the bot',
  execute: async ({ message }) => {
    const start = Date.now();
    const sent = await message.reply("🏓 *Pinging...*");
    await message.reply(`*Pong!*\n_Response Speed:_ _${Date.now() - start}ms_`, { edit: sent.key });
  }
};
