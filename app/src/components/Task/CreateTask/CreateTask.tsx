import Duration from 'SVGs/Duration'
import Reputation from 'SVGs/Reputation'
import CloseIcon from 'components/IconSvg/CloseIcon'
import MarkDownEditor from 'components/MarkDownEditor/MarkDownEditor'
import Reward from 'components/Reward/Reward'
import { BigNumber, ethers } from 'ethers'
import { useWeb3 } from 'hooks'
import { getRewardMultiplier } from 'hooks/task/functions'
import {
  ComplexityScoreMap,
  ComplexityScore as ComplexityScores,
  TaskReputation,
  TaskReputationMap,
} from 'hooks/task/types'
import useTokenInfo from 'hooks/tokenInfo/useTokenInfo'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import ProgressModal from '../ProgressModal/ProgressModal'
import TaskTagInput from './TaskTagInput'
import { StyledScrollableContainer } from './styled'
import { ICreateTask } from './types'

const initialTaskData = {
  title: '',
  description: '',
  taskTags: [],
  complexityScore: 0,
  reputationLevel: TaskReputation.ENTRY,
  dueDate: moment().add(1, 'days').format('YYYY-MM-DD'),
  disableSelfAssign: false,
  instructions: '',
  publish: false,
}
type TaskTypes = typeof initialTaskData & { [key: string]: any }

const taskComplexities = Object.entries(ComplexityScoreMap).filter(
  ([key]) =>
    parseInt(key) !== ComplexityScores.BEGINNER &&
    parseInt(key) != ComplexityScores.ADVANCED
)
const taskReputation = Object.entries(TaskReputationMap)
const instructionsTemplate = `
  **Communication channel**: 

  **link/instructions**: 

  **Code Repo/Figma/etc links**: 

  **Onboarding instructions**: 
`

