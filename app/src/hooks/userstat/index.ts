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
  const { disablePolling, enablePolling } = usePolling(
    startPolling,
    stopPolling,
    60 * 1000
  )

  useEffect(() => {
    if (!account) {
      disablePolling()
      return
    }
    getUserStat({
      variables: {
        id: account
      }
    })
    enablePolling()
  }, [account, getUserStat, enablePolling, disablePolling])

  const stats = Converter.StatFromQuery(account ? data?.userStat : undefined)

  return stats
}
