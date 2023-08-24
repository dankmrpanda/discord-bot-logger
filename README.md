# discord-bot-logger

## Features:

Logs: Message Deletes, Edits, Deleted images from a message

Saves log channel for each server

Does not log any bot actions


## Slash Commands

/logs: displays current log channel

/log-channel <channel>: sets selected channel to log channel


## Files

index.js: Main file

commands/setLogChannel.js: Slash commands

.env: bot credentials

ids.txt: stores each server's information
```
Server name
Server id
Server Log channel id
<empty line>
```

## Installation

1. Download node.js and Visual Studio Code
2. Clone this repo
3. In the terminal, run the following commands in order:
```
npm init -y
npm install discord.js
npm install dotenv
```

## Invite Link

[Bot Invite](https://discord.com/api/oauth2/authorize?client_id=1143047164520583188&permissions=8&scope=bot)

## SETUP
1. If it's your first time running this, make sure to do `node commands/setLogChannel.js`.

   - This will update/register the slash commands

2. Change the DISCORD_TOKEN (bot token) and CLIENT_ID (bot id) values in .env

3. Run index.js to start the bot.
   - If you see `Error: self-signed certificate in certificate chain`, it means your wifi is blocking discord connections

###TODO

1. find a todo
