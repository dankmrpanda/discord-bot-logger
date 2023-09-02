/*
Created by Raymond Jiang in August 2023.
Copyright © 2023 Raymond Jiang. All rights reserved.
Discord: dankmrpanda
*/

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

var servers = {}

client.on('ready', (c) => {
    var array = fs.readFileSync('ids.txt').toString().split("\n");
    (client.guilds.cache).forEach((guild) => {
        var setLog = guild.systemChannelId;
        var setTxt = guild.name + "\n" + guild.id + "\n" + guild.systemChannelId + "\n\n";
        for (let i = 0; i < array.length; i++)
        {
            if(guild.id == array[i]){
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
                { name: 'channel', value: `${newMessage.channel}` }
            )
            embed.setTimestamp();
            channel.send({ embeds: [embed] });
        }
    }  
})

client.on('interactionCreate', (interaction) => {
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
});

client.login(process.env.DISCORD_TOKEN)