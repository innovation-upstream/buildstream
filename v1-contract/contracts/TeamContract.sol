// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./TaskContract.sol";
import "./TaskStorageContract.sol";

library TeamLib {
    struct Team {
        uint256 id;
        string name;
        string description;
        address walletAddress;
        bool archived;
        address[] members;
        uint256 teamRewardMultiplier; // Must be less than 0 with 18 decimals
    }
}

contract TeamContract {
    address private owner;
    TaskStorageContract private taskStorageContract;

    event TeamCreation(address indexed teamAddress, TeamLib.Team team);
    event TeamUpdated(address indexed teamAddress, TeamLib.Team team);
    event TeamArchived(address indexed teamAddress);
    event TeamUnArchived(address indexed teamAddress);
    event TaskAssignment(
        address indexed teamAddress,
        uint256 indexed taskId,
        address indexed assignee
    );
    event TeamMemberAdded(address indexed teamAddress, address indexed member);
    event TeamMemberRemoved(
        address indexed teamAddress,
        address indexed member
    );

    mapping(address => TeamLib.Team) private teams;
    mapping(uint256 => address) private taskAssignees;
    mapping(address => mapping(address => bool)) private memberExists;
    uint256 private teamCount;

    modifier onlyOwner() {
        require(msg.sender == owner, "Permission denied");
        _;
    }

    modifier onlyTeamWallet() {
        require(
            msg.sender == teams[msg.sender].walletAddress,
            "Permission denied"
        );
        _;
    }

    modifier teamExists(address teamAddress) {
        require(
            teams[teamAddress].walletAddress == teamAddress,
            "Team does not exist"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function updateTaskStorageContractAddress(
        address taskStorageContractAddress
    ) public onlyOwner {
        taskStorageContract = TaskStorageContract(taskStorageContractAddress);
    }

    function createTeam(
        string memory name,
        string memory description,
        address[] memory members,
        uint256 teamRewardMultiplier
    ) external returns (uint256 teamId) {
        require(teamRewardMultiplier <= (10**18), "invalid reward multiplier");
        teamId = teamCount;
        teams[msg.sender] = TeamLib.Team({
            id: teamId,
            name: name,
            description: description,
            walletAddress: msg.sender,
            archived: false,
            members: members,
            teamRewardMultiplier: teamRewardMultiplier
        });
        teamCount += 1;
        for (uint256 i = 0; i < members.length; i++)
            memberExists[msg.sender][members[i]] = true;
        emit TeamCreation(msg.sender, teams[msg.sender]);
    }

    function updateTeam(
        string memory name,
        string memory description,
        uint256 teamRewardMultiplier
    ) external teamExists(msg.sender) onlyTeamWallet {
        require(teamRewardMultiplier <= (10**18), "invalid reward multiplier");
        TeamLib.Team storage team = teams[msg.sender];
        team.name = name;
        team.description = description;
        team.teamRewardMultiplier = teamRewardMultiplier;
        emit TeamUpdated(msg.sender, team);
    }

    function addMember(address member)
        external
        teamExists(msg.sender)
        onlyTeamWallet
    {
        require(!memberExists[msg.sender][member], "Member already exists");
        teams[msg.sender].members.push(member);
        memberExists[msg.sender][member] = true;
        emit TeamMemberAdded(msg.sender, member);
    }

    function removeMember(address member)
        external
        teamExists(msg.sender)
        onlyTeamWallet
    {
        require(memberExists[msg.sender][member], "Member does not exist");
        uint256 length = teams[msg.sender].members.length;
        for (uint256 i = 0; i < length; i++)
            if (teams[msg.sender].members[i] == member) {
                teams[msg.sender].members[i] = teams[msg.sender].members[
                    length - 1
                ];
                break;
            }
        teams[msg.sender].members.pop();
        memberExists[msg.sender][member] = false;
        emit TeamMemberRemoved(msg.sender, member);
    }

    function assignTask(uint256 taskId, address assignee)
        external
        teamExists(msg.sender)
    {
        require(memberExists[msg.sender][assignee], "Member does not exist");
        TaskLib.Task memory task = taskStorageContract.getTask(taskId);
        require(task.assigneeAddress == msg.sender, "Task is not yours");
        require(
            task.status == TaskLib.TaskStatus.ASSIGNED,
            "Cannot assign now"
        );
        taskAssignees[taskId] = assignee;
        emit TaskAssignment(msg.sender, taskId, assignee);
    }

    function getTeam(address teamAddress)
        external
        view
        teamExists(teamAddress)
        returns (TeamLib.Team memory)
    {
        return teams[teamAddress];
    }

    function getTaskAssignee(uint256 taskId) external view returns (address) {
        return taskAssignees[taskId];
    }

    function doesTeamExist(address walletAddress) external view returns (bool) {
        return teams[walletAddress].walletAddress == walletAddress;
    }
}
