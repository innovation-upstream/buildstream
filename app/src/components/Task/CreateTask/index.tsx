import ChevronDown from 'components/IconSvg/ChevronDown'
import CloseIcon from 'components/IconSvg/CloseIcon'
import Spinner from 'components/Spinner/Spinner'
import { useWeb3 } from 'hooks'
import { createNewTask } from 'hooks/task/functions'
import { ComplexityScoreMap } from 'hooks/task/types'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Badge from 'SVGs/Badge'
import ComplexityScore from 'SVGs/ComplexityScore'
import Duration from 'SVGs/Duration'
import Link from 'SVGs/Link'
import Reputation from 'SVGs/Reputation'
import Settings from 'SVGs/Settings'
import { TaskDurationCalc } from 'utils/task_duration'
import { ICreateTaskProps } from './interface'
import { StyledScrollableContainer } from './styled'
import TaskTagInput from './TaskTagInput'

const initialTaskData = {
  title: '',
  description: '',
  taskTags: [],
  complexityScore: 0,
  reputationLevel: 0,
  duration: 0,
  taskDuration: 0
}

type TaskTypes = typeof initialTaskData & { [key: string]: any }

const CreateTaskModal: React.FC<ICreateTaskProps> = ({ orgId, close }) => {
  const [taskData, setTaskData] = useState<TaskTypes>(initialTaskData)
  const [processing, setProcessing] = useState(false)
  const { account, library } = useWeb3()
  const [status, setStatus] = useState({ text: '', error: false })
  const [showAdvanced, toggleShowAdvanced] = useState(false)

  const taskComplexities = Object.entries(ComplexityScoreMap)
  const daysSelection = [0, 1, 3, 5, 7, 9, 11, 14]

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

  const createTask = async (ev: any) => {
    ev.preventDefault()
    if (!account) {
      setStatus({ text: t('wallet_not_connected'), error: true })
      return
    }

    const taskDuration = TaskDurationCalc.getDurationInSeconds(
      0,
      taskData.duration,
      0
    )

    if (taskDuration === 0) {
      setStatus({ text: t('wrong_duration_input'), error: true })
      return
    }
    setStatus({ text: '', error: false })

    setProcessing(true)
    try {
      const response = await createNewTask(
        orgId,
        taskData.title,
        taskData.description,
        taskData.taskTags,
        taskData.complexityScore,
        taskData.reputationLevel,
        taskDuration,
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
          <div className=' h-full w-full flex flex-col'>
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
                    className='rounded-md p-2 border border-gray-200 w-full focus:outline-none resize-none	'
                  ></textarea>
                </div>
              </section>
              <section className='py-4 border border-t-0 border-r-0 border-l-0'>
                <span className='block text-xl font-medium'>
                  {t('general_task_settings')}
                </span>
                <div className='mt-3 grid-layout gap-2'>
                  <div className='col-span-4 w-full'>
                    <label
                      htmlFor='duration'
                      className='flex gap-2 items-center mb-2'
                    >
                      <span className='block'>
                        <Duration />
                      </span>
                      <span className='block text-gray-700'>
                        {t('set_duration')}
                      </span>
                    </label>
                    <select
                      id='duration'
                      name='duration'
                      value={taskData.duration}
                      onChange={handleChange}
                      className='w-full border p-2 rounded-md focus:outline-none'
                    >
                      {daysSelection.map((value) => {
                        return (
                          <option key={value} value={value}>
                            {value} Day{value > 1 && 's'}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                  <div className='col-span-4'>
                    <label
                      htmlFor='reputationLevel'
                      className='flex gap-2 items-center mb-2'
                    >
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
                        value={taskData.reputationLevel}
                        onChange={handleChange}
                        className='overflow-hidden focus:outline-none'
                      />
                    </div>
                  </div>
                  <div className='col-span-4'>
                    <label
                      htmlFor='complexityScore'
                      className='flex gap-2 items-center mb-2'
                    >
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

                  <button
                    className='p-4 flex justify-between items-center border bg-gray-50 w-full rounded-lg mt-4'
                    onClick={() => toggleShowAdvanced(!showAdvanced)}
                  >
                    <div className='flex items-center gap-2'>
                      <span className='block'>
                        <Settings />
                      </span>
                      <span className='text-bold'>
                        {t('advanced_settings')}
                      </span>
                    </div>
                    <span
                      className={`block ${
                        showAdvanced &&
                        'rotate-180 transition delay-150 duration-300 ease-in-out'
                      }`}
                    >
                      <ChevronDown />
                    </span>
                  </button>
                </div>
              </section>
              {showAdvanced && (
                <section className='mt-2'>
                  <span className='block text-xl font-medium'>
                    {t('set_up_communication_channel')}
                  </span>
                  <div className='mt-3'>
                    <span className='block mb-2'>
                      {t('enter_slack_channel_link')}
                    </span>
                    <div className='w-full px-4 py-2 border rounded-md flex items-center mt-2'>
                      <span className='block mr-2'>
                        <Link />
                      </span>
                      <input
                        type='text'
                        className='w-full focus:outline-none'
                        placeholder={t('leave_figma_link')}
                      />
                    </div>
                  </div>
                </section>
              )}
              <div
                className={`w-full mx-auto leading-relaxed text-base mt-4 ${
                  status.error ? 'text-red-500' : 'text-green-500'
                }`}
              >
                {status.text}
              </div>
            </StyledScrollableContainer>
            <section className='mt-4 flex items-center gap-4 flex-0 pb-10 px-6'>
              {!processing ? (
                <button
                  className='btn-primary min-w-[30%]'
                  onClick={createTask}
                  disabled={processing}
                >
                  {t('create_task')}
                </button>
              ) : (
                <Spinner width={30} />
              )}
              <button
                className='btn-outline px-8 border-gray-200 hover:border-gray-300'
                onClick={close}
              >
                {t('close')}
              </button>
            </section>
          </div>
        </div>
      </div>
      <div className='fixed bg-black opacity-50 inset-0'></div>
    </div>
  )
}

export default CreateTaskModal
