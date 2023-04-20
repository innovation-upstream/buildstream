import { Organization } from 'hooks/organization/types'

export interface TImport {
  organization: Organization
  clickupCode: string
  clickupToken?: string
  close: () => any
  onCreated?: (taskId: number) => void
}

export type ISpaces = {
  id: string
  name: string
}
