const { Keypair } = require('@solana/web3.js');

module.exports = async function createWallet(bot, chatId) {
    const newAccount = Keypair.generate();
    const publicKey = newAccount.publicKey.toBase58();
    const secretKey = newAccount.secretKey.toString();

    bot.sendMessage(chatId, `Your public key is: ${publicKey}`);
    bot.sendMessage(chatId, `Your secret key is: ${secretKey}`);
};
