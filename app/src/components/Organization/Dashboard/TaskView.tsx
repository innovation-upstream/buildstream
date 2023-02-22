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
import TaskFilterTabs from './TaskFilterTabs'
import { TaskFilters } from './types'
import OauthPopup from 'react-oauth-popup'
import ClickupImport from 'components/Task/ImportTask/ClickupImport'
import ClickupLogo from 'SVGs/ClickupLogo'
import { getCookie } from 'cookies-next'
import { TOKEN_KEY, fetchClickupTask } from 'integrations/clickup/api'

interface TaskViewProps {
  organization: Organization
  tasks?: Task[]
}

const client_id = process.env.NEXT_PUBLIC_CLICKUP_CLIENT_ID
const redirect_uri = process.env.NEXT_PUBLIC_CLICKUP_REDIRECT_URL
const clickupUrl = `https://app.clickup.com/api?client_id=${client_id}&redirect_uri=${redirect_uri}`

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
      <p className='text-4xl font-bold mb-6'>{t('tasks')}</p>
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
  const [currentTab, setCurrentTab] = useState(TaskFilters.WITHOUT_REQUEST)
  const [importClickup, setImportClickup] = useState(false)
  const [clickupCode, setClickupCode] = useState('')

  const onCode = async (code: any, params?: any) => {
    setClickupCode(code)
    setImportClickup(true)
  }

  const queryParams = () => {
    if (currentTab === TaskFilters.WITHOUT_REQUEST) {
      return {
        status_lte: currentTab + 1,
        assignmentRequest: null
      }
    }
    if (currentTab === TaskFilters.WITH_REQUEST) {
      return {
        status: currentTab,
        assignmentRequest_not: null
      }
    }
    if (currentTab === TaskFilters.IN_PROGRESS) {
      return {
        status_gte: currentTab,
        status_lte: currentTab + 1,
        assignmentRequest_not: null
      }
    }
    return {
      status_gt: TaskFilters.CLOSED
    }
  }

  const { data } = useGetTasksQuery({
    variables: {
      where: {
        orgId: organization.id.toString(),
        ...queryParams()
      }
    }
  })
  const { t: tr } = useTranslation('organization')
  const [selected, setSelected] = useState<number>()

  useEffect(() => {
    if (!data?.tasks) return
    Promise.all(
      data.tasks.map(async (t) => {
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
    ).then((tasksWithClickupData) =>
      setTasks(tasksWithClickupData.map((t) => Converter.TaskFromQuery(t)))
    )
  }, [data])

  const selectedTask = tasks?.find((t) => t.id === selected)

  return (
    <div className='mt-6'>
      {showCreateModal && (
        <CreateTask
          oranization={organization}
          close={() => setShowCreateModal(false)}
        />
      )}
      {importClickup && (
        <ClickupImport
          organizationId={organization.id}
          clickup_code={clickupCode}
          close={() => setImportClickup(false)}
        />
      )}
      {selectedTask && (
        <TaskDetail task={selectedTask} close={() => setSelected(undefined)} />
      )}

      {!tasks?.length ? (
        <EmptyTaskView organization={organization} />
      ) : (
        <div className='flex flex-col md:flex-row gap-4 md:items-center mb-6'>
          <p className='text-4xl font-bold mr-7'>{tr('tasks')}</p>
          <div className='flex gap-4'>
            <button
              className='btn-outline flex justify-center gap-2.5 items-center'
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className='fill-[#3667EA]' /> {tr('add_task')}
            </button>
            <OauthPopup
              url={clickupUrl}
              onCode={onCode}
              onClose={() => {}}
              title={`Import Task from Clickup`}
              height={600}
              width={700}
            >
              <button className='btn-primary flex justify-center gap-2 items-center text-[#17191A] bg-[#3667EA]/80'>
                {tr('import_from')} <ClickupLogo />
              </button>
            </OauthPopup>
          </div>
        </div>
      )}
      <div className='mb-3'>
        <TaskFilterTabs
          currentTab={currentTab}
          onChange={(val: number) => {
            setCurrentTab(val)
            setTasks([])
          }}
          tabCount={tasks?.length}
        />
      </div>
      <ul>
        {tasks?.map((t) => (
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
