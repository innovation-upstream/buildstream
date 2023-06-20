import cookie from 'cookie'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ApiError } from 'next/dist/server/api-utils'
import { AuthService } from 'services/auth'
import FirestoreClient from '../../../clients/db/firestore'

async function initiateAuthentication(req: NextApiRequest, res: NextApiResponse) {
  const authService = new AuthService(FirestoreClient)
  const { address } = req.body

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

  try {
    const otp = await authService.initiate(address)
    res.status(200).send({ otp })
  } catch (err: any) {
    console.error(err)
    if (err instanceof ApiError)
      return res.status(err.statusCode).send({ message: err.message })
    res.status(500).send({ message: 'Server error' })
  }
}

export default async function initiate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'POST':
      return initiateAuthentication(req, res)
    default:
      return res.status(405).send({ code: 405, message: 'Method not allowed' })
  }
}
