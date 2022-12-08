import { BigNumber } from 'ethers'
import { Action, ActionSnapshot } from 'hooks/action/types'
import { Organization } from 'hooks/organization/types'
import { Task, TaskSnapshot } from 'hooks/task/types'
import { DepositRecord } from 'hooks/treasury/types'

export type Stat = {
  id: string
  proposedTasks: BigNumber
  openedTasks: BigNumber
  assignedTasks: BigNumber
  submittedTasks: BigNumber
  closedTasks: BigNumber
  archivedTasks: BigNumber
  tags: string[]
}

export type Notification = {
  id: string
  tags: string[]
  users?: string[]
  orgId: Organization
  task?: Task
  action?: Action
  deposit?: DepositRecord
  taskSnapshot?: TaskSnapshot
  actionSnapshot?: ActionSnapshot
  timestamp: BigNumber
}
