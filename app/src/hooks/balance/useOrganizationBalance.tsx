import { useWeb3 } from 'hooks'
import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'
import { fetchOrgBalances } from './functions'
import { TokenBalance, tokenList } from './types'

const defaultValue: TokenBalance[] = tokenList.map((t) => ({
  tokenId: t.id,
  name: t.name,
  balance: BigNumber.from(0)
}))

const useOrganizationBalance = (orgId = 0, address = '') => {
  const [orgBalance, setOrgBalance] = useState<TokenBalance[]>(defaultValue)
  const { account, library } = useWeb3()

  const refetchBalance = async () => {
    const orgBal = await fetchOrgBalances(
      (account as string) ?? address,
      orgId,
      library
    )
    setOrgBalance(orgBal)
  }

  let userId = address
  if (account && !address) {
    userId = account
  }

  useEffect(() => {
    if (!userId) return
    refetchBalance()
  }, [account, orgId, address])

  return {
    orgBalance,
    refetchBalance
  }
}

export default useOrganizationBalance
