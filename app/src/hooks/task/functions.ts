import TaskContractInterface from 'contracts/Task.json'
import { BigNumber } from 'ethers'
import { getOrganizationCount, getOrganizationIds } from 'hooks/organization/functions'
import getContract from 'utils/getContract'
import { Task } from './types'

export const getTaskCount = async (
  orgId: number,
  pending: boolean,
  closed: boolean,
  provider?: any
) => {
  const contract = getContract(
    TaskContractInterface.address,
    TaskContractInterface.abi,
    provider
  )

  const taskCount: BigNumber = await contract.getTaskCount(orgId, pending, closed)

  return taskCount.toNumber()
}

export const getTaskIds = async (
  from: number,
  to: number,
  provider?: any
): Promise<number[]> => {
  const orgCount = await getOrganizationCount()
  const orgIds = await getOrganizationIds(0, orgCount)

  const contract = getContract(
    TaskContractInterface.address,
    TaskContractInterface.abi,
    provider
  )

  const taskIds = await Promise.all(
    orgIds.map(async (orgId): Promise<BigNumber> => {
      const id = await contract.getTaskIds(orgId, from, to)
      return id
    })
  )

  return taskIds.flat().map((id) => id.toNumber())
}

export const getTask = async (taskId: number, provider?: any): Promise<Task> => {

  const contract = getContract(
    TaskContractInterface.address,
    TaskContractInterface.abi,
    provider
  )

  const task = await contract.getTask(taskId)
  return {
    id: task.id.toNumber(),
    orgId: task.orgId.toNumber(),
    title: task.title,
    description: task.description,
    assigneeAddress: task.assigneeAddress,
    taskTags: task.taskTags,
    status: task.status,
    complexityScore: task.complexityScore.toNumber(),
    reputationLevel: task.reputationLevel.toNumber(),
    requiredApprovals: task.requiredApprovals.toNumber(),
    rewardAmount: task.rewardAmount.toNumber(),
    rewardToken: task.rewardToken
  }
}