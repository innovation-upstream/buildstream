import ClickupLogo from 'SVGs/ClickupLogo'
import Plus from 'SVGs/Plus'
import CreateTask from 'components/Task/CreateTask/CreateTask'
import ClickupImport from 'components/Task/ImportTask/ClickupImport'
import TaskCard from 'components/Task/TaskCard'
import { getCookie } from 'cookies-next'
import { Task as TaskType } from 'graphclient'
import { useGetTasksQuery, usePolling } from 'hooks'
import { Organization } from 'hooks/organization/types'
import { Task, TaskStatus } from 'hooks/task/types'
import { TOKEN_KEY, fetchClickupTask } from 'integrations/clickup/api'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import OauthPopup from 'react-oauth-popup'
import { Converter } from 'utils/converter'
import ShareTask from '../../Task/ShareTask'
import TaskFilterTabs from './TaskFilterTabs'
import { TaskFilters } from './types'

interface TaskViewProps {
  organization: Organization
  showCreateTask?: boolean
  tasksWithoutRequest: Task[]
  tasksWithRequest: Task[]
  tasksInProgress: Task[]
  tasksInReview: Task[]
  tasksClosed: Task[]
}

interface IEmptyTaskViewProps {
  organization: Organization
  onCode: (code: any, params?: any) => void
  clickupToken?: string
}

const client_id = process.env.NEXT_PUBLIC_CLICKUP_CLIENT_ID
const redirect_uri = process.env.NEXT_PUBLIC_CLICKUP_REDIRECT_URL
const clickupUrl = `https://app.clickup.com/api?client_id=${client_id}&redirect_uri=${redirect_uri}`

const isBrowser = typeof window !== 'undefined'

