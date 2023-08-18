/*
logs msg deletes
logs msg edit
logs msg image deletes (can be multiple images)
works for multiple servers
TODO:
make slash command set log channel
save log channel and guild ids into txt file
*/

/*
npm init -y
npm install discord.js
npm install dotenv
if theres a certification error, it means your wifi is blocking something, use hotspot
(school wifi)
*/


require('dotenv').config();
const {Client, GatewayIntentBits, Routes, REST, EmbedBuilder} = require('discord.js')
const {logCommand} = require('./commands/setLogChannel.js');
const fs = require('fs')
const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;


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
		GatewayIntentBits.GuildMembers,
	],
}, {GatewayIntentBits});

client.on('ready', (c) => {
    // (client.guilds.cache).forEach((guild) => {
    //     fs.writeFile('ids.txt', "" , (err) => {if (err) throw err;})
    //     fs.appendFile('ids.txt', guild.name + "\n" + guild.id +\nthing\ninds\n\n" , (err) => {if (err) throw err;}) 
    //     servers[guild.id] = guild.systemChannelId;
    // })
    // line = rawFile.responseText.split("\n");
    // for (let i = 0; i < line.length; i = i+4){

    // }
    fs.readFile('ids.txt', function(err, data) {
        if(err) throw err;
        var array = data.toString().split("\n");
        for (let i = 0; i < array.length; i = i + 4)
        {
            server.set(array[i+1], array[i+2]);
        }
    });
    console.log("bot online");
})

//joined a server
client.on("guildCreate", guild => {
    console.log("Joined a new guild: " + guild.name);
    fs.appendFile('ids.txt', guild.name+"\n"+guild.id+"\n"+guild.systemChannelId, (err) => {if (err) throw err;})
    servers[guild.id] = guild.systemChannelId;
})

//removed from a server
client.on("guildDelete", guild => {
    console.log("Left a guild: " + guild.name)
    fs.readFile('ids.txt', function(err, data) {
        if(err) throw err;
        var array = data.toString().split("\n");
        array[array.indexOf(guild.guildId)] = "";
        // delete 4 lines in array
        //remove from dictionary

        const stringa = array.join('\n');
        fs.writeFile('ids.txt', stringa , (err) => {if (err) throw err;})
    });
    delete server[guild.id];    
})


//message delete logger
client.on('messageDelete', message => {
    var chan = servers[message.guild.id];
    console.log("bot del");
    if (message.author.bot) return;
    if (!message.partial){ //makes sure message isnt partial
        const channel = client.channels.cache.get(chan) //get channel id of log channel
        if (channel)
        {
            const embed = new EmbedBuilder() // create embed
            embed.setTitle('msg delete')
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
                let attachments = message.attachments.first();
                console.log(`${attachments.url}`);
                embed.setImage(attachments.url)
            }
            
            channel.send({ embeds: [embed] });
        }
    }
})

updatemes = true;
client.on('messageUpdate', (oldMessage, newMessage) => {
    if (newMessage.author.bot) return;
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
  
    if (interaction.commandName === 'channel log') {
        const channel = interaction.options.get('channel').value;
        interaction.reply(`The log channel is updated to ${client.channels.cache.get(channel)}`);
        fs.readFile('ids.txt', function(err, data) {
            if(err) throw err;
            var array = data.toString().split("\n");
            array[array.indexOf(interaction.guildId) + 1] = channel;
            const stringa = array.join('\n');
            fs.writeFile('ids.txt', stringa , (err) => {if (err) throw err;})
        });
    }
});


const rest = new REST({ version: '10' }).setToken(TOKEN);
const commands = [logCommand];
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
			{ body: logCommand },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();

client.login(process.env.DISCORD_TOKEN)