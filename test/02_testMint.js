const catchRevert = require("./helpers/exceptionHelpers.js");

const MarketNFT = artifacts.require("MarketNFT");

contract('Test mint', (accounts) => {
    const deployAccount = accounts[0];
    const customerAccount = accounts[1];

    let marketNFT = null
    before(async () => {
        marketNFT = await MarketNFT.deployed()
    })

    it('The caller must be the owner', async () => {
        var result = await catchRevert.onlyOwner(marketNFT.unpause({ from: customerAccount, value: 0 }));
        assert(result, "OnlyOwner not detected");

        result = await catchRevert.onlyOwner(marketNFT.pause({ from: customerAccount, value: 0 }));
        assert(result, "OnlyOwner not detected");        
    })

    it('The contract must be not paused', async () => {

        var result = await catchRevert.checkErrorCode(marketNFT.mint(1, { from: customerAccount, value: process.env.NFT_MINT_PRICE }), "ERR-10")        
        assert(result, "ERR-10 not detected");

        await marketNFT.unpause({ from: deployAccount, value: 0 });
              
        marketNFT.mint(1, { from: customerAccount, value: process.env.NFT_MINT_PRICE })                
    })

    
    it('The amount are ok', async () => {

        //await marketNFT.unpause({ from: deployAccount, value: 0 });

        var result = await catchRevert.checkErrorCode(marketNFT.mint(6, { from: customerAccount, value: process.env.NFT_MINT_PRICE }), "ERR-02")        
        assert(result, "ERR-02 not detected");
              
        var result = await catchRevert.checkErrorCode(marketNFT.mint(3, { from: customerAccount, value: process.env.NFT_MINT_PRICE * 2 }), "ERR-03")        
        assert(result, "ERR-03 not detected");

        await marketNFT.mint(5, { from: customerAccount, value: process.env.NFT_MINT_PRICE * 5 })
        await marketNFT.mint(5, { from: customerAccount, value: process.env.NFT_MINT_PRICE * 5 })
        await marketNFT.mint(5, { from: customerAccount, value: process.env.NFT_MINT_PRICE * 5 })
        await marketNFT.mint(5, { from: customerAccount, value: process.env.NFT_MINT_PRICE * 5 })

        var result = await catchRevert.checkErrorCode(marketNFT.mint(5, { from: customerAccount, value: process.env.NFT_MINT_PRICE * 5 }), "ERR-01")        
        assert(result, "ERR-01 not detected");

        

    })
    




})