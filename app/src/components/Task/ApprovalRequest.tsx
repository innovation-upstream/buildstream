import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import Spinner from 'components/Spinner/Spinner'
import { approveTask, fetchApprovals } from 'hooks/task/functions'

interface Props {
  taskId: number
  onApprove: () => void
}

const ApprovalRequest: React.FC<Props> = ({ taskId, onApprove }) => {
  const [processing, setProcessing] = useState(false)
  const [approvalRequest, setApprovalRequest] = useState(false)
  const { account, library } = useWeb3React()

  const approve = async () => {
    if (!account) return
    setProcessing(true)
    try {
      const tx = await approveTask(taskId, library.getSigner())
      if (tx) onApprove()
      setProcessing(false)
    } catch (e) {
      console.error(e)
      setProcessing(false)
    }
  }

  const getApprovalsRequest = async () => {
    if (!account) return
    try {
      const res = await fetchApprovals(taskId)
      if (res.includes(account)) setApprovalRequest(true)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    getApprovalsRequest()
  }, [])

  return (
    <div className='w-full h-full mt-10 bg-gray-100 rounded-lg p-8'>
      <div className='flex justify-between items-center'>
        <h2>Task Approval Request</h2>
      </div>
      <div className='w-full mt-3'>
        {!approvalRequest ? (
          <div className='px-4 border border-red-300 rounded-full w-max bg-white text-gray-500'>
            None
          </div>
        ) : (
          <div className='mt-5 flex flex-col'>
            <div className='p-0 rounded-xl flex justify-between items-center'>
              <button
                onClick={approve}
                disabled={processing}
                className='bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-full text-sm'
              >
                {processing ? <Spinner /> : 'Approve Task'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ApprovalRequest
