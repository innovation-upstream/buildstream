import Back from 'SVGs/Back'
import Alert from 'components/Alert/Alert'
import MarkDownEditor from 'components/MarkDownEditor/MarkDownEditor'
import ShareTask from 'components/Task/ShareTask'
import TaskActions from 'components/Task/TaskActions/TaskActions'
import AssigneeCard from 'components/Task/TaskPage/AssigneeCard'
import AssignmentRequestCard from 'components/Task/TaskPage/AssignmentRequestCard'
import ClosedCard from 'components/Task/TaskPage/ClosedCard'
import SolutionHistory from 'components/Task/TaskPage/SolutionHistory'
import SolutionTime from 'components/Task/TaskPage/SolutionTime'
import SubmitCard from 'components/Task/TaskPage/SubmitCard'
import TaskInfoCard from 'components/Task/TaskPage/TaskInfoCard'
import TaskStatusCard from 'components/Task/TaskPage/TaskStatusCard'
import { BigNumber } from 'ethers'
import {
  GetTaskDocument,
  GetTasksDocument,
  GetUserStatDocument,
  Task
} from 'graphclient'
import client from 'graphclient/client'
import { useGetTaskQuery, usePolling, useWeb3 } from 'hooks'
import { getUser } from 'hooks/profile/functions'
import { getTaskDenials, getTaskInstructions } from 'hooks/task/functions'
import { TaskStatus } from 'hooks/task/types'
import { fetchClickupTask } from 'integrations/clickup/api'
import { User } from 'models/User/User'
import type { GetServerSideProps, NextPage } from 'next'
import { Trans, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { wrapper } from 'state/store'
import { Converter } from 'utils/converter'

type AssigneeData = {
  tokens: {
    id: string
    token: number
    count: number
  }[]
  address: string
  profile: User
  tasks: {
    id: number
    title: string
    rewardAmount: string
    rewardToken: string
  }[]
}

interface PageProps {
  task: Task
  instructions?: string
  assignmentRequests?: AssigneeData[]
  assigneeData?: AssigneeData
  taskDenials: {
    assignee: string
    message: string
  }[]
}

const isBrowser = typeof window !== 'undefined'

const getAssigneeData = async (
  assignee: string,
  tags: bigint[][]
): Promise<AssigneeData> => {
  const { data: statData } = await client.query({
    query: GetUserStatDocument,
    variables: {
      id: assignee.toLowerCase()
    }
  })
  const profile = await getUser(assignee)
  const allTags = tags.flat().filter((t) => t)
  // Tagless query
  tags.push([])
  const allTasks = await Promise.all(
    tags.map(async (tag) => {
      const { data } = await client.query({
        query: GetTasksDocument,
        variables: {
          first: 5,
          orderBy: 'submitDate',
          orderDirection: 'desc',
          where: {
            assignee: assignee.toLowerCase(),
            status: TaskStatus.CLOSED,
            taskTags_contains: tag
          }
        }
      })

      return data.tasks
    })
  )

  // Remove duplicates
  const filteredTasks = allTasks
    .flat()
    .filter(
      (tag, index, array) => array.findIndex((t) => t.id == tag.id) == index
    )
  const assigneeInfo = {
    address: assignee,
    profile: profile.user,
    tokens:
      statData.userStat?.tokens?.map((t) => ({
        id: t.id,
        token: Number(t.token),
        count: Number(t.count)
      })) || [],
    tasks: filteredTasks
      .map((t) => ({
        id: t.id,
        title: t.title,
        rewardAmount: t.rewardAmount,
        rewardToken: t.rewardToken,
        taskTags: t.taskTags
      }))
      .flat()
      .sort((a, b) => {
        const aCount = allTags.filter((t) => a.taskTags.includes(t)).length
        const bCount = allTags.filter((t) => b.taskTags.includes(t)).length

        return bCount - aCount
      })
      .slice(0, 5)
  } as any as AssigneeData

  return assigneeInfo
}

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps(() => async (context) => {
    const taskId =
      typeof context.params?.id === 'string'
        ? context.params?.id
        : context.params?.id?.[0] || '0'
    const { data } = await client.query({
      query: GetTaskDocument,
      variables: {
        id: taskId
      }
    })

    if (!data.task) {
      return {
        notFound: true
      }
    }

    let assignmentRequests = null
    const tags = (data.task?.taskTags || [])?.map((tag) => [tag])

    const deniedAssignees = await getTaskDenials(Number(data.task.id))

    if (data.task.status === TaskStatus.OPEN) {
      assignmentRequests = await Promise.all(
        (data.task.assignmentRequest || [])
          ?.filter(
            (assignee) => !deniedAssignees.some((a) => a.assignee === assignee)
          )
          ?.map(async (assignee) => {
            const data = await getAssigneeData(assignee, tags)
            return data
          })
      )
    }

    let assigneeData = null
    if (data.task.status >= TaskStatus.ASSIGNED && data.task.assignee) {
      assigneeData = await getAssigneeData(data.task.assignee, tags)
    }

    let clickupTask
    if (data.task.externalId) {
      clickupTask = await fetchClickupTask(
        data.task.externalId,
        data.task.orgId.id
      )
    }

    const instructions = await getTaskInstructions(Number(taskId))

    return {
      props: {
        task: {
          ...data.task,
          title: clickupTask?.name || data.task.title,
          description: clickupTask?.description || data.task.description
        },
        instructions: instructions || null,
        assigneeData,
        assignmentRequests:
          data.task.status === TaskStatus.OPEN ? assignmentRequests : null,
        taskDenials: deniedAssignees,
        ...(await serverSideTranslations(context.locale ?? '', [
          'common',
          'organization',
          'header',
          'tasks'
        ]))
      }
    }
  })

const TaskPage: NextPage<PageProps> = ({
  task,
  assigneeData,
  instructions,
  taskDenials,
  ...props
}) => {
  const { account } = useWeb3()
  const [currentTask, setCurrentTask] = useState(Converter.TaskFromQuery(task))
  const router = useRouter()
  const [shareLink, setShareLink] = useState<string>()
  const [assignmentRequests, setAssignmentRequests] = useState(
    props.assignmentRequests
  )

  const { t } = useTranslation('tasks')

  const { data, startPolling, stopPolling } = useGetTaskQuery({
    variables: {
      id: task.id
    }
  })

  usePolling(startPolling, stopPolling)

  const setupTask = async (task: any) => {
    const retrievedTask = Converter.TaskFromQuery(task)
    if (!data?.task?.externalId) {
      setCurrentTask(retrievedTask)
      return
    }
    try {
      const clickupTask = await fetchClickupTask(
        data.task.externalId,
        data.task.orgId.id
      )

      if (clickupTask) {
        setCurrentTask({
          ...retrievedTask,
          title: clickupTask?.name || retrievedTask.title,
          description: clickupTask?.description || retrievedTask.description
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  const fetchAssigneeData = async (addresses: string[]) => {
    const tags = (currentTask?.taskTags || [])?.map((tag) => [tag.id])

    const deniedAssignees = await getTaskDenials(Number(currentTask.id))

    const requests = await Promise.all(
      (addresses || [])
        ?.filter(
          (assignee) => !deniedAssignees.some((a) => a.assignee === assignee)
        )
        ?.map(async (assignee) => {
          const data = await getAssigneeData(assignee, tags as any)
          return data
        })
    )
    setAssignmentRequests(requests)
  }

  useEffect(() => {
    if (!data?.task) return
    setupTask(data.task)

    if (
      data.task.assignmentRequest?.length &&
      data.task.assignmentRequest?.length !== assignmentRequests?.length
    ) {
      fetchAssigneeData(data.task.assignmentRequest)
    }
  }, [data])

  if (!currentTask) {
    return null
  }

  const isAssignee = account && currentTask.assigneeAddress === account
  const isApprover =
    !!account && currentTask?.organization.approvers.includes(account)
  const taskDenial = taskDenials.find((a) => a.assignee === account)

  const getAssignee = (assignee: AssigneeData) => ({
    ...assignee,
    tasks: assignee.tasks.map((t) => ({
      ...t,
      rewardAmount: BigNumber.from(t.rewardAmount)
    }))
  })

  const onShare = () => {
    setShareLink(`${isBrowser ? window.location.origin : ''}/task/${task.id}`)
  }

  return (
    <div className='layout-container pb-20'>
      <Head>
        <title>Buildstream: Task</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='grid-layout py-10 md:py-24'>
        <div className='w-fit col-span-4 md:col-span-8 lg:col-span-12 2xl:col-span-2'>
          <button
            onClick={router.back}
            className='flex items-center text-lg justify-center gap-x-3 lg:w-full btn-outline border-[#EFF0F1] hover:border-gray-500 bg-white focus:border-gray-500'
          >
            <Back />
            {t('back_to_all_tasks')}
          </button>
        </div>
        <div className='col-span-4 md:col-span-5 lg:col-span-8 2xl:col-span-7'>
          <>
            {shareLink && (
              <ShareTask
                url={shareLink}
                onClose={() => setShareLink(undefined)}
              />
            )}
            <TaskInfoCard task={currentTask} onShare={onShare} />
            {instructions && (isAssignee || isApprover) && (
              <section className=''>
                <div className='w-full p-3 bg-gray-100 border mt-3 rounded-xl'>
                  <p className='block text-gray-500 mb-1'>
                    {t('private_task_materials')}
                  </p>
                  <MarkDownEditor
                    hideToggle
                    value={{ text: instructions }}
                    readOnly
                  />
                </div>
              </section>
            )}
            <TaskActions task={currentTask} />
          </>
          <div className='mt-7 md:hidden'>
            <TaskStatusCard task={currentTask} />
          </div>
          {currentTask.status === TaskStatus.OPEN &&
            account &&
            assignmentRequests?.some((a) => a.address === account) && (
              <div className='mt-4'>
                <Alert>
                  <p className='font-bold mb-2 text-lg'>
                    {t('assignment_request_alert_title')}
                  </p>
                  <p>{t('assignment_request_alert_body')}</p>
                </Alert>
              </div>
            )}
          {isApprover &&
            currentTask.status === TaskStatus.OPEN &&
            !assignmentRequests?.length && (
              <div className='mt-4'>
                <Alert>
                  <p className='font-bold mb-2 text-lg'>
                    {t('no_requests_title')}
                  </p>
                  <p>
                    <Trans
                      t={t}
                      i18nKey='no_requests_body'
                      components={[
                        <button
                          className='text-blue-500 underline'
                          key={0}
                          onClick={onShare}
                        >
                          Share this task
                        </button>
                      ]}
                    />
                  </p>
                </Alert>
              </div>
            )}
          {isApprover &&
            currentTask.status === TaskStatus.OPEN &&
            !!assignmentRequests?.length && (
              <div className='mt-7'>
                <p className='font-semibold text-[32px] mb-6'>
                  {t('requests')}
                </p>
                <ul>
                  {assignmentRequests?.map((assignee) => {
                    const account = assignee?.address
                    return (
                      <li key={account} className='mb-4'>
                        <AssignmentRequestCard
                          taskId={currentTask.id}
                          isApprover={isApprover}
                          assignee={getAssignee(assignee)}
                          onDeny={() =>
                            fetchAssigneeData(currentTask.assignmentRequests || [])
                          }
                        />
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          {taskDenial && (
            <div className='mt-4'>
              <Alert>
                <p className='font-bold mb-2 text-lg'>{t('you_are_denied')}</p>
                <p>{taskDenial.message}</p>
              </Alert>
            </div>
          )}

          {assigneeData && (
            <div className='mt-7'>
              <AssigneeCard
                assignee={getAssignee(assigneeData)}
              />
            </div>
          )}

          <SolutionHistory
            task={currentTask}
            isApprover={
              !!account && currentTask?.organization.approvers.includes(account)
            }
          />

          {(isApprover || isAssignee) &&
            currentTask.status === TaskStatus.ASSIGNED && (
              <SolutionTime task={currentTask} />
            )}

          {isAssignee && currentTask.status === TaskStatus.ASSIGNED && (
            <SubmitCard taskId={currentTask.id} />
          )}

          {currentTask.status === TaskStatus.CLOSED && <ClosedCard />}
        </div>
        <div className='col-span-4 md:col-span-3 lg:col-span-4 2xl:col-span-3 hidden md:block'>
          <TaskStatusCard task={currentTask} />
        </div>
      </div>
    </div>
  )
}

export default TaskPage
