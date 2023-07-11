import { useTokens } from '@innovationupstream/buildstream-utils'
import ChevronDown from 'components/IconSvg/ChevronDown'
import { ComplexityScore, ComplexityScoreMap } from 'hooks/task/types'
import { useUserStat } from 'hooks/userstat'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import TaskTagInput from '../CreateTask/TaskTagInput'
import { FilterUpdate, useTaskFilter } from './FilterContext'
import { StyledContainer } from './styled'

interface FilterProps {
  expand?: boolean
  maxHeight?: number
}

const complexities = Object.entries(ComplexityScoreMap).filter(
  ([key]) =>
    parseInt(key) !== ComplexityScore.BEGINNER &&
    parseInt(key) != ComplexityScore.ADVANCED
)

const Filter = ({ expand, maxHeight }: FilterProps) => {
  const { t } = useTranslation('tasks')
  const stats = useUserStat()
  const {
    filters: initialFilter,
    tags,
    updateFilters: applyFilters
  } = useTaskFilter()
  const [openSkills, setOpenSkills] = useState(expand || !!tags?.length)
  const [filters, setFilters] = useState<FilterUpdate>(initialFilter || {})
  const tokens = useTokens()

  const updateFilters = (key: string, value: any) => {
    setFilters((prev: any) => {
      const newFilters = {
        ...prev,
        [key]: value
      }
      applyFilters?.(newFilters)
      return newFilters
    })
  }

  const handleCheckbox = (list: number[], item: number, key: string) => {
    const newList = list
    const index = newList.indexOf(item)
    if (index !== -1) newList.splice(index, 1)
    else newList.push(item)
    updateFilters(key, newList)
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
      <p className='text-lg font-semibold my-4'>{t('complexity')}</p>
      <div className='flex gap-2 flex-wrap my-4'>
        <label className='btn-tag cursor-pointer'>
          <input
            type='radio'
            name='complexity'
            className='w-0 h-0'
            value='none'
            onChange={() => updateFilters('complexity', undefined)}
          />
          <span className='text-[#646873] capitalize'>{t('any')}</span>
        </label>
        {complexities.map(([k, v]) => {
          const isSelected = filters.complexity === Number(k)
          return (
            <label
              key={v}
              className={`${
                isSelected ? 'bg-blue-200 hover:bg-blue-300' : ''
              } btn-tag cursor-pointer`}
            >
              <input
                type='radio'
                name='complexity'
                className='w-0 h-0'
                value={k}
                checked={isSelected}
                onChange={() => updateFilters('complexity', Number(k))}
              />
              <span className='text-[#646873] capitalize'>{v}</span>
            </label>
          )
        })}
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
                openSkills ? 'rotate-180' : ''
              }`}
            >
              <ChevronDown />
            </span>
          </button>
        </div>

        {openSkills && (
          <div className='min-h-[250px]'>
            <TaskTagInput
              tags={filters.tags || []}
              updateTags={(t) => updateFilters('tags', t)}
              hideTitle
            />
            <div className='mt-4'>
              {stats.tokens.map((tag) => {
                const token = tokens.find((t) => t.id === tag.token.toString())
                return (
                  <label
                    key={tag.id}
                    className='flex gap-x-3 mb-2.5 items-center'
                  >
                    <input
                      type='checkbox'
                      className='w-5 h-5'
                      checked={!!filters?.tags?.includes(tag.token)}
                      onChange={() =>
                        handleCheckbox(filters?.tags || [], tag.token, 'tags')
                      }
                    />
                    <span className='text-[#646873] capitalize'>
                      {token?.name}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </StyledContainer>
  )
}

export default Filter
