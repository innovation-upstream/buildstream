import CloseIcon from 'components/IconSvg/CloseIcon'
import { useWeb3 } from 'hooks'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useState } from 'react'
import { ISpaces, TImport } from './types'
import Badge from 'SVGs/Badge'
import ComplexityScore from 'SVGs/ComplexityScore'
import Duration from 'SVGs/Duration'
import Reputation from 'SVGs/Reputation'
import Settings from 'SVGs/Settings'
import ChevronDown from 'components/IconSvg/ChevronDown'
import Spinner from 'components/Spinner/Spinner'
import TaskTagInput from '../CreateTask/TaskTagInput'
import { StyledScrollableContainer } from '../CreateTask/styled'
import { ComplexityScoreMap } from 'hooks/task/types'
import { createNewTask } from 'hooks/task/functions'
import { TaskDurationCalc } from 'utils/task_duration'
import { getCookie, setCookies } from 'cookies-next'
import AutoComplete from 'components/AutoComplete/AutoComplete'

const serverUrl = process.env.NEXT_PUBLIC_CLICKUP_SERVER_URL
const client_secret = process.env.NEXT_PUBLIC_CLICKUP_CLIENT_SECRET
const client_id = process.env.NEXT_PUBLIC_CLICKUP_CLIENT_ID
const TOKEN_KEY = 'clickupToken'
const CLIENT_CODE = 'clickupClientCode'

const initialTaskData = {
  title: '',
  id: '',
  description: '',
  taskTags: [],
  complexityScore: 0,
  reputationLevel: 0,
  duration: 1
}

type TaskTypes = typeof initialTaskData & { [key: string]: any }
const taskComplexities = Object.entries(ComplexityScoreMap)

const fetchSpacesWithToken = async (code: string): Promise<ISpaces[]> => {
  let spaceData: ISpaces[] = []
  try {
    const res = await fetch(`${serverUrl}/get_token`, {
      method: 'POST',
      body: JSON.stringify({
        client_id: client_id,
        client_secret: client_secret,
        code: code
      }),
      headers: new Headers({ 'Content-Type': 'application/json' })
    })
    const data = await res.json()
    if (data.access_token) {
      setCookies(TOKEN_KEY, data.access_token)
      setCookies(CLIENT_CODE, code)
    }
    spaceData = await fetchSpaces()
  } catch (e) {
    console.log('ERRORRR===', e)
  }
  return spaceData
}

const fetchSpaces = async (): Promise<ISpaces[]> => {
  let spaces
  try {
    const res = await fetch(`${serverUrl}/spaces`, {
      method: 'POST',
      body: JSON.stringify({
        token: getCookie(TOKEN_KEY)
      }),
      headers: new Headers({ 'Content-Type': 'application/json' })
    })
    const data = await res.json()
    spaces = data.spaces
  } catch (err) {
    console.error(err)
  }
  return spaces
}

const fetchTasks = async (space_id: number): Promise<any[]> => {
  let tasks
  try {
    const resp = await fetch(`${serverUrl}/tasks`, {
      method: 'POST',
      body: JSON.stringify({
        space_id: space_id,
        token: getCookie(TOKEN_KEY)
      }),
      headers: new Headers({ 'Content-Type': 'application/json' })
    })
    const data = await resp.json()
    tasks = data
  } catch (err) {
    console.error(err)
  }
  return tasks
}

const ClickupImport: React.FC<TImport> = ({
  organization_id,
  clickup_code,
  close
}) => {
  const [taskData, setTaskData] = useState<TaskTypes>(initialTaskData)
  const [showAdvanced, toggleShowAdvanced] = useState(false)
  const [status, setStatus] = useState({ text: '', error: false })
  const [processing, setProcessing] = useState(false)
  const [spaces, setSpaces] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const { t } = useTranslation('tasks')
  const { account, library } = useWeb3()
  const preventInvalidChar = (ev: any) =>
    ['e', 'E', '+', '-'].includes(ev.key) && ev.preventDefault()

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

    const taskDuration = TaskDurationCalc.getDurationInSeconds({
      weeks: 0,
      days: taskData.duration,
      hours: 0
    })

    if (taskDuration <= 0) {
      setStatus({ text: t('wrong_duration_input'), error: true })
      return
    }
    setStatus({ text: '', error: false })

    setProcessing(true)
    console.log('ADDED TASK DATA ======', `clickup-${taskData.id}`)
    console.log(taskData)
    try {
      await createNewTask(
        organization_id,
        taskData.title,
        taskData.description,
        [...taskData.taskTags, `clickup-${taskData.id}`],
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

  const getSpaces = async () => {
    const spaces: ISpaces[] = await fetchSpacesWithToken(clickup_code)
    let spaceSuggestion = []
    for (let i = 0; i < spaces.length; i++) {
      spaceSuggestion.push({ id: spaces[i].id, value: spaces[i].name })
    }
    setSpaces(spaceSuggestion)
  }

  const getTasks = async (space: any) => {
    setTasks([])
    const space_id = space.id
    const tasks = await fetchTasks(space_id)
    let spaceTasks = []
    for (let i = 0; i < tasks.length; i++) {
      spaceTasks.push({
        id: tasks[i].id,
        value: tasks[i].name,
        description: tasks[i].description
      })
    }
    setTasks(spaceTasks)
  }

  const updateTaskFields = (task: any) => {
    setTaskData((prev) => ({
      ...prev,
      title: task.value,
      id: task.id,
      description: task.description ?? ''
    }))
  }

  useEffect(() => {
    getSpaces()
  }, [])

  return (
    <div className='layout-container flex justify-center items-center overflow-x-hidden overflow-hidden fixed inset-0 outline-none focus:outline-none z-50'>
      <div className='relative w-full h-full my-6 mx-auto z-50 overflow-hidden'>
        <div className='paper w-full md:w-1/2 h-[95vh] px-2 py-5 absolute right-0 top-0 rounded-xl my-5 overflow-hidden'>
          <div className='px-6 w-full'>
            <section className='flex justify-between border border-t-0 border-r-0 border-l-0 pb-3'>
              <span className='block font-bold text-2xl'>
                {t('import_new_task')}
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
                    htmlFor='spaces'
                    className='block mb-2 text-grey-900 opacity-80'
                  >
                    {t('spaces')}
                  </label>
                  <AutoComplete
                    suggestions={spaces}
                    onChange={(val: any) => getTasks(val)}
                    id='spaces'
                    className='w-full border p-2 rounded-md focus:outline-none'
                  />
                </div>
                <div className='mt-4'>
                  <label
                    htmlFor='title'
                    className='block mb-2 text-grey-900 opacity-80'
                  >
                    {t('task_name')}
                  </label>
                  <AutoComplete
                    suggestions={tasks}
                    onChange={(val: any) => updateTaskFields(val)}
                    id='title'
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
                    className='rounded-md p-2 border border-gray-200 w-full focus:outline-none resize-none'
                    readOnly
                  ></textarea>
                </div>
              </section>
              <section className='py-4 border border-t-0 border-r-0 border-l-0'>
                <span className='block text-xl font-medium'>
                  {t('general_task_settings')}
                </span>
                <div className='mt-3 grid-layout gap-2'>
                  <div className='col-span-4'>
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
                      />
                    </div>
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
                        min='0'
                        onKeyDown={preventInvalidChar}
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
                  onClick={createTask}
                  disabled={processing}
                >
                  {t('import_task')}
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
          </div>
        </div>
      </div>
      <div className='fixed bg-black opacity-50 inset-0'></div>
    </div>
  )
}

export default ClickupImport
