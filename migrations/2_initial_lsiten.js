var Migrations = artifacts.require("./Migrations.sol");
var Lsiten = artifacts.require("./Lsiten.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Lsiten);
};
