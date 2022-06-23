// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract SBTToken is ERC20 {
  address private owner;
  address private taskContractAddress;
  uint256 public constant MAX_TOKEN_REWARD = 5;

  modifier onlyOwner() {
    require(msg.sender == owner, "Permission denied");
    _;
  }

  modifier onlytaskContract() {
    require(msg.sender == taskContractAddress, "Permission denied");
    _;
  }

  constructor() ERC20("ReputationToken", "SBT") {
    owner = msg.sender;
  }

  function updateTaskContractAddress (address _taskContractAddress) public onlyOwner {
    taskContractAddress = _taskContractAddress;
  }

  function _mintMinerReward(uint256 value) internal {
    _mint(msg.sender, value);
  }

  function reward (address to, uint256 value) public onlytaskContract {
    require(MAX_TOKEN_REWARD >= value, "Maximum tokens allowed exceeded");
    _mintMinerReward(value);
    super._transfer(msg.sender, to, value);
  }

  function transfer(address to, uint value) public override onlytaskContract returns (bool success) {
    emit Transfer(msg.sender, to, value);
    return true;
  }
}
