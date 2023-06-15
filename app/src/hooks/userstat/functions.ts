import { GetOrganizationsDocument } from 'graphclient'
import client from 'graphclient/client'

export const getUserOrganizations = async (account: string) => {
  let memberOrganizationIds: string[] = []
  let approverOrganizationIds: string[] = []
  let signerOrganizationIds: string[] = []

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
    memberOrganizationIds = memberOrgs?.organizations?.map((o) => o.id) || []
    approverOrganizationIds =
      approverOrgs?.organizations?.map((o) => o.id) || []
    signerOrganizationIds = signerOrgs?.organizations?.map((o) => o.id) || []
  }

  return {
    memberOrganizationIds,
    approverOrganizationIds,
    signerOrganizationIds
  }
}
