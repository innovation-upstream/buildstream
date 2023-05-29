import OrgContractInterface from 'contracts/Org.json'
import TaskContractInterface from 'contracts/Task.json'
import TaskStorageContractInterface from 'contracts/TaskStorage.json'
import { BigNumber } from 'ethers'
import getContract from 'utils/getContract'
import { ComplexityScore, Task, TaskStatus } from './types'

export const openTask = async (
  taskId: number,
  disableSelfAssign: boolean,
  provider?: any
): Promise<boolean> => {
  const contract = getContract(
    TaskContractInterface.address,
    TaskContractInterface.abi,
    provider
  )
  const assignCreator = true
  const tx = await contract['openTask(uint256,bool,bool)'](
    taskId,
    assignCreator,
    disableSelfAssign
  )
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
    dueDate: number
    disableSelfAssign: boolean
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
    task.dueDate,
    false, // Do not request assignment
    task.disableSelfAssign
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

export const getRewardMultiplier = async (
  orgId: number,
  taskTags: number[],
  provider?: any
): Promise<BigNumber> => {
  const contract = getContract(
    OrgContractInterface.address,
    OrgContractInterface.abi,
    provider
  )

  const multiplier = await contract.getRewardMultiplier(orgId, taskTags)

  return multiplier
}

export const getRewardAmount = async (
  task: Task,
  provider?: any
): Promise<BigNumber> => {
  if (task.status > TaskStatus.PROPOSED) return task.rewardAmount
  try {
    const multiplier = await getRewardMultiplier(
      task?.organization.id,
      task.taskTags.map((t) => parseInt(t.id)),
      provider
    )
    return multiplier.mul(task.complexityScore + 1)
  } catch (error) {
    console.error(error)
    return BigNumber.from(0)
  }
}

export const updateTaskInstructions = async (
  organizationId: number,
  taskId: number,
  instructions: string
) => {
  try {
    const response = await fetch(
      `/api/task-instructions/${organizationId}/${taskId}`,
      {
        method: 'POST',
        body: JSON.stringify({
          instructions
        }),
        headers: new Headers({ 'Content-Type': 'application/json' })
      }
    )
    const apiResponse = await response.json()
    return apiResponse
  } catch (err) {
    console.error(err)
  }
}

export const getTaskInstructions = async (
  organizationId: number,
  taskId: number
) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CLICKUP_REDIRECT_URL}/api/task-instructions/${organizationId}/${taskId}`,
      {
        method: 'GET',
        headers: new Headers({ 'Content-Type': 'application/json' })
      }
    )
    const data = await response.json()
    return data?.instructions
  } catch (err) {
    console.error(err)
  }
}
