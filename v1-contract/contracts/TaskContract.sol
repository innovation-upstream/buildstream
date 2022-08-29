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

    event TaskConfirmation(address indexed sender, uint256 indexed taskId);
    event TaskRevocation(address indexed sender, uint256 indexed taskId);
    event TaskCreation(uint256 indexed taskId);
    event TaskAssignment(address indexed sender, uint256 indexed taskId);
    event TaskUnassignment(address indexed sender, uint256 indexed taskId);
    event TaskSubmission(uint256 indexed taskId);
    event TaskClosed(uint256 indexed taskId);

    mapping(uint256 => mapping(address => bool)) private approvals;
    uint256 private taskCount;
    mapping(uint256 => uint256) private orgTaskCount;
    mapping(uint256 => uint256[]) private orgTaskIds;
    mapping(uint256 => uint256) private taskOrg;
    mapping(uint256 => TaskLib.TaskStatus) private taskStatus;
    mapping(uint256 => mapping(address => uint256)) private orgAssignees;
    mapping(uint256 => address) private taskAssignee;
    mapping(uint256 => address[]) private assignmentRequest;

    modifier onlyOwner() {
        require(msg.sender == owner, "Permission denied");
        _;
    }

    modifier onlyApprover(uint256 _orgId) {
        require(
            organization.isApproverAddress(_orgId, msg.sender),
            "Permission denied"
        );
        _;
    }

    modifier taskExists(uint256 taskId) {
        require(taskCount >= taskId, "Task not exist");
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
        uint256 dueDate
    ) external returns (uint256 taskId) {
        require(organization.doesOrgExists(orgId), "Org not exist");
        require(sbtToken.doesTokenExist(complexityScore), "Token not exist");
        uint256 requiredTaskApprovals = organization.getTaskApprovals(orgId);
        taskId = taskStorage.createTask(
            orgId,
            title,
            description,
            taskTags,
            complexityScore,
            reputationLevel,
            requiredTaskApprovals,
            dueDate
        );
        taskCount += 1;
        taskStatus[taskId] = TaskLib.TaskStatus.PROPOSED;
        taskOrg[taskId] = orgId;
        orgTaskCount[orgId] += 1;
        orgTaskIds[orgId].push(taskId);
        emit TaskCreation(taskId);
    }

    /// @dev Allows an approver to update a task requirement.
    /// @param taskId Task ID.
    function updateTaskRequirement(
        uint256 taskId,
        uint256 complexityScore,
        uint256 reputationLevel,
        uint256 dueDate
    ) external taskExists(taskId) onlyApprover(taskOrg[taskId]) {
        require(
            taskStatus[taskId] == TaskLib.TaskStatus.PROPOSED,
            "Task is opened"
        );
        taskStorage.updateTaskRequirement(
            taskId,
            complexityScore,
            reputationLevel,
            dueDate
        );
    }

    /// @dev Allows an approver to move a task to open.
    /// @param taskId Task ID.
    function openTask(uint256 taskId, address rewardToken)
        external
        taskExists(taskId)
        onlyApprover(taskOrg[taskId])
    {
        TaskLib.Task memory task = taskStorage.getTask(taskId);
        require(task.status == TaskLib.TaskStatus.PROPOSED, "Task is opened");
        taskStatus[taskId] = TaskLib.TaskStatus.OPEN;
        OrgLib.OrgConfig memory orgConfig = organization.getOrganizationConfig(
            task.orgId
        );
        uint256 multiplier = organization.getRewardMultiplier(
            task.orgId,
            task.taskTags
        );
        uint256 rewardAmount = multiplier * (task.complexityScore + 1);
        if (rewardToken != address(0)) {
            treasury.lockBalance(taskOrg[taskId], rewardToken, rewardAmount);
            return taskStorage.openTask(taskId, rewardAmount, rewardToken);
        }
        if (orgConfig.rewardToken != address(0)) {
            treasury.lockBalance(
                taskOrg[taskId],
                orgConfig.rewardToken,
                rewardAmount
            );
            return
                taskStorage.openTask(
                    taskId,
                    rewardAmount,
                    orgConfig.rewardToken
                );
        }
        treasury.lockBalance(task.orgId, rewardAmount);
        taskStorage.openTask(taskId, rewardAmount);
    }

    /// @dev Allows a approver to approve a task.
    /// @param taskId Task ID.
    function approveTask(uint256 taskId)
        external
        taskExists(taskId)
        onlyApprover(taskOrg[taskId])
    {
        require(!approvals[taskId][msg.sender], "Task is approved");
        require(
            taskStatus[taskId] == TaskLib.TaskStatus.SUBMITTED,
            "Task not submitted"
        );
        approvals[taskId][msg.sender] = true;
        emit TaskConfirmation(msg.sender, taskId);
        TaskLib.Task memory task = taskStorage.getTask(taskId);
        if (getApprovals(taskId).length == task.requiredApprovals)
            closeTask(taskId);
    }

    /// @dev Allows a approver to revoke approval for a task.
    /// @param taskId Task ID.
    function revokeApproval(uint256 taskId)
        external
        taskExists(taskId)
        onlyApprover(taskOrg[taskId])
    {
        require(
            taskStatus[taskId] != TaskLib.TaskStatus.CLOSED,
            "Task is executed"
        );
        require(approvals[taskId][msg.sender], "Task not approved");
        approvals[taskId][msg.sender] = false;
        emit TaskRevocation(msg.sender, taskId);
    }

    /// @dev Allows closing an approved task.
    /// @param taskId Task ID.
    function closeTask(uint256 taskId) internal {
        TaskLib.Task memory task = taskStorage.getTask(taskId);
        OrgLib.OrgConfig memory orgConfig = organization.getOrganizationConfig(
            task.orgId
        );
        sbtToken.reward(task.assigneeAddress, task.complexityScore, task.orgId);
        if (task.assigneeAddress == task.assigner)
            sbtToken.unStake(
                msg.sender,
                task.complexityScore,
                task.reputationLevel,
                task.orgId
            );
        uint256 rewardAmount = 0;
        if (task.dueDate >= task.submitDate) rewardAmount = task.rewardAmount;
        else {
            uint256 overtime = task.submitDate - task.dueDate;
            uint256 slashRatio = overtime / orgConfig.slashRewardEvery;
            uint256 slashAmount = (slashRatio * task.rewardAmount) /
                orgConfig.rewardSlashDivisor;
            if (slashAmount > task.rewardAmount)
                slashAmount = task.rewardAmount;
            rewardAmount = task.rewardAmount - slashAmount;
            if (task.rewardToken == address(0))
                treasury.unlockBalance(taskOrg[taskId], slashAmount);
            else
                treasury.unlockBalance(
                    taskOrg[taskId],
                    task.rewardToken,
                    slashAmount
                );
        }
        if (task.rewardToken == address(0))
            treasury.reward(
                taskOrg[taskId],
                task.assigneeAddress,
                rewardAmount
            );
        else
            treasury.reward(
                taskOrg[taskId],
                task.assigneeAddress,
                task.rewardToken,
                rewardAmount
            );
        taskStorage.closeTask(taskId);
        taskStatus[taskId] = TaskLib.TaskStatus.CLOSED;
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
        return taskStorage.getTask(taskId);
    }

    function getState(uint256 taskId)
        external
        view
        taskExists(taskId)
        returns (TaskLib.TaskStatus)
    {
        return taskStatus[taskId];
    }

    /// @dev Allows assignee to submit task for approval.
    /// @param taskId Task ID.
    function submitTask(uint256 taskId, string memory comment)
        external
        taskExists(taskId)
    {
        require(taskAssignee[taskId] == msg.sender, "Task not yours");
        taskStorage.submitTask(taskId, comment);
        taskStatus[taskId] = TaskLib.TaskStatus.SUBMITTED;
        emit TaskSubmission(taskId);
    }

    /// @dev Returns total number of tasks after filers are applied.
    /// @param orgId Id of organization.
    /// @param pending Include pending tasks.
    /// @param closed Include executed tasks.
    /// @return count Total number of tasks after filters are applied.
    function getTaskCount(
        uint256 orgId,
        bool pending,
        bool closed
    ) external view returns (uint256 count) {
        for (uint256 i = 0; i < orgTaskCount[orgId]; i++) {
            uint256 taskId = orgTaskIds[orgId][i];
            if (
                (pending && taskStatus[taskId] != TaskLib.TaskStatus.CLOSED) ||
                (closed && taskStatus[taskId] == TaskLib.TaskStatus.CLOSED)
            ) count += 1;
        }
    }

    /// @dev Allows assignees assign task to themselves.
    /// @param taskId Task ID.
    /// @return status Task updated status.
    function assignSelf(uint256 taskId)
        external
        returns (TaskLib.TaskStatus status)
    {
        TaskLib.Task memory task = taskStorage.getTask(taskId);
        require(
            taskStatus[taskId] == TaskLib.TaskStatus.OPEN,
            "Task not opened"
        );

        if (
            sbtToken.balanceOf(msg.sender, task.complexityScore, task.orgId) <
            task.reputationLevel
        ) {
            uint256 i;
            bool requestExist;
            for (i = 0; i < assignmentRequest[taskId].length; i++)
                if (assignmentRequest[taskId][i] == msg.sender)
                    requestExist = true;
            if (!requestExist) assignmentRequest[taskId].push(msg.sender);
            return taskStatus[taskId];
        }

        taskStatus[taskId] = TaskLib.TaskStatus.ASSIGNED;
        taskAssignee[taskId] = msg.sender;
        sbtToken.stake(
            msg.sender,
            task.complexityScore,
            task.reputationLevel,
            task.orgId
        );
        taskStorage.assign(taskId, msg.sender, msg.sender);
        orgAssignees[taskOrg[taskId]][msg.sender] += 1;
        status = taskStatus[taskId];
        emit TaskAssignment(msg.sender, taskId);
    }

    function approveAssignRequest(uint256 taskId, address assignee)
        external
        onlyApprover(taskOrg[taskId])
    {
        TaskLib.Task memory task = taskStorage.getTask(taskId);
        require(
            taskStatus[taskId] == TaskLib.TaskStatus.OPEN,
            "Task not opened"
        );

        taskStatus[taskId] = TaskLib.TaskStatus.ASSIGNED;
        taskAssignee[taskId] = assignee;
        sbtToken.stake(assignee, task.complexityScore, 0, task.orgId);
        taskStorage.assign(taskId, assignee, msg.sender);
        orgAssignees[task.orgId][assignee] += 1;
        emit TaskAssignment(assignee, taskId);
    }

    function getAssignmentRequests(uint256 taskId)
        external
        view
        taskExists(taskId)
        returns (address[] memory)
    {
        require(
            taskStatus[taskId] == TaskLib.TaskStatus.OPEN,
            "Task not opened"
        );
        return assignmentRequest[taskId];
    }

    /// @dev Allows assignees to drop tasks.
    /// @param taskId Task ID.
    /// @return status Task updated status.
    function unassignSelf(uint256 taskId)
        external
        returns (TaskLib.TaskStatus status)
    {
        TaskLib.Task memory task = taskStorage.getTask(taskId);
        require(task.assigneeAddress == msg.sender, "Task not yours");
        require(
            taskStatus[taskId] == TaskLib.TaskStatus.ASSIGNED,
            "Task not opened"
        );
        taskStatus[taskId] = TaskLib.TaskStatus.OPEN;
        taskAssignee[taskId] = address(0);
        taskStorage.unassign(taskId);
        orgAssignees[taskOrg[taskId]][msg.sender] -= 1;
        if (
            sbtToken.balanceOf(msg.sender, task.complexityScore, task.orgId) >=
            task.reputationLevel
        )
            sbtToken.unStake(
                msg.sender,
                task.complexityScore,
                task.reputationLevel,
                task.orgId
            );
        status = taskStatus[taskId];
        emit TaskUnassignment(msg.sender, taskId);
    }

    /// @dev Returns array with approver addresses, which approved task.
    /// @param taskId Task ID.
    /// @return _approvals array of owner addresses.
    function getApprovals(uint256 taskId)
        public
        view
        returns (address[] memory _approvals)
    {
        address[] memory approvers = organization.getApprovers(taskOrg[taskId]);
        address[] memory approvalsTemp = new address[](approvers.length);
        uint256 count = 0;
        uint256 i;
        for (i = 0; i < approvers.length; i++)
            if (approvals[taskId][approvers[i]]) {
                approvalsTemp[count] = approvers[i];
                count += 1;
            }
        _approvals = new address[](count);
        for (i = 0; i < count; i++) _approvals[i] = approvalsTemp[i];
    }

    /// @dev Returns list of task IDs in defined range.
    /// @param orgId Id of organization.
    /// @param from Index start position of task array.
    /// @param to Index end position of task array.
    /// @return _taskIds array of task IDs.
    function getTaskIds(
        uint256 orgId,
        uint256 from,
        uint256 to
    ) external view returns (uint256[] memory _taskIds) {
        _taskIds = new uint256[](to - from);
        uint256 i;
        uint256 totalTaskCount = orgTaskCount[orgId];
        uint256 max = totalTaskCount > to ? to : totalTaskCount;
        for (i = from; i < max; i++) {
            _taskIds[i - from] = orgTaskIds[orgId][i];
        }
    }
}
