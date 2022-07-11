// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Organization.sol";

library ActionLib {
  enum ActionType { WITHDRAWAL, ADD_REVIEWER, ADD_APPROVER, ADD_SIGNER, REMOVE_REVIEWER, REMOVE_APPROVER, REMOVE_SIGNER }

  struct Action {
    uint256 id;
    uint256 orgId;
    address targetAddress;
    uint value;
    bytes data;
    bool executed;
    address tokenAddress;
    ActionType actionType;
  }
}

contract ActionContract {
  address private owner;
  Organization private organization;
  address private organizationAddress;

  event Creation(uint indexed orgId, uint indexed actionId);
  event Confirmation(uint indexed orgId, address indexed sender, uint256 indexed actionId);

  mapping(uint256 => ActionLib.Action) public actions;
  mapping(uint256 => bool) public _actionExists;
  mapping(uint256 => mapping(address => bool)) public confirmations;
  mapping(uint256 => uint256) public confirmationCount;
  uint256 public actionCount;
  mapping(uint256 => uint256) public orgActionCount;
  mapping(uint256 => uint256[]) public orgActionIds;
  mapping(uint256 => uint256) public actionOrg;
  
  modifier onlyOwner() {
    require(msg.sender == owner, "Permission denied");
    _;
  }

  modifier onlyOrgContract() {
    require(msg.sender == organizationAddress, "Permission denied");
    _;
  }

  modifier onlySigner(uint256 _orgId) {
    require(organization.isSignerAddress(_orgId, msg.sender), "Permission denied");
    _;
  }

  modifier orgExists(uint256 _orgId) {
    require(organization.doesOrgExists(_orgId), "Org does not exist");
    _;
  }

  modifier actionExists(uint256 _actionId) {
    require(_actionExists[_actionId], "Action does not exists");
    _;
  }

  modifier notNull(address _address) {
    require(_address != address(0), "Value should not be null");
    _;
  }

  /// @dev constructor.
  constructor(address _organizationAddress) {
    owner = msg.sender;
    organizationAddress = _organizationAddress;
    organization = Organization(_organizationAddress);
  }

  /// @dev Check if an organization exists.
  /// @param _orgId Id of organization.
  function createAction(
    uint256 _orgId,
    address targetAddress,
    uint value,
    address tokenAddress,
    ActionLib.ActionType actionType,
    bytes memory data
  ) external orgExists(_orgId) onlySigner(_orgId) returns (uint256 actionId) {
    require(actionType == ActionLib.ActionType.WITHDRAWAL, "Invalid action type");
    actionId = actionCount;
    actions[actionId] = ActionLib.Action({
      id: actionId,
      orgId: _orgId,
      targetAddress: targetAddress,
      value: value,
      data: data,
      executed: false,
      tokenAddress: tokenAddress,
      actionType: actionType
    });
    actionCount += 1;
    orgActionCount[_orgId] += 1;
    orgActionIds[_orgId].push(actionId);
    _actionExists[actionId] = true;
    emit Creation(_orgId, actionId);
  }

  /// @dev Check if an organization exists.
  /// @param _orgId Id of organization.
  function createAction(
    uint256 _orgId,
    address targetAddress,
    ActionLib.ActionType actionType,
    bytes memory data
  ) external orgExists(_orgId) onlySigner(_orgId) returns (uint256 actionId) {
    require(actionType != ActionLib.ActionType.WITHDRAWAL, "Invalid action type");
    actionId = actionCount;
    actions[actionId] = ActionLib.Action({
      id: actionId,
      orgId: _orgId,
      targetAddress: targetAddress,
      value: 0,
      data: data,
      executed: false,
      tokenAddress: address(0),
      actionType: actionType
    });
    actionCount += 1;
    orgActionCount[_orgId] += 1;
    orgActionIds[_orgId].push(actionId);
    _actionExists[actionId] = true;
    emit Creation(_orgId, actionId);
  }

  /// @dev Check if an organization exists.
  /// @param _actionId Id of organization.
  function confirmAction(uint256 _actionId)
    external
    actionExists(_actionId)
    onlySigner(actions[_actionId].orgId)
  {
    require(!actions[_actionId].executed, "Does not exist");
    require(!actions[_actionId].executed, "Already executed");
    require(!confirmations[_actionId][msg.sender], "Already confirmed");
    confirmations[_actionId][msg.sender] = true;
    confirmationCount[_actionId] += 1;
    emit Confirmation(actions[_actionId].orgId, msg.sender, _actionId);
  }

  /// @dev Check if an organization exists.
  /// @param _actionId Id of organization.
  function getAction(uint256 _actionId) external view actionExists(_actionId) returns (ActionLib.Action memory) {
    return actions[_actionId];
  }

  /// @dev Check if an organization exists.
  /// @param _actionId Id of organization.
  function doesActionExist(uint256 _actionId) external view returns (bool) {
    return _actionExists[_actionId];
  }

  /// @dev Check if an organization exists.
  /// @param _actionId Id of organization.
  function isActionExecuted(uint256 _actionId) external view actionExists(_actionId) returns (bool) {
    return actions[_actionId].executed;
  }

  /// @dev Check if an organization exists.
  /// @param _actionId Id of organization.
  function isActionConfirmed(uint256 _actionId) external view actionExists(_actionId) returns (bool) {
    return confirmationCount[_actionId] == organization.getOrganization(actions[_actionId].orgId).requiredConfirmations;
  }

  function executeAction(uint256 _actionId) external onlyOrgContract actionExists(_actionId) {
    actions[_actionId].executed = true;
  }
}
