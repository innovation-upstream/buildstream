import { useTokens } from '@innovationupstream/buildstream-utils'
import Search from 'SVGs/Search'
import AutoComplete from 'components/AutoComplete/AutoComplete'
import CloseIcon from 'components/IconSvg/CloseIcon'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Tooltip as ReactTooltip } from 'react-tooltip'

interface Props {
  tags: number[]
  updateTags: (tags: number[]) => void
  hideTitle?: boolean
}

const TaskTagInput: React.FC<Props> = ({ tags, updateTags, hideTitle }) => {
  const { t } = useTranslation('tasks')
  const tagRef = useRef<any>('')
  const tokens = useTokens()

  const deleteTag = (index: number) => {
    const newTags = tags.concat()
    newTags.splice(index, 1)

    updateTags(newTags)
  }

  const addTag = (tag: number) => {
    if (tags.includes(tag)) return
    updateTags([...tags, tag])
  }

  const handleChange = (ev: any) => {
    if (ev.key == 'Enter') {
      ev.preventDefault()
    }

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
      <ReactTooltip id='relevant_skills_title' />
      {!hideTitle && (
        <span
          className='block text-gray-700'
          data-tooltip-id='relevant_skills_title'
          data-tooltip-content={t('relevant_skills_hint')}
        >
          {t('relevant_skills')}
        </span>
      )}
      <div
        className={`relative w-full flex items-center ${
          hideTitle ? '' : 'mt-2'
        }`}
      >
        <span className='absolute z-10 left-2 block'>
          <Search width={20} />
        </span>
        <AutoComplete
          suggestions={tokens.map((t) => ({
            id: t.id,
            value: t.name.toLowerCase()
          }))}
          onChange={(val) => addTag(parseInt(val.id))}
          id='taskTags'
          name='taskTags'
          className='w-full border rounded-md focus:outline-none p-2 pl-[2.2rem]'
          placeholder={t('enter_skills')}
          clearOnSelect
        />
      </div>
      {tags.length > 0 && (
        <div className='mt-4 flex flex-wrap gap-2'>
          {tags.map((task, index) => {
            const token = tokens.find((t) => t.id === task.toString())
            return (
              <div
                key={task}
                className='rounded-md py-1 px-2 bg-gray-200 flex gap-3 items-center'
              >
                <span className='block text-sm'>
                  {token?.name?.toLowerCase()}
                </span>
                <button onClick={() => deleteTag(index)}>
                  <CloseIcon width={10} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default TaskTagInput
