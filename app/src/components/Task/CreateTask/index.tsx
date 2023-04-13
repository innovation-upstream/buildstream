import CloseIcon from 'components/IconSvg/CloseIcon'
import Spinner from 'components/Spinner/Spinner'
import { useGetTasksQuery, useWeb3 } from 'hooks'
import { createNewTask } from 'hooks/task/functions'
import { ComplexityScoreMap } from 'hooks/task/types'
import React, { useEffect, useState } from 'react'
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
import useBalance from 'hooks/balance/useBalance'
import useTokenInfos from 'hooks/tokenInfo/useTokenInfos'

const initialTaskData = {
  title: '',
  description: '',
  taskTags: [],
  complexityScore: 0,
  reputationLevel: 0,
  duration: 1,
  shouldOpenTask: false
}
type TaskTypes = typeof initialTaskData & { [key: string]: any }

const taskComplexities = Object.entries(ComplexityScoreMap)

const CreateTask: React.FC<ICreateTask> = ({ organization, close }) => {
  const [taskData, setTaskData] = useState<TaskTypes>(initialTaskData)
  const [status, setStatus] = useState({ text: '', error: false })
  const [processing, setProcessing] = useState(false)
  const { account, library } = useWeb3()
  const { t } = useTranslation('tasks')

  const handleChange = (ev: any) => {
    const targetName = ev.target.name
    let targetValue: string | number = ev.target.value

    if (ev.target.type === 'number' || targetName === 'orgId') {
      if (targetValue) {
        targetValue = Number(targetValue)
      }
    }

    setTaskData((prev) => ({ ...prev, [targetName]: targetValue }))
  }
  const preventInvalidChar = (ev: any) =>
    ['e', 'E', '+', '-'].includes(ev.key) && ev.preventDefault()

    let tokenList = organization.treasury?.tokens?.map((t) => t.token) || []
    const { tokenInfos } = useTokenInfos(tokenList)

  const checkBalance = ():string => {
    const tokens = organization?.treasury?.tokens
    const token = tokens?.find((t) => t.token === tokens?.[0]?.token)
    const tokenInfo = tokenInfos?.find((i) => i.address === tokens?.[0]?.token)

    const balance = ethers.utils.formatUnits(
      BigNumber.from(token?.balance || 0)?.toString(),
      tokenInfo?.decimal
    )

    return balance;
  }

  const createTask = async (ev: any) => {
    ev.preventDefault()
    if (!account) {
      setStatus({ text: t('wallet_not_connected'), error: true })
      return
    }

    const taskDuration = TaskDurationCalc.getDurationInSeconds({
      weeks: 0,
      days: taskData.duration,
      hours: 0
    })

    if(parseFloat(checkBalance()) < 0) {
      setStatus({ text: t('insufficient_treasury_balance'), error: true })
      return
    }

    if (taskDuration <= 0 || !taskData.title || !taskData.description) {
      setStatus({ text: t('invalid_input'), error: true })
      return
    }
    if (taskData.taskTags.length < 1) {
      setStatus({ text: t('task_tags_not_add'), error: true })
      return
    }
    setStatus({ text: '', error: false })

    setProcessing(true)
    try {
      await createNewTask(
        {
          externalId: '',
          orgId: organization.id,
          title: taskData.title,
          description: taskData.description,
          taskTags: taskData.taskTags,
          complexityScore: taskData.complexityScore,
          reputationLevel: taskData.reputationLevel,
          taskDuration,
          shouldOpenTask: taskData.shouldOpenTask
        },
        library.getSigner()
      )
      setProcessing(false)
      close()
    } catch (error) {
      setProcessing(false)
      setStatus({ text: t('task_not_created'), error: true })
      console.error(error)
    }
  }

  useEffect(() => {
    const body = document.body
    body.style.overflow = 'hidden'

    return () => {
      body.style.overflow = 'auto'
    }
  }, [])

  return (
    <div className='layout-container flex justify-center items-center overflow-x-hidden overflow-hidden fixed inset-0 outline-none focus:outline-none z-50'>
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
          <form onSubmit={createTask} className=' h-full w-full flex flex-col'>
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
                <div className='mt-3 grid-layout gap-2'>
                  <div className='col-span-4'>
                    <label
                      htmlFor='duration'
                      className='flex gap-2 items-center mb-2 cursor-pointer'
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
                        className='overflow-hidden focus:outline-none'
                        required
                      />
                    </div>
                  </div>
                  <div className='col-span-4'>
                    <label
                      htmlFor='reputationLevel'
                      className='flex gap-2 items-center mb-2 cursor-pointer'
                      data-tooltip-id='reputationTip'
                    >
                      <ReactTooltip id='reputationTip' className='max-w-xs'>
                        <div>{t('expected_reputation')}</div>
                      </ReactTooltip>
                      <span className='block'>
                        <Reputation />
                      </span>
                      <span className='block text-gray-700'>
                        {t('reputation')}
                      </span>
                    </label>
                    <div className='w-full border p-2 rounded-md flex items-center'>
                      <span className='block pr-2'>
                        <Badge />
                      </span>
                      <input
                        type='number'
                        id='reputationLevel'
                        name='reputationLevel'
                        min='0'
                        onKeyDown={preventInvalidChar}
                        value={taskData.reputationLevel}
                        onChange={handleChange}
                        className='overflow-hidden focus:outline-none'
                        required
                      />
                    </div>
                  </div>
                  <div className='col-span-4'>
                    <label
                      htmlFor='complexityScore'
                      className='flex gap-2 items-center mb-2 cursor-pointer'
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
                    <select
                      id='complexityScore'
                      value={taskData.complexityScore}
                      name='complexityScore'
                      onChange={handleChange}
                      className='w-full border p-2 rounded-md focus:outline-none'
                    >
                      {taskComplexities.map(([key, value]) => {
                        return (
                          <option key={key} value={key}>
                            {value.toLocaleUpperCase()}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                </div>
                <div className='mt-3'>
                  <TaskTagInput
                    tags={taskData.taskTags}
                    updateTags={(tags) =>
                      setTaskData((prev: any) => ({ ...prev, taskTags: tags }))
                    }
                  />
                </div>
              </section>
              <section className='mt-2'>
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
                <div className='mt-3 flex items-center'>
                  <p className=''>{t('open_after_creation')}</p>
                  <input
                    type='checkbox'
                    name='shouldOpenTask'
                    className='ml-2 focus:outline-none'
                    checked={taskData.shouldOpenTask}
                    onChange={handleChange}
                  />
                </div>
              </section>
              <div
                className={`w-full mx-auto leading-relaxed text-base mt-4 ${
                  status.error ? 'text-red-500' : 'text-green-500'
                }`}
              >
                {status.text}
              </div>
            </StyledScrollableContainer>
            <section className='mt-4 flex items-center gap-4 flex-0 pb-10 px-6'>
              {!processing && (
                <button
                  className='btn-primary min-w-[30%]'
                  type='submit'
                  disabled={processing}
                >
                  {t('create_task')}
                </button>
              )}
              {processing && <Spinner width={30} />}
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
