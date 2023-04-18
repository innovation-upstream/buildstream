export interface TImport {
  organizationId: number
  clickupCode: string
  clickupToken?: string
  close: () => any
  onCreated?: (taskId: number) => void
}

export type ISpaces = {
  id: string
  name: string
}
