import CloseIcon from 'components/IconSvg/CloseIcon'
import Spinner from 'components/Spinner/Spinner'
import { useWeb3 } from 'hooks'
import useServerConfirmation from 'hooks/auth/useServerConfirmation'
import { Organization } from 'hooks/organization/types'
import { editTask, updateTaskInstructions } from 'hooks/task/functions'
import { Task } from 'hooks/task/types'
import moment from 'moment'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import { CheckmarkIcon, ErrorIcon } from 'react-hot-toast'

interface EditProgressModalProps {
  organization: Organization
  onClose?: () => void
  task: Task
  taskData: any
  onError?: (error: string[]) => void
  onSuccess?: () => void
}

enum Progress {
  SKIPPED,
  PENDING,
  IN_PROGRESS,
  SUCCESS,
  FAILED
}

const compareTaskData = (task: Task, taskData: any) => {
  return (
    task.externalId === taskData.externalId &&
    task.title === taskData.title &&
    task.description === taskData.description &&
    task.complexityScore === taskData.complexityScore &&
    task.reputationLevel === taskData.reputationLevel &&
    moment.unix(task.dueDate).format('YYYY-MM-DD') === taskData.dueDate &&
    task.disableSelfAssign === taskData.disableSelfAssign &&
    task.taskTags?.map((t) => Number(t.id)).toString() ===
      taskData.taskTags?.toString()
  )
}

const EditProgressModal = ({
  organization,
  onClose,
  task,
  taskData,
  onError,
  onSuccess
}: EditProgressModalProps) => {
  const { t } = useTranslation('tasks')
  const { account, library } = useWeb3()
  const isApprover = account && organization?.approvers?.includes(account)
  const [updateStatus, setUpdateStatus] = useState(
    compareTaskData(task, taskData) ? Progress.SKIPPED : Progress.PENDING
  )
  const [updateInstructionsStatus, setUpdateInstructionStatus] = useState(
    taskData.instructions ? Progress.PENDING : Progress.SKIPPED
  )
  const { callAction, component } = useServerConfirmation({
    onError: () => setUpdateInstructionStatus(Progress.FAILED)
  })

  const beginActions = async () => {
    const errors: any[] = []
    if (updateStatus === Progress.PENDING) {
      try {
        await updateTask()
      } catch (error) {
        errors.push(error)
        throw errors
      }
    }

    if (updateInstructionsStatus === Progress.PENDING)
      await callAction(async () => await updateInstructions())

    if (errors.length) throw errors
  }

  const updateTask = async () => {
    try {
      setUpdateStatus(Progress.IN_PROGRESS)
      await editTask(
        {
          taskId: task.id,
          externalId: taskData.externalId || '',
          title: taskData.externalId ? '' : taskData.title,
          description: taskData.externalId ? '' : taskData.description,
          taskTags: taskData.taskTags,
          complexityScore: taskData.complexityScore,
          reputationLevel: taskData.reputationLevel,
          // End of day
          dueDate: moment(taskData.dueDate)
            .add(60 * 60 * 24 - 1, 'seconds')
            .unix(),
          disableSelfAssign: taskData.disableSelfAssign
        },
        library?.getSigner()
      )
      setUpdateStatus(Progress.SUCCESS)
    } catch (error: any) {
      setUpdateStatus(Progress.FAILED)
      console.error(error)
      throw t('task_not_updated')
    }
  }

  const updateInstructions = async () => {
    try {
      setUpdateInstructionStatus(Progress.IN_PROGRESS)
      await updateTaskInstructions(task.id, taskData.instructions || null)
      setUpdateInstructionStatus(Progress.SUCCESS)
    } catch (error: any) {
      setUpdateInstructionStatus(Progress.FAILED)
      console.error(error)
      throw t('task_instructions_not_updated')
    }
  }

  useEffect(() => {
    beginActions().catch((errors: any[]) => {
      if (errors.length > 0) {
        onError?.(errors)
      }
    })
  }, [])

  const getClassName = (status: Progress) => {
    switch (status) {
      case Progress.IN_PROGRESS:
        return 'w-2/3'
      case Progress.SUCCESS:
        return 'w-full'
      case Progress.FAILED:
        return 'w-0'
      default:
        return 'w-0'
    }
  }

  const getIcon = (status: Progress) => {
    switch (status) {
      case Progress.IN_PROGRESS:
        return <Spinner />
      case Progress.SUCCESS:
        return <CheckmarkIcon />
      case Progress.FAILED:
        return <ErrorIcon />
      default:
        return null
    }
  }

  let modalTitle = t('update_task')
  if (
    updateStatus === Progress.SUCCESS &&
    updateInstructionsStatus === Progress.IN_PROGRESS
  )
    modalTitle = t('update_task_instructions')

  const isSuccessful =
    updateStatus === Progress.SUCCESS &&
    (updateInstructionsStatus === Progress.SKIPPED ||
      updateInstructionsStatus === Progress.SUCCESS)

  return (
    <>
      {component}
      <div className='fixed w-full h-full bg-black/40 inset-0 z-[51]' />
      <div className='paper fixed px-10 py-8 w-[400px] max-w-[90%] z-[52] top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'>
        <div className='relative mb-5'>
          <button
            disabled={
              updateStatus === Progress.IN_PROGRESS ||
              updateInstructionsStatus === Progress.IN_PROGRESS
            }
            onClick={isSuccessful ? onSuccess : onClose}
            className='absolute top-0 -right-5'
          >
            <CloseIcon />
          </button>
          <p className='text-3xl text-center font-semibold'>{modalTitle}</p>
        </div>
        <div className='divider' />
        <ul className='mt-5'>
          <li>
            <div className='flex gap-x-4 items-center justify-between mb-2'>
              {t('update_task')}
              {updateStatus === Progress.SKIPPED ? (
                <span className='text-gray-500 text-xs'>{t('skipped')}</span>
              ) : (
                getIcon(updateInstructionsStatus)
              )}
            </div>
            <div className='w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700'>
              <div
                className={`bg-blue-600 h-2 rounded-full transition-all duration-500 ${getClassName(
                  updateStatus
                )}`}
              />
            </div>
          </li>
          <li className='mt-4'>
            <div className='flex gap-x-4 items-center justify-between mb-2'>
              {t('update_task_instructions')}
              {updateStatus === Progress.FAILED ||
              updateInstructionsStatus === Progress.SKIPPED ? (
                <span className='text-gray-500 text-xs'>{t('skipped')}</span>
              ) : updateInstructionsStatus === Progress.PENDING ? (
                <span className='text-gray-500 text-xs'>{t('pending')}</span>
              ) : (
                getIcon(updateInstructionsStatus)
              )}
            </div>
            <div className='w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700'>
              <div
                className={`bg-blue-600 h-2 rounded-full ${getClassName(
                  updateInstructionsStatus
                )}`}
              />
            </div>
          </li>
        </ul>
      </div>
    </>
  )
}

export default EditProgressModal
