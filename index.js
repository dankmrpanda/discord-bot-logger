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
        const channel = client.channels.cache.get('1141225224910667828')
        if (channel)
        {
            const embed = new EmbedBuilder()
            embed.setTitle('msg delete')
            embed.addFields(
                { name: 'user', value: `${message.author}` },
                { name: 'channel', value: `${message.channel}` },
            )
            embed.setTimestamp();
            if (message.content != "")
            {
                embed.setDescription(message.content)
            }
            if (message.attachments.size !== 0 ) {
                console.log("image del");
                let attachments = message.attachments.first();
                console.log(`${attachments.url}`);
                embed.setImage(attachments.url)
            }
            
            channel.send({ embeds: [embed] });
        }
    }
})
client.login("MTE0MTIzODMyNjM5ODAyNTgxOQ.GFGV9m.0aqWdt6r_5w0W60mBz_pf2iTM1Hak_sY6BwlyE")