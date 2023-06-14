import type { NextApiRequest, NextApiResponse } from 'next'
import { ApiError } from 'next/dist/server/api-utils'
import { RevisionService } from 'services'
import FirestoreClient from '../../../../../clients/db/firestore'

async function getRevision(req: NextApiRequest, res: NextApiResponse) {
  const taskId = req.query.task as string
  const revisionId = req.query.revision as string
  const revisionService = new RevisionService(FirestoreClient)

  try {
    const revision = await revisionService.get(taskId, revisionId)
    res.json(revision)
  } catch (err: any) {
    console.error(err)
    if (err instanceof ApiError)
      return res.status(err.statusCode).send({ message: err.message })
    res.status(500).send({ message: 'Server error' })
  }
}

export default async function revision(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      return getRevision(req, res)
    default:
      return res.status(405).send({ code: 405, message: 'Method not allowed' })
  }
}
