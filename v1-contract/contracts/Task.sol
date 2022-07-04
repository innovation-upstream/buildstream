// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ReputationToken.sol";
import "./Organization.sol";
import "hardhat/console.sol";

contract TaskContract {
    
  SBTToken private sbtToken;
  Organization private organization;

  event Confirmation(address indexed sender, uint256 indexed taskId);
  event Revocation(address indexed sender, uint256 indexed taskId);
  event Creation(uint indexed taskId);
  event Assignment(address indexed sender, uint indexed taskId);
  event Unassignment(address indexed sender, uint indexed taskId);
  event Submission(uint indexed taskId);
  event Closed(uint indexed taskId);

  mapping(uint256 => mapping(uint256 => Task)) public tasks;
  mapping(uint256 => bool) public _taskExists;
  mapping(uint256 => mapping(address => bool)) public approvals;
  uint256 public taskCount;
  mapping(uint256 => uint256) public orgTaskCount;
  mapping(uint256 => uint256[]) public orgTaskIds;
  mapping(uint256 => uint256) public taskOrg;
  mapping(uint256 => mapping(address => uint256)) public orgAssignees;

  struct Task {
    uint256 id;
    uint256 orgId;
    string title;
    string description;
    address assigneeAddress;
    string[] taskTags;
    TaskStatus status;
    uint256 complexityScore;
    uint256 reputationLevel;
    uint256 requiredApprovals;
  }

  enum TaskStatus { PROPOSED, OPEN, ASSIGNED, SUBMITTED, CLOSED }

  modifier onlyReviewer(uint256 _orgId) {
    require(organization.isReviewerAddress(_orgId, msg.sender), "Permission denied");
    _;
  }

  modifier onlyApprover(uint256 _orgId) {
    require(organization.isApproverAddress(_orgId, msg.sender), "Permission denied");
    _;
  }

  modifier orgExists(uint256 orgId) {
    require(organization.doesOrgExists(orgId), "Org does not exist");
    _;
  }

  modifier tokenExists(uint256 tokenId) {
    require(sbtToken.doesTokenExist(tokenId), "Token does not exist");
    _;
  }

  modifier taskExists(uint256 taskId) {
    require(_taskExists[taskId], "Task does not exist");
    _;
  }

  modifier approved(uint256 taskId) {
    require(approvals[taskId][msg.sender], "Task has not been approved");
    _;
  }

  modifier notApproved(uint256 taskId) {
    require(!approvals[taskId][msg.sender], "Task is already approved");
    _;
  }

  modifier notClosed(uint256 taskId) {
    uint256 orgId = taskOrg[taskId];
    require(tasks[orgId][taskId].status != TaskStatus.CLOSED, "Task is not executed");
    _;
  }

  modifier notNull(address _address) {
    require(_address != address(0), "Value should not be null");
    _;
  }

  /// @dev constructor sets reputation token address and organization contract address.
  /// @param tokenAddress Reputation token address.
  /// @param organizationAddress Reputation token address.
  constructor(address tokenAddress, address organizationAddress) {
    sbtToken = SBTToken(tokenAddress);
    organization = Organization(organizationAddress);
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
    uint256 requiredApprovals
  ) public orgExists(orgId) tokenExists(complexityScore) returns (uint256 taskId) {
    taskId = taskCount;
    tasks[orgId][taskId] = Task({
      id: taskId,
      orgId: orgId,
      title: title,
      description: description,
      taskTags: taskTags,
      complexityScore: complexityScore,
      reputationLevel: reputationLevel,
      requiredApprovals: requiredApprovals,
      assigneeAddress: address(0),
      status: TaskStatus.PROPOSED
    });
    taskCount += 1;
    orgTaskCount[orgId] += 1;
    orgTaskIds[orgId].push(taskId);
    _taskExists[taskId] = true;
    taskOrg[taskId] = orgId;
    emit Creation(taskId);
  }

  /// @dev Allows an approver to move a task to open.
  /// @param taskId Task ID.
  function openTask(
    uint256 taskId
  ) public taskExists(taskId) onlyApprover(taskOrg[taskId]) {
    uint256 orgId = taskOrg[taskId];
    require(tasks[orgId][taskId].status == TaskStatus.PROPOSED, "Task has already been opened");
    tasks[orgId][taskId].status = TaskStatus.OPEN;
  }
 
  /// @dev Allows a approver to approve a task.
  /// @param taskId Task ID.
  function approveTask(uint256 taskId)
    public
    taskExists(taskId)
    onlyApprover(taskOrg[taskId])
    notApproved(taskId)
  {
    uint256 orgId = taskOrg[taskId];
    require(tasks[orgId][taskId].status == TaskStatus.SUBMITTED, "Task is not submitted");
    approvals[taskId][msg.sender] = true;
    emit Confirmation(msg.sender, taskId);
    if (isApproved(taskId))
      closeTask(taskId);
  }

  /// @dev Allows a approver to revoke approval for a task.
  /// @param taskId Task ID.
  function revokeApproval(uint256 taskId)
    public
    taskExists(taskId)
    onlyApprover(taskOrg[taskId])
    approved(taskId)
    notClosed(taskId)
  {
    approvals[taskId][msg.sender] = false;
    emit Revocation(msg.sender, taskId);
  }

  /// @dev Allows closing an approved task.
  /// @param taskId Task ID.
  function closeTask(uint256 taskId) internal {
    uint256 orgId = taskOrg[taskId];
    Task memory task = tasks[orgId][taskId];
    sbtToken.reward(task.assigneeAddress, task.complexityScore);
    tasks[orgId][taskId].status = TaskStatus.CLOSED;
    emit Closed(taskId);
  }

  /// @dev Returns the approval status of a task.
  /// @param taskId Task ID.
  /// @return approvalStatus Approval status.
  function isApproved(uint256 taskId) public view returns (bool approvalStatus) {
    uint256 count = 0;
    approvalStatus = false;
    uint256 orgId = taskOrg[taskId];
    Task memory task = tasks[orgId][taskId];
    address[] memory approvers = organization.getApprovers(orgId);
    for (uint256 i = 0; i < approvers.length; i++) {
      if (approvals[taskId][approvers[i]]) count += 1;
      if (count == task.requiredApprovals) approvalStatus = true;
    }
  }

  /// @dev Allows to retrieve a task.
  /// @param taskId Task ID.
  /// @return task.
  function getTask(uint256 taskId) public taskExists(taskId) view returns (Task memory) {
    uint256 orgId = taskOrg[taskId];
    return tasks[orgId][taskId];
  }

  /// @dev Allows assignee to submit task for approval.
  /// @param taskId Task ID.
  function submitTask(uint256 taskId) public taskExists(taskId) {
    uint256 orgId = taskOrg[taskId];
    Task storage task  = tasks[orgId][taskId];
    require(task.assigneeAddress == msg.sender, "Task is not yours");
    task.status = TaskStatus.SUBMITTED;
    emit Submission(taskId);
  }

  /// @dev Returns status of a task.
  /// @param taskId TaskStatus enum.
  /// @return status State of a task.
  function getState(uint256 taskId) public view taskExists(taskId) returns (TaskStatus status) {
    uint256 orgId = taskOrg[taskId];
    status = tasks[orgId][taskId].status;
  }

  /// @dev Returns number of approvals of a task.
  /// @param taskId Task ID.
  /// @return count Number of approvals.
  function getApprovalCount(uint256 taskId) public view returns (uint256 count)
  {
    uint256 orgId = taskOrg[taskId];
    address[] memory approvers = organization.getApprovers(orgId);
    for (uint256 i = 0; i < approvers.length; i++)
      if (approvals[taskId][approvers[i]]) count += 1;
  }

  /// @dev Returns total number of tasks after filers are applied.
  /// @param orgId Id of organization.
  /// @param pending Include pending tasks.
  /// @param executed Include executed tasks.
  /// @return count Total number of tasks after filters are applied.
  function getTaskCount(uint256 orgId, bool pending, bool executed) public view returns (uint256 count)
  {
    for (uint256 i = 0; i < orgTaskCount[orgId]; i++) {
      uint256 taskId = orgTaskIds[orgId][i];
      if (
        (pending && tasks[orgId][taskId].status != TaskStatus.CLOSED) ||
        (executed && tasks[orgId][taskId].status == TaskStatus.CLOSED)
      ) count += 1;
    }
  }

  /// @dev Allows assignees assign task to themselves.
  /// @param taskId Task ID.
  /// @return status Task updated status.
  function assignSelf(uint256 taskId) public returns (TaskStatus status) {
    uint256 orgId = taskOrg[taskId];
    Task memory task = tasks[orgId][taskId];
    require(task.status == TaskStatus.OPEN, "Task is not opened");
    require(sbtToken.balanceOf(msg.sender, task.complexityScore) >= task.reputationLevel, "Not enough reputation tokens");
    sbtToken.stake(msg.sender);
    task.assigneeAddress = msg.sender;
    task.status = TaskStatus.ASSIGNED;
    tasks[orgId][taskId] = task;
    status = task.status;
    orgAssignees[task.orgId][msg.sender] += 1;
    emit Assignment(msg.sender, taskId);
  }

  /// @dev Allows assignees drop tasks.
  /// @param taskId Task ID.
  /// @return status Task updated status.
  function unassignSelf(uint256 taskId) public returns (TaskStatus status) {
    uint256 orgId = taskOrg[taskId];
    Task memory task = tasks[orgId][taskId];
    require(task.assigneeAddress == msg.sender, "Task is not yours");
    require(task.status == TaskStatus.ASSIGNED, "Task is not opened");
    sbtToken.unStake(msg.sender);
    task.assigneeAddress = address(0);
    task.status = TaskStatus.OPEN;
    tasks[orgId][taskId] = task;
    status = task.status;
    emit Unassignment(msg.sender, taskId);
  }

  /// @dev Returns array with approver addresses, which approved task.
  /// @param taskId Task ID.
  /// @return _approvals array of owner addresses.
  function getApprovals(uint256 taskId) public view returns (address[] memory _approvals)
  {
    uint256 orgId = taskOrg[taskId];
    address[] memory approvers = organization.getApprovers(orgId);
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
  ) public view returns (uint256[] memory _taskIds) {
    _taskIds = new uint256[](to - from);
    uint256 i;
    uint256 totalTaskCount = orgTaskCount[orgId];
    uint256 max = totalTaskCount > from ? from : totalTaskCount;
    for (i = from; i < max; i++) {
      _taskIds[i - from] = orgTaskIds[orgId][i];
    }
  }

  /// @dev Returns list of task IDs in defined range assigned to an address.
  /// @param orgId Id of organization.
  /// @param from Index start position of task array.
  /// @param to Index end position of task array.
  /// @param assignee Assignee address.
  /// @return _taskIds array of task IDs.
  function getTaskIdsByAssignee(
    uint256 orgId,
    uint256 from,
    uint256 to,
    address assignee
  ) public view notNull(assignee) returns (uint256[] memory _taskIds) {
    uint256 assignedCount = orgAssignees[orgId][msg.sender];
    uint256[] memory taskIdsTemp = new uint256[](assignedCount);
    uint256 count = 0;
    uint256 i;
    for (i = 0; i < orgTaskCount[orgId]; i++) {
      uint256 taskId = orgTaskIds[orgId][i];
      Task memory task = tasks[orgId][taskId];
      if (task.assigneeAddress == assignee) {
        taskIdsTemp[count] = task.id;
        count += 1;
      }
    }
    _taskIds = new uint256[](to - from);
    for (i = from; i < to; i++)
      _taskIds[i - from] = taskIdsTemp[i];
  }
}
