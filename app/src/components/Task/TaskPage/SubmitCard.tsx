import { useState } from 'react'
import { useWeb3 } from 'hooks'
import { taskSubmission } from 'hooks/task/functions'
import { useTranslation } from 'next-i18next'
import Spinner from 'components/Spinner/Spinner'

interface SubmitCardProps {
  taskId: number
}

const SubmitCard = ({ taskId }: SubmitCardProps) => {
  const { account, library } = useWeb3()
  const { t } = useTranslation('tasks')
  const [processing, setProcessing] = useState(false)

  const submitTask = async (e: any) => {
    e.preventDefault()
    if (!account) {
      return
    }
    const formData = new FormData(e.target as any)
    const comment = formData.get('comment') as string
    setProcessing(true)
    try {
      await taskSubmission(taskId, comment, library.getSigner())
      setProcessing(false)
    } catch (e) {
      console.error(e)
      setProcessing(false)
    }
  }

  return (
    <div className='paper mt-7'>
      <p className='text-2xl font-semibold'>{t('in_progress')}</p>
      <form className='flex items-center mt-4 gap-x-6' onSubmit={submitTask}>
        <input className='input-base' name='comment' />
        <button
          className='btn-primary whitespace-nowrap flex justify-center'
          type='submit'
        >
          {processing ? (
            <Spinner className='text-white' />
          ) : (
            t('submit_solution')
          )}
        </button>
      </form>
    </div>
  )
}

export default SubmitCard
