import { Task } from 'hooks/task/types'
import TaskCard from 'components/Task/TaskCard'
import { useEffect, useState } from 'react'
import { useGetTasksQuery } from 'hooks'
import { Converter } from 'utils/converter'
import { useTranslation } from 'react-i18next'
import { useTaskFilter } from './FilterContext'
import Search from './Search'

interface TaskViewProps {
  tasks?: Task[]
}

const TaskView = ({ tasks: taskList }: TaskViewProps) => {
  const [tasks, setTasks] = useState(taskList || [])
  const { refetch } = useGetTasksQuery()
  const { filterQueryVariables, setText } = useTaskFilter()

  const filterTasks = async () => {
    const result = await Promise.all(
      (filterQueryVariables || []).map(
        async (queryVar) => await refetch(queryVar)
      )
    )
    const flattenedResult = result.map((r) => r.data.tasks).flat()

    // Remove duplicates
    const filteredTasks = flattenedResult.filter(
      (task, index, array) => array.findIndex((t) => t.id == task.id) == index
    )
    const sortedTasks = filteredTasks.sort(
      (a, b) => Number(b.id) - Number(a.id)
    )
    setTasks(sortedTasks.map((task) => Converter.TaskFromQuery(task)))
  }

  const loadMore = async () => {
    const result = await Promise.all(
      (filterQueryVariables || []).map(
        async (queryVar) =>
          await refetch({
            ...queryVar,
            where: {
              ...(queryVar?.where || {}),
              taskId_lt: tasks.length ? (tasks[tasks.length - 1].id as any) : 0
            }
          })
      )
    )
    const flattenedResult = result.map((r) => r.data.tasks).flat()

    // Remove duplicates
    const filteredTasks = flattenedResult.filter(
      (task, index, array) => array.findIndex((t) => t.id == task.id) == index
    )
    const sortedTasks = filteredTasks.sort(
      (a, b) => Number(b.id) - Number(a.id)
    )
    setTasks([
      ...tasks,
      ...sortedTasks.map((task) => Converter.TaskFromQuery(task))
    ])
  }

  useEffect(() => {
    filterTasks()
  }, [filterQueryVariables])

  return (
    <div>
      <div className='mb-5 hidden lg:block'>
        <Search />
      </div>
      <ul>
        {tasks?.map((t) => (
          <li key={t.id} className='mb-4'>
            <TaskCard showDescription task={t} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TaskView
