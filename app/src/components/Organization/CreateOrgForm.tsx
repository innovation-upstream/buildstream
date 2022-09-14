import React, { useState } from 'react'
import { useWeb3 } from 'hooks'
import { useRouter } from 'next/router'
import Spinner from 'components/Spinner/Spinner'
import { createOrganization } from 'hooks/organization/functions'

const initialData = {
  name: '',
  description: '',
  reviewers: [],
  approvers: [],
  signers: [],
}

type OrgData = typeof initialData & { [keyof: string]: any }

interface Props {
  onCreate:  (orgId: number) => any
}

const CreateOrgForm: React.FC<Props> = ({onCreate}) => {
  const { account, library } = useWeb3()
  const [status, setStatus] = useState({ text: '', error: false })
  const [orgData, setOrgData] = useState<OrgData>(initialData)
  const [processing, setProcessing] = useState(false)
  const router = useRouter()

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
          [targetName]: [...prev[targetName], targetValue],
        }))
        ev.target.value = ''
      }
      return
    }
    setOrgData((prev: any) => ({ ...prev, [targetName]: targetValue }))
  }

  const deleteTag = (ev: any) => {
    const index = parseInt(ev.target.id)
    const targetName = ev.target.dataset.name
    let addressUpdate = [...orgData[targetName]]

    addressUpdate.splice(index, 1)
    setOrgData((prev: any) => ({ ...prev, [targetName]: [...addressUpdate] }))
  }

  const createOrg: any = async (e: any) => {
    if (!account) {
      setStatus({ text: 'Wallet Not Connected', error: true })
      return
    }
    if (
      !orgData.name ||
      !orgData.description ||
      orgData.reviewers.length === 0 ||
      orgData.approvers.length === 0 ||
      orgData.signers.length === 0
    ) {
      setStatus({ text: 'Please fill all fields to Create', error: true })
      return
    }
    setProcessing(true)
    try {
      const response = await createOrganization(
        orgData.name,
        orgData.description,
        orgData.reviewers,
        orgData.approvers,
        orgData.signers,
        library.getSigner()
      )
      setProcessing(false)
      onCreate(response)
    } catch (e) {
      console.log(e)
      setProcessing(false)
    }
  }

  return (
    <div className='lg:w-1/2 md:w-2/3 mx-auto'>
      <div className='flex flex-wrap -m-2'>
        <p
          className={`lg:w-2/3 mx-auto leading-relaxed text-center ${
            status.error ? 'text-red-500' : 'text-green-500'
          }`}
        >
          {status.text}
        </p>
        <div className='p-2 w-full'>
          <div className='relative'>
            <label htmlFor='name' className='leading-7 text-sm text-gray-600'>
              Organization Name
            </label>
            <input
              type='text'
              id='name'
              name='name'
              required
              value={orgData.name}
              onChange={handleChange}
              className='w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
            />
          </div>
        </div>
        <div className='p-2 w-full'>
          <div className='relative'>
            <label
              htmlFor='reputationLevel'
              className='leading-7 text-sm text-gray-600'
            >
              Reviewers
            </label>
            <div className='h-auto flex flex-wrap item-center gap-x-1 gap-y-1'>
              {orgData.reviewers.length > 0 &&
                orgData.reviewers.map((reviewer, index) => {
                  return (
                    <div
                      key={reviewer}
                      className='flex items-center border-2 rounded-full px-2 py-1 w-max mb-3'
                    >
                      {reviewer}
                      <div
                        onClick={deleteTag}
                        data-name='reviewers'
                        id={`${index}`}
                        className='py-1 px-3 ml-3 rounded-full bg-indigo-400 text-red-50 hover:bg-indigo-500 cursor-pointer'
                      >
                        x
                      </div>
                    </div>
                  )
                })}
            </div>
            <input
              type='text'
              id='reviewers'
              name='reviewers'
              onKeyPress={handleChange}
              data-type='addressArray'
              placeholder='Type and Press Enter Key'
              className='w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
            />
          </div>
        </div>
        <div className='p-2 w-full'>
          <div className='relative'>
            <label
              htmlFor='reputationLevel'
              className='leading-7 text-sm text-gray-600'
            >
              Approvers
            </label>
            <div className='h-auto flex flex-wrap item-center gap-x-1 gap-y-1'>
              {orgData.approvers.length > 0 &&
                orgData.approvers.map((approver, index) => {
                  return (
                    <div
                      key={approver}
                      className='flex items-center border-2 rounded-full px-2 py-1 w-max mb-3'
                    >
                      {approver}
                      <div
                        onClick={deleteTag}
                        data-name='approvers'
                        id={`${index}`}
                        className='py-1 px-3 ml-3 rounded-full bg-indigo-400 text-red-50 hover:bg-indigo-500 cursor-pointer'
                      >
                        x
                      </div>
                    </div>
                  )
                })}
            </div>
            <input
              type='text'
              id='approvers'
              name='approvers'
              onKeyPress={handleChange}
              data-type='addressArray'
              placeholder='Type and Press Enter Key'
              className='w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
            />
          </div>
        </div>
        <div className='p-2 w-full'>
          <div className='relative'>
            <label
              htmlFor='reputationLevel'
              className='leading-7 text-sm text-gray-600'
            >
              Signers
            </label>
            <div className='h-auto flex flex-wrap item-center gap-x-1 gap-y-1'>
              {orgData.signers.length > 0 &&
                orgData.signers.map((signer, index) => {
                  return (
                    <div
                      key={signer}
                      className='flex items-center border-2 rounded-full px-2 py-1 w-max mb-3'
                    >
                      {signer}
                      <div
                        onClick={deleteTag}
                        data-name='signers'
                        id={`${index}`}
                        className='py-1 px-3 ml-3 rounded-full bg-indigo-400 text-red-50 hover:bg-indigo-500 cursor-pointer'
                      >
                        x
                      </div>
                    </div>
                  )
                })}
            </div>
            <input
              type='text'
              id='signers'
              name='signers'
              onKeyPress={handleChange}
              data-type='addressArray'
              placeholder='Type and Press Enter Key'
              className='w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
            />
          </div>
        </div>
        <div className='p-2 w-full'>
          <div className='relative'>
            <label
              htmlFor='message'
              className='leading-7 text-sm text-gray-600'
            >
              Description
            </label>
            <textarea
              id='description'
              required
              name='description'
              value={orgData.description}
              onChange={handleChange}
              className='w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out'
            ></textarea>
          </div>
        </div>
        <div className='p-2 w-full'>
          <button
            type='submit'
            disabled={processing}
            onClick={createOrg}
            className='flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg'
          >
            {processing ? <Spinner /> : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateOrgForm
