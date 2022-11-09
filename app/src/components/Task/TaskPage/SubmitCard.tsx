import { useWeb3 } from 'hooks'
import { taskSubmission } from 'hooks/task/functions'
import { useTranslation } from 'next-i18next'

interface SubmitCardProps {
  taskId: number
}

const SubmitCard = ({ taskId }: SubmitCardProps) => {
  const { account, library } = useWeb3()
  const { t } = useTranslation('tasks')

  const submitTask = async (e: any) => {
    e.preventDefault()
    if (!account) {
      return
    }
    const formData = new FormData(e.target as any)
    const comment = formData.get('comment') as string
    try {
      await taskSubmission(taskId, comment, library.getSigner())
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className='paper mt-7'>
      <p className='text-2xl font-semibold'>{t('in_progress')}</p>
      <form className='flex items-center mt-4 gap-x-6' onSubmit={submitTask}>
        <input className='input-base' name='comment' />
        <button className='btn-primary whitespace-nowrap' type='submit'>
          {t('submit_solution')}
        </button>
      </form>
    </div>
  )
}

export default SubmitCard
