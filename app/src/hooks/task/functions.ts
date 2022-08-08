import TaskContractInterface from 'contracts/Task.json'
import { BigNumber } from 'ethers'
import getContract from 'utils/getContract'
import { Task } from './types'

export const fetchTaskCountByOrg = async (
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

  const taskCount: BigNumber = await contract.getTaskCount(
    orgId,
    pending,
    closed
  )

  return taskCount.toNumber()
}

export const fetchTaskIdsByOrg = async (
  orgId: number,
  from: number,
  to: number,
  provider?: any
): Promise<number[]> => {
  const contract = getContract(
    TaskContractInterface.address,
    TaskContractInterface.abi,
    provider
  )

  const taskIds: BigNumber[] = await contract.getTaskIds(orgId, from, to)

  return taskIds.map((id) => id.toNumber())
}

export const fetchTask = async (
  taskId: number,
  provider?: any
): Promise<Task> => {
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
    rewardToken: task.rewardToken,
  }
}

export const fetchTasksByOrg = async (
  orgId: number,
  from: number,
  to: number,
  provider?: any
): Promise<Task[]> => {
  const taskIds = await fetchTaskIdsByOrg(orgId, from, to, provider)

  const tasks = await Promise.all(
    taskIds.map(async (taskId): Promise<Task> => {
      return await fetchTask(taskId, provider)
    })
  )

  return tasks
}

export const openTask = async (
  taskId: number,
  provider?: any
): Promise<boolean> => {
  const contract = getContract(
    TaskContractInterface.address,
    TaskContractInterface.abi,
    provider
  )

  const tx = await contract['openTask(uint256)'](taskId)
  await tx.wait()

  return true
}

export const assignToSelf = async (
  taskId: number,
  provider?: any
): Promise<boolean> => {
  const contract = getContract(
    TaskContractInterface.address,
    TaskContractInterface.abi,
    provider
  )

  const tx = await contract.assignSelf(taskId)
  await tx.wait()

  return true
}

export const approveAssignedRequest = async (
  taskId: number,
  account: string,
  provider?: any
): Promise<boolean> => {
  const contract = getContract(
    TaskContractInterface.address,
    TaskContractInterface.abi,
    provider
  )

  const tx = await contract.approveAssignRequest(taskId, account)
  await tx.wait()

  return true
}

export const taskSubmission = async (
  taskId: number,
  provider?: any
): Promise<boolean> => {
  const contract = getContract(
    TaskContractInterface.address,
    TaskContractInterface.abi,
    provider
  )

  const tx = await contract.submitTask(taskId)
  await tx.wait()

  return true
}

export const fetchAssignedRequests = async (
  taskId: number,
  provider?: any
): Promise<[]> => {
  const contract = getContract(
    TaskContractInterface.address,
    TaskContractInterface.abi,
    provider
  )
  const accounts = await contract.getAssignmentRequests(taskId)

  return accounts
}
