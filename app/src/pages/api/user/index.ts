import FirestoreClient from 'clients/db/firestore'
import { authMiddleware } from 'middleware/auth'
import { NextApiRequestWithUser } from 'middleware/auth/auth'
import { UserWithoutId } from 'models/User/User'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ApiError } from 'next/dist/server/api-utils'
import { UserService } from 'services/user'

async function getUser(req: NextApiRequestWithUser, res: NextApiResponse) {
  const userService = new UserService(FirestoreClient)

  try {
    const user = await userService.get(req.user)
    res.json({ user })
  } catch (err: any) {
    console.error(err)
    if (err instanceof ApiError)
      return res.status(err.statusCode).send({ message: err.message })
    res.status(500).send({ message: 'Server error' })
  }
}

async function createOrUpdateUser(req: NextApiRequestWithUser, res: NextApiResponse) {
  const userService = new UserService(FirestoreClient)
  const userData = req.body as UserWithoutId

  try {
    await userService.createOrUpdate(req.user, userData)
    res.status(200).send({ message: 'User updated' })
  } catch (err: any) {
    console.error(err)
    if (err instanceof ApiError)
      return res.status(err.statusCode).send({ message: err.message })
    res.status(500).send({ message: 'Server error' })
  }
}

export default async function userController(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      return authMiddleware(req, res, getUser)
    case 'POST':
      return authMiddleware(req, res, createOrUpdateUser)
    default:
      return res.status(405).send({ code: 405, message: 'Method not allowed' })
  }
}
