const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const dotenv = require('dotenv');
const logger = require('./logger');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates,
  ]
});

dotenv.config({ path: __dirname + '/.env' });

const { handleCommands } = require('./functions/handleCommands');
const { handleEvents } = require('./functions/handleEvents');


client.handleCommands = handleCommands;
client.handleEvents = handleEvents;


client.commands = new Collection();
client.cooldowns = new Collection();
client.logger = logger;

const config = require('./config');
const DebugChannel = config.DebugChannel;

async function startBot() {
  try {

    const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
    client.handleEvents(client, eventFiles, "./src/events");

    await client.login(process.env.token).then(async() => {
      await client.handleCommands(client);
    });
  } catch (error) {
    client.logger.error(`Error during initialization: ${error}`);
    setTimeout(() => startBot(), 5000);
  }
}


process.on("error", (err) => {
  client.logger.error("Discord API Error:", err);
  const Embed = new EmbedBuilder()
    .setColor("Red")
    .setTimestamp()
    .setFooter({ text: "⚠️ Anti Crash system" })
    .setTitle("Error Encountered");
  const Channel = client.channels.cache.get(DebugChannel);
  if (!Channel) return;
  Channel.send({
    embeds: [
      Embed.setDescription(
        "**Discord API Error/Catch:\n\n** ```" + err + "```"
      ),
    ],
  });
});

process.on("unhandledRejection", (reason, p) => {
  client.logger.error("Unhandled promise rejection:", reason, p);
  const Embed = new EmbedBuilder()
    .setColor("Red")
    .setTimestamp()
    .setFooter({ text: "⚠️ Anti Crash system" })
    .setTitle("Error Encountered");
  const Channel = client.channels.cache.get(DebugChannel);
  if (!Channel) return;
  Channel.send({
    embeds: [
      Embed.setDescription(
        "**Unhandled Rejection/Catch:\n\n** ```" + reason + "```"
      ),
    ],
  });
});

process.on("uncaughtException", (err, origin) => {
  client.logger.error("Uncaught Exception:", err, origin);
  const Embed = new EmbedBuilder()
    .setColor("Red")
    .setTimestamp()
    .setFooter({ text: "⚠️ Anti Crash system" })
    .setTitle("Error Encountered");
  const Channel = client.channels.cache.get(DebugChannel);
  if (!Channel) return;
  Channel.send({
    embeds: [
      Embed.setDescription(
        "**Uncought Exception/Catch:\n\n** ```" + err + "```"
      ),
    ],
  });
});

process.on("uncaughtExceptionMonitor", (err, origin) => {
  client.logger.error("Uncaught Exception Monitor:", err, origin);
  const Embed = new EmbedBuilder()
    .setColor("Red")
    .setTimestamp()
    .setFooter({ text: "⚠️ Anti Crash system" })
    .setTitle("Error Encountered");
  const Channel = client.channels.cache.get(DebugChannel);
  if (!Channel) return;
  Channel.send({
    embeds: [
      Embed.setDescription(
        "**Uncaught Exception Monitor/Catch:\n\n** ```" + err + "```"
      ),
    ],
  });
});

process.on("warning", (warn) => {
  client.logger.warn("Warning:", warn);
  const Embed = new EmbedBuilder()
    .setColor("Red")
    .setTimestamp()
    .setFooter({ text: "⚠️ Anti Crash system" })
    .setTitle("Error Encountered");
  const Channel = client.channels.cache.get(DebugChannel);
  if (!Channel) return;
  Channel.send({
    embeds: [
      Embed.setDescription(
        "**Warning/Catch:\n\n** ```" + warn + "```"
      ),
    ],
  });
});

startBot();

process.on("unhandledRejection", (reason, p) => {
  client.logger.error(`Unhandled promise rejection: ${reason} ${p}`);
  restartBot(client, reason);
});

process.on("uncaughtException", (err, origin) => {
  client.logger.error(`Uncaught Exception: ${err} ${origin}`);
  restartBot(client, "Uncaught Exception");
});

process.on("uncaughtExceptionMonitor", (err, origin) => {
  client.logger.error(`Uncaught Exception Monitor: ${err} ${origin}`);
  restartBot(client, "Uncaught Exception Monitor");
});

process.on("warning", (warn) => {
  client.logger.warn(`Warning: ${warn}`);
});

async function restartBot(client, reason) {
  client.logger.info(`Restarting bot. Reason: ${reason}`);

  try {
    await client.destroy();

    await new Promise(resolve => setTimeout(resolve, 1000));

    await startBot();
  } catch (error) {
    client.logger.error(`Error during bot restart: ${error}`);

    setTimeout(() => restartBot('Error during restart'), 5000);
  }
}

