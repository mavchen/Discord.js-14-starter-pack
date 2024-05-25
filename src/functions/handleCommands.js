const { Collection } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const fs = require("fs");
const dotenv = require("dotenv");
const config = require("../config");
const logger = require('../logger');


dotenv.config({ path: __dirname + "/../.env" });

async function handleCommands(client) {
  client.commands = new Collection();

  const commandFiles = fs
    .readdirSync("./src/commands")
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    client.commands.set(command.data.name, command);
    logger.info(`Loaded command: ${command.data.name}`);
  }

  const rest = new REST({ version: "10" }).setToken(process.env.token);

  try {
    logger.info("Started refreshing application (/) commands.");

    await rest.put(
      Routes.applicationCommands(config.clientId),
      {
        body: Array.from(client.commands.values()).map((command) =>
          command.data.toJSON()
        ),
      }
    );

    logger.info("Successfully reloaded application (/) commands.");
  } catch (error) {
    logger.error(error);
  }

  client.on("interactionCreate", async (interaction) => {
    try {
      if (interaction.isCommand()) {
        if (interaction.deferred || interaction.replied) return;

        await require("../events/interactionCreate")(client, interaction);
      }
    } catch (error) {
      logger.error(`Error handling interaction: ${error}`);
    }
  });
}

module.exports = { handleCommands };
