const { exec } = require('child_process');
const { sendFileOrEmbed } = require('./utils');

module.exports = {
  name: 'scheduledtasks',
  execute(msg) {
    exec('schtasks /query /fo LIST /v', (err, stdout) =>
      sendFileOrEmbed(msg, '⏰ Scheduled Tasks', stdout.trim(), 'scheduledtasks.txt')
    );
  }
};