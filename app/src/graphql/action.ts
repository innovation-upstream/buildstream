import * as ApolloReactHooks from '@apollo/react-hooks'
import {
  Action,
  GetActionDocument,
  GetActionQueryVariables,
  GetActionsDocument,
  GetActionsQueryVariables
} from 'graphql'

export const useGetActionsQuery = (
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    Action,
    GetActionsQueryVariables
  >
) =>
  ApolloReactHooks.useQuery<Action, GetActionsQueryVariables>(
    GetActionsDocument,
    baseOptions
  )

export const useGetActionQuery = (
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    Action,
    GetActionQueryVariables
  >
) =>
  ApolloReactHooks.useQuery<Action, GetActionQueryVariables>(
    GetActionDocument,
    baseOptions
  )
