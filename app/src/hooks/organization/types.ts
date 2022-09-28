import { BigNumber } from 'ethers'

export interface Organization {
  id: number
  name: string
  description: string
  approvers: string[]
  signers: string[]
  requiredTaskApprovals: number
  requiredConfirmations: number
  rewardMultiplier: BigNumber
  rewardToken: string
  rewardSlashMultiplier: BigNumber
  slashRewardEvery: number
  isInitialized: boolean
  treasury?: {
    tokens?: {
      token: string
      balance: BigNumber
      lockedBalance: BigNumber
    }[]
  }
}
