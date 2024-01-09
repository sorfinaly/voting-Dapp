
const voting = artifacts.require("voting");

module.exports = function (deployer) {
  deployer.deploy(voting)
    .then(() => {
      // Export the contract's address after deployment
      console.log("YourContract address:", YourContract.address);
    });
};