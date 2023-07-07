import { User, UserWithoutId } from 'models/User/User'

export const getUser = async (address?: string): Promise<{ user: User }> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_CLICKUP_REDIRECT_URL}/api/user/${address || ''}`
  )
  const data = await response.json()
  return data
}

export const createOrUpdateUser = async (user: UserWithoutId) => {
  const response = await fetch(`/api/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
  const data = await response.json()
  return data
}
