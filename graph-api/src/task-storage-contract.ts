import { Task, TaskCount, TaskSnapshot } from '../generated/schema'

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
  TaskUpdated as TaskUpdatedEvent
} from '../generated/TaskStorageContract/TaskStorageContract'

import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts'
import { TaskStorageContract as Contract } from '../generated/TaskStorageContract/TaskStorageContract'

function createTaskSnapshot(
  event: ethereum.Event,
  taskEntity: Task
): TaskSnapshot {
  const taskSnapshotEntity = new TaskSnapshot(
    event.transaction.hash.toHex() + '-' + event.logIndex.toString()
  )
  const entries = taskEntity.entries
  for (let i = 0; i < entries.length; i++) {
    if (entries[i].key === 'id') continue
    taskSnapshotEntity.set(entries[i].key, entries[i].value)
  }
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
  const contract = Contract.bind(event.address)
  const task = contract.getTask(event.params.taskId)

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
  const contract = Contract.bind(event.address)
  const task = contract.getTask(event.params.taskId)
  const taskEntity = new Task(taskId)

  taskEntity.taskId = event.params.taskId
  taskEntity.orgId = task.orgId.toString()
  taskEntity.title = task.title
  taskEntity.description = task.description
  taskEntity.assigner = task.assigner.toHexString()
  taskEntity.assignee = task.assigneeAddress.toHexString()
  taskEntity.taskTags = task.taskTags
  taskEntity.status = task.status
  taskEntity.complexityScore = task.complexityScore
  taskEntity.reputationLevel = task.reputationLevel
  taskEntity.requiredApprovals = task.requiredApprovals
  taskEntity.rewardAmount = task.rewardAmount
  taskEntity.rewardToken = task.rewardToken
  taskEntity.assignDate = task.assignDate
  taskEntity.submitDate = task.submitDate
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
  const contract = Contract.bind(event.address)
  const task = contract.getTask(event.params.taskId)
  const taskEntity = Task.load(taskId)
  if (!taskEntity) return
  taskEntity.status = 1
  taskEntity.rewardToken = task.rewardToken
  taskEntity.rewardAmount = task.rewardAmount
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
  const contract = Contract.bind(event.address)
  const task = contract.getTask(event.params.taskId)
  const taskEntity = Task.load(taskId)
  if (!taskEntity) return
  taskEntity.status = 3
  taskEntity.comment = task.comment
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
