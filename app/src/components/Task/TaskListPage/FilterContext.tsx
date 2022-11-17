import { GetTasksQueryVariables } from 'graphclient'
import { ComplexityScore } from 'hooks/task/types'
import {
  createContext,
  ReactNode,
  useContext,
  useState
} from 'react'

interface IFilterContext {
  text?: string
  complexity?: ComplexityScore
  tags?: string[]
  filterQueryVariables?: GetTasksQueryVariables[]
  updateFilters?: (filter: FilterUpdate) => void
}

export interface FilterUpdate {
  text?: string
  complexity?: ComplexityScore
  tags?: string[]
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
      orderDirection: 'desc'
    }
  ])

  const updateFilters = (filter: FilterUpdate) => {
    setFilters((prev: any) => ({
      ...prev,
      ...filter
    }))

    const text = filter.text || filters.text?.trim()
    const complexity =
      filter.complexity || filters.complexity
    const tags = filter.tags || filters.tags

    let payload: GetTasksQueryVariables[] = [
      {
        orderBy: 'taskId',
        orderDirection: 'desc',
        where: {
          raw_contains_nocase: text,
          complexityScore: complexity as any
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
              taskTags_contains_nocase: [tag]
            }
          } as GetTasksQueryVariables)
      )
    }

    setFilterQueryVariables(payload.map((p) => trimPayload(p)))
  }

  return (
    <FilterContext.Provider
      value={{
        ...filters,
        filterQueryVariables,
        updateFilters
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}
