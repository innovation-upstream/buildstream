// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

abstract contract SBTToken is ERC20 {
  address private owner;
  address private organizationContractAddress;
  address private taskContractAddress;
  uint256 public constant MAX_TOKEN_REWARD = 5;
  mapping(address => bool) public locked;

  function getTitle() virtual public pure returns (string memory name);

  modifier onlyOwner() {
    require(msg.sender == owner, "Permission denied");
    _;
  }

  modifier onlyOrganizationContract() {
    require(msg.sender == organizationContractAddress, "Permission denied");
    _;
  }

  modifier onlyTaskContract() {
    require(msg.sender == taskContractAddress, "Permission denied");
    _;
  }

  modifier notLocked(address _address) {
    require(!locked[_address], "Tokens are locked");
    _;
  }

  /**
   * @dev constructor sets organization contract address.
   * @param _organizationContractAddress Organization contract address.
   */
  constructor(address _organizationContractAddress) {
    owner = msg.sender;
    organizationContractAddress = _organizationContractAddress;
  }

  /** 
   * @dev Allows to change organization contract address.
   * @param _organizationContractAddress new organization contract address.
   */
  function updateOrganizationContractAddress(address _organizationContractAddress) public onlyOwner {
    organizationContractAddress = _organizationContractAddress;
  }

  /** 
   * @dev Allows to change task contract address.
   * @param _taskContractAddress new task contract address.
   */
  function updateTaskContractAddress(address _taskContractAddress) public onlyOwner {
    taskContractAddress = _taskContractAddress;
  }

  /** 
   * @dev Allows organization to reward a user with tokens.
   * @param to Assignee address.
   * @param value Token reward value.
   */
  function reward(address to, uint256 value) public onlyOrganizationContract returns (bool) {
    require(MAX_TOKEN_REWARD >= value, "Maximum tokens allowed exceeded");
    _mint(msg.sender, value);
    transfer(to, value);
    unStake(to);
    return true;
  }

  /** 
   * @dev Allows organization to transfer tokens.
   * @param to Assignee address.
   * @param value Token reward value.
   */
  function transfer(address to, uint value) public override onlyOrganizationContract returns (bool) {
    super.transfer(to, value);
    return true;
  }

  /** 
   * @dev Allows to lock an assignee tokens.
   * @param _address Assignee address.
   */
  function stake(address _address) public onlyTaskContract notLocked(_address) returns (bool) {
    locked[_address] = true;
    return true;
  }

  /** 
   * @dev Allows to unlock an assignee tokens.
   * @param _address Assignee address.
   */
  function unStake(address _address) public onlyOrganizationContract returns (bool) {
    locked[_address] = false;
    return true;
  }
}
