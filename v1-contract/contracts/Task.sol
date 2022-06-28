// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./abstract/ReputationToken.sol";
import "./abstract/Organization.sol";
import "hardhat/console.sol";

contract TaskContract {
    
  uint256 public constant MAX_OWNER_COUNT = 50;
  SBTToken private sbtToken;
  Organization private organization;

  event Confirmation(address indexed sender, uint256 indexed taskId);
  event Revocation(address indexed sender, uint256 indexed taskId);
  event Creation(uint indexed taskId);
  event Assignment(address indexed sender, uint indexed taskId);
  event Submission(uint indexed taskId);
  event Closed(uint indexed taskId);

  mapping(uint256 => Task) public tasks;
  mapping(uint256 => bool) public _taskExists;
  mapping(uint256 => mapping(address => bool)) public confirmations;
  uint256 public taskCount;

  struct Task {
    uint256 id;
    string title;
    string description;
    address assigneeAddress;
    address taskTypeAddress;
    TaskStatus status;
    uint256 complexityScore;
  }

  enum TaskStatus { OPEN, ASSIGNED, SUBMITTED, CLOSED }

  modifier onlyReviewer() {
    require(organization.isReviewerAddress(msg.sender), "Permission denied");
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
    require(tasks[taskId].status != TaskStatus.CLOSED, "Task is not executed");
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
   * @param title Task title.
   * @param description Task title.
   * @param taskTypeAddress Task title.
   * @param complexityScore Task title.
   * @return taskId task ID.
   */
  function createTask(
    string memory title,
    string memory description,
    address taskTypeAddress,
    uint256 complexityScore
  ) public onlyReviewer returns (uint256 taskId) {
    taskId = addTask(title, description, taskTypeAddress, complexityScore);
  }

  /** 
   * @dev Allows a reviewer to confirm a task.
   * @param taskId Task ID.
   */
  function confirmTask(uint256 taskId)
    public
    onlyReviewer
    taskExists(taskId)
    notConfirmed(taskId)
  {
    require(tasks[taskId].status == TaskStatus.SUBMITTED, "Task is not submitted");
    confirmations[taskId][msg.sender] = true;
    emit Confirmation(msg.sender, taskId);
  }

  /**
   * @dev Allows a reviewer to revoke a confirmation for a task.
   * @param taskId Task ID.
   */
  function revokeConfirmation(uint256 taskId)
    public
    onlyReviewer
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
    onlyReviewer
    notClosed(taskId)
  {
    require(isConfirmed(taskId), "Insufficient confirmations");
    Task memory task = tasks[taskId];
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
    address[] memory reviewers = organization.getReviewers();
    uint256 requiredReviews = organization.requiredReviews();
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
    return tasks[taskId];
  }

  /**
   * @dev Allows assignee to submit task for review.
   * @param taskId Task ID.
   */
  function submitTask(uint256 taskId) public taskExists(taskId) {
    Task storage task  = tasks[taskId];
    require(task.assigneeAddress == msg.sender, "Task is not yours");
    task.status = TaskStatus.SUBMITTED;
    emit Submission(taskId);
  }

  /*
   * Internal functions
   */

  /**
   * @dev Adds a new task to the task mapping, if task does not exist yet.
   * @param title Task title.
   * @param description Task title.
   * @param taskTypeAddress Task title.
   * @param complexityScore Task title.
   * @return taskId task ID.
   */
  function addTask(
    string memory title,
    string memory description,
    address taskTypeAddress,
    uint256 complexityScore
  ) internal notNull(taskTypeAddress) onlyReviewer returns (uint256 taskId) {
    taskId = taskCount;
    tasks[taskId] = Task({
      id: taskId,
      title: title,
      description: description,
      taskTypeAddress: taskTypeAddress,
      complexityScore: complexityScore,
      assigneeAddress: address(0),
      status: TaskStatus.OPEN
    });
    taskCount += 1;
    _taskExists[taskId] = true;
    emit Creation(taskId);
  }

  /**
   * @dev Returns status of a task.
   * @param taskId TaskStatus enum.
   * @return state of a task.
   */
  function getState(uint256 taskId) public view taskExists(taskId) returns (string memory) {
    TaskStatus status = tasks[taskId].status;
    if (status == TaskStatus.OPEN) return "OPEN";
    if (status == TaskStatus.ASSIGNED) return "ASSIGNED";
    if (status == TaskStatus.SUBMITTED) return "SUBMITTED";
    if (status == TaskStatus.CLOSED) return "CLOSED";
    return "";
  }

  /*
    * Web3 call functions
  */

  /**
   * @dev Returns number of confirmations of a task.
   * @param taskId Task ID.
   * @return count Number of confirmations.
   */
  function getConfirmationCount(uint256 taskId) public view returns (uint256 count)
  {
    address[] memory reviewers = organization.getReviewers();
    for (uint256 i = 0; i < reviewers.length; i++)
      if (confirmations[taskId][reviewers[i]]) count += 1;
  }

  /**
   * @dev Returns total number of tasks after filers are applied.
   * @param pending Include pending tasks.
   * @param executed Include executed tasks.
   * @return count Total number of tasks after filters are applied.
   */
  function getTaskCount(bool pending, bool executed) public view returns (uint256 count)
  {
    for (uint256 i = 0; i < taskCount; i++)
      if (
        (pending && tasks[i].status != TaskStatus.CLOSED) ||
        (executed && tasks[i].status == TaskStatus.CLOSED)
      ) count += 1;
  }

  /**
   * @dev Allows assignees assign task to themselves.
   * @param taskId Task ID.
   * @return status Task updated status.
   */
  function assignSelf(uint256 taskId) public returns (string memory status) {
    Task storage task = tasks[taskId];
    require(sbtToken.balanceOf(msg.sender) >= task.complexityScore, "Not enough reputation tokens");
    sbtToken.stake(msg.sender);
    task.assigneeAddress = msg.sender;
    task.status = TaskStatus.ASSIGNED;
    status = getState(taskId);
    emit Assignment(msg.sender, taskId);
  }

  /**
   * @dev Allows a reviewer to assign task to an assignee.
   * @param taskId Task ID.
   * @return status Task updated status.
   */
  function assignOthers(address assignee, uint256 taskId) public onlyReviewer returns (string memory status) {
    Task storage task = tasks[taskId];
    require(sbtToken.balanceOf(assignee) >= task.complexityScore, "Not enough reputation tokens");
    sbtToken.stake(assignee);
    task.assigneeAddress = assignee;
    task.status = TaskStatus.ASSIGNED;
    status = getState(taskId);
    emit Assignment(msg.sender, taskId);
  }

  /**
   * @dev Returns array with reviewer addresses, which confirmed task.
   * @param taskId Task ID.
   * @return _confirmations array of owner addresses.
   */
  function getConfirmations(uint256 taskId) public view returns (address[] memory _confirmations)
  {
    address[] memory reviewers = organization.getReviewers();
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
   * @param from Index start position of task array.
   * @param to Index end position of task array.
   * @param open Include open tasks.
   * @param assigned Include assigned tasks.
   * @param submitted Include submitted tasks.
   * @param closed Include closed tasks.
   * @return _taskIds array of task IDs.
   */
  function getTaskIds(
    uint256 from,
    uint256 to,
    bool open,
    bool assigned,
    bool submitted,
    bool closed
  ) public view returns (uint256[] memory _taskIds) {
    uint256[] memory taskIdsTemp = new uint256[](taskCount);
    uint256 count = 0;
    uint256 i;
    for (i = 0; i < taskCount; i++)
      if (
        (open && tasks[i].status == TaskStatus.OPEN) ||
        (assigned && tasks[i].status == TaskStatus.ASSIGNED) ||
        (submitted && tasks[i].status == TaskStatus.SUBMITTED) ||
        (closed && tasks[i].status == TaskStatus.CLOSED)
      ) {
        taskIdsTemp[count] = i;
        count += 1;
      }
    _taskIds = new uint256[](to - from);
    for (i = from; i < to; i++)
        _taskIds[i - from] = taskIdsTemp[i];
  }

  /**
   * @dev Returns list of task IDs in defined range assigned to an address.
   * @param from Index start position of task array.
   * @param to Index end position of task array.
   * @param open Include open tasks.
   * @param assigned Include assigned tasks.
   * @param submitted Include submitted tasks.
   * @param closed Include closed tasks.
   * @param assignee Assignee address.
   * @return _taskIds array of task IDs.
   */
  function getTaskIdsByAssignee(
    uint256 from,
    uint256 to,
    bool open,
    bool assigned,
    bool submitted,
    bool closed,
    address assignee
  ) public view notNull(assignee) returns (uint256[] memory _taskIds) {
    uint256[] memory taskIdsTemp = new uint256[](taskCount);
    uint256 count = 0;
    uint256 i;
    for (i = 0; i < taskCount; i++)
      if (
        (tasks[i].assigneeAddress == assignee) &&
        (open && tasks[i].status == TaskStatus.OPEN) ||
        (assigned && tasks[i].status == TaskStatus.ASSIGNED) ||
        (submitted && tasks[i].status == TaskStatus.SUBMITTED) ||
        (closed && tasks[i].status == TaskStatus.CLOSED)
      ) {
        taskIdsTemp[count] = i;
        count += 1;
      }
    _taskIds = new uint256[](to - from);
    for (i = from; i < to; i++)
      _taskIds[i - from] = taskIdsTemp[i];
  }
}
