import { Address, BigInt } from '@graphprotocol/graph-ts'
import {
  Organization as Contract,
  OrganizationApproverAddition as OrganizationApproverAdditionEvent,
  OrganizationApproverRemoval as OrganizationApproverRemovalEvent,
  OrganizationCreation as OrganizationCreationEvent,
  OrganizationInitialized as OrganizationInitializedEvent,
  OrganizationReviewerAddition as OrganizationReviewerAdditionEvent,
  OrganizationReviewerRemoval as OrganizationReviewerRemovalEvent,
  OrganizationSignerAddition as OrganizationSignerAdditionEvent,
  OrganizationSignerRemoval as OrganizationSignerRemovalEvent
} from '../generated/Organization/Organization'
import { Organization, Treasury } from '../generated/schema'

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
  let contract = Contract.bind(event.address)
  const org = contract.getOrganization(orgId)
  const entity = new Organization(orgId.toString())

  const tEntity = new Treasury(orgId.toString())
  tEntity.orgId = event.params.orgId
  tEntity.save()

  entity.orgId = org.id
  entity.name = org.name
  entity.description = org.description
  entity.reviewers = org.reviewers.map<string>((a) => a.toHexString())
  entity.approvers = org.approvers.map<string>((a) => a.toHexString())
  entity.signers = org.signers.map<string>((a) => a.toHexString())
  entity.requiredTaskApprovals = new BigInt(0)
  entity.requiredConfirmations = new BigInt(0)
  entity.rewardMultiplier = new BigInt(0)
  entity.rewardToken = Address.zero()
  entity.rewardSlashDivisor = new BigInt(0)
  entity.slashRewardEvery = new BigInt(0)
  entity.isInitialized = false
  entity.treasury = orgId.toString()
  entity.save()
}

export function handleOrganizationInitialized(event: OrganizationInitializedEvent): void {
  const orgId = event.params.orgId
  let contract = Contract.bind(event.address)
  const orgConfig = contract.getOrganizationConfig(orgId)
  const entity = Organization.load(orgId.toString())

  if (!entity) return

  entity.requiredTaskApprovals = orgConfig.requiredTaskApprovals
  entity.requiredConfirmations = orgConfig.requiredConfirmations
  entity.rewardMultiplier = orgConfig.rewardMultiplier
  entity.rewardToken = orgConfig.rewardToken
  entity.rewardSlashDivisor = orgConfig.rewardSlashDivisor
  entity.slashRewardEvery = orgConfig.slashRewardEvery
  entity.isInitialized = true
  entity.save()
}

export function handleOrganizationReviewerAddition(
  event: OrganizationReviewerAdditionEvent
): void {
  let orgEntity = Organization.load(event.params._orgId.toString())
  if (!orgEntity) {
    return
  }
  let reviewers = orgEntity.reviewers
  if (!reviewers) return
  reviewers.push(event.params._reviewer.toHexString())
  orgEntity.reviewers = reviewers
  orgEntity.save()
}

export function handleOrganizationReviewerRemoval(
  event: OrganizationReviewerRemovalEvent
): void {
  let orgEntity = Organization.load(event.params._orgId.toString())
  if (!orgEntity) {
    return
  }
  let reviewers = orgEntity.reviewers || []
  const index = reviewers.indexOf(event.params._reviewer.toHexString())
  if (index != -1) {
    reviewers.splice(index, 1)
    orgEntity.reviewers = reviewers
    orgEntity.save()
  }
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
