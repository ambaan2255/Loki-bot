const { request } = require('../core/');

module.exports = {
  command: ['waifu'],
  type: 'anime',
  react: '🦎',
  fromMe: config.MODE,
  desc: 'fetches a random waifu image',
  execute: async ({ message }) => {
    const { url } = await request('/sfw/waifu', {
      baseURL: 'https://api.waifu.pics'
    });
    
    await message.reply({ url }, {}, 'image');
  }
};
