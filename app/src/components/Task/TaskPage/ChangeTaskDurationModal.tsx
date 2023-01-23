import { useState } from 'react'
import CloseIcon from 'components/IconSvg/CloseIcon'
import { useWeb3 } from 'hooks'
import { useTranslation } from 'next-i18next'
import { useEffect } from 'react'
import { changeTaskDuration } from 'hooks/task/functions'
import Duration from 'SVGs/Duration'
import { TaskDurationCalc } from 'utils/task_duration'
import Spinner from 'components/Spinner/Spinner'

interface ChangeTaskDurationProps {
  taskId: number
  onClose: () => void
}

const requestMessage =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc lobortis sem erat, at bibendum ante porta at. Pellentesque condimentum ex eu malesuada iaculis. Sed varius vulputate rutrum. Pellentesque non diam consequat, faucibus velit vitae, dapibus erat. Nunc maximus mauris magna, sed aliquet nibh faucibus at. Ut id justo elit. Etiam nunc eros, lacinia nec consectetur sed, sollicitudin in arcu.'

const ChangeTaskDurationModal = ({
  taskId,
  onClose
}: ChangeTaskDurationProps) => {
  const { account, library } = useWeb3()
  const { t } = useTranslation('tasks')
  const [processing, setProcessing] = useState(false)

  const submitTask = async (e: any) => {
    e.preventDefault()
    if (!account) {
      return
    }
    const formData = new FormData(e.target as any)

    const duration = formData.get('duration') as string
    if (!account || duration === '') return

    const taskDuration = TaskDurationCalc.getDurationInSeconds({
      weeks: 0,
      days: parseInt(duration),
      hours: 0
    })

    setProcessing(true)
    try {
      await changeTaskDuration(taskId, 0, taskDuration, library.getSigner())
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
              type='number'
              id='duration'
              name='duration'
              min='1'
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

export default ChangeTaskDurationModal
