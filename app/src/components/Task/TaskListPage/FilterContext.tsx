import { GetTasksQueryVariables } from 'graphclient'
import { ComplexityScore, TaskStatus } from 'hooks/task/types'
import { ReactNode, createContext, useContext, useState } from 'react'

interface IFilterContext {
  text?: string
  complexity?: ComplexityScore
  tags?: number[]
  filters?: FilterUpdate
  filterQueryVariables?: GetTasksQueryVariables[]
  updateFilters?: (filter: FilterUpdate) => void
}

export interface FilterUpdate {
  text?: string
  complexity?: ComplexityScore
  tags?: number[]
}

export const FilterContext = createContext<IFilterContext>({})

export const useTaskFilter = () => {
  const filters = useContext(FilterContext)
  return filters
}

const trimPayload = (data: Record<string, any>): Record<string, any> => {
  return Object.entries(data).reduce((prev, [k, v]) => {
    if (v === undefined || v === null || v.length === 0) {
      return prev
    }
    let value: any = v
    if (!Array.isArray(v) && typeof v === 'object') value = trimPayload(v)
    return {
      ...prev,
      [k]: value
    }
  }, {})
}

export const TaskFilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<FilterUpdate>({})
  const [filterQueryVariables, setFilterQueryVariables] = useState<
    GetTasksQueryVariables[]
  >([
    {
      orderBy: 'taskId',
      orderDirection: 'desc',
      where: {
        status: TaskStatus.OPEN
      }
    }
  ])

  const updateFilters = (newFilter: FilterUpdate) => {
    setFilters((prev: any) => ({
      ...prev,
      ...newFilter
    }))

    const text = (newFilter.text || filters.text)?.trim()
    const complexity = newFilter.complexity
    const tags = newFilter.tags || filters.tags

    let payload: GetTasksQueryVariables[] = [
      {
        orderBy: 'taskId',
        orderDirection: 'desc',
        where: {
          raw_contains_nocase: text,
          complexityScore: complexity as any,
          status: TaskStatus.OPEN
        }
      }
    ]

    if (!!tags?.length) {
      payload = tags.map(
        (tag) =>
          ({
            orderBy: 'taskId',
            orderDirection: 'desc',
            where: {
              raw_contains_nocase: text,
              complexityScore: complexity,
              taskTags_contains: [tag.toString() as any],
              status: TaskStatus.OPEN
            }
          } as GetTasksQueryVariables)
      )
    }

    const splittedText = text?.split(' ')
    if (!!splittedText?.length && !!payload.length) {
      const newPayload = splittedText.map((t) =>
        payload.map((p) => ({
          ...p,
          where: {
            ...(p.where || {}),
            raw_contains_nocase: t
          }
        }))
      )
      payload = newPayload.flat()
    }

    if (!!splittedText?.length && !payload.length) {
      const newPayload = splittedText.map(
        (t) =>
          ({
            orderBy: 'taskId',
            orderDirection: 'desc',
            where: {
              raw_contains_nocase: t,
              complexityScore: complexity,
              status: TaskStatus.OPEN
            }
          } as GetTasksQueryVariables)
      )
      payload = newPayload.flat()
    }

    setFilterQueryVariables(payload.map((p) => trimPayload(p)))
  }

  return (
    <FilterContext.Provider
      value={{
        text: filters.text,
        tags: filters.tags,
        filters,
        filterQueryVariables,
        updateFilters
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}
