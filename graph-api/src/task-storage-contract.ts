import {
  Notification,
  Organization,
  OrganizationStat,
  Task,
  TaskRevision,
  TaskSnapshot,
  Team,
  UserStat
} from '../generated/schema'

import {
  TaskArchived as TaskArchivedEvent,
  TaskAssignment as TaskAssignmentEvent,
  TaskAssignmentRequested as TaskAssignmentRequestedEvent,
  TaskClosed as TaskClosedEvent,
  TaskConfirmation as TaskConfirmationEvent,
  TaskCreation as TaskCreationEvent,
  TaskOpened as TaskOpenedEvent,
  TaskRevisionAccepted as TaskRevisionAcceptedEvent,
  TaskRevisionChangesRequested as TaskRevisionChangesRequestedEvent,
  TaskRevisionRejected as TaskRevisionRejectedEvent,
  TaskRevisionRequested as TaskRevisionRequestedEvent,
  TaskRevocation as TaskRevocationEvent,
  TaskSubmission as TaskSubmissionEvent,
  TaskUnassignment as TaskUnassignmentEvent,
  TaskUpdated as TaskUpdatedEvent
} from '../generated/TaskStorageContract/TaskStorageContract'

import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts'
import { TASK } from '../helpers/notification'

enum TaskStatus {
  PROPOSED,
  OPEN,
  ASSIGNED,
  SUBMITTED,
  CLOSED,
  ARCHIVED
}

