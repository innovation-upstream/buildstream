import { Organization } from 'hooks/organization/types'
import { Task } from 'hooks/task/types'

export interface ICreateTask {
  organization: Organization
  close: () => any
}

export interface ITaskDetail {
  close: () => any
  task: Task
}