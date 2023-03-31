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
        string memory externalId,
        uint256 orgId,
        string memory title,
        string memory description,
        uint256[] memory taskTags,
        uint256 complexityScore,
        uint256 reputationLevel,
        uint256 taskDuration
    ) external {
        self.id = taskId;
        self.externalId = externalId;
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
        string memory externalId,
        string memory title,
        string memory description,
        uint256[] memory taskTags,
        uint256 complexityScore,
        uint256 reputationLevel,
        uint256 taskDuration
    ) external {
        self.externalId = externalId;
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
        require(
            self.status == TaskLib.TaskStatus.PROPOSED ||
                self.status == TaskLib.TaskStatus.ARCHIVED,
            "Task already opened"
        );
        self.status = TaskLib.TaskStatus.OPEN;
        taskMetadata.rewardAmount = rewardAmount;
        taskMetadata.rewardToken = rewardToken;
    }

    /// @dev Allows a approver to approve a task.
    function approveTask(
        TaskLib.Task storage self,
        TaskLib.TaskMetadata storage taskMetadata,
        address approver
    ) external {
        require(
            self.status == TaskLib.TaskStatus.SUBMITTED,
            "Task not submitted"
        );
        taskMetadata.approvers.push(approver);
    }

    /// @dev Allows a approver to revoke approval for a task.
    function revokeApproval(
        TaskLib.Task storage self,
        TaskLib.TaskMetadata storage taskMetadata,
        address approver
    ) external {
        require(
            self.status == TaskLib.TaskStatus.SUBMITTED,
            "Task is not submitted"
        );
        address[] storage approvers = taskMetadata.approvers;
        for (uint256 i = 0; i < approvers.length; i++)
            if (approvers[i] == approver) {
                approvers[i] = approvers[approvers.length - 1];
                break;
            }
        approvers.pop();
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
        self.comment = "";
        taskMetadata.assignDate = 0;
        taskMetadata.submitDate = 0;
        taskMetadata.staked = false;
        delete taskMetadata.approvers;
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
        if (taskMetadata.revisionCount > 0) {
            require(
                taskMetadata.revisions[taskMetadata.revisionCount - 1].status !=
                    TaskLib.TaskRevisionStatus.PROPOSED,
                "decide on last revision"
            );
        }
        taskMetadata.revisions.push(
            TaskLib.TaskRevision({
                id: taskMetadata.revisionCount,
                requester: approver,
                revisionId: revisionId,
                revisionHash: revisionHash,
                durationExtension: durationExtension,
                durationExtensionRequest: 0,
                status: TaskLib.TaskRevisionStatus.PROPOSED
            })
        );
        taskMetadata.revisionCount++;
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
        require(taskMetadata.revisionCount > revisionIndex, "revision invalid");
        require(
            taskMetadata.revisions[revisionIndex].status ==
                TaskLib.TaskRevisionStatus.PROPOSED,
            "decision made already"
        );
        self.status = TaskLib.TaskStatus.ASSIGNED;
        taskMetadata.revisions[revisionIndex].status = TaskLib
            .TaskRevisionStatus
            .ACCEPTED;
        // Account for time spent during reviews
        uint256 timeOffset = block.timestamp - taskMetadata.submitDate;
        self.taskDuration =
            self.taskDuration +
            taskMetadata.revisions[revisionIndex].durationExtension;
        taskMetadata.totalWaitTime = taskMetadata.totalWaitTime + timeOffset;
        taskMetadata.submitDate = 0;
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
        require(taskMetadata.revisionCount > revisionIndex, "revision invalid");
        require(
            taskMetadata.revisions[revisionIndex].status ==
                TaskLib.TaskRevisionStatus.PROPOSED,
            "decision made already"
        );
        taskMetadata.revisions[revisionIndex].status = TaskLib
            .TaskRevisionStatus
            .CHANGES_REQUESTED;
        taskMetadata
            .revisions[revisionIndex]
            .durationExtensionRequest = durationExtension;
    }

    function rejectTaskRevision(
        TaskLib.Task storage self,
        TaskLib.TaskMetadata storage taskMetadata,
        uint256 revisionIndex,
        address assignee
    ) external onlyTaskAssignee(assignee, self.assigneeAddress) {
        require(
            self.status == TaskLib.TaskStatus.SUBMITTED,
            "Task not submitted"
        );
        require(taskMetadata.revisionCount > revisionIndex, "revision invalid");
        require(
            taskMetadata.revisions[revisionIndex].status ==
                TaskLib.TaskRevisionStatus.PROPOSED,
            "decide made already"
        );
        taskMetadata.revisions[revisionIndex].status = TaskLib
            .TaskRevisionStatus
            .REQUEST_FOR_NEW_TASK;
    }

    /// @dev Allows approvers to archive open tasks.
    function archive(
        TaskLib.Task storage self,
        TaskLib.TaskMetadata storage taskMetadata
    ) external {
        require(self.status <= TaskLib.TaskStatus.OPEN, "Task is assigned");
        taskMetadata.staked = false;
        self.status = TaskLib.TaskStatus.ARCHIVED;
    }
}
