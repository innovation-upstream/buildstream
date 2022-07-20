import { useDebugValue, useEffect, useState } from 'react'
import SBT from 'contracts/Token.json'
import { useWeb3React } from '@web3-react/core'
import useContract from '../hooks/useContract'
import { ethers } from 'ethers'

const tokenList = [
  { id: 0, name: 'BASIC' },
  { id: 1, name: 'BEGINNER' },
  { id: 2, name: 'INTERMEDIATE' },
  { id: 3, name: 'ADVANCED' },
  { id: 4, name: 'COMPLEX' }
]

type TokenBalance = {
  tokenId: number
  balance: number
  name: string
  orgId?: number
}

const defaultValue: TokenBalance[] = tokenList.map(t => ({
  tokenId: t.id,
  name: t.name,
  balance: 0
}))

const useBalance = (orgId = 0) => {
  const [balance, setBalance] = useState<TokenBalance[]>(defaultValue)
  const [orgBalance, setOrgBalance] = useState<TokenBalance[]>(defaultValue)
  const { account } = useWeb3React()
  const { contract } = useContract(SBT.address, SBT.abi)
  useDebugValue([balance, orgBalance])

  const fetchBalances = async () => {
    tokenList.forEach(async (token) => {
      const bal: ethers.BigNumber = await contract[
        'balanceOf(address,uint256)'
      ](account, token.id)
      const orgBal: ethers.BigNumber = await contract[
        'balanceOf(address,uint256,uint256)'
      ](account, token.id, orgId)

      setBalance((b) => {
        const prev = [...b]
        const index = prev.findIndex((p) => p.tokenId === token.id)
        prev[index] = {
          ...prev[index],
          balance: bal.toNumber()
        }
        return [...prev]
      })
      setOrgBalance((b) => {
        const prev = [...b]
        const index = prev.findIndex((p) => p.tokenId === token.id)
        prev[index] = {
          orgId,
          ...prev[index],
          balance: orgBal.toNumber()
        }
        return [...prev]
      })
    })
  }

  useEffect(() => {
    if (!account) return
    fetchBalances()
  }, [account, orgId])

  return {
    balance,
    orgBalance,
    fetchBalances
  }
}

export default useBalance
