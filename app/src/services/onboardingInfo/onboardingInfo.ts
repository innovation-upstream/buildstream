import { GetOrganizationDocument } from 'graphclient'
import client from 'graphclient/client'
import { ApiError } from 'next/dist/server/api-utils'

export default class OnboardingInfo {
  private client: FirebaseFirestore.Firestore

  constructor(_client: FirebaseFirestore.Firestore) {
    this.client = _client
  }

  public async get(organizationId: string): Promise<string> {
    const snapshot = await this.client
      .collection('organizations')
      .doc(organizationId.toString())
      .get()

    const onboardingInfo = snapshot.data()?.onboarding_info

    if (!onboardingInfo) throw new ApiError(404, 'Data not found')

    return onboardingInfo
  }

  public async update(
    user: string,
    organizationId: string,
    onboardingInfo: string
  ): Promise<void> {
    const { data } = await client.query({
      query: GetOrganizationDocument,
      variables: {
        id: organizationId
      }
    })

    if (!data?.organization)
      throw new ApiError(404, 'Organization does not exist')

    if (
      !data.organization.approvers.includes(user) &&
      !data.organization.signers.includes(user)
    )
      throw new ApiError(403, 'User is not an approver or signer')

    const docRef = this.client
      .collection('organizations')
      .doc(organizationId.toString())

    await docRef.set(
      {
        onboarding_info: onboardingInfo
      },
      { merge: true }
    )

    return
  }
}
