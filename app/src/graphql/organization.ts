import * as ApolloReactHooks from '@apollo/react-hooks'
import {
  GetOrganizationDocument,
  GetOrganizationQueryVariables,
  GetOrganizationsDocument,
  GetOrganizationsQueryVariables,
  Organization
} from 'graphql'

export const useGetOrganizationsQuery = (
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    Organization,
    GetOrganizationsQueryVariables
  >
) =>
  ApolloReactHooks.useQuery<Organization, GetOrganizationsQueryVariables>(
    GetOrganizationsDocument,
    baseOptions
  )

export const useGetOrganizationQuery = (
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    Organization,
    GetOrganizationQueryVariables
  >
) =>
  ApolloReactHooks.useQuery<Organization, GetOrganizationQueryVariables>(
    GetOrganizationDocument,
    baseOptions
  )
