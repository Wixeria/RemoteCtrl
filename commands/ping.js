const { EmbedBuilder } = require('discord.js');
module.exports = {
  name: 'ping',
  execute(msg) {
    msg.reply({
      embeds: [
        new EmbedBuilder().setColor(0x00ff99).setDescription('🏓 Pong!')
      ]
    });
  }
};