import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'
import { getAction, getActionCount, getActionIds } from './functions'
import { Action } from './types'

const useActions = (initialState: Action[] = []) => {
  const [actions, setActions] = useState<Action[]>(initialState)
  const { library } = useWeb3React()

  const refetchActions = async () => {
    const actionCount = await getActionCount(library)
    const actionIds = await getActionIds(0, actionCount, library)
    const actions = await Promise.all(
      actionIds.map(async (actionId): Promise<Action> => {
        const action = await getAction(actionId, library)
        return action
      })
    )

    setActions(actions)
  }

  useEffect(() => {
    refetchActions()
  }, [])

  return {
    actions,
    refetchActions
  }
}

export default useActions
