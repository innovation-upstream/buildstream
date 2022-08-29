// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library TaskLib {
    enum TaskStatus {
        PROPOSED,
        OPEN,
        ASSIGNED,
        SUBMITTED,
        CLOSED
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
        uint256 dueDate;
        string comment;
    }
}

contract TaskStorageContract {
    address private owner;
    address private taskContractAddress;

    mapping(uint256 => TaskLib.Task) private tasks;
    mapping(uint256 => bool) private _taskExists;
    uint256 private taskCount;

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
    /// @return taskId task ID.
    function createTask(
        uint256 orgId,
        string memory title,
        string memory description,
        string[] memory taskTags,
        uint256 complexityScore,
        uint256 reputationLevel,
        uint256 requiredApprovals,
        uint256 dueDate
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
            dueDate: dueDate,
            status: TaskLib.TaskStatus.PROPOSED,
            comment: ""
        });
        taskCount += 1;
        _taskExists[taskId] = true;
    }

    /// @dev Allows an approver to update a task requirement.
    /// @param taskId Task ID.
    function updateTaskRequirement(
        uint256 taskId,
        uint256 complexityScore,
        uint256 reputationLevel,
        uint256 dueDate
    )
        external
        taskExists(taskId)
        onlyTaskContract
    {
        TaskLib.Task memory task = tasks[taskId];
        require(task.status == TaskLib.TaskStatus.PROPOSED, "Task is opened");
        task.complexityScore = complexityScore;
        task.reputationLevel = reputationLevel;
        task.dueDate = dueDate;
        tasks[taskId] = task;
    }

    /// @dev Allows an approver to move a task to open.
    /// @param taskId Task ID.
    function openTask(uint256 taskId, uint256 rewardAmount)
        external
        taskExists(taskId)
        onlyTaskContract
    {
        TaskLib.Task memory task = tasks[taskId];
        require(task.status == TaskLib.TaskStatus.PROPOSED, "Task is opened");
        task.rewardAmount = rewardAmount;
        task.status = TaskLib.TaskStatus.OPEN;
        tasks[taskId] = task;
    }

    /// @dev Allows an approver to move a task to open.
    /// @param taskId Task ID.
    function openTask(
        uint256 taskId,
        uint256 rewardAmount,
        address rewardToken
    ) external taskExists(taskId) onlyTaskContract {
        TaskLib.Task memory task = tasks[taskId];
        require(task.status == TaskLib.TaskStatus.PROPOSED, "Task is opened");
        task.rewardAmount = rewardAmount;
        task.rewardToken = rewardToken;
        task.status = TaskLib.TaskStatus.OPEN;
        tasks[taskId] = task;
    }

    /// @dev Allows closing an approved task.
    /// @param taskId Task ID.
    function closeTask(uint256 taskId)
        external
        taskExists(taskId)
        onlyTaskContract
    {
        tasks[taskId].status = TaskLib.TaskStatus.CLOSED;
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
    function submitTask(uint256 taskId, string memory comment)
        external
        onlyTaskContract
        taskExists(taskId)
    {
        tasks[taskId].status = TaskLib.TaskStatus.SUBMITTED;
        tasks[taskId].submitDate = block.number;
        tasks[taskId].comment = comment;
    }

    /// @dev Allows assignees assign task to themselves.
    /// @param taskId Task ID.
    function assign(uint256 taskId, address assignee, address assigner)
        external
        onlyTaskContract
        taskExists(taskId)
    {
        TaskLib.Task memory task = tasks[taskId];
        task.assigneeAddress = assignee;
        task.status = TaskLib.TaskStatus.ASSIGNED;
        task.assignDate = block.number;
        task.assigner = assigner;
        tasks[taskId] = task;
    }

    /// @dev Allows assignees drop tasks.
    /// @param taskId Task ID.
    function unassign(uint256 taskId) external onlyTaskContract {
        TaskLib.Task memory task = tasks[taskId];
        task.assigneeAddress = address(0);
        task.status = TaskLib.TaskStatus.OPEN;
        task.assignDate = 0;
        task.submitDate = 0;
        tasks[taskId] = task;
    }
}
