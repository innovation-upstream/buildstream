export interface TImport {
  organizationId: number
  clickupCode: string
  clickupToken?: string
  close: () => any
}

export type ISpaces = {
  id: string
  name: string
}
