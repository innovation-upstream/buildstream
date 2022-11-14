import * as ApolloReactHooks from '@apollo/react-hooks'
import {
  GetUserStatDocument,
  GetUserStatQueryVariables,
  UserStat
} from 'graphclient'
import { usePolling, useWeb3 } from 'hooks'
import { useEffect } from 'react'
import { Converter } from 'utils/converter'

export const useGetUserStatQuery = (
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    { userStat: UserStat },
    GetUserStatQueryVariables
  >
) =>
  ApolloReactHooks.useQuery<{ userStat: UserStat }, GetUserStatQueryVariables>(
    GetUserStatDocument,
    baseOptions
  )

export const useGetUserStatLazyQuery = (
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    { userStat: UserStat },
    GetUserStatQueryVariables
  >
) =>
  ApolloReactHooks.useLazyQuery<
    { userStat: UserStat },
    GetUserStatQueryVariables
  >(GetUserStatDocument, baseOptions)

export const useUserStat = () => {
  const { account } = useWeb3()

  const [getUserStat, { data, startPolling, stopPolling }] =
    useGetUserStatLazyQuery()
  usePolling(startPolling, stopPolling)

  useEffect(() => {
    if (!account) return
    getUserStat({
      variables: {
        id: account
      }
    })
  }, [account, getUserStat])

  const stats = Converter.StatFromQuery(data?.userStat)

  return stats
}
