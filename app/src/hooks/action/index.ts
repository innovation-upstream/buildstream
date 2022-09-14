import * as ApolloReactHooks from '@apollo/react-hooks'
import {
  GetActionQuery,
  GetActionsQuery,
  GetActionDocument,
  GetActionQueryVariables,
  GetActionsDocument,
  GetActionsQueryVariables,
  Action
} from 'graphclient'

export const useGetActionsQuery = (
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    { actions: Action[] },
    GetActionsQueryVariables
  >
) =>
  ApolloReactHooks.useQuery<{ actions: Action[] }, GetActionsQueryVariables>(
    GetActionsDocument,
    baseOptions
  )

export const useGetActionQuery = (
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    { action: Action },
    GetActionQueryVariables
  >
) =>
  ApolloReactHooks.useQuery<{ action: Action }, GetActionQueryVariables>(
    GetActionDocument,
    baseOptions
  )
