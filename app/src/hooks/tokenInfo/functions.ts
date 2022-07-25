import Erc20 from 'contracts/ERC20.json'
import getContract from 'utils/getContract'
import { TokenInfo } from './types'

export const getTokenInfo = async (
  address: string,
  provider?: any
): Promise<TokenInfo | undefined> => {
  try {
    const contract = getContract(address, Erc20, provider)
    const symbol = await contract.symbol()
    const decimal = await contract.decimals()
    return {
      symbol,
      decimal
    }
  } catch (e) {
    console.error(e)
  }
}
