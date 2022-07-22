import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { tokenList, TokenBalance } from './types'
import { fetchBalances, fetchOrgBalances } from './functions'
import { BigNumber } from 'ethers'

const defaultValue: TokenBalance[] = tokenList.map((t) => ({
  tokenId: t.id,
  name: t.name,
  balance: BigNumber.from(0)
}))

const useBalance = (orgId = 0) => {
  const [balance, setBalance] = useState<TokenBalance[]>(defaultValue)
  const [orgBalance, setOrgBalance] = useState<TokenBalance[]>(defaultValue)
  const { account, library } = useWeb3React()

  const refetchBalance = async () => {
    const bal = await fetchBalances(account as string, library)
    const orgBal = await fetchOrgBalances(account as string, orgId, library)

    setBalance(bal)
    setOrgBalance(orgBal)
  }

  useEffect(() => {
    if (!account) return
    refetchBalance()
  }, [account, orgId])

  return {
    balance,
    orgBalance,
    refetchBalance
  }
}

export default useBalance
