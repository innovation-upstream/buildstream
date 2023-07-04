import CloseIcon from 'components/IconSvg/CloseIcon'
import Spinner from 'components/Spinner/Spinner'
import { useWeb3 } from 'hooks'
import useServerConfirmation from 'hooks/auth/useServerConfirmation'
import { Organization } from 'hooks/organization/types'
import {
  createNewTask,
  openTask,
  updateTaskInstructions
} from 'hooks/task/functions'
import moment from 'moment'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import { CheckmarkIcon, ErrorIcon } from 'react-hot-toast'

interface ProgressModalProps {
  organization: Organization
  onClose?: () => void
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

const ProgressModal = ({
  organization,
  onClose,
  taskData,
  onError,
  onSuccess
}: ProgressModalProps) => {
  const { t } = useTranslation('tasks')
  const { account, library } = useWeb3()
  const isApprover = account && organization?.approvers?.includes(account)
  const [createStatus, setCreateStatus] = useState(Progress.PENDING)
  const [updateInstructionsStatus, setUpdateInstructionStatus] = useState(
    isApprover && taskData.instructions ? Progress.PENDING : Progress.SKIPPED
  )
  const [publishStatus, setPublishStatus] = useState(
    isApprover && taskData.publish ? Progress.PENDING : Progress.SKIPPED
  )
  const { callAction, component } = useServerConfirmation({
    onError: () => setUpdateInstructionStatus(Progress.FAILED)
  })

  const beginActions = async () => {
    let taskId: number | undefined
    const errors: any[] = []
    try {
      taskId = await createTask()
    } catch (error) {
      errors.push(error)
      throw errors
    }

    if (!taskId) return

    if (publishStatus === Progress.PENDING)
      try {
        await publishTask(taskId as number)
      } catch (error) {
        errors.push(error)
      }

    if (updateInstructionsStatus === Progress.PENDING)
      await callAction(async () => await updateInstructions(taskId as number))

    if (errors.length) throw errors
  }

  const createTask = async (): Promise<number | undefined> => {
    try {
      setCreateStatus(Progress.IN_PROGRESS)
      const taskId = await createNewTask(
        {
          externalId: taskData.externalId || '',
          orgId: organization.id,
          title: taskData.externalId ? '' : taskData.title,
          description: taskData.externalId ? '' : taskData.description,
          taskTags: taskData.taskTags,
          complexityScore: taskData.complexityScore,
          reputationLevel: taskData.reputationLevel,
          // End of day
          dueDate: moment(taskData.dueDate)
            .add(60 * 60 * 60 - 1, 'seconds')
            .unix(),
          disableSelfAssign: taskData.disableSelfAssign
        },
        library.getSigner()
      )
      setCreateStatus(Progress.SUCCESS)
      return taskId
    } catch (error: any) {
      setCreateStatus(Progress.FAILED)
      console.error(error)
      throw t('task_not_created')
    }
  }

  const updateInstructions = async (taskId: number) => {
    try {
      setUpdateInstructionStatus(Progress.IN_PROGRESS)
      await updateTaskInstructions(taskId, taskData.instructions || null)
      setUpdateInstructionStatus(Progress.SUCCESS)
    } catch (error: any) {
      setUpdateInstructionStatus(Progress.FAILED)
      console.error(error)
      throw t('task_instructions_not_updated')
    }
  }

  const publishTask = async (taskId: number) => {
    try {
      setPublishStatus(Progress.IN_PROGRESS)
      await openTask(taskId, taskData.disableSelfAssign, library.getSigner())
      setPublishStatus(Progress.SUCCESS)
    } catch (error: any) {
      setPublishStatus(Progress.FAILED)
      console.error(error)
      throw t('error_opening_task')
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

  let modalTitle = t('create_task')
  if (
    createStatus === Progress.SUCCESS &&
    updateInstructionsStatus === Progress.IN_PROGRESS
  )
    modalTitle = t('update_task_instructions')
  if (
    createStatus === Progress.SUCCESS &&
    updateInstructionsStatus === Progress.SUCCESS &&
    publishStatus === Progress.IN_PROGRESS
  )
    modalTitle = t('publish_task')

  const isSuccessful =
    createStatus === Progress.SUCCESS &&
    (updateInstructionsStatus === Progress.SKIPPED ||
      updateInstructionsStatus === Progress.SUCCESS) &&
    (publishStatus === Progress.SKIPPED || publishStatus === Progress.SUCCESS)

  return (
    <>
      {component}
      <div className='fixed w-full h-full bg-black/40 inset-0 z-[51]' />
      <div className='paper fixed px-10 py-8 w-[400px] max-w-[90%] z-[52] top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'>
        <div className='relative mb-5'>
          <button
            disabled={
              createStatus === Progress.IN_PROGRESS ||
              updateInstructionsStatus === Progress.IN_PROGRESS ||
              publishStatus === Progress.IN_PROGRESS
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
              {t('create_task')}
              {getIcon(createStatus)}
            </div>
            <div className='w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700'>
              <div
                className={`bg-blue-600 h-2 rounded-full transition-all duration-500 ${getClassName(
                  createStatus
                )}`}
              />
            </div>
          </li>
          <li className='mt-4'>
            <div className='flex gap-x-4 items-center justify-between mb-2'>
              {t('update_task_instructions')}
              {createStatus === Progress.FAILED ||
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
          <li className='mt-4'>
            <div className='flex gap-x-4 items-center justify-between mb-2'>
              {t('publish_task')}
              {createStatus === Progress.FAILED ||
              publishStatus === Progress.SKIPPED ? (
                <span className='text-gray-500 text-xs'>{t('skipped')}</span>
              ) : publishStatus === Progress.PENDING ? (
                <span className='text-gray-500 text-xs'>{t('pending')}</span>
              ) : (
                getIcon(publishStatus)
              )}
            </div>
            <div className='w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700'>
              <div
                className={`bg-blue-600 h-2 rounded-full ${getClassName(
                  publishStatus
                )}`}
              />
            </div>
          </li>
        </ul>
      </div>
    </>
  )
}

export default ProgressModal
