// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SBTToken.sol";
import "./Organization.sol";
import "./Treasury.sol";
import "./TaskStorageContract.sol";
import "./TeamContract.sol";
import "../libraries/TaskControlLogicLibrary.sol";

contract TaskContract {
    address private owner;
    TaskStorageContract private taskStorage;
    SBTToken private sbtToken;
    Organization private organization;
    Treasury private treasury;
    TeamContract private teamContract;

    modifier onlyOwner() {
        require(msg.sender == owner, "Permission denied");
        _;
    }

    modifier onlyApprover(uint256 taskId) {
        TaskLib.Task memory task = taskStorage.getTask(taskId);
        require(
            organization.isApproverAddress(task.orgId, msg.sender),
            "Permission denied"
        );
        _;
    }

    modifier notNull(address _address) {
        require(_address != address(0), "Value is null");
        _;
    }

    /// @dev constructor sets reputation token address and organization contract address.
    /// @param tokenAddress Reputation token address.
    /// @param organizationAddress Reputation token address.
    constructor(
        address tokenAddress,
        address organizationAddress,
        address taskStorageAddress
    ) {
        owner = msg.sender;
        sbtToken = SBTToken(tokenAddress);
        organization = Organization(organizationAddress);
        taskStorage = TaskStorageContract(taskStorageAddress);
    }

    function updateTreasuryContract(address _address) external onlyOwner {
        treasury = Treasury(_address);
    }

    function updateTeamContract(address _address) external onlyOwner {
        teamContract = TeamContract(_address);
    }

    /// @dev Allows a user to create a task.
    /// @param orgId Id of organization.
    /// @param title Task title.
    /// @param description Task description.
    /// @param taskTags Token id.
    /// @param complexityScore Task complexity score.
    /// @param reputationLevel Number of tokens.
    /// @return taskId task ID.
    function createTask(
        uint256 orgId,
        string memory title,
        string memory description,
        string[] memory taskTags,
        uint256 complexityScore,
        uint256 reputationLevel,
        uint256 taskDuration
    ) external returns (uint256 taskId) {
        TaskControlLogicLibrary.ensureCanCreateTask(
            orgId,
            complexityScore,
            organization,
            sbtToken
        );
        uint256 requiredTaskApprovals = organization.getTaskApprovals(orgId);
        taskId = taskStorage.createTask(
            orgId,
            title,
            description,
            taskTags,
            complexityScore,
            reputationLevel,
            requiredTaskApprovals,
            taskDuration
        );
    }

    /// @dev Allows an approver to update a task.
    /// @param taskId Task ID.
    function updateTask(
        uint256 taskId,
        string memory title,
        string memory description,
        string[] memory taskTags,
        uint256 complexityScore,
        uint256 reputationLevel,
        uint256 taskDuration
    ) external onlyApprover(taskId) {
        taskStorage.updateTask(
            taskId,
            title,
            description,
            taskTags,
            complexityScore,
            reputationLevel,
            taskDuration
        );
    }

    /// @dev Allows an approver to move a task to open.
    /// @param taskId Task ID.
    function openTask(uint256 taskId, address rewardToken)
        external
        onlyApprover(taskId)
    {
        TaskLib.Task memory task = taskStorage.getTask(taskId);
        uint256 rewardAmount = TaskControlLogicLibrary.getTaskReward(
            taskId,
            taskStorage,
            organization
        );
        treasury.lockBalance(task.orgId, rewardToken, rewardAmount);
        taskStorage.openTask(taskId, rewardAmount, rewardToken);
    }

    /// @dev Allows a approver to approve a task.
    /// @param taskId Task ID.
    function approveTask(uint256 taskId) external onlyApprover(taskId) {
        taskStorage.approveTask(taskId, msg.sender);
        if (
            TaskControlLogicLibrary.canCloseTask(
                taskId,
                taskStorage,
                organization
            )
        ) closeTask(taskId);
    }

    /// @dev Allows a approver to revoke approval for a task.
    /// @param taskId Task ID.
    function revokeApproval(uint256 taskId) external onlyApprover(taskId) {
        taskStorage.revokeApproval(taskId, msg.sender);
    }

    /// @dev Allows closing an approved task.
    /// @param taskId Task ID.
    function closeTask(uint256 taskId) internal {
        taskStorage.closeTask(taskId);
        TaskLib.Task memory task = taskStorage.getTask(taskId);
        TaskLib.TaskMetadata memory taskMetadata = taskStorage.getTaskMetadata(
            taskId
        );
        (uint256 rewardAmount, uint256 slashAmount) = TaskControlLogicLibrary
            .getRewardAndSlash(taskId, taskStorage, organization);
        sbtToken.reward(task.assigneeAddress, task.complexityScore, task.orgId);
        if (taskMetadata.staked)
            sbtToken.unStake(
                task.assigneeAddress,
                task.complexityScore,
                task.reputationLevel,
                task.orgId
            );
        if (slashAmount > 0)
            treasury.unlockBalance(
                task.orgId,
                taskMetadata.rewardToken,
                slashAmount
            );
        if (rewardAmount == 0) return;
        Payee[] memory payees = TaskControlLogicLibrary.getPayees(
            taskId,
            rewardAmount,
            taskStorage,
            teamContract
        );
        for (uint256 i = 0; i < payees.length; i++)
            if (payees[i].walletAddress != address(0) && payees[i].amount > 0)
                treasury.reward(
                    task.orgId,
                    payees[i].walletAddress,
                    taskMetadata.rewardToken,
                    payees[i].amount
                );
    }

    /// @dev Allows assignee to submit task for approval.
    /// @param taskId Task ID.
    function submitTask(uint256 taskId, string memory comment) external {
        taskStorage.submitTask(taskId, msg.sender, comment);
    }

    /// @dev Allows assignees assign task to themselves.
    /// @param taskId Task ID.
    function assignSelf(uint256 taskId) external {
        TaskLib.Task memory task = taskStorage.getTask(taskId);
        if (
            sbtToken.balanceOf(msg.sender, task.complexityScore, task.orgId) <
            task.reputationLevel
        ) {
            taskStorage.makeAssignmentRequest(taskId, msg.sender);
            return;
        }

        taskStorage.assign(taskId, msg.sender, msg.sender, true);
        sbtToken.stake(
            msg.sender,
            task.complexityScore,
            task.reputationLevel,
            task.orgId
        );
    }

    function approveAssignRequest(uint256 taskId, address assignee)
        external
        onlyApprover(taskId)
    {
        taskStorage.assign(taskId, assignee, msg.sender, false);
    }

    /// @dev Allows assignees to drop tasks.
    /// @param taskId Task ID.
    function unassignSelf(uint256 taskId) external {
        TaskLib.Task memory task = taskStorage.getTask(taskId);
        TaskLib.TaskMetadata memory taskMetadata = taskStorage.getTaskMetadata(
            taskId
        );
        taskStorage.unassign(taskId, msg.sender);
        if (taskMetadata.staked)
            sbtToken.unStake(
                msg.sender,
                task.complexityScore,
                task.reputationLevel,
                task.orgId
            );
    }

    function requestForTaskRevision(
        uint256 taskId,
        bytes32 reviewId,
        bytes32 revisionHash,
        uint256 durationExtension
    ) external onlyApprover(taskId) {
        taskStorage.requestForTaskRevision(
            taskId,
            reviewId,
            revisionHash,
            durationExtension,
            msg.sender
        );
    }

    /// @dev Allows approvers to archive open tasks.
    /// @param taskId Task ID.
    function archive(uint256 taskId) external onlyApprover(taskId) {
        TaskLib.Task memory task = taskStorage.getTask(taskId);
        TaskLib.TaskMetadata memory taskMetadata = taskStorage.getTaskMetadata(
            taskId
        );
        treasury.unlockBalance(
            task.orgId,
            taskMetadata.rewardToken,
            taskMetadata.rewardAmount
        );
        taskStorage.archive(taskId);
    }

    /// @dev Returns array with approver addresses, which approved task.
    /// @param taskId Task ID.
    /// @return _approvals array of owner addresses.
    function getApprovals(uint256 taskId)
        public
        view
        returns (address[] memory _approvals)
    {
        return
            TaskControlLogicLibrary.getApprovals(
                taskId,
                taskStorage,
                organization
            );
    }
}
