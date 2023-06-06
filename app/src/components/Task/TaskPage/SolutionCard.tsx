import FileSvg from 'SVGs/File'
import MarkDownEditor from 'components/MarkDownEditor/MarkDownEditor'
import Spinner from 'components/Spinner/Spinner'
import { useWeb3 } from 'hooks'
import { approveTask } from 'hooks/task/functions'
import { Task } from 'hooks/task/types'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import RequestChangeModal from './RequestChangeModal'

interface TaskStatusCardProps {
  task: Task
  comment: string
  isUpdatedSolution?: boolean
  showControls?: boolean
}

const requestMessage =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc lobortis sem erat, at bibendum ante porta at. Pellentesque condimentum ex eu malesuada iaculis. Sed varius vulputate rutrum. Pellentesque non diam consequat, faucibus velit vitae, dapibus erat. Nunc maximus mauris magna, sed aliquet nibh faucibus at. Ut id justo elit. Etiam nunc eros, lacinia nec consectetur sed, sollicitudin in arcu.'

const SolutionCard = ({
  task,
  isUpdatedSolution,
  showControls,
  comment
}: TaskStatusCardProps) => {
  const { account, library } = useWeb3()
  const { t } = useTranslation('tasks')
  const [requestChangeModal, setShowRequestChangeModal] = useState(false)
  const [processing, setProcessing] = useState(false)

  const approve = async () => {
    if (!account) return
    setProcessing(true)
    try {
      await approveTask(task.id, library.getSigner())
    } catch (e) {
      console.error(e)
    }
    setProcessing(false)
  }

  const yourSolution =
    account && task.assigneeAddress === account
      ? t('your_solution')
      : t('solution')
  const updatedSolution =
    account && task.assigneeAddress === account
      ? t('your_updated_solution')
      : t('updated_solution')

  return (
    <>
      <div className='paper mt-7'>
        <p className='text-2xl font-semibold'>
          {!isUpdatedSolution ? yourSolution : updatedSolution}
        </p>
        <div className='mt-4'>
          <MarkDownEditor
            className='!border-0'
            value={{ text: comment || task.comment }}
            readOnly
            hideToggle
          />
        </div>
        {showControls && (
          <div className='flex flex-col lg:flex-row gap-4 mt-4'>
            <button
              className='btn-primary text-sm flex justify-center gap-2.5 items-center'
              onClick={approve}
              disabled={processing}
            >
              <FileSvg />
              {processing ? <Spinner /> : t('approve_and_complete')}
            </button>
            <button
              className='btn-outline border-[#EFF0F1] text-sm'
              onClick={() => setShowRequestChangeModal(true)}
            >
              {t('request_changes')}
            </button>
          </div>
        )}
      </div>
      {requestChangeModal && (
        <RequestChangeModal
          taskId={task.id}
          onClose={() => setShowRequestChangeModal(false)}
        />
      )}
    </>
  )
}

export default SolutionCard
