import { useGetTasksQuery, usePolling, useWeb3 } from 'hooks'
import { TaskStatus } from 'hooks/task/types'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

const UserTasks = () => {
  const { account } = useWeb3()
  const {
    data: tasksInProgress,
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
    data: tasksInReview,
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
    data: tasksRequested,
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

  usePolling(startTasksInProgressPolling, stopTasksInProgressPolling)
  usePolling(startTasksInReviewPolling, stopTasksInReviewPolling)
  usePolling(startTasksRequestedPolling, stopTasksRequestedPolling)

  const { t } = useTranslation('tasks')

  if (
    !tasksInProgressLoading &&
    !tasksInReviewLoading &&
    !tasksRequestedLoading &&
    !tasksInProgress?.tasks?.length &&
    !tasksInReview?.tasks?.length &&
    !tasksRequested?.tasks?.length
  )
    return null

  return (
    <div className='paper'>
      <p className='text-2xl font-semibold mb-5'>{t('your_tasks')}</p>
      {!!tasksInProgress?.tasks?.length && (
        <div className='mt-4'>
          <p className='font-semibold mb-2'>{t('in_progress')}</p>
          <ul className='ml-4 md:ml-6 list-disc list-outside'>
            {tasksInProgress.tasks.map((task) => (
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
      {!!tasksInReview?.tasks?.length && (
        <div className='mt-4'>
          <p className='font-semibold mb-2'>{t('in_review')}</p>
          <ul className='ml-4 md:ml-6 list-disc list-outside'>
            {tasksInReview.tasks.map((task) => (
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
      {!!tasksRequested?.tasks?.length && (
        <div className='mt-4'>
          <p className='font-semibold mb-2'>{t('requests')}</p>
          <ul className='ml-4 md:ml-6 list-disc list-outside'>
            {tasksRequested.tasks.map((task) => (
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
