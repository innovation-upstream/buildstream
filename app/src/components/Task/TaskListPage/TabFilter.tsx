import { TaskStatus } from 'hooks/task/types'
import { useTranslation } from 'react-i18next'

interface IFilter {
  currentTab: TaskStatus
  setCurrentTab: (val: TaskStatus) => void
}

const TabFilter = ({ currentTab, setCurrentTab }: IFilter) => {
  const { t } = useTranslation('tasks')
  return (
    <div className='flex'>
      <span className='flex justify-center w-1/2 lg:text-xl text-gray-500 focus:text-gray-900 focus:font-semibold lg:w-auto'>
        <input
          type='radio'
          id='completed_task'
          value={TaskStatus.CLOSED}
          name='task_filter'
          className='hidden peer'
          onChange={(ev) => setCurrentTab(parseInt(ev.target.value))}
          checked={currentTab === TaskStatus.CLOSED}
        />
        <label
          htmlFor='completed_task'
          className='cursor-pointer w-full text-center px-3 py-1 peer-checked:font-bold peer-checked:text-gray-900 peer-checked:font-semibold border-2 border-gray peer-checked:border-blue-500 border-l-0 border-r-0 border-t-0'
        >
          {t('completed_tasks')}
        </label>
      </span>
      <span className='flex justify-center w-1/2 lg:text-xl text-gray-500 focus:font-semibold lg:w-auto'>
        <input
          type='radio'
          id='in_progress'
          value={TaskStatus.ASSIGNED}
          name='task_filter'
          onChange={(ev) => setCurrentTab(parseInt(ev.target.value))}
          className='hidden peer'
          checked={currentTab === TaskStatus.ASSIGNED}
        />
        <label
          htmlFor='in_progress'
          className='cursor-pointer w-full text-center px-3 py-1 peer-checked:font-bold peer-checked:text-gray-900 peer-checked:font-semibold border-2 border-gray peer-checked:border-blue-500 border-l-0 border-r-0 border-t-0'
        >
          {t('in_progress')}
        </label>
      </span>
    </div>
  )
}

export default TabFilter
