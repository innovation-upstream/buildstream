import { useWeb3 } from 'hooks'
import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'
import { fetchBalances, fetchOrgBalances } from './functions'
import { TokenBalance, tokenList } from './types'

const defaultValue: TokenBalance[] = tokenList.map((t) => ({
  tokenId: t.id,
  name: t.name,
  balance: BigNumber.from(0)
}))

const useBalance = (orgId = 0) => {
  const [balance, setBalance] = useState<TokenBalance[]>(defaultValue)
  const [orgBalance, setOrgBalance] = useState<TokenBalance[]>(defaultValue)
  const { account, library } = useWeb3()

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
