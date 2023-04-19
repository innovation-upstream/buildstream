import AssigneeCard from 'components/Task/TaskPage/AssigneeCard'
import TaskCard from 'components/Task/TaskCard'
import TaskStatusCard from 'components/Task/TaskPage/TaskStatusCard'
import { BigNumber } from 'ethers'
import client from 'graphclient/client'
import { useGetTaskQuery, usePolling, useWeb3 } from 'hooks'
import { TaskStatus } from 'hooks/task/types'
import type { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { wrapper } from 'state/store'
import Back from 'SVGs/Back'
import { Converter } from 'utils/converter'
import {
  GetTaskDocument,
  GetTasksDocument,
  GetTaskSnapshotsDocument,
  Task,
  TaskSnapshot
} from 'graphclient'
import { useTranslation } from 'next-i18next'
import SolutionHistory from 'components/Task/TaskPage/SolutionHistory'
import ClosedCard from 'components/Task/TaskPage/ClosedCard'
import SubmitCard from 'components/Task/TaskPage/SubmitCard'
import SolutionTime from 'components/Task/TaskPage/SolutionTime'
import { useRouter } from 'next/router'
import { fetchClickupTask } from 'integrations/clickup/api'
import TaskActions from 'components/Task/TaskActions/TaskActions'
import ShareTask from 'components/Task/ShareTask'

type AssigneeData = {
  tags: string[]
  address: string
  coverLetter?: string
  tasks: {
    id: number
    title: string
    rewardAmount: string
    rewardToken: string
  }[]
}

interface PageProps {
  task: Task
  snapshots: TaskSnapshot[]
  assignmentRequests?: AssigneeData[]
  assigneeData?: AssigneeData
}

const defaultCoverLetter = `
Looking for an experienced web designer and WordPress developer
for the creation of the web presence of a new start-up from scratch.
The website  needs to be integrated into an overall.
`

const isBrowser = typeof window !== 'undefined'

const getAssigneeData = async (assignee: string, tags: bigint[][]) => {
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
            taskTags_contains_nocase: tag
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
    coverLetter: defaultCoverLetter,
    tags: Array.from(new Set(filteredTasks.map((t) => t.taskTags).flat())),
    tasks: filteredTasks
      .map((t) => ({
        id: t.id,
        title: t.title,
        rewardAmount: t.rewardAmount,
        rewardToken: t.rewardToken
      }))
      .flat()
      .slice(0, 5)
  }

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

    const { data: snapshots } = await client.query({
      query: GetTaskSnapshotsDocument,
      variables: {
        orderBy: 'timestamp',
        orderDirection: 'desc',
        where: {
          taskId: taskId as any
        }
      }
    })

    let assignmentRequests = null
    const tags = (data.task?.taskTags || [])?.map((tag) => [tag])

    if (data.task.status >= TaskStatus.OPEN) {
      assignmentRequests = await Promise.all(
        (data.task.assignmentRequest || [])?.map(async (assignee) => {
          const data = await getAssigneeData(assignee, tags)
          return data
        })
      )
    }

    let assigneeData = null
    if (data.task.status >= TaskStatus.ASSIGNED) {
      assigneeData = await getAssigneeData(data.task?.assignee as string, tags)
    }

    let clickupTask
    if (data.task.externalId) {
      clickupTask = await fetchClickupTask(
        data.task.externalId,
        data.task.orgId.id
      )
    }

    return {
      props: {
        task: {
          ...data.task,
          title: clickupTask?.name || data.task.title,
          description: clickupTask?.description || data.task.description
        },
        snapshots: snapshots.taskSnapshots,
        assignmentRequests:
          data.task.status === TaskStatus.OPEN ? assignmentRequests : null,
        assigneeData,
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
  snapshots,
  assigneeData,
  assignmentRequests
}) => {
  const { account } = useWeb3()
  const [currentTask, setCurrentTask] = useState(Converter.TaskFromQuery(task))
  const router = useRouter()
  const [shareLink, setShareLink] = useState<string>()

  const { t } = useTranslation('tasks')

  const { data, startPolling, stopPolling } = useGetTaskQuery({
    variables: {
      id: task.id
    }
  })

  usePolling(startPolling, stopPolling)

  useEffect(() => {
    if (!data?.task) return
    const retrievedTask = Converter.TaskFromQuery(data.task as any)

    if (!data?.task?.externalId) {
      setCurrentTask(retrievedTask)
      return
    }

    fetchClickupTask(data.task.externalId, data.task.orgId.id)
      .then((clickupTask) => {
        if (clickupTask) {
          setCurrentTask({
            ...retrievedTask,
            title: clickupTask?.name || retrievedTask.title,
            description: clickupTask?.description || retrievedTask.description
          })
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }, [data])

  if (!currentTask) {
    return null
  }

  const isAssignee = account && currentTask.assigneeAddress === account
  const isApprover =
    !!account && currentTask?.organization.approvers.includes(account)

  const getAssignee = (assignee: AssigneeData) => ({
    ...assignee,
    tasks: assignee.tasks.map((t) => ({
      ...t,
      rewardAmount: BigNumber.from(t.rewardAmount)
    }))
  })

  const onShare = (taskId: number) => {
    setShareLink(`${isBrowser ? window.location.origin : ''}/task/${taskId}`)
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
            <TaskCard
              task={currentTask}
              showDescription
              hideViewButton
              taskRequirementLocation='footer'
              onShare={onShare}
            />
            {(task?.assignmentRequest?.length === undefined ||
              task?.assignmentRequest?.length === 0) && (
              <TaskActions task={task} />
            )}
          </>
          <div className='mt-7 md:hidden'>
            <TaskStatusCard
              taskId={currentTask.id}
              taskSnapshots={snapshots?.map((t) =>
                Converter.TaskSnapshotFromQuery(t as any)
              )}
              organization={currentTask.organization}
            />
          </div>
          {currentTask.status === TaskStatus.OPEN &&
            !!currentTask.assignmentRequests.length && (
              <div className='mt-7'>
                <p className='font-semibold text-[32px] mb-6'>
                  {t('requests')}
                </p>
                <ul>
                  {assignmentRequests?.map((assignee) => {
                    const account = assignee?.address
                    return (
                      <li key={account} className='mb-4'>
                        <AssigneeCard
                          taskId={Number(task.id)}
                          isApprover={isApprover}
                          assignee={getAssignee(assignee)}
                        />
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          {currentTask.status > TaskStatus.OPEN &&
            !isAssignee &&
            !!assigneeData && (
              <div className='mt-7'>
                <p className='font-semibold text-[32px] mb-6'>
                  {t('responsible_contributor')}
                </p>
                <AssigneeCard
                  taskId={Number(task.id)}
                  isAssigned
                  isApprover={isApprover}
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
          {currentTask.status == TaskStatus.ASSIGNED && (
            <>
              <SolutionTime />
              {isAssignee && <SubmitCard taskId={currentTask.id} />}
            </>
          )}
          {currentTask.status === TaskStatus.CLOSED && <ClosedCard />}
        </div>
        <div className='col-span-4 md:col-span-3 lg:col-span-4 2xl:col-span-3 hidden md:block'>
          <TaskStatusCard
            taskId={currentTask.id}
            taskSnapshots={snapshots?.map((t) =>
              Converter.TaskSnapshotFromQuery(t as any)
            )}
            organization={currentTask.organization}
          />
        </div>
      </div>
    </div>
  )
}

export default TaskPage
