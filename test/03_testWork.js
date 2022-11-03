const catchRevert = require("./helpers/exceptionHelpers.js");
const test_params = require("./0_test_data.js");
const ethers = require("ethers");

const MarketNFT = artifacts.require("MarketNFT");

contract("Test Work", (accounts) => {
    const deployAccount = accounts[0];
    const customerAccount = accounts[1];
    const customerAccount_2 = accounts[2];

    let marketNFT = null
    before(async()=>{
        marketNFT = await MarketNFT.deployed()
    })

    
    it('Market NFT Work', async()=>{
        var data = await test_params.test_data();
                
        const customerAccount = accounts[1];
        const customerAccount_2 = accounts[2];
        const customerAccount_3 = accounts[3];
        const customerAccount_4 = accounts[4];
        const customerAccount_5 = accounts[5];
    
        
        for(var x = 0; x < data.length; x++){
            await marketNFT.mint(data[x].name, data[x].description, data[x].price, data[x].url, { from: deployAccount });               
        }
                
        await marketNFT.unpause({ from: deployAccount, value: 0 });

        
        //Simulate NFT buy        
        await marketNFT.buy(data[0].name, { from: customerAccount, value : data[0].price });
        await marketNFT.buy(data[1].name, { from: customerAccount, value : data[1].price });
        await marketNFT.buy(data[2].name, { from: customerAccount_2, value : data[2].price });
        await marketNFT.buy(data[3].name, { from: customerAccount_2, value : data[3].price });
        await marketNFT.buy(data[4].name, { from: customerAccount_3, value : data[4].price });
        console.log("Test buy passed");

        //simulate approve
        await marketNFT.approveByName(customerAccount_4, data[0].name, { from: customerAccount, value : 0 });
        await marketNFT.approveByName(customerAccount_4, data[1].name, { from: customerAccount, value : 0 });
        await marketNFT.approveByName(customerAccount_4, data[2].name, { from: customerAccount_2, value : 0 });
        console.log("Test approved passed");

        await catchRevert.checkErrorCode(marketNFT.approveByName(customerAccount_4, data[3].name, { from: customerAccount, value : 0 }), "approve caller is not token owner nor approved for all");
        
        //simulate transfer
        await marketNFT.transferFromByName(customerAccount, customerAccount_5, data[0].name, { from: customerAccount_4, value : 0 });
        await marketNFT.transferFromByName(customerAccount, customerAccount_5, data[1].name, { from: customerAccount_4, value : 0 });
        await marketNFT.transferFromByName(customerAccount_2, customerAccount_5, data[2].name, { from: customerAccount_4, value : 0 });
        console.log("Test transfer passed");


        await catchRevert.checkErrorCode(marketNFT.transferFromByName(customerAccount, customerAccount_5, data[4].name, { from: customerAccount_4, value : 0 }), "caller is not token owner nor approved");

        //check new owner
        var wallet = await marketNFT.walletOf(customerAccount_5, { from: deployAccount});
        console.log("Wallet of: ", customerAccount_5, " => ", wallet);

        wallet = await marketNFT.walletOf(customerAccount, { from: deployAccount});
        console.log("Wallet of: ", customerAccount, " => ", wallet);

        wallet = await marketNFT.walletOf(customerAccount_2, { from: deployAccount});
        console.log("Wallet of: ", customerAccount_2, " => ", wallet);

    })
    
   
})
