/*
node commands/setLogChannel.js
updates slash cmd
*/
//
require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType, ApplicationCommandPermissionType } = require('discord.js');

const commands = [
  {
    name: 'log-channel',
    description: 'Sets chosen Channel as Log Channel',
    options: [
      {
        name: 'channel',
        description: 'Choose the channel you want logs to be in',
        type: ApplicationCommandOptionType.Channel, 
        channel_types: [0],
        // default_member_permissions: 0,
        required: true,
                
      },
    ],
    // permissions: [
    //   "ADMINISTRATOR"
    // ],
  },

  {
    name: 'logs',
    description: 'Replies with current log channel',
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');

    await rest.put(
      Routes.applicationCommands(
        process.env.CLIENT_ID
      ),
      { body: commands }
    );

    console.log('Slash commands were registered successfully!');
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
})();