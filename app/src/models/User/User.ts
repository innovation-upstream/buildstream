export type User = {
  id: string
  displayName?: string
}

export type UserWithoutId = Omit<User, 'id'>
