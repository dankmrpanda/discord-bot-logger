/*
Created by Raymond Jiang in August 2023.
Copyright © 2023 Raymond Jiang. All rights reserved.
Discord: dankmrpanda
*/

//all the libaries
const fs = require('fs');
require('dotenv').config();
const {Client, GatewayIntentBits, EmbedBuilder} = require('discord.js');
const client = new Client(
    {
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,

        ],
    },  {GatewayIntentBits});

//global variables
var servers = {}

//when bot is on
client.on('ready', (c) => {
    /*
    is server in ids.txt?
        yes
            - add nothing to the file ("")
            - get the log channel id from ids.txt
            - add server id and log channel id to servers dictionary
        no
            - add server name, id, and default channel id to ids.txt
            - add server id and default channel id to servers dictionary
    */

    var array = fs.readFileSync('ids.txt').toString().split("\n");
    (client.guilds.cache).forEach((guild) => { //checks each server the bot is in
        var setLog = guild.systemChannelId;
        var setTxt = guild.name + "\n" + guild.id + "\n" + guild.systemChannelId + "\n\n";
        for (let i = 0; i < array.length; i++) 
        {
            if(guild.id == array[i]) //checks if the server is already in ids.txt
            {
                setLog = array[i + 1];
                setTxt = "";
                break;
            }
        }
        fs.appendFile('ids.txt', setTxt, (err) => {if (err) throw err;});
        servers[guild.id] = setLog; 
    })
    console.log("bot online");
})

//joined a server
client.on("guildCreate", guild => {
    var setTxt = guild.name + "\n" + guild.id + "\n" + guild.systemChannelId + "\n\n";
    var setLog = guild.systemChannelId;
    fs.appendFile('ids.txt', setTxt, (err) => {if (err) throw err;});
    servers[guild.id] = setLog;
    console.log("Joined a new guild: " + guild.name);
})

//removed from a server
client.on("guildDelete", guild => {
    fs.readFile('ids.txt', function(err, data) {
        if(err) throw err;
        var array = data.toString().split("\n");
        array.splice(array.indexOf(guild.guildId), 4);
        delete servers[guild.guildId];
        const stringa = array.join('\n');
        fs.writeFile('ids.txt', stringa , (err) => {if (err) throw err;});
    });
    console.log("Left a guild: " + guild.name)
})


//message delete logger
client.on('messageDelete', async(message) => {
    if (message.author.bot) return;
    if (process.env.EXCEPT.includes(message.author.id)) return;
    var file = [];
    var chan = servers[message.guild.id];
    console.log("bot del");
    if (!message.partial){ //makes sure message isnt partial
        const channel = client.channels.cache.get(chan) //get channel id of log channel
        if (channel)
        {
            const embed = new EmbedBuilder() // create embed
            embed.setTitle('Message Deleted')
            embed.addFields(    
                { name: 'user', value: `${message.author}` },
                { name: 'channel', value: `${message.channel}` },
            )
            embed.setTimestamp();
            if (message.content != "") //makes sure message isnt empty, often goes with image
            {
                embed.setDescription(message.content)
                if (message.reference != null )
                {
                    let referenceMessage = message.channel.messages.cache.get(message.reference.messageId);
                    embed.addFields(    
                        { name: 'replied to', value: `${referenceMessage.author}` },
                        { name: 'reply link', value: `${referenceMessage.url}` },
                        { name: 'reply message', value: `${referenceMessage.content}` },
                    )
                }
            }
            if (message.attachments.size !== 0 ) { //checks for image and logs it
                console.log("image del");
                
                message.attachments.forEach((msg) => { 
                    file.push(msg.url)
                });
            }
            await channel.send({embeds: [embed], files: file});
        }
    }
})

client.on('messageUpdate', (oldMessage, newMessage) => {
    if (newMessage.author.bot) return;
    if (newMessage.content === oldMessage.content && newMessage.attachments.size === oldMessage.attachments.size) return;
    if (process.env.EXCEPT.includes(oldMessage.author.id)) return;
    
    var chan = servers[oldMessage.guild.id];
    console.log("msg edit");
    console.log(oldMessage.attachments.size);
    console.log(newMessage.attachments.size);
    if (!oldMessage.partial && !newMessage.partial){
        const channel = client.channels.cache.get(chan)
        if (channel)
        {
            const embed = new EmbedBuilder()
            embed.setTitle('Message Edited')
            if (oldMessage.attachments.size !== 0 && newMessage.attachments.size == 0) //if only one image del
            {
                embed.addFields(
                    { name: 'Changes', value: "Image was removed" },
                )
                let attachments = oldMessage.attachments.first();
                embed.setImage(attachments.url)
                console.log("one image attached");
            }
            else if (oldMessage.attachments.size > newMessage.attachments.size) { //if there are more than one images
                embed.addFields(
                    { name: 'changes', value: "image was removed" },
                )
                oldMessage.attachments.forEach((old) => { 
                    var found = false;
                    if (newMessage.attachments.find(({id}) => id == old.id) === undefined)
                    {
                        console.log("old msg attached");
                        embed.setImage(old.url)
                        found = true;
                    }
                    if (found) return;
                });                
            }
            else { //only text update
                embed.addFields(
                    { name: 'old', value: `${oldMessage.content}` },
                    { name: 'new', value: `${newMessage.content}` }
                )
                console.log("text was updated")
            }
            embed.addFields(
                { name: 'message link', value: `${newMessage.url}` },
                { name: 'user', value: `${newMessage.author}` },
            )
            embed.setTimestamp();
            channel.send({ embeds: [embed] });
        }
    }  
})

