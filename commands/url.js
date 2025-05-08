const { uploadToCatbox, toVideo } = require('../core/');

module.exports = {
  command: ["url", "link"],
  type: "converter",
  react: "📃",
  fromMe: config.MODE,
  desc: 'Converts photo, video, or audio to a URL',
  execute: async ({ message }) => {
    if (!message.isReply || !["imageMessage", "videoMessage", "audioMessage"].includes(message.quoted.type)) return await message.reply("_Please reply to a photo, video, or audio_");  
    
    if (message.quoted.type === "imageMessage") {
      const buffer = await message.quoted.download();
      const fileUrl = await uploadToCatbox(buffer, "upload.png", "image/png");
      return await message.reply(fileUrl);
    } else if (message.quoted.type === "videoMessage") {
      const buffer = await message.quoted.download();
      const fileUrl = await uploadToCatbox(buffer, "temp.mp4", "video/mp4");
      return await message.reply(fileUrl);
    } else if (message.quoted.type === "audioMessage") {
      const buffer = await message.quoted.download();
      const media = await toVideo(buffer);
      const fileUrl = await uploadToCatbox(media, "temp.mp4", "video/mp4");
      return await message.reply(fileUrl);
    }
  }
};
