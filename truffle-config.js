module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
      from:"0x79225d5CF5D09d825b017d5fC311f031dF4e390C"
    },
    develop: {
      port: 8545
    }
  }
};
