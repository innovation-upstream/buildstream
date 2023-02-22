import axios from 'axios'
import { Request, Response } from 'express'
import { ClickupRoutes } from '../../routes/routes'
import FirestoreClient from '../../clients/firestore'

export const getToken = async (req: Request, res: Response) => {
  const { client_id, client_secret, code, organizationId } = req.body
  const query = new URLSearchParams({
    client_id: client_id,
    client_secret: client_secret,
    code: code
  }).toString()

  try {
    const { data } = await axios({
      url: `${ClickupRoutes.baseApiUrl}oauth/token?${query}`,
      method: 'post'
    })

    const docRef =
      FirestoreClient.collection('organizations').doc(organizationId)

    await docRef.set({
      clickup_token: data.access_token
    }, { merge: true })

    res.json(data)
  } catch (err) {
    res.send(err)
  }
}

export const getSpaces = async (req: Request, res: Response) => {
  const { token } = req.body

  axios({
    method: 'get',
    url: `${ClickupRoutes.baseApiUrl}team`,
    headers: {
      'Content-Type': 'application-json',
      Authorization: token
    }
  }).then((result) => {
    const teams = result.data.teams[0]
    const teams_id = teams.id

    const space_query = new URLSearchParams({ archived: 'false' }).toString()
    axios({
      method: 'get',
      url: `${ClickupRoutes.baseApiUrl}team/${teams_id}/space?${space_query}`,
      headers: {
        'Content-Type': 'application-json',
        Authorization: token
      }
    }).then((spaces) => {
      res.json(spaces.data)
    })
  })
}

export const getTasks = async (req: Request, res: Response) => {
  const folderlessTasks = await getFolderlessTasks(req, res)
  const folderTasks = await getFolderTasks(req, res)

  const data = await Promise.all([folderlessTasks, folderTasks]).catch((e) => {
    throw e
  })
  return res.json(data.flat())
}

export const getFolderlessTasks = async (
  req: Request,
  res: Response
): Promise<any[]> => {
  const query = new URLSearchParams({ archived: 'false' }).toString()
  const { space_id, token } = req.body

  return axios({
    method: 'get',
    url: `${ClickupRoutes.baseApiUrl}space/${space_id}/list?${query}`,
    headers: {
      'Content-Type': 'application-json',
      Authorization: token
    }
  })
    .then(async (result) => {
      const list: any[] = await result.data.lists
      const task_query = new URLSearchParams({
        archived: 'false'
      }).toString()

      try {
        const resData: any[] = await Promise.all(
          list.map(async (list: any) => {
            return await axios({
              method: 'get',
              url: `${ClickupRoutes.baseApiUrl}list/${list.id}/task?${query}`,
              headers: {
                'Content-Type': 'application-json',
                Authorization: token
              }
            })
          })
        )
        const data = await Promise.all(
          resData.map(async (r) => await r.data.tasks)
        )

        return data.flat()
      } catch (err) {
        throw err
      }
    })
    .catch((err) => {
      throw err
    })
}

export const getFolderTasks = async (
  req: Request,
  res: Response
): Promise<any[]> => {
  const query = new URLSearchParams({ archived: 'false' }).toString()
  const { space_id, token } = req.body

  return axios({
    method: 'get',
    url: `${ClickupRoutes.baseApiUrl}space/${space_id}/folder?${query}`,
    headers: {
      'Content-Type': 'application-json',
      Authorization: token
    }
  })
    .then(async (response) => {
      const { folders } = response.data

      const lists = folders.map((folder: any) => {
        return folder.lists
      })
      const folderLists = lists.flat()

      try {
        const resData: any[] = await Promise.all(
          await folderLists.map(async (list: any) => {
            return await axios({
              method: 'get',
              url: `${ClickupRoutes.baseApiUrl}list/${list.id}/task?${query}`,
              headers: {
                'Content-Type': 'application-json',
                Authorization: token
              }
            })
          })
        )
        const data = await Promise.all(
          resData.map(async (r) => await r.data.tasks)
        )

        return data.flat()
      } catch (err) {
        throw err
      }
    })
    .catch((err) => {
      throw err
    })
}

export const getTask = async (req: Request, res: Response) => {
  const { task_id, organizationId } = req.body
  const snapshot = await FirestoreClient.collection('organizations')
    .doc(organizationId)
    .get()
  const token = snapshot.data()?.clickup_token

  if (!token)
    return res.status(401).send({ code: 401, message: 'Unauthorized' })

  try {
    const task = await axios({
      method: 'get',
      url: `${ClickupRoutes.baseApiUrl}task/${task_id}`,
      headers: {
        'Content-Type': 'application-json',
        Authorization: token
      }
    })
    res.json(task.data)
  } catch (err: any) {
    console.error(err)
    res.status(401).send({ code: err.status, message: err.message })
  }
}
