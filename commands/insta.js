const { extractUrlsFromText, request } = require('../core/');

module.exports = {
  command: ['insta'],
  type: 'download',
  react: '📷',
  fromMe: config.MODE,
  desc: 'Downloads media from Instagram links',
  execute: async ({ message, match }) => {
    const url = (await extractUrlsFromText(match || message.quoted.text))?.[0];
    if (!url || !isUrl(url) || !url.includes('instagram.com')) return await message.reply('Please provide a valid Instagram *url*');
    const { result: results } = await request('/download/insta', { params: { url } });
    if (!results?.length) return await message.reply('*No content found at the provided URL*');
    for (const { url: mediaUrl } of results) {
      if (mediaUrl) await message.sendFromUrl(mediaUrl, { quoted: message.data });
    }
  }
};
