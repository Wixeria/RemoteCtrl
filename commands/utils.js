const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

function sendFileOrEmbed(msg, title, content, filename) {
  if (content.length < 1900) {
    msg.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(0x00ff99)
          .setTitle(title)
          .setDescription(`\`\`\`\n${content}\n\`\`\``)
      ]
    });
  } else {
    const filePath = path.join(__dirname, '..', filename);
    fs.writeFileSync(filePath, content);
    msg.reply({ files: [filePath] }).then(() => fs.unlinkSync(filePath));
  }
}

const processAliases = {
  'chrome': 'chrome', 'google': 'chrome', 'discord': 'discord', 'steam': 'steam',
  'explorer': 'explorer', 'edge': 'msedge', 'firefox': 'firefox'
};

module.exports = { sendFileOrEmbed, processAliases };