const { exec } = require('child_process');
const { sendFileOrEmbed } = require('./utils');

module.exports = {
  name: 'tasklist',
  execute(msg) {
    exec('tasklist', (err, stdout) =>
      sendFileOrEmbed(msg, '📋 Task List', stdout.trim(), 'tasklist.txt')
    );
  }
};