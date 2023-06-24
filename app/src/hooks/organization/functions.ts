import OrgContractInterface from 'contracts/Org.json'
import { BigNumber } from 'ethers'
import getContract from 'utils/getContract'

export const createOrganization = async (
  name: string,
  description: string,
  approvers: string[],
  signers: string[],
  initializeOrganization: boolean,
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
    approvers,
    signers,
    initializeOrganization
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
  rewardSlashMultiplier: BigNumber,
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
    rewardSlashMultiplier,
    slashRewardEvery
  )
  await tx.wait()

  return true
}

export const addOrgOnboardingInfo = async (
  onboardingInfo: string,
  organizationId: number
) => {
  const response = await fetch(`/api/onboarding-info/${organizationId}`, {
    method: 'POST',
    body: JSON.stringify({
      onboardingInfo
    }),
    headers: new Headers({ 'Content-Type': 'application/json' })
  })
  const apiResponse = await response.json()
  return apiResponse
}

export const getOrgOnboardingInfo = async (organizationId: number) => {
  try {
    const response = await fetch(`/api/onboarding-info/${organizationId}`, {
      method: 'GET',
      headers: new Headers({ 'Content-Type': 'application/json' })
    })
    const onboardingInfo = await response.json()
    return onboardingInfo
  } catch (err) {
    console.error(err)
  }
}
