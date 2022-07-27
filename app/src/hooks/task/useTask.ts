import { useWeb3React } from '@web3-react/core'
import {
  getOrganizationCount,
  getOrganizationIds,
} from 'hooks/organization/functions'
import { useEffect, useState } from 'react'
import { getTask, getTaskCount, getTaskIds } from './functions'
import { Task } from './types'

export const useTasks = (initialState: Task[] = []) => {
  const [tasks, setTasks] = useState<Task[]>(initialState)
  const { library } = useWeb3React()

  const refetchTasks = async () => {
    const orgCount = await getOrganizationCount(library)
    const orgIds = await getOrganizationIds(0, orgCount, library)

    const allTasks = await Promise.all(
      orgIds.map(async (orgId) => {
        const taskCount = await getTaskCount(orgId, true, true)
        const ids = await getTaskIds(0, taskCount, library)

        const ts = await Promise.all(
          ids.map(async (taskId): Promise<Task> => {
            return await getTask(taskId, library)
          })
        )
        return ts
      })
    )
    const res = allTasks.flat()
    setTasks(res)
  }
  useEffect(() => {
    refetchTasks()
  }, [])
  return { tasks, refetchTasks }
}
