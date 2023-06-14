import CloseIcon from 'components/IconSvg/CloseIcon'
import Spinner from 'components/Spinner/Spinner'
import { useWeb3 } from 'hooks'
import { denyAssignee } from 'hooks/task/functions'
import { useTranslation } from 'next-i18next'
import { FormEvent, useState } from 'react'

interface IDenyTask {
  taskId: number
  onClose: () => void
  assignee: string
  onSuccess?: () => void
  onError?: () => void
}

const DenyTask = ({
  taskId,
  onClose,
  assignee,
  onSuccess,
  onError,
}: IDenyTask) => {
  const [processing, setProcessing] = useState(false)
  const { t } = useTranslation('tasks')
  const { library } = useWeb3()

  const denyTask = async (message: string) => {
    setProcessing(true)
    try {
      await denyAssignee(taskId, assignee, message)
      onSuccess?.()
    } catch (e) {
      console.error(e)
      onError?.()
    }
    onClose()
  }

  const handleDenyTask = (e: FormEvent) => {
    e.preventDefault()
    setProcessing(true)
    const formData = new FormData(e.target as any)
    const message = formData.get('message') as string
    denyTask(message)
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
              {t('deny_task_title', {
                assignee,
              })}
            </p>
          </div>
          <div className='divider' />
          <form onSubmit={handleDenyTask} className='mt-5'>
            <span>{t('deny_task_body')}</span>
            <textarea className='mt-3 input-base' name='message' rows={5} />
            <div className='mt-10 flex flex-col md:flex-row items-center gap-4 flex-0'>
              <button
                type='submit'
                className='btn-primary min-w-full md:min-w-fit bg-green-700 hover:bg-green-500'
                disabled={processing}
              >
                {t('continue')}
              </button>
              <button
                type='button'
                className='btn-primary min-w-full md:min-w-fit'
                disabled={processing}
                onClick={onClose}
              >
                {t('cancel')}
              </button>
            </div>
          </form>
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

export default DenyTask
