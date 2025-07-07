const { exec } = require('child_process');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { processAliases } = require('./utils');

module.exports = {
  name: 'pid',
  execute(msg, args) {
    const procName = args.join(' ');
    if (!procName) {
      exec('tasklist', (err, stdout) => {
        if (err)
          return msg.reply({ embeds: [new EmbedBuilder().setColor(0xff0000).setDescription('❌ Could not get process list.')] });
        const lines = stdout.trim().split('\n').slice(3);
        const processes = lines.map(line => line.trim().split(/\s+/))
          .filter(parts => parts.length >= 5)
          .map(parts => ({ name: parts[0], pid: parts[1], mem: parts[4] }));

        const pageSize = 15, totalPages = Math.ceil(processes.length / pageSize);
        let page = 0;

        const getPageEmbed = (page) => {
          const start = page * pageSize, end = start + pageSize;
          const display = processes.slice(start, end).map(proc =>
            `\`${proc.name.padEnd(20)}\` | \`${proc.pid.padStart(6)}\` | \`${proc.mem.padStart(8)}\``
          ).join('\n');
          const header = `\`Process Name         \` | \`   PID\` | \`   Memory\``;
          return new EmbedBuilder()
            .setColor(0x00ff99)
            .setTitle('🗂️ Running Processes')
            .setDescription(`\`\`\`\n${header}\n${'-'.repeat(48)}\n${display}\n\`\`\``)
            .setFooter({ text: `Page ${page + 1} of ${totalPages}` });
        };

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId('pid_prev').setLabel('⬅️ Prev').setStyle(ButtonStyle.Secondary).setDisabled(true),
          new ButtonBuilder().setCustomId('pid_next').setLabel('Next ➡️').setStyle(ButtonStyle.Secondary).setDisabled(totalPages <= 1)
        );

        msg.reply({ embeds: [getPageEmbed(page)], components: [row] }).then(sentMsg => {
          const filter = i => i.user.id === msg.author.id && (i.customId === 'pid_prev' || i.customId === 'pid_next');
          const collector = sentMsg.createMessageComponentCollector({ filter, time: 60000 });

          collector.on('collect', async interaction => {
            if (interaction.customId === 'pid_prev' && page > 0) page--;
            if (interaction.customId === 'pid_next' && page < totalPages - 1) page++;

            await interaction.update({
              embeds: [getPageEmbed(page)],
              components: [
                new ActionRowBuilder().addComponents(
                  new ButtonBuilder().setCustomId('pid_prev').setLabel('⬅️ Prev').setStyle(ButtonStyle.Secondary).setDisabled(page === 0),
                  new ButtonBuilder().setCustomId('pid_next').setLabel('Next ➡️').setStyle(ButtonStyle.Secondary).setDisabled(page === totalPages - 1)
                )
              ]
            });
          });

          collector.on('end', () => sentMsg.edit({ components: [] }).catch(() => {}));
        });
      });
    } else {
      let searchName = procName.toLowerCase();
      if (processAliases[searchName]) searchName = processAliases[searchName];
      exec(`tasklist /FI "IMAGENAME eq ${searchName}.exe"`, (err, stdout) => {
        if (err || !stdout.toLowerCase().includes(`${searchName}.exe`)) {
          msg.reply({
            embeds: [
              new EmbedBuilder().setColor(0xff0000).setDescription(
                `❌ No process found with name: ${searchName}.exe\nTip: Use \`!pid\` with no arguments to see all running process names.`
              )
            ]
          });
        } else {
          const lines = stdout.trim().split('\n').slice(3);
          const processes = lines.map(line => line.trim().split(/\s+/))
            .filter(parts => parts[0] && parts[1])
            .map(parts => ({
              name: parts[0],
              pid: parts[1],
              session: parts[2],
              mem: parts.slice(-2).join(' ')
            }));

          if (!processes.length) {
            msg.reply({
              embeds: [
                new EmbedBuilder().setColor(0xff0000).setDescription(
                  `❌ No process found with name: ${searchName}.exe\nTip: Use \`!pid\` with no arguments to see all running process names.`
                )
              ]
            });
            return;
          }

          msg.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(0x00ff99)
                .setTitle(`🔎 PID(s) for ${searchName}.exe`)
                .setDescription(
                  processes.map(proc =>
                    `**Name:** \`${proc.name}\`\n**PID:** \`${proc.pid}\`\n**Session:** \`${proc.session}\`\n**Memory:** \`${proc.mem}\`\n${'-'.repeat(24)}`
                  ).join('\n')
                )
            ]
          });
        }
      });
    }
  }
};