import { BigNumber } from 'ethers'
import { Organization } from '../../../.graphclient'

export type Stat = {
  id: string
  proposedTasks: BigNumber
  openedTasks: BigNumber
  assignedTasks: BigNumber
  submittedTasks: BigNumber
  closedTasks: BigNumber
  archivedTasks: BigNumber
  tokens: {
    id: string
    token: number
    count: number
  }[]
}

export interface IUserOrganizations {
  memberOrganizations: Organization[]
  approverOrganizations: Organization[]
  signerOrganizations: Organization[]
}
