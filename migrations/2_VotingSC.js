const VotingSC = artifacts.require("VotingSC");

module.exports = function(deployer) {
  deployer.deploy(VotingSC);
};
