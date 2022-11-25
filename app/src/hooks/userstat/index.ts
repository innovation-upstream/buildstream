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

export const useUserStat = (address?: string) => {
  const { account } = useWeb3()

  const [getUserStat, { data, startPolling, stopPolling }] =
    useGetUserStatLazyQuery()
  const { disablePolling, enablePolling } = usePolling(
    startPolling,
    stopPolling,
    60 * 1000
  )
  let userId = address
  if (account && !address) {
    userId = account
  }

  useEffect(() => {
    if (!userId) {
      disablePolling()
      return
    }
    getUserStat({
      variables: {
        id: userId
      }
    })
    enablePolling()
  }, [account, address, getUserStat, enablePolling, disablePolling])

  const stats = Converter.StatFromQuery(userId ? data?.userStat : undefined)

  return stats
}
