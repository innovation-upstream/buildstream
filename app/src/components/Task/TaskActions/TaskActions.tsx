import Spinner from 'components/Spinner/Spinner'
import { useWeb3 } from 'hooks'
import {
  archiveTask,
  assignToSelf,
  getRewardAmount,
  openTask
} from 'hooks/task/functions'
import { Task, TaskStatusMap } from 'hooks/task/types'
import useTokenInfo from 'hooks/tokenInfo/useTokenInfo'
import { useTranslation } from 'next-i18next'
import React, { useState } from 'react'

interface IProps {
  task: Task
}

const TaskActions: React.FC<IProps> = ({ task }) => {
  const taskStatus = Object.entries(TaskStatusMap)[task?.status ?? 0]?.[1]
  const [processing, setProcessing] = useState(false)
  const [processArchive, setProcessArchive] = useState(false)
  const [status, setStatus] = useState({ text: '', error: false })
  const { account, library } = useWeb3()
  const [tempTaskStatus, setTempTaskStatus] = useState(taskStatus)
  const { t } = useTranslation('tasks')
  const { tokenInfo } = useTokenInfo()

  const openCreatedTask = async () => {
    if (!account) {
      setStatus({ text: t('wallet_not_connected'), error: true })
      return
    }
    const rewardAmount = await getRewardAmount(task, library?.getSigner())
    const treasuryBalance = task?.organization?.treasury?.tokens?.find(
      (t) => t.token === tokenInfo?.address
    )
    if (rewardAmount.gt(treasuryBalance?.balance || 0)) {
      setStatus({ text: t('insufficient_treasury_balance'), error: true })
      return
    }
    setProcessing(true)
    try {
      await openTask(
        task.id,
        task.rewardToken,
        false, //disableSelfAssign
        library.getSigner()
      )
      setProcessing(false)
      setTempTaskStatus('open')
    } catch (e) {
      setStatus({ text: t('error_opening_task'), error: true })
      setProcessing(false)
      console.error('ERROR===', e)
    }
  }

  const requestAssignment = async () => {
    if (!account) {
      setStatus({ text: t('wallet_not_connected'), error: true })
      return
    }
    setProcessing(true)
    try {
      setProcessing(true)
      await assignToSelf(task.id, library.getSigner())
      setProcessing(false)
      setTempTaskStatus('assigned')
    } catch (e) {
      setStatus({ text: t('error_requesting_assignment'), error: true })
      setProcessing(false)
      console.error('ERROR===', e)
    }
  }

  const archiveCurrentTask = async () => {
    if (!account) {
      setStatus({ text: t('wallet_not_connected'), error: true })
      return
    }
    setProcessArchive(true)
    try {
      const tx = await archiveTask(task.id, library.getSigner())
      setProcessArchive(false)
      if (tx) close()
    } catch (e) {
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
      {status.error && (
        <div
          className={`w-full mx-auto leading-relaxed text-base my-4 ${
            status.error ? 'text-red-500' : 'text-green-500'
          }`}
        >
          {status.text}
        </div>
      )}

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
