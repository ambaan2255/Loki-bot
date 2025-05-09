const { request } = require('../core/');

module.exports = {
  command: ['tg', 'telegram'],
  type: 'stalk',
  react: '🐙',
  fromMe: config.MODE,
  desc: 'telegram profile details',
  execute: async ({ message, match }) => {
    if (!match) return message.reply("*Need a username!*\n_Example: .tg @TGMovies2Bot_");
    const { result } = await request('/stalk/telegram', {
      params: { query: match }
    });
    return message.reply({ url: result.profile },{ 
      caption: `*User name:* ${result.userName}\n*Nick name:* ${result.nickName}\n*About:* ${result.about}\n*Via Telegram:* ${result.telegram}` 
    }, "image");
  }
};
