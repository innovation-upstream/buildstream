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
  event Submission(uint indexed taskId);
  event Closed(uint indexed taskId);

  mapping(uint256 => mapping(uint256 => Task)) public tasks;
  mapping(uint256 => bool) public _taskExists;
  mapping(uint256 => mapping(address => bool)) public confirmations;
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
    string taskType;
    TaskStatus status;
    uint256 complexityScore;
  }

  enum TaskStatus { OPEN, ASSIGNED, SUBMITTED, CLOSED }

  modifier onlyReviewer(uint256 _orgId) {
    require(organization.isReviewerAddress(_orgId, msg.sender), "Permission denied");
    _;
  }

  modifier orgExists(uint256 orgId) {
    require(organization.doesOrgExists(orgId), "Org does not exist");
    _;
  }

  modifier taskExists(uint256 taskId) {
    require(_taskExists[taskId], "Task does not exist");
    _;
  }

  modifier confirmed(uint256 taskId) {
    require(confirmations[taskId][msg.sender], "Task has not been confirmed");
    _;
  }

  modifier notConfirmed(uint256 taskId) {
    require(!confirmations[taskId][msg.sender], "Task is already confirmed");
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

  /**
   * @dev constructor sets reputation token address and organization contract address.
   * @param tokenAddress Reputation token address.
   * @param organizationAddress Reputation token address.
   */
  constructor(address tokenAddress, address organizationAddress) {
    sbtToken = SBTToken(tokenAddress);
    organization = Organization(organizationAddress);
  }

  /** 
   * @dev Allows a reviewer to create a task.
   * @param orgId Id of organization.
   * @param title Task title.
   * @param description Task title.
   * @param taskType Task title.
   * @param complexityScore Task title.
   * @return taskId task ID.
   */
  function createTask(
    uint256 orgId,
    string memory title,
    string memory description,
    string memory taskType,
    uint256 complexityScore
  ) public orgExists(orgId) onlyReviewer(orgId) returns (uint256 taskId) {
    taskId = addTask(orgId, title, description, taskType, complexityScore);
  }

  /** 
   * @dev Allows a reviewer to confirm a task.
   * @param taskId Task ID.
   */
  function confirmTask(uint256 taskId)
    public
    taskExists(taskId)
    onlyReviewer(taskOrg[taskId])
    notConfirmed(taskId)
  {
    uint256 orgId = taskOrg[taskId];
    require(tasks[orgId][taskId].status == TaskStatus.SUBMITTED, "Task is not submitted");
    confirmations[taskId][msg.sender] = true;
    emit Confirmation(msg.sender, taskId);
  }

  /**
   * @dev Allows a reviewer to revoke a confirmation for a task.
   * @param taskId Task ID.
   */
  function revokeConfirmation(uint256 taskId)
    public
    taskExists(taskId)
    onlyReviewer(taskOrg[taskId])
    confirmed(taskId)
    notClosed(taskId)
  {
    confirmations[taskId][msg.sender] = false;
    emit Revocation(msg.sender, taskId);
  }

  /**
   * @dev Allows a reviewer to close a confirmed task.
   * @param taskId Task ID.
   */
  function closeTask(uint256 taskId)
    public
    taskExists(taskId)
    onlyReviewer(taskOrg[taskId])
    notClosed(taskId)
  {
    require(isConfirmed(taskId), "Insufficient confirmations");
    uint256 orgId = taskOrg[taskId];
    Task memory task = tasks[orgId][taskId];
    organization.reward(task.assigneeAddress, task.complexityScore);
    task.status = TaskStatus.CLOSED;
    emit Closed(taskId);
  }

  /**
   * @dev Returns the confirmation status of a task.
   * @param taskId Task ID.
   * @return confirmationStatus Confirmation status.
   */
  function isConfirmed(uint256 taskId) public view returns (bool confirmationStatus) {
    uint256 count = 0;
    confirmationStatus = false;
    uint256 orgId = taskOrg[taskId];
    address[] memory reviewers = organization.getReviewers(orgId);
    uint256 requiredReviews = organization.getRequiredReviewsCount(orgId);
    for (uint256 i = 0; i < reviewers.length; i++) {
      if (confirmations[taskId][reviewers[i]]) count += 1;
      if (count == requiredReviews) confirmationStatus = true;
    }
  }

  /**
   * @dev Allows to retrieve a task.
   * @param taskId Task ID.
   * @return task.
   */
  function getTask(uint256 taskId) public taskExists(taskId) view returns (Task memory) {
    uint256 orgId = taskOrg[taskId];
    return tasks[orgId][taskId];
  }

  /**
   * @dev Allows assignee to submit task for review.
   * @param taskId Task ID.
   */
  function submitTask(uint256 taskId) public taskExists(taskId) {
    uint256 orgId = taskOrg[taskId];
    Task storage task  = tasks[orgId][taskId];
    require(task.assigneeAddress == msg.sender, "Task is not yours");
    task.status = TaskStatus.SUBMITTED;
    emit Submission(taskId);
  }

  /*
   * Internal functions
   */

  /**
   * @dev Adds a new task to the task mapping, if task does not exist yet.
   * @param orgId Id of organization.
   * @param title Task title.
   * @param description Task title.
   * @param taskType Task title.
   * @param complexityScore Task title.
   * @return taskId task ID.
   */
  function addTask(
    uint256 orgId,
    string memory title,
    string memory description,
    string memory taskType,
    uint256 complexityScore
  ) internal onlyReviewer(orgId) returns (uint256 taskId) {
    taskId = taskCount;
    tasks[orgId][taskId] = Task({
      id: taskId,
      orgId: orgId,
      title: title,
      description: description,
      taskType: taskType,
      complexityScore: complexityScore,
      assigneeAddress: address(0),
      status: TaskStatus.OPEN
    });
    taskCount += 1;
    orgTaskCount[orgId] += 1;
    orgTaskIds[orgId].push(taskId);
    _taskExists[taskId] = true;
    taskOrg[taskId] = orgId;
    emit Creation(taskId);
  }

  /**
   * @dev Returns status of a task.
   * @param taskId TaskStatus enum.
   * @return state of a task.
   */
  function getState(uint256 taskId) public view taskExists(taskId) returns (string memory) {
    uint256 orgId = taskOrg[taskId];
    TaskStatus status = tasks[orgId][taskId].status;
    if (status == TaskStatus.OPEN) return "OPEN";
    if (status == TaskStatus.ASSIGNED) return "ASSIGNED";
    if (status == TaskStatus.SUBMITTED) return "SUBMITTED";
    if (status == TaskStatus.CLOSED) return "CLOSED";
    return "";
  }

  /**
   * @dev Returns number of confirmations of a task.
   * @param taskId Task ID.
   * @return count Number of confirmations.
   */
  function getConfirmationCount(uint256 taskId) public view returns (uint256 count)
  {
    uint256 orgId = taskOrg[taskId];
    address[] memory reviewers = organization.getReviewers(orgId);
    for (uint256 i = 0; i < reviewers.length; i++)
      if (confirmations[taskId][reviewers[i]]) count += 1;
  }

  /**
   * @dev Returns total number of tasks after filers are applied.
   * @param orgId Id of organization.
   * @param pending Include pending tasks.
   * @param executed Include executed tasks.
   * @return count Total number of tasks after filters are applied.
   */
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

  /**
   * @dev Allows assignees assign task to themselves.
   * @param taskId Task ID.
   * @return status Task updated status.
   */
  function assignSelf(uint256 taskId) public returns (string memory status) {
    uint256 orgId = taskOrg[taskId];
    Task memory task = tasks[orgId][taskId];
    require(sbtToken.balanceOf(msg.sender) >= task.complexityScore, "Not enough reputation tokens");
    sbtToken.stake(msg.sender);
    task.assigneeAddress = msg.sender;
    task.status = TaskStatus.ASSIGNED;
    tasks[orgId][taskId] = task;
    status = getState(taskId);
    orgAssignees[task.orgId][msg.sender] += 1;
    emit Assignment(msg.sender, taskId);
  }

  /**
   * @dev Allows a reviewer to assign task to an assignee.
   * @param taskId Task ID.
   * @return status Task updated status.
   */
  function assignOthers(address assignee, uint256 taskId)
    public
    taskExists(taskId)
    onlyReviewer(taskOrg[taskId])
    returns (string memory status)
  {
    uint256 orgId = taskOrg[taskId];
    Task memory task = tasks[orgId][taskId];
    require(sbtToken.balanceOf(assignee) >= task.complexityScore, "Not enough reputation tokens");
    sbtToken.stake(assignee);
    task.assigneeAddress = assignee;
    task.status = TaskStatus.ASSIGNED;
    tasks[orgId][taskId] = task;
    status = getState(taskId);
    orgAssignees[task.orgId][assignee] += 1;
    emit Assignment(msg.sender, taskId);
  }

  /**
   * @dev Returns array with reviewer addresses, which confirmed task.
   * @param taskId Task ID.
   * @return _confirmations array of owner addresses.
   */
  function getConfirmations(uint256 taskId) public view returns (address[] memory _confirmations)
  {
    uint256 orgId = taskOrg[taskId];
    address[] memory reviewers = organization.getReviewers(orgId);
    address[] memory confirmationsTemp = new address[](reviewers.length);
    uint256 count = 0;
    uint256 i;
    for (i = 0; i < reviewers.length; i++)
      if (confirmations[taskId][reviewers[i]]) {
        confirmationsTemp[count] = reviewers[i];
        count += 1;
      }
    _confirmations = new address[](count);
    for (i = 0; i < count; i++) _confirmations[i] = confirmationsTemp[i];
  }

  /**
   * @dev Returns list of task IDs in defined range.
   * @param orgId Id of organization.
   * @param from Index start position of task array.
   * @param to Index end position of task array.
   * @param open Include open tasks.
   * @param assigned Include assigned tasks.
   * @param submitted Include submitted tasks.
   * @param closed Include closed tasks.
   * @return _taskIds array of task IDs.
   */
  function getTaskIds(
    uint256 orgId,
    uint256 from,
    uint256 to,
    bool open,
    bool assigned,
    bool submitted,
    bool closed
  ) public view returns (uint256[] memory _taskIds) {
    uint256 orgTaskTotal = orgTaskCount[orgId];
    uint256[] memory taskIdsTemp = new uint256[](orgTaskTotal);
    uint256 count = 0;
    uint256 i;
    for (i = 0; i < orgTaskTotal; i++) {
      uint256 taskId = orgTaskIds[orgId][i];
      Task memory task = tasks[orgId][taskId];
      if (
        (open && task.status == TaskStatus.OPEN) ||
        (assigned && task.status == TaskStatus.ASSIGNED) ||
        (submitted && task.status == TaskStatus.SUBMITTED) ||
        (closed && task.status == TaskStatus.CLOSED)
      ) {
        taskIdsTemp[count] = task.id;
        count += 1;
      }
    }
    _taskIds = new uint256[](to - from);
    for (i = from; i < to; i++)
      _taskIds[i - from] = taskIdsTemp[i];
  }

  /**
   * @dev Returns list of task IDs in defined range assigned to an address.
   * @param orgId Id of organization.
   * @param from Index start position of task array.
   * @param to Index end position of task array.
   * @param assigned Include assigned tasks.
   * @param submitted Include submitted tasks.
   * @param closed Include closed tasks.
   * @param assignee Assignee address.
   * @return _taskIds array of task IDs.
   */
  // function getTaskIdsByAssignee(
  //   uint256 orgId,
  //   uint256 from,
  //   uint256 to,
  //   bool assigned,
  //   bool submitted,
  //   bool closed,
  //   address assignee
  // ) public view notNull(assignee) returns (uint256[] memory _taskIds) {
  //   uint256 assignedCount = orgAssignees[orgId][msg.sender];
  //   uint256[] memory taskIdsTemp = new uint256[](assignedCount);
  //   uint256 count = 0;
  //   uint256 i;
  //   for (i = 0; i < orgTaskCount[orgId]; i++) {
  //     uint256 taskId = orgTaskIds[orgId][i];
  //     Task memory task = tasks[orgId][taskId];
  //     if (
  //       (task.assigneeAddress == assignee) &&
  //       (assigned && task.status == TaskStatus.ASSIGNED) ||
  //       (submitted && task.status == TaskStatus.SUBMITTED) ||
  //       (closed && task.status == TaskStatus.CLOSED)
  //     ) {
  //       taskIdsTemp[count] = task.id;
  //       count += 1;
  //     }
  //   }
  //   _taskIds = new uint256[](to - from);
  //   for (i = from; i < to; i++)
  //     _taskIds[i - from] = taskIdsTemp[i];
  // }
}
