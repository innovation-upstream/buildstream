import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  ApproverAddition,
  ApproverRemoval,
  OrganizationCreation,
  RequirementChange,
  ReviewerAddition,
  ReviewerRemoval,
  SignerAddition,
  SignerRemoval
} from "../generated/Organization/Organization"

export function createApproverAdditionEvent(
  _orgId: BigInt,
  _approver: Address
): ApproverAddition {
  let approverAdditionEvent = changetype<ApproverAddition>(newMockEvent())

  approverAdditionEvent.parameters = new Array()

  approverAdditionEvent.parameters.push(
    new ethereum.EventParam("_orgId", ethereum.Value.fromUnsignedBigInt(_orgId))
  )
  approverAdditionEvent.parameters.push(
    new ethereum.EventParam("_approver", ethereum.Value.fromAddress(_approver))
  )

  return approverAdditionEvent
}

export function createApproverRemovalEvent(
  _orgId: BigInt,
  _approver: Address
): ApproverRemoval {
  let approverRemovalEvent = changetype<ApproverRemoval>(newMockEvent())

  approverRemovalEvent.parameters = new Array()

  approverRemovalEvent.parameters.push(
    new ethereum.EventParam("_orgId", ethereum.Value.fromUnsignedBigInt(_orgId))
  )
  approverRemovalEvent.parameters.push(
    new ethereum.EventParam("_approver", ethereum.Value.fromAddress(_approver))
  )

  return approverRemovalEvent
}

export function createOrganizationCreationEvent(
  orgId: BigInt
): OrganizationCreation {
  let organizationCreationEvent = changetype<OrganizationCreation>(
    newMockEvent()
  )

  organizationCreationEvent.parameters = new Array()

  organizationCreationEvent.parameters.push(
    new ethereum.EventParam("orgId", ethereum.Value.fromUnsignedBigInt(orgId))
  )

  return organizationCreationEvent
}

export function createRequirementChangeEvent(
  _orgId: BigInt,
  required: BigInt
): RequirementChange {
  let requirementChangeEvent = changetype<RequirementChange>(newMockEvent())

  requirementChangeEvent.parameters = new Array()

  requirementChangeEvent.parameters.push(
    new ethereum.EventParam("_orgId", ethereum.Value.fromUnsignedBigInt(_orgId))
  )
  requirementChangeEvent.parameters.push(
    new ethereum.EventParam(
      "required",
      ethereum.Value.fromUnsignedBigInt(required)
    )
  )

  return requirementChangeEvent
}

export function createReviewerAdditionEvent(
  _orgId: BigInt,
  _reviewer: Address
): ReviewerAddition {
  let reviewerAdditionEvent = changetype<ReviewerAddition>(newMockEvent())

  reviewerAdditionEvent.parameters = new Array()

  reviewerAdditionEvent.parameters.push(
    new ethereum.EventParam("_orgId", ethereum.Value.fromUnsignedBigInt(_orgId))
  )
  reviewerAdditionEvent.parameters.push(
    new ethereum.EventParam("_reviewer", ethereum.Value.fromAddress(_reviewer))
  )

  return reviewerAdditionEvent
}

export function createReviewerRemovalEvent(
  _orgId: BigInt,
  _reviewer: Address
): ReviewerRemoval {
  let reviewerRemovalEvent = changetype<ReviewerRemoval>(newMockEvent())

  reviewerRemovalEvent.parameters = new Array()

  reviewerRemovalEvent.parameters.push(
    new ethereum.EventParam("_orgId", ethereum.Value.fromUnsignedBigInt(_orgId))
  )
  reviewerRemovalEvent.parameters.push(
    new ethereum.EventParam("_reviewer", ethereum.Value.fromAddress(_reviewer))
  )

  return reviewerRemovalEvent
}

export function createSignerAdditionEvent(
  _orgId: BigInt,
  _signer: Address
): SignerAddition {
  let signerAdditionEvent = changetype<SignerAddition>(newMockEvent())

  signerAdditionEvent.parameters = new Array()

  signerAdditionEvent.parameters.push(
    new ethereum.EventParam("_orgId", ethereum.Value.fromUnsignedBigInt(_orgId))
  )
  signerAdditionEvent.parameters.push(
    new ethereum.EventParam("_signer", ethereum.Value.fromAddress(_signer))
  )

  return signerAdditionEvent
}

export function createSignerRemovalEvent(
  _orgId: BigInt,
  _signer: Address
): SignerRemoval {
  let signerRemovalEvent = changetype<SignerRemoval>(newMockEvent())

  signerRemovalEvent.parameters = new Array()

  signerRemovalEvent.parameters.push(
    new ethereum.EventParam("_orgId", ethereum.Value.fromUnsignedBigInt(_orgId))
  )
  signerRemovalEvent.parameters.push(
    new ethereum.EventParam("_signer", ethereum.Value.fromAddress(_signer))
  )

  return signerRemovalEvent
}
