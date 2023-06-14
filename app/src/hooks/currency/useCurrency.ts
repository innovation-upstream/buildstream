import { ethers } from 'ethers'
import { useWeb3 } from 'hooks'
import { useCallback, useEffect, useState } from 'react'
import useSWR from 'swr'
import { getTokenInfo } from './functions'
import { Currency } from './types'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const useCurrency = (tokenAddress = ethers.constants.AddressZero) => {
  const [tokenInfo, setTokenInfo] = useState<Currency>()
  const { library, chainId = 80001 } = useWeb3()
  const { data } = useSWR('/api/marketcap', fetcher)

  const refetchTokenInfo = useCallback(async () => {
    if (!ethers.utils.isAddress(tokenAddress)) {
      setTokenInfo(undefined)
      return
    }
    const info = await getTokenInfo(tokenAddress, chainId, library)
    const priceUsd =
      data?.marketcap?.find((asset: any) => asset.symbol == info?.symbol)
        ?.priceUsd || null
    const asset = info ? { ...info, priceUsd } : undefined
    setTokenInfo(asset)
  }, [tokenAddress, library, chainId, data])

  useEffect(() => {
    refetchTokenInfo()
  }, [refetchTokenInfo])

  return {
    tokenInfo,
    refetchTokenInfo,
  }
}

export default useCurrency
