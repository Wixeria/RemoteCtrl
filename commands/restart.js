const { exec } = require('child_process');
const { EmbedBuilder } = require('discord.js');

const OWNER_ID = process.env.OWNER_ID;

module.exports = {
  name: 'restart',
  execute(msg) {
    msg.reply({ embeds: [new EmbedBuilder().setColor(0xffa500).setDescription('⚠️ Confirm restart with `!confirm` in 30s.')] });
    msg.channel.awaitMessages({
      filter: m => m.author.id === OWNER_ID && m.content.trim().toLowerCase() === '!confirm',
      max: 1, time: 30000, errors: ['time']
    })
      .then(() => {
        msg.reply({ embeds: [new EmbedBuilder().setColor(0x00ff99).setDescription('♻️ Restarting...')] });
        exec('shutdown /r /t 0');
      })
      .catch(() => msg.reply({ embeds: [new EmbedBuilder().setColor(0xffa500).setDescription('⏳ Restart cancelled.')] }));
  }
};