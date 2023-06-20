import { authMiddleware } from 'middleware/auth'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ApiError } from 'next/dist/server/api-utils'
import { TaskApprovalService } from 'services'
import FirestoreClient from '../../../../clients/db/firestore'

async function getDenials(req: NextApiRequest, res: NextApiResponse) {
  const taskId = req.query.task as string
  const taskApprovalService = new TaskApprovalService(FirestoreClient)

  try {
    const revision = await taskApprovalService.getAllDenials(taskId)
    res.json(revision)
  } catch (err: any) {
    console.error(err)
    if (err instanceof ApiError)
      return res.status(err.statusCode).send({ message: err.message })
    res.status(500).send({ message: 'Server error' })
  }
}

async function denyAssignee(req: NextApiRequest, res: NextApiResponse) {
  const taskId = req.query.task as string
  const taskApprovalService = new TaskApprovalService(FirestoreClient)
  const { assignee, message } = req.body

  if (!assignee)
    return res.status(400).send({ message: 'Assignee is required' })

  try {
    await taskApprovalService.denyAssignee(taskId, assignee, message)
    res.status(200).send({ message: 'Assignee denied' })
  } catch (err: any) {
    console.error(err)
    if (err instanceof ApiError)
      return res.status(err.statusCode).send({ message: err.message })
    res.status(500).send({ message: 'Server error' })
  }
}

export default async function denyTask(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      return getDenials(req, res)
    case 'POST':
      return authMiddleware(req, res, denyAssignee)
    default:
      return res.status(405).send({ code: 405, message: 'Method not allowed' })
  }
}
