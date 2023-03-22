import { BigNumber } from 'ethers'

export type Stat = {
  id: string
  proposedTasks: BigNumber
  openedTasks: BigNumber
  assignedTasks: BigNumber
  submittedTasks: BigNumber
  closedTasks: BigNumber
  archivedTasks: BigNumber
  tags: number[]
}
