module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
      from:"0xAff235C0f435120c435E92C8BaA74fdEBE6E4F4D"
    },
    develop: {
      port: 8545
    }
  }
};
