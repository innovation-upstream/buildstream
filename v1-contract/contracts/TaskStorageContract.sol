// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../libraries/TaskLibrary.sol";

library TaskLib {
    enum TaskStatus {
        PROPOSED,
        OPEN,
        ASSIGNED,
        SUBMITTED,
        CLOSED,
        ARCHIVED
    }

    enum TaskRevisionStatus {
        PROPOSED,
        CHANGES_REQUESTED,
        ACCEPTED,
        REQUEST_FOR_NEW_TASK
    }

    struct TaskRevision {
        uint256 id;
        address requester;
        bytes32 revisionId;
        bytes32 revisionHash;
        uint256 durationExtension;
        uint256 durationExtensionRequest;
        TaskRevisionStatus status;
    }

    struct Task {
        uint256 id;
        string externalId;
        uint256 orgId;
        string title;
        string description;
        address assigner;
        address assigneeAddress;
        uint256[] taskTags;
        uint256 complexityScore;
        uint256 reputationLevel;
        TaskStatus status;
        string comment;
        uint256 taskDuration;
    }

    struct TaskMetadata {
        uint256 id;
        uint256 requiredApprovals;
        uint256 rewardAmount;
        address rewardToken;
        uint256 assignDate;
        uint256 submitDate;
        bool staked;
        TaskRevision[] revisions;
        uint256 revisionCount;
        address[] assignmentRequests;
        address[] approvers;
        uint256 totalWaitTime;
        bool disableSelfAssign;
    }
}

