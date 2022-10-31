const MarketNFT = artifacts.require("MarketNFT");

module.exports = function (deployer) {
  deployer.deploy(MarketNFT, 
                  process.env.NFT_NAME, 
                  process.env.NFT_SYMBOL, 
                  //process.env.NFT_MINT_PRICE , 
                  //process.env.NFT_MAX_VALUE,
                  //process.env.NFT_MAX_MINT_VALUE,
                  //process.env.NFT_BASE_URI,
                  process.env.NFT_UNVEIL_URI);
};
