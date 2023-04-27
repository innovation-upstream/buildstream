import { useWeb3 } from 'hooks'
import { ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import { getTokenInfo } from './functions'
import { TokenInfo } from './types'

const useTokenInfo = (tokenAddress = ethers.constants.AddressZero) => {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>()
  const { library, chainId = 80001 } = useWeb3()

  const refetchTokenInfo = useCallback(async () => {
    if (!ethers.utils.isAddress(tokenAddress)) {
      setTokenInfo(undefined)
      return
    }
    const info = await getTokenInfo(tokenAddress, chainId, library)
    setTokenInfo(info)
  }, [tokenAddress, library, chainId])

  useEffect(() => {
    refetchTokenInfo()
  }, [refetchTokenInfo])

  return {
    tokenInfo,
    refetchTokenInfo
  }
}

export default useTokenInfo
