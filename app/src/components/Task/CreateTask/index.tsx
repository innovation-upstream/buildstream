import CloseIcon from 'components/IconSvg/CloseIcon'
import Spinner from 'components/Spinner/Spinner'
import { useGetTasksQuery, useWeb3 } from 'hooks'
import {
  ComplexityScoreMap,
  TaskReputationMap,
  TaskReputation,
  ComplexityScore as ComplexityScores
} from 'hooks/task/types'
import {
  createNewTask,
  getRewardMultiplier,
  openTask
} from 'hooks/task/functions'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Badge from 'SVGs/Badge'
import ComplexityScore from 'SVGs/ComplexityScore'
import Duration from 'SVGs/Duration'
import Reputation from 'SVGs/Reputation'
import { TaskDurationCalc } from 'utils/task_duration'
import { StyledScrollableContainer } from './styled'
import TaskTagInput from './TaskTagInput'
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { ICreateTask } from './types'
import { BigNumber, ethers } from 'ethers'
import useTokenInfos from 'hooks/tokenInfo/useTokenInfos'
import toast, { Toaster } from 'react-hot-toast'
import useTokenInfo from 'hooks/tokenInfo/useTokenInfo'

const initialTaskData = {
  title: '',
  description: '',
  taskTags: [],
  complexityScore: 0,
  reputationLevel: TaskReputation.ENTRY,
  duration: 1
}
type TaskTypes = typeof initialTaskData & { [key: string]: any }

const taskComplexities = Object.entries(ComplexityScoreMap).filter(
  ([key]) =>
    parseInt(key) !== ComplexityScores.BEGINNER &&
    parseInt(key) != ComplexityScores.ADVANCED
)
const taskReputation = Object.entries(TaskReputationMap)

