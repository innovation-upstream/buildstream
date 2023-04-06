import { ethers } from 'ethers'

const defaultProvider = ethers.getDefaultProvider()

const getContract = (
  address: string,
  abi: any,
  provider: any = defaultProvider
) => {
  return new ethers.Contract(address, abi, provider)
}

export default getContract
