// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Organization.sol";

contract Treasury {
    address private owner;
    Organization private organization;
    address private organizationAddress;
    address private taskContractAddress;

    event TreasuryDeposit(
        uint256 indexed orgId,
        address indexed tokenAddress,
        uint256 indexed amount
    );
    event TreasuryWithdraw(
        uint256 indexed orgId,
        address indexed tokenAddress,
        address recipient,
        uint256 indexed amount
    );
    event TreasuryTokenLocked(
        uint256 indexed orgId,
        address indexed tokenAddress,
        uint256 indexed amount
    );
    event TreasuryTokenUnlocked(
        uint256 indexed orgId,
        address indexed tokenAddress,
        uint256 indexed amount
    );

    mapping(uint256 => mapping(address => uint256)) private tokenBalances;
    mapping(uint256 => mapping(address => uint256)) private lockedTokenBalances;
    mapping(uint256 => uint256) private balances;
    mapping(uint256 => uint256) private lockedBalances;
    mapping(uint256 => bool) private payments;
    mapping(uint256 => address[]) private orgTokens;
    mapping(uint256 => mapping(address => bool)) private orgTokenMap;

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

    function updateTaskContractAddress(address _address) external onlyOwner {
        taskContractAddress = _address;
    }

    function getBalance(uint256 orgId)
        external
        view
        orgExists(orgId)
        returns (uint256)
    {
        return balances[orgId];
    }

    function getBalance(uint256 orgId, address tokenAddress)
        external
        view
        orgExists(orgId)
        returns (uint256)
    {
        return tokenBalances[orgId][tokenAddress];
    }

    function getLockedBalance(uint256 orgId)
        external
        view
        orgExists(orgId)
        returns (uint256)
    {
        return lockedBalances[orgId];
    }

    function getLockedBalance(uint256 orgId, address tokenAddress)
        external
        view
        orgExists(orgId)
        returns (uint256)
    {
        if (tokenAddress == address(0)) return lockedBalances[orgId];
        return lockedTokenBalances[orgId][tokenAddress];
    }

    function getOrgTokens(uint256 orgId)
        external
        view
        orgExists(orgId)
        returns (address[] memory)
    {
        return orgTokens[orgId];
    }

    function deposit(uint256 orgId) public payable {
        balances[orgId] += msg.value;
        emit TreasuryDeposit(orgId, address(0), msg.value);
    }

    function deposit(
        uint256 orgId,
        address tokenAddress,
        uint256 amount
    ) public orgExists(orgId) {
        if (tokenAddress == address(0)) return deposit(orgId);
        IERC20 _token = IERC20(tokenAddress);
        if (!orgTokenMap[orgId][tokenAddress])
            orgTokens[orgId].push(tokenAddress);
        uint256 allowance = _token.allowance(msg.sender, address(this));
        require(allowance >= amount, "Check the token allowance");
        bool sent = _token.transferFrom(msg.sender, address(this), amount);
        require(sent, "Failed to deposit tokens");
        tokenBalances[orgId][tokenAddress] += amount;
        emit TreasuryDeposit(orgId, tokenAddress, amount);
    }

    function withdraw(
        uint256 orgId,
        address to,
        uint256 amount
    ) internal orgExists(orgId) {
        require(lockedBalances[orgId] >= amount, "Insufficient funds");
        lockedBalances[orgId] -= amount;
        emit TreasuryTokenUnlocked(orgId, address(0), amount);
        address payable recipient = payable(to);
        recipient.transfer(amount);
        emit TreasuryWithdraw(orgId, address(0), to, amount);
    }

    function withdraw(
        uint256 orgId,
        address to,
        address tokenAddress,
        uint256 amount
    ) internal orgExists(orgId) {
        require(
            lockedTokenBalances[orgId][tokenAddress] >= amount,
            "Insufficient funds"
        );
        IERC20 _token = IERC20(tokenAddress);
        lockedTokenBalances[orgId][tokenAddress] -= amount;
        emit TreasuryTokenUnlocked(orgId, tokenAddress, amount);
        bool sent = _token.transfer(to, amount);
        require(sent, "Failed to transfer token to user");
        emit TreasuryWithdraw(orgId, tokenAddress, to, amount);
    }

    function withdrawForce(
        uint256 actionId,
        uint256 orgId,
        address to,
        uint256 amount
    ) public onlyOrgContract orgExists(orgId) {
        require(!payments[actionId], "Payment made");
        require(balances[orgId] >= amount, "Insufficient funds");
        payments[actionId] = true;
        balances[orgId] -= amount;
        address payable recipient = payable(to);
        recipient.transfer(amount);
        emit TreasuryWithdraw(orgId, address(0), to, amount);
    }

    function withdrawForce(
        uint256 actionId,
        uint256 orgId,
        address to,
        address tokenAddress,
        uint256 amount
    ) external onlyOrgContract orgExists(orgId) {
        if (tokenAddress == address(0))
            return withdrawForce(actionId, orgId, to, amount);
        require(
            tokenBalances[orgId][tokenAddress] >= amount,
            "Insufficient funds"
        );
        require(!payments[actionId], "Payment made");
        IERC20 _token = IERC20(tokenAddress);
        payments[actionId] = true;
        tokenBalances[orgId][tokenAddress] -= amount;
        _token.transfer(to, amount);
        emit TreasuryWithdraw(orgId, tokenAddress, to, amount);
    }

    function lockBalance(uint256 orgId, uint256 amount)
        public
        onlyTaskContract
        orgExists(orgId)
    {
        require(balances[orgId] >= amount, "Insufficient funds");
        balances[orgId] -= amount;
        lockedBalances[orgId] += amount;
        emit TreasuryTokenLocked(orgId, address(0), amount);
    }

    function lockBalance(
        uint256 orgId,
        address tokenAddress,
        uint256 amount
    ) external onlyTaskContract orgExists(orgId) {
        if (tokenAddress == address(0)) return lockBalance(orgId, amount);
        require(
            tokenBalances[orgId][tokenAddress] >= amount,
            "Insufficient funds"
        );
        tokenBalances[orgId][tokenAddress] -= amount;
        lockedTokenBalances[orgId][tokenAddress] += amount;
        emit TreasuryTokenLocked(orgId, tokenAddress, amount);
    }

    function unlockBalance(uint256 orgId, uint256 amount) public {
        lockedBalances[orgId] -= amount;
        balances[orgId] += amount;
        emit TreasuryTokenUnlocked(orgId, address(0), amount);
    }

    function unlockBalance(
        uint256 orgId,
        address tokenAddress,
        uint256 amount
    ) external {
        if (tokenAddress == address(0)) return unlockBalance(orgId, amount);
        lockedTokenBalances[orgId][tokenAddress] -= amount;
        tokenBalances[orgId][tokenAddress] += amount;
        emit TreasuryTokenUnlocked(orgId, tokenAddress, amount);
    }

    function reward(
        uint256 orgId,
        address to,
        uint256 amount
    ) external onlyTaskContract orgExists(orgId) {
        withdraw(orgId, to, amount);
    }

    function reward(
        uint256 orgId,
        address to,
        address tokenAddress,
        uint256 amount
    ) external onlyTaskContract orgExists(orgId) {
        if (tokenAddress == address(0)) return withdraw(orgId, to, amount);
        withdraw(orgId, to, tokenAddress, amount);
    }
}