contract TaskStorageContract {
    using TaskLibrary for TaskLib.Task;
    using TaskLibrary for TaskLib.TaskMetadata;

    address private owner;
    address private taskContractAddress;

    mapping(uint256 => mapping(address => bool)) private approvals;
    mapping(uint256 => mapping(address => bool)) private assignmentRequests;
    mapping(uint256 => TaskLib.Task) private tasks;
    mapping(uint256 => TaskLib.TaskMetadata) private taskMetadata;
    mapping(uint256 => bool) private _taskExists;
    uint256 private taskCount;

    event TaskConfirmation(address indexed approver, uint256 indexed taskId);
    event TaskRejected(address indexed approver, uint256 indexed taskId);
    event TaskRevocation(address indexed approver, uint256 indexed taskId);
    event TaskCreation(
        uint256 indexed taskId,
        TaskLib.Task task,
        TaskLib.TaskMetadata taskMetadata
    );
    event TaskOpened(
        uint256 indexed taskId,
        uint256 rewardAmount,
        address rewardToken,
        bool disableSelfAssign
    );
    event TaskAssignment(
        address indexed assignee,
        uint256 indexed taskId,
        bool staked
    );
    event TaskAssignmentRequested(
        address indexed assignee,
        uint256 indexed taskId
    );
    event TaskUnassignment(address indexed assignee, uint256 indexed taskId);
    event TaskSubmission(uint256 indexed taskId, string comment);
    event TaskClosed(uint256 indexed taskId);
    event TaskArchived(uint256 indexed taskId);
    event TaskUpdated(
        uint256 indexed taskId,
        TaskLib.Task task,
        TaskLib.TaskMetadata taskMetadata
    );
    event TaskRevisionRequested(
        uint256 indexed taskId,
        TaskLib.TaskRevision revision
    );
    event TaskRevisionAccepted(
        uint256 indexed taskId,
        uint256 id,
        bytes32 revisionId,
        uint256 taskDuration,
        uint256 totalWaitTime
    );
    event TaskRevisionChangesRequested(
        uint256 indexed taskId,
        uint256 id,
        bytes32 revisionId,
        uint256 durationExtension
    );
    event TaskRevisionRejected(
        uint256 indexed taskId,
        uint256 id,
        bytes32 revisionId
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Permission denied");
        _;
    }

    modifier onlyTaskContract() {
        require(msg.sender == taskContractAddress, "Permission denied");
        _;
    }

    modifier taskExists(uint256 taskId) {
        require(_taskExists[taskId], "Task not exist");
        _;
    }

    /// @dev constructor sets reputation token address and organization contract address.
    constructor() {
        owner = msg.sender;
    }

    function updateTaskContractAddress(address _address) external onlyOwner {
        taskContractAddress = _address;
    }

    /// @dev Allows a user to create a task.
    /// @param externalId Id from other task manager.
    /// @param orgId Id of organization.
    /// @param title Task title.
    /// @param description Task description.
    /// @param taskTags Token id.
    /// @param complexityScore Task complexity score.
    /// @param reputationLevel Number of tokens.
    /// @param requiredApprovals Number of approvers required.
    /// @param taskDuration Number of seconds to take to complete the task
    /// @return taskId task ID.
    function createTask(
        uint256 orgId,
        string memory externalId,
        string memory title,
        string memory description,
        uint256[] memory taskTags,
        uint256 complexityScore,
        uint256 reputationLevel,
        uint256 requiredApprovals,
        uint256 taskDuration,
        bool disableSelfAssign
    ) external onlyTaskContract returns (uint256 taskId) {
        taskId = taskCount;
        tasks[taskId].createTask(
            taskId,
            externalId,
            orgId,
            title,
            description,
            taskTags,
            complexityScore,
            reputationLevel,
            taskDuration
        );

        taskMetadata[taskId].createTaskMetadata(
            taskId,
            requiredApprovals,
            disableSelfAssign
        );
        taskCount += 1;
        _taskExists[taskId] = true;
        emit TaskCreation(taskId, tasks[taskId], taskMetadata[taskId]);
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
        uint256 taskDuration,
        bool disableSelfAssign
    ) external onlyTaskContract {
        require(msg.sender == taskContractAddress, "Permission denied");
        tasks[taskId].updateTask(
            externalId,
            title,
            description,
            taskTags,
            complexityScore,
            reputationLevel,
            taskDuration
        );
        taskMetadata[taskId].updateTaskMetadata(disableSelfAssign);
        emit TaskUpdated(taskId, tasks[taskId], taskMetadata[taskId]);
    }

    /// @dev Allows an approver to move a task to open.
    /// @param taskId Task ID.
    function openTask(
        uint256 taskId,
        uint256 rewardAmount,
        address rewardToken,
        bool disableSelfAssign
    ) external taskExists(taskId) onlyTaskContract {
        tasks[taskId].openTask(taskMetadata[taskId], rewardAmount, rewardToken, disableSelfAssign);
        emit TaskOpened(taskId, rewardAmount, rewardToken, disableSelfAssign);
    }

    /// @dev Allows closing an approved task.
    /// @param taskId Task ID.
    function closeTask(
        uint256 taskId
    ) external taskExists(taskId) onlyTaskContract {
        tasks[taskId].closeTask();
        emit TaskClosed(taskId);
    }

    /// @dev Allows to retrieve a task.
    /// @param taskId Task ID.
    /// @return task.
    function getTask(
        uint256 taskId
    ) external view taskExists(taskId) returns (TaskLib.Task memory) {
        return tasks[taskId];
    }

    function getTaskMetadata(
        uint256 taskId
    ) external view taskExists(taskId) returns (TaskLib.TaskMetadata memory) {
        return taskMetadata[taskId];
    }

    /// @dev Allows assignee to submit task for approval.
    /// @param taskId Task ID.
    function submitTask(
        uint256 taskId,
        address assignee,
        string memory comment
    ) external onlyTaskContract taskExists(taskId) {
        tasks[taskId].submitTask(taskMetadata[taskId], assignee, comment);
        emit TaskSubmission(taskId, comment);
    }

    /// @dev Allows assignees assign task to themselves.
    /// @param taskId Task ID.
    function assign(
        uint256 taskId,
        address assignee,
        address assigner,
        bool staked
    ) external onlyTaskContract taskExists(taskId) {
        tasks[taskId].assign(taskMetadata[taskId], assignee, assigner, staked);
        emit TaskAssignment(assignee, taskId, staked);
    }

    /// @dev Allows assignees assign task to themselves.
    /// @param taskId Task ID.
    function makeAssignmentRequest(
        uint256 taskId,
        address assignee
    ) external onlyTaskContract taskExists(taskId) {
        if (assignmentRequests[taskId][assignee])
            return taskMetadata[taskId].makeAssignmentRequest(assignee);
        emit TaskAssignmentRequested(assignee, taskId);
    }

    /// @dev Allows assignees drop tasks.
    /// @param taskId Task ID.
    function unassign(
        uint256 taskId,
        address assignee
    ) external onlyTaskContract taskExists(taskId) {
        TaskLib.TaskMetadata storage taskM = taskMetadata[taskId];
        for (uint256 i; i < taskM.approvers.length; i++)
            approvals[taskId][taskM.approvers[i]] = false;
        tasks[taskId].unassign(taskM, assignee);
        emit TaskUnassignment(assignee, taskId);
    }

    /// @dev Allows a approver to approve a task.
    /// @param taskId Task ID.
    function approveTask(
        uint256 taskId,
        address approver
    ) external onlyTaskContract taskExists(taskId) {
        require(!approvals[taskId][approver], "Task is approved");
        tasks[taskId].approveTask(taskMetadata[taskId], approver);
        approvals[taskId][approver] = true;
        emit TaskConfirmation(approver, taskId);
    }

    /// @dev Allows a approver to revoke approval for a task.
    /// @param taskId Task ID.
    function revokeApproval(
        uint256 taskId,
        address approver
    ) external onlyTaskContract taskExists(taskId) {
        require(approvals[taskId][approver], "Task not approved");
        tasks[taskId].revokeApproval(taskMetadata[taskId], approver);
        approvals[taskId][approver] = false;
        emit TaskRevocation(approver, taskId);
    }

    function requestForTaskRevision(
        uint256 taskId,
        bytes32 revisionId,
        bytes32 revisionHash,
        uint256 durationExtension,
        address approver
    ) external onlyTaskContract {
        tasks[taskId].requestForTaskRevision(
            taskMetadata[taskId],
            revisionId,
            revisionHash,
            durationExtension,
            approver
        );
        emit TaskRevisionRequested(
            taskId,
            taskMetadata[taskId].revisions[
                taskMetadata[taskId].revisionCount - 1
            ]
        );
    }

    function acceptTaskRevision(
        uint256 taskId,
        uint256 revisionIndex
    ) external {
        tasks[taskId].acceptTaskRevision(
            taskMetadata[taskId],
            revisionIndex,
            msg.sender
        );
        emit TaskRevisionAccepted(
            taskId,
            revisionIndex,
            taskMetadata[taskId].revisions[revisionIndex].revisionId,
            tasks[taskId].taskDuration,
            taskMetadata[taskId].totalWaitTime
        );
    }

    function requestForTaskRevisionDurationExtension(
        uint256 taskId,
        uint256 revisionIndex,
        uint256 durationExtension
    ) external {
        tasks[taskId].requestForTaskRevisionDurationExtension(
            taskMetadata[taskId],
            revisionIndex,
            durationExtension,
            msg.sender
        );
        emit TaskRevisionChangesRequested(
            taskId,
            revisionIndex,
            taskMetadata[taskId].revisions[revisionIndex].revisionId,
            durationExtension
        );
    }

    function rejectTaskRevision(
        uint256 taskId,
        uint256 revisionIndex
    ) external {
        tasks[taskId].rejectTaskRevision(
            taskMetadata[taskId],
            revisionIndex,
            msg.sender
        );
        emit TaskRevisionRejected(
            taskId,
            revisionIndex,
            taskMetadata[taskId].revisions[revisionIndex].revisionId
        );
    }

    /// @dev Check if an approver approved a task.
    /// @param taskId Task ID.
    /// @param approver Approver address.
    function didApprove(
        uint256 taskId,
        address approver
    ) external view taskExists(taskId) returns (bool) {
        return approvals[taskId][approver];
    }

    /// @dev Allows approvers to archive open tasks.
    /// @param taskId Task ID.
    function archive(
        uint256 taskId
    ) external onlyTaskContract taskExists(taskId) {
        tasks[taskId].archive(taskMetadata[taskId]);
        emit TaskArchived(taskId);
    }
}
