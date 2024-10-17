const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const bodyParser = require('body-parser');
const config = require('../config/config');

// Initialize the express app
const app = express();
app.use(bodyParser.json());

// Create bot using webhook
const bot = new TelegramBot(config.botToken);

// Set webhook
const URL = process.env.VERCEL_URL || 'https://solpayxn-bot.vercel.app';  // You will replace this later
const webhookUrl = `${URL}/bot${config.botToken}`;  // This sets up a unique endpoint for the bot webhook
bot.setWebHook(webhookUrl);

// Add express route for webhook
app.post(`/bot${config.botToken}`, (req, res) => {
    bot.processUpdate(req.body); // Pass the incoming request to the bot
    res.sendStatus(200);
});

// Other bot commands and logic...
module.exports = app;
