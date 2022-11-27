import { Address, BigInt } from '@graphprotocol/graph-ts'
import {
  ActionConfirmation as ActionConfirmationEvent,
  ActionContract as Contract,
  ActionCreation as ActionCreationEvent,
  ActionExecution as ActionExecutionEvent
} from '../generated/ActionContract/ActionContract'
import { Action, Organization } from '../generated/schema'
import { Organization as OrganizationContract } from '../generated/Organization/Organization'

const organizationAddress = '0xbE4929ae823B0b5E796b27C9567A6098B6173780'

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

export function handleActionConfirmation(event: ActionConfirmationEvent): void {
  let entity = Action.load(event.params.actionId.toString())
  if (!entity) return
  let approvers = entity.approvedBy
  if (approvers == null) approvers = []
  approvers.push(event.params.sender.toHexString())
  entity.approvedBy = approvers
  entity.save()
}

export function handleActionCreation(event: ActionCreationEvent): void {
  const entity = new Action(event.params.actionId.toString())
  const contract = Contract.bind(event.address)
  const action = contract.getAction(event.params.actionId)

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
  entity.save()
}

export function handleActionExecution(event: ActionExecutionEvent): void {
  let entity = Action.load(event.params.actionId.toString())
  if (!entity) return
  entity.executed = true
  entity.completedAt = event.block.timestamp
  entity.save()

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

  let contract = OrganizationContract.bind(
    Address.fromString(organizationAddress)
  )
  const org = contract.getOrganization(orgId)
  const orgConfig = contract.getOrganizationConfig(orgId)

  organizationEntity.name = org.name
  organizationEntity.description = org.description
  organizationEntity.requiredTaskApprovals = orgConfig.requiredTaskApprovals
  organizationEntity.requiredConfirmations = orgConfig.requiredConfirmations
  organizationEntity.rewardMultiplier = orgConfig.rewardMultiplier
  organizationEntity.rewardToken = orgConfig.rewardToken
  organizationEntity.rewardSlashMultiplier = orgConfig.rewardSlashMultiplier
  organizationEntity.slashRewardEvery = orgConfig.slashRewardEvery
  organizationEntity.save()
}
