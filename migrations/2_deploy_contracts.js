const TtdmToken = artifacts.require("./TtdmToken");
const TtdmTokenSale = artifacts.require("./TtdmTokenSale");

/*module.exports = async function(deployer) {
  let deployCrowdTestTokenResult = await deployer.deploy(TtdmToken,1000000);
  let deployCrowdSaleResult = await deployer.deploy(TtdmTokenSale, TtdmToken.address);
};*/
module.exports = function(deployer) {
  deployer.deploy(TtdmToken, 7000000).then(function() {
    let tokenPrice = 1000000000000000; // in wei 0.001 ether
    return deployer.deploy(TtdmTokenSale, TtdmToken.address,tokenPrice);
  });
};