import CloseIcon from 'components/IconSvg/CloseIcon'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Search from 'SVGs/Search'

interface Props {
  tags: string[]
  updateTags: (tags: string[]) => void
}

const TaskTagInput: React.FC<Props> = ({ tags, updateTags }) => {
  const { t } = useTranslation('tasks')
  const tagRef = useRef<any>('')

  const deleteTag = (index: number) => {
    const newTags = tags.concat()
    newTags.splice(index, 1)

    updateTags(newTags)
  }

  const handleChange = (ev: any) => {
    let targetValue: any = ev.target.value

    if (ev.target.name === 'taskTags') {
      if (ev.key === 'Enter') {
        const newTags = tags.concat(targetValue)
        updateTags(newTags)
        tagRef.current.value = ''
      }
    }
  }

  return (
    <div className='w-full'>
      <span className='block text-gray-700'>{t('required_skills')}</span>
      <div className='w-full border p-2 rounded-md flex items-center mt-2'>
        <span className='block pr-2'>
          <Search width={20} />
        </span>
        <input
          type='text'
          id='taskTags'
          name='taskTags'
          ref={tagRef}
          onKeyDown={handleChange}
          className='w-full focus:outline-none'
          placeholder={t('enter_skills')}
        />
      </div>
      <div className='mt-4 flex flex-wrap gap-2'>
        {tags.length > 0 &&
          tags.map((task, index) => (
            <div key={task} className='rounded-md py-1 px-2 bg-gray-200 flex gap-3 items-center'>
              <span className='block text-sm'>{task}</span>
              <button onClick={() => deleteTag(index)}>
                <CloseIcon width={10} />
              </button>
            </div>
          ))}
      </div>
    </div>
  )
}

export default TaskTagInput
