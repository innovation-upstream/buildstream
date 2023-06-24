import cookie from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'
import { AuthService } from 'services/auth'
import FirestoreClient from '../../clients/db/firestore'

export interface NextApiRequestWithUser extends NextApiRequest {
  user: string
}

export default async function authMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  next: (req: NextApiRequestWithUser, res: NextApiResponse) => void
) {
  const cookies = cookie.parse(req.headers.cookie ?? '')
  const userToken = cookies['jwt-token']

  if (!userToken)
    return res.status(401).send({ message: 'Please authenticate to use' })
  
  const authService = new AuthService(FirestoreClient)
  const address = await authService.getUser(userToken)

  if (!address)
    return res.status(401).send({ message: 'Please authenticate to use' })

  const newRequest = req as NextApiRequestWithUser
  newRequest.user = address

  return next(newRequest, res)
}
