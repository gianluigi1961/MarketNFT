const MarketNFT = artifacts.require("MarketNFT");

module.exports = function (deployer) {
  deployer.deploy(MarketNFT);
};
