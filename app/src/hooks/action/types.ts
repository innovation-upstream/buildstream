import { BigNumber, ethers } from 'ethers'

export enum ActionType {
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

export const ActionTypeMap: Record<ActionType, string> = {
  [ActionType.WITHDRAWAL]: 'WITHDRAWAL',
  [ActionType.ADD_APPROVER]: 'ADD_APPROVER',
  [ActionType.ADD_SIGNER]: 'ADD_SIGNER',
  [ActionType.REMOVE_APPROVER]: 'REMOVE_APPROVER',
  [ActionType.REMOVE_SIGNER]: 'REMOVE_SIGNER'
} as any

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
  initiatedAt: BigNumber
  completedAt?: BigNumber
}
