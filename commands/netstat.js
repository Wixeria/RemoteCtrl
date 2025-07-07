const { exec } = require('child_process');
const { EmbedBuilder } = require('discord.js');
const { sendFileOrEmbed } = require('./utils');

module.exports = {
  name: 'netstat',
  async execute(msg) {
    exec('netstat -ano', async (err, stdout) => {
      if (err)
        return msg.reply({ embeds: [new EmbedBuilder().setColor(0xff0000).setDescription('❌ Could not get netstat info.')] });
      const dns = require('dns');
      const lines = stdout.trim().split('\n').slice(4);
      let results = [];
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if (parts.length < 5) continue;
        const [proto, local, remote, state, pid] = parts;
        let remoteHost = remote.split(':')[0], displayName = remoteHost;
        if (!['0.0.0.0', '::', '127.0.0.1', '[::]'].includes(remoteHost)) {
          try {
            const hostnames = await new Promise(res => dns.reverse(remoteHost, (e, h) => res(h && h.length ? h[0] : remoteHost)));
            displayName = `${remoteHost} (${hostnames})`;
          } catch { displayName = remoteHost; }
        }
        results.push(
          `Proto: ${proto}\nLocal: ${local}\nRemote: ${displayName}\nState: ${state}\nPID: ${pid}\n${'-'.repeat(40)}`
        );
      }
      sendFileOrEmbed(msg, '🌐 Netstat', results.join('\n'), 'netstat.txt');
    });
  }
};