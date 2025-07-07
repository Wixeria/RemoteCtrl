const { EmbedBuilder } = require('discord.js');
const { exec } = require('child_process');
module.exports = {
  name: 'open',
  execute(msg, args) {
    const program = args.join(' ');
    if (!program)
      return msg.reply({
        embeds: [new EmbedBuilder().setColor(0xff0000).setDescription('❗ Provide a program or command to open.')]
      });
    exec(program, err =>
      msg.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(err ? 0xff0000 : 0x00ff99)
            .setDescription(err ? `❌ Failed: ${err.message}` : `✅ Opened: \`${program}\``)
        ]
      })
    );
  }
};