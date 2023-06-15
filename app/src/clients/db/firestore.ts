import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const SERVICE_ACCOUNT_KEY = process.env.SERVICE_ACCOUNT_KEY

const serviceAccount = SERVICE_ACCOUNT_KEY
  ? JSON.parse(SERVICE_ACCOUNT_KEY)
  : null

let db: FirebaseFirestore.Firestore

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount)
  })
  db = getFirestore()
  db.settings({ ignoreUndefinedProperties: true })
} else db = getFirestore()

export default db
