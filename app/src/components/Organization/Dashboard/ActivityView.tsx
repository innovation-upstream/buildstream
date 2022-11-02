import { useGetTaskSnapshotsQuery, usePolling } from 'hooks'
import { Organization } from 'hooks/organization/types'
import { TaskSnapshot } from 'hooks/task/types'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Write from 'SVGs/Write'
import { Converter } from 'utils/converter'
import { useTranslation } from 'react-i18next'

const messageTemplates: Record<any, string> = {
  0: 'Task:  <strong>{title}</strong> is <strong>created</strong>',
  1: 'Task:  <strong>{title}</strong> is <strong>opened</strong>',
  2: 'Task:  <strong>{title}</strong> is <strong>assigned</strong>',
  3: 'Task:  <strong>{title}</strong> is <strong>submitted</strong>',
  4: 'Task:  <strong>{title}</strong> is <strong>closed</strong>'
}

interface ActivityViewProps {
  taskSnapshots?: TaskSnapshot[]
  organization: Organization
}

const EmptyActivityView = () => {
  const { t } = useTranslation('organization')
  return (
    <div className='paper'>
      <p className='text-2xl font-semibold mb-6'>{t('recent_activity')}</p>
      <div className='divider' />
      <div className='flex items-center flex-col pt-10 pb-4'>
        <div className='p-4 bg-[#EFF0F1] rounded-xl'>
          <Write width={49} className='fill-gray-400' />
        </div>
        <p className='mt-3 text-secondary'>{t('nothing_to_show')}</p>
      </div>
    </div>
  )
}

const ActivityView = ({
  taskSnapshots: taskSnapshotsList,
  organization
}: ActivityViewProps) => {
  const [taskSnapshots, setTaskSnapshots] = useState(taskSnapshotsList)
  const { data, startPolling, stopPolling } = useGetTaskSnapshotsQuery({
    variables: {
      first: 5,
      orderBy: 'timestamp',
      orderDirection: 'desc',
      where: {
        orgId: organization.id.toString()
      }
    }
  })
  usePolling(startPolling, stopPolling)
  const { t } = useTranslation('organization')

  useEffect(() => {
    if (data?.taskSnapshots) {
      setTaskSnapshots(
        data.taskSnapshots?.map((t) =>
          Converter.TaskSnapshotFromQuery(t as any)
        )
      )
    }
  }, [data])

  if (!taskSnapshots?.length) {
    return <EmptyActivityView />
  }

  return (
    <div className='paper p-6'>
      <p className='text-2xl font-semibold mb-6'>{t('recent_activity')}</p>
      <div className='divider' />
      <ul className='pt-6'>
        {taskSnapshots.map((snapshot) => {
          const message = messageTemplates[snapshot.status as any]?.replace(
            '{title}',
            snapshot.title
          )
          return (
            <li
              key={snapshot.timestamp.toString()}
              className='p-4 bg-[#F8F9FA] rounded-md mb-2'
            >
              <p className='text-lg font-semibold mb-2'>
                {snapshot.actor?.substring(0, 7)}...
                {snapshot.actor?.substring(snapshot.actor?.length - 4)}
              </p>
              <p
                className='text-sm text-secondary mb-4'
                dangerouslySetInnerHTML={{
                  __html: message
                }}
              />
              <Link href={`/task/${snapshot.taskId}`}>
                <button className='btn-primary text-[#17191A] bg-white hover:bg-zinc-200 focus:bg-zinc-200'>
                  {t('view')}
                </button>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default ActivityView
