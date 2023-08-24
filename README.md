# discord-bot-logger

## Features:

Logs: Message Deletes, Edits, Deleted images from an message

Saves log channel for each server

Doesn't Log any bot actions


## Slash Commands

/logs: displays current log channel

/log-channel <channel>: sets selected channel to log channel

## Files

index.js: Main file

commands/setLogChannel.js: Slash commands 


## SETUP

1. If it's your first time running this, make sure to do `node commands/setLogChannel.js`.

   - This will update/register the slash commands

2. Change the DISCORD_TOKEN (bot token) and CLIENT_ID (bot id) values in .env

3. Run index.js to start the bot.
