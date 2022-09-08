import TaskContractInterface from 'contracts/Task.json'
import TaskStorageContractInterface from 'contracts/TaskStorage.json'
import { BigNumber } from 'ethers'
import getContract from 'utils/getContract'
import { Task } from './types'

export const fetchTaskCountByOrg = async (provider?: any) => {
  const contract = getContract(
    TaskStorageContractInterface.address,
    TaskStorageContractInterface.abi,
    provider
  )

  const taskCount: BigNumber = await contract.getTaskCount()

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
    taskDuration: task.taskDuration ? task.taskDuration.toNumber() : null
  }
}

export const fetchTasksByOrg = async (provider?: any): Promise<Task[]> => {
  let taskIds = []
  const taskCounts = await fetchTaskCountByOrg()

  for (let i = 0; i < taskCounts; i++) {
    taskIds.push(i)
  }

  const tasks = await Promise.all(
    taskIds.map(async (taskId): Promise<Task> => {
      return await fetchTask(taskId, provider)
    })
  )

  return tasks
}

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

export const fetchApprovals = async (
  taskId: number,
  provider?: any
): Promise<string[]> => {
  const contract = getContract(
    TaskContractInterface.address,
    TaskContractInterface.abi,
    provider
  )
  const approvals = await contract.getApprovals(taskId)

  return approvals
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
