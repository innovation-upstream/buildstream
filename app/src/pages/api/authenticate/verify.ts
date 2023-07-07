import cookie from 'cookie'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ApiError } from 'next/dist/server/api-utils'
import { AuthService } from 'services/auth'
import FirestoreClient from '../../../clients/db/firestore'

async function verifyAuthentication(req: NextApiRequest, res: NextApiResponse) {
  const authService = new AuthService(FirestoreClient)
  const { address } = req.body
  const cookies = cookie.parse(req.headers.cookie ?? '')
  const token = cookies['jwt-token']

  const clearCookie = () => {
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('jwt-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        expires: new Date(0),
        sameSite: 'strict',
        path: '/'
      })
    )
  }

  if (!address || !token) clearCookie()
  if (!address) return res.status(400).send({ message: 'Address is required' })
  if (!token) return res.status(401).send({ message: 'Token is invalid' })

  try {
    const status = await authService.verify(address, token)
    res.status(200).send({ verified: status })
  } catch (err: any) {
    console.error(err)
    clearCookie()
    if (err instanceof ApiError)
      return res.status(err.statusCode).send({ message: err.message })
    res.status(500).send({ message: 'Server error' })
  }
}

export default async function verify(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'POST':
      return verifyAuthentication(req, res)
    default:
      return res.status(405).send({ code: 405, message: 'Method not allowed' })
  }
}
