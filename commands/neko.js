const { request } = require('../core/');

module.exports = {
  command: ['neko'],
  type: 'anime',
  react: '🐙',
  fromMe: config.MODE,
  desc: 'fetches a random neko image',
  execute: async ({ message }) => {
    const { url } = await request('/sfw/neko', {
      baseURL: 'https://api.waifu.pics'
    });
    
    await message.reply({ url }, {}, 'image');
  }
};
