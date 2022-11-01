import Plus from 'SVGs/Plus'
import JiraLogo from 'SVGs/JiraLogo'
import { Task, TaskStatus } from 'hooks/task/types'
import TaskCard from 'components/Task/TaskCard'
import { useEffect, useState } from 'react'
import { useGetTasksQuery, usePolling } from 'hooks'
import { Converter } from 'utils/converter'
import { Organization } from 'hooks/organization/types'

interface TaskViewProps {
  organization: Organization
  tasks?: Task[]
}

const EmptyTaskView = () => {
  return (
    <div className='mt-6'>
      <p className='text-4xl font-bold mb-6'>Tasks</p>
      <div className='paper lg:px-10 xl:px-20 2xl:px-24 py-10 text-center'>
        <p className='text-2xl font-semibold mb-3'>Create your first task</p>
        <span className='text-secondary'>
          You can create tasks from scratch or connect more task managers
        </span>
        <div className='flex justify-center gap-4 items-center mt-8'>
          <button className='w-full btn-outline flex justify-center gap-2.5 items-center'>
            <Plus className='fill-[#3667EA]' /> Add task
          </button>
          <button className='w-full btn-primary flex justify-center gap-1 items-center text-[#17191A] bg-[#3667EA]/10'>
            Import from <JiraLogo /> Jira
          </button>
        </div>
      </div>
    </div>
  )
}

const TaskView = ({ tasks: taskList, organization }: TaskViewProps) => {
  const [tasks, setTasks] = useState(taskList)
  const { data, startPolling, stopPolling } = useGetTasksQuery({
    variables: {
      where: {
        orgId: organization.id.toString()
      }
    }
  })
  usePolling(startPolling, stopPolling)

  useEffect(() => {
    if (data?.tasks) {
      setTasks(data.tasks.map((t) => Converter.TaskFromQuery(t)))
    }
  }, [data])

  if (!tasks?.length) {
    return <EmptyTaskView />
  }

  return (
    <div className='mt-6'>
      <div className='flex gap-4 items-center mb-6'>
        <p className='text-4xl font-bold mr-7'>Tasks</p>
        <button className='btn-outline flex justify-center gap-2.5 items-center'>
          <Plus className='fill-[#3667EA]' /> Add task
        </button>
        <button className='btn-primary flex justify-center gap-1 items-center text-[#17191A] bg-[#3667EA]/10'>
          Import from <JiraLogo /> Jira
        </button>
      </div>
      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            <TaskCard task={t}>
              {t.status < TaskStatus.ASSIGNED && (
                <button
                  type='button'
                  className='hidden xl:block flex items-center gap-x-3 btn-outline border-[#EFF0F1] hover:border-gray-500 focus:border-gray-500'
                >
                  Recommended contributors
                </button>
              )}
            </TaskCard>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TaskView
