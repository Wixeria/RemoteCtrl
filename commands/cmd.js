const { exec } = require('child_process');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'cmd',
  execute(msg, args) {
    const raw = args.join(' ');
    if (!raw)
      return msg.reply({ embeds: [new EmbedBuilder().setColor(0xff0000).setDescription('❗ Provide a command to run.')] });
    exec(raw, (err, stdout, stderr) =>
      msg.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(err ? 0xff0000 : 0x00ff99)
            .setTitle(err ? '⚠️ Error' : '📤 Output')
            .setDescription(`\`\`\`\n${err ? stderr : stdout.slice(0, 1900)}${stdout.length > 1900 ? '\n...[truncated]' : ''}\n\`\`\``)
        ]
      })
    );
  }
};