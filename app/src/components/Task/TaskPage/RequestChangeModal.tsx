import Duration from 'SVGs/Duration'
import CloseIcon from 'components/IconSvg/CloseIcon'
import Spinner from 'components/Spinner/Spinner'
import CryptoJS from 'crypto-js'
import SHA256 from 'crypto-js/sha256'
import { useWeb3 } from 'hooks'
import { changeDueDate, requestTaskReview } from 'hooks/task/functions'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import { dueDateCalc } from 'utils/task_duration'

interface RequestChangeModalProps {
  taskId: number
  onClose: () => void
  durationExtention?: boolean
}

const requestMessage =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc lobortis sem erat, at bibendum ante porta at. Pellentesque condimentum ex eu malesuada iaculis. Sed varius vulputate rutrum. Pellentesque non diam consequat, faucibus velit vitae, dapibus erat. Nunc maximus mauris magna, sed aliquet nibh faucibus at. Ut id justo elit. Etiam nunc eros, lacinia nec consectetur sed, sollicitudin in arcu.'

const RequestChangeModal = ({
  taskId,
  onClose,
  durationExtention = false
}: RequestChangeModalProps) => {
  const { account, library } = useWeb3()
  const { t } = useTranslation('tasks')
  const [processing, setProcessing] = useState(false)

  const getReviewParams = (): { reviewId: string; reviewHash: string } => {
    const idHash = SHA256(Date.parse(Date()).toString())
    const reviewId = '0x' + idHash.toString(CryptoJS.enc.Hex)
    const reviewHash = '0x' + SHA256(requestMessage)

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
    const duration = formData.get('duration') as string
    if (!account || duration === '') return
    const dueDate = dueDateCalc.getDurationInSeconds({
      weeks: 0,
      days: parseInt(duration),
      hours: 0
    })

    if (dueDate < 1) return

    const { reviewId, reviewHash } = getReviewParams()
    setProcessing(true)
    try {
      if (durationExtention) {
        await changeDueDate(taskId, 0, dueDate, library.getSigner())
        setProcessing(false)
        onClose()
        return
      }
      await requestTaskReview(
        taskId,
        reviewId,
        reviewHash,
        dueDate,
        library.getSigner()
      )
      setProcessing(false)
      onClose()
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
          {durationExtention && <div className='mb-3'>{requestMessage}</div>}
          <div className='col-span-4 w-1/3 mb-0'>
            <label htmlFor='duration' className='flex gap-2 items-center mb-2'>
              <span className='block text-gray-500'>
                <Duration />
              </span>
              <span className='block text-gray-500'>{t('set_duration')}</span>
            </label>
            <input
              type='number'
              id='duration'
              name='duration'
              min='1'
              className='overflow-hidden focus:outline-none rounded-md p-2 border border-gray-200'
            />
          </div>
          {!durationExtention && (
            <>
              <p className='text-sm mt-3 mb-3'>{t('changes_description')}</p>
              <textarea className='input-base' name='changes' rows={9} />
            </>
          )}

          <div className='mt-4 flex gap-x-6'>
            <button
              className='btn-primary text-sm flext justify-center'
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
