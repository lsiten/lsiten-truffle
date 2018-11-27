'use strict';
require('../css/index.scss');
import Lsiten from '../contracts/Lsiten.json'
import Web3 from 'web3';

let abi = Lsiten.abi;
// 合约地址
let address = "0x423903648017496ea4c346a72ae68a0fcbcf51e6";
let web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8800"));
// 通过ABI和地址获取已部署的合约对象
let helloContract = new web3.eth.Contract(abi,address);
console.log(Lsiten, helloContract);
helloContract.methods._getTestNum().call().then((result) => {
  console.log(result)
})