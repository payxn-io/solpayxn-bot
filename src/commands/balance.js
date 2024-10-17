const { Connection, PublicKey } = require('@solana/web3.js');
const { solanaClusterUrl } = require('../../config/config');

module.exports = async function checkBalance(bot, chatId, publicKey) {
    try {
        // Validate if the provided public key is a valid Base58-encoded string
        const publicKeyObj = new PublicKey(publicKey); // This will throw an error if the key is invalid
        
        // Establish connection to Solana blockchain
        const connection = new Connection(solanaClusterUrl, 'confirmed');
        
        // Fetch the balance in lamports
        const balance = await connection.getBalance(publicKeyObj);
        
        // Convert lamports to SOL
        const solBalance = balance / 1000000000;
        
        // Send the balance information back to the user
        bot.sendMessage(chatId, `Balance for ${publicKey}: ${solBalance} SOL`);
    } catch (error) {
        if (error.message.includes('Non-base58 character')) {
            bot.sendMessage(chatId, 'Error: Invalid public key. Please provide a valid Base58 public key.');
        } else {
            console.error('Error fetching balance:', error);
            bot.sendMessage(chatId, 'Error: Unable to fetch balance. Please try again later.');
        }
    }
};
