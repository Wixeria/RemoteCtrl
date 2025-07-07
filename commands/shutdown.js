const { exec } = require('child_process');
const { EmbedBuilder } = require('discord.js');

const OWNER_ID = process.env.OWNER_ID;

module.exports = {
  name: 'shutdown',
  execute(msg) {
    msg.reply({ embeds: [new EmbedBuilder().setColor(0xffa500).setDescription('⚠️ Confirm shutdown with `!confirm` in 30s.')] });
    msg.channel.awaitMessages({
      filter: m => m.author.id === OWNER_ID && m.content.trim().toLowerCase() === '!confirm',
      max: 1, time: 30000, errors: ['time']
    })
      .then(() => {
        msg.reply({ embeds: [new EmbedBuilder().setColor(0x00ff99).setDescription('⚰️ Shutting down...')] });
        exec('shutdown /s /t 0');
      })
      .catch(() => msg.reply({ embeds: [new EmbedBuilder().setColor(0xffa500).setDescription('⏳ Shutdown cancelled.')] }));
  }
};