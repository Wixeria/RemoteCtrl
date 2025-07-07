const { EmbedBuilder } = require('discord.js');
const NodeWebcam = require('node-webcam');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'camera',
  async execute(msg) {
    const filePath = path.join(__dirname, '..', 'camera.bmp');
    NodeWebcam.capture("camera", {}, (err) => {
      if (err) {
        msg.reply({ embeds: [new EmbedBuilder().setColor(0xff0000).setDescription('❌ Failed to capture from camera.')] });
      } else {
        msg.reply({
          embeds: [new EmbedBuilder().setColor(0x00ff99).setDescription('📷 Camera capture taken!')],
          files: [filePath]
        }).then(() => fs.unlinkSync(filePath));
      }
    });
  }
};