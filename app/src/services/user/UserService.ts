import { User, UserWithoutId } from 'models/User/User'
import { ApiError } from 'next/dist/server/api-utils'

export default class UserService {
  private client: FirebaseFirestore.Firestore

  constructor(_client: FirebaseFirestore.Firestore) {
    this.client = _client
  }

  public async getAll(): Promise<User[]> {
    const snapshot = await this.client.collection('users').get()
    const usersData = snapshot.docs.map((doc) => doc.data())

    const users = usersData.map((user) => ({
      id: user.id,
      displayName: user.displayName
    }))

    return users
  }

  public async get(id: string): Promise<User> {
    const snapshot = await this.client.collection('users').doc(id).get()
    const userData = snapshot.data()

    if (!userData) throw new ApiError(404, 'Data not found')

    const user = {
      id: userData.id,
      displayName: userData.displayName
    }

    return user
  }

  public async createOrUpdate(
    id: string,
    user: UserWithoutId
  ): Promise<string> {
    const { displayName } = user

    await this.client.collection('users').doc(id).set({
      id,
      displayName
    }, { merge: true })

    return id
  }
}
