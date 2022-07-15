// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract SBTToken is ERC1155 {
  address private owner;
  address private taskContractAddress;

  uint256 public constant BASIC = 0;
  uint256 public constant BEGINNER = 1;
  uint256 public constant INTERMEDIATE = 2;
  uint256 public constant ADVANCED = 3;
  uint256 public constant COMPLEX = 4;

  uint256 public constant MAX_TOKEN_REWARD = 5;
  mapping(address => mapping(uint256 => mapping(uint256 => uint256))) public locked;
  mapping(address => mapping(uint256 => mapping(uint256 => uint256))) public balances;
  uint256 public tokenTypeCount = 5;

  modifier onlyOwner() {
    require(msg.sender == owner, "Permission denied");
    _;
  }

  modifier onlyTaskContract() {
    require(msg.sender == taskContractAddress, "Permission denied");
    _;
  }

  modifier tokenExists(uint256 tokenId) {
    require(tokenTypeCount > tokenId, "Token does not exist");
    _;
  }

  modifier tokenDoesNotExist(uint256 tokenId) {
    require(tokenId >= tokenTypeCount, "Token already exist");
    _;
  }

  
  /// @dev constructor.
  constructor() ERC1155("https://buildstream-schema.vercel.app/tokens/{id}.json") {
    owner = msg.sender;
  }

  /// @dev Check if a token exists.
  /// @param tokenId Id of token.
  function doesTokenExist(uint256 tokenId) public view returns (bool) {
    return tokenTypeCount > tokenId;
  }

  /// @dev Get token if a token exists.
  /// @param tokenId Id of token.
  function balanceOf(address _address, uint tokenId, uint orgId) public view returns (uint) {
    return balances[_address][tokenId][orgId];
  }

  /// @dev Allows to change task contract address.
  /// @param _taskContractAddress new task contract address.
  function updateTaskContractAddress(address _taskContractAddress) public onlyOwner {
    taskContractAddress = _taskContractAddress;
  }

  /// @dev Allows organization to reward a user with tokens.
  /// @param to Assignee address.
  /// @param tokenId Reward tokenId.
  function reward(address to, uint256 tokenId, uint256 orgId) public onlyTaskContract tokenExists(tokenId) returns (bool) {
    _mint(to, tokenId, 1, "");
    balances[to][tokenId][orgId] += 1;
    return true;
  }

  /// @dev Disable transfers
  function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) public pure override {
    require(false, "Feature is disabled");
  }

  /// @dev Disable batch transfers
  function safeBatchTransferFrom(address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) public pure override {
    require(false, "Feature is disabled");
  }

  function stakableTokens(address _address, uint256 tokenId, uint256 orgId) public view returns (uint256) {
    uint256 balance = balances[_address][tokenId][orgId];
    return balance - locked[_address][tokenId][orgId];
  }

  /// @dev Allows to lock an assignee tokens.
  /// @param _address Assignee address.
  function stake(address _address, uint256 tokenId, uint256 amount, uint256 orgId) public onlyTaskContract returns (bool) {
    uint256 balance = balances[_address][tokenId][orgId];
    require(balance >= locked[_address][tokenId][orgId] + amount , "Tokens are locked");
    locked[_address][tokenId][orgId] += amount;
    return true;
  }

  /// @dev Allows to unlock an assignee tokens.
  /// @param _address Assignee address.
  function unStake(address _address, uint256 tokenId, uint256 amount, uint256 orgId) public onlyTaskContract returns (bool) {
    require(locked[_address][tokenId][orgId] >= amount, "Tokens not locked");
    locked[_address][tokenId][orgId] -= amount;
    return true;
  }

  /// @dev Get token type count.
  function getTokenTypeCount() public view returns (uint256) {
    return tokenTypeCount;
  }
}
