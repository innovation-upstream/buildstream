import Spinner from 'components/Spinner/Spinner'
import ApprovalRequest from 'components/Task/ApprovalRequest'
import AssigneeCard from 'components/Task/TaskPage/AssigneeCard'
import TaskCard from 'components/Task/TaskCard'
import TaskStatusCard from 'components/Task/TaskPage/TaskStatusCard'
import { BigNumber, ethers } from 'ethers'
import client from 'graphclient/client'
import {
  useGetTaskQuery,
  useGetTaskSnapshotsQuery,
  usePolling,
  useWeb3
} from 'hooks'
import useBalance from 'hooks/balance/useBalance'
import {
  archiveTask,
  assignToSelf,
  openTask,
  taskSubmission
} from 'hooks/task/functions'
import { ComplexityScoreMap, TaskStatus, TaskStatusMap } from 'hooks/task/types'
import type { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { wrapper } from 'state/store'
import Back from 'SVGs/Back'
import { Converter } from 'utils/converter'
import { getTaskDiff } from 'utils/taskDiff'
import { TaskDurationCalc } from 'utils/task_duration'
import {
  GetTaskDocument,
  GetTasksDocument,
  GetTaskSnapshotsDocument,
  Task,
  TaskSnapshot
} from '../../../.graphclient'
import { useTranslation } from 'next-i18next'
import ClockSmall from 'SVGs/ClockSmall'
import Closed from 'SVGs/Closed'

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

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => async (context) => {
    const taskId = context.params?.id?.[0] || '0'
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
    const assigneeList =
      data.task.status >= TaskStatus.OPEN
        ? data.task.assignmentRequest || []
        : !!data.task.assignee
        ? [data.task.assignee]
        : []

    const getAssigneeData = async (assignee: string) => {
      const tags = (data.task?.taskTags || [])?.map((tag) => [tag])
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
        coverLetter:
          'Looking for an experienced web designer and WordPress developer for the creation of the web presence of a new start-up from scratch. The website  needs to be integrated into an overall.',
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

    if (data.task.status >= TaskStatus.OPEN) {
      assignmentRequests = await Promise.all(
        (data.task.assignmentRequest || [])?.map(async (assignee) => {
          const data = await getAssigneeData(assignee)
          return data
        })
      )
    }

    let assigneeData = null
    if (data.task.status >= TaskStatus.ASSIGNED) {
      assigneeData = await getAssigneeData(data.task?.assignee as string)
    }

    return {
      props: {
        task: data.task,
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
  const { account, library } = useWeb3()
  const [rewardToken, setRewardToken] = useState(ethers.constants.AddressZero)
  const [taskComment, setTaskComment] = useState<string>()
  const [processing, setProcessing] = useState(false)
  const [currentTask, setCurrentTask] = useState(Converter.TaskFromQuery(task))
  const [taskSnapshots, setTaskSnapshots] = useState(
    snapshots?.map((t) => Converter.TaskSnapshotFromQuery(t as any))
  )
  const taskStatus = Object.entries(TaskStatusMap)[currentTask?.status]?.[1]
  const [errorMsg, setErrorMsg] = useState<string>()
  const { balance } = useBalance()
  const [processAchive, setProcessArchive] = useState(false)
  const router = useRouter()
  const { t } = useTranslation('tasks')

  const taskDiff = getTaskDiff(taskSnapshots)

  const { data, startPolling, stopPolling } = useGetTaskQuery({
    variables: {
      id: task.id
    }
  })

  const {
    data: snapShotData,
    startPolling: startSnapshotPolling,
    stopPolling: stopSnapshotPolling
  } = useGetTaskSnapshotsQuery({
    variables: {
      orderBy: 'timestamp',
      orderDirection: 'desc',
      where: {
        taskId: currentTask.id as any
      }
    }
  })

  usePolling(startPolling, stopPolling)
  usePolling(startSnapshotPolling, stopSnapshotPolling)

  useEffect(() => {
    if (data?.task) {
      setCurrentTask(Converter.TaskFromQuery(data.task as any))
    }
  }, [data])

  useEffect(() => {
    if (snapShotData?.taskSnapshots) {
      setTaskSnapshots(
        snapShotData.taskSnapshots?.map((t) =>
          Converter.TaskSnapshotFromQuery(t as any)
        )
      )
    }
  }, [snapShotData])

  const openCreatedTask = async () => {
    if (!account) {
      setErrorMsg('Connect your wallet')
      return
    }
    setProcessing(true)
    try {
      await openTask(currentTask?.id, rewardToken, library.getSigner())
      setProcessing(false)
    } catch (e) {
      setProcessing(false)
      console.error('ERROR===', e)
    }
  }

  const assignTaskToSelf = async () => {
    if (!account) {
      setErrorMsg('Connect your wallet')
      return
    }
    setProcessing(true)
    try {
      setProcessing(true)
      await assignToSelf(currentTask?.id, library.getSigner())
      setProcessing(false)
    } catch (e) {
      setProcessing(false)
      console.error('ERROR===', e)
    }
  }

  const archiveCurrentTask = async () => {
    if (!account) {
      setErrorMsg('Connect your wallet')
      return
    }
    setProcessArchive(true)
    try {
      const tx = await archiveTask(currentTask?.id, library.getSigner())
      setProcessArchive(false)
      if (tx) router.push('/task')
    } catch (e) {
      setProcessArchive(false)
      console.error(e)
    }
  }

  const submitTask = async () => {
    if (!account) {
      setErrorMsg('Connect your wallet')
      return
    }
    if (!taskComment) {
      setErrorMsg('Add Comment to Submit')
      return
    } else {
      setErrorMsg('')
    }
    setProcessing(true)
    try {
      await taskSubmission(currentTask?.id, taskComment, library.getSigner())
      setProcessing(false)
    } catch (e) {
      setProcessing(false)
      console.error('ERROR===', e)
    }
  }

  if (!currentTask) {
    return null
  }

  return (
    <div className='layout-container pb-20'>
      <Head>
        <title>Buildstream: Task</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='grid-layout py-24'>
        <div className='col-span-4 md:col-span-8 lg:col-span-2'>
          <button
            type='button'
            className='flex items-center text-lg justify-center gap-x-3 lg:w-full btn-outline border-[#EFF0F1] hover:border-gray-500 bg-white focus:border-gray-500'
          >
            <Back />
            {t('back_to_all_tasks')}
          </button>
        </div>
        <div className='col-span-4 md:col-span-5 lg:col-span-7'>
          <TaskCard
            task={currentTask}
            showDescription
            hideViewButton
            taskRequirementLocation='footer'
          />
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
                          isApprover={
                            !!account &&
                            currentTask?.organization.approvers.includes(
                              account
                            )
                          }
                          assignee={{
                            ...assignee,
                            tasks: assignee.tasks.map((t) => ({
                              ...t,
                              rewardAmount: BigNumber.from(t.rewardAmount)
                            }))
                          }}
                        />
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          {currentTask.status > TaskStatus.OPEN &&
            task.assignee !== account &&
            !!assigneeData && (
              <div className='mt-7'>
                <p className='font-semibold text-[32px] mb-6'>
                  {t('responsible_contributor')}
                </p>
                <AssigneeCard
                  taskId={Number(task.id)}
                  isAssigned
                  isApprover={
                    !!account &&
                    currentTask?.organization.approvers.includes(account)
                  }
                  assignee={{
                    ...assigneeData,
                    tasks: assigneeData.tasks.map((t) => ({
                      ...t,
                      rewardAmount: BigNumber.from(t.rewardAmount)
                    }))
                  }}
                />
              </div>
            )}
          {currentTask.status == TaskStatus.ASSIGNED && (
            <>
              <div className='paper flex items-center gap-x-4 mt-7'>
                <div className='shrink-0 h-9 md:h-10 w-9 md:w-10 flex items-center justify-center rounded-md bg-[#E1F3EC]'>
                  <ClockSmall className='fill-[#6BC5A1]' />
                </div>
                <p className='text-2xl font-semibold'>
                  {t('solution_will_be_in').replace('{placeholder}', '3d')}
                </p>
              </div>
              <div className='paper mt-7'>
                <p className='text-2xl font-semibold'>{t('in_progress')}</p>
                <div className='flex items-center mt-4 gap-x-6'>
                  <input className='input-base' />
                  <button className='btn-primary whitespace-nowrap'>
                    {t('submit_solution')}
                  </button>
                </div>
              </div>
            </>
          )}
          {currentTask.status === TaskStatus.CLOSED && (
            <div className='paper mt-7'>
              <div className='flex items-center gap-x-4'>
                <div className='shrink-0 h-9 md:h-10 w-9 md:w-10 flex items-center justify-center rounded-md bg-[#FEEBEB]'>
                  <Closed className='fill-[#F35B5B]' />
                </div>
                <p className='text-2xl font-semibold'>{t('task_closed')}</p>
              </div>
              <p className='mt-4'>{t('reward_message')}</p>
            </div>
          )}
        </div>
        <div className='col-span-4 md:col-span-3'>
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
