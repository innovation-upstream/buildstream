import Duration from 'SVGs/Duration'
import CloseIcon from 'components/IconSvg/CloseIcon'
import Spinner from 'components/Spinner/Spinner'
import CryptoJS from 'crypto-js'
import SHA256 from 'crypto-js/sha256'
import { useWeb3 } from 'hooks'
import useServerConfirmation from 'hooks/auth/useServerConfirmation'
import { createRevision, requestTaskReview } from 'hooks/task/functions'
import moment from 'moment'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'

interface RequestChangeModalProps {
  taskId: number
  onClose: () => void
  dueDate?: string
  message?: string
}

const RequestChangeModal = ({
  taskId,
  onClose,
  dueDate,
  message
}: RequestChangeModalProps) => {
  const { account, library } = useWeb3()
  const { t } = useTranslation('tasks')
  const [processing, setProcessing] = useState(false)
  const { callAction, component } = useServerConfirmation({
    onError: () => setProcessing(false)
  })

  const getReviewParams = (
    changes: string
  ): { reviewId: string; reviewHash: string } => {
    const idHash = SHA256(Date.parse(Date()).toString())
    const reviewId = '0x' + idHash.toString(CryptoJS.enc.Hex)
    const reviewHash = '0x' + SHA256(changes)

    return {
      reviewId: reviewId,
      reviewHash: reviewHash
    }
  }

  const submitTask = async (e: any) => {
    e.preventDefault()
    if (!account) {
      return
    }
    const formData = new FormData(e.target as any)

    const changes = formData.get('changes') as string
    const dueDateStr = formData.get('dueDate') as string
    if (!account || dueDateStr === '') return
    const dueDate = moment(dueDateStr)
      .add(60 * 60 * 24 - 1, 'seconds')
      .unix()

    if (dueDate < moment.now() / 1000) return

    const { reviewId, reviewHash } = getReviewParams(changes)
    setProcessing(true)
    try {
      const revisionId = await requestTaskReview(
        taskId,
        reviewId,
        reviewHash,
        dueDate,
        library.getSigner()
      )
      await callAction(
        async () => await createRevision(taskId, reviewId, revisionId, changes),
        () => {
          setProcessing(false)
          onClose()
        }
      )
    } catch (e) {
      console.error(e)
      setProcessing(false)
    }
  }

  useEffect(() => {
    const body = document.body
    body.style.overflow = 'hidden'

    return () => {
      body.style.overflow = 'auto'
    }
  }, [])

  return (
    <>
      {component}
      <div
        onClick={onClose}
        className='fixed w-full h-full bg-black/40 inset-0 z-10'
      />
      <div className='fixed paper w-[672px] max-w-[90%] z-20 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'>
        <div className='relative'>
          <button onClick={onClose} className='absolute right-0'>
            <CloseIcon />
          </button>
          <p className='text-2xl font-semibold mb-6'>{t('request_changes')}</p>
        </div>
        <div className='divider' />

        <form className='mt-3' onSubmit={submitTask}>
          <div className='col-span-4 w-1/3 mb-0'>
            <label htmlFor='dueDate' className='flex gap-2 items-center mb-2'>
              <span className='block text-gray-500'>
                <Duration />
              </span>
              <span className='block text-gray-500'>
                {t('adjust_due_date')}
              </span>
            </label>
            <input
              type='date'
              id='dueDate'
              name='dueDate'
              defaultValue={
                dueDate || moment().add(1, 'days').format('YYYY-MM-DD')
              }
              className='overflow-hidden focus:outline-none rounded-md p-2 border border-gray-200'
              readOnly={!!dueDate}
            />
          </div>
          <p className='text-sm mt-3 mb-3'>{t('task_revision_body')}</p>
          <textarea
            className='input-base'
            name='changes'
            value={message}
            readOnly={!!message}
            rows={5}
          />

          <div className='mt-4 flex gap-x-6'>
            <button
              className='btn-primary text-sm flex justify-center'
              type='submit'
            >
              {processing ? (
                <Spinner className='text-white' />
              ) : (
                t('request_changes')
              )}
            </button>
            <button
              className='btn-outline border-[#EFF0F1] text-sm'
              onClick={onClose}
            >
              {t('cancel')}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default RequestChangeModal
