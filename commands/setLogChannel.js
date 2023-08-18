const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('channel log')
		.setDescription('chooses channel to set as log channel')
		.addChannelOption((option) =>
		option.setName("channel").setDescription("chooses channel to set as log channel").setRequired(true)
	),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};