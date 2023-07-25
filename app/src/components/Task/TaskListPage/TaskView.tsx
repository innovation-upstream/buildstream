import TaskCard from 'components/Task/TaskCard'
import { useGetTasksQuery } from 'hooks'
import { getTaskInstructions } from 'hooks/task/functions'
import { Task } from 'hooks/task/types'
import { fetchClickupTask } from 'integrations/clickup/api'
import { useEffect, useState } from 'react'
import { Converter } from 'utils/converter'
import EditTask from '../EditTask/EditTask'
import ShareTask from '../ShareTask'
import { useTaskFilter } from './FilterContext'
import Search from './Search'

const isBrowser = typeof window !== 'undefined'

interface TaskViewProps {
  tasks?: Task[]
}

const TaskView = ({ tasks: taskList }: TaskViewProps) => {
  const [tasks, setTasks] = useState(taskList || [])
  const { refetch } = useGetTasksQuery()
  const { filterQueryVariables } = useTaskFilter()
  const [shareLink, setShareLink] = useState<string>()
  const [taskToEdit, setTaskToEdit] = useState<{
    task: Task
    instructions?: string
  }>()

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
    const tasksWithClickupData = await Promise.all(
      sortedTasks.map(async (t) => {
        if (!t.externalId) {
          return t
        }
        const clickupTask = await fetchClickupTask(
          t.externalId as string,
          t.orgId.id
        )
        return {
          ...t,
          title: clickupTask?.name || t.title,
          description: clickupTask?.description || t.description
        }
      })
    )
    setTasks(tasksWithClickupData.map((task) => Converter.TaskFromQuery(task)))
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

  const onShare = (taskId: number) => {
    setShareLink(`${isBrowser ? window.location.origin : ''}/task/${taskId}`)
  }

  useEffect(() => {
    filterTasks()
  }, [filterQueryVariables])

  useEffect(() => {
    if (!taskToEdit?.task?.id) return
    getTaskInstructions(Number(taskToEdit.task.id)).then((instructions) => {
      setTaskToEdit(t => ({ ...t, instructions } as any))
    })
  }, [taskToEdit?.task?.id])

  return (
    <div>
      <div className='mb-5 hidden lg:block'>
        <Search />
      </div>
      {shareLink && (
        <ShareTask url={shareLink} onClose={() => setShareLink(undefined)} />
      )}
      {taskToEdit?.task && (
        <EditTask
          task={taskToEdit.task}
          instructions={taskToEdit.instructions || ''}
          organization={taskToEdit.task.organization}
          close={() => setTaskToEdit(undefined)}
        />
      )}
      <ul>
        {tasks?.map((t) => (
          <li key={t.id} className='mb-4'>
            <TaskCard
              task={t}
              onShare={onShare}
              onEdit={() => setTaskToEdit({ task: t })}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TaskView
