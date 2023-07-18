import { useTokens } from '@innovationupstream/buildstream-utils'
import Laptop from 'SVGs/Laptop'
import Alert from 'components/Alert/Alert'
import { useWeb3 } from 'hooks'
import { Task } from 'hooks/task/types'
import { User } from 'models/User/User'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import React from 'react'

interface Props {
  task: Task
  assignee: {
    address: string
    profile: User
    tokens: {
      id: string
      token: number
      count: number
    }[]
  }
}

const AssigneeCard: React.FC<Props> = ({ task, assignee }) => {
  const { account } = useWeb3()
  const { t } = useTranslation('tasks')
  const tokenList = useTokens()
  const isApprover = account && task?.organization?.approvers?.includes(account)
  const assigneeAddress = assignee.address
  const assigneeAddressTruncated = `${assigneeAddress?.substring(0, 12)}...
  ${assigneeAddress?.substring(assigneeAddress?.length - 4)}`

  return (
    <Alert
      className='border-[#4bae4e]/30'
      icon={
        <div className='iconContainer shrink-0 flex items-center justify-center rounded-full h-7 md:h-8 w-7 md:w-8 bg-[#4bae4e]/30'>
          <Laptop className='fill-[#4bae4e]' />
        </div>
      }
    >
      <p className='font-bold mb-2 text-lg'>
        {t('task_assigned_alert_title')}
        <Link href={`/account/${assigneeAddress}`}>
          <a className='font-bold mb-2 text-lg' target='_blank'>
            {assignee.profile?.displayName
              ? `${assignee.profile.displayName}(${assigneeAddressTruncated})`
              : assigneeAddressTruncated}
          </a>
        </Link>
      </p>
      {assignee?.tokens.length > 0 && (
        <div className='flex gap-1 mt-4'>
          {assignee?.tokens?.map((token) => (
            <div key={token.id} className='btn-tag'>
              {tokenList?.find((t) => t.id === token.token.toString())?.name}
              <span className='ml-2 font-bold'>{token.count}</span>
            </div>
          ))}
        </div>
      )}
      {isApprover &&
        (assignee?.profile?.email || assignee?.profile?.githubProfile) && (
          <div className='flex flex-col gap-3 mt-4'>
            {assignee?.profile?.email && (
              <div>
                <span className='block text-gray-700 text-sm mb-1'>
                  {t('email')}
                </span>
                <p className='text-sm font-semibold break-all'>
                  {assignee.profile.email}
                </p>
              </div>
            )}
            {assignee?.profile?.githubProfile && (
              <div>
                <span className='block text-gray-700 text-sm mb-1'>
                  {t('github_profile')}
                </span>
                <p className='text-sm font-semibold break-all'>
                  {assignee.profile.githubProfile}
                </p>
              </div>
            )}
          </div>
        )}
    </Alert>
  )
}

export default AssigneeCard
