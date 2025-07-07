const { exec } = require('child_process');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'kill',
  execute(msg, args) {
    const pid = args[0];
    if (!pid || isNaN(pid))
      return msg.reply({ embeds: [new EmbedBuilder().setColor(0xff0000).setDescription('❗ Usage: !kill <pid>')] });
    exec(`taskkill /PID ${pid} /F`, (err, stdout, stderr) =>
      msg.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(err ? 0xff0000 : 0x00ff99)
            .setDescription(err ? `❌ Failed to kill process ${pid}.\n${stderr}` : `✅ Killed process ${pid}.`)
        ]
      })
    );
  }
};