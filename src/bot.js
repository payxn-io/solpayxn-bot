const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const bodyParser = require('body-parser');
const config = require('../config/config'); // Assumes you have a config file for environment variables

// Initialize the express app
const app = express();
app.use(bodyParser.json());

// Initialize the bot with Webhook method
const bot = new TelegramBot(config.botToken, { polling: false });

// Set the webhook
const URL = process.env.VERCEL_URL || 'https://solpayxn-bot.vercel.app';  // Replace with actual Vercel URL
bot.setWebHook(`${URL}/bot${config.botToken}`);

// Establish a connection to Solana cluster (e.g., mainnet, testnet, devnet)
const connection = new Connection(config.solanaClusterUrl, 'confirmed');

// Routes the webhook from Telegram to the bot
app.post(`/bot${config.botToken}`, (req, res) => {
    bot.processUpdate(req.body); // Process the incoming request
    res.sendStatus(200);
});

// COMMAND: /balance <publicKey>
// Fetches and displays the balance of the provided public key in SOL
bot.onText(/\/balance (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const publicKeyInput = match[1]; // Public key provided by the user

    try {
        // Validate the public key
        const publicKey = new PublicKey(publicKeyInput);
        const balance = await connection.getBalance(publicKey); // In lamports
        const solBalance = balance / 1000000000; // Convert lamports to SOL

        bot.sendMessage(chatId, `Balance for ${publicKey.toBase58()}: ${solBalance} SOL`);
    } catch (error) {
        console.error('Error fetching balance:', error);
        bot.sendMessage(chatId, 'Error: Invalid public key or failed to fetch balance.');
    }
});

// COMMAND: /createwallet
// Creates a new wallet and returns the public and private key pair
bot.onText(/\/createwallet/, (msg) => {
    const chatId = msg.chat.id;

    try {
        // Generate a new Solana keypair
        const keypair = Keypair.generate();
        const publicKey = keypair.publicKey.toBase58();
        const secretKey = Buffer.from(keypair.secretKey).toString('hex'); // Hex-encoded private key

        // Send the public and private key to the user
        bot.sendMessage(
            chatId,
            `🎉 New Solana wallet created!\n\nPublic Key: ${publicKey}\nPrivate Key (keep it secret!): ${secretKey}`
        );
    } catch (error) {
        console.error('Error creating wallet:', error);
        bot.sendMessage(chatId, 'Error: Failed to create wallet.');
    }
});

// COMMAND: /help
// Sends a list of available commands to the user
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;

    const helpMessage = `
🤖 *Solana Bot Commands*:

/balance <publicKey> - Check the balance of a given public key.
/createwallet - Create a new Solana wallet (returns public and private key).
/help - Show this help message.
    `;

    bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
});

// Start the Express server (use Vercel's built-in support)
module.exports = app;
