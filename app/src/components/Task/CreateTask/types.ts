import { Organization } from 'hooks/organization/types'
import { Task } from 'hooks/task/types'

export interface ICreateTask {
  organization: Organization
  close: () => any
  onCreated?: (taskId: number) => void
}

export interface ITaskDetail {
  close: () => any
  task: Task
}
