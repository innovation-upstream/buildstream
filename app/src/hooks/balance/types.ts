import { ethers } from 'ethers'

export const tokenList = [
  { id: 0, name: 'BASIC' },
  { id: 1, name: 'BEGINNER' },
  { id: 2, name: 'INTERMEDIATE' },
  { id: 3, name: 'ADVANCED' },
  { id: 4, name: 'COMPLEX' }
]

export type TokenBalance = {
  tokenId: number
  balance: ethers.BigNumber
  name: string
  orgId?: number
}
