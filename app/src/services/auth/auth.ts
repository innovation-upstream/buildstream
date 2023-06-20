import { ethers } from 'ethers'
import { hashMessage } from 'ethers/lib/utils'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { ApiError } from 'next/dist/server/api-utils'

const JWT_SECRET = process.env.JWT_SECRET

export default class AuthService {
  private client: FirebaseFirestore.Firestore

  constructor(_client: FirebaseFirestore.Firestore) {
    this.client = _client
  }

  public async authenticate(address: string, message: string): Promise<string> {
    const snapshot = await this.client
      .collection('auth')
      .doc(address.toLowerCase())
      .get()

    const otp = snapshot.data()?.otp

    if (!JWT_SECRET) throw new ApiError(500, 'JWT_SECRET is not defined')

    if (!otp)
      throw new ApiError(
        403,
        'You have not initiated the authentication process'
      )

    const signer = ethers.utils.recoverAddress(hashMessage(otp), message)
    if (signer.toLowerCase() !== address.toLowerCase())
      throw new ApiError(403, 'Invalid signature')

    const token = jwt.sign({ sub: signer.toLowerCase() }, JWT_SECRET, {
      expiresIn: '7d'
    })

    snapshot.ref.set(
      {
        otp: null
      },
      { merge: true }
    )

    return token
  }

  public async initiate(address: string): Promise<string> {
    const docRef = this.client.collection('auth').doc(address.toLowerCase())

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    await docRef.set({
      otp
    })

    return otp
  }

  public async verify(address: string, token: string): Promise<boolean> {
    if (!JWT_SECRET) throw new ApiError(500, 'JWT_SECRET is not defined')

    console.log('======== token', token)

    const claims = jwt.verify(token, JWT_SECRET) as JwtPayload
    if (claims.sub?.toLowerCase() !== address.toLowerCase()) return false
    return true
  }
}
