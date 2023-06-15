import { GetOrganizationsDocument, Organization } from 'graphclient'
import client from 'graphclient/client'
import { IUserOrganizations } from './types'

export const getUserOrganizations = async (
  account: string
): Promise<IUserOrganizations> => {
  let memberOrganizations: Organization[] = []
  let approverOrganizations: Organization[] = []
  let signerOrganizations: Organization[] = []

  if (account) {
    const { data: memberOrgs } = await client.query({
      query: GetOrganizationsDocument,
      variables: {
        where: {
          members_contains_nocase: [account?.toString()]
        }
      }
    })
    const { data: approverOrgs } = await client.query({
      query: GetOrganizationsDocument,
      variables: {
        where: {
          approvers_contains_nocase: [account?.toString()]
        }
      }
    })
    const { data: signerOrgs } = await client.query({
      query: GetOrganizationsDocument,
      variables: {
        where: {
          signers_contains_nocase: [account?.toString()]
        }
      }
    })
    memberOrganizations = (memberOrgs?.organizations as any) || []
    approverOrganizations = (approverOrgs?.organizations as any) || []
    signerOrganizations = (signerOrgs?.organizations as any) || []
  }

  return {
    memberOrganizations,
    approverOrganizations,
    signerOrganizations
  }
}
