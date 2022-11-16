import { GetTasksQueryVariables } from 'graphclient'
import { ComplexityScore } from 'hooks/task/types'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'

interface IFilterContext {
  text?: string
  complexity?: ComplexityScore
  tags?: string[]
  filterQueryVariables?: GetTasksQueryVariables[]
  setText?: (text?: string) => void
  setComplexity?: (complexity?: ComplexityScore) => void
  setTags?: (tags?: string[]) => void
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
  const [filters, setFilters] = useState<{
    text?: string
    complexity?: ComplexityScore
    tags?: string[]
  }>({})
  const [filterQueryVariables, setFilterQueryVariables] = useState<
    GetTasksQueryVariables[]
  >([
    {
      orderBy: 'taskId',
      orderDirection: 'desc'
    }
  ])

  const updateFilters = (key: string, value: any) => {
    setFilters((prev: any) => ({
      ...prev,
      [key]: value
    }))

    const text = (key === 'text' ? (value as string) : filters.text)?.trim()
    const complexity =
      key === 'complexity' ? (value as ComplexityScore) : filters.complexity
    const tags = key === 'tags' ? (value as string[]) : filters.tags

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
        setText(text) {
          updateFilters('text', text)
        },
        setComplexity(complexity) {
          updateFilters('complexity', complexity)
        },
        setTags(tags) {
          updateFilters('tags', Array.from(new Set(tags || [])))
        }
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}
