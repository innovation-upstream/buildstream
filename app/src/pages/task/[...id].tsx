import { ethers } from 'ethers'
import { fetchTask } from 'hooks/task/functions'
import { ComplexityScoreMap, Task, TaskStatusMap } from 'hooks/task/types'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'

interface PageProps {
  task: Task
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const taskId = context.params?.id?.[0] || '0'
  const task = await fetchTask(parseInt(taskId))

  return {
    props: {
      task: task
    }
  }
}

const TaskPage: NextPage<PageProps> = ({ task }) => {
  return (
    <div className='container justify-between mx-auto flex flex-wrap p-5 flex-col md:flex-row'>
      <Head>
        <title>Buildstream: Task</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='w-full h-full top-20 sticky px-5 py-10 bg-white md:basis-4/12 rounded-sm shadow'>
        <h1 className='sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900'>
          {task?.title}
        </h1>
        <p className='lg:w-2/3 leading-relaxed text-base text-gray-500'>
          {task?.description}
        </p>
        <p className='text-lg mt-10 break-all'>
          Organization:{' '}
          <span className='text-sm text-gray-500'>{task?.orgId}</span>
        </p>
        <p className='text-lg mt-3 break-all'>
          Status:{' '}
          <span className='text-sm text-gray-500'>
            {Object.entries(TaskStatusMap)[task?.status]?.[1]}
          </span>
        </p>
        <p className='text-lg mt-3 break-all'>
          Assignee Address:{' '}
          <span className='text-sm text-gray-500'>
            {task?.assigneeAddress.toString()}
          </span>
        </p>
        <p className='text-lg mt-3 break-all'>
          Task Tags:{' '}
          <span className='text-sm text-gray-500'>
            {task?.taskTags.toString()}
          </span>
        </p>
        <p className='text-lg mt-3 break-all'>
          Complexity Score:{' '}
          <span className='text-sm text-gray-500'>
            {Object.entries(ComplexityScoreMap)[task?.complexityScore]?.[1]}
          </span>
        </p>
        <p className='text-lg mt-3 break-all'>
          Reputation Level:{' '}
          <span className='text-sm text-gray-500'>{task?.reputationLevel}</span>
        </p>
        <p className='text-lg mt-3 break-all'>
          Required approvals:{' '}
          <span className='text-sm text-gray-500'>
            {task?.requiredApprovals}
          </span>
        </p>
        <p className='text-lg mt-3 break-all'>
          Reward amount:{' '}
          <span className='text-sm text-gray-500'>
            {task?.rewardAmount.toString()}
          </span>
        </p>
        <p className='text-lg mt-3 break-all'>
          Reward token:{' '}
          <span className='text-sm text-gray-500'>
            {task?.rewardToken === ethers.constants.AddressZero
              ? null
              : task?.rewardToken}
          </span>
        </p>
      </div>
    </div>
  )
}

export default TaskPage
