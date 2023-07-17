import ERC20 from 'contracts/ERC20.json'
import Treasury from 'contracts/Treasury.json'
import { BigNumber } from 'ethers'
import getContract from 'utils/getContract'

export const depositNative = async (
  orgId: number,
  amount: BigNumber,
  account: string,
  provider?: any
) => {
  const signer = provider.getSigner()
  const contract = getContract(Treasury.address, Treasury.abi, signer)
  const tx = await contract['deposit(uint256)'](orgId, {
    from: account,
    value: amount
  })
  await tx.wait()
}

export const depositToken = async (
  orgId: number,
  amount: BigNumber,
  token: string,
  account: string,
  provider?: any
) => {
  const signer = provider.getSigner()
  const contract = getContract(Treasury.address, Treasury.abi, signer)
  const tokenContract = getContract(token, ERC20, signer)
  const approveTx = await tokenContract.approve(Treasury.address, amount)
  await approveTx.wait()
  const tx = await contract['deposit(uint256,address,uint256)'](
    orgId,
    token,
    amount,
    {
      from: account
    }
  )
  await tx.wait()
}

export const getTreasuryBalance = async (
  orgId: number,
  token: string,
  provider?: any
): Promise<BigNumber> => {
  const contract = getContract(Treasury.address, Treasury.abi, provider)
  const balance = await contract['getBalance(uint256,address)'](orgId, token)
  return balance
}