const EmptyTaskView = ({
  organization,
  onCode,
  clickupToken
}: IEmptyTaskViewProps) => {
  const { t } = useTranslation('organization')
  const [showModal, toggleModal] = useState(false)

  return (
    <div className='mt-6'>
      {showModal && (
        <CreateTask
          organization={organization}
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
          <div className='w-full text-[#17191A] bg-[#3667EA]/10'>
            {!clickupToken ? (
              <OauthPopup
                url={clickupUrl}
                onCode={onCode}
                onClose={() => {}}
                title={`Import Task from Clickup`}
                height={600}
                width={700}
              >
                <button className='w-full btn-primary flex justify-center gap-1 items-center'>
                  {t('import_from')} <ClickupLogo />
                </button>
              </OauthPopup>
            ) : (
              <button
                className='w-full btn-primary flex justify-center gap-1 items-center'
                onClick={() => onCode('')}
              >
                {t('import_from')} <ClickupLogo />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const TaskView = ({
  organization,
  showCreateTask,
  ...props
}: TaskViewProps) => {
  // const [tasks, setTasks] = useState(taskList)
  const [showCreateModal, setShowCreateModal] = useState(showCreateTask)
  const [currentTab, setCurrentTab] = useState(TaskFilters.WITHOUT_REQUEST)
  const [showClickupModal, setShowClickupModal] = useState(false)
  const [clickupCode, setClickupCode] = useState('')
  const [shareLink, setShareLink] = useState<string>()
  const [tasksWithoutRequest, setTasksWithoutRequest] = useState<Task[]>(props.tasksWithoutRequest)
  const [tasksWithRequest, setTasksWithRequest] = useState<Task[]>(props.tasksWithRequest)
  const [tasksInProgress, setTasksInProgress] = useState<Task[]>(props.tasksInProgress)
  const [tasksInReview, setTasksInReview] = useState<Task[]>(props.tasksInReview)
  const [tasksClosed, setTasksClosed] = useState<Task[]>(props.tasksClosed)
  const clickupToken = getCookie(TOKEN_KEY)

  const onCode = async (code: any, params?: any) => {
    setClickupCode(code)
    setShowClickupModal(true)
  }

  const {
    data: tasksWithoutRequestData,
    startPolling: startTasksWithoutRequestPolling,
    stopPolling: stopTasksWithoutRequestPolling
  } = useGetTasksQuery({
    variables: {
      where: {
        orgId: organization.id.toString(),
        status_lte: TaskStatus.OPEN,
        assignmentRequest: null
      }
    }
  })
  const {
    data: tasksWithRequestData,
    startPolling: startTasksWithRequestPolling,
    stopPolling: stopTasksWithRequestPolling
  } = useGetTasksQuery({
    variables: {
      where: {
        orgId: organization.id.toString(),
        status_lte: TaskStatus.OPEN,
        assignmentRequest_not: null
      }
    }
  })
  const {
    data: tasksInProgressData,
    startPolling: startTasksInProgressPolling,
    stopPolling: stopTasksInProgressPolling
  } = useGetTasksQuery({
    variables: {
      where: {
        orgId: organization.id.toString(),
        status: TaskStatus.ASSIGNED
      }
    }
  })
  const {
    data: tasksInReviewData,
    startPolling: startTasksInReviewPolling,
    stopPolling: stopTasksInReviewPolling
  } = useGetTasksQuery({
    variables: {
      where: {
        orgId: organization.id.toString(),
        status: TaskStatus.SUBMITTED
      }
    }
  })
  const {
    data: tasksClosedData,
    startPolling: startTasksClosedPolling,
    stopPolling: stopTasksClosedPolling
  } = useGetTasksQuery({
    variables: {
      where: {
        orgId: organization.id.toString(),
        status: TaskStatus.CLOSED
      }
    }
  })

  usePolling(startTasksWithoutRequestPolling, stopTasksWithoutRequestPolling)
  usePolling(startTasksWithRequestPolling, stopTasksWithRequestPolling)
  usePolling(startTasksInProgressPolling, stopTasksInProgressPolling)
  usePolling(startTasksInReviewPolling, stopTasksInReviewPolling)
  usePolling(startTasksClosedPolling, stopTasksClosedPolling)

  const { t: tr } = useTranslation('organization')
  const [selected, setSelected] = useState<number>()

  const processTasks = async (tasks: TaskType[]): Promise<Task[]> => {
    const processedTasks = await Promise.all(
      tasks.map(async (t) => {
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

    return processedTasks.map((t) => Converter.TaskFromQuery(t))
  }

  useEffect(() => {
    if (!tasksWithRequestData?.tasks) return
    processTasks(tasksWithRequestData.tasks).then((tasksWithClickupData) =>
      setTasksWithRequest(tasksWithClickupData)
    )
  }, [tasksWithRequestData])

  useEffect(() => {
    if (!tasksWithoutRequestData?.tasks) return
    processTasks(tasksWithoutRequestData.tasks).then((tasksWithClickupData) =>
      setTasksWithoutRequest(tasksWithClickupData)
    )
  }, [tasksWithoutRequestData])

  useEffect(() => {
    if (!tasksInProgressData?.tasks) return
    processTasks(tasksInProgressData.tasks).then((tasksWithClickupData) =>
      setTasksInProgress(tasksWithClickupData)
    )
  }, [tasksInProgressData])

  useEffect(() => {
    if (!tasksInReviewData?.tasks) return
    processTasks(tasksInReviewData.tasks).then((tasksWithClickupData) =>
      setTasksInReview(tasksWithClickupData)
    )
  }, [tasksInReviewData])

  useEffect(() => {
    if (!tasksClosedData?.tasks) return
    processTasks(tasksClosedData.tasks).then((tasksWithClickupData) =>
      setTasksClosed(tasksWithClickupData)
    )
  }, [tasksClosedData])

  const onCreated = (taskId: number) => {
    setShowCreateModal(false)
    setShowClickupModal(false)
    onShare(taskId)
  }

  const onShare = (taskId: number) => {
    setShareLink(`${isBrowser ? window.location.origin : ''}/task/${taskId}`)
  }

  const taskMap = {
    [TaskFilters.WITHOUT_REQUEST]: tasksWithoutRequest,
    [TaskFilters.WITH_REQUEST]: tasksWithRequest,
    [TaskFilters.IN_PROGRESS]: tasksInProgress,
    [TaskFilters.IN_REVIEW]: tasksInReview,
    [TaskFilters.CLOSED]: tasksClosed
  }

  const showEmptyView =
    !tasksWithoutRequest?.length &&
    !tasksWithRequest.length &&
    !tasksInProgress.length &&
    !tasksInReview.length &&
    !tasksClosed.length

  return (
    <div className='mt-6'>
      {showCreateModal && (
        <CreateTask
          organization={organization}
          close={() => setShowCreateModal(false)}
          onCreated={onCreated}
        />
      )}
      {showClickupModal && (
        <ClickupImport
          organization={organization}
          clickupCode={clickupCode}
          close={() => setShowClickupModal(false)}
          onCreated={onCreated}
        />
      )}
      {shareLink && (
        <ShareTask url={shareLink} onClose={() => setShareLink(undefined)} />
      )}

      {showEmptyView ? (
        <EmptyTaskView organization={organization} onCode={onCode} />
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
            {!clickupToken ? (
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
            ) : (
              <button
                className='btn-primary flex justify-center gap-2 items-center text-[#17191A] bg-[#3667EA]/80'
                onClick={() => setShowClickupModal(true)}
              >
                {tr('import_from')} <ClickupLogo />
              </button>
            )}
          </div>
        </div>
      )}
      <div className='mb-3'>
        <TaskFilterTabs
          currentTab={currentTab}
          onChange={(val: number) => {
            setCurrentTab(val)
          }}
          taskCounts={{
            [TaskFilters.WITHOUT_REQUEST]: tasksWithoutRequest?.length || 0,
            [TaskFilters.WITH_REQUEST]: tasksWithRequest?.length || 0,
            [TaskFilters.IN_PROGRESS]: tasksInProgress?.length || 0,
            [TaskFilters.IN_REVIEW]: tasksInReview?.length || 0,
            [TaskFilters.CLOSED]: tasksClosed?.length || 0
          }}
        />
      </div>
      <ul>
        {taskMap[currentTab]?.map((t) => (
          <li key={t.id} className='mb-4'>
            <TaskCard
              task={t}
              onClick={(id) => setSelected(id)}
              onShare={onShare}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TaskView
