const TelegramBot = require('node-telegram-bot-api');
const config = require('../config/config');
const createWallet = require('./commands/createWallet');
const checkBalance = require('./commands/balance');
const sendSol = require('./commands/sendSol');

const bot = new TelegramBot(config.botToken, { polling: true });

bot.onText(/\/createwallet/, (msg) => {
    createWallet(bot, msg.chat.id);
});

bot.onText(/\/balance (.+)/, (msg, match) => {
    const publicKey = match[1];
    checkBalance(bot, msg.chat.id, publicKey);
});

bot.onText(/\/send (.+) (.+) (.+)/, (msg, match) => {
    const senderSecretKey = JSON.parse(match[1]);
    const recipientPublicKey = match[2];
    const amount = parseFloat(match[3]);

    sendSol(bot, msg.chat.id, senderSecretKey, recipientPublicKey, amount);
});
