// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SBTToken.sol";
import "./Organization.sol";
import "./Treasury.sol";
import "./TaskStorageContract.sol";

contract TaskContract {
    address private owner;
    TaskStorageContract private taskStorage;
    SBTToken private sbtToken;
    Organization private organization;
    Treasury private treasury;

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
        require(organization.doesOrgExists(orgId), "Org not exist");
        require(sbtToken.doesTokenExist(complexityScore), "Token not exist");
        OrgLib.Org memory org = organization.getOrganization(orgId);
        require(org.isInitialized, "Organization not initialized");
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

    /// @dev Allows an approver to update a task requirement.
    /// @param taskId Task ID.
    function updateTaskRequirement(
        uint256 taskId,
        uint256 complexityScore,
        uint256 reputationLevel,
        uint256 taskDuration
    ) external onlyApprover(taskId) {
        taskStorage.updateTaskRequirement(
            taskId,
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
        OrgLib.OrgConfig memory orgConfig = organization.getOrganizationConfig(
            task.orgId
        );
        uint256 multiplier = organization.getRewardMultiplier(
            task.orgId,
            task.taskTags
        );
        uint256 rewardAmount = multiplier * (task.complexityScore + 1);
        if (rewardToken != address(0))
            treasury.lockBalance(task.orgId, rewardToken, rewardAmount);
        else if (orgConfig.rewardToken != address(0)) {
            rewardToken = orgConfig.rewardToken;
            treasury.lockBalance(
                task.orgId,
                orgConfig.rewardToken,
                rewardAmount
            );
        }
        treasury.lockBalance(task.orgId, rewardAmount);
        taskStorage.openTask(taskId, rewardAmount, rewardToken);
    }

    /// @dev Allows a approver to approve a task.
    /// @param taskId Task ID.
    function approveTask(uint256 taskId) external onlyApprover(taskId) {
        TaskLib.Task memory task = taskStorage.getTask(taskId);
        taskStorage.approveTask(taskId, msg.sender);
        if (getApprovals(taskId).length == task.requiredApprovals)
            closeTask(taskId);
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
        OrgLib.OrgConfig memory orgConfig = organization.getOrganizationConfig(
            task.orgId
        );
        sbtToken.reward(task.assigneeAddress, task.complexityScore, task.orgId);
        address[] memory assignmentRequests = taskStorage.getAssignmentRequests(taskId);
        bool shouldUnstake = task.assigneeAddress == task.assigner;
        if (shouldUnstake)
            for (uint i = 0; i < assignmentRequests.length; i++)
                if (assignmentRequests[i] == task.assigneeAddress)
                    shouldUnstake = false;
        if (shouldUnstake)
            sbtToken.unStake(
                msg.sender,
                task.complexityScore,
                task.reputationLevel,
                task.orgId
            );
        uint256 rewardAmount = 0;
        if (task.taskDuration >= task.submitDate - task.assignDate)
            rewardAmount = task.rewardAmount;
        else {
            uint256 overtime = task.submitDate - task.assignDate - task.taskDuration;
            uint256 slashRatio = overtime / orgConfig.slashRewardEvery;
            uint256 slashAmount = (slashRatio * task.rewardAmount) /
                orgConfig.rewardSlashDivisor;
            if (slashAmount > task.rewardAmount)
                slashAmount = task.rewardAmount;
            rewardAmount = task.rewardAmount - slashAmount;
            if (task.rewardToken == address(0))
                treasury.unlockBalance(task.orgId, slashAmount);
            else
                treasury.unlockBalance(
                    task.orgId,
                    task.rewardToken,
                    slashAmount
                );
        }
        if (task.rewardToken == address(0))
            treasury.reward(task.orgId, task.assigneeAddress, rewardAmount);
        else
            treasury.reward(
                task.orgId,
                task.assigneeAddress,
                task.rewardToken,
                rewardAmount
            );
    }

    /// @dev Allows to retrieve a task.
    /// @param taskId Task ID.
    /// @return task.
    function getTask(uint256 taskId)
        external
        view
        returns (TaskLib.Task memory)
    {
        return taskStorage.getTask(taskId);
    }

    function getState(uint256 taskId)
        external
        view
        returns (TaskLib.TaskStatus)
    {
        TaskLib.Task memory task = taskStorage.getTask(taskId);
        return task.status;
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

        taskStorage.assign(taskId, msg.sender, msg.sender);
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
        TaskLib.Task memory task = taskStorage.getTask(taskId);
        taskStorage.assign(taskId, assignee, msg.sender);
        sbtToken.stake(assignee, task.complexityScore, 0, task.orgId);
    }

    function getAssignmentRequests(uint256 taskId)
        external
        view
        returns (address[] memory)
    {
        return taskStorage.getAssignmentRequests(taskId);
    }

    /// @dev Allows assignees to drop tasks.
    /// @param taskId Task ID.
    function unassignSelf(uint256 taskId) external {
        TaskLib.Task memory task = taskStorage.getTask(taskId);
        address[] memory assignmentRequests = taskStorage.getAssignmentRequests(taskId);
        bool shouldUnstake = task.assigneeAddress == task.assigner;
        if (shouldUnstake)
            for (uint i = 0; i < assignmentRequests.length; i++)
                if (assignmentRequests[i] == task.assigneeAddress)
                    shouldUnstake = false;
        taskStorage.unassign(taskId, msg.sender);
        if (shouldUnstake)
            sbtToken.unStake(
                msg.sender,
                task.complexityScore,
                task.reputationLevel,
                task.orgId
            );
    }

    /// @dev Allows approvers to archive open tasks.
    /// @param taskId Task ID.
    function archive(uint256 taskId) external onlyApprover(taskId) {
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
        TaskLib.Task memory task = taskStorage.getTask(taskId);
        address[] memory approvers = organization.getApprovers(task.orgId);
        address[] memory approvalsTemp = new address[](approvers.length);
        uint256 count = 0;
        uint256 i;
        for (i = 0; i < approvers.length; i++)
            if (taskStorage.didApprove(taskId, approvers[i])) {
                approvalsTemp[count] = approvers[i];
                count += 1;
            }
        _approvals = new address[](count);
        for (i = 0; i < count; i++) _approvals[i] = approvalsTemp[i];
    }
}
