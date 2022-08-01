import OrgContractInterface from 'contracts/Org.json'
import { BigNumber } from 'ethers'
import getContract from 'utils/getContract'
import { Organization } from './types'

export const fetchOrganizationCount = async (
  provider?: any
): Promise<number> => {
  const contract = getContract(
    OrgContractInterface.address,
    OrgContractInterface.abi,
    provider
  )

  const orgCount: BigNumber = await contract.getOrgCount()

  return orgCount.toNumber()
}

export const fetchOrganizationIds = async (
  from: number,
  to: number,
  provider?: any
): Promise<number[]> => {
  const contract = getContract(
    OrgContractInterface.address,
    OrgContractInterface.abi,
    provider
  )

  const orgIds: BigNumber[] = await contract.getOrgIds(from, to)

  return orgIds.map((id) => id.toNumber())
}

export const fetchOrganization = async (
  orgId: number,
  provider?: any
): Promise<Organization> => {
  const contract = getContract(
    OrgContractInterface.address,
    OrgContractInterface.abi,
    provider
  )

  const organization = await contract.getOrganization(orgId)

  return {
    id: organization.id.toNumber(),
    name: organization.name,
    description: organization.description,
    reviewers: organization.reviewers,
    approvers: organization.approvers,
    signers: organization.signers,
    requiredTaskApprovals: organization.requiredTaskApprovals.toNumber(),
    requiredConfirmations: organization.requiredConfirmations.toNumber(),
    rewardMultiplier: organization.rewardMultiplier,
    rewardToken: organization.rewardToken
  }
}

export const fetchOrganizations = async (
  from: number,
  to: number,
  provider?: any
) => {
  const orgIds = await fetchOrganizationIds(from, to, provider)
  const orgs = await Promise.all(
    orgIds.map(async (orgId): Promise<Organization> => {
      const org = await fetchOrganization(orgId, provider)
      return org
    })
  )

  return orgs
}

export const executeAction = async (
  actionId: number,
  provider?: any
) => {
  const contract = getContract(
    OrgContractInterface.address,
    OrgContractInterface.abi,
    provider
  )

  const tx = await contract.executeAction(actionId)
  await tx.wait()
}
