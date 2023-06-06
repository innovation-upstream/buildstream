import CloseIcon from 'components/IconSvg/CloseIcon'
import Spinner from 'components/Spinner/Spinner'
import { useWeb3 } from 'hooks'
import { approveAssignedRequest } from 'hooks/task/functions'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'

interface IAssignTask {
  taskId: number
  onClose: () => void
  assignee: string
  onSuccess?: () => void
  onError?: () => void
}

const AssignTask = ({
  taskId,
  onClose,
  assignee,
  onSuccess,
  onError,
}: IAssignTask) => {
  const [processing, setProcessing] = useState(false)
  const { t } = useTranslation('tasks')
  const { library } = useWeb3()

  const approveTask = async () => {
    setProcessing(true)
    try {
      await approveAssignedRequest(taskId, assignee, library.getSigner())
      onSuccess?.()
    } catch (e) {
      console.error(e)
      onError?.()
    }
    onClose()
  }

  const handleAssignTask = () => {
    setProcessing(true)
    approveTask()
  }

  return (
    <>
      <div
        onClick={onClose}
        className='fixed w-full h-full bg-black/40 inset-0 z-[51]'
      />
      <div className='paper fixed p-0 w-[500px] max-w-[90%] z-[52] top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'>
        <div className='relative px-5 md:px-10 py-8'>
          <div className='relative mb-5'>
            <button
              onClick={onClose}
              className='absolute -top-4 md:top-0 -right-1 md:-right-5'
            >
              <CloseIcon />
            </button>
            <p className='text-3xl text-center text-ellipsis whitespace-nowrap overflow-hidden px-8 font-semibold'>
              {t('assign_task_title', {
                assignee,
              })}
            </p>
          </div>
          <div className='divider' />
          <div className='mt-5'>
            <span>{t('assign_task_body')}</span>
            <div className='mt-10 flex flex-col md:flex-row items-center gap-4 flex-0'>
              <button
                className='btn-primary min-w-full md:min-w-fit bg-green-700 hover:bg-green-500'
                disabled={processing}
                onClick={handleAssignTask}
              >
                {t('continue')}
              </button>
              <button
                className='btn-primary min-w-full md:min-w-fit'
                disabled={processing}
                onClick={onClose}
              >
                {t('cancel')}
              </button>
            </div>
          </div>
          {processing && (
            <div className='absolute inset-0 z-10 w-full h-full rounded-2xl flex items-center justify-center bg-zinc-500/30'>
              <Spinner width={100} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default AssignTask
