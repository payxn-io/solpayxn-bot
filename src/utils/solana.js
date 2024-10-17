const { Keypair } = require('@solana/web3.js');

module.exports.createWallet = function () {
    const newAccount = Keypair.generate();
    return {
        publicKey: newAccount.publicKey.toBase58(),
        secretKey: newAccount.secretKey.toString(),
    };
};
