// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";
import "./ReputationToken.sol";
import "../Task.sol";

abstract contract Organization {
  address private owner;
  SBTToken private sbtToken;
  TaskContract private taskContract;

  function getOrganizationName() virtual public pure returns (string memory name);
  event ReviewerAddition(address indexed _reviewer);
  event ReviewerRemoval(address indexed _reviewer);
  event RequirementChange(uint required);

  address private taskContractAddress;
  mapping(address => bool) public isReviewer;
  address[] public reviewers;
  uint256 public requiredReviews;

  modifier onlyOwner() {
    require(msg.sender == owner, "Permission denied");
    _;
  }

  modifier onlyReviewer() {
    require(isReviewer[msg.sender], "Permission denied");
    _;
  }

  modifier onlyTaskContract() {
    require(msg.sender == taskContractAddress, "Permission denied");
    _;
  }

  modifier reviewerDoesNotExist(address _reviewer) {
    require(!isReviewer[_reviewer], "Owner already exists");
    _;
  }

  modifier reviewerExists(address _reviewer) {
    require(isReviewer[_reviewer], "Owner does not exist");
    _;
  }

  modifier notNull(address _address) {
    require(_address != address(0), "Value should not be null");
    _;
  }

  modifier validRequirement(uint256 reviewerCount, uint256 _requiredReviews) {
    require(
      _requiredReviews < reviewerCount &&
      _requiredReviews != 0 &&
      reviewerCount != 0,
      "Invalid requirements"
    );
    _;
  }

  /**
   * @dev constructor sets initial reviewers and required number of confirmations.
   * @param _reviewers List of initial reviewers.
   * @param _requiredReviews Number of required confirmations.
   */
  constructor(address[] memory _reviewers, uint256 _requiredReviews) {
    for (uint256 i = 0; i < _reviewers.length; i++) {
      require(!isReviewer[_reviewers[i]] || _reviewers[i] != address(0), "Invalid address provided");
      isReviewer[_reviewers[i]] = true;
    }
    owner = msg.sender;
    requiredReviews = _requiredReviews;
    reviewers = _reviewers;
  }

  /** 
   * @dev Allows to add a new reviewer.
   * @param _reviewer Address of new reviewer.
   */
  function addReviewer(address _reviewer)
    public
    onlyOwner
    reviewerDoesNotExist(_reviewer)
    notNull(_reviewer)
    validRequirement(reviewers.length + 1, requiredReviews)
  {
    isReviewer[_reviewer] = true;
    reviewers.push(_reviewer);
    emit ReviewerAddition(_reviewer);
  }

  /** 
   * @dev Allows to remove an reviewer.
   * @param _reviewer Address of reviewer.
   */
  function removeReviewer(address _reviewer) public onlyOwner reviewerExists(_reviewer) {
    isReviewer[_reviewer] = false;
    for (uint256 i = 0; i < reviewers.length - 1; i++)
      if (reviewers[i] == _reviewer) {
        reviewers[i] = reviewers[reviewers.length - 1];
        break;
      }
    if (requiredReviews > reviewers.length) changeRequirement(reviewers.length);
    emit ReviewerRemoval(_reviewer);
  }

  /** 
   * @dev Allows to replace an reviewer with a new reviewer.
   * @param _reviewer Address of reviewer to be replaced.
   * @param newReviewer Address of new reviewer.
   */
  function replaceReviewer(address _reviewer, address newReviewer)
    public
    onlyOwner
    reviewerExists(_reviewer)
    reviewerDoesNotExist(newReviewer)
  {
    for (uint256 i = 0; i < reviewers.length; i++)
      if (reviewers[i] == _reviewer) {
        reviewers[i] = newReviewer;
        break;
      }
    isReviewer[_reviewer] = false;
    isReviewer[newReviewer] = true;
    emit ReviewerRemoval(_reviewer);
    emit ReviewerAddition(newReviewer);
  }

  /** 
   * @dev Allows to change the number of required confirmations.
   * @param _requiredReviews Number of required confirmations.
   */
  function changeRequirement(uint256 _requiredReviews)
    public
    onlyOwner
    validRequirement(reviewers.length, _requiredReviews)
  {
    requiredReviews = _requiredReviews;
    emit RequirementChange(_requiredReviews);
  }


  /** 
   * @dev Allows to change task contract address.
   * @param _taskContractAddress new task contract address.
   */
  function updateTaskContractAddress(address _taskContractAddress) public onlyOwner returns (bool) {
    taskContractAddress = _taskContractAddress;
    taskContract = TaskContract(_taskContractAddress);
    return true;
  }

  /** 
   * @dev Allows to change reputation token contract address.
   * @param _reputationContractAddress new reputation token contract address.
   */
  function updateReputationContract(address _reputationContractAddress) public onlyOwner returns (bool) {
    sbtToken = SBTToken(_reputationContractAddress);
    return true;
  }

  /**
   * @dev Returns list of reviewers.
   * @return List of reviewer addresses.
   */
  function getReviewers() public view returns (address[] memory) {
    return reviewers;
  }

  /**
   * @dev Returns if is reviewer.
   * @return if is reviewer address.
   */
  function isReviewerAddress(address _address) public view returns (bool) {
    return isReviewer[_address];
  }

  /** 
   * @dev Allows to reward a user with tokens.
   * @param to Assignee address.
   * @param value Token reward value.
   */
  function reward(address to, uint256 value) public onlyTaskContract {
    sbtToken.reward(to, value);
  }
}
