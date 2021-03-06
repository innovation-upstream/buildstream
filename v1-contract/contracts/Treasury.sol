// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Organization.sol";

contract Treasury {
  address private owner;
  Organization private organization;
  address private organizationAddress;
  address private taskContractAddress;

  event Creation(uint indexed taskId);
  event Confirmation(address indexed sender, uint256 indexed taskId);

  mapping(uint256 => mapping(address => uint256)) public tokenBalances;
  mapping(uint256 => mapping(address => uint256)) public lockedTokenBalances;
  mapping(uint256 => uint256) public balances;
  mapping(uint256 => uint256) public lockedBalances;
  mapping(uint256 => bool) public payments;
  
  modifier onlyOwner() {
    require(msg.sender == owner, "Permission denied");
    _;
  }

  modifier onlyOrgContract() {
    require(msg.sender == organizationAddress, "Permission denied");
    _;
  }

  modifier onlyTaskContract() {
    require(msg.sender == taskContractAddress, "Permission denied");
    _;
  }

  modifier orgExists(uint256 _orgId) {
    require(organization.doesOrgExists(_orgId), "Org does not exist");
    _;
  }

  /// @dev constructor.
  constructor(address _organizationAddress, address _taskContractAddress) {
    owner = msg.sender;
    organizationAddress = _organizationAddress;
    taskContractAddress = _taskContractAddress;
    organization = Organization(_organizationAddress);
  }

  function getBalance(uint256 orgId) external view orgExists(orgId) returns (uint256) {
    return balances[orgId];
  }

  function getBalance(uint256 orgId, address tokenAddress) external view orgExists(orgId) returns (uint256) {
    return tokenBalances[orgId][tokenAddress];
  }

  function deposit(uint256 orgId) public payable {
    balances[orgId] += msg.value;
  }

  function deposit(uint256 orgId, address tokenAddress, uint256 amount) public orgExists(orgId) {
    IERC20 _token = IERC20(tokenAddress);
    uint256 allowance = _token.allowance(msg.sender, address(this));
    require(allowance >= amount, "Check the token allowance");
    (bool sent) = _token.transferFrom(msg.sender, address(this), amount);
    require(sent, "Failed to deposit tokens");
    tokenBalances[orgId][tokenAddress] += amount;
  }

  function withdraw(uint256 orgId, address to, uint256 amount) internal orgExists(orgId) {
    require(lockedBalances[orgId] >= amount, "Insufficient funds");
    lockedBalances[orgId] -= amount;
    address payable recipient = payable(to);
    recipient.transfer(amount);
  }

  function withdraw(uint256 orgId, address to, address tokenAddress, uint256 amount) internal orgExists(orgId) {
    require(lockedTokenBalances[orgId][tokenAddress] >= amount, "Insufficient funds");
    IERC20 _token = IERC20(tokenAddress);
    lockedTokenBalances[orgId][tokenAddress] -= amount;
    (bool sent) = _token.transfer(to, amount);
    require(sent, "Failed to transfer token to user");
  }

  function withdrawForce(uint256 actionId, uint256 orgId, address to, uint256 amount) external onlyOrgContract orgExists(orgId) {
    require(!payments[actionId], "Payment made");
    require(balances[orgId] >= amount, "Insufficient funds");
    payments[actionId] = true;
    balances[orgId] -= amount;
    address payable recipient = payable(to);
    recipient.transfer(amount);
  }

  function withdrawForce(uint256 actionId, uint256 orgId, address to, address tokenAddress, uint256 amount) external onlyOrgContract orgExists(orgId) {
    require(tokenBalances[orgId][tokenAddress] >= amount, "Insufficient funds");
    require(!payments[actionId], "Payment made");
    IERC20 _token = IERC20(tokenAddress);
    payments[actionId] = true;
    tokenBalances[orgId][tokenAddress] -= amount;
    _token.transfer(to, amount);
  }

  function lockBalance(uint256 orgId, uint256 amount) external onlyTaskContract orgExists(orgId) {
    require(balances[orgId] >= amount, "Insufficient funds");
    balances[orgId] -= amount;
    lockedBalances[orgId] += amount;
  }

  function lockBalance(uint256 orgId, address tokenAddress, uint256 amount) external onlyTaskContract orgExists(orgId) {
    require(tokenBalances[orgId][tokenAddress] >= amount, "Insufficient funds");
    tokenBalances[orgId][tokenAddress] -= amount;
    lockedTokenBalances[orgId][tokenAddress] += amount;
  }

  function unlockBalance(uint256 orgId, uint256 amount) internal {
    lockedBalances[orgId] -= amount;
    balances[orgId] += amount;
  }

  function unlockBalance(uint256 orgId, address tokenAddress, uint256 amount) internal {
    lockedTokenBalances[orgId][tokenAddress] -= amount;
    tokenBalances[orgId][tokenAddress] += amount;
  }

  function reward(uint256 orgId, address to, uint256 amount) external onlyTaskContract orgExists(orgId) {
    withdraw(orgId, to, amount);
  }

  function reward(uint256 orgId, address to, address tokenAddress, uint256 amount) external onlyTaskContract orgExists(orgId) {
    withdraw(orgId, to, tokenAddress, amount);
  }
}
