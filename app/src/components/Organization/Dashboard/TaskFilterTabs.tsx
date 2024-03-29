import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { TaskFilters } from './types'

const filterTabs = [
  {
    label: 'without_request',
    value: TaskFilters.WITHOUT_REQUEST
  },
  {
    label: 'with_request',
    value: TaskFilters.WITH_REQUEST
  },
  {
    label: 'in_progress',
    value: TaskFilters.IN_PROGRESS
  },
  {
    label: 'in_review',
    value: TaskFilters.IN_REVIEW
  },
  {
    label: 'closed_tasks',
    value: TaskFilters.CLOSED
  }
]

interface TFilter {
  currentTab: TaskFilters
  onChange: (val: TaskFilters) => void
  taskCounts?: {
    [key in TaskFilters]: number
  }
}

const TaskFilterTabs = ({ currentTab, onChange, taskCounts }: TFilter) => {
  const { t } = useTranslation('tasks')
  const tabRefs = useRef<{ [key in TaskFilters]: HTMLLabelElement | null }>({
    [TaskFilters.WITHOUT_REQUEST]: null,
    [TaskFilters.WITH_REQUEST]: null,
    [TaskFilters.IN_PROGRESS]: null,
    [TaskFilters.IN_REVIEW]: null,
    [TaskFilters.CLOSED]: null
  })

  return (
    <div className='mb-3 flex overflow-x-auto snap-x xl:grid-rows scrollbar-hide md:scrollbar-default md:scrollbar-thin'>
      {filterTabs.map((tabs) => {
        const taskCount = taskCounts?.[tabs.value]
        const isActive = currentTab === tabs.value

        return (
          <span
            key={tabs.value}
            className='flex justify-center lg:text-xl text-gray-500 focus:text-gray-900  lg:w-auto snap-start xl:grid-cols-4'
          >
            <input
              type='radio'
              id={`${tabs.value}`}
              value={tabs.value}
              name='task_filter'
              className='hidden peer'
              onChange={(ev) => {
                onChange(parseInt(ev.target.value))
                tabRefs.current[tabs.value]?.scrollIntoView({
                  behavior: 'smooth'
                })
              }}
              checked={currentTab === tabs.value}
            />
            <label
              htmlFor={`${tabs.value}`}
              ref={(el) => {
                tabRefs.current[tabs.value] = el
              }}
              className='cursor-pointer w-[max-content] text-center px-3 py-2 peer-checked:font-bold peer-checked:text-gray-900 peer-checked:font-semibold border-b-[1px] border-gray peer-checked:border-blue-500'
            >
              <div className='flex gap-3 items-center'>
                <span className='block text-lg'>{t(tabs.label)}</span>
                <span
                  className={`${
                    isActive
                      ? 'px-2 bg-blue-700'
                      : 'px-1 py-0 text-xs bg-blue-200'
                  } block rounded-sm text-white`}
                >
                  {taskCount}
                </span>
              </div>
            </label>
          </span>
        )
      })}
    </div>
  )
}

export default TaskFilterTabs
