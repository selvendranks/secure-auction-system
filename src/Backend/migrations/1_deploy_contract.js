const Auction = artifacts.require("Auction"); // Update with your contract's name

module.exports = function(deployer) {
  deployer.deploy(Auction);
};
