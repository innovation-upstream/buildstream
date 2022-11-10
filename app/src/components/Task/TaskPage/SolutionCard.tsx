import { useWeb3 } from 'hooks'
import { approveTask } from 'hooks/task/functions'
import { Task } from 'hooks/task/types'
import { useTranslation } from 'next-i18next'
import React, { useState } from 'react'
import FileSvg from 'SVGs/File'
import Warning from 'SVGs/Warning'
import RequestChangeModal from './RequestChangeModal'

interface TaskStatusCardProps {
  task: Task
  comment: string
  isUpdatedSolution?: boolean
  showControls?: boolean
}

const SolutionCard = ({
  task,
  isUpdatedSolution,
  showControls
}: TaskStatusCardProps) => {
  const { account, library } = useWeb3()
  const { t } = useTranslation('tasks')
  const [requestChangeModal, setShowRequestChangeModal] = useState(false)

  const approve = async () => {
    if (!account) return
    try {
      await approveTask(task.id, library.getSigner())
    } catch (e) {
      console.error(e)
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
            <button className='btn-outline border-[#EFF0F1] text-sm flex justify-center gap-2.5 items-center'>
              <Warning />
              {t('dispute_task')}
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
