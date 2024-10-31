require("dotenv").config(); // Place this at the very top
const puppeteer = require('puppeteer');
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

// Register commands with Discord
client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    const commands = client.commands.map(cmd => cmd.data.toJSON());
    const guildId = 'YOUR_GUILD_ID';  // Replace with your guild ID
    const guild = client.guilds.cache.get(guildId);
    await guild.commands.set(commands);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error executing this command.', ephemeral: true });
    }
});

client.login(process.env.BOT_TOKEN);
