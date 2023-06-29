import Bell from 'SVGs/Bell'
import FileWrite from 'SVGs/FileWrite'
import Warning from 'SVGs/Warning'
import MarkDownEditor from 'components/MarkDownEditor/MarkDownEditor'
import Spinner from 'components/Spinner/Spinner'
import { useWeb3 } from 'hooks'
import { acceptRevision, getRevisions, rejectTaskRevision } from 'hooks/task/functions'
import { TaskRevision, TaskRevisionStatus } from 'hooks/task/types'
import moment from 'moment'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import ChangeDueDateModal from './ChangeDueDateModal'
import RequestChangeModal from './RequestChangeModal'

interface ChangeRequestProps {
  revision: TaskRevision
  isAssignee?: boolean
  taskId: number
  isLast?: boolean
  isApprover?: boolean
}

const ChangeRequest = ({
  revision,
  isAssignee,
  taskId,
  isLast,
  isApprover
}: ChangeRequestProps) => {
  const { t } = useTranslation('tasks')
  const [changeConditions, setChangeConditions] = useState(false)
  const { account, library } = useWeb3()
  const [processing, setProcessing] = useState(false)
  const [processDispute, setProcessDispute] = useState(false)
  const [processAcceptConditions, setProcessAcceptConditions] = useState(false)
  const [message, setMessage] = useState('')

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

  const reject = async () => {
    if (!account) return
    setProcessDispute(true)
    try {
      await rejectTaskRevision(taskId, revision.id, library.getSigner())
      setProcessDispute(false)
    } catch (e) {
      console.error(e)
      setProcessDispute(false)
    }
  }

  useEffect(() => {
    if (taskId === undefined) return
    getRevisions(taskId).then((revisions) => {
      const revisionData = revisions.find((r: any) => r.revisionId == revision.id)
      setMessage(revisionData?.message || '')
    })
  }, [taskId, revision.id])

  const acceptConditions = () => {
    setProcessAcceptConditions(true)
  }

  const durationExtenstionRequest =
    revision.dueDateExtensionRequest > 0
      ? moment.unix(revision.dueDateExtensionRequest).format('YYYY-MM-DD')
      : undefined

  return (
    <div className='paper mt-7'>
      <div className='flex items-center gap-x-4'>
        <div className='shrink-0 h-9 md:h-10 w-9 md:w-10 flex items-center justify-center rounded-md bg-[#E1F3EC]'>
          <Bell className='fill-[#6BC5A1]' />
        </div>
        <p className='text-2xl font-semibold'>{t('new_revision_request')}</p>
      </div>
      <MarkDownEditor
        className='!mt-4 !border-0'
        value={{ text: message }}
        readOnly
        hideToggle
      />
      <div className='flex-column lg:flex gap-4 mt-3 text-sm'>
        <span className='block text-gray-500'>
          {t('duedate_extension')}:{' '}
          <span className='text-gray-700 font-bold'>
            {revision.dueDateExtension === 0
              ? 'none'
              : moment.unix(revision.dueDateExtension).format('YYYY-MM-DD')}
          </span>
        </span>
        <span className='block text-gray-500'>
          {t('duedate_extension_request')}:{' '}
          <span className='text-gray-700 font-bold'>
            {durationExtenstionRequest}
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
          {processDispute ? (
            <Spinner />
          ) : (
            <button
              className='btn-outline border-[#EFF0F1] text-sm flex justify-center gap-2.5 items-center'
              onClick={reject}
            >
              <Warning />
              {t('dispute_task')}
            </button>
          )}
        </div>
      )}
      {isLast &&
        revision.status === TaskRevisionStatus.CHANGES_REQUESTED &&
        isApprover && (
          <div className='flex flex-col lg:flex-row gap-4 mt-4'>
            <button
              className='btn-primary w-full md:w-fit text-sm flex justify-center'
              onClick={acceptConditions}
            >
              {t('accept_duedate_extension_request')}
            </button>
          </div>
        )}
      {changeConditions && (
        <ChangeDueDateModal
          taskId={taskId}
          revisionId={revision.id}
          onClose={() => setChangeConditions(false)}
        />
      )}
      {processAcceptConditions && (
        <RequestChangeModal
          taskId={taskId}
          dueDate={durationExtenstionRequest}
          onClose={() => setProcessAcceptConditions(false)}
        />
      )}
    </div>
  )
}

export default ChangeRequest
