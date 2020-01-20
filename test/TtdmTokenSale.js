const TtdmToken = artifacts.require("TtdmToken");
const TtdmTokenSale = artifacts.require("TtdmTokenSale");

let instance;
let tokenPrice;
let buyer;
let buyTokens;
let numberOfTokens;
let admin;
let tokensAvailable;
let tokenInstance;

beforeEach( async () => {
    instance = await TtdmTokenSale.deployed();
    tokenPrice = 1000000000000000; // in wei 0.001 ether
    //Provision 75%  of all tokens to the token sale
    tokensAvailable = 750000;
    tokenInstance = await TtdmToken.deployed();
  });
contract('TtdmTokenSale', function(accounts){

    describe('constructor', () => {
        it('setup', async () => {
            buyer = accounts[1];
            admin = accounts[0];
            await tokenInstance.transfer(instance.address,tokensAvailable, {from: admin});
          });
        it('has contract address', async () => {
            let address = await instance.address;
            assert.notEqual(address, 0x0, 'has contract address');
        });

        it('has token contract address', async () => {
            let tokenContractAddress = await instance.tokenContract();
            assert.notEqual(tokenContractAddress, 0x0, 'has token contract address');  
        });

        it('token price is correct', async () => {
            let price = await instance.tokenPrice();
            assert.equal(price, tokenPrice, 'token price is correct');
            //console.log("tokenPrice " + tokenPrice);
        });

    });

    describe("buyTokens", () => {
        it('increments the number of tokens sold', async () => {
            numberOfTokens = 10;
            let value = numberOfTokens * tokenPrice;
            buyTokens = await instance.buyTokens(numberOfTokens, {from: buyer, value: value});
            let amount = await instance.tokensSold();
            assert.equal(amount.toNumber(), numberOfTokens, "increments the number of tokens sold");
        });

        it('receipt', async () => {
            let receipt = await buyTokens;
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, "Sell", 'should be the "Sell" event');
            assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
            assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');
        });

        it('msg.value must equal number of tokens in wei', async() =>{
            try {
                await instance.buyTokens(numberOfTokens, { from: buyer, value: 1 });
            }
            catch(error){
                assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
            }
        });

        it ("cannot purchase more tokens than available", async () => {
            try{
                await instance.buyTokens(800000, { from: buyer, value: 1 });
                /*let balance = await tokenInstance.balanceOf(buyer);
                assert.equal(balance.toNumber(),  numberOfTokens);*/
            }
            catch(error) {
                assert(error.message.indexOf('revert') >= 0, 'cannot purchase more tokens than available');
            }
            
        });
    });

    describe("end token sale", () => {
        it ('must be admin to end sale', async() =>{
            //Try to end sale from account other than the admin
            try{
                await instance.endSale({from: buyer});
            }
            catch (error) {
                assert(error.message.indexOf('revert') >= 0, 'must be admin to end sale');
            }
        });

        it('returns all unsold Ttdm tokens to admin', async () => {
            await instance.endSale({ from: admin });
            let balance = await tokenInstance.balanceOf(admin);
            assert.equal(balance.toNumber(),999990, 'returns all unsold Ttdm tokens to admin');
        });

        it('Check that the contract has no balance', async () => {
            let finalBalance = await web3.eth.getBalance(instance.address);
            assert.equal(finalBalance, 0, 'Check that the contract has no balance');
        });
        
    });

});