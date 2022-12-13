import { useWeb3 } from 'hooks'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { getTokenInfo } from './functions'
import { TokenInfo } from './types'

const useTokenInfos = (tokenAddresses?: string[]) => {
  const [tokenInfos, setTokenInfos] = useState<TokenInfo[]>()
  const { library } = useWeb3()

  const refetchTokenInfos = async () => {
    if (!tokenAddresses) return
    const filteredInfoRequests = tokenAddresses?.filter(
      (tokenAddress) => ethers.utils.isAddress(tokenAddress)
    )
    console.log('========== usy', tokenAddresses, filteredInfoRequests)
    const duplicatesRemoved = Array.from(new Set(filteredInfoRequests))
    const infos = await Promise.all(
      duplicatesRemoved?.map(async (tokenAddress) => {
        return (await getTokenInfo(tokenAddress, library)) as TokenInfo
      })
    )
    console.log('========== infos', infos)
    setTokenInfos(infos)
  }

  useEffect(() => {
    if (tokenAddresses) refetchTokenInfos()
  }, [tokenAddresses?.toString()])

  return {
    tokenInfos,
    refetchTokenInfos
  }
}

export default useTokenInfos
