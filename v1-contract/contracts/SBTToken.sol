// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract SBTToken is ERC1155 {
    address private owner;
    address private taskContractAddress;

    mapping(uint256 => bool) private tokenExists;
    // balances[user][id]
    mapping(address => mapping(uint256 => uint256)) private balances;
    // locked[user][id]
    mapping(address => mapping(uint256 => uint256))
        private locked;

    uint256 private tokenCount = 0;

    event SBTRewardUser(
        address indexed user,
        uint256 indexed tokenId,
        uint256 amount
    );

    event SBTCreateToken(uint256 indexed tokenId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Permission denied");
        _;
    }

    modifier onlyTaskContract() {
        require(msg.sender == taskContractAddress, "Permission denied");
        _;
    }

    /// @dev constructor.
    constructor()
        ERC1155("https://buildstream-docs.vercel.app/tokens/{id}.json")
    {
        owner = msg.sender;
    }

    /// @dev Create a token.
    /// @param count number of tokens to create.
    /// @return bool
    function createTokens(uint256 count) public onlyOwner returns (bool) {
        for (
            uint256 tokenId = tokenCount;
            tokenId < tokenCount + count;
            tokenId++
        ) {
            tokenExists[tokenId] = true;
            emit SBTCreateToken(tokenId);
        }
        tokenCount += count;
        return true;
    }

    /// @dev Check if a token exists.
    /// @param tokenId Id of token.
    function doesTokenExist(uint256 tokenId) public view returns (bool) {
        return tokenExists[tokenId];
    }

    /// @dev Get token if a token exists.
    /// @param tokenId Id of token.
    function balanceOf(
        address _address,
        uint256 tokenId
    ) public view override returns (uint256) {
        require(doesTokenExist(tokenId), "Token does not exist");
        return balances[_address][tokenId];
    }

    /// @dev Allows to change task contract address.
    /// @param _taskContractAddress new task contract address.
    function updateTaskContractAddress(
        address _taskContractAddress
    ) public onlyOwner {
        taskContractAddress = _taskContractAddress;
    }

    /// @dev Allows organization to reward a user with tokens.
    /// @param to Assignee address.
    /// @param tokenId Reward tokenId.
    function reward(
        address to,
        uint256 tokenId,
        uint256 amount
    ) public onlyTaskContract returns (bool) {
        require(doesTokenExist(tokenId), "Token does not exist");
        _mint(to, tokenId, amount, "");
        balances[to][tokenId] += amount;
        emit SBTRewardUser(to, tokenId, amount);
        return true;
    }

    /// @dev Disable transfers
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public pure override {
        require(false, "Feature is disabled");
    }

    /// @dev Disable batch transfers
    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public pure override {
        require(false, "Feature is disabled");
    }

    function stakableTokens(
        address _address,
        uint256 tokenId
    ) public view returns (uint256) {
        uint256 balance = balances[_address][tokenId];
        return balance - locked[_address][tokenId];
    }

    /// @dev Allows to lock an assignee tokens.
    /// @param _address Assignee address.
    function stake(
        address _address,
        uint256 tokenId,
        uint256 amount
    ) public onlyTaskContract returns (bool) {
        uint256 balance = balances[_address][tokenId];
        require(
            balance >= locked[_address][tokenId] + amount,
            "Tokens are locked"
        );
        locked[_address][tokenId] += amount;
        return true;
    }

    /// @dev Allows to unlock an assignee tokens.
    /// @param _address Assignee address.
    function unStake(
        address _address,
        uint256 tokenId,
        uint256 amount
    ) public onlyTaskContract returns (bool) {
        require(
            locked[_address][tokenId] >= amount,
            "Tokens not locked"
        );
        locked[_address][tokenId] -= amount;
        return true;
    }

    /// @dev Get token type count.
    function getTokenCount() public view returns (uint256) {
        return tokenCount;
    }
}
