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
): Promise<
  Pick<
    Organization,
    | 'id'
    | 'name'
    | 'description'
    | 'reviewers'
    | 'approvers'
    | 'signers'
    | 'isInitialized'
  >
> => {
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
    isInitialized: organization.isInitialized
  }
}

export const fetchOrganizationConfig = async (
  orgId: number,
  provider?: any
): Promise<
  Pick<
    Organization,
    | 'requiredTaskApprovals'
    | 'requiredConfirmations'
    | 'rewardMultiplier'
    | 'rewardToken'
    | 'rewardSlashDivisor'
    | 'slashRewardEvery'
  >
> => {
  const contract = getContract(
    OrgContractInterface.address,
    OrgContractInterface.abi,
    provider
  )

  const orgConfig = await contract.getOrganizationConfig(orgId)

  return {
    requiredTaskApprovals: orgConfig.requiredTaskApprovals,
    requiredConfirmations: orgConfig.requiredConfirmations,
    rewardMultiplier: orgConfig.rewardMultiplier,
    rewardToken: orgConfig.rewardToken,
    rewardSlashDivisor: orgConfig.rewardSlashDivisor,
    slashRewardEvery: orgConfig.slashRewardEvery
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
      const orgConfig = await fetchOrganizationConfig(orgId, provider)
      return { ...org, ...orgConfig }
    })
  )

  return orgs
}

export const fetchSingleOrganization = async (
  orgId: number,
  provider?: any
) => {
  const org = await fetchOrganization(orgId, provider)
  const orgConfig = await fetchOrganizationConfig(orgId, provider)
  return { ...org, ...orgConfig }
}

export const executeAction = async (actionId: number, provider?: any) => {
  const contract = getContract(
    OrgContractInterface.address,
    OrgContractInterface.abi,
    provider
  )

  const tx = await contract.executeAction(actionId)
  await tx.wait()
}

export const createOrganization = async (
  name: string,
  description: string,
  reviewers: string[],
  approvers: string[],
  signers: string[],
  provider: any
): Promise<number> => {
  const contract = getContract(
    OrgContractInterface.address,
    OrgContractInterface.abi,
    provider
  )

  const tx = await contract.createOrg(
    name,
    description,
    reviewers,
    approvers,
    signers
  )
  const response = await tx.wait()
  const event = response?.events?.find(
    (e: any) => e.event === 'OrganizationCreation'
  )

  return event?.args?.[0]?.toNumber()
}

export const addOrganizationConfig = async (
  orgId: number,
  requiredTaskApprovals: number,
  requiredConfirmations: number,
  rewardMultiplier: BigNumber,
  rewardToken: string,
  rewardSlashDivisor: BigNumber,
  slashRewardEvery: number,
  provider?: any
): Promise<boolean> => {
  const contract = getContract(
    OrgContractInterface.address,
    OrgContractInterface.abi,
    provider
  )

  const tx = await contract.addOrgConfig(
    orgId,
    rewardMultiplier,
    rewardToken,
    requiredConfirmations,
    requiredTaskApprovals,
    rewardSlashDivisor,
    slashRewardEvery
  )
  await tx.wait()

  return true
}
