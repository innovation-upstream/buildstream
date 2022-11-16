export enum ModalType {createTask, taskDetail}

import { Organization } from 'hooks/organization/types'
import { Task } from 'hooks/task/types'

export interface ICreateTask {
  oranization: Organization
  close: () => any
}

export interface ITaskDetail {
  close: () => any
  task: Task
}