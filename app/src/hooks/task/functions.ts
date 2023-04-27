import TaskContractInterface from 'contracts/Task.json'
import TaskStorageContractInterface from 'contracts/TaskStorage.json'
import getContract from 'utils/getContract'
import { ComplexityScore } from './types'

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
  const tx = await contract.openTask(taskId, rewardToken, true)
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
  task: {
    externalId: string
    orgId: number
    title: string
    description: string
    taskTags: number[]
    complexityScore: number
    reputationLevel: number
    taskDuration: number
    shouldOpenTask: boolean
  },
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
    task.externalId,
    task.orgId,
    task.title,
    task.description,
    task.taskTags,
    task.complexityScore,
    task.reputationLevel,
    task.taskDuration,
    false,
    task.shouldOpenTask,
    false // Enable self assign
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
  title: string,
  description: string,
  taskTags: number[],
  complexityScore: ComplexityScore,
  reputationLevel: number,
  taskDuration: number,
  provider?: any
): Promise<boolean> => {
  const externalId = ''
  const contract = getContract(
    TaskContractInterface.address,
    TaskContractInterface.abi,
    provider
  )

  const response = await contract.updateTask(
    taskId,
    externalId,
    title,
    description,
    taskTags,
    complexityScore,
    reputationLevel,
    taskDuration
  )
  await response.wait()

  return true
}

export const requestTaskReview = async (
  taskId: number,
  reviewId: string,
  revisionHash: string,
  durationExtension: number,
  provider?: any
): Promise<boolean> => {
  const contract = getContract(
    TaskContractInterface.address,
    TaskContractInterface.abi,
    provider
  )
  const response = await contract.requestForTaskRevision(
    taskId,
    reviewId,
    revisionHash,
    durationExtension
  )
  await response.wait()

  return true
}

export const changeTaskDuration = async (
  taskId: number,
  revisionIndex: number,
  durationExtension: number,
  provider?: any
): Promise<boolean> => {
  const taskStorageContract = getContract(
    TaskStorageContractInterface.address,
    TaskStorageContractInterface.abi,
    provider
  )

  const response =
    await taskStorageContract.requestForTaskRevisionDurationExtension(
      taskId,
      revisionIndex,
      durationExtension
    )
  await response.wait()
  return true
}

export const acceptRevision = async (
  taskId: number,
  revisionIndex: number,
  provider?: any
): Promise<boolean> => {
  const taskStorageContract = getContract(
    TaskStorageContractInterface.address,
    TaskStorageContractInterface.abi,
    provider
  )

  const response = await taskStorageContract.acceptTaskRevision(
    taskId,
    revisionIndex
  )
  await response.wait()
  return true
}

export const disputeAssignedTask = async (
  taskId: number,
  revisionIndex: number,
  provider?: any
): Promise<boolean> => {
  const taskStorageContract = getContract(
    TaskStorageContractInterface.address,
    TaskStorageContractInterface.abi,
    provider
  )

  const response = await taskStorageContract.rejectTaskRevision(
    taskId,
    revisionIndex
  )
  await response.wait()
  return true
}
