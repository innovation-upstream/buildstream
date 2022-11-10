import { TaskRevision, TaskRevisionStatus } from 'hooks/task/types'
import { useTranslation } from 'next-i18next'
import Bell from 'SVGs/Bell'
import FileWrite from 'SVGs/FileWrite'
import Warning from 'SVGs/Warning'

const demoRevision = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras viverra eu eleifend orci. 
Eleifend curabitur vitae et tempor tellus amet. Adipiscing eget eget interdum eu quam facilisi lacus. 
Auctor adipiscing maecenas aenean vestibulum. Mollis sem tristique libero magna urna. 
Sit eget imperdiet ipsum eu. Enim posuere justo gravida gravida nunc neque, volutpat nisi.
`

interface ChangeRequestProps {
  revision: TaskRevision
  isAssignee?: boolean
}

const ChangeRequest = ({ revision, isAssignee }: ChangeRequestProps) => {
  const { t } = useTranslation('tasks')

  return (
    <div className='paper mt-7'>
      <div className='flex items-center gap-x-4'>
        <div className='shrink-0 h-9 md:h-10 w-9 md:w-10 flex items-center justify-center rounded-md bg-[#E1F3EC]'>
          <Bell className='fill-[#6BC5A1]' />
        </div>
        <p className='text-2xl font-semibold'>{t('new_revision_request')}</p>
      </div>
      <p className='mt-4'>{demoRevision}</p>
      {revision.status === TaskRevisionStatus.PROPOSED && isAssignee && (
        <div className='flex flex-col lg:flex-row gap-4 mt-4'>
          <button className='btn-primary text-sm'>{t('accept')}</button>
          <button className='btn-outline border-[#EFF0F1] text-sm flex justify-center gap-2.5 items-center'>
            <FileWrite />
            {t('change_conditions')}
          </button>
          <button className='btn-outline border-[#EFF0F1] text-sm flex justify-center gap-2.5 items-center'>
            <Warning />
            {t('appeal_edits')}
          </button>
        </div>
      )}
    </div>
  )
}

export default ChangeRequest
