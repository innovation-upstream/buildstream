import * as ApolloReactHooks from '@apollo/react-hooks'
import {
  GetTaskCountDocument,
  GetTaskCountQuery,
  GetTaskCountQueryVariables,
  GetTaskCountsDocument,
  GetTaskCountsQuery,
  GetTaskCountsQueryVariables,
  GetTaskDocument,
  GetTaskQueryVariables,
  GetTasksDocument,
  GetTaskSnapshotsDocument,
  GetTaskSnapshotsQueryVariables,
  GetTasksQueryVariables,
  GetTaskRevisionsDocument,
  GetTaskRevisionsQueryVariables,
  Task,
  TaskSnapshot,
  TaskRevision
} from 'graphclient'

export const useGetTasksQuery = (
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    { tasks: Task[] },
    GetTasksQueryVariables
  >
) =>
  ApolloReactHooks.useQuery<{ tasks: Task[] }, GetTasksQueryVariables>(
    GetTasksDocument,
    baseOptions
  )

export const useGetTaskQuery = (
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    { task: Task },
    GetTaskQueryVariables
  >
) =>
  ApolloReactHooks.useQuery<{ task: Task }, GetTaskQueryVariables>(
    GetTaskDocument,
    baseOptions
  )

export const useGetTaskCountQuery = (
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetTaskCountQuery,
    GetTaskCountQueryVariables
  >
) =>
  ApolloReactHooks.useQuery<GetTaskCountQuery, GetTaskCountQueryVariables>(
    GetTaskCountDocument,
    baseOptions
  )

export const useGetTasksCountQuery = (
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetTaskCountsQuery,
    GetTaskCountsQueryVariables
  >
) =>
  ApolloReactHooks.useQuery<GetTaskCountsQuery, GetTaskCountsQueryVariables>(
    GetTaskCountsDocument,
    baseOptions
  )

export const useGetTaskSnapshotsQuery = (
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    { taskSnapshots: TaskSnapshot[] },
    GetTaskSnapshotsQueryVariables
  >
) =>
  ApolloReactHooks.useQuery<
    { taskSnapshots: TaskSnapshot[] },
    GetTaskSnapshotsQueryVariables
  >(GetTaskSnapshotsDocument, baseOptions)

export const useGetTaskRevisionsQuery = (
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    { taskRevisions: TaskRevision[] },
    GetTaskRevisionsQueryVariables
  >
) =>
  ApolloReactHooks.useQuery<
    { taskRevisions: TaskRevision[] },
    GetTaskRevisionsQueryVariables
  >(GetTaskRevisionsDocument, baseOptions)
