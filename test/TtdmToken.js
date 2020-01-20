var TtdmToken = artifacts.require("TtdmToken");

/*
its not needed
just run it and make some sort of assert
like make sure the balance of the owner is reduced afteer a transfer
with balanceOf and assert.equal
*/
let instance;

beforeEach( async () => {
  instance = await TtdmToken.deployed();

});
contract("Ttdm", async accounts => {
    describe('constructor', () => {
      it("sets the total supply upon deployment", async () => {
        let balance = await instance.totalSupply();
        assert.equal(balance.toNumber(), 1000000,'sets the total supply to 1,000,000')
        
      });
      it("gives initial supply to msg.sender", async() =>{
        let adminBalance = await instance.balanceOf(accounts[0]);
        assert.equal(adminBalance.toNumber(),1000000,'testing msg.sender balance');
      });
      it("has the proper token name", async() => {
        let name = await instance.name();
        assert.equal(name, 'ttdmcoin', 'has the correct name');
      });
      it("has the proper symbol", async() => {
        let symbol = await instance.symbol();
        assert.equal(symbol, 'TTDM', 'has the correct symbol');
      });
  });
    
    describe('decimals', () => {
      it("test the decimals", async () => {
        let decimals = await instance.decimals();
        assert.equal(decimals, 2, "has the correct decimals");

      });
    });

    describe('transfer', () => {
      it('successfully transfers', async() => {
        await instance.transfer(accounts[1], 50, { from: accounts[0] });

      });

      it('rejects above actual balance transfers', async() => {
        let transfer;
        try{
          transfer = await instance.transfer(accounts[1],999999);
        }
        catch (error) {
          assert.ok(error.message.indexOf('revert')>=0, 'error message must contain revert');
        }
      });
    });
    
    describe('approve', () => {
      it('approves tokens for delegated transfer', async() => {
        await instance.approve(accounts[1], 100);
        let allowedAmount = await instance.allowance(accounts[0],  accounts[1]);
        assert.equal(allowedAmount.toNumber(), 100, 'stores the allowance for delegated transfer');
      });
    });

    describe('transfer from', () => {
      it("test allotted balance", async() => {
        await instance.transferFrom(accounts[0],accounts[1],100, {from : accounts[1]});
        let accountOneBalance = await instance.balanceOf(accounts[1]);
        assert.equal(accountOneBalance.toNumber(), 150, "right amount");
      });

    });

});