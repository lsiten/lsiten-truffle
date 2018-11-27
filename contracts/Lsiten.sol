pragma solidity >=0.4.23;

contract Lsiten {
  address public owner;
  uint public testNum;

  constructor() public {
    owner = msg.sender;
  }
  modifier restricted() {
    if (msg.sender == owner) _;
  }
  /**
   * function 增加testNum
   */
  function _addTestNum () public restricted {
    testNum += 1;
  }

  /**
   * function 获取testNum的值
   */
  function _getTestNum () public view restricted
   returns (uint)
  {
    return testNum;
  }
}
