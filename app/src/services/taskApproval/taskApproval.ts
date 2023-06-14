
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
    taskId: string,
    assignee: string,
    message: string
  ): Promise<void> {
    const docRef = this.client
      .collection('tasks')
      .doc(taskId.toString())
      .collection('taskDenials')
      .doc(assignee)

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
