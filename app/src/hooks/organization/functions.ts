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
    false
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
