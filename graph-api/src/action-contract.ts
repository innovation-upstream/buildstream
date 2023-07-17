import { BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts'
import {
  ActionConfirmation as ActionConfirmationEvent,
  ActionCreation as ActionCreationEvent,
  ActionExecution as ActionExecutionEvent
} from '../generated/ActionContract/ActionContract'
import {
  Action,
  ActionSnapshot,
  Notification,
  Organization,
  OrganizationSnapshot
} from '../generated/schema'
import { ACTION, TREASURY, WITHDRAWAL } from '../helpers/notification'

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
  UPDATE_TAG_REWARD_MULTIPLIER,
  ARCHIVE_ORGANIZATION,
  UNARCHIVE_ORGANIZATION
}

function createActionSnapshot(
  event: ethereum.Event,
  actionEntity: Action
): ActionSnapshot {
  const id = event.transaction.hash.toHex() + '-' + event.logIndex.toString()
  const actionSnapshotEntity = new ActionSnapshot(id)
  const entries = actionEntity.entries
  for (let i = 0; i < entries.length; i++) {
    if (entries[i].key === 'id') continue
    actionSnapshotEntity.set(entries[i].key, entries[i].value)
  }
  actionSnapshotEntity.id = id
  actionSnapshotEntity.block = event.block.number
  actionSnapshotEntity.timestamp = event.block.timestamp
  actionSnapshotEntity.actor = event.transaction.from.toHexString()

  return actionSnapshotEntity
}

function createOrganizationSnapshot(
  event: ethereum.Event,
  organizationEntity: Organization
): OrganizationSnapshot {
  const id = event.transaction.hash.toHex() + '-' + event.logIndex.toString()
  const organizationSnapshotEntity = new OrganizationSnapshot(id)
  const entries = organizationEntity.entries
  for (let i = 0; i < entries.length; i++) {
    if (entries[i].key === 'id') continue
    organizationSnapshotEntity.set(entries[i].key, entries[i].value)
  }
  organizationSnapshotEntity.id = id

  return organizationSnapshotEntity
}

export function handleActionConfirmation(event: ActionConfirmationEvent): void {
  let entity = Action.load(event.params.actionId.toString())
  if (!entity) return
  let approvers = entity.approvedBy
  if (approvers == null) approvers = []
  approvers.push(event.params.sender.toHexString())
  entity.approvedBy = approvers
  entity.updateCount = entity.updateCount.plus(BigInt.fromI32(1))
  entity.save()

  const actionSnapshotEntity = createActionSnapshot(event, entity)
  actionSnapshotEntity.save()

  const notificationEntity = new Notification(actionSnapshotEntity.id)
  let tags = [ACTION]
  if (entity.actionType === ActionType.WITHDRAWAL)
    tags = tags.concat([TREASURY, WITHDRAWAL])
  notificationEntity.tags = tags
  notificationEntity.action = entity.id
  notificationEntity.orgId = entity.orgId.toString()
  notificationEntity.actionSnapshot = actionSnapshotEntity.id
  notificationEntity.timestamp = event.block.timestamp
  notificationEntity.save()
}

export function handleActionCreation(event: ActionCreationEvent): void {
  const entity = new Action(event.params.actionId.toString())
  const action = event.params.action

  const orgId = event.params.orgId
  const organizationEntity = Organization.load(orgId.toString())
  if (!organizationEntity) return
  const organizationSnapshotEntity = createOrganizationSnapshot(
    event,
    organizationEntity
  )
  organizationSnapshotEntity.save()

  entity.actionId = event.params.actionId
  entity.orgId = action.orgId
  entity.initiator = action.initiator.toHexString()
  entity.targetAddress = action.targetAddress.toHexString()
  entity.value = action.value
  entity.data = action.data
  entity.executed = action.executed
  entity.tokenAddress = action.tokenAddress.toHexString()
  entity.actionType = action.actionType
  entity.initiatedAt = event.block.timestamp
  entity.organizationSnapshot = organizationSnapshotEntity.id
  entity.updateCount = BigInt.fromI32(0)
  entity.save()

  const actionSnapshotEntity = createActionSnapshot(event, entity)
  actionSnapshotEntity.save()

  const notificationEntity = new Notification(actionSnapshotEntity.id)
  let tags = [ACTION]
  if (action.actionType === ActionType.WITHDRAWAL)
    tags = tags.concat([TREASURY, WITHDRAWAL])
  notificationEntity.tags = tags
  notificationEntity.action = entity.id
  notificationEntity.orgId = entity.orgId.toString()
  notificationEntity.actionSnapshot = actionSnapshotEntity.id
  notificationEntity.timestamp = event.block.timestamp
  notificationEntity.save()
}

