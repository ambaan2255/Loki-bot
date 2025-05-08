const axios = require('axios');

const defaultConfig = {
  baseURL: api,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
};

async function request(url, customConfig = {}, method = 'get', data = {}) {
  const config = {
    ...defaultConfig,
    ...customConfig,
    method,
    url,
    data
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('Request error:', error.response?.data || error.message);
    throw error;
  }
};

async function getBuffer(url, options) {
  try {
    options ? options : {};
    const res = await axios({
      method: "get",
      url,
      headers: {
        DNT: 1,
        "Upgrade-Insecure-Request": 1,
      },
      ...options,
      responseType: "arraybuffer",
    });
    return res.data;
  } catch (e) {
    console.log(`Error : ${e}`);
  }
};

async function extractUrlsFromText(text) {
    if (!text) return false;
    const regexp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()'@:%_\+.~#?!&//=]*)/gi;
    let urls = text.match(regexp);
    return urls || [];
};


module.exports = { 
  request,
  getBuffer,
  extractUrlsFromText
};
