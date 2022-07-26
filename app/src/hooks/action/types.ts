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

export type Action = {
  id: number
  orgId: number
  targetAddress: string
  value: ethers.BigNumber
  data: ethers.utils.Bytes
  executed: boolean
  tokenAddress: string
  actionType: ActionType
}
