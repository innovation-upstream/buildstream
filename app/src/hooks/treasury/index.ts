import * as ApolloReactHooks from '@apollo/react-hooks'
import {
  GetTreasuryDocument,
  GetTreasuryQueryVariables,
  GetTreasurysDocument,
  GetTreasurysQueryVariables,
  GetDepositsDocument,
  GetDepositsQueryVariables,
  Deposit,
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

export const useGetDepositsQuery = (
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    { deposits: Deposit[] },
    GetDepositsQueryVariables
  >
) =>
  ApolloReactHooks.useQuery<{ deposits: Deposit[] }, GetDepositsQueryVariables>(
    GetTreasuryDocument,
    baseOptions
  )
