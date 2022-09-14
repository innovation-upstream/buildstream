import * as ApolloReactHooks from '@apollo/react-hooks'
import {
  GetOrganizationDocument,
  GetOrganizationQueryVariables,
  GetOrganizationsDocument,
  GetOrganizationsQueryVariables,
  Organization
} from 'graphclient'

export const useGetOrganizationsQuery = (
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    { organizations: Organization[] },
    GetOrganizationsQueryVariables
  >
) =>
  ApolloReactHooks.useQuery<
    { organizations: Organization[] },
    GetOrganizationsQueryVariables
  >(GetOrganizationsDocument, baseOptions)

export const useGetOrganizationQuery = (
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    { organization: Organization },
    GetOrganizationQueryVariables
  >
) =>
  ApolloReactHooks.useQuery<
    { organization: Organization },
    GetOrganizationQueryVariables
  >(GetOrganizationDocument, baseOptions)
