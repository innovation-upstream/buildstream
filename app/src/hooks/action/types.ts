import { ethers } from 'ethers'

export enum ActionType {
  WITHDRAWAL,
  ADD_REVIEWER,
  ADD_APPROVER,
  ADD_SIGNER,
  REMOVE_REVIEWER,
  REMOVE_APPROVER,
  REMOVE_SIGNER
}

export const ActionTypeMap: Record<ActionType, string> = {
  [ActionType.WITHDRAWAL]: 'WITHDRAWAL',
  [ActionType.ADD_REVIEWER]: 'ADD_REVIEWER',
  [ActionType.ADD_APPROVER]: 'ADD_APPROVER',
  [ActionType.ADD_SIGNER]: 'ADD_SIGNER',
  [ActionType.REMOVE_REVIEWER]: 'REMOVE_REVIEWER',
  [ActionType.REMOVE_APPROVER]: 'REMOVE_APPROVER',
  [ActionType.REMOVE_SIGNER]: 'REMOVE_SIGNER'
}

export type Action = {
  id: number
  orgId: number
  initiator: string
  targetAddress: string
  value: ethers.BigNumber
  data: ethers.utils.Bytes
  executed: boolean
  tokenAddress: string
  actionType: ActionType
  approvedBy: string[]
}
