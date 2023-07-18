import { Task as TaskType } from 'graphclient'
import { useGetTasksQuery, usePolling, useWeb3 } from 'hooks'
import { Task, TaskStatus } from 'hooks/task/types'
import { fetchClickupTask } from 'integrations/clickup/api/functions'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Converter } from 'utils/converter'

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

const UserTasks = () => {
  const { account } = useWeb3()
  const [tasksInProgress, setTasksInProgress] = useState<Task[]>([])
  const [tasksInReview, setTasksInReview] = useState<Task[]>([])
  const [tasksRequested, setTasksRequested] = useState<Task[]>([])
  const [tasksDisputed, setTasksDisputed] = useState<Task[]>([])

  const {
    data: tasksInProgressData,
    loading: tasksInProgressLoading,
    startPolling: startTasksInProgressPolling,
    stopPolling: stopTasksInProgressPolling
  } = useGetTasksQuery({
    variables: {
      where: {
        assignee: account,
        status: TaskStatus.ASSIGNED
      }
    },
    skip: !account
  })
  const {
    data: tasksInReviewData,
    loading: tasksInReviewLoading,
    startPolling: startTasksInReviewPolling,
    stopPolling: stopTasksInReviewPolling
  } = useGetTasksQuery({
    variables: {
      where: {
        assignee: account,
        status: TaskStatus.SUBMITTED
      }
    },
    skip: !account
  })
  const {
    data: tasksRequestedData,
    loading: tasksRequestedLoading,
    startPolling: startTasksRequestedPolling,
    stopPolling: stopTasksRequestedPolling
  } = useGetTasksQuery({
    variables: {
      where: {
        assignmentRequest_contains: [account as string],
        status_lte: TaskStatus.OPEN
      }
    },
    skip: !account
  })
  const {
    data: tasksDisputedData,
    loading: tasksDisputedLoading,
    startPolling: startTasksDisputedPolling,
    stopPolling: stopTasksDisputedPolling
  } = useGetTasksQuery({
    variables: {
      where: {
        assignee: account,
        status: TaskStatus.DISPUTED
      }
    },
    skip: !account
  })

  usePolling(startTasksInProgressPolling, stopTasksInProgressPolling)
  usePolling(startTasksInReviewPolling, stopTasksInReviewPolling)
  usePolling(startTasksRequestedPolling, stopTasksRequestedPolling)
  usePolling(startTasksDisputedPolling, stopTasksDisputedPolling)

  const { t } = useTranslation('tasks')

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
    if (!tasksRequestedData?.tasks) return
    processTasks(tasksRequestedData.tasks).then((tasksWithClickupData) =>
      setTasksRequested(tasksWithClickupData)
    )
  }, [tasksRequestedData])

  useEffect(() => {
    if (!tasksDisputedData?.tasks) return
    processTasks(tasksDisputedData.tasks).then((tasksWithClickupData) =>
      setTasksDisputed(tasksWithClickupData)
    )
  }, [tasksDisputedData])

  useEffect(() => {
    if (!tasksInProgressData) return
    
  }, [tasksInProgressData])
  

  if (
    !tasksInProgressLoading &&
    !tasksInReviewLoading &&
    !tasksRequestedLoading &&
    !tasksDisputedLoading &&
    !tasksInProgress?.length &&
    !tasksInReview?.length &&
    !tasksRequested?.length &&
    !tasksDisputed?.length
  )
    return null

  return (
    <div className='paper'>
      <p className='text-2xl font-semibold mb-5'>{t('your_tasks')}</p>
      {!!tasksInProgress?.length && (
        <div className='mt-4'>
          <p className='font-semibold mb-2'>{t('in_progress')}</p>
          <ul className='ml-4 md:ml-6 list-disc list-outside'>
            {tasksInProgress.map((task) => (
              <li key={task.id}>
                <Link href={`/task/${task.id}`}>
                  <a className='text-[#3667EA] underline' target='_blank'>
                    {task.title}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!!tasksInReview?.length && (
        <div className='mt-4'>
          <p className='font-semibold mb-2'>{t('in_review')}</p>
          <ul className='ml-4 md:ml-6 list-disc list-outside'>
            {tasksInReview.map((task) => (
              <li key={task.id}>
                <Link href={`/task/${task.id}`}>
                  <a className='text-[#3667EA] underline' target='_blank'>
                    {task.title}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!!tasksRequested?.length && (
        <div className='mt-4'>
          <p className='font-semibold mb-2'>{t('requests')}</p>
          <ul className='ml-4 md:ml-6 list-disc list-outside'>
            {tasksRequested.map((task) => (
              <li key={task.id}>
                <Link href={`/task/${task.id}`}>
                  <a className='text-[#3667EA] underline' target='_blank'>
                    {task.title}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!!tasksDisputed?.length && (
        <div className='mt-4'>
          <p className='font-semibold mb-2'>{t('disputes')}</p>
          <ul className='ml-4 md:ml-6 list-disc list-outside'>
            {tasksDisputed.map((task) => (
              <li key={task.id}>
                <Link href={`/task/${task.id}`}>
                  <a className='text-[#3667EA] underline' target='_blank'>
                    {task.title}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default UserTasks
