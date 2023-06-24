import { authMiddleware } from 'middleware/auth'
import { NextApiRequestWithUser } from 'middleware/auth/auth'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ApiError } from 'next/dist/server/api-utils'
import { TaskInstruction } from 'services'
import FirestoreClient from '../../../../clients/db/firestore'

async function getTaskInstructions(req: NextApiRequest, res: NextApiResponse) {
  const taskId = req.query.task as string
  const taskInstructionService = new TaskInstruction(FirestoreClient)

  try {
    const instructions = await taskInstructionService.get(taskId)
    res.json({ instructions })
  } catch (err: any) {
    console.error(err)
    if (err instanceof ApiError)
      return res.status(err.statusCode).send({ message: err.message })
    res.status(500).send({ message: 'Server error' })
  }
}

async function updateTaskInstructions(req: NextApiRequestWithUser, res: NextApiResponse) {
  const taskId = req.query.task as string
  const taskInstructionService = new TaskInstruction(FirestoreClient)
  const { instructions } = req.body

  try {
    await taskInstructionService.update(req.user, taskId, instructions)
    res.status(200).send({ message: 'Instructions updated' })
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
      return getTaskInstructions(req, res)
    case 'POST':
      return authMiddleware(req, res, updateTaskInstructions)
    default:
      return res.status(405).send({ code: 405, message: 'Method not allowed' })
  }
}
