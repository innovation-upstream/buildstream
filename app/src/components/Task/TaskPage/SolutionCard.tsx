import FileSvg from 'SVGs/File'
import Warning from 'SVGs/Warning'
import Spinner from 'components/Spinner/Spinner'
import { useWeb3 } from 'hooks'
import { approveTask, disputeAssignedTask } from 'hooks/task/functions'
import { Task } from 'hooks/task/types'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import ChangeDueDateModal from './ChangeDueDateModal'
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
  showControls
}: TaskStatusCardProps) => {
  const { account, library } = useWeb3()
  const { t } = useTranslation('tasks')
  const [requestChangeModal, setShowRequestChangeModal] = useState(false)
  const [durationExtention, setDurationExtention] = useState(false)
  const [processDispute, setProcessDispute] = useState(false)

  const approve = async () => {
    if (!account) return
    try {
      await approveTask(task.id, library.getSigner())
    } catch (e) {
      console.error(e)
    }
  }

  const disputeTask = async () => {
    if (!account) return
    setProcessDispute(true)
    try {
      await disputeAssignedTask(task.id, 0, library.getSigner())
      setProcessDispute(false)
    } catch (e) {
      console.error(e)
      setProcessDispute(false)
    }
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
        <div className='mt-4 px-4 py-3 bg-[#F8F9FA] rounded-[10px]'>
          {task.comment}
        </div>
        {showControls && (
          <div className='flex flex-col lg:flex-row gap-4 mt-4'>
            <button
              className='btn-primary text-sm flex justify-center gap-2.5 items-center'
              onClick={approve}
            >
              <FileSvg />
              {t('approve_and_complete')}
            </button>
            <button
              className='btn-outline border-[#EFF0F1] text-sm'
              onClick={() => setShowRequestChangeModal(true)}
            >
              {t('request_changes')}
            </button>
            {processDispute ? (
              <Spinner />
            ) : (
              <button
                className='btn-outline border-[#EFF0F1] text-sm flex justify-center gap-2.5 items-center'
                onClick={disputeTask}
              >
                <Warning />
                {t('dispute_task')}
              </button>
            )}
          </div>
        )}
      </div>
      {requestChangeModal && (
        <RequestChangeModal
          taskId={task.id}
          onClose={() => setShowRequestChangeModal(false)}
        />
      )}
      {durationExtention && (
        <ChangeDueDateModal
          taskId={task.id}
          onClose={() => setDurationExtention(false)}
        />
      )}
    </>
  )
}

export default SolutionCard
