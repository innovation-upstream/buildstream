import type { NextApiRequest, NextApiResponse } from 'next'
import FirestoreClient from '../clients/firestore'

export default async function getOnboardingInfo(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { organizationId, onboardingInfo } = req.body
  console.log('HEREE ====', organizationId)
  console.log('HEREE ====', onboardingInfo)


  try {
    const docRef = FirestoreClient.collection('organizations').doc(
      organizationId.toString()
    )

    await docRef.set(
      {
        onboarding_info: onboardingInfo
      },
      { merge: true }
    )

    res.status(200).json({ onboarding_info: onboardingInfo })
  } catch (err: any) {
    console.log('ERROR====', err)
    res.status(400).send({ code: err.status, message: err.message })
  }
}
