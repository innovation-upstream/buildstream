import { BigNumber } from "ethers"
import { TokenInfo } from "hooks/tokenInfo/types"

export type Balance = {
  token: 'ETH'|string
  tokenInfo?: TokenInfo
  total: BigNumber
  locked: BigNumber
}

export type Treasury = {
  orgId: number
  tokens?: {
    token: string
    balance: BigNumber
    lockedBalance: BigNumber
  }[]
}

export type DepositRecord = {
  id: string
  orgId: string
  amount: BigNumber
  token: string
  initiator: string
  completedAt: BigNumber
}
