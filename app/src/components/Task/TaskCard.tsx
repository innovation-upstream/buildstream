import { ComplexityScore, ComplexityScoreMap, Task } from 'hooks/task/types'
import Badge from 'SVGs/Badge'
import { ethers } from 'ethers'
import TokenGeneric from 'SVGs/TokenGeneric'
import { ReactNode } from 'react'

interface TaskCardProps {
  task: Task
  showDescription?: boolean
  hideChildren?: boolean
  taskRequirementLocation?: 'inline' | 'footer'
  children?: ReactNode
}

const TaskCard = ({
  task,
  showDescription,
  hideChildren,
  taskRequirementLocation = 'inline',
  children
}: TaskCardProps) => {
  const reward = ethers.utils
    .formatEther(task?.rewardAmount.toString())
    .toString()

  const taskRequirement = (
    <div className='flex gap-6 items-center'>
      <div className='flex gap-1'>
        <p className='text-[#646873]'>Level:</p>
        <span className='font-semibold'>
          {ComplexityScoreMap[task.complexityScore].charAt(0).toUpperCase() +
            ComplexityScoreMap[task.complexityScore].slice(1)}
        </span>
      </div>
      <div className='flex gap-1'>
        <p className='text-[#646873]'>Reputation:</p>
        <Badge />
        <span className='font-semibold'>{task.reputationLevel}</span>
      </div>
    </div>
  )
  return (
    <div className='paper'>
      <div className='flex mb-2'>
        <div className='flex'>{task.organization.name}</div>
      </div>
      <p className='text-[28px] leading-8 font-bold mb-3.5'>
        {task.title}
        <span className='text-base whitespace-pre font-medium text-[#70C550]'>
          {'  '}
          ID: {task.id}
        </span>
      </p>
      {taskRequirementLocation === 'inline' && taskRequirement}
      <div className={`flex gap-1 mt-3 ${showDescription ? '' : 'mb-6'}`}>
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
          <button type='button' className='btn-primary px-6'>
            Task Details
          </button>
          {!hideChildren && children}
          {taskRequirementLocation === 'footer' && taskRequirement}
        </div>
        <div className='flex items-center gap-1 bg-[#70C550]/25 px-3 py-2 rounded-full'>
          <TokenGeneric />
          <span className='font-semibold'>{reward} ETH</span>
        </div>
      </section>
    </div>
  )
}

export default TaskCard
