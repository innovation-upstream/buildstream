import { GetTaskDocument } from 'graphclient'
import client from 'graphclient/client'
import { ApiError } from 'next/dist/server/api-utils'

export default class TaskInstruction {
  private client: FirebaseFirestore.Firestore

  constructor(_client: FirebaseFirestore.Firestore) {
    this.client = _client
  }

  public async get(taskId: string): Promise<string> {
    const snapshot = await this.client
      .collection('tasks')
      .doc(taskId.toString())
      .get()

    const taskInstruction = snapshot.data()?.taskInstruction

    if (!taskInstruction) throw new ApiError(404, 'Data not found')

    return taskInstruction
  }

  public async update(
    user: string,
    taskId: string,
    taskInstruction: string
  ): Promise<void> {
    const snapshot = await this.client
      .collection('tasks')
      .doc(taskId.toString())
      .get()

    const savedInstructions = snapshot.data()?.taskInstruction

    if (!!savedInstructions) {
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
        throw new ApiError(
          403,
          'Only an approver or signer can update instructions'
        )
    }

    const docRef = this.client.collection('tasks').doc(taskId.toString())

    await docRef.set(
      {
        taskInstruction
      },
      { merge: true }
    )

    return
  }
}
