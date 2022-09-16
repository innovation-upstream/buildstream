import TaskContractInterface from 'contracts/Task.json'
import TaskStorageContractInterface from 'contracts/TaskStorage.json'
import { BigNumber } from 'ethers'
import getContract from 'utils/getContract'
import { Task, ComplexityScore } from './types'

export const openTask = async (
  taskId: number,
  rewardToken: string,
  provider?: any
): Promise<boolean> => {
  const contract = getContract(
    TaskContractInterface.address,
    TaskContractInterface.abi,
    provider
  )
  const tx = await contract.openTask(taskId, rewardToken)
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
  comment: string,
  provider?: any
): Promise<boolean> => {
  const contract = getContract(
    TaskContractInterface.address,
    TaskContractInterface.abi,
    provider
  )

  const tx = await contract.submitTask(taskId, comment)
  await tx.wait()

  return true
}

export const approveTask = async (
  taskId: number,
  provider?: any
): Promise<boolean> => {
  const contract = getContract(
    TaskContractInterface.address,
    TaskContractInterface.abi,
    provider
  )

  const tx = await contract.approveTask(taskId)
  await tx.wait()

  return true
}

export const createNewTask = async (
  orgId: number,
  title: string,
  description: string,
  taskTags: string[],
  complexityScore: number,
  reputationLevel: number,
  taskDuration: number,
  provider?: any
): Promise<number> => {
  const contract = getContract(
    TaskContractInterface.address,
    TaskContractInterface.abi,
    provider
  )
  const taskStorageContract = getContract(
    TaskStorageContractInterface.address,
    TaskStorageContractInterface.abi,
    provider
  )

  const tx = await contract.createTask(
    orgId,
    title,
    description,
    taskTags,
    complexityScore,
    reputationLevel,
    taskDuration
  )

  const taskCreateReceipt = await tx.wait()
  const eventFilter = taskStorageContract.filters.TaskCreation()
  const events = await taskStorageContract.queryFilter(eventFilter)

  const taskEvent = events?.find(
    (e) => e.transactionHash === taskCreateReceipt.events?.[0].transactionHash
  )

  const taskId = taskEvent?.args?.[0]?.toNumber() as number
  return taskId
}

export const archiveTask = async (
  taskId: number,
  provider?: any
): Promise<boolean> => {
  const contract = getContract(
    TaskContractInterface.address,
    TaskContractInterface.abi,
    provider
  )

  const response = await contract.archive(taskId)
  await response.wait()

  return true
}

export const editTask = async (
  taskId: number,
  complexityScore: ComplexityScore,
  reputationLevel: number,
  taskDuration: number,
  provider?: any
): Promise<boolean> => {
  const contract = getContract(
    TaskContractInterface.address,
    TaskContractInterface.abi,
    provider
  )

  const response = await contract.updateTaskRequirement(
    taskId,
    complexityScore,
    reputationLevel,
    taskDuration
  )
  await response.wait()

  return true
}