export function handleActionExecution(event: ActionExecutionEvent): void {
  let entity = Action.load(event.params.actionId.toString())
  if (!entity) return
  entity.executed = true
  entity.completedAt = event.block.timestamp
  entity.updateCount = entity.updateCount.plus(BigInt.fromI32(1))
  entity.save()

  const actionSnapshotEntity = createActionSnapshot(event, entity)
  actionSnapshotEntity.save()

  const notificationEntity = new Notification(actionSnapshotEntity.id)
  let tags = [ACTION]
  if (entity.actionType === ActionType.WITHDRAWAL)
    tags = tags.concat([TREASURY, WITHDRAWAL])
  notificationEntity.tags = tags
  notificationEntity.action = entity.id
  notificationEntity.orgId = entity.orgId.toString()
  notificationEntity.actionSnapshot = actionSnapshotEntity.id
  notificationEntity.timestamp = event.block.timestamp
  notificationEntity.save()

  if (
    entity.actionType === ActionType.ADD_APPROVER ||
    entity.actionType === ActionType.ADD_SIGNER ||
    entity.actionType === ActionType.REMOVE_APPROVER ||
    entity.actionType === ActionType.REMOVE_SIGNER
  )
    return

  const orgId = event.params.orgId
  const organizationEntity = Organization.load(orgId.toString())
  if (!organizationEntity) return

  if (entity.actionType === ActionType.UPDATE_NAME && entity.data)
    organizationEntity.name = (entity.data as Bytes).toString()

  if (entity.actionType === ActionType.UPDATE_DESCRIPTION && entity.data)
    organizationEntity.description = (entity.data as Bytes).toString()

  if (
    entity.actionType === ActionType.UPDATE_REQUIRED_TASK_APPROVALS &&
    entity.value
  )
    organizationEntity.requiredTaskApprovals = entity.value as BigInt

  if (
    entity.actionType === ActionType.UPDATE_REQUIRED_CONFIRMATIONS &&
    entity.value
  )
    organizationEntity.requiredConfirmations = entity.value as BigInt

  if (entity.actionType === ActionType.UPDATE_REWARD_MULTIPLIER && entity.value)
    organizationEntity.rewardMultiplier = entity.value as BigInt

  if (
    entity.actionType === ActionType.UPDATE_REWARD_TOKEN &&
    entity.targetAddress
  )
    organizationEntity.rewardToken = Bytes.fromHexString(
      entity.targetAddress as string
    )

  if (
    entity.actionType === ActionType.UPDATE_REWARD_SLASH_MULTIPLIER &&
    entity.value
  )
    organizationEntity.rewardSlashMultiplier = entity.value as BigInt

  if (
    entity.actionType === ActionType.UPDATE_SLASH_REWARD_EVERY &&
    entity.value
  )
    organizationEntity.slashRewardEvery = entity.value as BigInt

  if (
    entity.actionType === ActionType.ARCHIVE_ORGANIZATION &&
    entity.value
  )
    organizationEntity.isArchived = true

  if (
    entity.actionType === ActionType.UNARCHIVE_ORGANIZATION &&
    entity.value
  )
    organizationEntity.isArchived = false

  organizationEntity.save()
}
