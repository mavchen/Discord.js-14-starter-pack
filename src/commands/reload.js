const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
const { handleCommands } = require('../functions/handleCommands');
const logger = require('../logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reload-commands')
    .setDescription('Reload Commands for Bot')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(client, interaction) {
    try {
      await interaction.deferReply();

      handleCommands(client); // Reload all commands

      const embed = new EmbedBuilder()
        .setTitle('Command Reload')
        .setDescription('Commands have been successfully reloaded!')
        .setColor(parseInt('00ff00', 16));

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Error executing reload command:', error);

      const errorEmbed = new EmbedBuilder()
        .setTitle('Command Reload Error')
        .setDescription('An error occurred while reloading commands. Check the console for details.')
        .setColor(parseInt('ff0000', 16));

      await interaction.followUp({ embeds: [errorEmbed] });
    }
    logger.info(`${interaction.user.id} executed reload command.`);
  },
};
