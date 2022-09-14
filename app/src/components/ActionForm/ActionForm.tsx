import { useWeb3 } from 'hooks'
import Spinner from 'components/Spinner/Spinner'
import { ethers } from 'ethers'
import { createAction, createWithdrawalAction } from 'hooks/action/functions'
import { ActionType, ActionTypeMap } from 'hooks/action/types'
import useActions from 'hooks/action/useAction'
import { Organization } from 'hooks/organization/types'
import useTokenInfo from 'hooks/tokenInfo/useTokenInfo'
import { useState } from 'react'

interface ActionProps {
  org: Organization
}

const ActionForm = ({ org }: ActionProps) => {
  const { refetchActions } = useActions()
  const orgHasRewardToken = org?.rewardToken !== ethers.constants.AddressZero
  const [customToken, setCustomToken] = useState(orgHasRewardToken)
  const [formData, setFormData] = useState({
    targetAddress: '',
    amount: 0,
    tokenAddress: orgHasRewardToken ? org?.rewardToken : ''
  })
  const [actionType, setActionType] = useState<ActionType>(
    ActionType.WITHDRAWAL
  )
  const { tokenInfo } = useTokenInfo(formData.tokenAddress)
  const { account, library } = useWeb3()
  const [isTransacting, setIsTransacting] = useState(false)
  const [showError, setShowError] = useState(false)

  const handleTokenSelect = (e: any) => {
    const value = parseInt(e.target.value)
    setCustomToken(!!value)
  }

  const handleChange = (e: any) => {
    let value = e.target.value
    if (e.target.type === 'number') value = parseFloat(value)
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: value
    }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (
      !formData.targetAddress ||
      !ethers.utils.isAddress(formData.targetAddress) ||
      (actionType === ActionType.WITHDRAWAL &&
        ((customToken && !tokenInfo) || formData.amount === 0))
    ) {
      setShowError(true)
      return
    }
    setIsTransacting(true)
    try {
      if (actionType !== ActionType.WITHDRAWAL) {
        await createAction(org.id, formData.targetAddress, actionType, library.getSigner())
      } else {
        const amount = customToken
          ? ethers.utils.parseUnits(
              formData.amount.toString(),
              tokenInfo?.decimal
            )
          : ethers.utils.parseEther(formData.amount.toString())
        await createWithdrawalAction(
          org.id,
          formData.targetAddress,
          amount,
          customToken ? formData.tokenAddress : ethers.constants.AddressZero,
          account as string,
          library.getSigner()
        )
      }
      setFormData({
        targetAddress: '',
        amount: 0,
        tokenAddress: orgHasRewardToken ? org?.rewardToken : ''
      })
      refetchActions(org.id)
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
        Create Action
      </h2>
      <div className='mb-3'>
        {!account && (
          <p className='text-base text-red-500'>Connect your wallet</p>
        )}
      </div>
      <div className='relative mb-4'>
        <label htmlFor='actionType' className='leading-7 text-sm text-gray-600'>
          Action Type
        </label>
        <select
          id='actionType'
          className='ml-5 p-2'
          value={actionType}
          onChange={(e) => setActionType(parseInt(e.target.value))}
        >
          {Object.entries(ActionTypeMap).map(([k, v]) => (
            <option key={v} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>
      <div className='relative mb-4'>
        <label
          htmlFor='targetAddress'
          className='leading-7 text-sm text-gray-600'
        >
          Target Address
        </label>
        <input
          type='text'
          id='targetAddress'
          name='targetAddress'
          required
          value={formData.targetAddress}
          onChange={handleChange}
          className='font-mono w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
        />
        {showError && !ethers.utils.isAddress(formData.targetAddress) && (
          <p className='text-base text-red-500'>Invalid address</p>
        )}
      </div>
      {actionType === ActionType.WITHDRAWAL && (
        <>
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
              <label
                htmlFor='tokenAddress'
                className='leading-7 text-sm text-gray-600'
              >
                Token Contract Address
              </label>
              <input
                type='text'
                id='tokenAddress'
                name='tokenAddress'
                placeholder={org.rewardToken}
                required
                value={formData.tokenAddress}
                onChange={handleChange}
                className='font-mono w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
              />
              {showError && !tokenInfo && (
                <p className='text-base text-red-500'>Invalid address</p>
              )}
            </div>
          )}

          <div className='relative mb-4'>
            <label htmlFor='amount' className='leading-7 text-sm text-gray-600'>
              Withdraw Amount
              <div className='pointer-events-none absolute flex items-center p-2 text-slate-200'>
                {customToken ? tokenInfo?.symbol : 'ETH'}
              </div>
              <input
                type='number'
                id='amount'
                name='amount'
                required
                value={formData.amount}
                onChange={handleChange}
                placeholder='0.00'
                className='border-black border-l-9 border-solid font-mono w-full bg-white rounded border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
              />
              {showError && (!formData.amount || formData.amount <= 0) && (
                <p className='text-base text-red-500'>
                  Amount must be greater than 0
                </p>
              )}
            </label>
          </div>
        </>
      )}
      <button
        type='submit'
        disabled={!org.signers.includes(account as string)}
        className='text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg'
      >
        {isTransacting ? <Spinner /> : 'Create'}
      </button>
    </form>
  )
}

export default ActionForm
