const { exec } = require('child_process');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'shutdownforce',
  execute(msg) {
    if (msg.author.id !== process.env.OWNER_ID) return;
    exec('shutdown /s /f /t 0');
    msg.reply({ embeds: [new EmbedBuilder().setColor(0xff0000).setDescription('✅ Forced shutdown!')] });
  }
};