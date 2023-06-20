import cookie from 'cookie'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ApiError } from 'next/dist/server/api-utils'
import { AuthService } from 'services/auth'
import FirestoreClient from '../../../clients/db/firestore'

async function authenticateSelf(req: NextApiRequest, res: NextApiResponse) {
  const authService = new AuthService(FirestoreClient)
  const { address, message } = req.body

  if (!address || !message)
    return res.status(400).send({ message: 'Address and message are required' })

  try {
    const token = await authService.authenticate(address, message)
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('jwt-token', String(token), {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: 'strict',
        path: '/'
      })
   )
    res.status(200).send({ success: true, token })
  } catch (err: any) {
    console.error(err)
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
    if (err instanceof ApiError)
      return res.status(err.statusCode).send({ message: err.message })
    res.status(500).send({ message: 'Server error' })
  }
}

export default async function authenticate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'POST':
      return authenticateSelf(req, res)
    default:
      return res.status(405).send({ code: 405, message: 'Method not allowed' })
  }
}
