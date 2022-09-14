import * as ApolloReactHooks from '@apollo/react-hooks'
import {
  GetActionQuery,
  GetActionsQuery,
  GetActionDocument,
  GetActionQueryVariables,
  GetActionsDocument,
  GetActionsQueryVariables
} from 'graphclient'

export const useGetActionsQuery = (
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetActionsQuery,
    GetActionsQueryVariables
  >
) =>
  ApolloReactHooks.useQuery<GetActionsQuery, GetActionsQueryVariables>(
    GetActionsDocument,
    baseOptions
  )

export const useGetActionQuery = (
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetActionQuery,
    GetActionQueryVariables
  >
) =>
  ApolloReactHooks.useQuery<GetActionQuery, GetActionQueryVariables>(
    GetActionDocument,
    baseOptions
  )
