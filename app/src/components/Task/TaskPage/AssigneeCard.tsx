import TokenGeneric from 'SVGs/TokenGeneric'
import { BigNumber, ethers } from 'ethers'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import AssignTask from '../AssignTask/AssignTask'

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
  const { t } = useTranslation('tasks')

  const assigneeAddress = assignee.address

  return (
    <div className='paper'>
      <div className='flex'>
        <p className='text-xl font-semibold'>
          {assigneeAddress?.substring(0, 6)}...
          {assigneeAddress?.substring(assigneeAddress?.length - 4)}
        </p>
      </div>
      {assignee.tags?.length > 0 && (
        <div className='flex gap-1 mt-4'>
          {assignee.tags?.map((tag) => (
            <div key={tag} className='btn-tag'>
              {tag}
            </div>
          ))}
        </div>
      )}
      {assignee.coverLetter && (
        <div className='p-4 bg-[#F8F9FA] mt-5 rounded-[10px]'>
          <p className='text-xl font-semibold mb-2'>{t('cover_letter')}</p>
          <span>{assignee.coverLetter}</span>
        </div>
      )}
      {!isAssigned && !!assignee.tasks.length && (
        <div className='flex flex-col md:flex-row gap-3 mt-4'>
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
            onClick={() => setProcessing(true)}
            className='btn-primary px-12'
          >
            {t('assign')}
          </button>
        </div>
      )}
      {processing && (
        <AssignTask
          taskId={taskId}
          assignee={assigneeAddress}
          onSuccess={() => {
            toast.success(
              t('assigned_successfully', {
                assignee: assigneeAddress.substring(0, 6)
              }),
              {
                icon: '👍'
              }
            )
            onAssign?.()
          }}
          onError={() =>
            toast.error(
              t('error_assigning', {
                assignee: assigneeAddress.substring(0, 6)
              }),
              {
                icon: '❌'
              }
            )
          }
          onClose={() => setProcessing(false)}
        />
      )}
    </div>
  )
}

export default AssigneeCard
