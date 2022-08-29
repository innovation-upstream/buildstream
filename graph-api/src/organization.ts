import {
  Organization as Contract,
  OrganizationApproverAddition as OrganizationApproverAdditionEvent,
  OrganizationApproverRemoval as OrganizationApproverRemovalEvent,
  OrganizationCreation as OrganizationCreationEvent,
  OrganizationReviewerAddition as OrganizationReviewerAdditionEvent,
  OrganizationReviewerRemoval as OrganizationReviewerRemovalEvent,
  OrganizationSignerAddition as OrganizationSignerAdditionEvent,
  OrganizationSignerRemoval as OrganizationSignerRemovalEvent
} from '../generated/Organization/Organization'
import {
  Organization,
  User,
  UserOrganizations,
  UserRoles
} from '../generated/schema'

export function handleOrganizationApproverAddition(
  event: OrganizationApproverAdditionEvent
): void {
  let orgEntity = Organization.load(event.params._orgId.toString())
  if (!orgEntity) {
    return
  }
  let approvers = orgEntity.approvers || []
  approvers.push(event.params._approver.toString())
  orgEntity.approvers = approvers
  let entity = User.load(event.params._approver.toString())
  if (!entity) {
    const address = event.params._approver.toString()
    const ur = new UserRoles(address)
    ur.save()
    const uo = new UserOrganizations(address)
    uo.roles = address
    uo.save()
    const u = new User(address)
    u.organizations = address
    u.save()
  }
}

export function handleOrganizationApproverRemoval(
  event: OrganizationApproverRemovalEvent
): void {
  let orgEntity = Organization.load(event.params._orgId.toString())
  if (!orgEntity) {
    return
  }
  let approvers = orgEntity.approvers || []
  const index = approvers.indexOf(event.params._approver.toString())
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
  const orgConfig = contract.getOrganizationConfig(orgId)
  const entity = new Organization(orgId.toString())

  entity.orgId = org.id
  entity.name = org.name
  entity.description = org.description
  entity.reviewers = org.reviewers.map<string>((a) => a.toHexString())
  entity.approvers = org.approvers.map<string>((a) => a.toHexString())
  entity.signers = org.signers.map<string>((a) => a.toHexString())
  entity.requiredTaskApprovals = orgConfig.requiredTaskApprovals
  entity.requiredConfirmations = orgConfig.requiredConfirmations
  entity.rewardMultiplier = orgConfig.rewardMultiplier
  entity.rewardToken = orgConfig.rewardToken
  entity.save()

  for (let i = 0; i < org.approvers.length; i++) {
    const a = org.approvers[i]
    let userEntity = User.load(a.toHexString())
    if (!userEntity) {
      const ur = new UserRoles(a.toHexString())
      ur.save()
      const uo = new UserOrganizations(a.toHexString())
      uo.roles = a.toHexString()
      uo.save()
      const u = new User(a.toHexString())
      u.organizations = a.toHexString()
      u.save()
    }
  }

  for (let i = 0; i < org.reviewers.length; i++) {
    const a = org.reviewers[i]
    let userEntity = User.load(a.toHexString())
    if (!userEntity) {
      const ur = new UserRoles(a.toHexString())
      ur.save()
      const uo = new UserOrganizations(a.toHexString())
      uo.roles = a.toHexString()
      uo.save()
      const u = new User(a.toHexString())
      u.organizations = a.toHexString()
      u.save()
    }
  }

  for (let i = 0; i < org.signers.length; i++) {
    const a = org.signers[i]
    let userEntity = User.load(a.toHexString())
    if (!userEntity) {
      const ur = new UserRoles(a.toHexString())
      ur.save()
      const uo = new UserOrganizations(a.toHexString())
      uo.roles = a.toHexString()
      uo.save()
      const u = new User(a.toHexString())
      u.organizations = a.toHexString()
      u.save()
    }
  }
}

export function handleOrganizationReviewerAddition(
  event: OrganizationReviewerAdditionEvent
): void {
  let orgEntity = Organization.load(event.params._orgId.toString())
  if (!orgEntity) {
    return
  }
  let reviewers = orgEntity.reviewers || []
  reviewers.push(event.params._reviewer.toString())
  orgEntity.reviewers = reviewers
  let entity = User.load(event.params._reviewer.toString())
  if (!entity) {
    const address = event.params._reviewer.toString()
    const ur = new UserRoles(address)
    ur.save()
    const uo = new UserOrganizations(address)
    uo.roles = address
    uo.save()
    const u = new User(address)
    u.organizations = address
    u.save()
  }
}

export function handleOrganizationReviewerRemoval(
  event: OrganizationReviewerRemovalEvent
): void {
  let orgEntity = Organization.load(event.params._orgId.toString())
  if (!orgEntity) {
    return
  }
  let reviewers = orgEntity.reviewers || []
  const index = reviewers.indexOf(event.params._reviewer.toString())
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
  signers.push(event.params._signer.toString())
  orgEntity.signers = signers
  let entity = User.load(event.params._signer.toString())
  if (!entity) {
    const address = event.params._signer.toString()
    const ur = new UserRoles(address)
    ur.save()
    const uo = new UserOrganizations(address)
    uo.roles = address
    uo.save()
    const u = new User(address)
    u.organizations = address
    u.save()
  }
}

export function handleOrganizationSignerRemoval(
  event: OrganizationSignerRemovalEvent
): void {
  let orgEntity = Organization.load(event.params._orgId.toString())
  if (!orgEntity) {
    return
  }
  let signers = orgEntity.signers || []
  const index = signers.indexOf(event.params._signer.toString())
  if (index != -1) {
    signers.splice(index, 1)
    orgEntity.signers = signers
    orgEntity.save()
  }
}
