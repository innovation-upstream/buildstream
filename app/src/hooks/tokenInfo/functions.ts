import Erc20 from 'contracts/ERC20.json'
import { ethers } from 'ethers'
import getContract from 'utils/getContract'
import { TokenInfo } from './types'

export const getTokenInfo = async (
  address: string,
  chainId: number,
  provider?: any
): Promise<TokenInfo | undefined> => {
  try {
    if (address === ethers.constants.AddressZero)
      return {
        address,
        symbol: chainId === 80001 ? 'MATIC' : 'ETH',
        isNative: true,
        decimal: 18
      }
    const contract = getContract(address, Erc20, provider)
    const symbol = await contract.symbol()
    const decimal = await contract.decimals()
    return {
      symbol,
      decimal,
      address
    }
  } catch (e) {
    console.error(e)
  }
}
