const { exec } = require('child_process');
const { sendFileOrEmbed } = require('./utils');

module.exports = {
  name: 'ipconfig',
  execute(msg) {
    exec('ipconfig /all', (err, stdout) =>
      sendFileOrEmbed(msg, '🌐 IP Config', err ? '❌ Failed to get IP config.' : stdout.trim(), 'ipconfig.txt')
    );
  }
};