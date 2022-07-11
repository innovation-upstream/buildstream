// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./ReputationToken.sol";
import "./Task.sol";
import "./Action.sol";
import "./Treasury.sol";

library OrgLib {
  struct Org {
    uint256 id;
    string name;
    string description;
    address[] reviewers;
    address[] approvers;
    address[] signers;
    uint256 requiredConfirmations;
    uint256 rewardMultiplier;
    address rewardToken;
  }
}
contract Organization {
  address private owner;
  ActionContract private actionContract;
  Treasury private treasury;

  event Creation(uint indexed taskId);
  event ReviewerAddition(uint256 _orgId, address indexed _reviewer);
  event ReviewerRemoval(uint256 _orgId, address indexed _reviewer);
  event ApproverAddition(uint256 _orgId, address indexed _approver);
  event ApproverRemoval(uint256 _orgId, address indexed _approver);
  event SignerAddition(uint256 _orgId, address indexed _signer);
  event SignerRemoval(uint256 _orgId, address indexed _signer);
  event RequirementChange(uint256 _orgId, uint required);
  event Confirmation(address indexed sender, uint256 indexed taskId);

  mapping(uint256 => mapping(address => bool)) public isReviewer;
  mapping(uint256 => mapping(address => bool)) public isApprover;
  mapping(uint256 => mapping(address => bool)) public isSigner;
  mapping(uint256 => OrgLib.Org) public orgs;
  mapping(uint256 => bool) public _orgExists;
  uint256 public orgCount;
  
  modifier onlyOwner() {
    require(msg.sender == owner, "Permission denied");
    _;
  }

  modifier onlySigner(uint256 _orgId) {
    require(isSigner[_orgId][msg.sender], "Permission denied");
    _;
  }

  modifier orgExists(uint256 _orgId) {
    require(_orgExists[_orgId], "Organization not exist");
    _;
  }

  modifier actionExists(uint256 _actionId) {
    require(actionContract.doesActionExist(_actionId), "Action does not exist");
    _;
  }

  modifier notExecuted(uint256 _actionId) {
    require(!actionContract.isActionExecuted(_actionId), "Action is executed");
    _;
  }

  modifier notNull(address _address) {
    require(_address != address(0), "Value should not be null");
    _;
  }

  /// @dev constructor.
  constructor() {
    owner = msg.sender;
  }

  function updateActionContract(address _address) external onlyOwner {
    actionContract = ActionContract(_address);
  }

  function updateTreasuryContract(address _address) external onlyOwner {
    treasury = Treasury(_address);
  }

  /// @dev Allows to add a new organization.
  /// @param name Organization name.
  /// @param description Organization description.
  /// @param reviewers List of reviewers.
  /// @param approvers List of approvers.
  /// @return orgId organizaion ID.
  function createOrg(
    string memory name,
    string memory description,
    uint256 rewardMultiplier,
    address rewardToken,
    address[] memory reviewers,
    address[] memory approvers,
    address[] memory signers,
    uint256 requiredConfirmations
  ) external returns (uint256 orgId) {
    require(reviewers.length > 0 && approvers.length > 0, "approvers or reviewers is empty");
    orgId = orgCount;
    address[] memory _signers = new address[](signers.length + 1);
    uint256 i;
    bool found = false;
    for (i = 0; i < signers.length; i++) {
      _signers[i] = signers[i];
      isSigner[orgId][_signers[i]] = true;
      if (msg.sender == signers[i]) {
        found = true;
      }
      if (i == signers.length - 1 && msg.sender != signers[i] && !found) {
        _signers[i + 1] = msg.sender;
        isSigner[orgId][msg.sender] = true;
      }
    }
    orgs[orgId] = OrgLib.Org({
      id: orgId,
      name: name,
      description: description,
      rewardToken: rewardToken,
      reviewers: reviewers,
      approvers: approvers,
      signers: found ? signers : _signers,
      rewardMultiplier: rewardMultiplier,
      requiredConfirmations: requiredConfirmations
    });
    orgCount += 1;
    _orgExists[orgId] = true;
    for (i = 0; i < reviewers.length; i++)
      isReviewer[orgId][reviewers[i]] = true;
    for (i = 0; i < approvers.length; i++)
      isApprover[orgId][approvers[i]] = true;
    emit Creation(orgId);
  }

  /// @dev Get organization.
  /// @param _orgId Id of organization.
  function getOrganization(uint256 _orgId) external view orgExists(_orgId) returns (OrgLib.Org memory org) {
    return orgs[_orgId];
  }

  /// @dev Returns org count.
  /// @return Organization count.
  function getOrgCount() public view returns (uint256) {
    return orgCount;
  }

  /// @dev Returns list of organization IDs in defined range.
  /// @param from Index start position of task array.
  /// @param to Index end position of task array.
  /// @return _orgIds array of organization IDs.
  function getOrgIds(uint256 from, uint256 to) external view returns (uint256[] memory _orgIds) {
    uint256[] memory orgIdsTemp = new uint256[](orgCount);
    uint256 count = 0;
    uint256 i;
    for (i = 0; i < orgCount; i++) {
      orgIdsTemp[count] = i;
      count += 1;
    }
    _orgIds = new uint256[](to - from);
    for (i = from; i < to; i++)
      _orgIds[i - from] = orgIdsTemp[i];
  }

  /// @dev Check if an organization exists.
  /// @param _orgId Id of organization.
  function doesOrgExists(uint256 _orgId) external view returns (bool) {
    return _orgExists[_orgId];
  }

  /// @dev Check if an organization exists.
  /// @param _actionId Id of organization.
  function executeAction(uint256 _actionId)
    external
    actionExists(_actionId)
    notExecuted(_actionId)
  {
    require(actionContract.isActionConfirmed(_actionId), "Insufficient confirmations");
    ActionLib.Action memory action = actionContract.getAction(_actionId);
    require(isSigner[action.orgId][msg.sender], "Permission denied");
    actionContract.executeAction(_actionId);

    if (action.actionType == ActionLib.ActionType.ADD_APPROVER)
      addApprover(action.orgId, action.targetAddress);

    if (action.actionType == ActionLib.ActionType.REMOVE_APPROVER)
      removeApprover(action.orgId, action.targetAddress);

    if (action.actionType == ActionLib.ActionType.ADD_REVIEWER)
      addReviewer(action.orgId, action.targetAddress);

    if (action.actionType == ActionLib.ActionType.REMOVE_REVIEWER)
      removeReviewer(action.orgId, action.targetAddress);

    if (action.actionType == ActionLib.ActionType.ADD_SIGNER)
      addSigner(action.orgId, action.targetAddress);

    if (action.actionType == ActionLib.ActionType.REMOVE_SIGNER)
      removeSigner(action.orgId, action.targetAddress);
    
    if (action.actionType == ActionLib.ActionType.WITHDRAWAL)
      withdraw(_actionId);
  }

  function withdraw(uint256 _actionId) internal {
    ActionLib.Action memory action = actionContract.getAction(_actionId);
    if (action.tokenAddress == address(0))
      treasury.withdrawForce(_actionId, action.orgId, action.targetAddress, action.value);
    else
      treasury.withdrawForce(_actionId, action.orgId, action.targetAddress, action.tokenAddress, action.value);
  }

  /// @dev Allows to add a new reviewer.
  /// @param _orgId Id of organization.
  /// @param _reviewer Address of new reviewer.
  function addReviewer(uint256 _orgId, address _reviewer) internal {
    require(!isReviewer[_orgId][_reviewer], "Reviewer exists");
    isReviewer[_orgId][_reviewer] = true;
    orgs[_orgId].reviewers.push(_reviewer);
    emit ReviewerAddition(_orgId, _reviewer);
  }

  /// @dev Allows to remove an reviewer.
  /// @param _orgId Id of organization.
  /// @param _reviewer Address of reviewer.
  function removeReviewer(uint256 _orgId, address _reviewer) internal {
    require(isReviewer[_orgId][_reviewer], "Reviewer not exist");
    require(orgs[_orgId].reviewers.length > 1, "reviewers must not be empty");
    isReviewer[_orgId][_reviewer] = false;
    OrgLib.Org storage org = orgs[_orgId];
    address[] memory reviewers = org.reviewers;
    for (uint256 i = 0; i < reviewers.length - 1; i++)
      if (reviewers[i] == _reviewer) {
        uint256 index = i == reviewers.length - 1 ? reviewers.length - 2 : reviewers.length - 1;
        reviewers[i] = reviewers[index];
        break;
      }
    org.reviewers = reviewers;
    emit ReviewerRemoval(_orgId, _reviewer);
  }
  
  /// @dev Returns list of reviewers.
  /// @param _orgId Id of organization.
  /// @return List of reviewer addresses.
  function getReviewers(uint256 _orgId) external view orgExists(_orgId) returns (address[] memory) {
    return orgs[_orgId].reviewers;
  }
  
  /// @dev Returns if is reviewer.
  /// @param _orgId Id of organization.
  /// @param _address Address of reviewer.
  /// @return if is reviewer address.
  function isReviewerAddress(uint256 _orgId, address _address) external orgExists(_orgId) view returns (bool) {
    return isReviewer[_orgId][_address];
  }

  /// @dev Allows to add a new reviewer.
  /// @param _orgId Id of organization.
  /// @param _approver Address of new approver.
  function addApprover(uint256 _orgId, address _approver) internal {
    require(!isApprover[_orgId][_approver], "Approver exists");
    isApprover[_orgId][_approver] = true;
    orgs[_orgId].approvers.push(_approver);
    emit ApproverAddition(_orgId, _approver);
  }

  /// @dev Allows to remove an approver.
  /// @param _orgId Id of organization.
  /// @param _approver Address of approver.
  function removeApprover(uint256 _orgId, address _approver) internal {
    require(isApprover[_orgId][_approver], "Approver not exist");
    require(orgs[_orgId].approvers.length > 1, "approvers must not be empty");
    isApprover[_orgId][_approver] = false;
    OrgLib.Org storage org = orgs[_orgId];
    address[] memory approvers = org.approvers;
    for (uint256 i = 0; i < approvers.length; i++)
      if (approvers[i] == _approver) {
        uint256 index = i == approvers.length - 1 ? approvers.length - 2 : approvers.length - 1;
        approvers[i] = approvers[index];
        break;
      }
    org.approvers = approvers;
    emit ApproverRemoval(_orgId, _approver);
  }
  
  /// @dev Returns list of approvers.
  /// @param _orgId Id of organization.
  /// @return List of approver addresses.
  function getApprovers(uint256 _orgId) external view orgExists(_orgId) returns (address[] memory) {
    return orgs[_orgId].approvers;
  }
  
  /// @dev Returns if is approver.
  /// @param _orgId Id of organization.
  /// @param _address Address of approver.
  /// @return if is approver address.
  function isApproverAddress(uint256 _orgId, address _address) external orgExists(_orgId) view returns (bool) {
    return isApprover[_orgId][_address];
  }

  /// @dev Allows to add a new signer.
  /// @param _orgId Id of organization.
  /// @param _signer Address of new signer.
  function addSigner(uint256 _orgId, address _signer) internal {
    require(!isSigner[_orgId][_signer], "Signer exists");
    isSigner[_orgId][_signer] = true;
    orgs[_orgId].signers.push(_signer);
    emit SignerAddition(_orgId, _signer);
  }

  /// @dev Allows to remove an signer.
  /// @param _orgId Id of organization.
  /// @param _signer Address of signer.
  function removeSigner(uint256 _orgId, address _signer) internal {
    require(isSigner[_orgId][_signer], "Signer not exist");
    require(orgs[_orgId].signers.length > 1, "signers must not be empty");
    isSigner[_orgId][_signer] = false;
    OrgLib.Org storage org = orgs[_orgId];
    address[] memory signers = org.signers;
    for (uint256 i = 0; i < signers.length; i++)
      if (signers[i] == _signer) {
        uint256 index = i == signers.length - 1 ? signers.length - 2 : signers.length - 1;
        signers[i] = signers[index];
        break;
      }
    org.signers = signers;
    emit SignerRemoval(_orgId, _signer);
  }
  
  /// @dev Returns list of signers.
  /// @param _orgId Id of organization.
  /// @return List of signer addresses.
  function getSigners(uint256 _orgId) external view orgExists(_orgId) returns (address[] memory) {
    return orgs[_orgId].signers;
  }
  
  /// @dev Returns if is signer.
  /// @param _orgId Id of organization.
  /// @param _address Address of signer.
  /// @return if is signer address.
  function isSignerAddress(uint256 _orgId, address _address) external orgExists(_orgId) view returns (bool) {
    return isSigner[_orgId][_address];
  }
}
