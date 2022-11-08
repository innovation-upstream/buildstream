import Spinner from 'components/Spinner/Spinner'
import { BigNumber, ethers } from 'ethers'
import { useWeb3 } from 'hooks'
import { approveAssignedRequest } from 'hooks/task/functions'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import React, { useState } from 'react'
import TokenGeneric from 'SVGs/TokenGeneric'

interface Props {
  taskId: number
  isAssigned?: boolean
  assignee: {
    tags: string[]
    address: string
    coverLetter?: string
    tasks: {
      id: number
      title: string
      rewardAmount: BigNumber
      rewardToken: string
    }[]
  }
  isApprover?: boolean
  onAssign?: () => void
}

const AssigneeCard: React.FC<Props> = ({
  taskId,
  isAssigned,
  onAssign,
  assignee,
  isApprover
}) => {
  const [processing, setProcessing] = useState(false)
  const { account, library } = useWeb3()
  const { t } = useTranslation('tasks')

  const approveTask = async (address: string) => {
    if (!account) return
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
    } catch (e) {
      console.error(e)
    } finally {
      setProcessing(false)
    }
  }

  const assigneeAddress = assignee.address

  return (
    <div className='paper'>
      <div className='flex'>
        <p className='text-xl font-semibold'>
          {assigneeAddress?.substring(0, 6)}...
          {assigneeAddress?.substring(assigneeAddress?.length - 4)}
        </p>
      </div>
      <div className='flex gap-1 mt-4'>
        {assignee.tags?.map((tag) => (
          <div key={tag} className='btn-tag'>
            {tag}
          </div>
        ))}
      </div>
      {assignee.coverLetter && (
        <div className='p-4 bg-[#F8F9FA] mt-5 rounded-[10px]'>
          <p className='text-xl font-semibold mb-2'>{t('cover_letter')}</p>
          <span>{assignee.coverLetter}</span>
        </div>
      )}
      {!isAssigned && !!assignee.tasks.length && (
        <div className='flex gap-3 mt-4'>
          <p className='text-xl font-semibold'>{t('recent_tasks')}:</p>
          <ul className='mt-1 list-disc ml-4'>
            {assignee.tasks.map((task) => (
              <li key={task.id}>
                <Link href={`/task/${task.id}`}>
                  <a className='text-[#3667EA] underline'>{task.title}</a>
                </Link>
                <span className='ml-3 inline-flex items-center gap-1 bg-[#70C550]/25 px-2 py-1 rounded-full'>
                  <TokenGeneric width={7.6} />
                  <span className='font-semibold text-sm'>
                    {ethers.utils
                      .formatEther(task?.rewardAmount.toString())
                      .toString()}{' '}
                    ETH
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!isAssigned && isApprover && (
        <div className='flex gap-4 mt-6'>
          <button
            onClick={() => approveTask(assigneeAddress)}
            className='btn-primary px-12'
          >
            {processing ? <Spinner /> : t('assign')}
          </button>
        </div>
      )}
    </div>
  )
}

export default AssigneeCard
