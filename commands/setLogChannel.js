const { SlashCommandBuilder } = require('discord.js');


const commands = [
    new SlashCommandBuilder()
        .setName('log channel')
        .setDescription('sets current channel to log channel')
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('text channel')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
        .toJSON(),
];