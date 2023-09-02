# Discord Bot Logger

## Features:

__Logs:__
- Message Deletes
- Message Edits
- Deleted images (from message)

Saves log channel for each server

Does not log any bot actions


## Slash Commands (only to admins)

/logs: displays current log channel

/log-channel <channel>: sets selected channel to log channel

By default, the commands are only accessible to admins of the server. To override this, go [here](https://github.com/dankmrpanda/discord-bot-logger/blob/main/README.md#override-command-permissions)

## Override Command Permissions

1. Go to Server Settings > Integrations and click the bot

![image](https://github.com/dankmrpanda/discord-bot-logger/assets/102562350/c6b40de4-e03d-4bf3-9591-9e82f7ba9c35)

2. Find the commands section

![image](https://github.com/dankmrpanda/discord-bot-logger/assets/102562350/abe74d6a-f5c0-44a3-a7a1-4e70506ec381)

3. Click on each command and set overrides for them 

![image](https://github.com/dankmrpanda/discord-bot-logger/assets/102562350/1ccd64c3-2281-43f0-b6bd-f270be99b936)

4. Save your overrides

![image](https://github.com/dankmrpanda/discord-bot-logger/assets/102562350/556a12ff-c9f3-4214-bcfa-70902d5aff1b)


5. After your done, it should have a blue icon indicating you have overrides on

![image](https://github.com/dankmrpanda/discord-bot-logger/assets/102562350/b799f302-e10b-4ca6-94e0-9db91363147b)

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
