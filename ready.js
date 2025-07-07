const chalk = require('chalk').default || require('chalk');

module.exports = (client) => {
  if (client.commands && client.commands.size > 0) {
    for (const name of client.commands.keys()) {
      console.log(chalk.cyan('🚀 Command |') + ' ' + chalk.white(name) + ' loaded');
    }
  }
  
  const botName = client.user.tag;
  console.log(
    chalk.green('🟢 |') +
    chalk.white(' Bot ready as ') +
    chalk.yellow(botName)
  );
  client.user.setPresence({
    activities: [{ name: 'made by wixeria :3' }],
    status: 'idle',
  });
};
