import Duration from 'SVGs/Duration'
import CloseIcon from 'components/IconSvg/CloseIcon'
import Spinner from 'components/Spinner/Spinner'
import { useWeb3 } from 'hooks'
import { changeDueDate } from 'hooks/task/functions'
import moment from 'moment'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'

interface ChangeDueDateProps {
  taskId: number
  revisionId: number
  onClose: () => void
}

const requestMessage =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc lobortis sem erat, at bibendum ante porta at. Pellentesque condimentum ex eu malesuada iaculis. Sed varius vulputate rutrum. Pellentesque non diam consequat, faucibus velit vitae, dapibus erat. Nunc maximus mauris magna, sed aliquet nibh faucibus at. Ut id justo elit. Etiam nunc eros, lacinia nec consectetur sed, sollicitudin in arcu.'

const ChangeDueDateModal = ({ taskId, revisionId, onClose }: ChangeDueDateProps) => {
  const { account, library } = useWeb3()
  const { t } = useTranslation('tasks')
  const [processing, setProcessing] = useState(false)

  const submitTask = async (e: any) => {
    e.preventDefault()
    if (!account) {
      return
    }
    const formData = new FormData(e.target as any)

    const dueDateStr = formData.get('dueDate') as string
    if (!account || dueDateStr === '') return

    const dueDate = moment(dueDateStr)
      .add(60 * 60 * 60 - 1, 'seconds')
      .unix()

    setProcessing(true)
    try {
      await changeDueDate(taskId, revisionId, dueDate, library.getSigner())
      setProcessing(false)
      onClose()
    } catch (e) {
      console.error(e)
      setProcessing(false)
      onClose()
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
          <p className='text-2xl font-semibold mb-6'>
            {t('change_task_duration')}
          </p>
        </div>
        <div className='divider' />

        <form className='mt-3' onSubmit={submitTask}>
          <div className='mb-3'>{requestMessage}</div>
          <div className='col-span-4 md:w-1/3 mb-0'>
            <label htmlFor='duration' className='flex gap-2 items-center mb-2'>
              <span className='block text-gray-500'>
                <Duration />
              </span>
              <span className='block text-gray-500'>{t('set_duration')}</span>
            </label>
            <input
              type='date'
              id='dueDate'
              name='dueDate'
              defaultValue={moment().add(1, 'days').format('YYYY-MM-DD')}
              className='overflow-hidden focus:outline-none rounded-md p-2 border border-gray-200'
            />
          </div>

          <div className='mt-4 flex gap-x-6'>
            <button
              className='btn-primary text-sm px-8 flex justify-center'
              type='submit'
            >
              {processing ? <Spinner className='text-white' /> : t('change')}
            </button>
            <button
              className='btn-outline border-[#EFF0F1] text-sm px-8'
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

export default ChangeDueDateModal
