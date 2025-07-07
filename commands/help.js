const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

const pages = [
  {
    title: '🖥️ System Commands',
    fields: [
      { name: '!status', value: 'Show system status (CPU, RAM, uptime, etc.)' },
      { name: '!open <program>', value: 'Open a program or file' },
      { name: '!restart', value: 'Restart the PC (confirmation required)' },
      { name: '!shutdown', value: 'Shutdown the PC (confirmation required)' },
      { name: '!shutdownforce', value: 'Force shutdown immediately' },
      { name: '!cmd <command>', value: 'Run a custom CMD command' },
      { name: '!tasklist', value: 'Show running processes (as file if too long)' },
      { name: '!systeminfo', value: 'Show detailed system info (as file if too long)' },
      { name: '!scheduledtasks', value: 'List scheduled tasks (as file if too long)' },
      { name: '!kill <pid>', value: 'Kill a process by PID' },
      { name: '!pid', value: 'Show all running processes with pagination' },
      { name: '!pid <processname>', value: 'Get PID(s) for a process by name' }
    ]
  },
  {
    title: '🌐 Network Commands',
    fields: [
      { name: '!netstat', value: 'Show network connections/ports (as file)' },
      { name: '!wifi', value: 'Show saved Wi-Fi passwords (as file)' },
      { name: '!ipconfig', value: 'Show IP configuration details' }
    ]
  },
  {
    title: '⚙️ Other Commands',
    fields: [
      { name: '!ping', value: 'Ping the bot' },
      { name: '!screenshot', value: 'Take a screenshot of the desktop' },
      { name: '!camera', value: 'Take a photo from the webcam' }
    ]
  }
];

function getCategoryRow(selected) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('help_system')
      .setLabel('🖥️ System')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(selected === 0),
    new ButtonBuilder()
      .setCustomId('help_network')
      .setLabel('🌐 Network')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(selected === 1),
    new ButtonBuilder()
      .setCustomId('help_other')
      .setLabel('⚙️ Other')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(selected === 2)
  );
}

module.exports = {
  name: 'help',
  async execute(msg) {
    let page = null;

    // Initial embed and row
    const startEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Bot Help')
      .setDescription('Select a category below to view commands.');

    const startRow = getCategoryRow(null);

    const sent = await msg.reply({ embeds: [startEmbed], components: [startRow] });

    const collector = sent.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 120000,
      filter: i => i.user.id === msg.author.id
    });

    collector.on('collect', async interaction => {
      if (interaction.customId === 'help_system') page = 0;
      if (interaction.customId === 'help_network') page = 1;
      if (interaction.customId === 'help_other') page = 2;

      const embed = new EmbedBuilder()
        .setColor(0x00ff99)
        .setTitle(pages[page].title)
        .addFields(pages[page].fields)
        .setFooter({ text: `Category: ${pages[page].title.replace(/^[^a-zA-Z]+/, '')}` });

      await interaction.update({
        embeds: [embed],
        components: [getCategoryRow(page)]
      });
    });

    collector.on('end', async () => {
      await sent.edit({
        embeds: [
          new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('Help Inactive')
            .setDescription('This help message is now inactive.')
        ],
        components: []
      }).catch(() => {});
    });
  }
};