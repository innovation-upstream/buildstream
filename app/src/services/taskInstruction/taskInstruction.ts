import { ApiError } from 'next/dist/server/api-utils'

export default class TaskInstruction {
  private client: FirebaseFirestore.Firestore

  constructor(_client: FirebaseFirestore.Firestore) {
    this.client = _client
  }

  public async get(organizationId: string, taskId: string): Promise<string> {
    const snapshot = await this.client
      .collection('organizations')
      .doc(organizationId.toString())
      .collection('tasks')
      .doc(taskId.toString())
      .get()

    const taskInstruction = snapshot.data()?.taskInstruction

    if (!taskInstruction) throw new ApiError(404, 'Data not found')

    return taskInstruction
  }

  public async set(
    organizationId: string,
    taskId: string,
    taskInstruction: string
  ): Promise<void> {
    const docRef = this.client
      .collection('organizations')
      .doc(organizationId.toString())
      .collection('tasks')
      .doc(taskId.toString())

    await docRef.set(
      {
        taskInstruction
      },
      { merge: true }
    )

    return
  }
}
