import {
  GetOrganizationDocument,
  GetTasksDocument,
  GetTaskSnapshotsDocument,
  Organization,
  Task,
  TaskSnapshot
} from 'graphclient'
import client from 'graphclient/client'
import { useGetOrganizationQuery, usePolling } from 'hooks'
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage
} from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { wrapper } from 'state/store'
import { Converter } from 'utils/converter'
import Treasury from 'components/Organization/Dashboard/Treasury'
import TaskStatistics from 'components/Organization/Dashboard/TaskStatistics'
import TaskView from 'components/Organization/Dashboard/TaskView'
import ActivityView from 'components/Organization/Dashboard/ActivityView'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps(
    (store) => async (context: GetServerSidePropsContext) => {
      const orgId =
        typeof context.params?.id === 'string'
          ? context.params?.id
          : context.params?.id?.[0] || '0'
      const locale = context.locale ?? ''
      const { data } = await client.query({
        query: GetOrganizationDocument,
        variables: {
          id: orgId
        }
      })

      const { data: tasks } = await client.query({
        query: GetTasksDocument,
        variables: {
          orderBy: 'taskId',
          orderDirection: 'desc',
          where: {
            orgId: orgId,
            status_lte: 1,
            assignmentRequest: null
          }
        }
      })

      const { data: snapshots } = await client.query({
        query: GetTaskSnapshotsDocument,
        variables: {
          first: 5,
          orderBy: 'timestamp',
          orderDirection: 'desc',
          where: {
            orgId: orgId
          }
        }
      })

      return {
        props: {
          org: data?.organization,
          taskList: tasks.tasks,
          snapshots: snapshots.taskSnapshots,
          ...(await serverSideTranslations(locale, [
            'common',
            'organization',
            'header',
            'tasks'
          ]))
        }
      }
    }
  )

interface PageProps {
  org: Organization
  taskList: Task[]
  snapshots: TaskSnapshot[]
}

const OrganizationPage: NextPage<PageProps> = ({
  org,
  taskList,
  snapshots
}) => {
  const [organization, setOrganization] = useState(
    Converter.OrganizationFromQuery(org)
  )
  const { data, startPolling, stopPolling } = useGetOrganizationQuery({
    variables: {
      id: org.id
    }
  })
  usePolling(startPolling, stopPolling)

  useEffect(() => {
    if (data?.organization) {
      setOrganization(Converter.OrganizationFromQuery(data.organization))
    }
  }, [data])

  return (
    <div className='layout-container pb-20'>
      <Head>
        <title>Buildstream: Organizations</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='grid-layout py-10 md:py-24'>
        <div className='col-span-4 md:col-span-3 lg:col-span-4 2xl:col-span-3 order-2 2xl:order-1'>
          <div className='rounded-2xl'>
            <Treasury organization={organization} />
            <div className='mt-4 hidden lg:block 2xl:hidden'>
              <ActivityView
                organization={organization}
                taskSnapshots={snapshots?.map((t) =>
                  Converter.TaskSnapshotFromQuery(t as any)
                )}
              />
            </div>
            <div className='mt-4'>
              <TaskStatistics stat={organization.stat} />
            </div>
          </div>
        </div>
        <div className='col-span-4 md:col-span-5 lg:col-span-8 2xl:col-span-6 order-1 2xl:order-2'>
          <TaskView
            tasks={taskList.map((t) => Converter.TaskFromQuery(t))}
            organization={organization}
          />
        </div>
        <div className='hidden 2xl:block col-span-4 md:col-span-3 lg:col-span-4 2xl:col-span-3 order-3'>
          <div className='rounded-2xl'>
            <ActivityView
              organization={organization}
              taskSnapshots={snapshots?.map((t) =>
                Converter.TaskSnapshotFromQuery(t as any)
              )}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrganizationPage
