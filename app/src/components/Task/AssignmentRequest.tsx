import React, { useState, useEffect } from 'react'
import Spinner from 'components/Spinner/Spinner'
import {
  approveAssignedRequest,
  fetchAssignedRequests
} from 'hooks/task/functions'
import { useWeb3 } from 'hooks'

interface Props {
  taskId: number
  assignmentRequests: string[]
  approvers: string[]
  onAssign?: () => void
}

const AssignmentRequest: React.FC<Props> = ({
  taskId,
  onAssign,
  assignmentRequests,
  approvers
}) => {
  const [processing, setProcessing] = useState(false)
  const { account, library } = useWeb3()

  const approveTask = async (address: string) => {
    if (!account || !taskId) return
    setProcessing(true)
    try {
      const tx = await approveAssignedRequest(
        taskId,
        address,
        library.getSigner()
      )
      if (tx) {
        onAssign?.()
      }
      setProcessing(false)
    } catch (e) {
      setProcessing(false)
      console.error('ERROR===', e)
    }
  }

  return (
    <div className='w-full h-full mt-10 bg-gray-100 rounded-lg p-8'>
      <div className='flex justify-between items-center'>
        <h2>Assignment Requests</h2>
      </div>
      <div className='w-full mt-3'>
        {assignmentRequests.length === 0 ? (
          <div className='px-4 border border-red-300 rounded-full w-max bg-white text-gray-500'>
            None
          </div>
        ) : (
          <div className='mt-7 flex flex-col gap-y-5'>
            {assignmentRequests.map((account) => {
              return (
                <div
                  className='p-2 bg-gray-200 rounded-xl flex justify-between items-center'
                  key={account}
                >
                  <span>
                    {account.substring(0, 6)}...
                    {account.substring(account.length - 4)}
                  </span>
                  <button
                    onClick={() => approveTask(account)}
                    id={account}
                    disabled={
                      !account || processing || !approvers.includes(account)
                    }
                    className='bg-indigo-500 hover:bg-indigo-600 text-white px-2 rounded-full text-sm disabled:cursor-not-allowed disabled:opacity-30'
                  >
                    {processing ? <Spinner /> : 'Assign'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default AssignmentRequest
