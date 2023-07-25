import { Organization } from 'hooks/organization/types'
import { Task } from 'hooks/task/types'

export interface IEditTask {
  organization: Organization
  task: Task
  instructions: string
  close: () => any
  onCreated?: (taskId: number) => void
}
