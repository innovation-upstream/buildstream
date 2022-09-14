import * as ApolloReactHooks from '@apollo/react-hooks'
import {
  GetTaskCountDocument,
  GetTaskCountQueryVariables,
  GetTaskCountsDocument,
  GetTaskCountsQueryVariables,
  GetTaskDocument,
  GetTaskQueryVariables,
  GetTasksDocument,
  GetTasksQueryVariables,
  Task,
  TaskCount
} from 'graphclient'

export const useGetTasksQuery = (
  baseOptions?: ApolloReactHooks.QueryHookOptions<Task, GetTasksQueryVariables>
) =>
  ApolloReactHooks.useQuery<Task, GetTasksQueryVariables>(
    GetTasksDocument,
    baseOptions
  )

export const useGetTaskQuery = (
  baseOptions?: ApolloReactHooks.QueryHookOptions<Task, GetTaskQueryVariables>
) =>
  ApolloReactHooks.useQuery<Task, GetTaskQueryVariables>(
    GetTaskDocument,
    baseOptions
  )

export const useGetTaskCountQuery = (
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    TaskCount,
    GetTaskCountQueryVariables
  >
) =>
  ApolloReactHooks.useQuery<TaskCount, GetTaskCountQueryVariables>(
    GetTaskCountDocument,
    baseOptions
  )

export const useGetTasksCountQuery = (
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    TaskCount,
    GetTaskCountsQueryVariables
  >
) =>
  ApolloReactHooks.useQuery<TaskCount, GetTaskCountsQueryVariables>(
    GetTaskCountsDocument,
    baseOptions
  )