export function createTaskSnapshot(
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

export function createTaskNotificationEntity(
  event: ethereum.Event,
  taskEntity: Task,
  taskSnapshotEntity: TaskSnapshot
): Notification {
  const notificationEntity = new Notification(taskSnapshotEntity.id.toString())
  if (taskSnapshotEntity.status >= TaskStatus.ASSIGNED) {
    const users = [] as string[]
    if (taskSnapshotEntity.assignee)
      users.push(taskSnapshotEntity.assignee as string)
    if (taskSnapshotEntity.teamAssignee)
      users.push(taskSnapshotEntity.teamAssignee as string)
    notificationEntity.users = users
  }
  notificationEntity.tags = [TASK]
  notificationEntity.orgId = taskEntity.orgId
  notificationEntity.task = taskEntity.id
  notificationEntity.taskSnapshot = taskSnapshotEntity.id
  notificationEntity.timestamp = event.block.timestamp
  return notificationEntity
}

function updateStats(taskEntity: Task, previousTaskEntity: Task | null): void {
  let assignee: string = Address.zero().toHexString()
  if (taskEntity && taskEntity.assignee)
    assignee = taskEntity.assignee as string
  let previousAssignee: string = Address.zero().toHexString()
  if (previousTaskEntity && previousTaskEntity.assignee)
    previousAssignee = previousTaskEntity.assignee as string
  const ONE = BigInt.fromI32(1)
  const ZERO = BigInt.fromI32(0)

  let previousUserStatsEntity = UserStat.load(previousAssignee)
  if (!previousUserStatsEntity) {
    previousUserStatsEntity = new UserStat(assignee)
    previousUserStatsEntity.proposedTasks = ZERO
    previousUserStatsEntity.openedTasks = ZERO
    previousUserStatsEntity.assignedTasks = ZERO
    previousUserStatsEntity.submittedTasks = ZERO
    previousUserStatsEntity.closedTasks = ZERO
    previousUserStatsEntity.archivedTasks = ZERO
  }
  let organizationStatsEntity = OrganizationStat.load(taskEntity.orgId)
  if (!organizationStatsEntity) {
    organizationStatsEntity = new OrganizationStat(taskEntity.orgId)
    organizationStatsEntity.proposedTasks = ZERO
    organizationStatsEntity.openedTasks = ZERO
    organizationStatsEntity.assignedTasks = ZERO
    organizationStatsEntity.submittedTasks = ZERO
    organizationStatsEntity.closedTasks = ZERO
    organizationStatsEntity.archivedTasks = ZERO
  }
  if (previousTaskEntity)
    switch (previousTaskEntity.status) {
      case TaskStatus.PROPOSED: {
        previousUserStatsEntity.proposedTasks = previousUserStatsEntity.proposedTasks.minus(
          ONE
        )
        organizationStatsEntity.proposedTasks = organizationStatsEntity.proposedTasks.minus(
          ONE
        )
        break
      }
      case TaskStatus.OPEN: {
        previousUserStatsEntity.openedTasks = previousUserStatsEntity.openedTasks.minus(
          ONE
        )
        organizationStatsEntity.openedTasks = organizationStatsEntity.openedTasks.minus(
          ONE
        )
        break
      }
      case TaskStatus.ASSIGNED: {
        previousUserStatsEntity.assignedTasks = previousUserStatsEntity.assignedTasks.minus(
          ONE
        )
        organizationStatsEntity.assignedTasks = organizationStatsEntity.assignedTasks.minus(
          ONE
        )
        break
      }
      case TaskStatus.SUBMITTED: {
        previousUserStatsEntity.submittedTasks = previousUserStatsEntity.submittedTasks.minus(
          ONE
        )
        organizationStatsEntity.submittedTasks = organizationStatsEntity.submittedTasks.minus(
          ONE
        )
        break
      }
      case TaskStatus.ARCHIVED: {
        previousUserStatsEntity.archivedTasks = previousUserStatsEntity.archivedTasks.minus(
          ONE
        )
        organizationStatsEntity.archivedTasks = organizationStatsEntity.archivedTasks.minus(
          ONE
        )
        break
      }
    }
  previousUserStatsEntity.save()

  let userStatsEntity = UserStat.load(assignee)
  if (!userStatsEntity) {
    userStatsEntity = new UserStat(assignee)
    userStatsEntity.proposedTasks = ZERO
    userStatsEntity.openedTasks = ZERO
    userStatsEntity.assignedTasks = ZERO
    userStatsEntity.submittedTasks = ZERO
    userStatsEntity.closedTasks = ZERO
    userStatsEntity.archivedTasks = ZERO
  }
  switch (taskEntity.status) {
    case TaskStatus.PROPOSED: {
      userStatsEntity.proposedTasks = ONE
      organizationStatsEntity.proposedTasks = ONE
      const taskTags = taskEntity.taskTags
      const organizationTags = (organizationStatsEntity.tags || []) as BigInt[]
      for (let i = 0; i < taskTags.length; i++) {
        const index = organizationTags.indexOf(taskTags[i] as BigInt)
        if (index === -1) organizationTags.push(taskTags[i] as BigInt)
      }
      if (!!organizationTags.length)
        organizationStatsEntity.tags = organizationTags
      break
    }
    case TaskStatus.OPEN: {
      userStatsEntity.openedTasks = userStatsEntity.openedTasks.plus(ONE)
      organizationStatsEntity.openedTasks = organizationStatsEntity.openedTasks.plus(
        ONE
      )
      break
    }
    case TaskStatus.ASSIGNED: {
      userStatsEntity.assignedTasks = userStatsEntity.assignedTasks.plus(ONE)
      organizationStatsEntity.assignedTasks = organizationStatsEntity.assignedTasks.plus(
        ONE
      )
      break
    }
    case TaskStatus.SUBMITTED: {
      userStatsEntity.submittedTasks = userStatsEntity.submittedTasks.plus(ONE)
      organizationStatsEntity.submittedTasks = organizationStatsEntity.submittedTasks.plus(
        ONE
      )
      break
    }
    case TaskStatus.CLOSED: {
      userStatsEntity.closedTasks = userStatsEntity.closedTasks.plus(ONE)
      organizationStatsEntity.closedTasks = organizationStatsEntity.closedTasks.plus(
        ONE
      )
      break
    }
    case TaskStatus.ARCHIVED: {
      userStatsEntity.archivedTasks = userStatsEntity.archivedTasks.plus(ONE)
      organizationStatsEntity.archivedTasks = organizationStatsEntity.archivedTasks.plus(
        ONE
      )
      break
    }
  }

  userStatsEntity.save()
  organizationStatsEntity.save()
}

export function getRawData(taskEntity: Task): string {
  const organizationEntity = Organization.load(taskEntity.orgId) as Organization
  const teamEntity = taskEntity.team
    ? Team.load(taskEntity.team as string)
    : null

  return `${taskEntity.title ? (taskEntity.title as string) : ''} ~ ${
    taskEntity.description ? (taskEntity.description as string) : ''
  } ~ ${organizationEntity.name.toString()} ~ ${
    taskEntity.assignee !== null &&
    taskEntity.assignee !== Address.zero().toHexString()
      ? (taskEntity.assignee as string)
      : ''
  } ~ ${teamEntity ? teamEntity.name.toString() : ''}
  ~ ${teamEntity ? (taskEntity.teamAssignee as string) : ''}`
}

export function handleTaskAssignment(event: TaskAssignmentEvent): void {
  const taskId = event.params.taskId.toString()
  const prevTEntity = Task.load(taskId)
  const taskEntity = Task.load(taskId)
  if (!taskEntity) return
  taskEntity.status = 2
  taskEntity.assignee = event.params.assignee.toHexString()
  taskEntity.team = event.params.assignee.toHexString()
  taskEntity.assigner = event.transaction.from.toHexString()
  taskEntity.assignDate = event.block.timestamp
  taskEntity.staked = event.params.staked

  taskEntity.raw = getRawData(taskEntity)

  taskEntity.save()

  const organizationEntity = Organization.load(taskEntity.orgId) as Organization
  let members = organizationEntity.members
  if (!members) members = []
  if (members.indexOf(event.params.assignee.toHexString()) === -1) {
    members.push(event.params.assignee.toHexString())
    organizationEntity.members = members
    organizationEntity.save()
  }

  const taskSnapshotEntity = createTaskSnapshot(event, taskEntity)
  taskSnapshotEntity.save()
  updateStats(taskEntity, prevTEntity)

  const notificationEntity = createTaskNotificationEntity(
    event,
    taskEntity,
    taskSnapshotEntity
  )
  notificationEntity.save()
}

export function handleTaskAssignmentRequest(
  event: TaskAssignmentRequestedEvent
): void {
  let taskEntity = Task.load(event.params.taskId.toString())
  if (!taskEntity) return
  let assignmentRequests = taskEntity.assignmentRequest
  if (assignmentRequests == null) assignmentRequests = []

  if (assignmentRequests.includes(event.params.assignee.toHexString())) return

  assignmentRequests.push(event.params.assignee.toHexString())
  taskEntity.assignmentRequest = assignmentRequests
  taskEntity.save()
  const taskSnapshotEntity = createTaskSnapshot(event, taskEntity)
  taskSnapshotEntity.save()

  const notificationEntity = createTaskNotificationEntity(
    event,
    taskEntity,
    taskSnapshotEntity
  )
  notificationEntity.users = [event.params.assignee.toHexString()]
  notificationEntity.save()
}

export function handleTaskClosed(event: TaskClosedEvent): void {
  const taskId = event.params.taskId.toString()
  const prevTEntity = Task.load(taskId)
  const taskEntity = Task.load(taskId)
  if (!taskEntity) return
  taskEntity.status = 4
  taskEntity.save()
  const taskSnapshotEntity = createTaskSnapshot(event, taskEntity)
  taskSnapshotEntity.save()
  updateStats(taskEntity, prevTEntity)

  const notificationEntity = createTaskNotificationEntity(
    event,
    taskEntity,
    taskSnapshotEntity
  )
  notificationEntity.save()
}

export function handleTaskUpdated(event: TaskUpdatedEvent): void {
  const task = event.params.task
  const taskMetadata = event.params.taskMetadata

  const taskEntity = Task.load(event.params.taskId.toString())
  if (!taskEntity) return
  taskEntity.title = task.title
  taskEntity.description = task.description
  taskEntity.taskTags = task.taskTags
  taskEntity.complexityScore = task.complexityScore
  taskEntity.reputationLevel = task.reputationLevel
  taskEntity.dueDate = task.dueDate
  taskEntity.disableSelfAssign = taskMetadata.disableSelfAssign

  taskEntity.raw = getRawData(taskEntity)

  taskEntity.save()
  const taskSnapshotEntity = createTaskSnapshot(event, taskEntity)
  taskSnapshotEntity.save()

  const notificationEntity = createTaskNotificationEntity(
    event,
    taskEntity,
    taskSnapshotEntity
  )
  notificationEntity.save()
}

export function handleTaskConfirmation(event: TaskConfirmationEvent): void {
  let taskEntity = Task.load(event.params.taskId.toString())
  if (!taskEntity) return
  let approvers = taskEntity.approvedBy
  if (approvers == null) approvers = []
  approvers.push(event.params.approver.toHexString())
  taskEntity.approvedBy = approvers
  taskEntity.save()
  const taskSnapshotEntity = createTaskSnapshot(event, taskEntity)
  taskSnapshotEntity.save()

  const notificationEntity = createTaskNotificationEntity(
    event,
    taskEntity,
    taskSnapshotEntity
  )
  notificationEntity.save()
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
  taskEntity.dueDate = task.dueDate
  taskEntity.comment = task.comment
  taskEntity.staked = false
  taskEntity.externalId = task.externalId
  taskEntity.disableSelfAssign = taskMetadata.disableSelfAssign

  taskEntity.raw = getRawData(taskEntity)
  taskEntity.save()

  const taskSnapshotEntity = createTaskSnapshot(event, taskEntity)
  taskSnapshotEntity.save()
  updateStats(taskEntity, null)

  const notificationEntity = createTaskNotificationEntity(
    event,
    taskEntity,
    taskSnapshotEntity
  )
  notificationEntity.save()
}

export function handleTaskOpened(event: TaskOpenedEvent): void {
  const taskId = event.params.taskId.toString()
  const prevTEntity = Task.load(taskId)
  const taskEntity = Task.load(taskId)
  if (!taskEntity) return
  taskEntity.status = 1
  taskEntity.rewardToken = event.params.rewardToken
  taskEntity.rewardAmount = event.params.rewardAmount
  taskEntity.disableSelfAssign = event.params.disableSelfAssign
  taskEntity.save()

  const taskSnapshotEntity = createTaskSnapshot(event, taskEntity)
  taskSnapshotEntity.save()
  updateStats(taskEntity, prevTEntity)

  const notificationEntity = createTaskNotificationEntity(
    event,
    taskEntity,
    taskSnapshotEntity
  )
  notificationEntity.save()
}

export function handleTaskRevocation(event: TaskRevocationEvent): void {
  let taskEntity = Task.load(event.params.taskId.toString())
  if (!taskEntity) return
  let approvers = taskEntity.approvedBy
  if (approvers == null) return
  const index = approvers.indexOf(event.params.approver.toHexString())
  if (index != -1) {
    approvers.splice(index, 1)
    taskEntity.approvedBy = approvers
    taskEntity.save()
  }

  const taskSnapshotEntity = createTaskSnapshot(event, taskEntity)
  taskSnapshotEntity.save()

  const notificationEntity = createTaskNotificationEntity(
    event,
    taskEntity,
    taskSnapshotEntity
  )
  notificationEntity.save()
}

export function handleTaskSubmission(event: TaskSubmissionEvent): void {
  const taskId = event.params.taskId.toString()
  const prevTEntity = Task.load(taskId)
  const taskEntity = Task.load(taskId)
  if (!taskEntity) return
  taskEntity.status = 3
  taskEntity.comment = event.params.comment
  taskEntity.submitDate = event.block.timestamp
  taskEntity.save()

  const taskSnapshotEntity = createTaskSnapshot(event, taskEntity)
  taskSnapshotEntity.save()
  updateStats(taskEntity, prevTEntity)

  const notificationEntity = createTaskNotificationEntity(
    event,
    taskEntity,
    taskSnapshotEntity
  )
  notificationEntity.save()
}

export function handleTaskUnassignment(event: TaskUnassignmentEvent): void {
  const taskId = event.params.taskId.toString()
  const prevTEntity = Task.load(taskId)
  const taskEntity = Task.load(taskId)
  if (!taskEntity) return
  taskEntity.status = 1
  taskEntity.assignee = Address.zero().toHexString()
  taskEntity.team = Address.zero().toHexString()
  taskEntity.teamAssignee = Address.zero().toHexString()

  taskEntity.raw = getRawData(taskEntity)

  taskEntity.save()

  const taskSnapshotEntity = createTaskSnapshot(event, taskEntity)
  taskSnapshotEntity.save()
  updateStats(taskEntity, prevTEntity)

  const notificationEntity = createTaskNotificationEntity(
    event,
    taskEntity,
    taskSnapshotEntity
  )
  notificationEntity.save()
}

export function handleTaskArchived(event: TaskArchivedEvent): void {
  const taskId = event.params.taskId.toString()
  const prevTEntity = Task.load(taskId)
  const taskEntity = Task.load(taskId)
  if (!taskEntity) return
  taskEntity.status = 5
  taskEntity.save()

  const taskSnapshotEntity = createTaskSnapshot(event, taskEntity)
  taskSnapshotEntity.save()
  updateStats(taskEntity, prevTEntity)

  const notificationEntity = createTaskNotificationEntity(
    event,
    taskEntity,
    taskSnapshotEntity
  )
  notificationEntity.save()
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
  revisionEntity.dueDateExtension = revision.dueDateExtension
  revisionEntity.dueDateExtensionRequest = revision.dueDateExtensionRequest
  revisionEntity.status = revision.status

  const taskId = event.params.taskId.toString()
  const taskEntity = Task.load(taskId)
  if (!taskEntity) return
  const taskSnapshotEntity = createTaskSnapshot(event, taskEntity)
  taskSnapshotEntity.save()

  revisionEntity.taskSnapshot = taskSnapshotEntity.id
  revisionEntity.save()

  const notificationEntity = createTaskNotificationEntity(
    event,
    taskEntity,
    taskSnapshotEntity
  )
  notificationEntity.save()
}

export function handleTaskRevisionAccepted(
  event: TaskRevisionAcceptedEvent
): void {
  const entityId = event.params.revisionId
  const revisionEntity = TaskRevision.load(entityId.toHexString())
  if (!revisionEntity) return
  revisionEntity.status = 2

  revisionEntity.save()

  const taskId = event.params.taskId.toString()
  const taskEntity = Task.load(taskId)
  if (!taskEntity) return
  taskEntity.status = 2
  taskEntity.dueDate = event.params.dueDate
  taskEntity.save()

  const taskSnapshotEntity = createTaskSnapshot(event, taskEntity)
  taskSnapshotEntity.save()

  const notificationEntity = createTaskNotificationEntity(
    event,
    taskEntity,
    taskSnapshotEntity
  )
  notificationEntity.save()
}

export function handleTaskRevisionRejected(
  event: TaskRevisionRejectedEvent
): void {
  const entityId = event.params.revisionId
  const revisionEntity = TaskRevision.load(entityId.toHexString())
  if (!revisionEntity) return
  revisionEntity.status = 3

  revisionEntity.save()
}

export function handleTaskRevisionChangesRequested(
  event: TaskRevisionChangesRequestedEvent
): void {
  const entityId = event.params.revisionId
  const revisionEntity = TaskRevision.load(entityId.toHexString())
  if (!revisionEntity) return
  revisionEntity.status = 1
  revisionEntity.dueDateExtensionRequest = event.params.dueDateExtension

  revisionEntity.save()
}
