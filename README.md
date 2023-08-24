# discord-bot-logger

**Features:**

Logs: Message Deletes, Edits, Deleted images from an message

Saves log channel for each server

Doesn't Log any bot actions <br />


**Slash Commands**

/logs: displays current log channel

/log-channel <channel>: sets selected channel to log channel <br />


index.js: Main file
commands/setLogChannel.js: Slash commands <br />


****SETUP****

If it's your first time running this, make sure to do `node commands/setLogChannel.js`.

This will update/register the slash commands <br />


Change the DISCORD_TOKEN (bot token) and CLIENT_ID (bot id) values in .env

Run index.js to start the bot.
