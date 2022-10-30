import { useWeb3 } from 'hooks'
import Spinner from 'components/Spinner/Spinner'
import { ethers } from 'ethers'
import { Organization } from 'hooks/organization/types'
import useTokenInfo from 'hooks/tokenInfo/useTokenInfo'
import { useState } from 'react'
import { depositNative, depositToken } from 'hooks/treasury/functions'

interface DepositProps {
  organization: Organization
}

const Deposit = ({ organization }: DepositProps) => {
  const orgHasRewardToken =
    organization?.rewardToken !== ethers.constants.AddressZero
  const [customToken, setCustomToken] = useState(orgHasRewardToken)
  const [amount, setAmount] = useState(0)
  const [tokenAddress, setTokenAddress] = useState(
    orgHasRewardToken ? organization?.rewardToken : ''
  )
  const { tokenInfo } = useTokenInfo(tokenAddress)
  const { account, library } = useWeb3()
  const [isTransacting, setIsTransacting] = useState(false)
  const [showError, setShowError] = useState(false)

  const handleTokenSelect = (e: any) => {
    const value = parseInt(e.target.value)
    setCustomToken(!!value)
  }

  const processNative = async () => {
    await depositNative(
      organization.id,
      ethers.utils.parseEther(amount.toString()),
      account as string,
      library
    )
  }

  const processCustom = async () => {
    await depositToken(
      organization.id,
      ethers.utils.parseUnits(amount.toString(), tokenInfo?.decimal),
      tokenAddress,
      account as string,
      library
    )
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
      setShowError(false)
    } catch (e) {
      console.error(e)
    } finally {
      setIsTransacting(false)
    }
  }

  return (
    <form className='w-full' onSubmit={handleSubmit}>
      <input
        type='number'
        id='amount'
        name='amount'
        required
        value={amount}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
        placeholder='0.00'
        className='input-base'
      />
      {!account && (
        <p className='text-base text-red-500 mt-1'>Connect your wallet</p>
      )}
      {showError && (!amount || amount <= 0) && (
        <p className='text-base text-red-500 mt-1'>
          Amount must be greater than 0
        </p>
      )}
      <button
        type='submit'
        disabled={!organization.signers.includes(account as string)}
        className='w-full btn-primary bg-red-400 hover:bg-red-600 focus:bg-red-600 flex items-center justify-center gap-x-2.5 mt-4'
      >
        {isTransacting ? <Spinner className='fill-white' /> : 'Deposit'}
      </button>
    </form>
  )
}

export default Deposit
