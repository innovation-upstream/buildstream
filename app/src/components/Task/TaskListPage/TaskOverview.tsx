import TaskCard from 'components/Task/TaskCard'
import { Task, TaskStatus } from 'hooks/task/types'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import TabFilter from './TabFilter'

interface TaskViewProps {
  tasks?: Task[]
}

const TaskOverview = ({ tasks: taskList }: TaskViewProps) => {
  const { t } = useTranslation('tasks')
  const [currentTab, setCurrentTab] = useState(TaskStatus.CLOSED)

  return (
    <div>
      <div className='mb-5 lg:block'>
        <h1 className='text-2xl	 lg:text-4xl	font-bold mb-3'>
          {t('account_overview')}
        </h1>
        <TabFilter
          currentTab={currentTab}
          setCurrentTab={(val: number) => setCurrentTab(val)}
        />
      </div>
      <ul className='grid-layout grid-cols-1 2xl:grid-cols-2'>
        {taskList
          ?.filter((task) =>
            currentTab === TaskStatus.ASSIGNED
              ? task.status !== TaskStatus.CLOSED
              : task.status === TaskStatus.CLOSED
          )
          .map((t) => (
            <li key={t.id} className=''>
              <TaskCard
                task={t}
              />
            </li>
          ))}
      </ul>
    </div>
  )
}

export default TaskOverview
