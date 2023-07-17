import { Address, BigInt } from '@graphprotocol/graph-ts'
import {
  OrganizationApproverAddition as OrganizationApproverAdditionEvent,
  OrganizationApproverRemoval as OrganizationApproverRemovalEvent,
  OrganizationCreation as OrganizationCreationEvent,
  OrganizationInitialized as OrganizationInitializedEvent,
  OrganizationSignerAddition as OrganizationSignerAdditionEvent,
  OrganizationSignerRemoval as OrganizationSignerRemovalEvent
} from '../generated/Organization/Organization'
import { Organization, OrganizationStat, Treasury } from '../generated/schema'

export function handleOrganizationApproverAddition(
  event: OrganizationApproverAdditionEvent
): void {
  let orgEntity = Organization.load(event.params._orgId.toString())
  if (!orgEntity) {
    return
  }
  let approvers = orgEntity.approvers || []
  approvers.push(event.params._approver.toHexString())
  orgEntity.approvers = approvers
  orgEntity.save()
}

export function handleOrganizationApproverRemoval(
  event: OrganizationApproverRemovalEvent
): void {
  let orgEntity = Organization.load(event.params._orgId.toString())
  if (!orgEntity) {
    return
  }
  let approvers = orgEntity.approvers
  if (!approvers) return
  const index = approvers.indexOf(event.params._approver.toHexString())
  if (index != -1) {
    approvers.splice(index, 1)
    orgEntity.approvers = approvers
    orgEntity.save()
  }
}

export function handleOrganizationCreation(
  event: OrganizationCreationEvent
): void {
  const orgId = event.params.orgId
  const org = event.params.org
  const entity = new Organization(orgId.toString())

  const tEntity = new Treasury(orgId.toString())
  tEntity.orgId = event.params.orgId
  tEntity.save()

  const organizationStatsEntity = new OrganizationStat(org.id.toString())
  organizationStatsEntity.proposedTasks = BigInt.fromI32(0)
  organizationStatsEntity.openedTasks = BigInt.fromI32(0)
  organizationStatsEntity.assignedTasks = BigInt.fromI32(0)
  organizationStatsEntity.submittedTasks = BigInt.fromI32(0)
  organizationStatsEntity.closedTasks = BigInt.fromI32(0)
  organizationStatsEntity.archivedTasks = BigInt.fromI32(0)
  organizationStatsEntity.save()

  entity.orgId = org.id
  entity.stat = org.id.toString()
  entity.name = org.name
  entity.description = org.description
  entity.approvers = org.approvers.map<string>((a) => a.toHexString())
  entity.signers = org.signers.map<string>((a) => a.toHexString())
  entity.requiredTaskApprovals = BigInt.fromI32(0)
  entity.requiredConfirmations = BigInt.fromI32(0)
  entity.rewardMultiplier = BigInt.fromI32(0)
  entity.rewardToken = Address.zero()
  entity.rewardSlashMultiplier = BigInt.fromI32(0)
  entity.slashRewardEvery = BigInt.fromI32(0)
  entity.isInitialized = false
  entity.isArchived = false
  entity.treasury = orgId.toString()
  entity.save()
}

export function handleOrganizationInitialized(
  event: OrganizationInitializedEvent
): void {
  const orgId = event.params.orgId
  const orgConfig = event.params.config
  const entity = Organization.load(orgId.toString())

  if (!entity) return

  entity.requiredTaskApprovals = orgConfig.requiredTaskApprovals
  entity.requiredConfirmations = orgConfig.requiredConfirmations
  entity.rewardMultiplier = orgConfig.rewardMultiplier
  entity.rewardToken = orgConfig.rewardToken
  entity.rewardSlashMultiplier = orgConfig.rewardSlashMultiplier
  entity.slashRewardEvery = orgConfig.slashRewardEvery
  entity.isInitialized = true
  entity.save()
}

export function handleOrganizationSignerAddition(
  event: OrganizationSignerAdditionEvent
): void {
  let orgEntity = Organization.load(event.params._orgId.toString())
  if (!orgEntity) {
    return
  }
  let signers = orgEntity.signers || []
  signers.push(event.params._signer.toHexString())
  orgEntity.signers = signers
  orgEntity.save()
}

export function handleOrganizationSignerRemoval(
  event: OrganizationSignerRemovalEvent
): void {
  let orgEntity = Organization.load(event.params._orgId.toString())
  if (!orgEntity) {
    return
  }
  let signers = orgEntity.signers
  if (!signers) return
  const index = signers.indexOf(event.params._signer.toHexString())
  if (index != -1) {
    signers.splice(index, 1)
    orgEntity.signers = signers
    orgEntity.save()
  }
}
