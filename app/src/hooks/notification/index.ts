import * as ApolloReactHooks from '@apollo/react-hooks'
import {
  GetNotificationsDocument,
  GetNotificationsQueryVariables,
  Notification
} from 'graphclient'

export const useGetNotificationsQuery = (
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    { notifications: Notification[] },
    GetNotificationsQueryVariables
  >
) =>
  ApolloReactHooks.useQuery<
    { notifications: Notification[] },
    GetNotificationsQueryVariables
  >(GetNotificationsDocument, baseOptions)
