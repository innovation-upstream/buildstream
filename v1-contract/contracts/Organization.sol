// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./ReputationToken.sol";
import "./Task.sol";

contract Organization {
  address private owner;

  event Creation(uint indexed taskId);
  event ReviewerAddition(uint256 _orgId, address indexed _reviewer);
  event ReviewerRemoval(uint256 _orgId, address indexed _reviewer);
  event ApproverAddition(uint256 _orgId, address indexed _approver);
  event ApproverRemoval(uint256 _orgId, address indexed _approver);
  event RequirementChange(uint256 _orgId, uint required);

  mapping(uint256 => mapping(address => bool)) public isReviewer;
  mapping(uint256 => mapping(address => bool)) public isApprover;
  mapping(uint256 => Org) public orgs;
  mapping(uint256 => bool) public _orgExists;
  uint256 public orgCount;

  struct Org {
    uint256 id;
    string name;
    string description;
    address adminAddress;
    address[] reviewers;
    address[] approvers;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "Permission denied");
    _;
  }

  modifier onlyAdmin(uint256 _orgId) {
    Org memory org = orgs[_orgId];
    require(msg.sender == org.adminAddress, "Permission denied");
    _;
  }

  modifier reviewerDoesNotExist(uint256 _orgId, address _reviewer) {
    require(!isReviewer[_orgId][_reviewer], "Reviewer already exists");
    _;
  }

  modifier reviewerExists(uint256 _orgId, address _reviewer) {
    require(isReviewer[_orgId][_reviewer], "Reviewer does not exist");
    _;
  }

  modifier approverDoesNotExist(uint256 _orgId, address _approver) {
    require(!isApprover[_orgId][_approver], "Approver already exists");
    _;
  }

  modifier approverExists(uint256 _orgId, address _approver) {
    require(isApprover[_orgId][_approver], "Approver does not exist");
    _;
  }

  modifier orgExists(uint256 _orgId) {
    require(_orgExists[_orgId], "Org does not exist");
    _;
  }

  modifier orgDoesNotExists(uint256 _orgId) {
    require(!_orgExists[_orgId], "Org does not exist");
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

  /// @dev Allows to add a new organization.
  /// @param name Organization name.
  /// @param description Organization description.
  /// @param reviewers List of reviewers.
  /// @param approvers List of approvers.
  /// @return orgId organizaion ID.
  function createOrg(
    string memory name,
    string memory description,
    address[] memory reviewers,
    address[] memory approvers
  )
    public returns (uint256 orgId)
  {
    orgId = orgCount;
    orgs[orgId] = Org({
      id: orgId,
      name: name,
      description: description,
      reviewers: reviewers,
      approvers: approvers,
      adminAddress: msg.sender
    });
    orgCount += 1;
    _orgExists[orgId] = true;
    for (uint256 i = 0; i < reviewers.length; i++)
      isReviewer[orgId][reviewers[i]] = true;
    for (uint256 i = 0; i < approvers.length; i++)
      isApprover[orgId][approvers[i]] = true;
    emit Creation(orgId);
  }

  /// @dev Get organization.
  /// @param _orgId Id of organization.
  function getOrganization(uint256 _orgId) public view orgExists(_orgId) returns (Org memory org) {
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
  function getOrgIds(uint256 from, uint256 to) public view returns (uint256[] memory _orgIds) {
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
  function doesOrgExists(uint256 _orgId) public view returns (bool) {
    return _orgExists[_orgId];
  }

  /// @dev Allows to add a new reviewer.
  /// @param _orgId Id of organization.
  /// @param _reviewer Address of new reviewer.
  function addReviewer(uint256 _orgId, address _reviewer)
    public
    orgExists(_orgId)
    onlyAdmin(_orgId)
    reviewerDoesNotExist(_orgId, _reviewer)
    notNull(_reviewer)
  {
    isReviewer[_orgId][_reviewer] = true;
    Org storage org = orgs[_orgId];
    org.reviewers.push(_reviewer);
    emit ReviewerAddition(_orgId, _reviewer);
  }

  /// @dev Allows to remove an reviewer.
  /// @param _orgId Id of organization.
  /// @param _reviewer Address of reviewer.
  function removeReviewer(uint256 _orgId, address _reviewer)
    public
    orgExists(_orgId)
    onlyAdmin(_orgId)
    reviewerExists(_orgId, _reviewer)
  {
    isReviewer[_orgId][_reviewer] = false;
    Org storage org = orgs[_orgId];
    address[] memory reviewers = org.reviewers;
    for (uint256 i = 0; i < reviewers.length - 1; i++)
      if (reviewers[i] == _reviewer) {
        reviewers[i] = reviewers[reviewers.length - 1];
        break;
      }
    org.reviewers = reviewers;
    emit ReviewerRemoval(_orgId, _reviewer);
  }

  /// @dev Allows to replace an reviewer with a new reviewer.
  /// @param _orgId Id of organization.
  /// @param _reviewer Address of reviewer to be replaced.
  /// @param newReviewer Address of new reviewer.
  function replaceReviewer(uint256 _orgId, address _reviewer, address newReviewer)
    public
    orgExists(_orgId)
    onlyAdmin(_orgId)
    reviewerExists(_orgId, _reviewer)
    reviewerDoesNotExist(_orgId, newReviewer)
  {
    Org storage org = orgs[_orgId];
    address[] memory reviewers = org.reviewers;
    for (uint256 i = 0; i < reviewers.length; i++)
      if (reviewers[i] == _reviewer) {
        reviewers[i] = newReviewer;
        break;
      }
    org.reviewers = reviewers;
    isReviewer[_orgId][_reviewer] = false;
    isReviewer[_orgId][newReviewer] = true;
    emit ReviewerRemoval(_orgId, _reviewer);
    emit ReviewerAddition(_orgId, newReviewer);
  }
  
  /// @dev Returns list of reviewers.
  /// @param _orgId Id of organization.
  /// @return List of reviewer addresses.
  function getReviewers(uint256 _orgId) public view orgExists(_orgId) returns (address[] memory) {
    Org memory org = orgs[_orgId];
    return org.reviewers;
  }
  
  /// @dev Returns if is reviewer.
  /// @param _orgId Id of organization.
  /// @param _address Address of reviewer.
  /// @return if is reviewer address.
  function isReviewerAddress(uint256 _orgId, address _address) public orgExists(_orgId) view returns (bool) {
    return isReviewer[_orgId][_address];
  }

  /// @dev Allows to add a new reviewer.
  /// @param _orgId Id of organization.
  /// @param _approver Address of new approver.
  function addApprover(uint256 _orgId, address _approver)
    public
    orgExists(_orgId)
    onlyAdmin(_orgId)
    approverDoesNotExist(_orgId, _approver)
    notNull(_approver)
  {
    isApprover[_orgId][_approver] = true;
    Org storage org = orgs[_orgId];
    org.approvers.push(_approver);
    emit ApproverAddition(_orgId, _approver);
  }

  /// @dev Allows to remove an approver.
  /// @param _orgId Id of organization.
  /// @param _approver Address of approver.
  function removeApprover(uint256 _orgId, address _approver)
    public
    orgExists(_orgId)
    onlyAdmin(_orgId)
    approverExists(_orgId, _approver)
  {
    isApprover[_orgId][_approver] = false;
    Org storage org = orgs[_orgId];
    address[] memory approvers = org.approvers;
    for (uint256 i = 0; i < approvers.length - 1; i++)
      if (approvers[i] == _approver) {
        approvers[i] = approvers[approvers.length - 1];
        break;
      }
    org.approvers = approvers;
    emit ApproverRemoval(_orgId, _approver);
  }

  /// @dev Allows to replace an approver with a new approver.
  /// @param _orgId Id of organization.
  /// @param _approver Address of approver to be replaced.
  /// @param newApprover Address of new approver.
  function replaceApprover(uint256 _orgId, address _approver, address newApprover)
    public
    orgExists(_orgId)
    onlyAdmin(_orgId)
    approverExists(_orgId, _approver)
    approverDoesNotExist(_orgId, newApprover)
  {
    Org storage org = orgs[_orgId];
    address[] memory approvers = org.approvers;
    for (uint256 i = 0; i < approvers.length; i++)
      if (approvers[i] == _approver) {
        approvers[i] = newApprover;
        break;
      }
    org.approvers = approvers;
    isApprover[_orgId][_approver] = false;
    isApprover[_orgId][newApprover] = true;
    emit ApproverRemoval(_orgId, _approver);
    emit ApproverAddition(_orgId, newApprover);
  }
  
  /// @dev Returns list of approvers.
  /// @param _orgId Id of organization.
  /// @return List of approver addresses.
  function getApprovers(uint256 _orgId) public view orgExists(_orgId) returns (address[] memory) {
    Org memory org = orgs[_orgId];
    return org.approvers;
  }
  
  /// @dev Returns if is approver.
  /// @param _orgId Id of organization.
  /// @param _address Address of approver.
  /// @return if is approver address.
  function isApproverAddress(uint256 _orgId, address _address) public orgExists(_orgId) view returns (bool) {
    return isApprover[_orgId][_address];
  }
}
