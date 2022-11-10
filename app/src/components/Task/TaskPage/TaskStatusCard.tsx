import { useGetTaskSnapshotsQuery, usePolling } from 'hooks'
import { Organization } from 'hooks/organization/types'
import { Task, TaskSnapshot, TaskStatus } from 'hooks/task/types'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import ClockSmall from 'SVGs/ClockSmall'
import Closed from 'SVGs/Closed'
import Laptop from 'SVGs/Laptop'
import User from 'SVGs/User'
import { Converter } from 'utils/converter'
import { StyledListItem } from './styled'

interface TaskStatusCardProps {
  taskId: number
  taskSnapshots?: TaskSnapshot[]
  organization: Organization
}

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
    icon: Closed,
    messageKey: 'closed',
    fill: 'fill-[#F35B5B]',
    background: 'bg-[#FEEBEB]'
  }
}

const TaskStatusCard = ({
  taskId,
  taskSnapshots: taskSnapshotsList,
  organization
}: TaskStatusCardProps) => {
  const [taskSnapshots, setTaskSnapshots] = useState(taskSnapshotsList)
  const { data, startPolling, stopPolling } = useGetTaskSnapshotsQuery({
    variables: {
      first: 5,
      orderBy: 'timestamp',
      orderDirection: 'desc',
      where: {
        taskId: taskId as any
      }
    }
  })
  usePolling(startPolling, stopPolling)
  const { t } = useTranslation('tasks')

  useEffect(() => {
    if (data?.taskSnapshots) {
      setTaskSnapshots(
        data.taskSnapshots?.map((t) =>
          Converter.TaskSnapshotFromQuery(t as any)
        )
      )
    }
  }, [data])

  const statuses = taskSnapshots
    ?.reduce((prev, curr, index) => {
      if (
        !taskStatusConfig[curr.status] ||
        prev[prev.length - 1] === curr.status
      )
        return prev
      return [...prev, curr.status]
    }, [] as TaskStatus[])
    .reverse()

  return (
    <div className='paper p-6'>
      <p className='text-2xl font-semibold mb-6'>{t('task_status')}</p>
      <div className='divider' />
      <ul className='mt-6'>
        {statuses?.map((status, index) => {
          const current = taskStatusConfig[status]
          if (!current) return null
          const Component = current.icon
          const isLastState = index === statuses.length - 1
          return (
            <StyledListItem
              showLine={statuses.length > 1}
              key={`task-timeline-${index}`}
              className={`relative items-center gap-x-3 lg:gap-x-4 mb-5 ${
                !isLastState ? 'hidden lg:flex' : 'flex'
              }`}
            >
              <div
                className={`iconContainer shrink-0 flex items-center justify-center rounded-full h-9 md:h-10 w-9 md:w-10 ${
                  isLastState ? current.background : 'bg-[#F5F5F5]'
                }`}
              >
                <Component className={isLastState ? current.fill : ''} />
              </div>
              <div className='flex items-center gap-3'>
                <p
                  className={`text-xl font-medium ${
                    !isLastState ? 'text-[#17191A]/40' : ''
                  }`}
                >
                  {t(current.messageKey)}
                </p>
                {isLastState && (
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
