import { BigNumber } from 'ethers'

export type Organization = {
  id: number
  name: string
  description: string
  reviewers: string[]
  approvers: string[]
  signers: string[]
  requiredTaskApprovals: number
  requiredConfirmations: number
  rewardMultiplier: BigNumber
  rewardToken: string
  rewardSlashDivisor: BigNumber
  slashRewardEvery: number
  isInitialized: boolean
}
