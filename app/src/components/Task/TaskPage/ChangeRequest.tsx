import Bell from 'SVGs/Bell'
import FileWrite from 'SVGs/FileWrite'
import Warning from 'SVGs/Warning'
import Spinner from 'components/Spinner/Spinner'
import { useWeb3 } from 'hooks'
import { acceptRevision } from 'hooks/task/functions'
import { TaskRevision, TaskRevisionStatus } from 'hooks/task/types'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import { dueDateCalc } from 'utils/task_duration'
import ChangeDueDateModal from './ChangeDueDateModal'

const demoRevision = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras viverra eu eleifend orci. 
Eleifend curabitur vitae et tempor tellus amet. Adipiscing eget eget interdum eu quam facilisi lacus. 
Auctor adipiscing maecenas aenean vestibulum. Mollis sem tristique libero magna urna. 
Sit eget imperdiet ipsum eu. Enim posuere justo gravida gravida nunc neque, volutpat nisi.
`

interface ChangeRequestProps {
  revision: TaskRevision
  isAssignee?: boolean
  taskId: number
}

const ChangeRequest = ({
  revision,
  isAssignee,
  taskId
}: ChangeRequestProps) => {
  const { t } = useTranslation('tasks')
  const [changeConditions, setChangeConditions] = useState(false)
  const { account, library } = useWeb3()
  const [processing, setProcessing] = useState(false)

  const accept = async () => {
    if (!account) return
    setProcessing(true)
    try {
      await acceptRevision(taskId, revision.id, library.getSigner())
      setProcessing(false)
    } catch (e) {
      console.error(e)
      setProcessing(false)
    }
  }

  return (
    <div className='paper mt-7'>
      <div className='flex items-center gap-x-4'>
        <div className='shrink-0 h-9 md:h-10 w-9 md:w-10 flex items-center justify-center rounded-md bg-[#E1F3EC]'>
          <Bell className='fill-[#6BC5A1]' />
        </div>
        <p className='text-2xl font-semibold'>{t('new_revision_request')}</p>
      </div>
      <p className='mt-4'>{demoRevision}</p>
      <div className='flex-column lg:flex gap-4 mt-3 text-sm'>
        <span className='block text-gray-500'>
          {t('duration_extension')}:{' '}
          <span className='text-gray-700 font-bold'>
            {dueDateCalc.getDurationInDays(revision.dueDateExtension)}{' '}
            {t('days')}
          </span>
        </span>
        <span className='block text-gray-500'>
          {t('duration_extension_request')}:{' '}
          <span className='text-gray-700 font-bold'>
            {dueDateCalc.getDurationInDays(
              revision.dueDateExtensionRequest
            )}{' '}
            {t('days')}
          </span>
        </span>
      </div>
      {revision.status === TaskRevisionStatus.PROPOSED && isAssignee && (
        <div className='flex flex-col lg:flex-row gap-4 mt-4'>
          <button
            className='btn-primary text-sm flex justify-center'
            onClick={accept}
          >
            {processing ? <Spinner className='text-white' /> : t('accept')}
          </button>
          <button
            className='btn-outline border-[#EFF0F1] text-sm flex justify-center gap-2.5 items-center'
            onClick={() => setChangeConditions(true)}
          >
            <FileWrite />
            {t('change_conditions')}
          </button>
          <button className='btn-outline border-[#EFF0F1] text-sm flex justify-center gap-2.5 items-center'>
            <Warning />
            {t('appeal_edits')}
          </button>
        </div>
      )}
      {changeConditions && (
        <ChangeDueDateModal
          taskId={taskId}
          onClose={() => setChangeConditions(false)}
        />
      )}
    </div>
  )
}

export default ChangeRequest
