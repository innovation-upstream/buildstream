import { GetTaskDocument } from 'graphclient'
import client from 'graphclient/client'
import { ApiError } from 'next/dist/server/api-utils'

export default class RevisionService {
  private client: FirebaseFirestore.Firestore

  constructor(_client: FirebaseFirestore.Firestore) {
    this.client = _client
  }

  public async getAll(taskId: string): Promise<any[]> {
    const snapshot = await this.client
      .collection('tasks')
      .doc(taskId.toString())
      .collection('revisions')
      .get()

    const revisions = snapshot.docs.map((doc) => doc.data())

    return revisions
  }

  public async get(taskId: string, revisionId: string): Promise<any> {
    const snapshot = await this.client
      .collection('tasks')
      .doc(taskId.toString())
      .collection('revisions')
      .doc(revisionId)
      .get()

    const revision = snapshot.data()

    if (!revision) throw new ApiError(404, 'Data not found')

    return revision
  }

  public async create(
    user: string,
    id: string,
    taskId: string,
    revisionId: string,
    message: string
  ): Promise<string> {
    const { data } = await client.query({
      query: GetTaskDocument,
      variables: {
        id: taskId
      }
    })

    if (!data?.task) throw new ApiError(404, 'Task does not exist')

    if (
      !data.task.orgId.approvers.includes(user) &&
      !data.task.orgId.signers.includes(user)
    )
      throw new ApiError(403, 'User is not an approver or signer')

    const docRef = this.client
      .collection('tasks')
      .doc(taskId.toString())
      .collection('revisions')
      .doc(revisionId)

    await docRef.set(
      {
        id,
        revisionId,
        message
      },
      { merge: true }
    )

    return revisionId
  }
}
