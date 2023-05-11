import Spinner from 'components/Spinner/Spinner'
import { useWeb3 } from 'hooks'
import {
  archiveTask,
  assignToSelf,
  getRewardAmount,
  openTask
} from 'hooks/task/functions'
import { Task, TaskStatus } from 'hooks/task/types'
import useTokenInfo from 'hooks/tokenInfo/useTokenInfo'
import { useTranslation } from 'next-i18next'
import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

interface IProps {
  task: Task
}

const TaskActions: React.FC<IProps> = ({ task }) => {
  const [processing, setProcessing] = useState(false)
  const [processArchive, setProcessArchive] = useState(false)
  const { account, library } = useWeb3()
  const { t } = useTranslation('tasks')
  const { tokenInfo } = useTokenInfo()

  const publishTask = async () => {
    if (!account) {
      toast.error(t('wallet_not_connected'), { icon: '⚠️' })
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
    } catch (e) {
      toast.error(t('error_opening_task'), { icon: '❌' })
      setProcessing(false)
      console.error('ERROR===', e)
    }
    close()
  }

  const requestAssignment = async () => {
    if (!account) {
      toast.error(t('wallet_not_connected'), { icon: '⚠️' })
      return
    }
    setProcessing(true)
    try {
      setProcessing(true)
      await assignToSelf(task.id, library.getSigner())
      setProcessing(false)
      close()
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
      await archiveTask(task.id, library.getSigner())
      setProcessArchive(false)
      close()
    } catch (e) {
      toast.error(t('error_archiving_task'), { icon: '❌' })
      setProcessArchive(false)
      console.error(e)
    }
  }

  const isApprover = account && task.organization.approvers.includes(account)

  if (task.status >= TaskStatus.ASSIGNED) return null

  return (
    <div
      className={`paper mt-4 ${
        task?.status === TaskStatus.ASSIGNED ? 'hidden' : 'block'
      }`}
    >
      <Toaster position='bottom-left' />

      <div className='flex flex-col md:flex-row flex-col-reverse items-center gap-4 flex-0'>
        {!processing && task.status === TaskStatus.PROPOSED && isApprover && (
          <button
            className='btn-primary min-w-full md:min-w-[30%]'
            disabled={processing}
            onClick={publishTask}
          >
            {t('open_task')}
          </button>
        )}
        {!processing &&
          task.status === TaskStatus.OPEN &&
          account &&
          !task.assignmentRequests.includes(account) && (
            <button
              className='btn-primary min-w-full md:min-w-[30%]'
              disabled={processing}
              onClick={requestAssignment}
            >
              {t('request_assignment')}
            </button>
          )}
        {processing && <Spinner width={30} />}
        {task?.status === TaskStatus.OPEN && isApprover && (
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
