// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../contracts/TaskStorageContract.sol";

library TaskLibrary {
    modifier onlyTaskAssignee(address sender, address assignee) {
        require(sender == assignee, "Task not yours");
        _;
    }

    function createTask(
        TaskLib.Task storage self,
        uint256 taskId,
        uint256 orgId,
        string memory title,
        string memory description,
        string[] memory taskTags,
        uint256 complexityScore,
        uint256 reputationLevel,
        uint256 taskDuration
    ) external {
        self.id = taskId;
        self.orgId = orgId;
        self.title = title;
        self.description = description;
        self.taskTags = taskTags;
        self.complexityScore = complexityScore;
        self.reputationLevel = reputationLevel;
        self.taskDuration = taskDuration;
    }

    function createTaskMetadata(
        TaskLib.TaskMetadata storage self,
        uint256 taskId,
        uint256 requiredApprovals
    ) external {
        self.id = taskId;
        self.requiredApprovals = requiredApprovals;
    }

    /// @dev Allows an approver to update a task.
    function updateTask(
        TaskLib.Task storage self,
        string memory title,
        string memory description,
        string[] memory taskTags,
        uint256 complexityScore,
        uint256 reputationLevel,
        uint256 taskDuration
    ) external {
        self.title = title;
        self.description = description;
        self.taskDuration = taskDuration;
        self.reputationLevel = reputationLevel;
        if (self.status == TaskLib.TaskStatus.PROPOSED) {
            self.taskTags = taskTags;
            self.complexityScore = complexityScore;
        }
    }

    /// @dev Allows an approver to move a task to open.
    function openTask(
        TaskLib.Task storage self,
        TaskLib.TaskMetadata storage taskMetadata,
        uint256 rewardAmount,
        address rewardToken
    ) external {
        self.status = TaskLib.TaskStatus.OPEN;
        taskMetadata.rewardAmount = rewardAmount;
        taskMetadata.rewardToken = rewardToken;
    }

    /// @dev Allows closing an approved task.
    function closeTask(TaskLib.Task storage self) external {
        require(
            self.status == TaskLib.TaskStatus.SUBMITTED,
            "Task is not submitted"
        );
        self.status = TaskLib.TaskStatus.CLOSED;
    }

    /// @dev Allows assignee to submit task for approval.
    function submitTask(
        TaskLib.Task storage self,
        TaskLib.TaskMetadata storage taskMetadata,
        address assignee,
        string memory comment
    ) external onlyTaskAssignee(assignee, self.assigneeAddress) {
        self.status = TaskLib.TaskStatus.SUBMITTED;
        self.comment = comment;
        taskMetadata.submitDate = block.timestamp;
    }

    function makeAssignmentRequest(
        TaskLib.TaskMetadata storage self,
        address assignee
    ) external {
        uint256 i;
        for (i = 0; i < self.assignmentRequests.length; i++)
            if (self.assignmentRequests[i] == assignee) return;
        self.assignmentRequests.push(assignee);
    }

    /// @dev Allows assignees assign task to themselves.
    function assign(
        TaskLib.Task storage self,
        TaskLib.TaskMetadata storage taskMetadata,
        address assignee,
        address assigner,
        bool staked
    ) external {
        require(self.status == TaskLib.TaskStatus.OPEN, "Task is not opened");
        self.status = TaskLib.TaskStatus.ASSIGNED;
        self.assigneeAddress = assignee;
        self.assigner = assigner;
        taskMetadata.assignDate = block.timestamp;
        taskMetadata.staked = staked;
    }

    /// @dev Allows assignees drop tasks.
    function unassign(
        TaskLib.Task storage self,
        TaskLib.TaskMetadata storage taskMetadata,
        address assignee
    ) external onlyTaskAssignee(assignee, self.assigneeAddress) {
        require(self.status == TaskLib.TaskStatus.ASSIGNED, "Task not opened");
        self.assigneeAddress = address(0);
        self.status = TaskLib.TaskStatus.OPEN;
        taskMetadata.assignDate = 0;
        taskMetadata.submitDate = 0;
    }

    /// @dev Allows a approver to reject a task.
    function requestForTaskRevision(
        TaskLib.Task storage self,
        TaskLib.TaskMetadata storage taskMetadata,
        bytes32 revisionId,
        bytes32 revisionHash,
        uint256 durationExtension,
        address approver
    ) external {
        require(
            self.status == TaskLib.TaskStatus.SUBMITTED,
            "Task not submitted"
        );
        taskMetadata.revisions.push(
            TaskLib.TaskRevision({
                id: taskMetadata.revisions.length,
                requester: approver,
                revisionId: revisionId,
                revisionHash: revisionHash,
                durationExtension: durationExtension,
                durationExtensionRequest: 0,
                status: TaskLib.TaskRevisionStatus.PROPOSED
            })
        );
    }

    function acceptTaskRevision(
        TaskLib.Task storage self,
        TaskLib.TaskMetadata storage taskMetadata,
        uint256 revisionIndex,
        address assignee
    ) external onlyTaskAssignee(assignee, self.assigneeAddress) {
        require(
            self.status == TaskLib.TaskStatus.SUBMITTED,
            "Task not submitted"
        );
        self.status = TaskLib.TaskStatus.ASSIGNED;
        taskMetadata.revisions[revisionIndex].status = TaskLib
            .TaskRevisionStatus
            .ACCEPTED;
        self.taskDuration =
            self.taskDuration +
            taskMetadata.revisions[revisionIndex].durationExtension;
    }

    function requestForTaskRevisionDurationExtension(
        TaskLib.Task storage self,
        TaskLib.TaskMetadata storage taskMetadata,
        uint256 revisionIndex,
        uint256 durationExtension,
        address assignee
    ) external onlyTaskAssignee(assignee, self.assigneeAddress) {
        require(
            self.status == TaskLib.TaskStatus.SUBMITTED,
            "Task not submitted"
        );
        taskMetadata.revisions[revisionIndex].status = TaskLib
            .TaskRevisionStatus
            .CHANGES_REQUESTED;
        taskMetadata
            .revisions[revisionIndex]
            .durationExtensionRequest = durationExtension;
    }

    /// @dev Allows approvers to archive open tasks.
    function archive(TaskLib.Task storage self) external {
        require(self.status == TaskLib.TaskStatus.OPEN, "Task is not opened");
        self.status = TaskLib.TaskStatus.ARCHIVED;
    }
}
