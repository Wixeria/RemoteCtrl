const { EmbedBuilder } = require('discord.js');
const screenshot = require('screenshot-desktop');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'screenshot',
  async execute(msg) {
    const filePath = path.join(__dirname, '..', 'screenshot.jpg');
    screenshot({ filename: filePath })
      .then(() => {
        msg.reply({
          embeds: [new EmbedBuilder().setColor(0x00ff99).setDescription('📸 Screenshot taken!')],
          files: [filePath]
        }).then(() => fs.unlinkSync(filePath));
      })
      .catch(() => msg.reply({ embeds: [new EmbedBuilder().setColor(0xff0000).setDescription('❌ Failed to take screenshot.')] }));
  }
};