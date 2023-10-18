/*
node commands/setLogChannel.js
updates slash cmd
*/

require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

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
        required: true,
      },
    ],
    default_member_permissions: PermissionFlagsBits.ManageMessages.toString(),
  },
  {
    name: 'logs',
    description: 'Replies with current log channel',
    default_member_permissions: PermissionFlagsBits.ManageMessages.toString(),
  },
  {
    name: 'ban',
    description: 'bans user specified',
    options: [
      {
        name: 'user',
        description: 'user that is being banned',
        type: ApplicationCommandOptionType.User,
        require: true,
      },
      {
        name: 'reason',
        description: 'reason of the ban',
        type: ApplicationCommandOptionType.String,
      },
      {
        name: 'delete_user_message',
        description: 'how many days ago do messages get deleted',
        type: ApplicationCommandOptionType.Integer,
      }
    ],
    //default_member_permissions: PermissionFlagsBits.BanMembers.toString(),
  },
  {
    name: 'kick',
    description: 'kicks user specified',
    options: [
      {
        name: 'user',
        description: 'user that is being kicked',
        type: ApplicationCommandOptionType.User,
        require: true,
      },
      {
        name: 'reason',
        description: 'reason of the kick',
        type: ApplicationCommandOptionType.String,
      }
    ],
  //   //default_member_permissions: PermissionFlagsBits.KickMembers.toString(),
  },
  {
    name: 'unban',
    description: 'unbans user specified',
    options: [
      {
        name: 'user',
        description: 'user that is being unbanned',
        type: ApplicationCommandOptionType.User,
        require: true,
      },
      {
        name: 'reason',
        description: 'reason of the unban',
        type: ApplicationCommandOptionType.String,
      }
    ],
  //   //default_member_permissions: PermissionFlagsBits.KickMembers.toString(),
  },
  {
    name: 'timeout',
    description: 'unbans user specified',
    options: [
      {
        name: 'user',
        description: 'user that is being unbanned',
        type: ApplicationCommandOptionType.User,
        require: true,
      },
      {
        name: 'days',
        description: 'how many days they are timeout',
        type: ApplicationCommandOptionType.Integer,
        require: true,
      },
      {
        name: 'hours',
        description: 'how many hours they are timeout',
        type: ApplicationCommandOptionType.Integer,
        require: true,
      },
      {
        name: 'minutes',
        description: 'how many minutes they are timeout',
        type: ApplicationCommandOptionType.Integer,
        require: true,
      },
      {
        name: 'seconds',
        description: 'how many seconds they are timeout',
        type: ApplicationCommandOptionType.Integer,
        require: true,
      },
      {
        name: 'reason',
        description: 'reason of the unban',
        type: ApplicationCommandOptionType.String,
      }
    ],
  //   //default_member_permissions: PermissionFlagsBits.KickMembers.toString(),
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