const CreateTask: React.FC<ICreateTask> = ({
  organization,
  close,
  onCreated,
}) => {
  const [taskData, setTaskData] = useState<TaskTypes>(initialTaskData)
  const { account, library } = useWeb3()
  const { t } = useTranslation('tasks')
  const formRef = useRef<HTMLFormElement>(null)
  const { tokenInfo } = useTokenInfo()
  const [rewardAmount, setRewardAmount] = useState(BigNumber.from(0))
  const [showRewardSettings, setShowRewardSettings] = useState(false)
  const [showProgressModal, setShowProgressModal] = useState(false)

  const handleChange = (ev: any) => {
    const targetName = ev.target.name
    let targetValue: string | number | boolean = ev.target.value

    if (
      ev.target.type === 'number' ||
      ['orgId', 'complexityScore', 'reputationLevel'].includes(targetName)
    ) {
      if (targetValue) {
        targetValue = Number(targetValue)
      }
    }

    if (targetName === 'disableSelfAssign')
      return setTaskData((prev) => ({
        ...prev,
        [targetName]: !prev.disableSelfAssign,
      }))

    if (targetName === 'instructions' && targetValue === instructionsTemplate)
      targetValue = ''

    setTaskData((prev) => ({ ...prev, [targetName]: targetValue }))

    if (targetName === 'complexityScore')
      getRewardAmount(Number(targetValue), taskData.taskTags)
  }

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

    setTaskData((prev) => ({ ...prev, publish }))
    setShowProgressModal(true)
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

  const rewardUsd = parseFloat(rewardAmountValue) * (tokenInfo?.priceUsd || 0)

  return (
    <div className='layout-container flex justify-center items-center overflow-x-hidden overflow-hidden fixed inset-0 outline-none focus:outline-none z-50'>
      <Toaster position='bottom-left' />
      {showProgressModal && (
        <ProgressModal
          organization={organization}
          taskData={taskData}
          onClose={() => setShowProgressModal(false)}
          onError={(err) => {
            err.forEach((e) => toast.error(e, { icon: '❌' }))
          }}
          onSuccess={() => {
            setShowProgressModal(false)
            close()
          }}
        />
      )}
      {showRewardSettings && (
        <Reward
          organization={organization}
          showAsModal
          onClose={() => setShowRewardSettings(false)}
          onRewardChange={() => {
            getRewardAmount(taskData.complexityScore, taskData.taskTags)
            setShowRewardSettings(false)
          }}
        />
      )}
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
                  />
                </div>
                <div className='mt-4'>
                  <TaskTagInput
                    tags={taskData.taskTags}
                    updateTags={(tags) => {
                      setTaskData((prev: any) => ({ ...prev, taskTags: tags }))
                      getRewardAmount(taskData.complexityScore, tags)
                    }}
                  />
                </div>
              </section>
              <section className='border-b py-4'>
                <span className='block text-xl font-medium'>
                  {t('general_task_settings')}
                </span>

                <div className='mt-4'>
                  <label
                    htmlFor='duration'
                    className='flex gap-2 items-center cursor-pointer max-w-xs'
                    data-tooltip-id='durationTip'
                    data-tooltip-content={t('expected_duration')}
                  >
                    <ReactTooltip id='durationTip' />
                    <span className='block'>
                      <Duration />
                    </span>
                    <span className='block text-gray-700'>
                      {t('set_due_date')}
                    </span>
                  </label>
                  <div className='flex flex-col gap-2 text-gray-400'>
                    <input
                      type='date'
                      name='dueDate'
                      min={moment().add(1, 'days').format('YYYY-MM-DD')}
                      value={taskData.dueDate}
                      onChange={(ev: any) =>
                        setTaskData((prev) => ({
                          ...prev,
                          dueDate: ev.target.value,
                        }))
                      }
                      required
                      className='overflow-hidden focus:outline-none w-full lg:w-1/2 border rounded-md p-2 text-black mt-2'
                    />
                  </div>
                </div>
                <div className='mt-4'>
                  <div className='relative mb-3'>
                    <label
                      className='block pl-[0.15rem] hover:cursor-pointer mb-2'
                      htmlFor='disableSelfAssign'
                    >
                      {t('enable_self_assign')}
                    </label>
                    <input
                      className='toggle'
                      type='checkbox'
                      role='switch'
                      id='disableSelfAssign'
                      name='disableSelfAssign'
                      checked={!taskData.disableSelfAssign}
                      onChange={handleChange}
                    />
                  </div>
                  {!taskData.disableSelfAssign && (
                    <div>
                      <label
                        htmlFor='reputationLevel'
                        className='flex gap-2 items-center cursor-pointer max-w-xs'
                      >
                        <span className='block'>
                          <Reputation />
                        </span>
                        <span className='block text-gray-700'>
                          {t('min_reputation')}
                        </span>
                      </label>
                      <p className='block text-sm font-normal text-gray-600 mt-3'>
                        {t('expected_reputation')}
                      </p>
                      <div className='flex gap-x-3 gap-y-4 mt-4 flex-wrap'>
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
                                <span>{`${value.toUpperCase()} (${key})`}</span>
                              </label>
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </section>
              <section className='py-4 border border-t-0 border-r-0 border-l-0'>
                <span className='block text-xl font-medium'>
                  {t('private_task_materials')}
                </span>
                <p className='block text-sm font-normal text-gray-600 mt-4'>
                  {t('contribution_information_hint')}
                </p>
                <div className='mt-3'>
                  <MarkDownEditor
                    name='instructions'
                    height={300}
                    value={{
                      text: taskData.instructions || instructionsTemplate,
                    }}
                    onChange={(_, e) => handleChange(e)}
                  />
                </div>
              </section>
              <section className='py-4'>
                <span className='block text-xl font-medium'>
                  {t('payment')}
                </span>
                <div className='mt-4'>
                  <span className='block font-medium'>
                    {t('cost_complexity')}
                  </span>
                  <p className='block text-sm font-normal text-gray-600 mt-4'>
                    {t('estimate_complexity')}
                    <button
                      type='button'
                      className='text-[#3667EA] underline'
                      onClick={() => setShowRewardSettings(true)}
                    >
                      {t('link_placeholder')}
                    </button>
                    {t('estimate_complexity_end')}
                  </p>
                  <div className='flex gap-x-3 gap-y-4 mt-4 flex-wrap'>
                    {taskComplexities.slice(0, 4).map(([key, value]) => {
                      const complexityReward = rewardAmount
                        .mul(parseInt(key) + 1)
                        .div(taskData.complexityScore + 1)
                      const complexityRewardValue = ethers.utils.formatUnits(
                        complexityReward.toString(),
                        tokenInfo?.decimal
                      )
                      const rewardUsd =
                        parseFloat(complexityRewardValue) *
                        (tokenInfo?.priceUsd || 0)
                      return (
                        <span key={value}>
                          <input
                            type='radio'
                            id={value}
                            value={parseInt(key)}
                            name='complexityScore'
                            className='hidden peer'
                            onChange={handleChange}
                            checked={taskData.complexityScore === parseInt(key)}
                          />
                          <label
                            htmlFor={value}
                            className='cursor-pointer w-[max-content] border text-sm text-center px-4 py-1 rounded-lg focus:bg-blue-700 peer-checked:bg-blue-700 peer-checked:text-white peer-checked:font-medium peer-checked:font-semibold border-b-[1px] border-gray peer-checked:border-blue-500'
                          >
                            <span>
                              {`${value.toUpperCase()}
                              (${rewardUsd.toPrecision(4)} USD
                              )`}
                            </span>
                          </label>
                        </span>
                      )
                    })}
                  </div>
                </div>
                <div className='mt-8'>
                  <span className='mb-2 mr-2 text-grey-900 opacity-80'>
                    {t('total')}:
                  </span>
                  {rewardUsd.toPrecision(4)} USD
                </div>
              </section>
            </StyledScrollableContainer>
            <section className='mt-4 flex items-center gap-4 flex-0 pb-10 px-6'>
              {isApprover && (
                <button
                  className='btn-outline'
                  type='submit'
                  disabled={showProgressModal}
                  name='publish_task'
                  onClick={() => createTask(true)}
                >
                  {t('publish_task')}
                </button>
              )}
              <button
                className='btn-primary'
                type='submit'
                disabled={showProgressModal}
                name='save_draft'
                onClick={() => createTask()}
              >
                {t('save_draft')}
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
