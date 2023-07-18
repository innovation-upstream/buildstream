import Badge from 'SVGs/Badge'
import TokenGeneric from 'SVGs/TokenGeneric'
import { ethers } from 'ethers'
import { useWeb3 } from 'hooks'
import useTokenInfo from 'hooks/currency/useCurrency'
import { getRewardAmount } from 'hooks/task/functions'
import { ComplexityScore, ComplexityScoreMap, Task } from 'hooks/task/types'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface TaskCardProps {
  task: Task
  onClick?: (id: number) => void
  onShare?: (id: number) => void
}

const TaskRequirement = ({
  complexityScore,
  reputationLevel,
  className
}: any) => {
  const { t } = useTranslation('tasks')
  return (
    <div className={`gap-6 items-center ${className}`}>
      <div className='flex gap-1'>
        <p className='text-[#646873]'>{t('level')}</p>
        <span className='font-semibold'>
          {ComplexityScoreMap[complexityScore as ComplexityScore]
            .charAt(0)
            .toUpperCase() +
            ComplexityScoreMap[complexityScore as ComplexityScore].slice(1)}
        </span>
      </div>
      <div className='flex gap-1'>
        <p className='text-[#646873]'>{t('reputation')}:</p>
        <Badge />
        <span className='font-semibold'>{reputationLevel}</span>
      </div>
    </div>
  )
}

const TaskCard = ({
  task,
  onClick,
  onShare
}: TaskCardProps) => {
  const { t } = useTranslation('tasks')
  const { tokenInfo } = useTokenInfo()
  const { pathname } = useRouter()
  const [rewardValue, setRewardValue] = useState('')
  const { library } = useWeb3()

  const handleShare = (e: any) => {
    e.stopPropagation()
    onShare?.(task.id)
  }

  const getReward = useCallback(async () => {
    const reward = await getRewardAmount(task, library?.getSigner())
    setRewardValue(ethers.utils.formatEther(reward.toString()).toString())
  }, [task.taskTags.toString(), library])

  useEffect(() => {
    getReward()
  }, [getReward])

  return (
    
      <div
        className='relative paper hover:drop-shadow-xl hover:brightness-[0.98]'
        onClick={() => onClick?.(task.id)}
      >
        <div className='flex mb-2'>
          {pathname.includes('organization') ? (
            <span>{task.organization.name}</span>
          ) : (
            <div className='flex'>
              <Link href={`/organization/${task.orgId}`}>
                <a className='hover:text-blue-700 hover:underline z-[1]'>
                  {task.organization.name}
                </a>
              </Link>
            </div>
          )}
        </div>
        <p className='text-2xl lg:text-[28px] leading-8 font-bold mb-3.5'>
          {task.title}
        </p>
        <TaskRequirement
          complexityScore={task.complexityScore}
          reputationLevel={task.reputationLevel}
          className='hidden lg:flex'
        />
        <div
          className='flex flex-wrap gap-1 mt-3'
        >
          {task.taskTags?.map((tag) => (
            <div key={tag.id} className='btn-tag'>
              {tag.name}
            </div>
          ))}
        </div>
        <p className='mt-3 mb-6 break-all'>{task.description}</p>
        <div className='divider' />
        <section className='flex justify-between items-center mt-6'>
          <div className='flex gap-5'>
            <button
              className='btn-primary min-w-full md:min-w-fit bg-green-700 hover:bg-green-500 z-[1]'
              onClick={handleShare}
            >
              {t('share')}
            </button>
          </div>

          <div className='flex items-center gap-1 bg-[#70C550]/25 px-3 py-2 rounded-full'>
            <TokenGeneric />
            <span className='font-semibold text-sm'>
              {rewardValue} {tokenInfo?.symbol}
            </span>
          </div>
        </section>
        <Link href={`/task/${task.id}`}>
          <a className='after:absolute after:w-full after:h-full after:inset-0' />
        </Link>
      </div>
  )
}

export default TaskCard
