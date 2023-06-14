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
    id: string,
    taskId: string,
    revisionId: string,
    message: string
  ): Promise<string> {
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
