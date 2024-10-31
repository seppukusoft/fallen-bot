const { SlashCommandBuilder } = require('discord.js');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const imagesPath = path.join(__dirname, '../images');

if (!fs.existsSync(imagesPath)) {
    fs.mkdirSync(imagesPath);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('screenshot')
        .setDescription('Takes a screenshot of a website'),
    async execute(interaction) {
        await interaction.reply('Taking a screenshot, please wait...');

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        await page.setViewport({ width: 1200, height: 700 });
        await page.goto('https://seppukusoft.github.io/new-model/');
        
        const screenshotPath = `${imagesPath}/screenshot.png`;
        await page.screenshot({ path: screenshotPath });
        await browser.close();

        await interaction.followUp({ content: 'Presidential Election Map:', files: [screenshotPath] });
    },
};

