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

export const TaskStatusMap: Record<TaskStatus, string> = {
  [TaskStatus.PROPOSED]: 'proposed',
  [TaskStatus.OPEN]: 'open',
  [TaskStatus.ASSIGNED]: 'assigned',
  [TaskStatus.SUBMITTED]: 'submitted',
  [TaskStatus.CLOSED]: 'closed'
}

export const ComplexityScoreMap: Record<ComplexityScore, string> = {
  [ComplexityScore.BASIC]: 'basic',
  [ComplexityScore.BEGINNER]: 'beginner',
  [ComplexityScore.INTERMEDIATE]: 'intermediate',
  [ComplexityScore.ADVANCED]: 'advanced',
  [ComplexityScore.COMPLEX]: 'complex'
}

export type Task = {
  id: number
  orgId: number
  title: string
  description: string
  assigneeAddress: string
  taskTags: string[]
  status: TaskStatus
  complexityScore: ComplexityScore
  reputationLevel: number
  requiredApprovals: number
  rewardAmount: number
  rewardToken: string
  taskDuration: number
}
