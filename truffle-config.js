module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
      from:"0x8437a8eaed08A9Ef56A24dBc73449f9929F43011"
    },
    develop: {
      port: 8545
    }
  }
};