const CreateTask: React.FC<ICreateTask> = ({
  organization,
  close,
  onCreated
}) => {
  const [taskData, setTaskData] = useState<TaskTypes>(initialTaskData)
  const [status, setStatus] = useState({ text: '', error: false })
  const [creating, setCreating] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const { account, library } = useWeb3()
  const { t } = useTranslation('tasks')
  const formRef = useRef<HTMLFormElement>(null)
  const { tokenInfo } = useTokenInfo()
  const [rewardAmount, setRewardAmount] = useState(BigNumber.from(0))

  const handleChange = (ev: any) => {
    const targetName = ev.target.name
    let targetValue: string | number = ev.target.value

    if (
      ev.target.type === 'number' ||
      ['orgId', 'complexityScore', 'reputationLevel'].includes(targetName)
    ) {
      if (targetValue) {
        targetValue = Number(targetValue)
      }
    }

    setTaskData((prev) => ({ ...prev, [targetName]: targetValue }))

    if (targetName === 'complexityScore')
      getRewardAmount(Number(targetValue), taskData.taskTags)
  }
  const preventInvalidChar = (ev: any) =>
    ['e', 'E', '+', '-'].includes(ev.key) && ev.preventDefault()

  const createTask = async (publish = false) => {
    const form = formRef.current
    if (!form?.checkValidity()) {
      form?.reportValidity()
      return
    }
    if (!account) {
      toast.error(t('wallet_not_connected'), { icon: '⚠️' })
      return
    }

    const taskDuration = TaskDurationCalc.getDurationInSeconds({
      weeks: 0,
      days: taskData.duration,
      hours: 0
    })

    const treasuryBalance = organization?.treasury?.tokens?.find(
      (t) => t.token === tokenInfo?.address
    )
    if (publish && rewardAmount.gt(treasuryBalance?.balance || 0)) {
      toast.error(t('insufficient_treasury_balance'), { icon: '❌' })
      return
    }

    if (taskData.taskTags.length < 1) {
      toast.error(t('task_tags_not_add'), { icon: '⚠️' })
      return
    }

    if (publish) setPublishing(true)
    else setCreating(true)

    try {
      const taskId = await createNewTask(
        {
          externalId: '',
          orgId: organization.id,
          title: taskData.title,
          description: taskData.description,
          taskTags: taskData.taskTags,
          complexityScore: taskData.complexityScore,
          reputationLevel: taskData.reputationLevel,
          taskDuration
        },
        library.getSigner()
      )
      if (publish)
        await openTask(
          taskId,
          ethers.constants.AddressZero,
          false, // disableSelfAssign
          library.getSigner()
        )
      onCreated?.(taskId)
    } catch (error) {
      toast.error(t('task_not_created'), { icon: '❌' })
      console.error(error)
    } finally {
      setCreating(false)
      setPublishing(false)
    }
  }

  const isApprover = account && organization?.approvers?.includes(account)
  const rewardAmountValue = ethers.utils.formatUnits(
    rewardAmount.toString(),
    tokenInfo?.decimal
  )

  const getRewardAmount = async (complexity: number, tags: number[]) => {
    let amount = BigNumber.from(0)
    try {
      const multiplier = await getRewardMultiplier(
        organization.id,
        tags,
        library.getSigner()
      )
      amount = multiplier.mul(complexity + 1)
    } catch (error) {
      console.error(error)
    }
    setRewardAmount(amount)
  }

  useEffect(() => {
    getRewardAmount(taskData.complexityScore, taskData.taskTags)
    const body = document.body
    body.style.overflow = 'hidden'

    return () => {
      body.style.overflow = 'auto'
    }
  }, [])

  return (
    <div className='layout-container flex justify-center items-center overflow-x-hidden overflow-hidden fixed inset-0 outline-none focus:outline-none z-50'>
      <Toaster position='bottom-left' />
      <div className='relative w-full h-full my-6 mx-auto z-50 overflow-hidden'>
        <div className='paper w-full md:w-1/2 h-[95vh] px-2 py-5 absolute right-0 top-0 rounded-xl my-5 overflow-hidden'>
          <div className='px-6 w-full'>
            <section className='flex justify-between border border-t-0 border-r-0 border-l-0 pb-3'>
              <span className='block font-bold text-2xl'>
                {t('create_new_task')}
              </span>
              <button onClick={close}>
                <CloseIcon />
              </button>
            </section>
          </div>
          <form
            ref={formRef}
            onSubmit={(e) => e.preventDefault()}
            className=' h-full w-full flex flex-col'
          >
            <StyledScrollableContainer className='overflow-auto h-full pb-4 px-6 flex-1'>
              <section className='py-4 border border-t-0 border-r-0 border-l-0'>
                <span className='block text-xl font-medium'>
                  {t('task_description')}
                </span>
                <div className='mt-4'>
                  <label
                    htmlFor='title'
                    className='block mb-2 text-grey-900 opacity-80'
                  >
                    {t('task_name')}
                  </label>
                  <input
                    type='text'
                    id='title'
                    name='title'
                    value={taskData.title}
                    onChange={handleChange}
                    className='w-full border p-2 rounded-md focus:outline-none'
                    required
                  />
                </div>
                <div className='w-full p-3 bg-gray-100 border mt-3 rounded-xl'>
                  <label
                    htmlFor='description'
                    className='block text-gray-500 mb-1'
                  >
                    {t('task_description')}
                  </label>
                  <textarea
                    id='description'
                    name='description'
                    value={taskData.description}
                    onChange={handleChange}
                    rows={5}
                    className='rounded-md p-2 border border-gray-200 w-full focus:outline-none resize-none'
                    required
                  ></textarea>
                </div>
              </section>
              <section className='py-4'>
                <span className='block text-xl font-medium'>
                  {t('general_task_settings')}
                </span>
                <div className='mt-3 flex flex-col gap-6'>
                  <div className=''>
                    <label
                      htmlFor='duration'
                      className='flex gap-2 items-center mb-2 cursor-pointer max-w-xs'
                      data-tooltip-id='durationTip'
                      data-tooltip-content={t('expected_duration')}
                    >
                      <ReactTooltip id='durationTip' />
                      <span className='block'>
                        <Duration />
                      </span>
                      <span className='block text-gray-700'>
                        {t('set_duration')}
                      </span>
                    </label>
                    <div className='w-full border p-2 rounded-md flex items-center'>
                      <input
                        type='number'
                        id='duration'
                        name='duration'
                        min='1'
                        onKeyDown={preventInvalidChar}
                        value={taskData.duration}
                        onChange={handleChange}
                        className='overflow-hidden focus:outline-none w-full'
                        required
                      />
                    </div>
                  </div>
                  <div className=''>
                    <label
                      htmlFor='reputationLevel'
                      className='flex gap-2 items-center cursor-pointer max-w-xs'
                      data-tooltip-id='reputationTip'
                    >
                      <ReactTooltip
                        place='top'
                        id='reputationTip'
                        className='max-w-xs'
                      >
                        <div>{t('expected_reputation')}</div>
                      </ReactTooltip>
                      <span className='block'>
                        <Reputation />
                      </span>
                      <span className='block text-gray-700'>
                        {t('reputation')}
                      </span>
                    </label>

                    <div className='flex gap-x-3 gap-y-4 py-4 flex-wrap'>
                      {taskReputation.map(([key, value]) => {
                        return (
                          <span key={`task-reputation${key}`}>
                            <input
                              type='radio'
                              id={`task-reputation${key}`}
                              value={parseInt(key)}
                              name='reputationLevel'
                              className='hidden peer'
                              onChange={handleChange}
                              checked={
                                taskData.reputationLevel === parseInt(key)
                              }
                            />
                            <label
                              htmlFor={`task-reputation${key}`}
                              className='cursor-pointer w-[max-content] border text-sm text-center px-4 py-1 rounded-lg focus:bg-blue-700 peer-checked:bg-blue-700 peer-checked:text-white peer-checked:font-medium peer-checked:font-semibold border-b-[1px] border-gray peer-checked:border-blue-500'
                            >
                              <span>{value.toUpperCase()}</span>
                            </label>
                          </span>
                        )
                      })}
                    </div>
                  </div>
                  <div className=''>
                    <label
                      htmlFor='complexityScore'
                      className='flex gap-2 items-center cursor-pointer max-w-xs'
                      data-tooltip-id='complexityScoreTip'
                      data-tooltip-content={t('expected_complexity_level')}
                    >
                      <ReactTooltip id='complexityScoreTip' />
                      <span className='block'>
                        <ComplexityScore />
                      </span>
                      <span className='block text-gray-700'>
                        {t('complexity_score')}
                      </span>
                    </label>
                    <div className='flex gap-x-3 gap-y-4 py-4 flex-wrap'>
                      {taskComplexities.slice(0, 4).map(([key, value]) => {
                        return (
                          <span key={value}>
                            <input
                              type='radio'
                              id={value}
                              value={parseInt(key)}
                              name='complexityScore'
                              className='hidden peer'
                              onChange={handleChange}
                              checked={
                                taskData.complexityScore === parseInt(key)
                              }
                            />
                            <label
                              htmlFor={value}
                              className='cursor-pointer w-[max-content] border text-sm text-center px-4 py-1 rounded-lg focus:bg-blue-700 peer-checked:bg-blue-700 peer-checked:text-white peer-checked:font-medium peer-checked:font-semibold border-b-[1px] border-gray peer-checked:border-blue-500'
                            >
                              <span>{value.toUpperCase()}</span>
                            </label>
                          </span>
                        )
                      })}
                    </div>
                  </div>
                </div>
                <div className='mt-3'>
                  <TaskTagInput
                    tags={taskData.taskTags}
                    updateTags={(tags) => {
                      setTaskData((prev: any) => ({ ...prev, taskTags: tags }))
                      getRewardAmount(taskData.complexityScore, tags)
                    }}
                  />
                </div>
              </section>
              <section className='pb-4 border border-t-0 border-r-0 border-l-0'>
                <div className='block text-base font-normal text-gray-600'>
                  <span>{t('provide_instructions_for_contributors')}</span>
                  <span className='text-sm text-gray-500'>
                    {t('contribution_information_hint')}
                  </span>
                  <span>{t('for_contributor')} </span>
                </div>
                <div className='mt-3'>
                  <span className='block mb-2'>
                    {t('enter_slack_channel_link')}
                  </span>
                  <div className='w-full px-4 py-2 border rounded-md flex items-center mt-2'>
                    <input type='text' className='w-full focus:outline-none' />
                  </div>
                </div>
              </section>
              <section className='py-4'>
                <span className='block text-xl font-medium'>
                  {t('task_reward')}
                </span>
                <div className='mt-4'>
                  <label
                    htmlFor='reward_token'
                    className='mb-2 mr-2 text-grey-900 opacity-80'
                  >
                    {t('token')}:
                  </label>
                  {tokenInfo?.symbol}
                </div>
                <div className='mt-4'>
                  <label
                    htmlFor='reward_amount'
                    className='mb-2 mr-2 text-grey-900 opacity-80'
                  >
                    {t('amount')}:
                  </label>
                  {rewardAmountValue}
                </div>
              </section>
            </StyledScrollableContainer>
            <section className='mt-4 flex flex-col md:flex-row items-center gap-4 flex-0 pb-10 px-6'>
              {isApprover && (
                <button
                  className='btn-outline'
                  type='submit'
                  disabled={publishing || creating}
                  name='publish_task'
                  onClick={() => createTask(true)}
                >
                  {publishing ? <Spinner width={30} /> : t('publish_task')}
                </button>
              )}
              <button
                className='btn-primary'
                type='submit'
                disabled={creating || publishing}
                name='save_draft'
                onClick={() => createTask()}
              >
                {creating ? <Spinner width={30} /> : t('save_draft')}
              </button>
              <button
                className='btn-outline px-8 border-gray-200 hover:border-gray-300'
                onClick={close}
              >
                {t('close')}
              </button>
            </section>
          </form>
        </div>
      </div>
      <div className='fixed bg-black opacity-50 inset-0'></div>
    </div>
  )
}

export default CreateTask
