import { useWeb3 } from 'hooks'
import Spinner from 'components/Spinner/Spinner'
import useOrganizations from 'hooks/organization/useOrganization'
import { approveTask, fetchApprovals } from 'hooks/task/functions'
import React, { useEffect, useState } from 'react'

interface Props {
  taskId: number
  orgId: number
  onApprove?: () => void
  approvals: string[]
  approvers: string[]
}

const ApprovalRequest: React.FC<Props> = ({
  taskId,
  approvers,
  approvals,
  onApprove
}) => {
  const [processing, setProcessing] = useState(false)
  const { account, library } = useWeb3()
  const [haveApproved] = useState(!!account && approvals.includes(account))
  const isApprover = !!account && approvers.includes(account)

  const approve = async () => {
    if (!account) return
    setProcessing(true)
    try {
      const tx = await approveTask(taskId, library.getSigner())
      if (tx) onApprove?.()
      setProcessing(false)
    } catch (e) {
      console.error(e)
      setProcessing(false)
    }
  }

  return (
    <div className='w-full h-full mt-10 bg-gray-100 rounded-lg p-8'>
      <div className='flex justify-between items-center'>
        <h2>Task Approval Request</h2>
      </div>
      <div className='w-full mt-3'>
        <div className='mt-5 flex flex-col'>
          <div className='p-0 rounded-xl flex justify-between items-center'>
            <button
              onClick={approve}
              disabled={!isApprover || processing || haveApproved}
              className='bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-full text-sm disabled:cursor-not-allowed disabled:opacity-30'
            >
              {processing ? <Spinner /> : 'Approve Task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApprovalRequest
