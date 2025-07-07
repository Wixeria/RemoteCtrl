const { EmbedBuilder } = require('discord.js');
const osu = require('os-utils');
const os = require('os');

module.exports = {
  name: 'status',
  execute(msg) {
    osu.cpuUsage(cpu => {
      const totalMem = os.totalmem() / (1024 ** 3);
      const freeMem = os.freemem() / (1024 ** 3);
      const usedMem = totalMem - freeMem;
      const up = os.uptime();

      msg.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x00ff99)
            .setTitle('🖥️ System Status')
            .addFields(
              { name: '🧠 CPU Usage', value: `${(cpu * 100).toFixed(2)}%`, inline: true },
              { name: '💾 RAM', value: `${usedMem.toFixed(2)}GB / ${totalMem.toFixed(2)}GB`, inline: true },
              { name: '🖥️ CPU Cores', value: `${os.cpus().length}`, inline: true },
              { name: '💻 Platform', value: `${os.platform()} ${os.arch()}`, inline: true },
              { name: '⏱️ Uptime', value: `${Math.floor(up / 3600)}h ${Math.floor((up % 3600) / 60)}m ${Math.floor(up % 60)}s`, inline: true }
            )
        ]
      });
    });
  }
};