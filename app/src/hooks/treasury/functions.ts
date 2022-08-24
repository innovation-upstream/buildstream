import TreasuryContractInterface from 'contracts/Treasury.json'
import { BigNumber, ethers } from 'ethers'
import { getTokenInfo } from 'hooks/tokenInfo/functions'
import getContract from 'utils/getContract'
import { Balance } from './types'

export const fetchTreasuryBalances = async (
  orgId: number,
  provider?: any
): Promise<Balance[] | undefined> => {
  const contract = getContract(
    TreasuryContractInterface.address,
    TreasuryContractInterface.abi,
    provider
  )

  const tokens: string[] = [] // await contract.getOrgTokens(orgId)
  const balances = [await fetchTreasuryEthBalance(orgId, provider)]

  const tokenBalances = await Promise.all(
    tokens.map(async (t) => {
      const total: BigNumber = await contract['getBalance(uint256, address)'](
        orgId,
        t
      )
      const locked: BigNumber = await contract['getLockedBalance(uint256, address)'](
        orgId,
        t
      )
      const tokenInfo = await getTokenInfo(t)

      return {
        token: t,
        tokenInfo,
        total,
        locked
      }
    })
  )

  return [...balances, ...tokenBalances]
}

export const fetchTreasuryEthBalance = async (
  orgId: number,
  provider?: any
): Promise<Balance> => {
  const contract = getContract(
    TreasuryContractInterface.address,
    TreasuryContractInterface.abi,
    provider
  )

  const total: BigNumber = await contract['getBalance(uint256)'](orgId)
  const locked: BigNumber = BigNumber.from(0) // await contract['getLockedBalance(uint256)'](orgId)

  return {
    token: 'ETH',
    tokenInfo: {
      symbol: 'ETH',
      decimal: 18
    },
    total,
    locked
  }
}
