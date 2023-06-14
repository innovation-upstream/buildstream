import { useWeb3React } from '@web3-react/core'
import { BigNumber, ethers } from 'ethers'
import useTokenInfo from 'hooks/currency/useCurrency'
import { useCallback, useEffect, useState } from 'react'

export const usePolling = (
  startPolling: (pollInterval: number) => void,
  stopPolling: () => void,
  pollInterval = 1000
) => {
  const [disablePolling, setDisablePolling] = useState(false)

  useEffect(() => {
    // @ts-ignore
    if (startPolling && stopPolling && !disablePolling) {
      startPolling(pollInterval)
      return () => stopPolling()
    }
    if (disablePolling) {
      stopPolling()
    }
  }, [startPolling, stopPolling, pollInterval, disablePolling])

  const enablePolling = useCallback(
    () => setDisablePolling(false),
    [setDisablePolling]
  )
  const shopPoll = useCallback(
    () => setDisablePolling(true),
    [setDisablePolling]
  )

  return {
    pollingDisabled: disablePolling,
    enablePolling,
    disablePolling: shopPoll
  }
}

export const useWeb3 = () => {
  const data = useWeb3React()

  return {
    ...data,
    account: data.account?.toLocaleLowerCase()
  }
}

export const useWalletBalance = (walletAddress = ethers.constants.AddressZero) => {
  const { account, library } = useWeb3()
  const [balance, setBalance] = useState<BigNumber>()
  const { tokenInfo } = useTokenInfo(walletAddress)

  const getNativeBalance = useCallback(async () => {
    library?.getBalance?.(account).then((bal: any) => {
      setBalance(bal)
    })
  }, [account, library])

  useEffect(() => {
    if (!account || !tokenInfo) return
    if (tokenInfo.isNative)
      getNativeBalance()
  }, [account, library, walletAddress, tokenInfo, getNativeBalance])

  return balance
}
