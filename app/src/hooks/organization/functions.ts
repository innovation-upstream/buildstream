import OrgContractInterface from 'contracts/Org.json'
import { BigNumber } from 'ethers'
import getContract from 'utils/getContract'

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
  try {
    const response = await fetch('/api/firestore/set-onboarding-info', {
      method: 'POST',
      body: JSON.stringify({
        onboardingInfo: onboardingInfo,
        organizationId: organizationId
      }),
      headers: new Headers({ 'Content-Type': 'application/json' })
    })
    const apiResponse = await response.json()
    return apiResponse
  } catch (err) {
    console.error(err)
  }
}

export const getOrgOnboardingInfo = async (organizationId: number) => {
  try {
    const response = await fetch('/api/firestore/onboarding-info', {
      method: 'POST',
      body: JSON.stringify({
        organizationId
      }),
      headers: new Headers({ 'Content-Type': 'application/json' })
    })
    const onboardingInfo = await response.json()
    return onboardingInfo
  } catch (err) {
    console.error(err)
  }
}
