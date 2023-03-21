// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract SBTToken is ERC1155 {
    address private owner;
    address private taskContractAddress;

    // BASIC = 0;
    // BEGINNER = 1;
    // INTERMEDIATE = 2;
    // ADVANCED = 3;
    // COMPLEX = 4;

    mapping(uint256 => bool) private tokenExists;
    mapping(address => mapping(uint256 => uint256))
        public totalComplexityEarned;
    // balances[user][id]
    mapping(address => mapping(uint256 => uint256)) private balances;
    // balancesByComplexity[user][id][complexity]
    mapping(address => mapping(uint256 => mapping(uint256 => uint256)))
        public balancesByComplexity;
    // orgBalances[user][id][orgId]
    mapping(address => mapping(uint256 => mapping(uint256 => uint256)))
        private orgBalances;
    // orgBalancesByComplexity[user][id][complexity][orgId]
    mapping(address => mapping(uint256 => mapping(uint256 => mapping(uint256 => uint256))))
        private orgBalancesByComplexity;
    // locked[user][id][complexity][orgId]
    mapping(address => mapping(uint256 => mapping(uint256 => mapping(uint256 => uint256))))
        private locked;

    uint256 private tokenCount = 0;

    event SBTRewardUser(
        address indexed user,
        uint256 indexed orgId,
        uint256 indexed tokenId,
        uint256 complexity,
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
    /// @param tokenId Id of tokens mapped to a tag.
    /// @return bool
    function createToken(uint256 tokenId) public onlyOwner returns (bool) {
        require(!doesTokenExist(tokenId), "Token already exists");
        tokenExists[tokenId] = true;
        tokenCount += 1;
        emit SBTCreateToken(tokenId);
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

    /// @dev Get token if a token exists.
    /// @param tokenId Id of token.
    function balanceOf(
        address _address,
        uint256 tokenId,
        uint256 orgId
    ) public view returns (uint256) {
        require(doesTokenExist(tokenId), "Token does not exist");
        return orgBalances[_address][tokenId][orgId];
    }

    /// @dev Get token if a token exists.
    /// @param tokenId Id of token.
    function balanceOf(
        address _address,
        uint256 tokenId,
        uint256 complexity,
        uint256 orgId
    ) public view returns (uint256) {
        require(doesTokenExist(tokenId), "Token does not exist");
        return orgBalancesByComplexity[_address][tokenId][complexity][orgId];
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
        uint256 complexity,
        uint256 orgId
    ) public onlyTaskContract returns (bool) {
        require(doesTokenExist(tokenId), "Token does not exist");
        _mint(to, tokenId, 1, "");
        balances[to][tokenId] += 1;
        orgBalances[to][tokenId][orgId] += 1;
        orgBalancesByComplexity[to][tokenId][complexity][orgId] += 1;
        totalComplexityEarned[to][complexity] += 1;
        balancesByComplexity[to][tokenId][complexity] += 1;
        emit SBTRewardUser(to, orgId, tokenId, complexity, 1);
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
        uint256 tokenId,
        uint256 complexity,
        uint256 orgId
    ) public view returns (uint256) {
        uint256 balance = orgBalancesByComplexity[_address][tokenId][
            complexity
        ][orgId];
        return balance - locked[_address][tokenId][complexity][orgId];
    }

    /// @dev Allows to lock an assignee tokens.
    /// @param _address Assignee address.
    function stake(
        address _address,
        uint256 tokenId,
        uint256 complexity,
        uint256 amount,
        uint256 orgId
    ) public onlyTaskContract returns (bool) {
        uint256 balance = orgBalancesByComplexity[_address][tokenId][
            complexity
        ][orgId];
        require(
            balance >= locked[_address][tokenId][complexity][orgId] + amount,
            "Tokens are locked"
        );
        locked[_address][tokenId][complexity][orgId] += amount;
        return true;
    }

    /// @dev Allows to unlock an assignee tokens.
    /// @param _address Assignee address.
    function unStake(
        address _address,
        uint256 tokenId,
        uint256 complexity,
        uint256 amount,
        uint256 orgId
    ) public onlyTaskContract returns (bool) {
        require(
            locked[_address][tokenId][complexity][orgId] >= amount,
            "Tokens not locked"
        );
        locked[_address][tokenId][complexity][orgId] -= amount;
        return true;
    }

    /// @dev Get token type count.
    function getTokenCount() public view returns (uint256) {
        return tokenCount;
    }
}
