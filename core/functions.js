async function extractUrlsFromText(text) {
    if (!text) return false;
    const regexp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()'@:%_\+.~#?!&//=]*)/gi;
    let urls = text.match(regexp);
    return urls || [];
};

module.exports = {
  extractUrlsFromText
};
