// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./abstract/Organization.sol";

contract Org is Organization {
  constructor(address[] memory _reviewers, uint256 _requiredReviews) Organization(_reviewers, _requiredReviews) {
  }

  function getOrganizationName() public override pure returns (string memory name) {
    return "ORG";
  }
}
