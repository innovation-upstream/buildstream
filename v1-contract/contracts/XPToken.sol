// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./abstract/ReputationToken.sol";

contract XPToken is SBTToken {
  constructor(address _organizationContractAddress) SBTToken(_organizationContractAddress) ERC20("XPToken", "XPT") {
  }

  function getTitle() virtual public override pure returns (string memory name) {
    return "XP";
  }
}
