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
  balances: Balance[]
}