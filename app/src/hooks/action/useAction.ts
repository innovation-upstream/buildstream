import { useAppSelector } from 'hooks'
import { RootState } from 'state/store'

const useActions = () => {
  const { count, data, page, confirmers } = useAppSelector(
    (state: RootState) => state.actions
  )
  return {
    count,
    page,
    confirmers,
    actions: data
  }
}

export default useActions
