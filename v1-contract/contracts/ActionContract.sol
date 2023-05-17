// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Organization.sol";

library ActionLib {
    enum ActionType {
        WITHDRAWAL,
        ADD_APPROVER,
        ADD_SIGNER,
        REMOVE_APPROVER,
        REMOVE_SIGNER,
        UPDATE_NAME,
        UPDATE_DESCRIPTION,
        UPDATE_REQUIRED_TASK_APPROVALS,
        UPDATE_REQUIRED_CONFIRMATIONS,
        UPDATE_REWARD_MULTIPLIER,
        UPDATE_REWARD_TOKEN,
        UPDATE_REWARD_SLASH_MULTIPLIER,
        UPDATE_SLASH_REWARD_EVERY,
        UPDATE_TAG_REWARD_MULTIPLIER
    }

    struct Action {
        uint256 id;
        uint256 orgId;
        address initiator;
        address targetAddress;
        uint256 value;
        bytes data;
        bool executed;
        address tokenAddress;
        ActionType actionType;
        bool autoExecute;
    }
}

contract ActionContract {
    address private owner;
    Organization private organization;
    address private organizationAddress;

    event ActionCreation(uint256 indexed orgId, uint256 indexed actionId);
    event ActionConfirmation(
        uint256 indexed orgId,
        address indexed sender,
        uint256 indexed actionId
    );
    event ActionExecution(uint256 indexed orgId, uint256 indexed actionId);

    mapping(uint256 => ActionLib.Action) private actions;
    mapping(uint256 => bool) private _actionExists;
    mapping(uint256 => mapping(address => bool)) private confirmations;
    mapping(uint256 => uint256) private confirmationCount;
    uint256 private actionCount;
    mapping(uint256 => uint256) private orgActionCount;
    mapping(uint256 => uint256[]) private orgActionIds;
    mapping(uint256 => uint256) private actionOrg;

    modifier onlyOwner() {
        require(msg.sender == owner, "Permission denied");
        _;
    }

    modifier onlyOrgContract() {
        require(msg.sender == organizationAddress, "Permission denied");
        _;
    }

    modifier onlySigner(uint256 _orgId) {
        require(
            organization.isSignerAddress(_orgId, msg.sender),
            "Permission denied"
        );
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

    /// @dev Create an action.
    /// @param _orgId Id of organization.
    function createAction(
        uint256 _orgId,
        address targetAddress,
        uint256 value,
        address tokenAddress,
        ActionLib.ActionType actionType,
        bytes memory data,
        bool autoExecute
    ) external orgExists(_orgId) onlySigner(_orgId) returns (uint256 actionId) {
        require(
            actionType == ActionLib.ActionType.WITHDRAWAL,
            "Invalid action type"
        );
        actionId = actionCount;
        actions[actionId] = ActionLib.Action({
            id: actionId,
            orgId: _orgId,
            initiator: msg.sender,
            targetAddress: targetAddress,
            value: value,
            data: data,
            executed: false,
            tokenAddress: tokenAddress,
            actionType: actionType,
            autoExecute: autoExecute
        });
        actionCount += 1;
        orgActionCount[_orgId] += 1;
        orgActionIds[_orgId].push(actionId);
        _actionExists[actionId] = true;
        emit ActionCreation(_orgId, actionId);
        confirmAction(actionId);
    }

    /// @dev Create an action.
    /// @param _orgId Id of organization.
    function createAction(
        uint256 _orgId,
        address targetAddress,
        ActionLib.ActionType actionType,
        bytes memory data,
        uint256 value,
        bool autoExecute
    ) external orgExists(_orgId) onlySigner(_orgId) returns (uint256 actionId) {
        require(
            actionType != ActionLib.ActionType.WITHDRAWAL,
            "Invalid action type"
        );
        actionId = actionCount;
        actions[actionId] = ActionLib.Action({
            id: actionId,
            orgId: _orgId,
            initiator: msg.sender,
            targetAddress: targetAddress,
            value: value,
            data: data,
            executed: false,
            tokenAddress: address(0),
            actionType: actionType,
            autoExecute: autoExecute
        });
        actionCount += 1;
        orgActionCount[_orgId] += 1;
        orgActionIds[_orgId].push(actionId);
        _actionExists[actionId] = true;
        emit ActionCreation(_orgId, actionId);
        confirmAction(actionId);
    }

    /// @dev Confirm an action.
    /// @param _actionId Id of action.
    function confirmAction(
        uint256 _actionId
    ) public actionExists(_actionId) onlySigner(actions[_actionId].orgId) {
        require(!actions[_actionId].executed, "Already executed");
        require(!confirmations[_actionId][msg.sender], "Already confirmed");
        confirmations[_actionId][msg.sender] = true;
        confirmationCount[_actionId] += 1;
        emit ActionConfirmation(
            actions[_actionId].orgId,
            msg.sender,
            _actionId
        );

        if (actions[_actionId].autoExecute && isActionConfirmed(_actionId)) {
            executeAction(_actionId);
        }
    }

    /// @dev Returns list of action confirmers.
    /// @param _actionId action Id.
    /// @return confirmers list of confirmers.
    function getConfirmers(
        uint256 _actionId
    )
        public
        view
        actionExists(_actionId)
        returns (address[] memory confirmers)
    {
        ActionLib.Action memory action = actions[_actionId];
        address[] memory signers = organization.getSigners(action.orgId);
        address[] memory confirmersTemp = new address[](signers.length);
        uint256 count = 0;
        uint256 i;
        for (i = 0; i < signers.length; i++)
            if (confirmations[_actionId][signers[i]]) {
                confirmersTemp[count] = signers[i];
                count += 1;
            }
        confirmers = new address[](count);
        for (i = 0; i < count; i++) confirmers[i] = confirmersTemp[i];
    }

    /// @dev Get action.
    /// @param _actionId Id of action.
    function getAction(
        uint256 _actionId
    ) external view actionExists(_actionId) returns (ActionLib.Action memory) {
        return actions[_actionId];
    }

    /// @dev Returns action count.
    /// @param _orgId organization Id.
    /// @return action count.
    function getActionCount(uint256 _orgId) public view returns (uint256) {
        return orgActionCount[_orgId];
    }

    /// @dev Returns list of action IDs in defined range.
    /// @param orgId Id of organization.
    /// @param from Index start position of action array.
    /// @param to Index end position of action array.
    /// @return _actionIds array of task IDs.
    function getActionIds(
        uint256 orgId,
        uint256 from,
        uint256 to
    ) external view returns (uint256[] memory _actionIds) {
        _actionIds = new uint256[](to - from);
        uint256 i;
        uint256 totalActionCount = orgActionCount[orgId];
        uint256 max = totalActionCount > to ? to : totalActionCount;
        for (i = from; i < max; i++) {
            _actionIds[i - from] = orgActionIds[orgId][i];
        }
    }

    /// @dev Check if an action exists.
    /// @param _actionId Id of an action.
    function doesActionExist(uint256 _actionId) external view returns (bool) {
        return _actionExists[_actionId];
    }

    /// @dev Check if an action is executed.
    /// @param _actionId Id of action.
    function isActionExecuted(
        uint256 _actionId
    ) external view actionExists(_actionId) returns (bool) {
        return actions[_actionId].executed;
    }

    /// @dev Check if an action is confirmed.
    /// @param _actionId Id of action.
    function isActionConfirmed(
        uint256 _actionId
    ) public view actionExists(_actionId) returns (bool) {
        return
            confirmationCount[_actionId] >=
            organization
                .getOrganizationConfig(actions[_actionId].orgId)
                .requiredConfirmations;
    }

    function executeAction(
        uint256 _actionId
    ) public onlySigner(actions[_actionId].orgId) actionExists(_actionId) {
        require(!actions[_actionId].executed, "Already executed");
        require(isActionConfirmed(_actionId), "Not confirmed");
        actions[_actionId].executed = true;
        organization.executeAction(_actionId);
        emit ActionExecution(actions[_actionId].orgId, _actionId);
    }
}
