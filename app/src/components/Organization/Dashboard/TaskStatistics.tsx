import Calendar from 'SVGs/Calendar'
import Clock from 'SVGs/Clock'
import Close from 'SVGs/Close'
import { Stat } from 'hooks/userstat/types'
import { useTranslation } from 'react-i18next'

interface TaskStatisticsProps {
  stat: Stat
}

const TaskStatistics = ({ stat }: TaskStatisticsProps) => {
  const { t } = useTranslation('organization')
  return (
    <div className='paper'>
      <p className='text-2xl font-semibold mb-5'>{t('task_statistics')}</p>
      <div className='divider' />
      <div className='mt-5 p-3 gap-5 flex rounded-lg bg-[#F5F7F9]'>
        <div className='w-14 h-14 flex items-center justify-center rounded-lg bg-[#EFA045]'>
          <Clock />
        </div>
        <div>
          <p className='text-base lg:text-2xl font-semibold'>
            {stat.assignedTasks.add(stat.submittedTasks).toString()}
          </p>
          <span className='text-sm lg:text-base'>{t('task_in_progress')}</span>
        </div>
      </div>
      <div className='mt-3 p-3 gap-5 flex rounded-lg bg-[#F5F7F9]'>
        <div className='w-14 h-14 flex items-center justify-center rounded-lg bg-[#EDBBC3]'>
          <Close />
        </div>
        <div>
          <p className='text-base lg:text-2xl font-semibold'>
            {stat.closedTasks.toString()}
          </p>
          <span className='text-sm lg:text-base'>{t('closed_tasks')}</span>
        </div>
      </div>
      <div className='mt-3 p-3 gap-5 flex rounded-lg bg-[#F5F7F9]'>
        <div className='w-14 h-14 flex items-center justify-center rounded-lg bg-[#F56689]'>
          <Calendar />
        </div>
        <div>
          <p className='text-base lg:text-2xl font-semibold'>0</p>
          <span className='text-sm lg:text-base'>{t('overdue_tasks')}</span>
        </div>
      </div>
    </div>
  )
}

export default TaskStatistics
