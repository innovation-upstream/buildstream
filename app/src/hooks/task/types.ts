export type Task = {
  id: number
  orgId: number
  title: string
  description: string
  assigneeAddress: string
  taskTags: string[]
  status: string
  complexityScore: number
  reputationLevel: number
  requiredApprovals: number
  rewardAmount: number
  rewardToken: string
}