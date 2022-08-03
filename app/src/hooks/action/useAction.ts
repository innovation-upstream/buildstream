import { useAppDispatch, useAppSelector } from 'hooks'
import {
  updateActions,
  updateConfirmers,
  updateCount
} from 'state/action/slice'
import { RootState } from 'state/store'
import { fetchActionCount, fetchActions, fetchConfirmers } from './functions'

const useActions = () => {
  const { count, data, page, confirmers } = useAppSelector(
    (state: RootState) => state.actions
  )
  const dispatch = useAppDispatch()

  const refetchActions = async (orgId: number, from?: number, to?: number) => {
    let fromValue = from
    let toValue = to
    try {
      if (fromValue === undefined || toValue === undefined) {
        toValue = await fetchActionCount(orgId)
        fromValue = Math.max(0, toValue - 15)
      }
      const actions = await fetchActions(orgId, fromValue, toValue)
      const confirmers = await Promise.all(
        actions.map(async (action) => {
          const c = await fetchConfirmers(action.id)
          return {
            actionId: action.id,
            confirmers: c
          }
        })
      )
      dispatch(updateCount(actions.length))
      dispatch(
        updateActions({
          data: actions.map((action) => ({
            ...action,
            value: action.value.toString() as any
          })),
          page: { from: fromValue, to: toValue }
        })
      )
      dispatch(updateConfirmers(confirmers))
    } catch (e) {
      console.error(e)
    }
  }

  return {
    count,
    page,
    confirmers,
    refetchActions,
    actions: data
  }
}

export default useActions
