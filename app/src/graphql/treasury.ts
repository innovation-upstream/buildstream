import * as ApolloReactHooks from '@apollo/react-hooks'
import {
  GetTreasuryDocument,
  GetTreasuryQueryVariables,
  GetTreasurysDocument,
  GetTreasurysQueryVariables,
  Treasury
} from 'graphql'

export const useGetTreasurysQuery = (
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    Treasury,
    GetTreasurysQueryVariables
  >
) =>
  ApolloReactHooks.useQuery<Treasury, GetTreasurysQueryVariables>(
    GetTreasurysDocument,
    baseOptions
  )

export const useGetTreasuryQuery = (
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    Treasury,
    GetTreasuryQueryVariables
  >
) =>
  ApolloReactHooks.useQuery<Treasury, GetTreasuryQueryVariables>(
    GetTreasuryDocument,
    baseOptions
  )
