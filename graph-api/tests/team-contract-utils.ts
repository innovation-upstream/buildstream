import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  TaskAssignment,
  TeamArchived,
  TeamCreation,
  TeamMemberAdded,
  TeamMemberRemoved,
  TeamUnArchived,
  TeamUpdated
} from "../generated/TeamContract/TeamContract"

export function createTaskAssignmentEvent(
  teamAddress: Address,
  taskId: BigInt,
  assignee: Address
): TaskAssignment {
  let taskAssignmentEvent = changetype<TaskAssignment>(newMockEvent())

  taskAssignmentEvent.parameters = new Array()

  taskAssignmentEvent.parameters.push(
    new ethereum.EventParam(
      "teamAddress",
      ethereum.Value.fromAddress(teamAddress)
    )
  )
  taskAssignmentEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )
  taskAssignmentEvent.parameters.push(
    new ethereum.EventParam("assignee", ethereum.Value.fromAddress(assignee))
  )

  return taskAssignmentEvent
}

export function createTeamArchivedEvent(teamAddress: Address): TeamArchived {
  let teamArchivedEvent = changetype<TeamArchived>(newMockEvent())

  teamArchivedEvent.parameters = new Array()

  teamArchivedEvent.parameters.push(
    new ethereum.EventParam(
      "teamAddress",
      ethereum.Value.fromAddress(teamAddress)
    )
  )

  return teamArchivedEvent
}

export function createTeamCreationEvent(
  teamAddress: Address,
  param1: ethereum.Tuple
): TeamCreation {
  let teamCreationEvent = changetype<TeamCreation>(newMockEvent())

  teamCreationEvent.parameters = new Array()

  teamCreationEvent.parameters.push(
    new ethereum.EventParam(
      "teamAddress",
      ethereum.Value.fromAddress(teamAddress)
    )
  )
  teamCreationEvent.parameters.push(
    new ethereum.EventParam("param1", ethereum.Value.fromTuple(param1))
  )

  return teamCreationEvent
}

export function createTeamMemberAddedEvent(
  teamAddress: Address,
  member: Address
): TeamMemberAdded {
  let teamMemberAddedEvent = changetype<TeamMemberAdded>(newMockEvent())

  teamMemberAddedEvent.parameters = new Array()

  teamMemberAddedEvent.parameters.push(
    new ethereum.EventParam(
      "teamAddress",
      ethereum.Value.fromAddress(teamAddress)
    )
  )
  teamMemberAddedEvent.parameters.push(
    new ethereum.EventParam("member", ethereum.Value.fromAddress(member))
  )

  return teamMemberAddedEvent
}

export function createTeamMemberRemovedEvent(
  teamAddress: Address,
  member: Address
): TeamMemberRemoved {
  let teamMemberRemovedEvent = changetype<TeamMemberRemoved>(newMockEvent())

  teamMemberRemovedEvent.parameters = new Array()

  teamMemberRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "teamAddress",
      ethereum.Value.fromAddress(teamAddress)
    )
  )
  teamMemberRemovedEvent.parameters.push(
    new ethereum.EventParam("member", ethereum.Value.fromAddress(member))
  )

  return teamMemberRemovedEvent
}

export function createTeamUnArchivedEvent(
  teamAddress: Address
): TeamUnArchived {
  let teamUnArchivedEvent = changetype<TeamUnArchived>(newMockEvent())

  teamUnArchivedEvent.parameters = new Array()

  teamUnArchivedEvent.parameters.push(
    new ethereum.EventParam(
      "teamAddress",
      ethereum.Value.fromAddress(teamAddress)
    )
  )

  return teamUnArchivedEvent
}

export function createTeamUpdatedEvent(
  teamAddress: Address,
  param1: ethereum.Tuple
): TeamUpdated {
  let teamUpdatedEvent = changetype<TeamUpdated>(newMockEvent())

  teamUpdatedEvent.parameters = new Array()

  teamUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "teamAddress",
      ethereum.Value.fromAddress(teamAddress)
    )
  )
  teamUpdatedEvent.parameters.push(
    new ethereum.EventParam("param1", ethereum.Value.fromTuple(param1))
  )

  return teamUpdatedEvent
}
