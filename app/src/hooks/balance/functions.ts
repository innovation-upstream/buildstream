import SBT from 'contracts/Token.json'
import { ethers } from 'ethers'
import getContract from 'utils/getContract'
import { TokenBalance, tokenList } from './types'

export const fetchBalances = async (
  account: string,
  provider?: any
): Promise<TokenBalance[]> => {
  const contract = getContract(SBT.address, SBT.abi, provider)

  const balances = await Promise.all(
    tokenList.map(async (token): Promise<TokenBalance> => {
      const bal: ethers.BigNumber = await contract[
        'balanceOf(address,uint256)'
      ](account, token.id)

      return {
        tokenId: token.id,
        name: token.name,
        balance: bal
      }
    })
  )

  return balances
}

export const fetchOrgBalances = async (
  account: string,
  orgId: number,
  provider?: any
): Promise<TokenBalance[]> => {
  const contract = getContract(SBT.address, SBT.abi, provider)

  const balances = await Promise.all(
    tokenList.map(async (token): Promise<TokenBalance> => {
      const orgBal: ethers.BigNumber = await contract[
        'balanceOf(address,uint256,uint256)'
      ](account, token.id, orgId)

      return {
        orgId,
        tokenId: token.id,
        name: token.name,
        balance: orgBal
      }
    })
  )

  return balances
}
