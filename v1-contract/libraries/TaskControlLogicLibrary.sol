// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../contracts/TaskStorageContract.sol";
import "../contracts/Organization.sol";
import "../contracts/SBTToken.sol";
import "../contracts/TeamContract.sol";

struct Payee {
    address walletAddress;
    uint256 amount;
}

library TaskControlLogicLibrary {
    function ensureCanCreateTask(
        uint256 orgId,
        uint256[] memory taskTags,
        uint256 complexityScore,
        Organization organization,
        SBTToken sbtToken
    ) external view {
        require(organization.doesOrgExists(orgId), "Org not exist");
        for (uint256 i = 0; i < taskTags.length; i++) {
            require(sbtToken.doesTokenExist(taskTags[i]), "Invalid tag");
        }
        OrgLib.Org memory org = organization.getOrganization(orgId);
        require(org.isInitialized, "Organization not initialized");
    }

    function ensureCanUpdateTask(
        uint256[] memory taskTags,
        uint256 complexityScore,
        SBTToken sbtToken
    ) external view {
        for (uint256 i = 0; i < taskTags.length; i++) {
            require(sbtToken.doesTokenExist(taskTags[i]), "Invalid tag");
        }
    }

    function getTaskReward(
        uint256 taskId,
        TaskStorageContract taskStorage,
        Organization organization
    ) external view returns (uint256 rewardAmount) {
        TaskLib.Task memory task = taskStorage.getTask(taskId);
        uint256 multiplier = organization.getRewardMultiplier(
            task.orgId,
            task.taskTags
        );
        rewardAmount = multiplier * (task.complexityScore + 1);
    }

    function canCloseTask(
        uint256 taskId,
        TaskStorageContract taskStorage
    ) external view returns (bool) {
        TaskLib.TaskMetadata memory taskMetadata = taskStorage.getTaskMetadata(
            taskId
        );
        return taskMetadata.approvers.length >= taskMetadata.requiredApprovals;
    }

    /// @dev Allows closing an approved task.
    function getRewardAndSlash(
        uint256 taskId,
        TaskStorageContract taskStorage,
        Organization organization
    ) external view returns (uint256 rewardAmount, uint256 slashAmount) {
        TaskLib.Task memory task = taskStorage.getTask(taskId);
        TaskLib.TaskMetadata memory taskMetadata = taskStorage.getTaskMetadata(
            taskId
        );
        OrgLib.OrgConfig memory orgConfig = organization.getOrganizationConfig(
            task.orgId
        );

        if (task.dueDate >= taskMetadata.submitDate)
            return (taskMetadata.rewardAmount, 0);

        uint256 overtime = taskMetadata.submitDate - task.dueDate;
        // Round up values
        uint256 roundedRemainder = overtime % orgConfig.slashRewardEvery > 0
            ? 1
            : 0;
        uint256 slashRatio = (overtime / orgConfig.slashRewardEvery) +
            roundedRemainder;
        slashAmount =
            (slashRatio *
                orgConfig.rewardSlashMultiplier *
                taskMetadata.rewardAmount) /
            10 ** 18;
        if (slashAmount > taskMetadata.rewardAmount)
            slashAmount = taskMetadata.rewardAmount;
        rewardAmount = taskMetadata.rewardAmount - slashAmount;
    }

    function getPayees(
        uint256 taskId,
        uint256 rewardAmount,
        TaskStorageContract taskStorage,
        TeamContract teamContract
    ) external view returns (Payee[] memory payees) {
        TaskLib.Task memory task = taskStorage.getTask(taskId);
        address assignee = task.assigneeAddress;
        payees = new Payee[](2);
        if (!teamContract.doesTeamExist(assignee)) {
            payees[0] = Payee({walletAddress: assignee, amount: rewardAmount});
            return payees;
        }
        TeamLib.Team memory team = teamContract.getTeam(assignee);
        address teamAssignee = teamContract.getTaskAssignee(taskId);

        if (teamAssignee == address(0) || teamAssignee == assignee) {
            payees[0] = Payee({walletAddress: assignee, amount: rewardAmount});
            return payees;
        }

        uint256 teamReward = (rewardAmount * team.teamRewardMultiplier) /
            (10 ** 18);
        payees[0] = Payee({
            walletAddress: teamAssignee,
            amount: rewardAmount - teamReward
        });
        payees[1] = Payee({walletAddress: assignee, amount: teamReward});
    }
}
