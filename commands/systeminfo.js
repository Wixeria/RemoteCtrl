const { exec } = require('child_process');
const { sendFileOrEmbed } = require('./utils');

module.exports = {
  name: 'systeminfo',
  execute(msg) {
    exec('systeminfo', (err, stdout) =>
      sendFileOrEmbed(msg, 'ℹ️ System Info', stdout.trim(), 'systeminfo.txt')
    );
  }
};