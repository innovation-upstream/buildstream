import OrgContractInterface from 'contracts/Org.json'
import { BigNumber } from 'ethers'
import getContract from 'utils/getContract'
import { Organization } from './types'

export const getOrganizationCount = async (provider?: any): Promise<number> => {
  const contract = getContract(
    OrgContractInterface.address,
    OrgContractInterface.abi,
    provider
  )

  const orgCount: BigNumber = await contract.getOrgCount()

  return orgCount.toNumber()
}

export const getOrganizationIds = async (
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

export const getOrganization = async (
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
