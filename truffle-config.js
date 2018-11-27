/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    "live": {
      network_id: 2,        // Official Ethereum test network
      // host: "178.25.19.88", // Random IP for example purposes (do not use)
      port: 80
    },
    "development": {
      network_id: 1,        // Official Ethereum test network
      host: "127.0.0.1", // Random IP for example purposes (do not use)
      port: 8800
    }
  },
  build: "npm run start"
};
