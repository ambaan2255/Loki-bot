const { loadPlugins } = require('../core/');

module.exports = {
  command: ["menu", "help", "list"],
  type: "info",
  react: "🔆",
  fromMe: config.MODE,
  desc: "Show command list",
  execute: async ({ message }) => {
    const commands = await loadPlugins();
    let list = commands
      .filter(c => !c.dontAddCommandList && c.command)
      .map(c => ({
        cmd: c.command.toString().match(/(\W*)([A-Za-züşiğ öç1234567890]*)/)[2],
        desc: c.desc || ''
      }))
      .sort((a, b) => a.cmd.localeCompare(b.cmd))
      .map(({ cmd, desc }, i) => `*${i + 1}. ${cmd}*\n${desc}`)
      .join('\n\n');

    const menu = list + "\n\nمصنوع من🤍\n";

    return message.sendFromUrl(config.MEDIA_URL, { caption: menu, gifPlayBack: true });
  }
};
