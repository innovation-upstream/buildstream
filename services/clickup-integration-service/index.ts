import { json } from 'body-parser'
import cors from 'cors'
import express, { Express, NextFunction, Request, Response } from 'express'
import {
  getSpaces,
  getToken,
  getTasks,
  getTask
} from './functions/route-actions/functions'
import { ClickupRoutes } from './routes/routes'

const app: Express = express()

app.use(json())
app.use(function (req: Request, res: Response, next: NextFunction) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})
app.use(cors())

app.post(`${ClickupRoutes.getToken}`, async (req: Request, res: Response) => {
  await getToken(req, res)
})

app.post(`${ClickupRoutes.spaces}`, async (req: Request, res: Response) => {
  await getSpaces(req, res)
})

app.post(`${ClickupRoutes.tasks}`, async (req: Request, res: Response) => {
  await getTasks(req, res)
})

app.post(`${ClickupRoutes.task}`, async (req: Request, res: Response) => {
  await getTask(req, res)
})

app.listen(3300, () => {
  console.log(`App listening on port 3300`)
})
