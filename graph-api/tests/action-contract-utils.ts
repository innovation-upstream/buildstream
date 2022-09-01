import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  ActionConfirmation,
  ActionCreation
} from "../generated/ActionContract/ActionContract"

export function createActionConfirmationEvent(
  orgId: BigInt,
  sender: Address,
  actionId: BigInt
): ActionConfirmation {
  let actionConfirmationEvent = changetype<ActionConfirmation>(newMockEvent())

  actionConfirmationEvent.parameters = new Array()

  actionConfirmationEvent.parameters.push(
    new ethereum.EventParam("orgId", ethereum.Value.fromUnsignedBigInt(orgId))
  )
  actionConfirmationEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  actionConfirmationEvent.parameters.push(
    new ethereum.EventParam(
      "actionId",
      ethereum.Value.fromUnsignedBigInt(actionId)
    )
  )

  return actionConfirmationEvent
}

export function createActionCreationEvent(
  orgId: BigInt,
  actionId: BigInt
): ActionCreation {
  let actionCreationEvent = changetype<ActionCreation>(newMockEvent())

  actionCreationEvent.parameters = new Array()

  actionCreationEvent.parameters.push(
    new ethereum.EventParam("orgId", ethereum.Value.fromUnsignedBigInt(orgId))
  )
  actionCreationEvent.parameters.push(
    new ethereum.EventParam(
      "actionId",
      ethereum.Value.fromUnsignedBigInt(actionId)
    )
  )

  return actionCreationEvent
}
