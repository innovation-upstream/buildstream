import MarkDownEditor from 'components/MarkDownEditor/MarkDownEditor'
import Spinner from 'components/Spinner/Spinner'
import { useWeb3 } from 'hooks'
import { taskSubmission } from 'hooks/task/functions'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

interface SubmitCardProps {
  taskId: number
}

const commentTemplate = `
**Link to review work (ex. Github PR, Figma, etc)**: 

**Notes**: 
`

const SubmitCard = ({ taskId }: SubmitCardProps) => {
  const { account, library } = useWeb3()
  const { t } = useTranslation('tasks')
  const [processing, setProcessing] = useState(false)
  const [comment, setComment] = useState('')

  const handleChange = (c: string) => {
    let newComment = c
    if (newComment === commentTemplate) newComment = ''
    setComment(newComment)
  }

  const submitTask = async (e: any) => {
    e.preventDefault()
    if (!comment) {
      toast.error(t('comment_required'), { icon: '⚠️' })
      return
    }
    if (!account) {
      toast.error(t('wallet_not_connected'), { icon: '⚠️' })
      return
    }
    setProcessing(true)
    try {
      await taskSubmission(taskId, comment, library.getSigner())
      setProcessing(false)
    } catch (e) {
      console.error(e)
      setProcessing(false)
      toast.error(t('error_submitting_task'), { icon: '❌' })
    }
  }

  return (
    <div className='paper mt-7'>
      <Toaster />
      <p className='text-2xl font-semibold'>{t('in_progress')}</p>
      <form onSubmit={submitTask}>
        <MarkDownEditor
          name='comment'
          className='!h-[200px]'
          value={{
            text: comment || commentTemplate
          }}
          required
          onChange={(v) => handleChange(v.text)}
        />

        <button
          className='mt-4 btn-primary whitespace-nowrap flex justify-center'
          type='submit'
          disabled={processing}
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
