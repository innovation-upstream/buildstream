import {
  Task,
  TaskCount,
  TaskSnapshot,
  TaskRevision
} from '../generated/schema'

import {
  TaskArchived as TaskArchivedEvent,
  TaskAssignment as TaskAssignmentEvent,
  TaskAssignmentRequested as TaskAssignmentRequestedEvent,
  TaskClosed as TaskClosedEvent,
  TaskConfirmation as TaskConfirmationEvent,
  TaskCreation as TaskCreationEvent,
  TaskOpened as TaskOpenedEvent,
  TaskRevocation as TaskRevocationEvent,
  TaskSubmission as TaskSubmissionEvent,
  TaskUnassignment as TaskUnassignmentEvent,
  TaskUpdated as TaskUpdatedEvent,
  TaskRevisionRequested as TaskRevisionRequestedEvent,
  TaskRevisionAccepted as TaskRevisionAcceptedEvent,
  TaskRevisionChangesRequested as TaskRevisionChangesRequestedEvent
} from '../generated/TaskStorageContract/TaskStorageContract'

import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts'

function createTaskSnapshot(
  event: ethereum.Event,
  taskEntity: Task
): TaskSnapshot {
  const id = event.transaction.hash.toHex() + '-' + event.logIndex.toString()
  const taskSnapshotEntity = new TaskSnapshot(id)
  const entries = taskEntity.entries
  for (let i = 0; i < entries.length; i++) {
    if (entries[i].key === 'id') continue
    taskSnapshotEntity.set(entries[i].key, entries[i].value)
  }
  taskSnapshotEntity.id = id
  taskSnapshotEntity.block = event.block.number
  taskSnapshotEntity.timestamp = event.block.timestamp
  taskSnapshotEntity.actor = event.transaction.from.toHexString()

  return taskSnapshotEntity
}

export function handleTaskAssignment(event: TaskAssignmentEvent): void {
  const taskId = event.params.taskId.toString()
  const taskEntity = Task.load(taskId)
  if (!taskEntity) return
  taskEntity.status = 2
  taskEntity.assignee = event.params.sender.toHexString()
  taskEntity.team = event.params.sender.toHexString()
  taskEntity.assigner = event.transaction.from.toHexString()
  taskEntity.assignDate = event.block.timestamp
  taskEntity.save()
  const taskSnapshotEntity = createTaskSnapshot(event, taskEntity)
  taskSnapshotEntity.save()
}

export function handleTaskAssignmentRequest(
  event: TaskAssignmentRequestedEvent
): void {
  let taskEntity = Task.load(event.params.taskId.toString())
  if (!taskEntity) return
  let assignmentRequests = taskEntity.assignmentRequest
  if (assignmentRequests == null) assignmentRequests = []
  assignmentRequests.push(event.params.sender.toHexString())
  taskEntity.assignmentRequest = assignmentRequests
  taskEntity.save()
  const taskSnapshotEntity = createTaskSnapshot(event, taskEntity)
  taskSnapshotEntity.save()
}

export function handleTaskClosed(event: TaskClosedEvent): void {
  const taskId = event.params.taskId.toString()
  const taskEntity = Task.load(taskId)
  if (!taskEntity) return
  taskEntity.status = 4
  taskEntity.save()
  const taskSnapshotEntity = createTaskSnapshot(event, taskEntity)
  taskSnapshotEntity.save()
}

export function handleTaskUpdated(event: TaskUpdatedEvent): void {
  const task = event.params.task

  const taskEntity = Task.load(event.params.taskId.toString())
  if (!taskEntity) return
  taskEntity.title = task.title
  taskEntity.description = task.description
  taskEntity.taskTags = task.taskTags
  taskEntity.complexityScore = task.complexityScore
  taskEntity.reputationLevel = task.reputationLevel
  taskEntity.taskDuration = task.taskDuration
  taskEntity.save()
  const taskSnapshotEntity = createTaskSnapshot(event, taskEntity)
  taskSnapshotEntity.save()
}

export function handleTaskConfirmation(event: TaskConfirmationEvent): void {
  let taskEntity = Task.load(event.params.taskId.toString())
  if (!taskEntity) return
  let approvers = taskEntity.approvedBy
  if (approvers == null) approvers = []
  approvers.push(event.params.sender.toHexString())
  taskEntity.approvedBy = approvers
  taskEntity.save()
  const taskSnapshotEntity = createTaskSnapshot(event, taskEntity)
  taskSnapshotEntity.save()
}

