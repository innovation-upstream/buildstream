import { BigNumber } from "ethers"
import { Currency } from "hooks/currency/types"

export type Balance = {
  token: 'ETH'|string
  tokenInfo?: Currency
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
