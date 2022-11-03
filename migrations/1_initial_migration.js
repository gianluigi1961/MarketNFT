const MarketNFT = artifacts.require("MarketNFT");

module.exports = function (deployer) {
  deployer.deploy(MarketNFT, 
                  process.env.NFT_NAME, 
                  process.env.NFT_SYMBOL,                   
                  process.env.NFT_UNVEIL_URI);
};
