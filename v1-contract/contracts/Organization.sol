// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ActionContract.sol";
import "./Treasury.sol";

library OrgLib {
    struct Org {
        uint256 id;
        string name;
        string description;
        address[] approvers;
        address[] signers;
        bool isInitialized;
        bool archived;
    }

    struct OrgConfig {
        uint256 orgId;
        uint256 requiredTaskApprovals;
        uint256 requiredConfirmations;
        uint256 rewardMultiplier;
        address rewardToken;
        uint256 rewardSlashMultiplier; // Must be less than 0 with 18 decimals
        uint256 slashRewardEvery; // In seconds
    }
}

contract Organization {
    address private owner;
    address private actionContractAddress;
    ActionContract private actionContract;
    Treasury private treasury;

    event OrganizationCreation(uint256 indexed orgId);
    event OrganizationInitialized(uint256 indexed orgId);
    event OrganizationApproverAddition(
        uint256 indexed _orgId,
        address indexed _approver
    );
    event OrganizationApproverRemoval(
        uint256 indexed _orgId,
        address indexed _approver
    );
    event OrganizationSignerAddition(
        uint256 indexed _orgId,
        address indexed _signer
    );
    event OrganizationSignerRemoval(
        uint256 indexed _orgId,
        address indexed _signer
    );

    mapping(uint256 => mapping(address => bool)) private isApprover;
    mapping(uint256 => mapping(address => bool)) private isSigner;
    mapping(uint256 => OrgLib.Org) private orgs;
    mapping(uint256 => OrgLib.OrgConfig) private orgConfigs;
    mapping(uint256 => bool) private _orgExists;
    mapping(uint256 => mapping(uint256 => uint256)) private multipliers;
    uint256 private orgCount;

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
        actionContractAddress = _address;
    }

    function updateTreasuryContract(address _address) external onlyOwner {
        treasury = Treasury(_address);
    }

    /// @dev Allows to add a new organization.
    /// @param name Organization name.
    /// @param description Organization description.
    /// @param approvers List of approvers.
    /// @return orgId organizaion ID.
    function createOrg(
        string memory name,
        string memory description,
        address[] memory approvers,
        address[] memory signers,
        bool initializeConfig
    ) external returns (uint256 orgId) {
        orgId = orgCount;
        if (approvers.length == 0) {
            approvers[0] = msg.sender;
        }
        if (signers.length == 0) {
            signers[0] = msg.sender;
        }
        orgs[orgId] = OrgLib.Org({
            id: orgId,
            name: name,
            description: description,
            isInitialized: false,
            approvers: approvers,
            signers: signers
        });
        orgCount += 1;
        _orgExists[orgId] = true;
        uint256 i;
        for (i = 0; i < approvers.length; i++)
            isApprover[orgId][approvers[i]] = true;
        for (i = 0; i < signers.length; i++) isSigner[orgId][signers[i]] = true;
        emit OrganizationCreation(orgId);

        if (initializeConfig)
            addOrgConfig(
                orgId, // orgId
                10 ** 14, // rewardMultiplier (0.0001)
                address(0), // rewardToken
                1, // requiredConfirmations
                1, // requiredTaskApprovals
                10 ** 16, // rewardSlashMultiplier (0.01)
                86400 // slashRewardEvery (1 day)
            );
    }

    /// @dev Allows to add a new organization config.
    /// @param orgId Organization Id.
    /// @param requiredTaskApprovals Number of approvals required per task.
    function addOrgConfig(
        uint256 orgId,
        uint256 rewardMultiplier,
        address rewardToken,
        uint256 requiredConfirmations,
        uint256 requiredTaskApprovals,
        uint256 rewardSlashMultiplier,
        uint256 slashRewardEvery
    ) public onlySigner(orgId) {
        require(!orgs[orgId].isInitialized, "org is initialized");
        require(
            rewardSlashMultiplier <= (10 ** 18),
            "invalid slash multiplier"
        );
        orgs[orgId].isInitialized = true;
        orgConfigs[orgId] = OrgLib.OrgConfig({
            orgId: orgId,
            rewardToken: rewardToken,
            rewardMultiplier: rewardMultiplier,
            requiredConfirmations: requiredConfirmations,
            requiredTaskApprovals: requiredTaskApprovals,
            rewardSlashMultiplier: rewardSlashMultiplier,
            slashRewardEvery: slashRewardEvery
        });
        emit OrganizationInitialized(orgId);
    }

    /// @dev Get organization.
    /// @param _orgId Id of organization.
    function getOrganization(
        uint256 _orgId
    ) external view orgExists(_orgId) returns (OrgLib.Org memory) {
        return orgs[_orgId];
    }

    /// @dev Get organization config.
    /// @param _orgId Id of organization.
    function getOrganizationConfig(
        uint256 _orgId
    ) external view orgExists(_orgId) returns (OrgLib.OrgConfig memory) {
        return orgConfigs[_orgId];
    }

    function getRewardMultiplier(
        uint256 orgId,
        uint256[] memory tags
    ) external view returns (uint256 mul) {
        mul = orgConfigs[orgId].rewardMultiplier;
        for (uint256 i = 0; i < tags.length; i++) {
            uint256 m = multipliers[orgId][tags[i]];
            if (m > mul) mul = m;
        }
    }

    /// @dev Returns org count.
    /// @return Organization count.
    function getOrgCount() external view returns (uint256) {
        return orgCount;
    }

    /// @dev Returns list of organization IDs in defined range.
    /// @param from Index start position of task array.
    /// @param to Index end position of task array.
    /// @return _orgIds array of organization IDs.
    function getOrgIds(
        uint256 from,
        uint256 to
    ) external view returns (uint256[] memory _orgIds) {
        uint256[] memory orgIdsTemp = new uint256[](orgCount);
        uint256 count = 0;
        uint256 i;
        for (i = 0; i < orgCount; i++) {
            orgIdsTemp[count] = i;
            count += 1;
        }
        _orgIds = new uint256[](to - from);
        for (i = from; i < to; i++) _orgIds[i - from] = orgIdsTemp[i];
    }

    /// @dev Check if an organization exists.
    /// @param _orgId Id of organization.
    function doesOrgExists(uint256 _orgId) external view returns (bool) {
        return _orgExists[_orgId];
    }

    /// @dev Check if an organization exists.
    /// @param _actionId Id of organization.
    function executeAction(uint256 _actionId) external {
        require(msg.sender == actionContractAddress, "Permission denied");
        ActionLib.Action memory action = actionContract.getAction(_actionId);
        require(action.executed, "Action is not executed");

        if (action.actionType == ActionLib.ActionType.ADD_APPROVER)
            addApprover(action.orgId, action.targetAddress);

        if (action.actionType == ActionLib.ActionType.REMOVE_APPROVER)
            removeApprover(action.orgId, action.targetAddress);

        if (action.actionType == ActionLib.ActionType.ADD_SIGNER)
            addSigner(action.orgId, action.targetAddress);

        if (action.actionType == ActionLib.ActionType.REMOVE_SIGNER)
            removeSigner(action.orgId, action.targetAddress);

        if (action.actionType == ActionLib.ActionType.WITHDRAWAL)
            withdraw(
                _actionId,
                action.orgId,
                action.targetAddress,
                action.tokenAddress,
                action.value
            );

        if (
            action.actionType ==
            ActionLib.ActionType.UPDATE_REQUIRED_TASK_APPROVALS
        ) orgConfigs[action.orgId].requiredTaskApprovals = action.value;

        if (
            action.actionType ==
            ActionLib.ActionType.UPDATE_REQUIRED_CONFIRMATIONS
        ) orgConfigs[action.orgId].requiredConfirmations = action.value;

        if (action.actionType == ActionLib.ActionType.UPDATE_REWARD_MULTIPLIER)
            orgConfigs[action.orgId].rewardMultiplier = action.value;

        if (action.actionType == ActionLib.ActionType.UPDATE_REWARD_TOKEN)
            orgConfigs[action.orgId].rewardToken = action.targetAddress;

        if (
            action.actionType ==
            ActionLib.ActionType.UPDATE_REWARD_SLASH_MULTIPLIER
        ) {
            require(action.value <= (10 ** 18), "invalid slash multiplier");
            orgConfigs[action.orgId].rewardSlashMultiplier = action.value;
        }

        if (action.actionType == ActionLib.ActionType.UPDATE_SLASH_REWARD_EVERY)
            orgConfigs[action.orgId].slashRewardEvery = action.value;

        if (
            action.actionType ==
            ActionLib.ActionType.UPDATE_TAG_REWARD_MULTIPLIER
        ) {
            // Get tag key from data
            require(action.data.length >= 32, "slicing out of range");
            bytes memory data = action.data;
            uint key;
            assembly {
                key := mload(add(data, add(0x20, 32)))
            }
            multipliers[action.orgId][key] = action.value;
        }

        string memory val = string(abi.encodePacked(action.data));
        if (action.actionType == ActionLib.ActionType.UPDATE_NAME)
            orgs[action.orgId].name = val;

        if (action.actionType == ActionLib.ActionType.UPDATE_DESCRIPTION)
            orgs[action.orgId].description = val;
    }

    function withdraw(
        uint256 _actionId,
        uint256 orgId,
        address targetAddress,
        address tokenAddress,
        uint256 value
    ) private {
        if (tokenAddress == address(0))
            treasury.withdrawForce(_actionId, orgId, targetAddress, value);
        else
            treasury.withdrawForce(
                _actionId,
                orgId,
                targetAddress,
                tokenAddress,
                value
            );
    }

    /// @dev Allows to add a new approver.
    /// @param _orgId Id of organization.
    /// @param _approver Address of new approver.
    function addApprover(uint256 _orgId, address _approver) private {
        require(!isApprover[_orgId][_approver], "Approver exists");
        isApprover[_orgId][_approver] = true;
        orgs[_orgId].approvers.push(_approver);
        emit OrganizationApproverAddition(_orgId, _approver);
    }

    /// @dev Allows to remove an approver.
    /// @param _orgId Id of organization.
    /// @param _approver Address of approver.
    function removeApprover(uint256 _orgId, address _approver) private {
        require(isApprover[_orgId][_approver], "Approver not exist");
        require(
            orgs[_orgId].approvers.length > 1,
            "approvers must not be empty"
        );
        isApprover[_orgId][_approver] = false;
        OrgLib.Org storage org = orgs[_orgId];
        address[] storage approvers = org.approvers;
        for (uint256 i = 0; i < approvers.length; i++)
            if (approvers[i] == _approver) {
                approvers[i] = approvers[approvers.length - 1];
                break;
            }
        approvers.pop();
        emit OrganizationApproverRemoval(_orgId, _approver);
    }

    /// @dev Returns list of approvers.
    /// @param _orgId Id of organization.
    /// @return List of approver addresses.
    function getApprovers(
        uint256 _orgId
    ) external view orgExists(_orgId) returns (address[] memory) {
        return orgs[_orgId].approvers;
    }

    /// @dev Returns if is approver.
    /// @param _orgId Id of organization.
    /// @param _address Address of approver.
    /// @return if is approver address.
    function isApproverAddress(
        uint256 _orgId,
        address _address
    ) external view orgExists(_orgId) returns (bool) {
        return isApprover[_orgId][_address];
    }

    /// @dev Allows to add a new signer.
    /// @param _orgId Id of organization.
    /// @param _signer Address of new signer.
    function addSigner(uint256 _orgId, address _signer) private {
        require(!isSigner[_orgId][_signer], "Signer exists");
        isSigner[_orgId][_signer] = true;
        orgs[_orgId].signers.push(_signer);
        emit OrganizationSignerAddition(_orgId, _signer);
    }

    /// @dev Allows to remove an signer.
    /// @param _orgId Id of organization.
    /// @param _signer Address of signer.
    function removeSigner(uint256 _orgId, address _signer) private {
        require(isSigner[_orgId][_signer], "Signer not exist");
        require(orgs[_orgId].signers.length > 1, "signers must not be empty");
        isSigner[_orgId][_signer] = false;
        OrgLib.Org storage org = orgs[_orgId];
        address[] storage signers = org.signers;
        for (uint256 i = 0; i < signers.length; i++)
            if (signers[i] == _signer) {
                signers[i] = signers[signers.length - 1];
                break;
            }
        signers.pop();
        emit OrganizationSignerRemoval(_orgId, _signer);
    }

    /// @dev Returns list of signers.
    /// @param _orgId Id of organization.
    /// @return List of signer addresses.
    function getSigners(
        uint256 _orgId
    ) external view orgExists(_orgId) returns (address[] memory) {
        return orgs[_orgId].signers;
    }

    /// @dev Returns if is signer.
    /// @param _orgId Id of organization.
    /// @param _address Address of signer.
    /// @return if is signer address.
    function isSignerAddress(
        uint256 _orgId,
        address _address
    ) external view orgExists(_orgId) returns (bool) {
        return isSigner[_orgId][_address];
    }

    function getTaskApprovals(
        uint256 _orgId
    ) external view orgExists(_orgId) returns (uint256) {
        return orgConfigs[_orgId].requiredTaskApprovals;
    }
}
