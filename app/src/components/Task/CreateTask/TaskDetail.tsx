import CloseIcon from 'components/IconSvg/CloseIcon'
import Spinner from 'components/Spinner/Spinner'
import { BigNumber, ethers } from 'ethers'
import { useGetTaskQuery, useGetTasksQuery, useWeb3 } from 'hooks'
import {
  archiveTask,
  assignToSelf,
  getRewardAmount,
  getRewardMultiplier,
  openTask
} from 'hooks/task/functions'
import { ComplexityScoreMap, TaskStatus, TaskStatusMap } from 'hooks/task/types'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Badge from 'SVGs/Badge'
import Bag from 'SVGs/Bag'
import ComplexityScore from 'SVGs/ComplexityScore'
import Duration from 'SVGs/Duration'
import Reputation from 'SVGs/Reputation'
import Rewards from 'SVGs/Rewards'
import TokenGeneric from 'SVGs/TokenGeneric'
import { TaskDurationCalc } from 'utils/task_duration'
import { ITaskDetail } from './types'
import { StyledScrollableContainer } from './styled'
import toast, { Toaster } from 'react-hot-toast'
import useTokenInfo from 'hooks/tokenInfo/useTokenInfo'

const taskComplexities = Object.entries(ComplexityScoreMap)

const TaskDetail: React.FC<ITaskDetail> = ({ task, close }) => {
  const [processing, setProcessing] = useState(false)
  const [processArchive, setProcessArchive] = useState(false)
  const { account, library } = useWeb3()
  const taskStatus = Object.entries(TaskStatusMap)[task?.status ?? 0]?.[1]
  const { t } = useTranslation('tasks')
  const { tokenInfo } = useTokenInfo()
  const [rewardAmount, setRewardAmount] = useState(BigNumber.from(0))
  const [rewardValue, setRewardValue] = useState('0')

  const getReward = useCallback(async () => {
    const reward = await getRewardAmount(task, library?.getSigner())
    setRewardAmount(reward)
    setRewardValue(ethers.utils.formatEther(reward.toString()).toString())
  }, [task.taskTags.toString(), library])

  useEffect(() => {
    getReward()
  }, [getReward])

  const openCreatedTask = async () => {
    if (!account) {
      toast.error(t('wallet_not_connected'), { icon: '⚠️' })
      return
    }
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
      setProcessing(false)
      console.error('ERROR===', e)
      toast.error(t('error_opening_task'), { icon: '❌' })
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
      await assignToSelf(task.id, library.getSigner())
      setProcessing(false)
    } catch (e) {
      setProcessing(false)
      console.error('ERROR===', e)
      toast.error(t('error_requesting_assignment'), { icon: '❌' })
    }
  }

  const archiveCurrentTask = async () => {
    if (!account) {
      toast.error(t('wallet_not_connected'), { icon: '⚠️' })
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
      toast.error(t('error_archiving_task'), { icon: '❌' })
    }
  }

  const taskAction = async () => {
    if (taskStatus === 'proposed') {
      await openCreatedTask()
    }
    if (taskStatus === 'open') {
      await requestAssignment()
    }
    close()
    return null
  }

  const buttonText =
    taskStatus === 'proposed' ? t('open_task') : t('request_assignment')

  useEffect(() => {
    const body = document.body
    body.style.overflow = 'hidden'

    return () => {
      body.style.overflow = 'auto'
    }
  }, [])

  const isApprover = account && task?.organization?.approvers?.includes(account)

  return (
    <div className='layout-container p-0 md:px-4 flex justify-center items-center overflow-x-hidden overflow-hidden fixed inset-0 outline-none focus:outline-none z-50'>
      <Toaster position='bottom-left' />
      <div className='relative w-full h-full my-6 mx-auto z-50 overflow-hidden'>
        <div className='paper w-full md:w-1/2 h-[100vh] md:h-[95vh] px-0 md:px-2 absolute right-0 top-0 rounded-none md:rounded-2xl md:my-5 overflow-hidden'>
          <div className='md:px-6 w-full px-0 md:px-3'>
            <section className='flex justify-between border border-t-0 border-r-0 border-l-0 pb-3 px-3 md:px-0'>
              <span className='block font-bold text-2xl'>
                {t('task_details')}
              </span>
              <button onClick={close}>
                <CloseIcon />
              </button>
            </section>
          </div>
          <div className=' h-full w-full flex flex-col'>
            <StyledScrollableContainer className='overflow-auto h-full pb-4 px-3 md:px-6 flex-1'>
              <section className='pt-5 pb-4'>
                <span className='block text-lg font-medium font-bold text-[#42A5AF]'>
                  {t('id')}: {task?.id}
                </span>
                <div className='text-2xl font-semibold'>{task?.title}</div>
              </section>
              <section className='py-4 border-t'>
                <ul className='list-none flex flex-col gap-6 pb-2'>
                  <li className='flex gap-8 items-center'>
                    <div className='flex items-center w-28 md:w-32 gap-2'>
                      <Bag />
                      <span className='block text-[#646873] text-sm md:text-base'>
                        {t('organization')}
                      </span>
                    </div>
                    <div>
                      <span className='block font-bold text-sm md:text-base'>
                        {task.organization.name}
                      </span>
                    </div>
                  </li>
                  <li className='flex gap-8 items-center'>
                    <div className='flex items-center w-28 md:w-32 gap-2'>
                      <Duration width={18} />
                      <span className='block text-[#646873] text-sm md:text-base'>
                        {t('duration')}
                      </span>
                    </div>
                    <div>
                      <span className='block font-bold text-sm md:text-base'>
                        {TaskDurationCalc.getDurationInDays(
                          task?.taskDuration ?? 0
                        )}{' '}
                        {t('days')}
                      </span>
                    </div>
                  </li>
                  <li className='flex gap-8 items-center'>
                    <div className='flex items-center w-28 md:w-32 gap-2'>
                      <ComplexityScore width={18} />
                      <span className='block text-[#646873 text-sm md:text-base]'>
                        {t('complexity')}
                      </span>
                    </div>
                    <div>
                      <span className='block font-bold text-sm md:text-base capitalize'>
                        {taskComplexities[task?.complexityScore ?? 0][1]}
                      </span>
                    </div>
                  </li>
                  <li className='flex gap-8 items-center'>
                    <div className='flex items-center w-28 md:w-32 gap-2'>
                      <Reputation />
                      <span className='block text-[#646873] text-sm md:text-base'>
                        {t('reputation')}
                      </span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <span>
                        <Badge />
                      </span>
                      <span className='block font-bold text-sm md:text-base'>
                        {task?.reputationLevel}
                      </span>
                    </div>
                  </li>
                  <li className='flex gap-8 items-center'>
                    <div className='flex items-center w-28 md:w-32 gap-2'>
                      <Rewards />
                      <span className='block text-sm md:text-base text-[#646873]'>
                        {t('reward')}
                      </span>
                    </div>
                    <div className='flex items-center gap-1 bg-[#DBF0D3] px-2 py-1 rounded-3xl'>
                      <span>
                        <TokenGeneric width={10} />
                      </span>
                      <span className='block font-bold text-sm md:text-base'>
                        {rewardValue} {tokenInfo?.symbol}
                      </span>
                    </div>
                  </li>
                  <li className='flex flex-col lg:flex-row gap-2 lg:gap-8 items-center'>
                    <div className='flex items-center w-full lg:w-32 gap-2'>
                      <span className='block text-[#646873]'>
                        {t('required_skills')}
                      </span>
                    </div>
                    <div className='flex items-center gap-1 w-full flex-wrap'>
                      {task?.taskTags.map((t) => {
                        return (
                          <div
                            key={t.id}
                            className='rounded-md py-1 px-2 bg-[#F4F5F8] flex gap-3 items-center flex-wrap'
                          >
                            {t.name}
                          </div>
                        )
                      })}
                    </div>
                  </li>
                </ul>
              </section>
            </StyledScrollableContainer>
            {task.status < TaskStatus.CLOSED && (
              <section className='mt-4 flex flex-col md:flex-row flex-col-reverse items-center gap-4 flex-0 pb-10 px-3 md:px-6'>
                {task.assignmentRequests.length === 0 && (
                  <>
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
                  </>
                )}
                {isApprover && taskStatus === 'open' && (
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
                <button
                  className='btn-outline px-8 w-full md:w-auto border-gray-200 hover:border-gray-300'
                  onClick={close}
                >
                  {t('close')}
                </button>
              </section>
            )}
          </div>
        </div>
      </div>
      <div className='fixed bg-black opacity-50 inset-0'></div>
    </div>
  )
}

export default TaskDetail