client.on('interactionCreate', async(interaction) => {
    if (!interaction.isChatInputCommand()) return;
    
    if (interaction.commandName === 'log-channel') {  
        const channel = interaction.options.get('channel').value;
        interaction.reply(`The log channel is updated to ${client.channels.cache.get(channel)}`);
        fs.readFile('ids.txt', function(err, data) {
            if(err) throw err;
            var array = data.toString().split("\n");
            array[array.indexOf(interaction.guildId) + 1] = channel;
            const stringa = array.join('\n');
            servers[interaction.guildId] =  channel;
            fs.writeFile('ids.txt', stringa , (err) => {if (err) throw err;});
        });
        console.log("Log Channel Updated to " + client.channels.cache.get(channel));
    }
    if (interaction.commandName === 'logs') {
        console.log("called logs cmd");
        const channel = servers[interaction.guildId];
        console.log(channel);
        interaction.reply(`The current log channel is ${client.channels.cache.get(channel)}`);
    }

    // anything past here only works in zheng empire and if they are included in the env var
    if (!process.env.EXCEPT.includes(interaction.user.id)) return;
    if (!process.env.ENABLE.includes(interaction.guildId)) return;

    const user = interaction.options.get('user');
    var reason = "idk";
    try {
        reason = interaction.options.get('reason').value;
    } catch (err) {}

    if (interaction.commandName === 'ban') {
        console.log("called ban cmd");
        console.log(interaction.user.id);
        var time = 0;
        try {
            time = interaction.options.get('delete_user_message').value;
        } catch (err) {}
        try {
            interaction.guild.members.ban(user, {reason: reason, deleteMessageSeconds: time * 24 * 60 * 60});
            interaction.user.send('User: <@' + user + '> has been banned because: ' + reason, {ephemeral: true});
            //await interaction.reply('User: <@' + user + '> has been banned because: ' + reason, {ephemeral: true});
            // interaction.guild.members.unban(user, {reason: reason});
            console.log('banned <@' + user + '>');
        }
        catch (err) {
            interaction.user.send('Bot does not have permissions to ban', {ephemeral: true});
            //await interaction.reply('Bot does not have permissions to ban', {ephemeral: true});
            console.log("ban fail");
        }
    }
    if (interaction.commandName === 'kick') {
        console.log("called kick cmd");
        console.log(interaction.user.id);
        try {
            interaction.guild.members.kick(user, {reason: reason});
            interaction.user.send('User: <@' + user + '> has been kicked because: ' + reason, {ephemeral: true});
            //await interaction.reply('User: <@' + user + '> has been banned because: ' + reason, {ephemeral: true});
            console.log('kicked <@' + user + '>');
        }
        catch (err) {
            interaction.user.send('Bot does not have permissions to kick', {ephemeral: true});
            //await interaction.reply('Bot does not have permissions to ban', {ephemeral: true});
            console.log("kick fail");
        }
    }

    if (interaction.commandName === 'unban') {
        console.log("called unban cmd");
        console.log(interaction.user.id);
        try {
            interaction.guild.members.unban(user, {reason: reason});
            interaction.user.send('User: <@' + user + '> has been unbanned because: ' + reason, {ephemeral: true});
            //await interaction.reply('User: <@' + user + '> has been banned because: ' + reason, {ephemeral: true});
            console.log('unbanned <@' + user + '>');
        }
        catch (err) {
            interaction.user.send('Bot does not have permissions to unban', {ephemeral: true});
            //await interaction.reply('Bot does not have permissions to ban', {ephemeral: true});
            console.log("unban fail");
        }
    }
    
    if (interaction.commandName === 'timeout') {
        console.log("called unban cmd");
        console.log(interaction.user.id);
        const days = interaction.options.get('days').value;
        const hours = interaction.options.get('hours').value;
        const minutes = interaction.options.get('minutes').value;
        const seconds = interaction.options.get('seconds').value;
        const time = (seconds * 1000) + (minutes * 60 * 1000) + (hours * 60 * 60 * 1000) + (days * 24 * 60 * 60 * 1000);

        try {
            user.member.timeout(time, {reason: reason});
            interaction.user.send('User: ' + user.user.displayName+ 'f has been timeout for ' +
                                days + ' days ' +
                                hours + ' hours ' +
                                minutes + ' minutes ' +
                                seconds + ' seconds ' +
                                'because: ' + reason, {ephemeral: true});
            //await interaction.reply('User: <@' + user + '> has been timeout because: ' + reason, {ephemeral: true});
            console.log('timeout ' + user.user.displayName);
        }
        catch (err) {
            interaction.user.send('Bot does not have permissions to timeout', {ephemeral: true});
            //await interaction.reply('Bot does not have permissions to timeout', {ephemeral: true});
            console.log("timeout fail");
        }
    }

});

client.login(process.env.DISCORD_TOKEN)