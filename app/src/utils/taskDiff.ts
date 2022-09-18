import { BigNumber } from 'ethers'
import { TaskSnapshot } from 'hooks/task/types'

const typeMap: { [keyof: string]: string } = {
  title: 'String',
  description: 'String',
  assigneeAddress: 'String',
  taskTags: 'StringArray',
  status: 'Number',
  complexityScore: 'Number',
  reputationLevel: 'Number',
  requiredApprovals: 'Number',
  rewardAmount: 'BigNumber',
  rewardToken: 'String',
  taskDuration: 'Number',
  approvedBy: 'StringArray',
  assigner: 'String',
  assignmentRequests: 'StringArray'
}

// Return true if values are not the same
const diffHandler: { [keyof: string]: (prev: any, curr: any) => boolean } = {
  default: (prev, curr) => false,
  Number: (prev, curr) => prev !== curr,
  String: (prev, curr) => prev !== curr,
  BigNumber: (prev: BigNumber, curr: BigNumber) => !prev.eq(curr),
  StringArray: (prev: string[], curr: string[]) => {
    if (!prev && !curr) return false
    if (!prev || !curr) return true
    const previous = Array.from(new Set(prev))
    const current = Array.from(new Set(curr))
    if (previous.length !== current.length) {
      return true
    }

    return !current.every((v) => previous.includes(v))
  }
}

export const getTaskDiff = (
  taskSnapshots: TaskSnapshot[]
): Partial<TaskSnapshot>[] => {
  const diffs: Partial<TaskSnapshot>[] = [taskSnapshots[0]]
  for (let i = 1; i < taskSnapshots.length; i++) {
    const previous: any = taskSnapshots[i]
    const current: any = taskSnapshots[i - 1]
    const fields = Object.keys(current)
    const diffObject: { [keyof: string]: any } = {}

    for (let j = 0; j < fields.length; j++) {
      const field = fields[j]
      const fieldType = typeMap[field]
      const compareFunc = diffHandler[fieldType] || diffHandler.default
      if (compareFunc(previous[field], current[field])) {
        diffObject[field] = current[field]
      }
    }

    diffObject.actor = current.actor
    diffObject.timestamp = current.timestamp
    diffs.push(diffObject)
  }

  return diffs
}
