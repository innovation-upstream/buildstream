import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  TaskArchived,
  TaskAssignment,
  TaskAssignmentRequested,
  TaskClosed,
  TaskConfirmation,
  TaskCreation,
  TaskOpened,
  TaskRequirementUpdated,
  TaskRevocation,
  TaskSubmission,
  TaskUnassignment
} from "../generated/TaskStorageContract/TaskStorageContract"

export function createTaskArchivedEvent(taskId: BigInt): TaskArchived {
  let taskArchivedEvent = changetype<TaskArchived>(newMockEvent())

  taskArchivedEvent.parameters = new Array()

  taskArchivedEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )

  return taskArchivedEvent
}

export function createTaskAssignmentEvent(
  sender: Address,
  taskId: BigInt
): TaskAssignment {
  let taskAssignmentEvent = changetype<TaskAssignment>(newMockEvent())

  taskAssignmentEvent.parameters = new Array()

  taskAssignmentEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  taskAssignmentEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )

  return taskAssignmentEvent
}

export function createTaskAssignmentRequestedEvent(
  sender: Address,
  taskId: BigInt
): TaskAssignmentRequested {
  let taskAssignmentRequestedEvent = changetype<TaskAssignmentRequested>(
    newMockEvent()
  )

  taskAssignmentRequestedEvent.parameters = new Array()

  taskAssignmentRequestedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  taskAssignmentRequestedEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )

  return taskAssignmentRequestedEvent
}

export function createTaskClosedEvent(taskId: BigInt): TaskClosed {
  let taskClosedEvent = changetype<TaskClosed>(newMockEvent())

  taskClosedEvent.parameters = new Array()

  taskClosedEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )

  return taskClosedEvent
}

export function createTaskConfirmationEvent(
  sender: Address,
  taskId: BigInt
): TaskConfirmation {
  let taskConfirmationEvent = changetype<TaskConfirmation>(newMockEvent())

  taskConfirmationEvent.parameters = new Array()

  taskConfirmationEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  taskConfirmationEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )

  return taskConfirmationEvent
}

export function createTaskCreationEvent(taskId: BigInt): TaskCreation {
  let taskCreationEvent = changetype<TaskCreation>(newMockEvent())

  taskCreationEvent.parameters = new Array()

  taskCreationEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )

  return taskCreationEvent
}

export function createTaskOpenedEvent(taskId: BigInt): TaskOpened {
  let taskOpenedEvent = changetype<TaskOpened>(newMockEvent())

  taskOpenedEvent.parameters = new Array()

  taskOpenedEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )

  return taskOpenedEvent
}

export function createTaskRequirementUpdatedEvent(
  taskId: BigInt
): TaskRequirementUpdated {
  let taskRequirementUpdatedEvent = changetype<TaskRequirementUpdated>(
    newMockEvent()
  )

  taskRequirementUpdatedEvent.parameters = new Array()

  taskRequirementUpdatedEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )

  return taskRequirementUpdatedEvent
}

export function createTaskRevocationEvent(
  sender: Address,
  taskId: BigInt
): TaskRevocation {
  let taskRevocationEvent = changetype<TaskRevocation>(newMockEvent())

  taskRevocationEvent.parameters = new Array()

  taskRevocationEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  taskRevocationEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )

  return taskRevocationEvent
}

export function createTaskSubmissionEvent(taskId: BigInt): TaskSubmission {
  let taskSubmissionEvent = changetype<TaskSubmission>(newMockEvent())

  taskSubmissionEvent.parameters = new Array()

  taskSubmissionEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )

  return taskSubmissionEvent
}

export function createTaskUnassignmentEvent(
  sender: Address,
  taskId: BigInt
): TaskUnassignment {
  let taskUnassignmentEvent = changetype<TaskUnassignment>(newMockEvent())

  taskUnassignmentEvent.parameters = new Array()

  taskUnassignmentEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  taskUnassignmentEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )

  return taskUnassignmentEvent
}
