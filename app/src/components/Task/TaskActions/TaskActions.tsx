import Spinner from 'components/Spinner/Spinner'
import { Task } from 'graphclient'
import { useWeb3 } from 'hooks'
import { archiveTask, assignToSelf, openTask } from 'hooks/task/functions'
import { TaskStatusMap } from 'hooks/task/types'
import { useTranslation } from 'next-i18next'
import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

interface IProps {
  task: Task
}

const TaskActions: React.FC<IProps> = ({ task }) => {
  const taskStatus = Object.entries(TaskStatusMap)[task?.status ?? 0]?.[1]
  const [processing, setProcessing] = useState(false)
  const [processArchive, setProcessArchive] = useState(false)
  const { account, library } = useWeb3()
  const [tempTaskStatus, setTempTaskStatus] = useState(taskStatus)
  const { t } = useTranslation('tasks')

  const openCreatedTask = async () => {
    if (!account) {
      toast.error(t('wallet_not_connected'), { icon: '⚠️' })
      return
    }
    setProcessing(true)
    try {
      await openTask(parseInt(task.id), task.rewardToken, library.getSigner())
      setProcessing(false)
      setTempTaskStatus('open')
    } catch (e) {
      toast.error(t('error_opening_task'), { icon: '❌' })
      setProcessing(false)
      console.error('ERROR===', e)
    }
  }

  const requestAssignment = async () => {
    if (!account) {
      toast.error(t('wallet_not_connected'), { icon: '⚠️' })
      return
    }
    setProcessing(true)
    try {
      setProcessing(true)
      await assignToSelf(parseInt(task.id), library.getSigner())
      setProcessing(false)
      setTempTaskStatus('assigned')
    } catch (e) {
      toast.error(t('error_requesting_assignment'), { icon: '❌' })
      setProcessing(false)
      console.error('ERROR===', e)
    }
  }

  const archiveCurrentTask = async () => {
    if (!account) {
      toast.error(t('wallet_not_connected'), { icon: '⚠️' })
      return
    }
    setProcessArchive(true)
    try {
      const tx = await archiveTask(parseInt(task.id), library.getSigner())
      setProcessArchive(false)
      if (tx) close()
    } catch (e) {
      toast.error(t('error_archiving_task'), { icon: '❌' })
      setProcessArchive(false)
      console.error(e)
    }
  }

  const taskAction = async () => {
    if (tempTaskStatus === 'proposed') {
      await openCreatedTask()
    }
    if (tempTaskStatus === 'open') {
      await requestAssignment()
    }
    close()
    return null
  }

  const buttonText =
    tempTaskStatus === 'proposed' ? t('open_task') : t('request_assignment')

  return (
    <div
      className={`paper mt-4 ${
        tempTaskStatus === 'assigned' ? 'hidden' : 'block'
      }`}
    >
      <Toaster position='bottom-left' />

      <div className='flex flex-col md:flex-row flex-col-reverse items-center gap-4 flex-0'>
        {!processing ? (
          <button
            className='btn-primary min-w-full md:min-w-[30%]'
            disabled={processing}
            onClick={taskAction}
          >
            {buttonText}
          </button>
        ) : (
          <Spinner width={30} />
        )}

        {tempTaskStatus === 'open' && (
          <button
            className='bg-rose-400 hover:bg-rose-300 text-white flex justify-center min-w-full md:min-w-[30%] py-3 px-4 font-semibold rounded-lg'
            onClick={archiveCurrentTask}
          >
            {processArchive ? (
              <Spinner className='text-white' />
            ) : (
              t('archive_task')
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default TaskActions
