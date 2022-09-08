import {
  ActionConfirmation as ActionConfirmationEvent,
  ActionContract as Contract,
  ActionCreation as ActionCreationEvent,
  ActionExecution as ActionExecutionEvent
} from '../generated/ActionContract/ActionContract'
import { Action } from '../generated/schema'

export function handleActionConfirmation(event: ActionConfirmationEvent): void {
  let entity = Action.load(event.params.actionId.toString())
  if (!entity) return
  let approvers = entity.approvedBy
  if (approvers == null)
    approvers = []
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
  entity.save()
}

export function handleActionExecution(event: ActionExecutionEvent): void {
  let entity = Action.load(event.params.actionId.toString())
  if (!entity) return
  entity.executed = true
  entity.save()
}
