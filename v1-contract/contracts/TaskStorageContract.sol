// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library TaskLib {
    enum TaskStatus {
        PROPOSED,
        OPEN,
        ASSIGNED,
        SUBMITTED,
        CLOSED,
        ARCHIVED
    }

    struct Task {
        uint256 id;
        uint256 orgId;
        string title;
        string description;
        address assigner;
        address assigneeAddress;
        string[] taskTags;
        TaskStatus status;
        uint256 complexityScore;
        uint256 reputationLevel;
        uint256 requiredApprovals;
        uint256 rewardAmount;
        address rewardToken;
        uint256 assignDate;
        uint256 submitDate;
        uint256 taskDuration;
        string comment;
    }
}

contract TaskStorageContract {
    address private owner;
    address private taskContractAddress;

    mapping(uint256 => mapping(address => bool)) private approvals;
    mapping(uint256 => address[]) private assignmentRequest;
    mapping(uint256 => TaskLib.Task) private tasks;
    mapping(uint256 => bool) private _taskExists;
    uint256 private taskCount;

    event TaskConfirmation(address indexed sender, uint256 indexed taskId);
    event TaskRevocation(address indexed sender, uint256 indexed taskId);
    event TaskCreation(uint256 indexed taskId, TaskLib.Task task);
    event TaskOpened(
        uint256 indexed taskId,
        uint256 rewardAmount,
        address rewardToken
    );
    event TaskAssignment(address indexed sender, uint256 indexed taskId);
    event TaskAssignmentRequested(
        address indexed sender,
        uint256 indexed taskId
    );
    event TaskUnassignment(address indexed sender, uint256 indexed taskId);
    event TaskSubmission(uint256 indexed taskId, string comment);
    event TaskClosed(uint256 indexed taskId);
    event TaskArchived(uint256 indexed taskId);
    event TaskUpdated(uint256 indexed taskId, TaskLib.Task task);

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

    modifier notNull(address _address) {
        require(_address != address(0), "Value is null");
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
        string memory title,
        string memory description,
        string[] memory taskTags,
        uint256 complexityScore,
        uint256 reputationLevel,
        uint256 requiredApprovals,
        uint256 taskDuration
    ) external onlyTaskContract returns (uint256 taskId) {
        taskId = taskCount;
        tasks[taskId] = TaskLib.Task({
            id: taskId,
            orgId: orgId,
            title: title,
            description: description,
            taskTags: taskTags,
            complexityScore: complexityScore,
            reputationLevel: reputationLevel,
            requiredApprovals: requiredApprovals,
            assigner: address(0),
            assigneeAddress: address(0),
            rewardAmount: 0,
            rewardToken: address(0),
            assignDate: 0,
            submitDate: 0,
            taskDuration: taskDuration,
            status: TaskLib.TaskStatus.PROPOSED,
            comment: ""
        });
        taskCount += 1;
        _taskExists[taskId] = true;
        emit TaskCreation(taskId, tasks[taskId]);
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
    ) external taskExists(taskId) onlyTaskContract {
        TaskLib.Task memory task = tasks[taskId];
        require(task.status <= TaskLib.TaskStatus.OPEN, "Task is assigned");
        task.title = title;
        task.description = description;
        task.taskDuration = taskDuration;
        task.reputationLevel = reputationLevel;
        if (task.status == TaskLib.TaskStatus.PROPOSED) {
            task.taskTags = taskTags;
            task.complexityScore = complexityScore;
        }
        tasks[taskId] = task;
        emit TaskUpdated(taskId, tasks[taskId]);
    }

    /// @dev Allows an approver to move a task to open.
    /// @param taskId Task ID.
    function openTask(
        uint256 taskId,
        uint256 rewardAmount,
        address rewardToken
    ) external taskExists(taskId) onlyTaskContract {
        TaskLib.Task memory task = tasks[taskId];
        require(
            task.status == TaskLib.TaskStatus.PROPOSED ||
                task.status == TaskLib.TaskStatus.ARCHIVED,
            "Task is opened"
        );
        task.status = TaskLib.TaskStatus.OPEN;
        task.rewardAmount = rewardAmount;
        task.rewardToken = rewardToken;
        tasks[taskId] = task;
        emit TaskOpened(taskId, rewardAmount, rewardToken);
    }

    /// @dev Allows closing an approved task.
    /// @param taskId Task ID.
    function closeTask(uint256 taskId)
        external
        taskExists(taskId)
        onlyTaskContract
    {
        require(
            tasks[taskId].status == TaskLib.TaskStatus.SUBMITTED,
            "Task is not submitted"
        );
        tasks[taskId].status = TaskLib.TaskStatus.CLOSED;
        emit TaskClosed(taskId);
    }

    /// @dev Allows to retrieve a task.
    /// @param taskId Task ID.
    /// @return task.
    function getTask(uint256 taskId)
        external
        view
        taskExists(taskId)
        returns (TaskLib.Task memory)
    {
        return tasks[taskId];
    }

    /// @dev Allows assignee to submit task for approval.
    /// @param taskId Task ID.
    function submitTask(
        uint256 taskId,
        address assignee,
        string memory comment
    ) external onlyTaskContract taskExists(taskId) {
        require(
            tasks[taskId].status == TaskLib.TaskStatus.ASSIGNED,
            "Task is not assigned"
        );
        require(tasks[taskId].assigneeAddress == assignee, "Task not yours");
        tasks[taskId].status = TaskLib.TaskStatus.SUBMITTED;
        tasks[taskId].submitDate = block.timestamp;
        tasks[taskId].comment = comment;
        emit TaskSubmission(taskId, comment);
    }

    /// @dev Allows assignees assign task to themselves.
    /// @param taskId Task ID.
    function assign(
        uint256 taskId,
        address assignee,
        address assigner
    ) external onlyTaskContract taskExists(taskId) {
        TaskLib.Task memory task = tasks[taskId];
        require(task.status == TaskLib.TaskStatus.OPEN, "Task is not opened");
        task.status = TaskLib.TaskStatus.ASSIGNED;
        task.assigneeAddress = assignee;
        task.assignDate = block.timestamp;
        task.assigner = assigner;
        tasks[taskId] = task;
        emit TaskAssignment(assignee, taskId);
    }

    /// @dev Allows assignees assign task to themselves.
    /// @param taskId Task ID.
    function makeAssignmentRequest(uint256 taskId, address assignee)
        external
        onlyTaskContract
        taskExists(taskId)
    {
        uint256 i;
        bool requestExist;
        for (i = 0; i < assignmentRequest[taskId].length; i++)
            if (assignmentRequest[taskId][i] == assignee) requestExist = true;
        if (!requestExist) {
            assignmentRequest[taskId].push(assignee);
            emit TaskAssignmentRequested(assignee, taskId);
        }
    }

    function getAssignmentRequests(uint256 taskId)
        external
        view
        taskExists(taskId)
        returns (address[] memory)
    {
        return assignmentRequest[taskId];
    }

    /// @dev Allows assignees drop tasks.
    /// @param taskId Task ID.
    function unassign(uint256 taskId, address assignee)
        external
        onlyTaskContract
        taskExists(taskId)
    {
        TaskLib.Task memory task = tasks[taskId];
        require(task.assigneeAddress == assignee, "Task not yours");
        require(task.status == TaskLib.TaskStatus.ASSIGNED, "Task not opened");
        task.assigneeAddress = address(0);
        task.status = TaskLib.TaskStatus.OPEN;
        task.assignDate = 0;
        task.submitDate = 0;
        tasks[taskId] = task;
        emit TaskUnassignment(assignee, taskId);
    }

    /// @dev Allows a approver to approve a task.
    /// @param taskId Task ID.
    function approveTask(uint256 taskId, address approver)
        external
        onlyTaskContract
        taskExists(taskId)
    {
        require(!approvals[taskId][approver], "Task is approved");
        require(
            tasks[taskId].status == TaskLib.TaskStatus.SUBMITTED,
            "Task not submitted"
        );
        approvals[taskId][approver] = true;
        emit TaskConfirmation(approver, taskId);
    }

    /// @dev Allows a approver to revoke approval for a task.
    /// @param taskId Task ID.
    function revokeApproval(uint256 taskId, address approver)
        external
        onlyTaskContract
        taskExists(taskId)
    {
        require(
            tasks[taskId].status == TaskLib.TaskStatus.SUBMITTED,
            "Task is not submitted"
        );
        require(approvals[taskId][approver], "Task not approved");
        approvals[taskId][approver] = false;
        emit TaskRevocation(approver, taskId);
    }

    /// @dev Check if an approver approved a task.
    /// @param taskId Task ID.
    /// @param approver Approver address.
    function didApprove(uint256 taskId, address approver)
        external
        view
        taskExists(taskId)
        returns (bool)
    {
        return approvals[taskId][approver];
    }

    /// @dev Allows approvers to archive open tasks.
    /// @param taskId Task ID.
    function archive(uint256 taskId)
        external
        onlyTaskContract
        taskExists(taskId)
    {
        require(
            tasks[taskId].status == TaskLib.TaskStatus.OPEN,
            "Task is not opened"
        );
        tasks[taskId].status = TaskLib.TaskStatus.ARCHIVED;
        emit TaskArchived(taskId);
    }

    /// @dev Returns total number of tasks.
    /// @return count Total number of tasks after filters are applied.
    function getTaskCount() external view returns (uint256 count) {
        return taskCount;
    }
}
