import FirestoreClient from 'clients/db/firestore'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ApiError } from 'next/dist/server/api-utils'
import { UserService } from 'services/user'

async function getUser(req: NextApiRequest, res: NextApiResponse) {
  const userService = new UserService(FirestoreClient)
  const { address } = req.query

  try {
    const user = await userService.get(address as string)
    res.json({ user })
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
      return getUser(req, res)
    default:
      return res.status(405).send({ code: 405, message: 'Method not allowed' })
  }
}
