import { useWeb3 } from 'hooks'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { getTokenInfo } from './functions'
import { TokenInfo } from './types'

const useTokenInfo = (tokenAddress: string) => {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>()
  const { library } = useWeb3()

  const refetchTokenInfo = async () => {
    if (
      !ethers.utils.isAddress(tokenAddress) ||
      tokenAddress === ethers.constants.AddressZero
    ) {
      setTokenInfo(undefined)
      return
    }
    const info = await getTokenInfo(tokenAddress, library)
    setTokenInfo(info)
  }

  useEffect(() => {
    refetchTokenInfo()
  }, [tokenAddress])

  return {
    tokenInfo,
    refetchTokenInfo
  }
}

export default useTokenInfo
