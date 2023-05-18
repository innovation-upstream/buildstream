import type { NextApiRequest, NextApiResponse } from 'next'
import { ApiError } from 'next/dist/server/api-utils'
import { OnboardingInfo } from 'services'
import FirestoreClient from '../../../clients/firestore'

async function getOnboardingInfo(req: NextApiRequest, res: NextApiResponse) {
  const organizationId = req.query.organization?.[0] as string
  const onboardingInfoService = new OnboardingInfo(FirestoreClient)

  try {
    const info = await onboardingInfoService.get(organizationId)
    res.json({ onboarding_info: info })
  } catch (err: any) {
    console.error(err)
    if (err instanceof ApiError)
      return res.status(err.statusCode).send({ message: err.message })
    res.status(500).send({ message: 'Server error' })
  }
}

async function setOnboardingInfo(req: NextApiRequest, res: NextApiResponse) {
  const organizationId = req.query.organization?.[0] as string
  const { onboardingInfo } = req.body
  const onboardingInfoService = new OnboardingInfo(FirestoreClient)

  try {
    await onboardingInfoService.set(organizationId, onboardingInfo)
    res.status(200).send({ message: 'Onboarding info updated' })
  } catch (err: any) {
    console.error(err)
    if (err instanceof ApiError)
      return res.status(err.statusCode).send({ message: err.message })
    res.status(500).send({ message: 'Server error' })
  }
}

export default async function onboardingInfo(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      return getOnboardingInfo(req, res)
    case 'POST':
      return setOnboardingInfo(req, res)
    default:
      return res.status(405).send({ code: 405, message: 'Method not allowed' })
  }
}
