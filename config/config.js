require('dotenv').config();

module.exports = {
    botToken: process.env.BOT_TOKEN,
    solanaClusterUrl: process.env.SOLANA_CLUSTER_URL || 'https://api.mainnet-beta.solana.com',
};
