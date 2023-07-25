import { useTokens } from '@innovationupstream/buildstream-utils'
import Email from 'SVGs/Email'
import Github from 'SVGs/Github'
import TokenGeneric from 'SVGs/TokenGeneric'
import { BigNumber, ethers } from 'ethers'
import useTokenInfos from 'hooks/currency/useCurrencies'
import { User } from 'models/User/User'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import AssignTask from '../AssignTask/AssignTask'
import DenyTask from '../DenyTask/DenyTask'

interface Props {
  taskId: number
  assignee: {
    address: string
    profile: User
    coverLetter?: string
    tasks: {
      id: number
      title: string
      rewardAmount: BigNumber
      rewardToken: string
    }[]
    tokens: {
      id: string
      token: number
      count: number
    }[]
  }
  isApprover?: boolean
  onAssign?: () => void
  onDeny?: () => void
}

const AssignmentRequestCard: React.FC<Props> = ({
  taskId,
  onAssign,
  assignee,
  isApprover,
  onDeny
}) => {
  const [processing, setProcessing] = useState(false)
  const [processingDeny, setProcessingDeny] = useState(false)
  const { t } = useTranslation('tasks')
  const tokenList = useTokens()
  const { tokenInfos } = useTokenInfos()

  const assigneeAddress = assignee.address

  return (
    <div className='paper'>
      <div className=''>
        {assignee.profile?.displayName && (
          <p className='text-xl font-semibold'>
            {assignee.profile.displayName}
          </p>
        )}
        <Link href={`/account/${assigneeAddress}`}>
          <a className='text-xl font-semibold' target='_blank'>
            {`${assigneeAddress?.substring(0, 12)}...
            ${assigneeAddress?.substring(assigneeAddress?.length - 4)}`}
          </a>
        </Link>
      </div>
      <div className='flex gap-2 mt-2'>
        {assignee.profile?.githubProfile && (
          <a
            href={assignee.profile.githubProfile}
            className='iconContainer shrink-0 flex items-center justify-center rounded-full h-7 md:h-8 w-7 md:w-8'
            target='_blank'
            rel='noreferrer'
          >
            <Github />
          </a>
        )}
        {assignee.profile?.email && (
          <a
            href={`mailto:${assignee.profile.email}`}
            className='iconContainer shrink-0 flex items-center justify-center rounded-full h-7 md:h-8 w-7 md:w-8'
            target='_blank'
            rel='noreferrer'
          >
            <Email />
          </a>
        )}
      </div>
      {assignee.tokens?.length > 0 && (
        <div className='flex gap-1 mt-4'>
          {assignee.tokens?.map((token) => (
            <div key={token.id} className='btn-tag'>
              {tokenList?.find((t) => t.id === token.token.toString())?.name}
              <span className='ml-2 font-bold'>{token.count}</span>
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
      {!!assignee.tasks.length && (
        <div className='mt-4'>
          <p className='text-xl font-semibold'>{t('recent_tasks')}:</p>
          <ul className='mt-1 list-disc list-outside ml-4'>
            {assignee.tasks.map((task) => (
              <li key={task.id}>
                <Link href={`/task/${task.id}`}>
                  <a className='text-[#3667EA] underline' target='_blank'>
                    {task.title}
                  </a>
                </Link>
                <span className='ml-3 inline-flex items-center gap-1 bg-[#70C550]/25 px-2 py-1 rounded-full'>
                  <TokenGeneric width={7.6} />
                  <span className='font-semibold text-sm'>
                    {ethers.utils
                      .formatEther(task?.rewardAmount.toString())
                      .toString()}{' '}
                    {
                      tokenInfos?.find((t) => t.address === task.rewardToken)
                        ?.symbol
                    }
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {isApprover && (
        <div className='flex gap-4 mt-6'>
          <button
            onClick={() => setProcessing(true)}
            className='btn-primary px-12'
          >
            {t('assign')}
          </button>
          <button
            onClick={() => setProcessingDeny(true)}
            className='btn-primary bg-rose-400 hover:bg-rose-300 px-12'
          >
            {t('reject')}
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
      {processingDeny && (
        <DenyTask
          taskId={taskId}
          assignee={assigneeAddress}
          onSuccess={() => {
            toast.success(
              t('denied_successfully', {
                assignee: assigneeAddress.substring(0, 6)
              }),
              {
                icon: '👍'
              }
            )
            onDeny?.()
          }}
          onError={() =>
            toast.error(
              t('error_denying', {
                assignee: assigneeAddress.substring(0, 6)
              }),
              {
                icon: '❌'
              }
            )
          }
          onClose={() => setProcessingDeny(false)}
        />
      )}
    </div>
  )
}

export default AssignmentRequestCard
