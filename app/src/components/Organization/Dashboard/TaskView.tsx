import CreateTask from 'components/Task/CreateTask'
import TaskDetail from 'components/Task/CreateTask/TaskDetail'
import TaskCard from 'components/Task/TaskCard'
import { useGetTasksQuery } from 'hooks'
import { Organization } from 'hooks/organization/types'
import { Task, TaskStatus } from 'hooks/task/types'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import JiraLogo from 'SVGs/JiraLogo'
import Plus from 'SVGs/Plus'
import { Converter } from 'utils/converter'

interface TaskViewProps {
  organization: Organization
  tasks?: Task[]
}

const EmptyTaskView = ({ organization }: TaskViewProps) => {
  const { t } = useTranslation('organization')
  const [showModal, toggleModal] = useState(false)
  return (
    <div className='mt-6'>
      {showModal && (
        <CreateTask
          oranization={organization}
          close={() => toggleModal(!showModal)}
        />
      )}
      <p className='text-4xl font-bold mb-6'>{t('task')}</p>
      <div className='paper lg:px-10 xl:px-20 2xl:px-24 py-10 text-center'>
        <p className='text-2xl font-semibold mb-3'>{t('create_first_task')}</p>
        <span className='text-secondary'>{t('create_task_from_scratch')}</span>
        <div className='flex justify-center gap-4 items-center mt-8'>
          <button
            className='w-full btn-outline flex justify-center gap-2.5 items-center'
            onClick={() => toggleModal(!showModal)}
          >
            <Plus className='fill-[#3667EA]' /> {t('add_task')}
          </button>
          <button className='w-full btn-primary flex justify-center gap-1 items-center text-[#17191A] bg-[#3667EA]/10'>
            {t('import_from')} <JiraLogo /> Jira
          </button>
        </div>
      </div>
    </div>
  )
}

const TaskView = ({ tasks: taskList, organization }: TaskViewProps) => {
  const [tasks, setTasks] = useState(taskList)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { data } = useGetTasksQuery({
    variables: {
      where: {
        orgId: organization.id.toString()
      }
    }
  })
  const { t: tr } = useTranslation('organization')
  const [taskIndex, setTaskIndex] = useState(0)
  const [selected, setSelected] = useState<number>()

  useEffect(() => {
    if (data?.tasks) {
      setTasks(data.tasks.map((t) => Converter.TaskFromQuery(t)))
    }
  }, [data])

  if (!tasks?.length) {
    return <EmptyTaskView organization={organization} />
  }

  const selectedTask = tasks.find((t) => t.id === selected)

  return (
    <div className='mt-6'>
      {showCreateModal && (
        <CreateTask
          oranization={organization}
          close={() => setShowCreateModal(false)}
        />
      )}
      {selectedTask && (
        <TaskDetail
          task={tasks[taskIndex]}
          close={() => setSelected(undefined)}
        />
      )}
      <div className='flex flex-col md:flex-row gap-4 md:items-center mb-6'>
        <p className='text-4xl font-bold mr-7'>{tr('tasks')}</p>
        <div className='flex gap-4'>
          <button
            className='btn-outline flex justify-center gap-2.5 items-center'
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className='fill-[#3667EA]' /> {tr('add_task')}
          </button>
          <button className='btn-primary flex justify-center gap-1 items-center text-[#17191A] bg-[#3667EA]/10'>
            {tr('import_from')} <JiraLogo /> Jira
          </button>
        </div>
      </div>
      <ul>
        {tasks.map((t, index) => (
          <li key={t.id} className='mb-4'>
            <TaskCard task={t} onClick={(id) => setSelected(id)}>
              {t.status < TaskStatus.ASSIGNED && (
                <button
                  type='button'
                  className='hidden xl:block flex items-center gap-x-3 btn-outline border-[#EFF0F1] hover:border-gray-500 focus:border-gray-500'
                >
                  {tr('recommended_contributors')}
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
