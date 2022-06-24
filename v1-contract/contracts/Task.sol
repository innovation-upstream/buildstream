// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ReputationToken.sol";
import "hardhat/console.sol";

contract TaskContract {
    
  uint256 public constant MAX_OWNER_COUNT = 50;
  SBTToken private sbtToken;

  event Confirmation(address indexed sender, uint256 indexed taskId);
  event Revocation(address indexed sender, uint256 indexed taskId);
  event Creation(uint indexed taskId);
  event Submission(uint indexed taskId);
  event Closed(uint indexed taskId);
  event ExecutionFailure(uint indexed taskId);
  event Deposit(address indexed sender, uint value);
  event OwnerAddition(address indexed owner);
  event OwnerRemoval(address indexed owner);
  event RequirementChange(uint required);

  mapping(uint256 => Task) public tasks;
  mapping(uint256 => bool) public _taskExists;
  mapping(uint256 => mapping(address => bool)) public confirmations;
  mapping(address => bool) public isOwner;
  address[] public owners;
  uint256 public required;
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

  modifier onlyWallet() {
    require(msg.sender == address(this), "Permission denied");
    _;
  }

  modifier ownerDoesNotExist(address owner) {
    require(!isOwner[owner], "Owner already exists");
    _;
  }

  modifier ownerExists(address owner) {
    require(isOwner[owner], "Owner does not exist");
    _;
  }

  modifier taskExists(uint256 taskId) {
    require(_taskExists[taskId], "Task does not exist");
    _;
  }

  modifier confirmed(uint256 taskId, address owner) {
    require(confirmations[taskId][owner], "Task has not been confirmed");
    _;
  }

  modifier notConfirmed(uint256 taskId, address owner) {
    require(!confirmations[taskId][owner], "Task is already confirmed");
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

  modifier validRequirement(uint256 ownerCount, uint256 _required) {
    require(
      ownerCount < MAX_OWNER_COUNT &&
      _required < ownerCount &&
      _required != 0 &&
      ownerCount != 0,
      "Invalid requirements"
    );
    _;
  }

  /** 
   * @dev param _owners List of initial owners.
   * @param _required Number of required confirmations.
   * @param _owners constructor sets initial owners and required number of confirmations.
   * @param tokenAddress Reputation token address.
   */
  constructor(address[] memory _owners, uint256 _required, address tokenAddress) {
    for (uint256 i = 0; i < _owners.length; i++) {
      require(!isOwner[_owners[i]] || _owners[i] != address(0), "Invalid address provided");
      isOwner[_owners[i]] = true;
    }
    owners = _owners;
    required = _required;
    sbtToken = SBTToken(tokenAddress);
  }


  /*
   * Public functions
   */

  /** 
   * @dev Allows to add a new owner. Task has to be sent by wallet.
   * @param owner Address of new owner.
   */
  function addOwner(address owner)
    public
    onlyWallet
    ownerDoesNotExist(owner)
    notNull(owner)
    validRequirement(owners.length + 1, required)
  {
    isOwner[owner] = true;
    owners.push(owner);
    emit OwnerAddition(owner);
  }

  /** 
   * @dev Allows to remove an owner. Task has to be sent by wallet.
   * @param owner Address of owner.
   */
  function removeOwner(address owner) public onlyWallet ownerExists(owner) {
    isOwner[owner] = false;
    for (uint256 i = 0; i < owners.length - 1; i++)
      if (owners[i] == owner) {
        owners[i] = owners[owners.length - 1];
        break;
      }
    if (required > owners.length) changeRequirement(owners.length);
    emit OwnerRemoval(owner);
  }

  /** 
   * @dev Allows to replace an owner with a new owner. Task has to be sent by wallet.
   * @param owner Address of owner to be replaced.
   * @param newOwner Address of new owner.
   */
  function replaceOwner(address owner, address newOwner)
    public
    onlyWallet
    ownerExists(owner)
    ownerDoesNotExist(newOwner)
  {
    for (uint256 i = 0; i < owners.length; i++)
      if (owners[i] == owner) {
        owners[i] = newOwner;
        break;
      }
    isOwner[owner] = false;
    isOwner[newOwner] = true;
    emit OwnerRemoval(owner);
    emit OwnerAddition(newOwner);
  }

  /** 
   * @dev Allows to change the number of required confirmations. Task has to be sent by wallet.
   * @param _required Number of required confirmations.
   */
  function changeRequirement(uint256 _required)
    public
    onlyWallet
    validRequirement(owners.length, _required)
  {
    required = _required;
    emit RequirementChange(_required);
  }

  /** 
   * @dev Allows an owner to submit and confirm a task.
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
  ) public returns (uint256 taskId) {
    taskId = addTask(title, description, taskTypeAddress, complexityScore);
  }

  /** 
   * @dev Allows an owner to confirm a task.
   * @param taskId Task ID.
   */
  function confirmTask(uint256 taskId)
    public
    ownerExists(msg.sender)
    taskExists(taskId)
    notConfirmed(taskId, msg.sender)
  {
    require(tasks[taskId].status == TaskStatus.SUBMITTED, "Task is not submitted");
    confirmations[taskId][msg.sender] = true;
    emit Confirmation(msg.sender, taskId);
  }

  /**
   * @dev Allows an owner to revoke a confirmation for a task.
   * @param taskId Task ID.
   */
  function revokeConfirmation(uint256 taskId)
    public
    ownerExists(msg.sender)
    confirmed(taskId, msg.sender)
    notClosed(taskId)
  {
    confirmations[taskId][msg.sender] = false;
    emit Revocation(msg.sender, taskId);
  }

  /**
   * @dev Allows anyone to execute a confirmed task.
   * @param taskId Task ID.
   */
  function closeTask(uint256 taskId)
    public
    ownerExists(msg.sender)
    notClosed(taskId)
  {
    require(isConfirmed(taskId), "Insufficient confirmations");
    Task memory task = tasks[taskId];
    sbtToken.reward(task.assigneeAddress, task.complexityScore);
    task.status = TaskStatus.CLOSED;
    if (tasks[taskId].status == TaskStatus.CLOSED)
      emit Closed(taskId);
    else {
      emit ExecutionFailure(taskId);
    }
  }

  /**
   * @dev Returns the confirmation status of a task.
   * @param taskId Task ID.
   * @return confirmationStatus Confirmation status.
   */
  function isConfirmed(uint256 taskId) public view returns (bool confirmationStatus) {
    uint256 count = 0;
    confirmationStatus = false;
    for (uint256 i = 0; i < owners.length; i++) {
      if (confirmations[taskId][owners[i]]) count += 1;
      if (count == required) confirmationStatus = true;
    }
  }

  /**
   * @dev Returns task.
   * @param taskId Task ID.
   * @return task.
   */
  function getTask(uint256 taskId) public taskExists(taskId) view returns (Task memory) {
    return tasks[taskId];
  }

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
  ) internal notNull(taskTypeAddress) ownerExists(msg.sender) returns (uint256 taskId) {
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
    for (uint256 i = 0; i < owners.length; i++)
      if (confirmations[taskId][owners[i]]) count += 1;
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
   * @dev Assign task to sender.
   * @param taskId Task ID.
   * @return status Task updated status.
   */
  function assignSelf(uint256 taskId) public returns (string memory status) {
    Task storage task = tasks[taskId];
    require(sbtToken.balanceOf(msg.sender) >= task.complexityScore, "Not enough reputation tokens");
    task.assigneeAddress = msg.sender;
    task.status = TaskStatus.ASSIGNED;
    status = getState(taskId);
  }

  /**
   * @dev Returns list of owners.
   * @return List of owner addresses.
   */
  function getOwners() public view returns (address[] memory) {
    return owners;
  }

  /**
   * @dev Returns array with owner addresses, which confirmed task.
   * @param taskId Task ID.
   * @return _confirmations array of owner addresses.
   */
  function getConfirmations(uint256 taskId) public view returns (address[] memory _confirmations)
  {
    address[] memory confirmationsTemp = new address[](owners.length);
    uint256 count = 0;
    uint256 i;
    for (i = 0; i < owners.length; i++)
      if (confirmations[taskId][owners[i]]) {
        confirmationsTemp[count] = owners[i];
        count += 1;
      }
    _confirmations = new address[](count);
    for (i = 0; i < count; i++) _confirmations[i] = confirmationsTemp[i];
  }

  /**
   * @dev Returns list of task IDs in defined range.
   * @param from Index start position of task array.
   * @param to Index end position of task array.
   * @param pending Include pending tasks.
   * @param executed Include executed tasks.
   * @return _taskIds array of task IDs.
   */
  function getTaskIds(
    uint256 from,
    uint256 to,
    bool pending,
    bool executed
  ) public view returns (uint256[] memory _taskIds) {
    uint256[] memory taskIdsTemp = new uint256[](taskCount);
    uint256 count = 0;
    uint256 i;
    for (i = 0; i < taskCount; i++)
      if (
        (pending && tasks[i].status != TaskStatus.CLOSED) ||
        (executed && tasks[i].status == TaskStatus.CLOSED)
      ) {
        taskIdsTemp[count] = i;
        count += 1;
      }
    _taskIds = new uint256[](to - from);
    for (i = from; i < to; i++)
        _taskIds[i - from] = taskIdsTemp[i];
  }

  /**
   * @dev Returns list of task IDs in defined range.
   * @param from Index start position of task array.
   * @param to Index end position of task array.
   * @param pending Include pending tasks.
   * @param executed Include executed tasks.
   * @return _taskIds array of task IDs.
   */
  function getTaskIdsByAssignee(
    uint256 from,
    uint256 to,
    bool pending,
    bool executed,
    address assignee
  ) public view notNull(assignee) returns (uint256[] memory _taskIds) {
    uint256[] memory taskIdsTemp = new uint256[](taskCount);
    uint256 count = 0;
    uint256 i;
    for (i = 0; i < taskCount; i++)
      if (
        (tasks[i].assigneeAddress == assignee) &&
        ((pending && tasks[i].status != TaskStatus.CLOSED) ||
        (executed && tasks[i].status == TaskStatus.CLOSED))
      ) {
        taskIdsTemp[count] = i;
        count += 1;
      }
    _taskIds = new uint256[](to - from);
    for (i = from; i < to; i++)
      _taskIds[i - from] = taskIdsTemp[i];
  }
}
