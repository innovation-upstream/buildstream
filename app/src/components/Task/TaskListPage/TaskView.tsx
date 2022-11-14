import { Task } from 'hooks/task/types'
import TaskCard from 'components/Task/TaskCard'
import { useEffect, useState } from 'react'
import { useGetTasksQuery, usePolling } from 'hooks'
import { Converter } from 'utils/converter'
import { useTranslation } from 'react-i18next'

interface TaskViewProps {
  tasks?: Task[]
}

const TaskView = ({ tasks: taskList }: TaskViewProps) => {
  const [tasks, setTasks] = useState(taskList)
  const { data, startPolling, stopPolling } = useGetTasksQuery({})
  usePolling(startPolling, stopPolling)
  const { t: tr } = useTranslation('organization')

  useEffect(() => {
    if (data?.tasks) {
      setTasks(data.tasks.map((t) => Converter.TaskFromQuery(t)))
    }
  }, [data])

  if (!tasks?.length) {
    return null
  }

  return (
    <div>
      <ul>
        {tasks.map((t) => (
          <li key={t.id} className='mb-4'>
            <TaskCard showDescription task={t} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TaskView
