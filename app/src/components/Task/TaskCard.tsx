import { ComplexityScore, ComplexityScoreMap, Task } from 'hooks/task/types'
import Badge from 'SVGs/Badge'
import { ethers } from 'ethers'
import TokenGeneric from 'SVGs/TokenGeneric'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'

interface TaskCardProps {
  task: Task
  showDescription?: boolean
  hideChildren?: boolean
  hideViewButton?: boolean
  taskRequirementLocation?: 'inline' | 'footer'
  taskRequirementLocationTablet?: 'inline' | 'footer'
  children?: ReactNode
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
  showDescription,
  hideChildren,
  hideViewButton,
  taskRequirementLocation = 'inline',
  taskRequirementLocationTablet = 'inline',
  children
}: TaskCardProps) => {
  const reward = ethers.utils
    .formatEther(task?.rewardAmount.toString())
    .toString()
  const { t } = useTranslation('tasks')

  return (
    <div className='paper'>
      <div className='flex mb-2'>
        <div className='flex'>{task.organization.name}</div>
      </div>
      <p className='text-2xl lg:text-[28px] leading-8 font-bold mb-3.5'>
        {task.title}
        <span className='text-base whitespace-pre font-medium text-[#70C550]'>
          {'  '}
          {t('id')}: {task.id}
        </span>
      </p>
      {taskRequirementLocation === 'inline' && (
        <TaskRequirement
          complexityScore={task.complexityScore}
          reputationLevel={task.reputationLevel}
          className='hidden lg:flex'
        />
      )}
      {taskRequirementLocationTablet === 'inline' && (
        <TaskRequirement
          complexityScore={task.complexityScore}
          reputationLevel={task.reputationLevel}
          className='flex lg:hidden'
        />
      )}
      <div className={`flex flex-wrap gap-1 mt-3 ${showDescription ? '' : 'mb-6'}`}>
        {task.taskTags?.map((tag) => (
          <div key={tag} className='btn-tag'>
            {tag}
          </div>
        ))}
      </div>
      {showDescription && <p className='mt-3 mb-6'>{task.description}</p>}
      <div className='divider' />
      <section className='flex justify-between items-center mt-6'>
        <div className='flex gap-5'>
          {!hideViewButton && (
            <Link href={`/task/${task.id}`}>
              <button type='button' className='btn-primary px-6'>
                {t('task_details')}
              </button>
            </Link>
          )}
          {!hideChildren && children}
          {taskRequirementLocation === 'footer' && (
            <TaskRequirement
              complexityScore={task.complexityScore}
              reputationLevel={task.reputationLevel}
              className='hidden lg:flex'
            />
          )}
        </div>

        <div className='flex items-center gap-1 bg-[#70C550]/25 px-3 py-2 rounded-full'>
          <TokenGeneric />
          <span className='font-semibold text-sm'>{reward} ETH</span>
        </div>
      </section>
    </div>
  )
}

export default TaskCard
