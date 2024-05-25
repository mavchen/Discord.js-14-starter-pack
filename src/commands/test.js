const { SlashCommandBuilder, EmbedBuilder} = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
const logger = require('../logger');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('Test Command')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
    
  async execute(client, interaction) {
    try {
      await interaction.deferReply();

      const embed = new EmbedBuilder()
        .setTitle('Bot v.beta')
        .setDescription('Running in tip-top shape!')
        .setColor(parseInt('00ff00', 16));

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      logger.error('Error executing test command:', error);
    }
    logger.info(`${interaction.user.id} executed test command.`);
  },
};

