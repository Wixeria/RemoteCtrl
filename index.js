const { Client, GatewayIntentBits, Partials } = require('discord.js');
const fs = require('fs');
require('dotenv').config();
const express = require('express');
const path = require('path');
const si = require('systeminformation');

const OWNER_ID = process.env.OWNER_ID;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ],
  partials: [Partials.Channel]
});

client.commands = new Map();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}
const readyHandler = require('./ready.js');
client.on('ready', () => readyHandler(client));

client.on('messageCreate', async (msg) => {
  if (msg.author.bot || msg.author.id !== OWNER_ID) return;
  const args = msg.content.trim().split(/ +/);
  const cmd = args.shift().toLowerCase().replace('!', '');
  const command = client.commands.get(cmd);
  if (command) command.execute(msg, args);
});

client.on('error', console.error);
client.on('shardError', console.error);
process.on('unhandledRejection', console.error);
client.login(process.env.TOKEN);

const app = express();
const PORT = process.env.WEB_PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(['/shutdown', '/restart', '/shutdownforce', '/command'], (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${process.env.WEB_SECRET}`) {
    return res.status(403).send('Forbidden');
  }
  next();
});

function makeWebMsg() {
  return {
    reply: () => Promise.resolve(),
    channel: {
      send: () => Promise.resolve(),
      awaitMessages: () => Promise.resolve({ size: 0, first: () => null })
    }
  };
}

app.post('/shutdown', (req, res) => {
  const command = client.commands.get('shutdown');
  if (command) {
    command.execute(makeWebMsg(), []);
    res.send('Shutdown triggered');
  } else {
    res.status(404).send('Command not found');
  }
});

app.post('/restart', (req, res) => {
  const command = client.commands.get('restart');
  if (command) {
    command.execute(makeWebMsg(), []);
    res.send('Restart triggered');
  } else {
    res.status(404).send('Command not found');
  }
});

app.post('/shutdownforce', (req, res) => {
  const command = client.commands.get('shutdownforce');
  if (command) {
    command.execute(makeWebMsg(), []);
    res.send('Force shutdown triggered');
  } else {
    res.status(404).send('Command not found');
  }
});

app.post('/command', (req, res) => {
  const { name, args = [] } = req.body;
  if (!name) return res.status(400).send('Command name required');
  const command = client.commands.get(name.toLowerCase());
  if (!command) return res.status(404).send('Command not found');

  if (args.length > 0 && !['open', 'kill'].includes(name.toLowerCase())) {
    return res.status(400).send(
      'This command only works with arguments on Discord. Please use this command on Discord for full functionality.'
    );
  }

  command.execute(makeWebMsg(), args);
  res.send(`Command "${name}" executed`);
});

app.get('/api/stats', async (req, res) => {
  try {
    const [cpuLoad, mem, disk] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize()
    ]);
    res.json({
      cpu: { usage: Math.round(cpuLoad.currentLoad) },
      ram: {
        used: (mem.active / 1024 / 1024 / 1024).toFixed(1),
        total: (mem.total / 1024 / 1024 / 1024).toFixed(1)
      },
      disk: {
        used: (disk[0]?.used / 1024 / 1024 / 1024).toFixed(1),
        total: (disk[0]?.size / 1024 / 1024 / 1024).toFixed(1)
      }
    });
  } catch (e) {
    console.error('Stats error:', e);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.listen(PORT, () => {
  console.log(`Web control server running on port ${PORT}`);
});