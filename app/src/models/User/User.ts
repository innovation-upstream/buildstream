export type User = {
  id: string
  displayName?: string
  email?: string
  githubProfile?: string
}

export type UserWithoutId = Omit<User, 'id'>
