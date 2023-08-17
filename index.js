require('dotenv').config();
const {EmbedBuilder}  = require('discord.js')
const { Client, GatewayIntentBits} = require('discord.js');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

client.on('ready', (c) => {
    console.log("bot online");
})

//message delete logger
client.on('messageDelete', message => {
    console.log("bot del");
    if (!message.partial){ //makes sure message isnt partial
        const channel = client.channels.cache.get('1141225224910667828') //get channel id of log channel
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
    if (!updatemes && (oldMessage.content == newMessage.content))
    {
        updatemes = true;
        return;
    }
    console.log("msg edit");
    console.log(oldMessage.attachments.size);
    console.log(newMessage.attachments.size);
    if (!oldMessage.partial && !newMessage.partial){
        const channel = client.channels.cache.get('1141225224910667828')
        if (channel)
        {
            const embed = new EmbedBuilder()
            embed.setTitle('msg edit')
            if (oldMessage.attachments.size !== 0 && newMessage.attachments.size == 0)
            {
                embed.addFields(
                    { name: 'changes', value: "image was removed" },
                )
                let attachments = oldMessage.attachments.first();
                embed.setImage(attachments.url)
                console.log("one image attached");
                updatemes = false;
            }
            else if (oldMessage.attachments.size > newMessage.attachments.size) {
                embed.addFields(
                    { name: 'changes', value: "image was removed" },
                )
                newMessage.attachments.forEach((neww) => {
                    let checker = true;
                    let attachments = neww;
                    oldMessage.attachments.forEach((old) => {
                        if (neww == old)
                        {
                            checker == false;
                        }
                        else {
                            attachments = old;
                        }
                    });
                    if (checker)
                    {
                        console.log("old msg attached");
                        embed.setImage(attachments.url)
                    }
                });
                updatemes = false;
            }

            else {
                embed.addFields(
                    { name: 'old', value: `${oldMessage.content}` },
                    { name: 'new', value: `${newMessage.content}` }
                )
            }
            embed.addFields(
                { name: 'user', value: `${newMessage.author}` },
                { name: 'channel', value: `${newMessage.channel}` }
            )
            
            embed.setTimestamp();
            channel.send({ embeds: [embed] });
        }
    }
    
})
client.login("MTE0MTIzODMyNjM5ODAyNTgxOQ.GFGV9m.0aqWdt6r_5w0W60mBz_pf2iTM1Hak_sY6BwlyE")