export function handleTaskCreation(event: TaskCreationEvent): void {
  const taskId = event.params.taskId.toString()
  const task = event.params.task
  const taskMetadata = event.params.taskMetadata
  const taskEntity = new Task(taskId)

  taskEntity.taskId = event.params.taskId
  taskEntity.orgId = task.orgId.toString()
  taskEntity.title = task.title
  taskEntity.description = task.description
  taskEntity.taskTags = task.taskTags
  taskEntity.status = task.status
  taskEntity.complexityScore = task.complexityScore
  taskEntity.reputationLevel = task.reputationLevel
  taskEntity.requiredApprovals = taskMetadata.requiredApprovals
  taskEntity.rewardAmount = taskMetadata.rewardAmount
  taskEntity.rewardToken = taskMetadata.rewardToken
  taskEntity.assignDate = taskMetadata.assignDate
  taskEntity.submitDate = taskMetadata.submitDate
  taskEntity.taskDuration = task.taskDuration
  taskEntity.comment = task.comment

  taskEntity.save()

  let tCountEntity = TaskCount.load(task.orgId.toString())
  if (!tCountEntity) {
    tCountEntity = new TaskCount(task.orgId.toString())
    tCountEntity.orgId = task.orgId
    tCountEntity.count = new BigInt(0)
  }
  tCountEntity.count = tCountEntity.count.plus(BigInt.fromI32(1))
  tCountEntity.save()

  const taskSnapshotEntity = createTaskSnapshot(event, taskEntity)
  taskSnapshotEntity.save()
}

export function handleTaskOpened(event: TaskOpenedEvent): void {
  const taskId = event.params.taskId.toString()
  const taskEntity = Task.load(taskId)
  if (!taskEntity) return
  taskEntity.status = 1
  taskEntity.rewardToken = event.params.rewardToken
  taskEntity.rewardAmount = event.params.rewardAmount
  taskEntity.save()

  const taskSnapshotEntity = createTaskSnapshot(event, taskEntity)
  taskSnapshotEntity.save()
}

export function handleTaskRevocation(event: TaskRevocationEvent): void {
  let taskEntity = Task.load(event.params.taskId.toString())
  if (!taskEntity) return
  let approvers = taskEntity.approvedBy
  if (approvers == null) return
  const index = approvers.indexOf(event.params.sender.toHexString())
  if (index != -1) {
    approvers.splice(index, 1)
    taskEntity.approvedBy = approvers
    taskEntity.save()
  }

  const taskSnapshotEntity = createTaskSnapshot(event, taskEntity)
  taskSnapshotEntity.save()
}

export function handleTaskSubmission(event: TaskSubmissionEvent): void {
  const taskId = event.params.taskId.toString()
  const taskEntity = Task.load(taskId)
  if (!taskEntity) return
  taskEntity.status = 3
  taskEntity.comment = event.params.comment
  taskEntity.submitDate = event.block.timestamp
  taskEntity.save()

  const taskSnapshotEntity = createTaskSnapshot(event, taskEntity)
  taskSnapshotEntity.save()
}

export function handleTaskUnassignment(event: TaskUnassignmentEvent): void {
  const taskId = event.params.taskId.toString()
  const taskEntity = Task.load(taskId)
  if (!taskEntity) return
  taskEntity.status = 1
  taskEntity.assignee = Address.zero().toHexString()
  taskEntity.save()

  const taskSnapshotEntity = createTaskSnapshot(event, taskEntity)
  taskSnapshotEntity.save()
}

export function handleTaskArchived(event: TaskArchivedEvent): void {
  const taskId = event.params.taskId.toString()
  const taskEntity = Task.load(taskId)
  if (!taskEntity) return
  taskEntity.status = 5
  taskEntity.save()

  const taskSnapshotEntity = createTaskSnapshot(event, taskEntity)
  taskSnapshotEntity.save()
}

export function handleTaskRevisionRequested(
  event: TaskRevisionRequestedEvent
): void {
  const revision = event.params.revision
  const entityId = revision.revisionId
  const revisionEntity = new TaskRevision(entityId.toHexString())

  revisionEntity.task = event.params.taskId.toString()
  revisionEntity.revisionId = revision.id
  revisionEntity.requester = revision.requester.toHexString()
  revisionEntity.externalRevisionId = revision.revisionId
  revisionEntity.revisionHash = revision.revisionHash
  revisionEntity.durationExtension = revision.durationExtension
  revisionEntity.durationExtensionRequest = revision.durationExtensionRequest
  revisionEntity.status = revision.status

  revisionEntity.save()
}

export function handleTaskRevisionAccepted(
  event: TaskRevisionAcceptedEvent
): void {
  const entityId = event.params.revisionId
  const revisionEntity = TaskRevision.load(entityId.toHexString())
  if (!revisionEntity) return
  revisionEntity.status = 2

  revisionEntity.save()
}

export function handleTaskRevisionChangesRequested(
  event: TaskRevisionChangesRequestedEvent
): void {
  const entityId = event.params.revisionId
  const revisionEntity = TaskRevision.load(entityId.toHexString())
  if (!revisionEntity) return
  revisionEntity.status = 2
  revisionEntity.durationExtensionRequest = event.params.durationExtension

  revisionEntity.save()
}
