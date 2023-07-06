import Archive from 'SVGs/Archive'
import ClockSmall from 'SVGs/ClockSmall'
import Correct from 'SVGs/Correct'
import Laptop from 'SVGs/Laptop'
import User from 'SVGs/User'
import { Task, TaskStatus } from 'hooks/task/types'
import { useTranslation } from 'next-i18next'
import { StyledListItem } from './styled'

interface TaskStatusCardProps {
  task: Task
}

const statuses = [
  TaskStatus.OPEN,
  TaskStatus.ASSIGNED,
  TaskStatus.SUBMITTED,
  TaskStatus.CLOSED,
  TaskStatus.ARCHIVED
]

const taskStatusConfig = {
  [TaskStatus.PROPOSED]: null,
  [TaskStatus.OPEN]: {
    icon: User,
    messageKey: 'contributor_selection',
    fill: 'fill-[#6BC5A1]',
    background: 'bg-[#6BC5A1]/30'
  },
  [TaskStatus.ASSIGNED]: {
    icon: Laptop,
    messageKey: 'task_in_progress',
    background: 'bg-[#E7EDFC]',
    fill: 'fill-[#3667EA]'
  },
  [TaskStatus.SUBMITTED]: {
    icon: ClockSmall,
    messageKey: 'waiting_for_approval',
    fill: 'fill-[#EFA045]',
    background: 'bg-[#FCF0E1]'
  },
  [TaskStatus.CLOSED]: {
    icon: Correct,
    messageKey: 'closed',
    fill: 'fill-[#4bae4e]',
    background: 'bg-[#4bae4e]/30'
  },
  [TaskStatus.ARCHIVED]: {
    icon: Archive,
    messageKey: 'archived',
    fill: 'fill-[#444c54]',
    background: 'bg-[#444c54]/30'
  }
}

const TaskStatusCard = ({ task }: TaskStatusCardProps) => {
  const { t } = useTranslation('tasks')

  return (
    <div className='paper p-6'>
      <p className='text-2xl font-semibold mb-6'>{t('task_status')}</p>
      <div className='divider' />
      <ul className='mt-6'>
        {statuses?.map((status, index) => {
          if (
            status === TaskStatus.ARCHIVED &&
            task.status !== TaskStatus.ARCHIVED
          )
            return null

          const current = taskStatusConfig[status]
          if (!current) return null
          const Component = current.icon
          const isCurrentState = task.status === status

          return (
            <StyledListItem
              showLine={statuses.length > 1}
              key={`task-timeline-${index}`}
              className={`relative items-center gap-x-3 lg:gap-x-4 mb-5 ${
                !isCurrentState ? 'hidden lg:flex' : 'flex'
              }`}
            >
              <div
                className={`iconContainer shrink-0 flex items-center justify-center rounded-full h-9 md:h-10 w-9 md:w-10 ${
                  isCurrentState ? current.background : 'bg-[#F5F5F5]'
                }`}
              >
                <Component className={isCurrentState ? current.fill : ''} />
              </div>
              <div className='flex items-center gap-3'>
                <p
                  className={`text-xl font-medium ${
                    !isCurrentState ? 'text-[#17191A]/40' : ''
                  }`}
                >
                  {t(current.messageKey)}
                </p>
                {isCurrentState && (
                  <div className='shrink-0 h-2 w-2 bg-[#6BC5A1] rounded-full'></div>
                )}
              </div>
            </StyledListItem>
          )
        })}
      </ul>
    </div>
  )
}

export default TaskStatusCard
