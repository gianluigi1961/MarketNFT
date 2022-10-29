const MarketNFT = artifacts.require("MarketNFT");

contract('Test Deploy', (accounts) => {
    const deployAccount = accounts[0];

    let marketNFT = null
    before(async () => {
        marketNFT = await MarketNFT.deployed()
    })

    it('Should deploy smart contract properly', async () => {
        assert(marketNFT.address != '', "The contract is not deployed")
    })

    it('Should set ownership correctly to deployer account', async () => {
        const owner = await marketNFT.owner()
        assert(owner === deployAccount, "The owner is not the right address")
    })
})