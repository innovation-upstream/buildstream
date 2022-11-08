import Spinner from 'components/Spinner/Spinner'
import ApprovalRequest from 'components/Task/ApprovalRequest'
import AssignmentRequest from 'components/Task/AssignmentRequest'
import { ethers } from 'ethers'
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
import { ComplexityScoreMap, TaskStatusMap } from 'hooks/task/types'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { wrapper } from 'state/store'
import { Converter } from 'utils/converter'
import { getTaskDiff } from 'utils/taskDiff'
import { TaskDurationCalc } from 'utils/task_duration'
import {
  GetTaskDocument,
  GetTaskSnapshotsDocument,
  Task,
  TaskSnapshot
} from 'graphclient'

interface PageProps {
  task: Task
  snapshots: TaskSnapshot[]
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

    return {
      props: {
        task: data.task,
        snapshots: snapshots.taskSnapshots
      }
    }
  })

const TaskPage: NextPage<PageProps> = ({ task, snapshots }) => {
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
    <div className='container justify-between mx-auto flex flex-wrap p-5 flex-col md:flex-row'>
      <Head>
        <title>Buildstream: Task</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='w-full h-full top-20 sticky px-5 py-10 bg-white md:basis-4/12 rounded-sm shadow'>
        <h1 className='sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900'>
          {currentTask?.title}
        </h1>
        <p className='lg:w-2/3 leading-relaxed text-base text-gray-500'>
          {currentTask?.description}
        </p>
        <p className='text-lg mt-10 break-all'>
          Organization:{' '}
          <span className='text-sm text-gray-500'>{currentTask?.orgId}</span>
        </p>
        <p className='text-lg mt-3 break-all'>
          Status:{' '}
          <span className='text-sm text-gray-500'>
            {Object.entries(TaskStatusMap)[currentTask?.status]?.[1]}
          </span>
        </p>
        <p className='text-lg mt-3 break-all'>
          Assignee Address:{' '}
          <span className='text-sm text-gray-500'>
            {currentTask?.assigneeAddress.toString()}
          </span>
        </p>
        <p className='text-lg mt-3 break-all'>
          Task Tags:{' '}
          <span className='text-sm text-gray-500'>
            {currentTask?.taskTags.toString()}
          </span>
        </p>
        <p className='text-lg mt-3 break-all'>
          Complexity Score:{' '}
          <span className='text-sm text-gray-500'>
            {
              Object.entries(ComplexityScoreMap)[
                currentTask?.complexityScore
              ]?.[1]
            }
          </span>
        </p>
        <p className='text-lg mt-3 break-all'>
          Reputation Level:{' '}
          <span className='text-sm text-gray-500'>
            {currentTask?.reputationLevel}
          </span>
        </p>
        <p className='text-lg mt-3 break-all'>
          Required approvals:{' '}
          <span className='text-sm text-gray-500'>
            {currentTask?.requiredApprovals}
          </span>
        </p>
        <p className='text-lg mt-3 break-all'>
          Reward amount:{' '}
          <span className='text-sm text-gray-500'>
            {currentTask?.rewardAmount
              ? ethers.utils
                  .formatEther(currentTask?.rewardAmount.toString())
                  .toString()
              : ''}
          </span>
        </p>
        <p className='text-lg mt-3 break-all'>
          Reward token:{' '}
          <span className='text-sm text-gray-500'>
            {currentTask?.rewardToken === ethers.constants.AddressZero
              ? null
              : currentTask?.rewardToken}
          </span>
        </p>
        <p className='text-lg mt-3 break-all'>
          Task Duration:{' '}
          <span className='text-sm text-gray-500'>
            {TaskDurationCalc.getTaskDuration(currentTask?.taskDuration)}
          </span>
        </p>
        <div className='w-full flex justify-between align-center mt-4'>
          <Link href={`/task/edit/${currentTask?.id}`}>
            <a className='text-blue-500 underline'>Edit Task</a>
          </Link>
          {taskStatus == 'open' && (
            <button
              onClick={archiveCurrentTask}
              className='bg-blue-500 text-white px-4 rounded-lg'
            >
              {processAchive ? <Spinner /> : 'Archive Task'}
            </button>
          )}
        </div>
      </div>
      <div className='w-full h-full md:basis-6/12'>
        <div className='w-full h-full mt-10 bg-gray-100 rounded-lg p-8'>
          <h2 className='text-gray-900 text-lg font-medium title-font mb-5'>
            Task Status
          </h2>
          <div className='mb-3'>
            <p className='text-base text-red-500'>{errorMsg}</p>
          </div>

          <ol className='relative border-l border-gray-200 dark:border-gray-200'>
            <li className='mb-10 ml-4'>
              <div
                className={`absolute w-5 h-5 bg-green-200 mt-1 rounded-full -left-2.5 border border-white ${
                  currentTask?.status > 0 ? 'bg-green-500' : 'bg-gray-900'
                }`}
              ></div>
              <h3
                className={`text-lg font-semibold ${
                  currentTask?.status > 0 ? 'text-green-500' : 'text-gray-900'
                } `}
              >
                Open
              </h3>
              {taskStatus === 'proposed' && (
                <div>
                  <p className='mb-4 text-base font-normal text-gray-500 dark:text-gray-400'>
                    Open task for assignment
                  </p>
                  <input
                    type='text'
                    id='rewardToken'
                    name='rewardToken'
                    value={rewardToken}
                    onChange={(e) => setRewardToken(e.target.value)}
                    data-type='addressArray'
                    placeholder='Reward Token'
                    className='w-full rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
                  />
                  <button
                    onClick={openCreatedTask}
                    type='submit'
                    disabled={
                      !account ||
                      processing ||
                      !currentTask.organization.approvers.includes(account)
                    }
                    className='flex text-white bg-indigo-500 border-0 my-2 py-1 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg disabled:cursor-not-allowed disabled:opacity-30'
                  >
                    {processing ? <Spinner /> : 'Open Task'}
                  </button>
                </div>
              )}
            </li>
            <li className='mb-10 ml-4'>
              <div
                className={`absolute w-5 h-5 mt-1 rounded-full -left-2.5 border border-white ${
                  currentTask?.status > 1 ? 'bg-green-500' : 'bg-gray-500'
                }`}
              ></div>
              <h3
                className={`text-lg font-semibold ${
                  currentTask?.status > 1 ? 'text-green-500' : 'text-gray-900'
                }`}
              >
                Assign
              </h3>
              {taskStatus === 'open' && (
                <div>
                  <div className='mb-4 text-base font-normal text-gray-500 dark:text-gray-400'>
                    Assign Task
                    <div className='mb-4 text-sm font-normal text-gray-500 dark:text-gray-400'>
                      {currentTask?.reputationLevel >
                        balance[
                          currentTask.complexityScore
                        ].balance.toNumber() &&
                        'You have low reputation level for this task'}
                    </div>
                  </div>
                  <button
                    onClick={assignTaskToSelf}
                    type='submit'
                    disabled={
                      !account ||
                      processing ||
                      currentTask.assignmentRequests.includes(account)
                    }
                    className='flex text-white bg-indigo-500 border-0 my-2 py-1 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg disabled:cursor-not-allowed disabled:opacity-30'
                  >
                    {processing ? (
                      <Spinner />
                    ) : currentTask?.reputationLevel >
                      balance[
                        currentTask.complexityScore
                      ].balance.toNumber() ? (
                      'Request Assignment'
                    ) : (
                      'Assign to self'
                    )}
                  </button>
                </div>
              )}
            </li>
            <li className='mb-10 ml-4'>
              <div
                className={`absolute w-5 h-5 mt-1 rounded-full -left-2.5 border border-white ${
                  currentTask?.status > 2 ? 'bg-green-500' : 'bg-gray-500'
                }`}
              ></div>
              <h3
                className={`text-lg font-semibold ${
                  currentTask?.status > 2 ? 'text-green-500' : 'text-gray-900'
                }`}
              >
                Submit
              </h3>
              {taskStatus === 'assigned' &&
                currentTask?.assigneeAddress === account && (
                  <div>
                    <p className='mb-4 text-base font-normal text-gray-500 dark:text-gray-400'>
                      Ready for submission?
                    </p>
                    <input
                      type='text'
                      id='taskComment'
                      name='taskComment'
                      value={taskComment}
                      onChange={(e) => setTaskComment(e.target.value)}
                      placeholder='Comment'
                      className='w-full rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
                    />
                    <button
                      onClick={submitTask}
                      type='submit'
                      disabled={
                        !account ||
                        processing ||
                        currentTask.assigneeAddress !== account
                      }
                      className='flex text-white bg-indigo-500 border-0 my-2 py-1 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg disabled:cursor-not-allowed disabled:opacity-30'
                    >
                      {processing ? <Spinner /> : 'Submit'}
                    </button>
                  </div>
                )}
            </li>
            <li className='ml-4'>
              <div
                className={`absolute w-5 h-5 mt-1 rounded-full -left-2.5 border border-white ${
                  currentTask?.status === 4 ? 'bg-green-500' : 'bg-gray-500'
                }`}
              ></div>
              <h3
                className={`text-lg font-semibold ${
                  currentTask?.status === 4 ? 'text-green-500' : 'text-gray-900'
                }`}
              >
                Closed
              </h3>
            </li>
          </ol>
        </div>
        {currentTask.status === 1 && (
          <AssignmentRequest
            taskId={currentTask?.id}
            assignmentRequests={currentTask.assignmentRequests}
            approvers={currentTask.organization.approvers}
          />
        )}
        {currentTask.status === 3 && (
          <ApprovalRequest
            taskId={currentTask?.id}
            orgId={currentTask?.orgId}
            approvals={currentTask.approvedBy}
            approvers={currentTask.organization.approvers}
          />
        )}
      </div>
    </div>
  )
}

export default TaskPage
