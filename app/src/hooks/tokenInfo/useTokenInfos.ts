import { useWeb3 } from 'hooks'
import { ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import { getTokenInfo } from './functions'
import { TokenInfo } from './types'

const useTokenInfos = (tokenAddresses?: string[]) => {
  const [tokenInfos, setTokenInfos] = useState<TokenInfo[]>()
  const { chainId = 80001, library } = useWeb3()
  const tokenAddrStr = tokenAddresses?.toString()

  const refetchTokenInfos = useCallback(async () => {
    if (!tokenAddresses) return
    const filteredInfoRequests = tokenAddresses?.filter((tokenAddress) =>
      ethers.utils.isAddress(tokenAddress)
    )
    const duplicatesRemoved = Array.from(new Set(filteredInfoRequests))
    const infos = await Promise.all(
      duplicatesRemoved?.map(async (tokenAddress) => {
        return (await getTokenInfo(tokenAddress, chainId, library)) as TokenInfo
      })
    )
    setTokenInfos(infos)
  }, [tokenAddrStr, chainId, library])

  useEffect(() => {
    if (tokenAddresses) refetchTokenInfos()
  }, [refetchTokenInfos])

  return {
    tokenInfos,
    refetchTokenInfos
  }
}

export default useTokenInfos
