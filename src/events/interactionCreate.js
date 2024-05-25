const { CommandInteraction } = require('discord.js');
const logger = require('../logger');


module.exports = async function(client, interaction) {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    logger.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await execute(client, interaction, command);
  } catch (error) {
    logger.error(error);
  }
}

async function execute(client, interaction, command) {
  if (!(interaction instanceof CommandInteraction)) {
    logger.info('Not a command interaction');
    return;
  }
  try {
    logger.info(`Executing command: ${command.data.name} for ${interaction.user.username} <${interaction.user.id}>`);
    await command.execute(client, interaction);
  } catch (error) {
    logger.error(`Error executing ${command.data.name}`, error);

    if (!interaction.replied && !interaction.deferred) {
      await interaction.followUp({
        content: 'There was an error executing this command.',
        ephemeral: true,
      });
    }
  }
}
