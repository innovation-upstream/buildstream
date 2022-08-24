import React, { useState, useEffect } from 'react'
import Spinner from 'components/Spinner/Spinner'
import {
  approveAssignedRequest,
  fetchAssignedRequests
} from 'hooks/task/functions'
import { useWeb3React } from '@web3-react/core'

interface Props {
  taskId: number
  onAssign: () => void
}

const AssignmentRequest: React.FC<Props> = ({ taskId, onAssign }) => {
  const [processing, setProcessing] = useState(false)
  const [assignedRequests, setAssignedRequests] = useState<string[]>([])
  const { account, library } = useWeb3React()

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
        onAssign()
      }
      setProcessing(false)
    } catch (e) {
      setProcessing(false)
      console.error('ERROR===', e)
    }
  }

  const getAssignmentRequest = async () => {
    try {
      const res = await fetchAssignedRequests(taskId)
      setAssignedRequests(Array.from(new Set(res)))
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    getAssignmentRequest()
  }, [])

  return (
    <div className="w-full h-full mt-10 bg-gray-100 rounded-lg p-8">
      <div className="flex justify-between items-center">
        <h2>Assignment Requests</h2>
      </div>
      <div className="w-full mt-3">
        {assignedRequests.length === 0 ? (
          <div className="px-4 border border-red-300 rounded-full w-max bg-white text-gray-500">
            None
          </div>
        ) : (
          <div className="mt-7 flex flex-col gap-y-5">
            {assignedRequests.map((account) => {
              return (
                <div
                  className="p-2 bg-gray-200 rounded-xl flex justify-between items-center"
                  key={account}
                >
                  <span>
                    {account.substring(0, 6)}...
                    {account.substring(account.length - 4)}
                  </span>
                  <button
                    onClick={() => approveTask(account)}
                    id={account}
                    disabled={processing}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-2 rounded-full text-sm"
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
