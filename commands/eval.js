const util = require("util");
const core = require("../core/");

module.exports = {
  event: true,
  fromMe: true,
  dontAddCommandList: true,
  execute: async ({ message, client }) => {
    if (!message.text || !message.text.startsWith(">")) return;
    try {
      const m = message;
      let result = await eval(`(async () => { ${message.text.slice(1)} })()`);
      if (typeof result !== "string") result = util.inspect(result);
      await message.reply(result);
    } catch (err) {
      await message.reply(util.format(err));
    }
  }
};
