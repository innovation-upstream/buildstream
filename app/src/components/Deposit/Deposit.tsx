import { useWeb3React } from '@web3-react/core'
import Spinner from 'components/Spinner/Spinner'
import ERC20 from 'contracts/ERC20.json'
import Treasury from 'contracts/Treasury.json'
import { ethers } from 'ethers'
import { Organization } from 'hooks/organization/types'
import useTokenInfo from 'hooks/tokenInfo/useTokenInfo'
import { useState } from 'react'
import getContract from 'utils/getContract'

interface DepositProps {
  org: Organization
}

const Deposit = ({ org }: DepositProps) => {
  const orgHasRewardToken = org?.rewardToken !== ethers.constants.AddressZero
  const [customToken, setCustomToken] = useState(orgHasRewardToken)
  const [amount, setAmount] = useState(0)
  const [tokenAddress, setTokenAddress] = useState(
    orgHasRewardToken ? org?.rewardToken : ''
  )
  const { tokenInfo } = useTokenInfo(tokenAddress)
  const { account, library } = useWeb3React()
  const [isTransacting, setIsTransacting] = useState(false)
  const [showError, setShowError] = useState(false)

  const handleTokenSelect = (e: any) => {
    const value = parseInt(e.target.value)
    setCustomToken(!!value)
  }

  const processNative = async () => {
    const signer = library.getSigner()
    const contract = getContract(Treasury.address, Treasury.abi, signer)
    const tx = await contract['deposit(uint256)'](org.id, {
      from: account,
      value: ethers.utils.parseEther(amount.toString())
    })
    await tx.wait()
  }

  const processCustom = async () => {
    const signer = library.getSigner()
    const contract = getContract(Treasury.address, Treasury.abi, signer)
    const tokenContract = getContract(tokenAddress, ERC20, signer)
    const approveTx = await tokenContract.approve(
      Treasury.address,
      ethers.utils.parseUnits(amount.toString(), tokenInfo?.decimal)
    )
    await approveTx.wait()
    const tx = await contract['deposit(uint256,address,uint256)'](
      org.id,
      tokenAddress,
      ethers.utils.parseUnits(amount.toString(), tokenInfo?.decimal),
      {
        from: account
      }
    )
    await tx.wait()
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if ((customToken && !tokenInfo) || amount === 0) {
      setShowError(true)
      return
    }
    setIsTransacting(true)
    try {
      if (customToken) {
        await processCustom()
      } else {
        await processNative()
      }
      setAmount(0)
      setIsTransacting(false)
      setShowError(false)
    } catch (e) {
      console.error(e)
      setIsTransacting(false)
    }
  }

  return (
    <form className='w-full' onSubmit={handleSubmit}>
      <h2 className='text-gray-900 text-lg font-medium title-font mb-5'>
        Deposit to treasury
      </h2>
      <div className='mb-3'>
        {!account && (
          <p className='text-base text-red-500'>Connect your wallet</p>
        )}
      </div>
      <div className='relative mb-4'>
        <select
          className='p-2'
          value={customToken ? 1 : 0}
          onChange={handleTokenSelect}
        >
          <option value={0}>Native (ETH)</option>
          <option value={1}>Other</option>
        </select>
      </div>
      {customToken && (
        <div className='relative mb-4'>
          <label htmlFor='address' className='leading-7 text-sm text-gray-600'>
            Token Contract Address
          </label>
          <input
            type='text'
            id='address'
            name='address'
            placeholder={org.rewardToken}
            required
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            className='font-mono w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
          />
          {showError && !tokenInfo && (
            <p className='text-base text-red-500'>Invalid address</p>
          )}
        </div>
      )}
      <div className='relative mb-4'>
        <label htmlFor='amount' className='leading-7 text-sm text-gray-600'>
          Deposit Amount
          <div className='pointer-events-none absolute flex items-center p-2 text-slate-200'>
            {customToken ? tokenInfo?.symbol : 'ETH'}
          </div>
          <input
            type='number'
            id='amount'
            name='amount'
            required
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            placeholder='0.00'
            className='border-black border-l-9 border-solid font-mono w-full bg-white rounded border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
          />
          {showError && (!amount || amount <= 0) && (
            <p className='text-base text-red-500'>
              Amount must be greater than 0
            </p>
          )}
        </label>
      </div>
      <button
        type='submit'
        disabled={!org.signers.includes(account as string)}
        className='text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg'
      >
        {isTransacting ? <Spinner /> : 'Deposit'}
      </button>
    </form>
  )
}

export default Deposit
