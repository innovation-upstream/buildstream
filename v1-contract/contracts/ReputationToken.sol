// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "hardhat/console.sol";

contract SBTToken is ERC1155 {
  address private owner;
  address private taskContractAddress;
  uint256 public constant MAX_TOKEN_REWARD = 5;
  mapping(address => bool) public locked;
  uint256 public tokenTypeCount = 0;

  modifier onlyOwner() {
    require(msg.sender == owner, "Permission denied");
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

  modifier tokenExists(uint256 tokenId) {
    require(tokenTypeCount > tokenId, "Token does not exist");
    _;
  }

  modifier tokenDoesNotExist(uint256 tokenId) {
    require(tokenId >= tokenTypeCount, "Token already exist");
    _;
  }

  /**
   * @dev constructor.
   */
  constructor() ERC1155("https://buildstream-schema.vercel.app/tokens/{id}.json") {
    owner = msg.sender;
  }

  /** 
   * @dev Allows owner to create a new token.
   * @param tokenId new tokenId.
   */
  function creatNewToken(uint256 tokenId) public onlyOwner tokenDoesNotExist(tokenId) {
    _mint(msg.sender, tokenId, 0, "");
    tokenTypeCount += 1;
  }

   /** 
   * @dev Check if a token exists.
   * @param tokenId Id of token.
   */
  function doesTokenExist(uint256 tokenId) public view returns (bool) {
    return tokenTypeCount > tokenId;
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
  function reward(address to, uint256 tokenId, uint256 value) public onlyTaskContract tokenExists(tokenId) returns (bool) {
    require(MAX_TOKEN_REWARD >= value, "Maximum tokens allowed exceeded");
    uint256 amount = value;
    if (balanceOf(to, tokenId) == 0)
      amount = 1;
    _mint(to, tokenId, amount, "");
    unStake(to);
    return true;
  }

  /** 
   Disable transfers
   */
  function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) public pure override {
    require(false, "Feature is disabled");
  }

  /** 
   Disable batch transfers
   */
  function safeBatchTransferFrom(address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) public pure override {
    require(false, "Feature is disabled");
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
  function unStake(address _address) public onlyTaskContract returns (bool) {
    locked[_address] = false;
    return true;
  }
}
