import { ethers } from 'ethers'

const defaultProvider = new ethers.providers.InfuraProvider('maticmum')

const getContract = (
  address: string,
  abi: any,
  provider: any = defaultProvider
) => {
  return new ethers.Contract(address, abi, provider || defaultProvider)
}

export default getContract
