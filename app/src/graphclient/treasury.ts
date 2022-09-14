import * as ApolloReactHooks from '@apollo/react-hooks'
import {
  GetTreasuryDocument,
  GetTreasuryQueryVariables,
  GetTreasurysDocument,
  GetTreasurysQueryVariables,
  Treasury
} from 'graphclient'

export const useGetTreasurysQuery = (
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    { treasuries: Treasury[] },
    GetTreasurysQueryVariables
  >
) =>
  ApolloReactHooks.useQuery<
    { treasuries: Treasury[] },
    GetTreasurysQueryVariables
  >(GetTreasurysDocument, baseOptions)

export const useGetTreasuryQuery = (
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    { treasury: Treasury },
    GetTreasuryQueryVariables
  >
) =>
  ApolloReactHooks.useQuery<{ treasury: Treasury }, GetTreasuryQueryVariables>(
    GetTreasuryDocument,
    baseOptions
  )
