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
  event RequirementChange(uint256 _orgId, uint required);

  mapping(uint256 => mapping(address => bool)) public isReviewer;
  mapping(uint256 => Org) public orgs;
  mapping(uint256 => bool) public _orgExists;
  uint256 public orgCount;

  struct Org {
    uint256 id;
    string name;
    string description;
    address adminAddress;
    address[] reviewers;
    uint256 requiredReviews;
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

  modifier onlyReviewer(uint256 _orgId) {
    require(isReviewer[_orgId][msg.sender], "Permission denied");
    _;
  }

  modifier reviewerDoesNotExist(uint256 _orgId, address _reviewer) {
    require(!isReviewer[_orgId][_reviewer], "Owner already exists");
    _;
  }

  modifier reviewerExists(uint256 _orgId, address _reviewer) {
    require(isReviewer[_orgId][_reviewer], "Owner does not exist");
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

  modifier validRequirement(uint256 _orgId, uint256 reviewerCount, uint256 _requiredReviews) {
    Org memory org = orgs[_orgId];
    if (_requiredReviews == 0) {
      _requiredReviews = org.requiredReviews;
    }
    uint256 count = org.reviewers.length + reviewerCount;
    require(
      _requiredReviews <= count &&
      _requiredReviews != 0 &&
      count != 0,
      "Invalid requirements"
    );
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
  /// @param requiredReviews Required reviews count.
  /// @return orgId organizaion ID.
  function createOrg(
    string memory name,
    string memory description,
    address[] memory reviewers,
    uint256 requiredReviews
  )
    public returns (uint256 orgId)
  {
    orgId = orgCount;
    orgs[orgId] = Org({
      id: orgId,
      name: name,
      description: description,
      reviewers: reviewers,
      requiredReviews: requiredReviews,
      adminAddress: msg.sender
    });
    orgCount += 1;
    _orgExists[orgId] = true;
    for (uint256 i = 0; i < reviewers.length; i++)
      isReviewer[orgId][reviewers[i]] = true;
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
    validRequirement(_orgId, 1, 0)
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
    if (org.requiredReviews > reviewers.length) changeRequirement(_orgId, reviewers.length);
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

  /// @dev Allows to change the number of required confirmations.
  /// @param _orgId Id of organization.
  /// @param _requiredReviews Number of required confirmations.
  function changeRequirement(uint256 _orgId, uint256 _requiredReviews)
    public
    onlyAdmin(_orgId)
    orgExists(_orgId)
    validRequirement(_orgId, 0, _requiredReviews)
  {
    Org storage org = orgs[_orgId];
    org.requiredReviews = _requiredReviews;
    emit RequirementChange(_orgId, _requiredReviews);
  }

  
  /// @dev Returns list of reviewers.
  /// @param _orgId Id of organization.
  /// @return List of reviewer addresses.
  function getReviewers(uint256 _orgId) public view orgExists(_orgId) returns (address[] memory) {
    Org memory org = orgs[_orgId];
    return org.reviewers;
  }

  /// @dev Returns required reviews count.
  /// @param _orgId Id of organization.
  /// @return Required reviews.
  function getRequiredReviewsCount(uint256 _orgId) public view orgExists(_orgId) returns (uint256) {
    Org memory org = orgs[_orgId];
    return org.requiredReviews;
  }

  
  /// @dev Returns if is reviewer.
  /// @param _orgId Id of organization.
  /// @param _address Address of reviewer.
  /// @return if is reviewer address.
  function isReviewerAddress(uint256 _orgId, address _address) public orgExists(_orgId) view returns (bool) {
    return isReviewer[_orgId][_address];
  }
}
