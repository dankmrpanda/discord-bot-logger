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
client.on('messageDelete', message => {
    console.log("bot del");
    if (!message.partial){
        const channel = client.channels.cache.get('1141244330401595423')
        let messageAttachment = message.attachments.size > 0 ? message.attachments.array()[0].url : null
        if (channel)
        {
            const embed = new EmbedBuilder()
                .setTitle('msg delete')
                .addFields(
                    { name: 'tag', value: `${message.author.tag}` },
                    { name: 'channel', value: `${message.channel.name}` },
                )
                .setDescription(message.content)
                //.setImage(message.attachments[0].url)
                
                .setTimestamp();
            channel.send({ embeds: [embed] });
            
        }
        

    }
})
client.login("MTE0MTIzODMyNjM5ODAyNTgxOQ.GFGV9m.0aqWdt6r_5w0W60mBz_pf2iTM1Hak_sY6BwlyE")