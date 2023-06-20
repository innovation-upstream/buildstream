import { authMiddleware } from 'middleware/auth'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ApiError } from 'next/dist/server/api-utils'
import { RevisionService } from 'services'
import FirestoreClient from '../../../../../clients/db/firestore'

async function getRevisions(req: NextApiRequest, res: NextApiResponse) {
  const taskId = req.query.task as string
  const revisionService = new RevisionService(FirestoreClient)

  try {
    const revision = await revisionService.getAll(taskId)
    res.json(revision)
  } catch (err: any) {
    console.error(err)
    if (err instanceof ApiError)
      return res.status(err.statusCode).send({ message: err.message })
    res.status(500).send({ message: 'Server error' })
  }
}

async function createRevision(req: NextApiRequest, res: NextApiResponse) {
  const taskId = req.query.task as string
  const revisionService = new RevisionService(FirestoreClient)
  const { id, revisionId, message } = req.body

  if (!message)
    return res.status(400).send({ message: 'Message required' })

  try {
    const revision = await revisionService.create(id, taskId, revisionId, message)
    res.status(200).send({ revision })
  } catch (err: any) {
    console.error(err)
    if (err instanceof ApiError)
      return res.status(err.statusCode).send({ message: err.message })
    res.status(500).send({ message: 'Server error' })
  }
}

export default async function taskInstructions(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      return getRevisions(req, res)
    case 'POST':
      return authMiddleware(req, res, createRevision)
    default:
      return res.status(405).send({ code: 405, message: 'Method not allowed' })
  }
}
