import { Token } from '@innovationupstream/buildstream-utils'
import { BigNumber } from 'ethers'
import { Organization } from 'hooks/organization/types'

export enum TaskStatus {
  PROPOSED,
  OPEN,
  ASSIGNED,
  SUBMITTED,
  CLOSED
}

export enum ComplexityScore {
  BASIC,
  BEGINNER,
  INTERMEDIATE,
  ADVANCED,
  COMPLEX
}

export enum TaskRevisionStatus {
  PROPOSED,
  CHANGES_REQUESTED,
  ACCEPTED,
  REQUEST_FOR_NEW_TASK
}

export const TaskStatusMap: Record<TaskStatus, string> = {
  [TaskStatus.PROPOSED]: 'proposed',
  [TaskStatus.OPEN]: 'open',
  [TaskStatus.ASSIGNED]: 'assigned',
  [TaskStatus.SUBMITTED]: 'submitted',
  [TaskStatus.CLOSED]: 'closed'
}

export const ComplexityScoreMap: Record<ComplexityScore, string> = {
  [ComplexityScore.BASIC]: 'simple',
  [ComplexityScore.BEGINNER]: 'beginner',
  [ComplexityScore.INTERMEDIATE]: 'standard',
  [ComplexityScore.ADVANCED]: 'advanced',
  [ComplexityScore.COMPLEX]: 'complex'
}

export type Task = {
  id: number
  externalId: string
  orgId: number
  organization: Organization
  title: string
  description: string
  assigneeAddress: string
  taskTags: Token[]
  status: TaskStatus
  complexityScore: ComplexityScore
  reputationLevel: number
  requiredApprovals: number
  rewardAmount: BigNumber
  rewardToken: string
  taskDuration: number
  approvedBy: string[]
  assigner: string
  assignmentRequests: string[]
  comment: string
  disableSelfAssign: boolean
}

export type TaskSnapshot = {
  actor: string
  taskId: number
  block: BigNumber
  timestamp: BigNumber
} & Task

export type TaskRevision = {
  id: number
  taskSnapshot: {
    comment: string
    status: TaskStatus
  }
  revisionId: string
  requester: string
  externalRevisionId: string
  revisionHash: string
  durationExtension: number
  durationExtensionRequest: number
  status: TaskRevisionStatus
}

export enum TaskReputation {
  ENTRY = 10,
  INTERMEDIATE = 50,
  EXPERT = 100
}

export const TaskReputationMap: Record<TaskReputation, string> = {
  [TaskReputation.ENTRY]: 'Entry',
  [TaskReputation.INTERMEDIATE]: 'Intermediate',
  [TaskReputation.EXPERT]: 'Expert'
}
