/*
logs msg deletes
logs msg edit
logs msg image deletes (can be multiple images)
works for multiple servers
/logs: tells you the current log channel
/log-channel <channel>: changes current log channel 
saves the log channel for each server in the txt file
doesnt log any bot actions
TODO:
find a todo
*/

/*
npm init -y
npm install discord.js
npm install dotenv
if theres a certification error, it means your wifi is blocking something, use hotspot
(school wifi)
*/

const fs = require('fs');
require('dotenv').config();
const {Client, GatewayIntentBits, Routes, EmbedBuilder} = require('discord.js');



var servers = {}
// servers = {
//     "1009306799377235980":"1141225224910667828", //mrs. zheng's empire
//     "774391468646989866":"805287348434239489", //fish lake
//     "1141594003859574905":"1141594026064224396", //etgs (test server 1)
//     "1141619892353773638":"1141619939678109726" //ff (test server 2)
// }

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
}, {GatewayIntentBits});

client.on('ready', (c) => { //REFACTOR
    // fs.writeFile('ids.txt', "" , (err) => {if (err) throw err;});
    
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
client.on('messageDelete', message => {
    var file = [];
    var attac = false;
    var chan = servers[message.guild.id];
    console.log("bot del");
    if (message.author.bot) return;
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
            }
            if (message.attachments.size !== 0 ) { //checks for image and logs it
                console.log("image del");
                
                message.attachments.forEach((msg) => { 
                    file.push(msg.url)
                });
                attac = true;
                // let attachments = message.attachments.first();

                //console.log(`${attachments.url}`);
                // embed.setImage(attachments.url)
            }
            // async function sends() {
            //     await channel.send({embeds: [embed]});
            //     if (attac){
            //         await channel.send({files: file});
            //     }
            // }
            // sends();
            channel.send({embeds: [embed], files: file});
        }
    }
})

updatemes = true;
client.on('messageUpdate', (oldMessage, newMessage) => {
    if (newMessage.author.bot) return;
    if (newMessage.content === oldMessage.content && newMessage.attachments.size === oldMessage.attachments.size) return;
    if (!updatemes && (oldMessage.content == newMessage.content)) //fixes the double message update when deleting images
    {
        updatemes = true;
        return;
    }
    var chan = servers[oldMessage.guild.id];
    console.log("msg edit");
    console.log(oldMessage.attachments.size);
    console.log(newMessage.attachments.size);
    if (!oldMessage.partial && !newMessage.partial){
        const channel = client.channels.cache.get(chan)
        if (channel)
        {
            const embed = new EmbedBuilder()
            embed.setTitle('msg edit')
            if (oldMessage.attachments.size !== 0 && newMessage.attachments.size == 0) //if only one image del
            {
                embed.addFields(
                    { name: 'changes', value: "image was removed" },
                )
                let attachments = oldMessage.attachments.first();
                embed.setImage(attachments.url)
                console.log("one image attached");
                updatemes = false;
            }
            else if (oldMessage.attachments.size > newMessage.attachments.size) { //if there are more than one images
                embed.addFields(
                    { name: 'changes', value: "image was removed" },
                )
                newMessage.attachments.forEach((neww) => { //uses selection sort alg to check for deleted image
                    let checker = true;
                    let attachments = neww;
                    oldMessage.attachments.forEach((old) => {
                        if (neww == old) //if image is not deleted then no point in continue
                        {
                            checker == false;
                            return;
                        }
                        else {
                            attachments = old;
                        }
                    });
                    if (checker) //if image is found deleted then add to embed
                    {
                        console.log("old msg attached");
                        embed.setImage(attachments.url)
                        return;
                    }
                });
                updatemes = false;
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
        //if ((interaction.member.permissions.has(0))){
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
        //}
        // else {
        //     interaction.reply(`no rights`);
        // }
    }

    if (interaction.commandName === 'logs') {
        console.log("called logs cmd");
        const channel = servers[interaction.guildId];
        console.log(channel);
        interaction.reply(`The current log channel is ${client.channels.cache.get(channel)}`);
    }
    
});


client.login(process.env.DISCORD_TOKEN)