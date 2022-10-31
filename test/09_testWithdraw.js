const catchRevert = require("./helpers/exceptionHelpers.js");
const test_params = require("./0_test_data.js");
const ethers = require("ethers");

const MarketNFT = artifacts.require("MarketNFT");

contract("Test Withdraw", (accounts) => {
    const deployAccount = accounts[0];
    const customerAccount = accounts[1];
    const customerAccount_2 = accounts[2];

    let marketNFT = null
    before(async()=>{
        marketNFT = await MarketNFT.deployed()
    })

    
    it('Market NFT Withdraw', async()=>{
        var data = await test_params.test_data();
                
        const customerAccount = accounts[1];
        const customerAccount_2 = accounts[2];
        const customerAccount_3 = accounts[3];
        const customerAccount_4 = accounts[4];
    
        
        for(var x = 0; x < data.length; x++){
            await marketNFT.mint(data[x].name, data[x].description, data[x].price, data[x].url, { from: deployAccount });               
        }
                
        await marketNFT.unpause({ from: deployAccount, value: 0 });

        var esito = await catchRevert.onlyOwner(marketNFT.withdraw("0", { from: customerAccount, value: 0 }));
        assert(esito, "OnlyOwner not detected");               

        esito = await catchRevert.checkErrorCode(marketNFT.withdraw("0", { from: deployAccount, value: 0 }), "ERR-16");  
        assert(esito, "Withdraw zero not detected"); 

        var amount = "400000000000000000";
        esito = await catchRevert.checkErrorCode(marketNFT.withdraw(amount, { from: deployAccount, value: 0 }), "ERR-17");  
        assert(esito, "Balance zero not detected"); 

        //Simulate NFT buy        
        await marketNFT.buy(data[3].name, { from: customerAccount, value : data[3].price });
        await marketNFT.buy(data[4].name, { from: customerAccount, value : data[4].price });
        await marketNFT.buy(data[5].name, { from: customerAccount, value : data[5].price });
        await marketNFT.buy(data[6].name, { from: customerAccount_2, value : data[6].price });
        

        var result = await marketNFT.withdraw(amount, { from: deployAccount, value: 0 });  
        if(result){
            console.log("Test withdraw passed");
        }

        amount = "300000000000000000";
        var result = await marketNFT.withdraw(amount, { from: deployAccount, value: 0 });  
        if(result){
            console.log("Test withdraw passed");
        }
        

        amount = "8000000000000000000";
        var result = await catchRevert.checkErrorCode(marketNFT.withdraw(amount, { from: deployAccount, value: 0 }), "ERR-18");  
        assert(result, "Amount exceed balance zero not detected"); 



        //contract balance
        var result = await marketNFT.getBalance({ from: deployAccount, value: 0 });                     
        console.log("Current contract balance: " + ethers.utils.formatEther(result.toString()));
        console.log("---------");

    })
    
   
})
