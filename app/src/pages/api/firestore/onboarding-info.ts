import type { NextApiRequest, NextApiResponse } from 'next'
import FirestoreClient from '../clients/firestore'

export default async function getOnboardingInfo(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { organizationId } = req.body

  try {
    const snapshot = await FirestoreClient.collection('organizations')
      .doc(organizationId.toString())
      .get()

    const onboardingInfo = snapshot.data()?.onboarding_info

    if (!onboardingInfo)
      return res.status(404).send({ code: 404, message: 'Data not found' })

    res.json({ onboarding_info: onboardingInfo })
  } catch (err: any) {
    console.error(err)
    res.status(404).send({ code: err.status, message: err.message })
  }
}
