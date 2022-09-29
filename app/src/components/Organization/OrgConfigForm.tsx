import Spinner from 'components/Spinner/Spinner'
import { ethers } from 'ethers'
import { useWeb3 } from 'hooks'
import { addOrganizationConfig } from 'hooks/organization/functions'
import router from 'next/router'
import React, { useState } from 'react'

const initialData = {
  requiredTaskApprovals: 0,
  requiredConfirmations: 0,
  rewardMultiplier: 0,
  rewardToken: ethers.constants.AddressZero,
  rewardSlashMultiplier: 1,
  slashRewardEvery: 1
}

type OrgData = typeof initialData & { [keyof: string]: any }

const OrgConfigForm: React.FC<{ orgId: number }> = ({ orgId }) => {
  const [status, setStatus] = useState({ text: '', error: false })
  const [orgData, setOrgData] = useState<OrgData>(initialData)
  const [processing, setProcessing] = useState(false)
  const { account, library } = useWeb3()

  const handleChange = (ev: any) => {
    const targetName = ev.target.name
    let targetValue: string | number = ev.target.value

    if (ev.target.type === 'number') {
      if (targetValue) {
        targetValue = Number(targetValue)
      }
    }

    if (ev.target.dataset.type === 'addressArray') {
      if (ev.key === 'Enter' && targetValue) {
        setOrgData((prev: any) => ({
          ...prev,
          [targetName]: [...prev[targetName], targetValue]
        }))
        ev.target.value = ''
      }
      return
    }
    setOrgData((prev: any) => ({ ...prev, [targetName]: targetValue }))
  }

  const addOrgConfig = async () => {
    if (!account) {
      setStatus({ text: 'Wallet Not Connected', error: true })
      return
    }
    setProcessing(true)
    try {
      const tx = await addOrganizationConfig(
        orgId,
        orgData.requiredTaskApprovals,
        orgData.requiredConfirmations,
        ethers.utils.parseUnits(orgData.rewardMultiplier.toString()),
        orgData.rewardToken,
        ethers.utils.parseUnits(orgData.rewardSlashMultiplier.toString()),
        orgData.slashRewardEvery,
        library.getSigner()
      )
      if (tx) router.push(`/organization/${orgId}`)
    } catch (e) {
      setProcessing(false)
      console.log(e)
    }
  }

  return (
    <div className='lg:w-1/2 md:w-2/3 mx-auto'>
      <div className='flex flex-wrap -m-2'>
        <p
          className={`lg:w-2/3 mx-auto leading-relaxed text-center   ${
            status.error ? 'text-red-500' : 'text-green-500'
          }`}
        >
          {status.text}
        </p>
        <div className='p-2 w-full'>
          <div className='relative'>
            <label
              htmlFor='requiredTaskApprovals'
              className='leading-7 text-sm text-gray-600'
            >
              Required Task Approvals
            </label>
            <input
              type='number'
              id='requiredTaskApprovals'
              name='requiredTaskApprovals'
              required
              value={orgData.requiredTaskApprovals}
              onChange={handleChange}
              className='w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
            />
          </div>
        </div>
        <div className='p-2 w-full'>
          <div className='relative'>
            <label
              htmlFor='rewardToken'
              className='leading-7 text-sm text-gray-600'
            >
              Reward Token
            </label>
            <input
              type='text'
              id='rewardToken'
              name='rewardToken'
              required
              value={orgData.rewardToken}
              onChange={handleChange}
              className='w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
            />
          </div>
        </div>
        <div className='p-2 w-1/2'>
          <div className='relative'>
            <label
              htmlFor='requiredConfirmations'
              className='leading-7 text-sm text-gray-600'
            >
              Required Confirmations
            </label>
            <input
              type='number'
              id='requiredConfirmations'
              required
              name='requiredConfirmations'
              value={orgData.requiredConfirmations}
              onChange={handleChange}
              className='w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
            />
          </div>
        </div>
        <div className='p-2 w-1/2'>
          <div className='relative'>
            <label
              htmlFor='rewardMultiplier'
              className='leading-7 text-sm text-gray-600'
            >
              Reward Multiplier
            </label>
            <input
              type='number'
              id='rewardMultiplier'
              name='rewardMultiplier'
              required
              value={orgData.rewardMultiplier}
              onChange={handleChange}
              className='w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
            />
          </div>
        </div>

        <div className='p-2 w-1/2'>
          <div className='relative'>
            <label
              htmlFor='rewardSlashMultiplier'
              className='leading-7 text-sm text-gray-600'
            >
              Reward Slash Multiplier
            </label>
            <input
              type='number'
              id='rewardSlashMultiplier'
              required
              name='rewardSlashMultiplier'
              value={orgData.rewardSlashMultiplier}
              onChange={handleChange}
              className='w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
            />
          </div>
        </div>
        <div className='p-2 w-1/2'>
          <div className='relative'>
            <label
              htmlFor='slashRewardEvery'
              className='leading-7 text-sm text-gray-600'
            >
              Slash for Every Reward
            </label>
            <input
              type='number'
              id='slashRewardEvery'
              required
              name='slashRewardEvery'
              value={orgData.slashRewardEvery}
              onChange={handleChange}
              className='w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
            />
          </div>
        </div>
        <div className='p-2 w-full'>
          <button
            type='submit'
            disabled={processing}
            onClick={addOrgConfig}
            className='flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg'
          >
            {processing ? <Spinner /> : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrgConfigForm
