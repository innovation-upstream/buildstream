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
    TaskStorageContract private taskStorageContract;
    SBTToken private tokenContract;
    Organization private organizationContract;
    Treasury private treasuryContract;
    TeamContract private teamContract;

    modifier onlyOwner() {
        require(msg.sender == owner, "Permission denied");
        _;
    }

    modifier onlyApprover(uint256 taskId) {
        require(isApprover(taskId, msg.sender), "Permission denied");
        _;
    }

    function isApprover(
        uint256 taskId,
        address _address
    ) internal view returns (bool) {
        TaskLib.Task memory task = taskStorageContract.getTask(taskId);
        return organizationContract.isApproverAddress(task.orgId, _address);
    }

    modifier notNull(address _address) {
        require(_address != address(0), "Value is null");
        _;
    }

    /// @dev constructor sets reputation token address and organizationContract contract address.
    /// @param tokenAddress Reputation token address.
    /// @param organizationContractAddress Reputation token address.
    constructor(
        address tokenAddress,
        address organizationContractAddress,
        address taskStorageAddress
    ) {
        owner = msg.sender;
        tokenContract = SBTToken(tokenAddress);
        organizationContract = Organization(organizationContractAddress);
        taskStorageContract = TaskStorageContract(taskStorageAddress);
    }

    function updateTreasuryContract(address _address) external onlyOwner {
        treasuryContract = Treasury(_address);
    }

    function updateTeamContract(address _address) external onlyOwner {
        teamContract = TeamContract(_address);
    }

    /// @dev Allows a user to create a task.
    /// @param orgId Id of organizationContract.
    /// @param title Task title.
    /// @param description Task description.
    /// @param taskTags Token id.
    /// @param complexityScore Task complexity score.
    /// @param reputationLevel Number of tokens.
    /// @return taskId task ID.
    function createTask(
        string memory externalId,
        uint256 orgId,
        string memory title,
        string memory description,
        uint256[] memory taskTags,
        uint256 complexityScore,
        uint256 reputationLevel,
        uint256 dueDate,
        bool requestAssignment,
        bool disableSelfAssign
    ) external returns (uint256 taskId) {
        TaskControlLogicLibrary.ensureCanCreateTask(
            orgId,
            taskTags,
            complexityScore,
            organizationContract,
            tokenContract
        );
        uint256 requiredTaskApprovals = organizationContract.getTaskApprovals(
            orgId
        );
        taskId = taskStorageContract.createTask(
            orgId,
            externalId,
            title,
            description,
            taskTags,
            complexityScore,
            reputationLevel,
            requiredTaskApprovals,
            dueDate,
            disableSelfAssign
        );

        if (requestAssignment && !disableSelfAssign)
            taskStorageContract.makeAssignmentRequest(taskId, msg.sender);
    }

    /// @dev Allows an approver to update a task.
    /// @param taskId Task ID.
    function updateTask(
        uint256 taskId,
        string memory externalId,
        string memory title,
        string memory description,
        uint256[] memory taskTags,
        uint256 complexityScore,
        uint256 reputationLevel,
        uint256 dueDate,
        bool disableSelfAssign
    ) external onlyApprover(taskId) {
        TaskControlLogicLibrary.ensureCanUpdateTask(
            taskTags,
            complexityScore,
            tokenContract
        );
        taskStorageContract.updateTask(
            taskId,
            externalId,
            title,
            description,
            taskTags,
            complexityScore,
            reputationLevel,
            dueDate,
            disableSelfAssign
        );
    }

    /// @dev Allows an approver to move a task to open.
    /// @param taskId Task ID.
    function openTask(
        uint256 taskId,
        bool assignCreator,
        bool disableSelfAssign
    ) public onlyApprover(taskId) {
        TaskLib.Task memory task = taskStorageContract.getTask(taskId);
        OrgLib.OrgConfig memory orgConfig = organizationContract.getOrganizationConfig(task.orgId);
        uint256 rewardAmount = TaskControlLogicLibrary.getTaskReward(
            taskId,
            taskStorageContract,
            organizationContract
        );
        treasuryContract.lockBalance(task.orgId, orgConfig.rewardToken, rewardAmount);
        taskStorageContract.openTask(taskId, rewardAmount, orgConfig.rewardToken, disableSelfAssign);

        if (!assignCreator) return;

        TaskLib.TaskMetadata memory taskMetadata = taskStorageContract
            .getTaskMetadata(taskId);
        if (
            taskMetadata.assignmentRequests.length > 0 &&
            taskMetadata.assignmentRequests[0] != address(0)
        ) approveAssignRequest(taskId, taskMetadata.assignmentRequests[0]);
    }

    /// @dev Allows an approver to move a task to open.
    /// @param taskId Task ID.
    function openTask(
        uint256 taskId,
        address rewardToken,
        uint256 rewardAmount,
        bool assignCreator,
        bool disableSelfAssign
    ) public onlyApprover(taskId) {
        TaskLib.Task memory task = taskStorageContract.getTask(taskId);
        treasuryContract.lockBalance(task.orgId, rewardToken, rewardAmount);
        taskStorageContract.openTask(taskId, rewardAmount, rewardToken, disableSelfAssign);

        if (!assignCreator) return;

        TaskLib.TaskMetadata memory taskMetadata = taskStorageContract
            .getTaskMetadata(taskId);
        if (
            taskMetadata.assignmentRequests.length > 0 &&
            taskMetadata.assignmentRequests[0] != address(0)
        ) approveAssignRequest(taskId, taskMetadata.assignmentRequests[0]);
    }

    /// @dev Allows a approver to approve a task.
    /// @param taskId Task ID.
    function approveTask(uint256 taskId) external onlyApprover(taskId) {
        taskStorageContract.approveTask(taskId, msg.sender);
        if (TaskControlLogicLibrary.canCloseTask(taskId, taskStorageContract))
            closeTask(taskId);
    }

    /// @dev Allows a approver to revoke approval for a task.
    /// @param taskId Task ID.
    function revokeApproval(uint256 taskId) external onlyApprover(taskId) {
        taskStorageContract.revokeApproval(taskId, msg.sender);
    }

    /// @dev Allows closing an approved task.
    /// @param taskId Task ID.
    function closeTask(uint256 taskId) internal {
        taskStorageContract.closeTask(taskId);
        TaskLib.Task memory task = taskStorageContract.getTask(taskId);
        TaskLib.TaskMetadata memory taskMetadata = taskStorageContract
            .getTaskMetadata(taskId);
        (uint256 rewardAmount, uint256 slashAmount) = TaskControlLogicLibrary
            .getRewardAndSlash(
                taskId,
                taskStorageContract,
                organizationContract
            );
        for (uint256 i = 0; i < task.taskTags.length; i++) {
            tokenContract.reward(
                task.assigneeAddress,
                task.taskTags[i],
                task.complexityScore + 1
            );
        }

        if (taskMetadata.staked)
            for (uint256 i = 0; i < task.taskTags.length; i++) {
                tokenContract.unStake(
                    task.assigneeAddress,
                    task.taskTags[i],
                    task.complexityScore
                );
            }
        if (slashAmount > 0)
            treasuryContract.unlockBalance(
                task.orgId,
                taskMetadata.rewardToken,
                slashAmount
            );
        if (rewardAmount == 0) return;
        Payee[] memory payees = TaskControlLogicLibrary.getPayees(
            taskId,
            rewardAmount,
            taskStorageContract,
            teamContract
        );
        for (uint256 i = 0; i < payees.length; i++)
            if (payees[i].walletAddress != address(0) && payees[i].amount > 0)
                treasuryContract.reward(
                    task.orgId,
                    payees[i].walletAddress,
                    taskMetadata.rewardToken,
                    payees[i].amount
                );
    }

    /// @dev Allows assignees assign task to themselves.
    /// @param taskId Task ID.
    function assignSelf(
        uint256 taskId
    ) external {
        TaskLib.Task memory task = taskStorageContract.getTask(taskId);
        TaskLib.TaskMetadata memory taskMetadata = taskStorageContract
            .getTaskMetadata(taskId);
        if (taskMetadata.disableSelfAssign) {
            taskStorageContract.makeAssignmentRequest(taskId, msg.sender);
            return;
        }
        for (uint256 i = 0; i < task.taskTags.length; i++) {
            uint256 tokenBalance = tokenContract.balanceOf(
                msg.sender,
                task.taskTags[i]
            );
            uint256 stakableTokens = tokenContract.stakableTokens(
                msg.sender,
                task.taskTags[i]
            );
            if (
                tokenBalance < task.reputationLevel ||
                stakableTokens < task.complexityScore
            ) {
                taskStorageContract.makeAssignmentRequest(taskId, msg.sender);
                return;
            }
        }

        taskStorageContract.assign(taskId, msg.sender, msg.sender, true);
        for (uint256 i = 0; i < task.taskTags.length; i++) {
            tokenContract.stake(
                msg.sender,
                task.taskTags[i],
                task.complexityScore
            );
        }
    }

    function approveAssignRequest(
        uint256 taskId,
        address assignee
    ) public onlyApprover(taskId) {
        taskStorageContract.assign(taskId, assignee, msg.sender, false);
    }

    /// @dev Allows approver to unassign assignee.
    /// @param taskId Task ID.
    function unassign(uint256 taskId) external onlyApprover(taskId) {
        TaskLib.Task memory task = taskStorageContract.getTask(taskId);
        TaskLib.TaskMetadata memory taskMetadata = taskStorageContract
            .getTaskMetadata(taskId);
        taskStorageContract.unassign(taskId, task.assigneeAddress);
        if (taskMetadata.staked)
            for (uint256 i = 0; i < task.taskTags.length; i++) {
                tokenContract.unStake(
                    task.assigneeAddress,
                    task.taskTags[i],
                    task.complexityScore
                );
            }
    }

    function requestForTaskRevision(
        uint256 taskId,
        bytes32 reviewId,
        bytes32 revisionHash,
        uint256 dueDateExtension
    ) external onlyApprover(taskId) {
        taskStorageContract.requestForTaskRevision(
            taskId,
            reviewId,
            revisionHash,
            dueDateExtension,
            msg.sender
        );
    }

    /// @dev Allows approvers to dispute tasks.
    /// @param taskId Task ID.
    function dispute(uint256 taskId) external onlyApprover(taskId) {
        taskStorageContract.dispute(taskId);
    }

    /// @dev Allows approvers to archive unassigned tasks.
    /// @param taskId Task ID.
    function archive(uint256 taskId) external onlyApprover(taskId) {
        TaskLib.Task memory task = taskStorageContract.getTask(taskId);
        TaskLib.TaskMetadata memory taskMetadata = taskStorageContract
            .getTaskMetadata(taskId);
        if (task.status == TaskLib.TaskStatus.OPEN)
            treasuryContract.unlockBalance(
                task.orgId,
                taskMetadata.rewardToken,
                taskMetadata.rewardAmount
            );
        taskStorageContract.archive(taskId);
    }
}
