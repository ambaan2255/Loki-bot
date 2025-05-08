const fs = require('fs');
const path = require('path');

function loadPlugins() {
  const plugins = [];
  const pluginFiles = fs.readdirSync(path.join(__dirname, '../commands')).filter(file => file.endsWith('.js'));
  
  for (const file of pluginFiles) {
    const plugin = require(`../commands/${file}`);
    plugins.push(plugin);
  }

  return plugins;
}

module.exports = { loadPlugins };
