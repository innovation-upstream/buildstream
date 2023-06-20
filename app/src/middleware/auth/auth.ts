import cookie from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function authMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  next: (req: NextApiRequest, res: NextApiResponse) => void
) {
  const cookies = cookie.parse(req.headers.cookie ?? '')
  const userToken = cookies['jwt-token']

  if (!userToken)
    return res.status(401).send({ message: 'Please authenticate to use' })

  return next(req, res)
}
