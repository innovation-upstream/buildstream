import { useTranslation } from 'react-i18next'
import { ComplexityScore, ComplexityScoreMap } from 'hooks/task/types'
import { useUserStat } from 'hooks/userstat'
import TaskTagInput from '../CreateTask/TaskTagInput'
import ChevronDown from 'components/IconSvg/ChevronDown'
import { useState } from 'react'
import { useTaskFilter } from './FilterContext'
import { StyledContainer } from './styled'

interface FilterProps {
  expand?: boolean
  maxHeight?: number
}

const Filter = ({ expand, maxHeight }: FilterProps) => {
  const { t } = useTranslation('tasks')
  const stats = useUserStat()
  const { tags, setComplexity, setTags } = useTaskFilter()
  const [openSkills, setOpenSkills] = useState(expand || !!tags?.length)
  const [filters, setFilters] = useState<{
    complexity?: ComplexityScore
    tags?: string[]
  }>({})

  const updateFilters = (key: string, value: any) => {
    setFilters((prev: any) => ({
      ...prev,
      [key]: value
    }))
  }

  const handleCheckbox = (list: string[], item: string, key: string) => {
    const newList = list
    const index = newList.indexOf(item)
    if (index !== -1) newList.splice(index, 1)
    else newList.push(item)
    updateFilters(key, newList)
  }

  const applyFilter = () => {
    setTags?.(filters.tags)
    setComplexity?.(filters.complexity)
  }

  return (
    <StyledContainer
      className='bg-white md:paper overflow-auto scrollbar-thin'
      maxHeight={maxHeight}
    >
      <div className='flex'>
        <p className='text-2xl font-semibold mb-5'>{t('filter')}</p>
      </div>
      <div className='divider' />
      <div className='my-4'>
        <p className='text-lg font-semibold mb-4'>{t('complexity')}</p>
        <label className='flex gap-x-3 mb-2.5 items-center'>
          <input
            type='radio'
            name='complexity'
            className='w-5 h-5'
            value='none'
            onChange={() => updateFilters('complexity', undefined)}
          />
          <span className='text-[#646873] capitalize'>{t('any')}</span>
        </label>
        {Object.entries(ComplexityScoreMap).map(([k, v]) => (
          <label key={v} className='flex gap-x-3 mb-2.5 items-center'>
            <input
              type='radio'
              name='complexity'
              className='w-5 h-5'
              value={v}
              onChange={() => updateFilters('complexity', Number(k))}
            />
            <span className='text-[#646873] capitalize'>{v}</span>
          </label>
        ))}
      </div>
      <div className='divider' />
      <div className='my-4'>
        <div className='flex items-center justify-between mb-4 relative'>
          <p className='text-lg font-semibold'>{t('skills')}</p>
          <button
            onClick={() => setOpenSkills((prev) => !prev)}
            className='after:absolute after:w-full after:h-full after:inset-0'
          >
            <span
              className={`block transition-transform ${
                openSkills ? '' : 'rotate-180'
              }`}
            >
              <ChevronDown />
            </span>
          </button>
        </div>

        {openSkills && (
          <div>
            <TaskTagInput
              tags={filters.tags || []}
              updateTags={(t) => updateFilters('tags', t)}
              hideTitle
            />
            <div className='mt-4'>
              {stats.tags.map((tag) => (
                <label key={tag} className='flex gap-x-3 mb-2.5 items-center'>
                  <input
                    type='checkbox'
                    className='w-5 h-5'
                    checked={!!filters?.tags?.includes(tag)}
                    onChange={() => handleCheckbox(tags || [], tag, 'tags')}
                  />
                  <span className='text-[#646873] capitalize'>{tag}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className='divider' />
      <button onClick={applyFilter} className='btn-primary w-full mt-5'>
        {t('apply_filter')}
      </button>
    </StyledContainer>
  )
}

export default Filter
