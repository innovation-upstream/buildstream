import WalletModal from 'components/Modals/WalletModal'
import TaskStatistics from 'components/Organization/Dashboard/TaskStatistics'
import { TaskFilterProvider } from 'components/Task/TaskListPage/FilterContext'
import ProfileCard from 'components/Task/TaskListPage/ProfileCard'
import TaskOverview from 'components/Task/TaskListPage/TaskOverview'
import client from 'graphclient/client'
import { useGetTasksLazyQuery, useWeb3 } from 'hooks'
import { TaskStatus } from 'hooks/task/types'
import { useUserStat } from 'hooks/userstat'
import { fetchClickupTask } from 'integrations/clickup/api/functions'
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage
} from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { wrapper } from 'state/store'
import { Converter } from 'utils/converter'
import { GetTasksDocument, Task } from '../../../.graphclient'

const processTasks = async (tasks: Task[]): Promise<Task[]> => {
  return await Promise.all(
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
}

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps(
    (store) => async (context: GetServerSidePropsContext) => {
      const address = context.params?.address?.[0].toLocaleLowerCase() || ''
      let tasks = null
      if (address) {
        const { data } = await client.query({
          query: GetTasksDocument,
          variables: {
            orderBy: 'taskId',
            orderDirection: 'desc',
            where: {
              assignee: address,
              status_gte: TaskStatus.ASSIGNED,
              status_lte: TaskStatus.CLOSED
            }
          }
        })
        tasks = await processTasks(data.tasks as Task[])
      }
      const locale = context.locale ?? ''

      return {
        props: {
          taskList: tasks,
          ...(await serverSideTranslations(locale, [
            'common',
            'tasks',
            'header',
            'organization'
          ])),
          address
        }
      }
    }
  )

const TasksOverview: NextPage<{ taskList: Task[]; address: string }> = ({
  taskList,
  address
}) => {
  const { account } = useWeb3()
  const userAddress = address || account
  const stats = useUserStat(userAddress)
  const [showModal, setShowModal] = useState(false)
  const [tasks, setTasks] = useState(
    taskList?.map((t) => Converter.TaskFromQuery(t))
  )

  const [getTaskList, { data }] = useGetTasksLazyQuery()

  useEffect(() => {
    if (!userAddress) {
      setShowModal(true)
      return
    }

    setShowModal(false)
    getTaskList({
      variables: {
        orderBy: 'taskId',
        orderDirection: 'desc',
        where: {
          assignee: userAddress
        }
      }
    })
  }, [userAddress, getTaskList])

  useEffect(() => {
    if (!data) return
    processTasks(data.tasks as Task[]).then((tasksWithClickupData) =>
      setTasks(tasksWithClickupData?.map((t) => Converter.TaskFromQuery(t)))
    )
  }, [data])

  return (
    <div className='layout-container pb-20'>
      <Head>
        <title>Buildstream: Tasks Overview</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      {showModal && <WalletModal close={() => setShowModal(!showModal)} />}

      <TaskFilterProvider>
        <div className='grid-layout py-10 md:py-24'>
          <div className='col-span-4 md:col-span-3 lg:col-span-4 2xl:col-span-3 order-1 2xl:order-1'>
            {userAddress && (
              <div className='rounded-2xl'>
                <ProfileCard address={userAddress} />
                <div className='mt-4'>
                  <TaskStatistics stat={stats} />
                </div>
              </div>
            )}
          </div>
          <div className='col-span-4 md:col-span-5 lg:col-span-8 2xl:col-span-9 order-1 2xl:order-2'>
            <TaskOverview tasks={tasks} />
          </div>
        </div>
      </TaskFilterProvider>
    </div>
  )
}

export default TasksOverview
