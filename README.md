# Discord Bot Logger

## Features:

Logs: Message Deletes, Edits, Deleted images from a message

Saves log channel for each server

Does not log any bot actions


## Slash Commands

/logs: displays current log channel

/log-channel <channel>: sets selected channel to log channel


## Files

index.js: Main file

commands/setLogChannel.js: Slash commands config

.env: bot credentials

ids.txt: stores each server's information
```
Server Name
Server ID
Server Log Channel ID
<empty line>
```

## Installation

1. Download [node.js](https://nodejs.org/en) and [Visual Studio Code](https://code.visualstudio.com/download)
2. Clone this repo
3. In the VSC terminal (Ctrl + Shift + `), run the following commands in order:
```
npm init -y
npm install discord.js
npm install dotenv
```

## Invite Link

[Bot Invite Link](https://discord.com/api/oauth2/authorize?client_id=1143047164520583188&permissions=8&scope=bot)

## SETUP
1. If it's your first time running this, make sure to do `node commands/setLogChannel.js` (in VSC terminal).
   - This will update/register the slash commands

2. Create files named `.env` and `ids.txt`
3. Add the following to `.env`
   - Make sure the replace the values for the variables
```
DISCORD_TOKEN = "BOT TOKEN"
CLIENT_ID = "BOT ID"
```

4. Run index.js to start the bot.
   - `node index.js`
   - If you see `Error: self-signed certificate in certificate chain`, it means your WiFi blocks discord connections
   #### Solutions:
   - Use a VPN (AdGuard VPN etc)
   - Change your network (to hotspot etc)

### TODO

1. Find a todo
