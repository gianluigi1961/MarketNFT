const catchRevert = require("./helpers/exceptionHelpers.js");
const test_params = require("./0_test_data.js");

const MarketNFT = artifacts.require("MarketNFT");

contract('Test mint', (accounts) => {
    const deployAccount = accounts[0];
    const customerAccount = accounts[1];
    const customerAccount_2 = accounts[2];
    const customerAccount_3 = accounts[3];
    var data = [];
    var balance_owner = 0;

    let marketNFT = null
    before(async () => {
        marketNFT = await MarketNFT.deployed()
        data = await  test_params.test_data();
    })

    it('The caller must be the owner', async () => {
        var result = await catchRevert.onlyOwner(marketNFT.unpause({ from: customerAccount, value: 0 }));
        assert(result, "OnlyOwner not detected");                     
    })

    it('The multiple mint array must have the same length', async () => {
        var ar_1 = ['1'];
        var ar_2 = ['2','3'];
        var ar_3 = ['4', '5', '6', '7'];
        var ar_4 = ['8', '9', '10'];

        var result = await catchRevert.checkErrorCode(marketNFT.mintMultiple(ar_1, ar_2, ar_3, ar_4, { from: deployAccount, value: 0 }), "ERR-12");
        assert(result, "ERR-12 not detected");                  
    })
    
    it('The contract must not be paused', async () => {
                
        for(var x = 0; x < 3; x++){
            await marketNFT.mint(data[x].name, data[x].description, data[x].price, data[x].url, { from: deployAccount });    
            balance_owner++;        
        }
                
        var result = await catchRevert.checkErrorCode(marketNFT.buy(data[0].name, { from: customerAccount, value : data[0].price }), "ERR-10")        
        assert(result, "ERR-10 not detected");
        
    })

    it('Test buy method', async () => {

        var ar_1 = data.filter((item, index) => index >= 3 && index < 6).map(f => f.name);
        var ar_2 = data.filter((item, index) => index >= 3 && index < 6).map(f => f.description);
        var ar_3 = data.filter((item, index) => index >= 3 && index < 6).map(f => f.price);
        var ar_4 = data.filter((item, index) => index >= 3 && index < 6).map(f => f.url);
              
        await marketNFT.mintMultiple(ar_1, ar_2, ar_3, ar_4, { from: deployAccount, value: 0 })
        balance_owner += 3;
        var total_supply = await marketNFT.totalSupply({ from: deployAccount, value: 0 });
        console.log("Mint Multiple: ", parseInt(total_supply))
        
        await marketNFT.mint(data[6].name, data[6].description, data[6].price, data[6].url, { from: deployAccount });            
        await marketNFT.mint(data[7].name, data[7].description, data[7].price, data[7].url, { from: deployAccount });            
        await marketNFT.mint(data[8].name, data[8].description, data[8].price, data[8].url, { from: deployAccount });            
        balance_owner += 3;

        await marketNFT.unpause({ from: deployAccount, value: 0 });
        
        total_supply = await marketNFT.totalSupply({ from: deployAccount, value: 0 });
        console.log("Total mint: ", parseInt(total_supply))
        
        var balance = await marketNFT.balanceOf(deployAccount, { from: deployAccount});
        //console.log("Balance of Owner: ", deployAccount, " => ", parseInt(balance));
        assert(parseInt(balance) == balance_owner, "The balance of Owner is not valid (1)")


        result = await catchRevert.checkErrorCode(marketNFT.buy("not-minted-NFT", { from: customerAccount, value : data[3].price }), "ERR-11")        
        assert(result, "ERR-11 not detected");

        result = await catchRevert.checkErrorCode(marketNFT.buy(data[3].name, { from: customerAccount, value : '1000' }), "ERR-15")        
        assert(result, "ERR-15 not detected");

        await marketNFT.buy(data[3].name, { from: customerAccount, value : data[3].price });
        await marketNFT.buy(data[4].name, { from: customerAccount, value : data[4].price });
        await marketNFT.buy(data[5].name, { from: customerAccount, value : data[5].price });
        await marketNFT.buy(data[6].name, { from: customerAccount_2, value : data[6].price });
        balance_owner -= 4;
        
        
        balance = await marketNFT.balanceOf(customerAccount, { from: customerAccount});
        assert(parseInt(balance) == 3, "The balance of account " + customerAccount + " is not valid")

        balance = await marketNFT.balanceOf(customerAccount_2, { from: customerAccount});
        assert(parseInt(balance) == 1, "The balance of account " + customerAccount_2 + " is not valid")

        balance = await marketNFT.balanceOf(deployAccount, { from: deployAccount});
        assert(parseInt(balance) == balance_owner, "The balance of Owner is not valid")


        var owner = await marketNFT.ownerOf(data[3].name, { from: deployAccount});
        //console.log("Owner of: ", data[3].id, " => ", owner);
        assert(owner == customerAccount, "The Owner is not valid")

        owner = await marketNFT.ownerOf(data[4].name, { from: deployAccount});
        //console.log("Owner of: ", data[4].id, " => ", owner);
        assert(owner == customerAccount, "The Owner is not valid")

        owner = await marketNFT.ownerOf(data[5].name, { from: deployAccount});
        //console.log("Owner of: ", data[5].id, " => ", owner);
        assert(owner == customerAccount, "The Owner is not valid")

        owner = await marketNFT.ownerOf(data[6].name, { from: deployAccount});
        //console.log("Owner of: ", data[6].id, " => ", owner);
        assert(owner == customerAccount_2, "The Owner is not valid")


        var wallet = await marketNFT.walletOf(deployAccount, { from: deployAccount});
        //console.log("Wallet of: ", deployAccount, " => ", wallet);
        assert(wallet.length == balance_owner, "The wallet of " + deployAccount +" is not valid");

        var wallet = await marketNFT.walletOf(customerAccount, { from: deployAccount});
        //console.log("Wallet of: ", customerAccount, " => ", wallet);
        assert(wallet.length == 3, "The wallet of " + customerAccount +" is not valid");

        var wallet = await marketNFT.walletOf(customerAccount_2, { from: deployAccount});
        //console.log("Wallet of: ", customerAccount_2, " => ", wallet);
        assert(wallet.length == 1, "The wallet of " + customerAccount_2 +" is not valid");

    });



    




})