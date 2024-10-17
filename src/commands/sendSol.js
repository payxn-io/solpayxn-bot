const { Connection, PublicKey, SystemProgram, Transaction } = require('@solana/web3.js');
const { solanaClusterUrl } = require('../../config/config');

module.exports = async function sendSol(bot, chatId, senderSecretKey, recipientPublicKey, amount) {
    const connection = new Connection(solanaClusterUrl, 'confirmed');
    const senderAccount = Keypair.fromSecretKey(Uint8Array.from(senderSecretKey));

    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: senderAccount.publicKey,
            toPubkey: new PublicKey(recipientPublicKey),
            lamports: amount * 1000000000,
        })
    );

    const signature = await connection.sendTransaction(transaction, [senderAccount]);
    bot.sendMessage(chatId, `Transaction complete with signature: ${signature}`);
};
