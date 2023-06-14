import { ethers } from 'ethers'
import { useWeb3 } from 'hooks'
import { useCallback, useEffect, useState } from 'react'
import useSWR from 'swr'
import { getTokenInfo } from './functions'
import { Currency } from './types'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const useCurrencies = (tokenAddresses = [ethers.constants.AddressZero]) => {
  const [tokenInfos, setTokenInfos] = useState<Currency[]>()
  const { chainId = 80001, library } = useWeb3()
  const tokenAddrStr = tokenAddresses?.toString()
  const { data } = useSWR('/api/marketcap', fetcher)

  const refetchTokenInfos = useCallback(async () => {
    if (!tokenAddresses) return
    const filteredInfoRequests = tokenAddresses?.filter((tokenAddress) =>
      ethers.utils.isAddress(tokenAddress)
    )
    const duplicatesRemoved = Array.from(new Set(filteredInfoRequests))
    const infos = await Promise.all(
      duplicatesRemoved?.map(async (tokenAddress) => {
        return (await getTokenInfo(tokenAddress, chainId, library)) as Currency
      })
    )
    const assets = infos?.map((info) => {
      const priceUsd =
        data?.marketcap?.find((asset: any) => asset.symbol == info?.symbol)
          ?.priceUsd || null
      return { ...info, priceUsd }
    })
    setTokenInfos(assets)
  }, [tokenAddrStr, chainId, library, data])

  useEffect(() => {
    if (tokenAddresses) refetchTokenInfos()
  }, [refetchTokenInfos])

  return {
    tokenInfos,
    refetchTokenInfos,
  }
}

export default useCurrencies
