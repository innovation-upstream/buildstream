import { GetTaskDocument } from 'graphclient'
import client from 'graphclient/client'
import { ApiError } from 'next/dist/server/api-utils'

export default class TaskApprovalService {
  private client: FirebaseFirestore.Firestore

  constructor(_client: FirebaseFirestore.Firestore) {
    this.client = _client
  }

  public async getAllDenials(taskId: string): Promise<any[]> {
    const snapshot = await this.client
      .collection('tasks')
      .doc(taskId.toString())
      .collection('taskDenials')
      .get()

    const denials = snapshot.docs.map((doc) => doc.data())

    return denials
  }

  public async denyAssignee(
    user: string,
    taskId: string,
    assignee: string,
    message: string
  ): Promise<void> {
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
      .collection('taskDenials')
      .doc(assignee.toString())

    await docRef.set(
      {
        assignee,
        message
      },
      { merge: true }
    )

    return
  }
}
